'use strict';

/**
 * email.js — RoktoDanBD Email Automation
 *
 * Features
 * ────────
 * • Auto-selects Gmail or generic SMTP from env vars
 * • Per-message retry with exponential back-off
 * • Batched delivery to avoid Gmail rate limits
 * • HTML templates with inline plain-text fallback
 * • XSS-safe template helpers
 * • Lazy transporter (fails fast only when email is actually used)
 */

const nodemailer = require('nodemailer');

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const BATCH_SIZE      = 10;   // emails per batch
const BATCH_DELAY_MS  = 1200; // pause between batches (stays under Gmail's ~8/s)
const MAX_RETRIES     = 3;
const RETRY_BASE_MS   = 500;  // first retry after 500 ms, then 1 s, 2 s …

const URGENCY_LABEL = {
  critical : '🔴 জরুরি',
  urgent   : '🟠 অত্যন্ত জরুরি',
  normal   : '🟡 সাধারণ',
};

const APP_URL     = process.env.APP_URL || 'https://roktodanbd.netlify.app';
const FROM_NAME   = process.env.EMAIL_FROM_NAME || 'রক্তদান বাংলাদেশ';
const FROM_EMAIL  = process.env.EMAIL_USER || process.env.SMTP_USER;

// ── TRANSPORTER (lazy) ────────────────────────────────────────────────────────

