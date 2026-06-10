import nodemailer from 'nodemailer';
import logger from '../config/logger';

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || user;

let transporter: nodemailer.Transporter | null = null;

function createTransporter() {
  if (transporter) return transporter;
  if (!host || !port || !user || !pass) {
    logger.warn('[mailer] SMTP configuration incomplete, falling back to dev jsonTransport (emails will be saved locally)');
    // create a dev transporter that doesn't send but serializes the message
    transporter = nodemailer.createTransport({ jsonTransport: true });
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass
    }
  });

  return transporter;
}

export async function sendMail(to: string, subject: string, text: string, html?: string) {
  const t = createTransporter();
  if (!t) {
    logger.warn('[mailer] transporter not configured, skipping sendMail');
    return;
  }
  try {
    const info = await t.sendMail({
      from: from || undefined,
      to,
      subject,
      text,
      html
    });
    logger.info(`[mailer] Email sent to ${to} subject="${subject}"`);
  } catch (err: any) {
    logger.error('[mailer] error sending email', err?.message || err);
    throw err;
  }
}
