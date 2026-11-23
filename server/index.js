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
app.set('trust proxy', 1);
const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

// Always allow the production client domain and standard local dev ports
const defaultClientOrigins = [
  'https://aquabloom-teal.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];
for (const origin of defaultClientOrigins) {
  if (!allowedOrigins.includes(origin)) {
    allowedOrigins.push(origin);
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.length === 0 || allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }
      callback(null, false);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  })
);
app.use(express.json({ limit: '32kb' }));

const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { error: 'Too many enquiries from this network. Please try again shortly.' },
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTERESTS = new Set(['fingerlings', 'services', 'partnership', 'training', 'other']);

app.get('/', (_req, res) => {
  res.json({
    status: 'online',
    message: 'Aquabloom API is running',
    endpoints: {
      health: '/api/health',
      inquiries: '/api/inquiries [POST]',
    },
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    email: isMailConfigured() ? 'configured' : 'missing',
  });
});

app.post('/api/inquiries', inquiryLimiter, async (req, res) => {
  try {
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

    if (mongoose.connection.readyState === 1) {
      try {
        await Inquiry.create(cleaned);
      } catch (error) {
        console.error('Failed to save inquiry', error);
      }
    } else {
      console.warn('MongoDB is not connected. The enquiry will be emailed only.');
    }

    try {
      await sendInquiryEmail(cleaned);
    } catch (error) {
      console.error('Failed to email inquiry', error);
      const authFailed = error.code === 'EAUTH' || error.responseCode === 535;
      const timeout = error.code === 'ETIMEDOUT' || error.command === 'CONN' || (typeof error.message === 'string' && error.message.includes('timeout'));
      let errorMessage = 'The email to Aquabloom could not be sent. Please try again or call 0707 955 894.';
      if (authFailed) {
        errorMessage = 'Gmail rejected the mailbox login. Set SMTP_PASS to a 16-character App Password, not the usual Gmail password.';
      } else if (timeout) {
        errorMessage = 'Email connection timed out. Free cloud hosts (like Render) block SMTP ports (25/465/587). Please configure RESEND_API_KEY in Render environment variables.';
      }
      return res.status(502).json({ error: errorMessage });
    }

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Failed to save inquiry', error);
    return res.status(500).json({ error: 'Unable to send your enquiry right now.' });
  }
});

async function start() {
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI is not set. Starting without a database.');
  } else {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection failed. Starting without a database.', error);
    }
  }

  app.listen(PORT, () => {
    console.log(`Aquabloom API listening on port ${PORT}`);
  });
}

start();
