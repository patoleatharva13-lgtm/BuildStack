const RESEND_FROM = 'BuildStack <onboarding@resend.dev>';
const DEFAULT_TO_EMAIL = 'patole.atharva13@gmail.com';

function getResendUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_URL;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${configuredUrl || origin || ''}/api/resend/emails`.replace(/([^:]\/)\/+/g, '$1');
}

let rateLimitStore = {};

export async function checkRateLimit(identifier, maxRequests = 5, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitStore[identifier]) {
    rateLimitStore[identifier] = [];
  }

  rateLimitStore[identifier] = rateLimitStore[identifier].filter((timestamp) => timestamp > windowStart);

  if (rateLimitStore[identifier].length >= maxRequests) {
    const oldestRequest = rateLimitStore[identifier][0];
    const retryAfter = Math.ceil((oldestRequest + windowMs - now) / 1000);

    return {
      success: false,
      remaining: 0,
      retryAfter,
      message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
    };
  }

  rateLimitStore[identifier].push(now);

  return {
    success: true,
    remaining: maxRequests - rateLimitStore[identifier].length,
    retryAfter: 0,
    message: 'Request allowed',
  };
}

async function postEmail(payload) {
  const fallbackApiKey = import.meta.env.VITE_RESEND_API_KEY || import.meta.env.RESEND_API_KEY;

  try {
    const response = await fetch(getResendUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return response.json();
    }

    const errorText = await response.text();
    let message = errorText || 'Email endpoint unavailable';

    try {
      const parsed = JSON.parse(errorText)
      message = parsed.error || parsed.message || message
    } catch {
      // keep the raw text when parsing fails
    }

    if (!fallbackApiKey || response.status === 404) {
      throw new Error(message);
    }
  } catch (error) {
    if (!fallbackApiKey) {
      throw new Error('Email service is unavailable. Add VITE_RESEND_API_KEY to configure delivery.');
    }

    if (error.message?.includes('Failed to fetch') || error.message?.includes('fetch')) {
      // fall through to direct Resend delivery below
    } else {
      throw error;
    }
  }

  const fallback = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${fallbackApiKey}`,
    },
    body: JSON.stringify({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    }),
  });

  const fallbackData = await fallback.json();
  if (!fallback.ok) {
    throw new Error(fallbackData?.message || 'Resend rejected the request');
  }

  return fallbackData;
}

export async function sendBugAlert({ to, bugCount }) {
  try {
    const data = await postEmail({
      from: RESEND_FROM,
      to: [to || DEFAULT_TO_EMAIL],
      subject: bugCount >= 1 ? 'New open bug alert from BuildStack' : 'BuildStack bug update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">BuildStack</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">Open bug notification</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
            <p style="color: #334155; font-size: 16px;">A new open bug has been created in your workspace.</p>
            <p style="color: #475569; font-size: 15px; line-height: 1.6;">Please review the issue in BuildStack and take action right away.</p>
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">Sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>
      `,
    });

    return { success: true, id: data.id, message: 'Bug alert sent!' };
  } catch (error) {
    const message = error.message || 'Unable to send email.';
    return { success: false, message: message.includes('RESEND_API_KEY') || message.includes('Missing fields') || message.includes('endpoint')
      ? message
      : `Email delivery failed: ${message}` };
  }
}