let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;

  const hasGmail = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;
  const hasSmtp  = process.env.SMTP_HOST  && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (!hasGmail && !hasSmtp) {
    return null; // caller decides whether to warn/error
  }

  _transporter = hasGmail
    ? nodemailer.createTransport({
        service : 'gmail',
        auth    : { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
      })
    : nodemailer.createTransport({
        host   : process.env.SMTP_HOST,
        port   : Number(process.env.SMTP_PORT) || 587,
        secure : Number(process.env.SMTP_PORT) === 465,
        auth   : { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

  return _transporter;
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

/** Strips HTML tags to produce a plain-text fallback. */
function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|div|tr)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Escapes user-supplied strings for safe HTML interpolation. */
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Resolves after `ms` milliseconds. */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── CORE SEND (with retry) ────────────────────────────────────────────────────

/**
 * Sends one email, retrying up to MAX_RETRIES times on transient errors.
 *
 * @param {string} to       Recipient address
 * @param {string} subject  Email subject
 * @param {string} html     HTML body (plain-text is auto-derived)
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
async function sendEmail(to, subject, html) {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(`⚠️  Email skipped (${to}): no credentials configured`);
    return { success: false, error: 'Email credentials not configured' };
  }

  const message = {
    from    : `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
    text    : stripHtml(html),
  };

  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const info = await transporter.sendMail(message);
      console.log(`✅ Email sent → ${to} (${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      lastError = err;
      const isTransient = /ECONNRESET|ETIMEDOUT|ENOTFOUND|EHOSTUNREACH|421|450|451|452/.test(
        err.message + (err.code ?? '')
      );

      if (!isTransient || attempt === MAX_RETRIES) break;

      const delay = RETRY_BASE_MS * 2 ** (attempt - 1);
      console.warn(`⚠️  Email to ${to} failed (attempt ${attempt}/${MAX_RETRIES}), retrying in ${delay}ms…`);
      await sleep(delay);
    }
  }

  console.error(`❌ Email failed → ${to}: ${lastError.message}`);
  return { success: false, error: lastError.message };
}

// ── BATCH NOTIFY ──────────────────────────────────────────────────────────────

/**
 * Sends blood-request alert emails to a list of donors in batches.
 *
 * @param {{
 *   requesterName: string,
 *   phone:         string,
 *   bloodGroup:    string,
 *   hospital:      string,
 *   district:      string,
 *   urgency?:      'normal'|'urgent'|'critical'
 * }} requestData
 * @param {Array<{name: string, email: string}>} donors
 * @returns {Promise<{sent: number, failed: number, total: number}>}
 */
async function notifyDonors(requestData, donors) {
  if (!donors?.length) {
    console.log('ℹ️  notifyDonors: no recipients');
    return { sent: 0, failed: 0, total: 0 };
  }

  const { requesterName, phone, bloodGroup, hospital, district, urgency = 'normal' } = requestData;
  const urgencyLabel = URGENCY_LABEL[urgency] ?? URGENCY_LABEL.normal;
  const subject      = `🩸 ${urgencyLabel} — ${bloodGroup} রক্তের প্রয়োজন · ${esc(district)}`;

  console.log(`📧 Notifying ${donors.length} donor(s) — batch size ${BATCH_SIZE}`);

  let sent = 0, failed = 0;

  for (let i = 0; i < donors.length; i += BATCH_SIZE) {
    const batch = donors.slice(i, i + BATCH_SIZE);

    const results = await Promise.all(
      batch.map((donor) =>
        sendEmail(donor.email, subject, buildDonorAlertHtml({ donor, requestData: { requesterName, phone, bloodGroup, hospital, district }, urgencyLabel }))
      )
    );

    results.forEach((r, idx) => {
      if (r.success) {
        sent++;
      } else {
        failed++;
        console.error(`   ✗ ${batch[idx].email}: ${r.error}`);
      }
    });

    // Throttle between batches (skip delay after the last one)
    if (i + BATCH_SIZE < donors.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  console.log(`📊 Done — ${sent} sent, ${failed} failed, ${donors.length} total`);
  return { sent, failed, total: donors.length };
}

// ── EMAIL TEMPLATES ───────────────────────────────────────────────────────────

/**
 * Renders the donor blood-request alert email.
 * All user-supplied values are passed through `esc()`.
 */
function buildDonorAlertHtml({ donor, requestData, urgencyLabel }) {
  const { requesterName, phone, bloodGroup, hospital, district } = requestData;

  return /* html */ `
<!DOCTYPE html>
<html lang="bn" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>জরুরি রক্তের অনুরোধ</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f0f0f0;
      color: #333;
      line-height: 1.7;
    }
    .wrapper  { max-width: 620px; margin: 24px auto; padding: 0 16px; }
    .card     { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.10); }

    /* Header */
    .header   { background: #C62828; color: #fff; padding: 28px 24px; text-align: center; }
    .header .logo { font-size: 44px; display: block; margin-bottom: 8px; }
    .header h1 { font-size: 22px; font-weight: 700; letter-spacing: .5px; }

    /* Body */
    .body     { padding: 28px 28px 20px; }
    .greeting { font-size: 16px; margin-bottom: 16px; }
    .greeting strong { color: #C62828; }

    /* Urgency badge */
    .urgency-badge {
      display: flex; align-items: flex-start; gap: 12px;
      background: #FFF3F3; border: 1px solid #F5C6C6;
      border-left: 4px solid #C62828;
      border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;
    }
    .urgency-badge .icon { font-size: 24px; flex-shrink: 0; }
    .urgency-badge .text { font-size: 15px; }
    .urgency-badge .level { font-weight: 700; font-size: 16px; color: #C62828; }

    /* Details table */
    .details  { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .details tr td { padding: 9px 0; border-bottom: 1px solid #f0f0f0; font-size: 15px; }
    .details tr:last-child td { border-bottom: none; }
    .details .lbl { color: #888; width: 44%; }
    .details .val { font-weight: 600; color: #222; }

    /* Note box */
    .note {
      background: #F8F8F8; border-radius: 8px;
      padding: 14px 16px; font-size: 14px; color: #555;
      margin-bottom: 24px;
    }

    /* CTA */
    .cta-wrap { text-align: center; margin-bottom: 8px; }
    .cta {
      display: inline-block; background: #C62828; color: #fff;
      text-decoration: none; padding: 13px 32px;
      border-radius: 30px; font-size: 15px; font-weight: 700;
      letter-spacing: .4px;
    }

    /* Footer */
    .footer {
      background: #FAFAFA; border-top: 1px solid #EEE;
      padding: 16px 24px; text-align: center;
      font-size: 12px; color: #AAA;
    }
    .footer p + p { margin-top: 4px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">

      <div class="header">
        <span class="logo">🩸</span>
        <h1>রক্তদান বাংলাদেশ — জরুরি রক্তের অনুরোধ</h1>
      </div>

      <div class="body">
        <p class="greeting">
          প্রিয় <strong>${esc(donor.name)}</strong>,<br>
          আপনার এলাকায় <strong>${esc(bloodGroup)}</strong> রক্তের জরুরি প্রয়োজন।
        </p>

        <div class="urgency-badge">
          <div class="icon">🚨</div>
          <div class="text">
            <div class="level">${urgencyLabel}</div>
            <div>এই অনুরোধটি অগ্রাধিকার ভিত্তিতে পাঠানো হচ্ছে।</div>
          </div>
        </div>

        <table class="details" role="presentation">
          <tr>
            <td class="lbl">📋 অনুরোধকারী</td>
            <td class="val">${esc(requesterName)}</td>
          </tr>
          <tr>
            <td class="lbl">📞 যোগাযোগ</td>
            <td class="val">${esc(phone)}</td>
          </tr>
          <tr>
            <td class="lbl">🏥 hospital</td>
            <td class="val">${esc(hospital)}</td>
          </tr>
          <tr>
            <td class="lbl">📍 এলাকা</td>
            <td class="val">${esc(district)}</td>
          </tr>
        </table>

        <div class="note">
          <strong>📝 নোট:</strong> আপনার একটি সিদ্ধান্ত একটি জীবন বাঁচাতে পারে।
          যদি আপনি সাহায্য করতে সক্ষম হন, অনুগ্রহ করে এখনই যোগাযোগ করুন।
        </div>

        <div class="cta-wrap">
          <a href="${APP_URL}/#/donors" class="cta">অ্যাপে যান →</a>
        </div>
      </div>

      <div class="footer">
        <p>এটি একটি স্বয়ংক্রিয় বিজ্ঞপ্তি — অনুগ্রহ করে সরাসরি রিপ্লাই করবেন না।</p>
        <p>© রক্তদান বাংলাদেশ · জীবন বাঁচান</p>
      </div>

    </div>
  </div>
</body>
</html>`.trim();
}

// ── REGISTRATION CONFIRMATION EMAIL ──────────────────────────────────────────

/**
 * Sends a registration submission confirmation to the new donor.
 * @param {{ name: string, email: string, bloodGroup: string }} user
 */
async function sendRegistrationConfirmation(user) {
  if (!user.email) return { success: false, error: 'No email address' };

  const subject = `✅ নিবন্ধন সম্পন্ন — রক্তদান বাংলাদেশ`;
  const html = /* html */`
<!DOCTYPE html><html lang="bn"><head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>নিবন্ধন সম্পন্ন</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f0f0f0;color:#333;line-height:1.7}
    .wrapper{max-width:620px;margin:24px auto;padding:0 16px}
    .card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.10)}
    .header{background:#C62828;color:#fff;padding:28px 24px;text-align:center}
    .header .logo{font-size:44px;display:block;margin-bottom:8px}
    .header h1{font-size:20px;font-weight:700}
    .body{padding:28px 28px 20px}
    .badge{display:inline-block;background:#E8F5E9;color:#2E7D32;border:1px solid #A5D6A7;border-radius:20px;padding:4px 16px;font-weight:700;font-size:14px;margin-bottom:16px}
    .info-box{background:#FFF3E0;border-left:4px solid #FB8C00;border-radius:8px;padding:14px 16px;margin:16px 0;font-size:14px;color:#555}
    .cta-wrap{text-align:center;margin:20px 0 8px}
    .cta{display:inline-block;background:#C62828;color:#fff;text-decoration:none;padding:13px 32px;border-radius:30px;font-size:15px;font-weight:700}
    .footer{background:#FAFAFA;border-top:1px solid #EEE;padding:16px 24px;text-align:center;font-size:12px;color:#AAA}
    .footer p+p{margin-top:4px}
  </style>
</head><body>
  <div class="wrapper"><div class="card">
    <div class="header"><span class="logo">🩸</span><h1>রক্তদান বাংলাদেশ</h1></div>
    <div class="body">
      <span class="badge">✅ নিবন্ধন প্রাপ্ত</span>
      <p>প্রিয় <strong>${esc(user.name)}</strong>,</p>
      <p style="margin-top:12px">আপনার নিবন্ধন সফলভাবে জমা হয়েছে। আমাদের টিম আপনার তথ্য যাচাই করবে এবং অনুমোদনের পর আপনাকে ইমেইলে জানানো হবে।</p>
      <div class="info-box">
        <strong>⏳ পর্যালোচনা প্রক্রিয়া:</strong><br>
        সাধারণত ২৪–৪৮ ঘণ্টার মধ্যে আবেদন পর্যালোচনা সম্পন্ন হয়।
        অনুমোদিত হলে আপনি স্বয়ংক্রিয়ভাবে রক্তের অনুরোধের বিজ্ঞপ্তি পাবেন।
      </div>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr><td style="padding:6px 0;color:#888;width:40%">রক্তের গ্রুপ</td><td style="font-weight:600">${esc(user.bloodGroup)}</td></tr>
        <tr><td style="padding:6px 0;color:#888">নিবন্ধিত ইমেইল</td><td style="font-weight:600">${esc(user.email)}</td></tr>
      </table>
      <div class="cta-wrap"><a href="${APP_URL}/#/login" class="cta">লগইন করুন →</a></div>
    </div>
    <div class="footer">
      <p>এটি একটি স্বয়ংক্রিয় বিজ্ঞপ্তি — অনুগ্রহ করে সরাসরি রিপ্লাই করবেন না।</p>
      <p>© রক্তদান বাংলাদেশ · জীবন বাঁচান</p>
    </div>
  </div></div>
</body></html>`.trim();

  return sendEmail(user.email, subject, html);
}

// ── APPROVAL EMAIL ────────────────────────────────────────────────────────────

/**
 * Sends an approval notification to the donor.
 * @param {{ name: string, email: string, bloodGroup: string, district: string, adminNote?: string }} user
 */
async function sendApprovalEmail(user) {
  if (!user.email) return { success: false, error: 'No email address' };

  const subject = `🎉 অনুমোদিত! আপনি এখন রক্তদাতা — রক্তদান বাংলাদেশ`;
  const html = /* html */`
<!DOCTYPE html><html lang="bn"><head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>অনুমোদিত</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f0f0f0;color:#333;line-height:1.7}
    .wrapper{max-width:620px;margin:24px auto;padding:0 16px}
    .card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.10)}
    .header{background:#2E7D32;color:#fff;padding:28px 24px;text-align:center}
    .header .logo{font-size:44px;display:block;margin-bottom:8px}
    .header h1{font-size:20px;font-weight:700}
    .body{padding:28px 28px 20px}
    .badge{display:inline-block;background:#E8F5E9;color:#2E7D32;border:1px solid #A5D6A7;border-radius:20px;padding:4px 16px;font-weight:700;font-size:14px;margin-bottom:16px}
    .info-box{background:#F1F8E9;border-left:4px solid #7CB342;border-radius:8px;padding:14px 16px;margin:16px 0;font-size:14px;color:#555}
    .cta-wrap{text-align:center;margin:20px 0 8px}
    .cta{display:inline-block;background:#C62828;color:#fff;text-decoration:none;padding:13px 32px;border-radius:30px;font-size:15px;font-weight:700}
    .footer{background:#FAFAFA;border-top:1px solid #EEE;padding:16px 24px;text-align:center;font-size:12px;color:#AAA}
    .footer p+p{margin-top:4px}
  </style>
</head><body>
  <div class="wrapper"><div class="card">
    <div class="header"><span class="logo">🎉</span><h1>অভিনন্দন! আপনি অনুমোদিত হয়েছেন</h1></div>
    <div class="body">
      <span class="badge">✅ অনুমোদিত</span>
      <p>প্রিয় <strong>${esc(user.name)}</strong>,</p>
      <p style="margin-top:12px">আপনার নিবন্ধন পর্যালোচনা করা হয়েছে এবং <strong>অনুমোদিত</strong> হয়েছে।
      আপনি এখন রক্তদান বাংলাদেশের একজন সক্রিয় রক্তদাতা। 🩸</p>
      <div class="info-box">
        <strong>এখন থেকে:</strong><br>
        আপনার এলাকায় (${esc(user.district)}) ${esc(user.bloodGroup)} রক্তের অনুরোধ আসলে আপনাকে ইমেইলে জানানো হবে।
        প্রয়োজনে যোগাযোগ করুন এবং জীবন বাঁচানোর এই মিশনে অংশ নিন।
      </div>
      ${user.adminNote ? `<p style="font-size:14px;color:#555;margin-top:8px">📝 <strong>প্রশাসনিক নোট:</strong> ${esc(user.adminNote)}</p>` : ''}
      <div class="cta-wrap"><a href="${APP_URL}/#/dashboard" class="cta">ড্যাশবোর্ডে যান →</a></div>
    </div>
    <div class="footer">
      <p>এটি একটি স্বয়ংক্রিয় বিজ্ঞপ্তি — অনুগ্রহ করে সরাসরি রিপ্লাই করবেন না।</p>
      <p>© রক্তদান বাংলাদেশ · জীবন বাঁচান</p>
    </div>
  </div></div>
</body></html>`.trim();

  return sendEmail(user.email, subject, html);
}

// ── REJECTION EMAIL ───────────────────────────────────────────────────────────

/**
 * Sends a rejection notification to the donor.
 * @param {{ name: string, email: string, adminNote?: string }} user
 */
async function sendRejectionEmail(user) {
  if (!user.email) return { success: false, error: 'No email address' };

  const subject = `❌ নিবন্ধন প্রত্যাখ্যাত — রক্তদান বাংলাদেশ`;
  const html = /* html */`
<!DOCTYPE html><html lang="bn"><head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>প্রত্যাখ্যাত</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f0f0f0;color:#333;line-height:1.7}
    .wrapper{max-width:620px;margin:24px auto;padding:0 16px}
    .card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.10)}
    .header{background:#555;color:#fff;padding:28px 24px;text-align:center}
    .header .logo{font-size:44px;display:block;margin-bottom:8px}
    .header h1{font-size:20px;font-weight:700}
    .body{padding:28px 28px 20px}
    .badge{display:inline-block;background:#FFEBEE;color:#C62828;border:1px solid #FFCDD2;border-radius:20px;padding:4px 16px;font-weight:700;font-size:14px;margin-bottom:16px}
    .info-box{background:#FFF8E1;border-left:4px solid #FFA000;border-radius:8px;padding:14px 16px;margin:16px 0;font-size:14px;color:#555}
    .cta-wrap{text-align:center;margin:20px 0 8px}
    .cta{display:inline-block;background:#C62828;color:#fff;text-decoration:none;padding:13px 32px;border-radius:30px;font-size:15px;font-weight:700}
    .footer{background:#FAFAFA;border-top:1px solid #EEE;padding:16px 24px;text-align:center;font-size:12px;color:#AAA}
    .footer p+p{margin-top:4px}
  </style>
</head><body>
  <div class="wrapper"><div class="card">
    <div class="header"><span class="logo">📋</span><h1>নিবন্ধন পর্যালোচনা ফলাফল</h1></div>
    <div class="body">
      <span class="badge">❌ প্রত্যাখ্যাত</span>
      <p>প্রিয় <strong>${esc(user.name)}</strong>,</p>
      <p style="margin-top:12px">দুঃখের সাথে জানাচ্ছি যে আপনার নিবন্ধন আবেদন এই মুহূর্তে অনুমোদন করা সম্ভব হয়নি।</p>
      ${user.adminNote ? `
      <div class="info-box">
        <strong>📝 কারণ:</strong><br>${esc(user.adminNote)}
      </div>` : ''}
      <p style="font-size:14px;color:#555;margin-top:12px">
        আপনি প্রয়োজনীয় তথ্য বা নথি আপডেট করে পুনরায় নিবন্ধন করতে পারেন।
      </p>
      <div class="cta-wrap"><a href="${APP_URL}/#/register" class="cta">পুনরায় নিবন্ধন করুন →</a></div>
    </div>
    <div class="footer">
      <p>এটি একটি স্বয়ংক্রিয় বিজ্ঞপ্তি — অনুগ্রহ করে সরাসরি রিপ্লাই করবেন না।</p>
      <p>© রক্তদান বাংলাদেশ · জীবন বাঁচান</p>
    </div>
  </div></div>
</body></html>`.trim();

  return sendEmail(user.email, subject, html);
}

// ── SUSPENSION EMAIL ──────────────────────────────────────────────────────────

/**
 * Sends a suspension notification to the donor.
 * @param {{ name: string, email: string, adminNote?: string }} user
 */
async function sendSuspensionEmail(user) {
  if (!user.email) return { success: false, error: 'No email address' };

  const subject = `⚠️ অ্যাকাউন্ট স্থগিত — রক্তদান বাংলাদেশ`;
  const html = /* html */`
<!DOCTYPE html><html lang="bn"><head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>অ্যাকাউন্ট স্থগিত</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f0f0f0;color:#333;line-height:1.7}
    .wrapper{max-width:620px;margin:24px auto;padding:0 16px}
    .card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.10)}
    .header{background:#E65100;color:#fff;padding:28px 24px;text-align:center}
    .header .logo{font-size:44px;display:block;margin-bottom:8px}
    .header h1{font-size:20px;font-weight:700}
    .body{padding:28px 28px 20px}
    .badge{display:inline-block;background:#FFF3E0;color:#E65100;border:1px solid #FFCC80;border-radius:20px;padding:4px 16px;font-weight:700;font-size:14px;margin-bottom:16px}
    .info-box{background:#FFF8E1;border-left:4px solid #E65100;border-radius:8px;padding:14px 16px;margin:16px 0;font-size:14px;color:#555}
    .footer{background:#FAFAFA;border-top:1px solid #EEE;padding:16px 24px;text-align:center;font-size:12px;color:#AAA}
    .footer p+p{margin-top:4px}
  </style>
</head><body>
  <div class="wrapper"><div class="card">
    <div class="header"><span class="logo">⚠️</span><h1>অ্যাকাউন্ট স্থগিত বিজ্ঞপ্তি</h1></div>
    <div class="body">
      <span class="badge">⚠️ স্থগিত</span>
      <p>প্রিয় <strong>${esc(user.name)}</strong>,</p>
      <p style="margin-top:12px">আপনার রক্তদান বাংলাদেশ অ্যাকাউন্ট সাময়িকভাবে স্থগিত করা হয়েছে।</p>
      ${user.adminNote ? `
      <div class="info-box">
        <strong>📝 কারণ:</strong><br>${esc(user.adminNote)}
      </div>` : ''}
      <p style="font-size:14px;color:#555;margin-top:12px">
        আরো তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন।
      </p>
    </div>
    <div class="footer">
      <p>এটি একটি স্বয়ংক্রিয় বিজ্ঞপ্তি — অনুগ্রহ করে সরাসরি রিপ্লাই করবেন না।</p>
      <p>© রক্তদান বাংলাদেশ · জীবন বাঁচান</p>
    </div>
  </div></div>
</body></html>`.trim();

  return sendEmail(user.email, subject, html);
}

// ── BKASH DONATION RECEIPT EMAIL ──────────────────────────────────────────────

/**
 * Sends a donation receipt email after a successful bKash transaction.
 * @param {{ donorName: string, donorEmail?: string, amount: number, trxID: string, paymentID: string }} donation
 */
async function sendDonationReceiptEmail(donation) {
  if (!donation.donorEmail) return { success: false, error: 'No email address for donation receipt' };

  const subject = `🩸 আপনার অনুদানের রসিদ — রক্তদান বাংলাদেশ`;
  const html = /* html */`
<!DOCTYPE html><html lang="bn"><head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>অনুদান রসিদ</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f0f0f0;color:#333;line-height:1.7}
    .wrapper{max-width:620px;margin:24px auto;padding:0 16px}
    .card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.10)}
    .header{background:#e2136e;color:#fff;padding:28px 24px;text-align:center}
    .header .logo{font-size:44px;display:block;margin-bottom:8px}
    .header h1{font-size:20px;font-weight:700}
    .body{padding:28px 28px 20px}
    .amount-badge{text-align:center;background:#FCE4EC;border-radius:12px;padding:20px;margin:16px 0}
    .amount-badge .amount{font-size:40px;font-weight:900;color:#e2136e}
    .amount-badge .currency{font-size:18px;color:#555}
    .details{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
    .details tr td{padding:8px 0;border-bottom:1px solid #f5f5f5}
    .details tr:last-child td{border-bottom:none}
    .details .lbl{color:#888;width:45%}
    .details .val{font-weight:600}
    .footer{background:#FAFAFA;border-top:1px solid #EEE;padding:16px 24px;text-align:center;font-size:12px;color:#AAA}
    .footer p+p{margin-top:4px}
  </style>
</head><body>
  <div class="wrapper"><div class="card">
    <div class="header"><span class="logo">💚</span><h1>bKash অনুদান রসিদ</h1></div>
    <div class="body">
      <p>প্রিয় <strong>${esc(donation.donorName)}</strong>,</p>
      <p style="margin-top:8px">রক্তদান বাংলাদেশকে সমর্থন করার জন্য আন্তরিক ধন্যবাদ! 🙏</p>

      <div class="amount-badge">
        <div class="amount">${donation.amount}</div>
        <div class="currency">বাংলাদেশী টাকা (BDT)</div>
      </div>

      <table class="details" role="presentation">
        <tr><td class="lbl">💳 পেমেন্ট আইডি</td><td class="val"><code>${esc(donation.paymentID)}</code></td></tr>
        <tr><td class="lbl">🔖 ট্রানজেকশন আইডি</td><td class="val"><code>${esc(donation.trxID || 'N/A')}</code></td></tr>
        <tr><td class="lbl">📅 তারিখ</td><td class="val">${new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
        <tr><td class="lbl">✅ অবস্থা</td><td class="val" style="color:#2E7D32">সম্পন্ন</td></tr>
      </table>

      <p style="font-size:13px;color:#888;margin-top:16px;text-align:center">
        আপনার এই অনুদান আমাদের সার্ভার পরিচালনা এবং রক্তদাতা-বিজ্ঞপ্তি সেবা চালু রাখতে সাহায্য করবে।
      </p>
    </div>
    <div class="footer">
      <p>এটি একটি স্বয়ংক্রিয় বিজ্ঞপ্তি — অনুগ্রহ করে সরাসরি রিপ্লাই করবেন না।</p>
      <p>© রক্তদান বাংলাদেশ · জীবন বাঁচান</p>
    </div>
  </div></div>
</body></html>`.trim();

  return sendEmail(donation.donorEmail, subject, html);
}

module.exports = {
  sendEmail,
  notifyDonors,
  sendRegistrationConfirmation,
  sendApprovalEmail,
  sendRejectionEmail,
  sendSuspensionEmail,
  sendDonationReceiptEmail
};

