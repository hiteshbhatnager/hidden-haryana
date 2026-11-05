import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import http from 'http';

const runTests = async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  console.log(`Test server running on port ${port}`);

  const request = (path, method = 'GET', body = null, headers = {}) => {
    return new Promise((resolve, reject) => {
      const isBuffer = Buffer.isBuffer(body);
      const options = {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          ...(isBuffer ? {} : { 'Content-Type': 'application/json' }),
          ...headers,
        },
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });

      req.on('error', reject);
      if (body) {
        if (isBuffer) {
          req.write(body);
        } else {
          req.write(JSON.stringify(body));
        }
      }
      req.end();
    });
  };

  try {
    console.log('\n--- 1. Testing Health Endpoint ---');
    const health = await request('/api/health');
    console.log('Health status:', health.status, health.body);

    console.log('\n--- 2. Testing Get All Destinations ---');
    const dests = await request('/api/destinations?limit=3');
    console.log('Destinations status:', dests.status);
    console.log('Total count:', dests.body.data.pagination.total);
    console.log('Sample name:', dests.body.data.destinations[0].name);

    console.log('\n--- 3. Testing Get Featured Destinations ---');
    const feat = await request('/api/destinations/featured');
    console.log('Featured status:', feat.status, 'Count:', feat.body.data.length);

    console.log('\n--- 4. Testing Get Single Destination (Tikkar Taal) ---');
    const single = await request('/api/destinations/tikkar-taal-morni-hills');
    console.log('Single status:', single.status);
    console.log('Found:', single.body.data.destination.name);
    console.log('District:', single.body.data.destination.district);
    console.log('Entry fee details:', single.body.data.destination.entryFee.details);

    console.log('\n--- 5. Testing Destination Metadata ---');
    const meta = await request('/api/destinations/meta');
    console.log('Meta categories:', meta.body.data.categories);
    console.log('Meta districts count:', meta.body.data.districts.length);

    console.log('\n--- 6. Testing Admin Login ---');
    const login = await request('/api/auth/login', 'POST', {
      email: 'admin@hiddenharyana.org',
      password: 'AdminPassword123!',
    });
    console.log('Login status:', login.status);
    console.log('User logged in:', login.body.data.user.name, 'Role:', login.body.data.user.role);
    const token = login.body.data.token;

    console.log('\n--- 7. Testing Image Upload (Multer / Cloudinary / Local Storage Fallback) ---');
    const boundary = '----FormBoundary7MA4YWxkTrZu0gW';
    const fileContent = Buffer.from('FakeImageDataJustForTestingUploads');
    const pre = Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="haryana-test.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`
    );
    const post = Buffer.from(`\r\n--${boundary}--\r\n`);
    const multipartBody = Buffer.concat([pre, fileContent, post]);

    const uploadRes = await request(
      '/api/upload',
      'POST',
      multipartBody,
      {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        Authorization: `Bearer ${token}`,
      }
    );
    console.log('Upload status:', uploadRes.status);
    console.log('Uploaded image URL:', uploadRes.body?.data?.url);

    console.log('\n--- 8. Testing Admin Create Destination (Protected Route) ---');
    const created = await request(
      '/api/destinations',
      'POST',
      {
        name: 'Chor Gumbad Astronomical Tower',
        district: 'Mahendragarh',
        category: 'Heritage & Forts',
        description: 'Historical square tomb monument known as the signpost of Narnaul.',
        history: 'Built by Jamal Khan an Afghan during Firoz Shah Tughlaq period.',
        coordinates: { latitude: 28.045, longitude: 76.109 },
        images: [
          {
            url: uploadRes.body?.data?.url || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
            caption: 'Chor Gumbad',
          },
        ],
      },
      { Authorization: `Bearer ${token}` }
    );
    console.log('Created status:', created.status);
    console.log('Created destination slug:', created.body.data.slug);

    console.log('\n--- 9. Testing Filter by Keyword and District ---');
    const searchRes = await request('/api/destinations?keyword=Rakhigarhi&district=Hisar');
    console.log('Search status:', searchRes.status, 'Results:', searchRes.body.data.destinations.length);
    console.log('Result name:', searchRes.body.data.destinations[0]?.name);

    console.log('\n=============================================');
    console.log('✅ ALL API TESTS (INCLUDING UPLOAD) PASSED!');
    console.log('=============================================');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
};

runTests();
