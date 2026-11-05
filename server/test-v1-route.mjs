import http from 'http';
import app from './src/app.js';

const server = http.createServer(app);
server.listen(0, '127.0.0.1', () => {
  const { port } = server.address();
  console.log(`Test server started on port ${port}`);

  const tests = [
    '/api/health',
    '/api/v1/health',
    '/api/destinations?limit=2',
    '/api/v1/destinations?limit=2',
    '/api/v1/destinations?keyword=ladwa&category=&district=&sort=newest&page=1&limit=9',
  ];

  let done = 0;
  for (const p of tests) {
    http.get(`http://127.0.0.1:${port}${p}`, (res) => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => {
        let preview = '';
        try {
          const parsed = JSON.parse(data);
          preview = parsed.success !== undefined
            ? `success:${parsed.success}`
            : parsed.status || JSON.stringify(parsed).slice(0, 80);
        } catch {
          preview = data.slice(0, 80);
        }
        const label = p.split('?')[0];
        const qs    = p.includes('?') ? '?' + p.split('?')[1] : '';
        console.log(`[${res.statusCode}] ${label}${qs ? '...' : ''} → ${preview}`);
        if (++done === tests.length) { server.close(); }
      });
    }).on('error', (e) => {
      console.error(`ERROR ${p}: ${e.message}`);
      if (++done === tests.length) { server.close(); }
    });
  }

  server.on('close', () => {
    console.log('\nAll tests complete.');
    process.exit(0);
  });
});

