const configuredApiUrl = (import.meta.env.VITE_API_URL?.trim() || '/api').replace(/\/$/, '');
let apiConfigurationError = '';
let apiBaseUrl = '/api';

if (configuredApiUrl.startsWith('/') && !configuredApiUrl.startsWith('//')) {
  apiBaseUrl = configuredApiUrl;
} else {
  try {
    const parsedApiUrl = new URL(configuredApiUrl);
    const isLocalDevelopmentUrl = import.meta.env.DEV
      && parsedApiUrl.protocol === 'http:'
      && ['localhost', '127.0.0.1', '[::1]'].includes(parsedApiUrl.hostname);

    if (
      (parsedApiUrl.protocol === 'https:' || isLocalDevelopmentUrl)
      && !parsedApiUrl.username
      && !parsedApiUrl.password
    ) {
      apiBaseUrl = configuredApiUrl;
    } else {
      apiConfigurationError = 'Use an HTTPS API URL. HTTP is allowed only for localhost during development.';
    }
  } catch {
    apiConfigurationError = 'The API URL is invalid. Use a same-origin path or an HTTPS URL.';
  }
}

export async function checkApiHealth() {
  if (apiConfigurationError) {
    throw new Error(apiConfigurationError);
  }

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
