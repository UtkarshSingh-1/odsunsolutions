import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv, type Plugin } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

function readJsonBody(req: import('node:http').IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function contactApiDevPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'contact-api-dev',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res, next) => {
        if (req.method !== 'POST') {
          next();
          return;
        }

        const brevoApiKey = env.BREVO_API_KEY;
        const toEmail = env.CONTACT_TO_EMAIL || 'contact@odsunsolutions.in';
        const senderEmail = env.BREVO_SENDER_EMAIL || toEmail;
        const senderName = env.BREVO_SENDER_NAME || 'Odsun Solutions Website';

        if (!brevoApiKey) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: 'Missing BREVO_API_KEY' }));
          return;
        }

        try {
          const body = await readJsonBody(req);
          const {
            source = 'unknown',
            name = '',
            email = '',
            message = '',
            company = '',
            budget = '',
            services = [],
          } = body || {};

          if (!name || !email || !message) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: 'name, email, and message are required' }));
            return;
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

          const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': brevoApiKey,
            },
            body: JSON.stringify({
              sender: { email: senderEmail, name: senderName },
              to: [{ email: toEmail }],
              replyTo: { email: String(email), name: String(name) },
              subject: `New website inquiry from ${String(name)}`,
              htmlContent,
            }),
          });

          if (!response.ok) {
            const details = await response.text();
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              ok: false,
              error: `Brevo API error (${response.status})`,
              details,
            }));
            return;
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            ok: false,
            error: 'Failed to send email',
            details: error instanceof Error ? error.message : 'Unknown error',
          }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, '..');
  const env = loadEnv(mode, envDir, '');

  return {
    base: './',
    envDir,
    plugins: [inspectAttr(), react(), contactApiDevPlugin(env)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
