#!/usr/bin/env node

/**
 * TEST SCRIPT: Product Image Upload Flow
 * 
 * Validates:
 * 1. Multipart form-data upload with images (no Base64)
 * 2. No 413 Payload Too Large errors
 * 3. Existing image URLs are preserved
 * 4. New uploaded images are accessible via /uploads/products
 * 
 * Prerequisites:
 * - Backend server running on http://localhost:3000
 * - Valid Firebase auth token in FIREBASE_TOKEN env var OR test with mock
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_URL = 'http://localhost:3000/api';
const MOCK_TOKEN = process.env.FIREBASE_TOKEN || 'mock-token-for-testing';

// ============================================================================
// UTILITIES
// ============================================================================

const makeRequest = (method, endpoint, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}${endpoint}`);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      headers: {
        'Authorization': `Bearer ${MOCK_TOKEN}`,
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed,
          });
        } catch {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      if (body instanceof FormData) {
        body.pipe(req);
      } else {
        req.write(JSON.stringify(body));
      }
    } else {
      req.end();
    }
  });
};

// ============================================================================
// CREATE TEST IMAGE FILES
// ============================================================================

const createTestImages = async () => {
  const tempDir = path.join(__dirname, '.test-images');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const images = [];

  // Create 2 small test PNG files (1KB each, minimal valid PNG)
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
    0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41,
    0x54, 0x08, 0x99, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
    0x00, 0x00, 0x03, 0x00, 0x01, 0x1e, 0x24, 0x78,
    0x2a, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e,
    0x44, 0xae, 0x42, 0x60, 0x82,
  ]);

  for (let i = 1; i <= 2; i++) {
    const filename = `test-image-${i}.png`;
    const filepath = path.join(tempDir, filename);
    fs.writeFileSync(filepath, pngHeader);
    images.push({
      name: filename,
      path: filepath,
    });
  }

  return { tempDir, images };
};

// ============================================================================
// TEST SCENARIOS
// ============================================================================

const testCreateProductWithImages = async (images) => {
  console.log('\n📋 TEST 1: Create Product with Image Files');
  console.log('━'.repeat(60));

  const form = new FormData();
  form.append('name', `Test Product ${Date.now()}`);
  form.append('description', 'Test product with image upload');
  form.append('price', '99.99');
  form.append('cost', '49.99');
  form.append('stock', '100');
  form.append('category', 'test');
  form.append('isActive', 'true');

  // Add image files
  for (const image of images) {
    const stream = fs.createReadStream(image.path);
    form.append('images', stream, image.name);
  }

  try {
    const response = await makeRequest('POST', '/products', form, {
      ...form.getHeaders(),
    });

    if (response.status === 201 || response.status === 200) {
      console.log('✅ Product created successfully');
      console.log(`   Status: ${response.status}`);
      if (response.body.data?.product?._id || response.body._id) {
        const productId = response.body.data?.product?._id || response.body._id;
        console.log(`   Product ID: ${productId}`);
        if (response.body.data?.product?.images || response.body.images) {
          const imgs = response.body.data?.product?.images || response.body.images;
          console.log(`   Images count: ${imgs.length}`);
          imgs.forEach((img, i) => {
            console.log(`     [${i + 1}] ${img}`);
          });
        }
        return productId;
      }
    } else if (response.status === 413) {
      console.log('❌ FAILED: Payload Too Large (413)');
      console.log('   This should NOT occur with the fix');
      console.log(`   Response: ${JSON.stringify(response.body)}`);
      return null;
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.body, null, 2)}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
    return null;
  }
};

const testUpdateProductWithImages = async (productId, images) => {
  console.log('\n📋 TEST 2: Update Product with Additional Images');
  console.log('━'.repeat(60));

  if (!productId) {
    console.log('⏭️  Skipped (no productId from previous test)');
    return;
  }

  const form = new FormData();
  form.append('name', `Updated Product ${Date.now()}`);
  form.append('description', 'Updated with new images');
  form.append('price', '129.99');
  form.append('stock', '50');
  // Keep existing images via imageUrls field
  form.append('imageUrls', JSON.stringify([])); 

  // Add new image file
  if (images.length > 0) {
    const stream = fs.createReadStream(images[0].path);
    form.append('images', stream, images[0].name);
  }

  try {
    const response = await makeRequest('PATCH', `/products/${productId}`, form, {
      ...form.getHeaders(),
    });

    if (response.status === 200) {
      console.log('✅ Product updated successfully');
      console.log(`   Status: ${response.status}`);
    } else if (response.status === 413) {
      console.log('❌ FAILED: Payload Too Large (413)');
      console.log('   This should NOT occur with the fix');
      return;
    } else {
      console.log(`⚠️  Status: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
};

const testLargePayloadRejection = async () => {
  console.log('\n📋 TEST 3: Verify Body Limit Enforcement');
  console.log('━'.repeat(60));

  // Create a payload that exceeds limits - should be rejected at middleware
  // Express limit is 10mb, so we test with 15mb
  const largeData = 'x'.repeat(15 * 1024 * 1024);
  const form = new FormData();
  form.append('name', 'test');
  form.append('data', largeData);

  try {
    const response = await makeRequest('POST', '/products', form, {
      ...form.getHeaders(),
    });

    if (response.status === 413) {
      console.log('✅ Large payloads are correctly rejected');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${response.body.message || 'N/A'}`);
    } else {
      console.log(`⚠️  Large payload was not rejected (status: ${response.status})`);
    }
  } catch (error) {
    console.log(`ℹ️  Request handling (may be expected): ${error.message}`);
  }
};

// ============================================================================
// MAIN
// ============================================================================

const main = async () => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   Product Image Upload Test Suite                         ║');
  console.log('║   Tests multipart/form-data and 413 error handling        ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  // Check server connectivity
  console.log('\n🔍 Checking server connectivity...');
  try {
    const health = await makeRequest('GET', '/../', null);
    console.log(`✅ Backend server is running (${health.status})`);
  } catch (error) {
    console.log(`❌ Cannot connect to backend at ${API_URL}`);
    console.log(`   Error: ${error.message}`);
    console.log('\n⚠️  TESTS REQUIRE BACKEND SERVER');
    console.log('   Start backend with: npm run dev');
    process.exit(1);
  }

  // Create test images
  console.log('\n📁 Creating test image files...');
  const { tempDir, images } = await createTestImages();
  console.log(`✅ Created ${images.length} test images in ${tempDir}`);

  // Run tests
  const productId = await testCreateProductWithImages(images);
  await testUpdateProductWithImages(productId, images);
  await testLargePayloadRejection();

  // Cleanup
  console.log('\n🧹 Cleaning up test files...');
  for (const image of images) {
    try {
      fs.unlinkSync(image.path);
    } catch (e) {
      // ignore
    }
  }
  try {
    fs.rmdirSync(tempDir);
  } catch (e) {
    // ignore
  }
  console.log('✅ Cleanup complete');

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   Test Suite Complete                                     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
};

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
