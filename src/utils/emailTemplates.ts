export function notificationEmailTemplate(opts: { appName?: string; title?: string; message: string; ctaLabel?: string; ctaUrl?: string; footerNote?: string; }) {
  const appName = opts.appName || 'RadioMonoko';
  const title = opts.title || 'Nouvelle notification';
  const message = opts.message;
  const ctaLabel = opts.ctaLabel || 'Voir la notification';
  const ctaUrl = opts.ctaUrl || '#';
  const footerNote = opts.footerNote || 'Vous recevez cet email car vous avez activé les notifications par email.';

  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <style>
      :root{--bg:#f4f6f8;--card:#ffffff;--accent:#1f8ef1;--text:#202124;--muted:#6b7280}
      body{margin:0;padding:24px;background:var(--bg);font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji';color:var(--text)}
      .container{max-width:680px;margin:0 auto}
      .card{background:var(--card);border-radius:12px;padding:28px;box-shadow:0 6px 18px rgba(15,23,42,0.08)}
      .header{display:flex;align-items:center;gap:12px;margin-bottom:16px}
      .logo{width:48px;height:48px;border-radius:8px;background:linear-gradient(135deg,#4f46e5,#06b6d4);display:inline-flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:18px}
      .hgroup{line-height:1}
      .title{font-size:18px;font-weight:600;margin:0}
      .subtitle{font-size:13px;color:var(--muted);margin:0}
      .body{font-size:15px;color:var(--text);margin-top:12px;margin-bottom:20px;white-space:pre-wrap}
      .cta{display:inline-block;padding:12px 20px;background:var(--accent);color:#fff;border-radius:8px;text-decoration:none;font-weight:600}
      .footer{font-size:12px;color:var(--muted);margin-top:20px}
      .muted{color:var(--muted);font-size:13px}
      @media (max-width:480px){body{padding:12px}.card{padding:18px;border-radius:10px}}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          <div class="logo">${appName.charAt(0) || 'R'}</div>
          <div class="hgroup">
            <p class="title">${title}</p>
            <p class="subtitle">${appName}</p>
          </div>
        </div>

        <div class="body">${escapeHtml(message)}</div>

        <p style="margin:0 0 10px 0"><a class="cta" href="${ctaUrl}">${ctaLabel}</a></p>

        <div class="footer">
          <p class="muted" style="margin:0 0 8px 0">${footerNote}</p>
          <p class="muted" style="margin:0">Si vous souhaitez désactiver ces emails, rendez-vous dans vos paramètres de profil.</p>
        </div>
      </div>

      <p style="text-align:center;color:var(--muted);font-size:12px;margin-top:14px">© ${new Date().getFullYear()} ${appName}. Tous droits réservés.</p>
    </div>
  </body>
  </html>
  `;

  const text = `${title}\n\n${message}\n\n${ctaLabel}: ${ctaUrl}\n\n${footerNote}\n`;

  return { html, text };
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
