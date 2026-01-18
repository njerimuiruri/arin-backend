'use client';

/**
 * Debug script to test authentication flow
 * Copy and paste this into browser console to debug
 */

async function testLogin() {
  console.log('🔐 Testing login...');

  const response = await fetch('http://localhost:5001/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@example.com', // Change this!
      password: 'password123', // Change this!
    }),
  });

  console.log('Status:', response.status);
  const data = await response.json();
  console.log('Response:', data);

  if (data.access_token) {
    console.log('✅ Got access token');
    console.log('   Length:', data.access_token.length);
    console.log('   First 20 chars:', data.access_token.substring(0, 20));

    // Test localStorage
    localStorage.setItem('test_token', data.access_token);
    const retrieved = localStorage.getItem('test_token');
    console.log(
      '   localStorage test:',
      retrieved ? '✅ SUCCESS' : '❌ FAILED',
    );

    return data.access_token;
  } else {
    console.log('❌ No access token in response');
    return null;
  }
}

async function testAuthMe(token) {
  if (!token) {
    console.log('⚠️ No token to test');
    return;
  }

  console.log('\n👤 Testing /auth/me with token...');

  const response = await fetch('http://localhost:5001/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  console.log('Status:', response.status);
  const data = await response.json();
  console.log('Response:', data);
}

async function runTests() {
  const token = await testLogin();
  await testAuthMe(token);
}

console.log('Run this in your browser console:');
console.log('runTests()');
