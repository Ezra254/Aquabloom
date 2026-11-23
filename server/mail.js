import nodemailer from 'nodemailer';

const INTEREST_LABELS = {
  fingerlings: 'Fingerlings',
  services: 'Consultancy and services',
  training: 'Training',
  partnership: 'Partnership',
  other: 'Other',
};

export function isMailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY ||
    process.env.BREVO_API_KEY ||
    (process.env.SMTP_USER && process.env.SMTP_PASS)
  );
}

function transporter() {
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
  const port = Number(process.env.SMTP_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass,
    },
    connectionTimeout: 10000, // 10s fail-fast if SMTP port is blocked
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

async function sendViaResend({ to, replyTo, subject, text, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || 'Aquabloom Website <onboarding@resend.dev>';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorBody}`);
  }
}

async function sendViaBrevo({ to, replyTo, subject, text, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER || process.env.SMTP_USER || to;

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Aquabloom Website', email: senderEmail },
      to: [{ email: to }],
      replyTo: { email: replyTo },
      subject,
      textContent: text,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${errorBody}`);
  }
}

export async function sendInquiryEmail(inquiry) {
  const to = process.env.INQUIRY_TO || process.env.SMTP_USER;
  if (!to) {
    throw new Error('No recipient email configured. Set INQUIRY_TO or SMTP_USER.');
  }

  const interest = INTEREST_LABELS[inquiry.interest] || inquiry.interest;
  const phone = inquiry.phone || 'Not provided';

  const text = [
    `New website enquiry`,
    ``,
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone: ${phone}`,
    `Interest: ${interest}`,
    ``,
    inquiry.message,
  ].join('\n');

  const html = `
    <p><strong>New website enquiry</strong></p>
    <p>
      <strong>Name:</strong> ${escapeHtml(inquiry.name)}<br />
      <strong>Email:</strong> ${escapeHtml(inquiry.email)}<br />
      <strong>Phone:</strong> ${escapeHtml(phone)}<br />
      <strong>Interest:</strong> ${escapeHtml(interest)}
    </p>
    <p>${escapeHtml(inquiry.message).replace(/\n/g, '<br />')}</p>
  `;

  const subject = `New Aquabloom enquiry from ${inquiry.name}`;

  // 1. Prefer HTTP-based APIs (Resend, Brevo) because cloud free tiers (Render, Vercel) block SMTP ports (25, 465, 587)
  if (process.env.RESEND_API_KEY) {
    return await sendViaResend({ to, replyTo: inquiry.email, subject, text, html });
  }

  if (process.env.BREVO_API_KEY) {
    return await sendViaBrevo({ to, replyTo: inquiry.email, subject, text, html });
  }

  // 2. Fall back to SMTP (works locally, on paid Render tiers, or VPS)
  await transporter().sendMail({
    from: `"Aquabloom website" <${process.env.SMTP_USER}>`,
    to,
    replyTo: inquiry.email,
    subject,
    text,
    html,
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
