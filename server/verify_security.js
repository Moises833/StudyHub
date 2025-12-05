const http = require('http');

const makeRequest = (path, method = 'GET', body = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                let parsedBody = data;
                try {
                    parsedBody = JSON.parse(data);
                } catch (e) {
                    // Not JSON, keep as string
                }
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: parsedBody
                });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

const runTests = async () => {
    console.log('Starting Security Verification...');

    // 1. Check Security Headers
    try {
        const res = await makeRequest('/');
        console.log('\n[Headers Check]');
        if (res.headers['x-dns-prefetch-control'] && res.headers['x-frame-options']) {
            console.log('✅ Helmet headers present');
        } else {
            console.log('❌ Helmet headers missing');
            console.log(res.headers);
        }
    } catch (e) {
        console.log('❌ Error checking headers:', e.message);
    }

    // 2. Test Registration (Validation)
    console.log('\n[Registration Validation]');
    try {
        const res = await makeRequest('/api/register', 'POST', {
            name: 'Te',
            email: 'invalid-email',
            password: '123'
        });
        if (res.statusCode === 400) {
            console.log('✅ Invalid input rejected');
        } else {
            console.log('❌ Invalid input accepted:', res.statusCode);
        }
    } catch (e) {
        console.log('❌ Error testing validation:', e.message);
    }

    // 3. Test Rate Limiting
    console.log('\n[Rate Limiting]');
    let blocked = false;
    for (let i = 0; i < 110; i++) {
        try {
            const res = await makeRequest('/');
            if (res.statusCode === 429) {
                blocked = true;
                console.log(`✅ Request ${i + 1} blocked (Rate Limit working)`);
                break;
            }
        } catch (e) {
            // ignore
        }
    }
    if (!blocked) {
        console.log('❌ Rate limiting failed to block requests');
    }

    console.log('\nVerification Complete.');
};

runTests();
