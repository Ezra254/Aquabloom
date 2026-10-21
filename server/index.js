import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Inquiry } from './models/Inquiry.js';
import { isMailConfigured, sendInquiryEmail } from './mail.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI || '';

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
  })
);
app.use(express.json({ limit: '32kb' }));

const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many enquiries from this network. Please try again shortly.' },
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTERESTS = new Set(['fingerlings', 'services', 'partnership', 'training', 'other']);

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    email: isMailConfigured() ? 'configured' : 'missing',
  });
});

app.post('/api/inquiries', inquiryLimiter, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'The enquiry service is temporarily unavailable. Please try again later.',
      });
    }

    const { name, email, phone = '', interest, message, companyWebsite } = req.body ?? {};

    if (typeof companyWebsite === 'string' && companyWebsite.trim()) {
      return res.status(200).json({ ok: true });
    }

    const cleaned = {
      name: String(name ?? '').trim(),
      email: String(email ?? '').trim().toLowerCase(),
      phone: String(phone ?? '').trim(),
      interest: String(interest ?? '').trim(),
      message: String(message ?? '').trim(),
    };

    if (cleaned.name.length < 2 || cleaned.name.length > 120) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }
    if (!EMAIL_PATTERN.test(cleaned.email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (cleaned.phone.length > 40) {
      return res.status(400).json({ error: 'Please enter a shorter phone number.' });
    }
    if (!INTERESTS.has(cleaned.interest)) {
      return res.status(400).json({ error: 'Please choose a valid enquiry type.' });
    }
    if (cleaned.message.length < 10 || cleaned.message.length > 4000) {
      return res.status(400).json({ error: 'Please include a message of at least 10 characters.' });
    }

    if (!isMailConfigured()) {
      return res.status(503).json({
        error:
          'The enquiry form cannot email the team yet. Add a Gmail app password to the server configuration.',
      });
    }

    await Inquiry.create(cleaned);

    try {
      await sendInquiryEmail(cleaned);
    } catch (error) {
      console.error('Failed to email inquiry', error);
      const authFailed = error.code === 'EAUTH' || error.responseCode === 535;
      return res.status(502).json({
        error: authFailed
          ? 'Gmail rejected the mailbox login. In server/.env, set SMTP_PASS to a 16-character App Password, not the usual Gmail password.'
          : 'Your enquiry was saved, but the email to Aquabloom could not be sent. Please try again or call 0707 955 894.',
      });
    }

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Failed to save inquiry', error);
    return res.status(500).json({ error: 'Unable to send your enquiry right now.' });
  }
});

async function start() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing. Add it to server/.env or a root .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Aquabloom API listening on http://localhost:${PORT}`);
  });
}

start();
