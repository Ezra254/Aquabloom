import nodemailer from 'nodemailer';

const INTEREST_LABELS = {
  fingerlings: 'Fingerlings',
  services: 'Consultancy and services',
  training: 'Training',
  partnership: 'Partnership',
  other: 'Other',
};

export function isMailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: String(process.env.SMTP_PORT) === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendInquiryEmail(inquiry) {
  const to = process.env.INQUIRY_TO || process.env.SMTP_USER;
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

  await transporter().sendMail({
    from: `"Aquabloom website" <${process.env.SMTP_USER}>`,
    to,
    replyTo: inquiry.email,
    subject: `New Aquabloom enquiry from ${inquiry.name}`,
    text,
    html: `
      <p><strong>New website enquiry</strong></p>
      <p>
        <strong>Name:</strong> ${escapeHtml(inquiry.name)}<br />
        <strong>Email:</strong> ${escapeHtml(inquiry.email)}<br />
        <strong>Phone:</strong> ${escapeHtml(phone)}<br />
        <strong>Interest:</strong> ${escapeHtml(interest)}
      </p>
      <p>${escapeHtml(inquiry.message).replace(/\n/g, '<br />')}</p>
    `,
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
