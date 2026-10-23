const apiBaseUrl = (import.meta.env.VITE_API_URL?.trim() || '/api').replace(/\/$/, '');

export async function checkApiHealth() {
  const response = await fetch(`${apiBaseUrl}/health`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`API server returned HTTP ${response.status}.`);
  }

  const result = await response.json();
  if (result.status !== 'ok' || result.service !== 'horizon-capital-api') {
    throw new Error('API server returned an unexpected health response.');
  }
}
