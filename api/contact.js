const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

function badRequest(res, message) {
  return res.status(400).json({ ok: false, error: message });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const brevoApiKey = process.env.BREVO_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'contact@odsunsolutions.in';
  const senderEmail = process.env.BREVO_SENDER_EMAIL || toEmail;
  const senderName = process.env.BREVO_SENDER_NAME || 'Odsun Solutions Website';

  if (!brevoApiKey) {
    return res.status(500).json({ ok: false, error: 'Missing BREVO_API_KEY' });
  }

  const {
    source = 'unknown',
    name = '',
    email = '',
    message = '',
    company = '',
    budget = '',
    services = [],
  } = req.body || {};

  if (!name || !email || !message) {
    return badRequest(res, 'name, email, and message are required');
  }

  const safeServices = Array.isArray(services) ? services : [];

  const htmlContent = `
    <h2>New Contact Lead</h2>
    <p><strong>Source:</strong> ${String(source)}</p>
    <p><strong>Name:</strong> ${String(name)}</p>
    <p><strong>Email:</strong> ${String(email)}</p>
    ${company ? `<p><strong>Company:</strong> ${String(company)}</p>` : ''}
    ${budget ? `<p><strong>Budget:</strong> ${String(budget)}</p>` : ''}
    ${
      safeServices.length
        ? `<p><strong>Services:</strong> ${safeServices.map(s => String(s)).join(', ')}</p>`
        : ''
    }
    <p><strong>Message:</strong></p>
    <p>${String(message).replace(/\n/g, '<br/>')}</p>
  `;

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          email: senderEmail,
          name: senderName,
        },
        to: [{ email: toEmail }],
        replyTo: { email: String(email), name: String(name) },
        subject: `New website inquiry from ${String(name)}`,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({
        ok: false,
        error: `Brevo API error (${response.status})`,
        details: errorText,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
