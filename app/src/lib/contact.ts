type ContactPayload = {
  source: 'home' | 'contact-page';
  name: string;
  email: string;
  message: string;
  company?: string;
  budget?: string;
  services?: string[];
};

const BREVO_WEBHOOK_URL = import.meta.env.VITE_BREVO_WEBHOOK_URL?.trim();
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT?.trim() || '/api/contact';

export async function submitContactLead(payload: ContactPayload): Promise<void> {
  // Local dev fallback when backend endpoint is not configured.
  if (import.meta.env.DEV && !BREVO_WEBHOOK_URL && !import.meta.env.VITE_CONTACT_ENDPOINT) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return;
  }

  const targetUrl = BREVO_WEBHOOK_URL || CONTACT_ENDPOINT;

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Contact submission failed: ${response.status}`);
  }
}
