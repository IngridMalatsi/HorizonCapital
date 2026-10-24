import tls from 'node:tls';

const endpoints = (process.env.TLS_CHECK_URLS || '')
  .split(',')
  .map((endpoint) => endpoint.trim())
  .filter(Boolean);

if (endpoints.length === 0) {
  console.error('Set TLS_CHECK_URLS to a comma-separated list of deployed HTTPS origins.');
  process.exitCode = 1;
} else {
  let failed = false;

  for (const endpoint of endpoints) {
    let url;
    try {
      url = new URL(endpoint);
    } catch {
      console.error(`${endpoint}: invalid URL`);
      failed = true;
      continue;
    }

    if (url.protocol !== 'https:' || url.username || url.password) {
      console.error(`${endpoint}: provide an HTTPS URL without credentials.`);
      failed = true;
      continue;
    }

    try {
      const protocol = await new Promise((resolve, reject) => {
        const socket = tls.connect({
          host: url.hostname,
          port: Number(url.port || 443),
          servername: url.hostname,
          minVersion: 'TLSv1.3',
          rejectUnauthorized: true,
          timeout: 10000,
        });

        socket.once('secureConnect', () => {
          const negotiatedProtocol = socket.getProtocol();
          const cipher = socket.getCipher()?.name || 'unknown cipher';
          socket.end();
          resolve({ negotiatedProtocol, cipher });
        });
        socket.once('timeout', () => {
          socket.destroy(new Error('TLS handshake timed out.'));
        });
        socket.once('error', reject);
      });

      console.log(`${url.origin}: ${protocol.negotiatedProtocol}, ${protocol.cipher}, certificate verified`);
    } catch (error) {
      failed = true;
      console.error(`${url.origin}: TLS 1.3 verification failed: ${error.message}`);
    }
  }

  if (failed) process.exitCode = 1;
}
