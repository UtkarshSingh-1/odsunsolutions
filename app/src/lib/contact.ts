type ContactPayload = {
  source: 'home' | 'contact-page';
  name: string;
  email: string;
  message: string;
  company?: string;
  budget?: string;
  services?: string[];
};

const CONTACT_ENDPOINT = '/api/contact';

export async function submitContactLead(payload: ContactPayload): Promise<void> {
  const response = await fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Contact API not found (404).');
    }

    let details = '';
    try {
      const data = await response.json();
      details = data?.error || data?.details || '';
    } catch {
      // Ignore JSON parse errors and use status-only fallback.
    }

    throw new Error(
      details
        ? `Contact submission failed: ${details}`
        : `Contact submission failed: ${response.status}`
    );
  }
}
