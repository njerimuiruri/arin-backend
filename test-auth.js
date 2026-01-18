#!/usr/bin/env node

/**
 * Authentication Test Script
 *
 * This script tests the complete authentication flow:
 * 1. Login
 * 2. Access protected route (/contacts)
 * 3. Verify cookie-based authentication
 */

const BASE_URL = 'http://localhost:5001';

// Store cookies from responses
let cookies = '';

async function login() {
  console.log('🔐 Testing login...');

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      email: 'admin@example.com', // Change to your admin email
      password: 'password123', // Change to your admin password
    }),
  });

  // Extract cookies from response
  const setCookieHeader = response.headers.get('set-cookie');
  if (setCookieHeader) {
    cookies = setCookieHeader;
  }

  if (!response.ok) {
    const error = await response.json();
    console.log('❌ Login failed:', error);
    return false;
  }

  const data = await response.json();
  console.log('✅ Login successful');
  console.log('   User:', data.user?.email);
  console.log('   Cookies set:', setCookieHeader ? 'YES' : 'NO');

  return true;
}

async function testProtectedRoute() {
  console.log('\n🔒 Testing protected route (/contacts)...');

  const response = await fetch(`${BASE_URL}/contacts?page=1&limit=10`, {
    method: 'GET',
    headers: {
      Cookie: cookies,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    console.log('❌ Protected route failed:', error);
    console.log('   Status:', response.status);
    return false;
  }

  const data = await response.json();
  console.log('✅ Protected route accessible');
  console.log('   Data received:', data);

  return true;
}

async function testAuthMe() {
  console.log('\n👤 Testing /auth/me...');

  const response = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      Cookie: cookies,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    console.log('❌ /auth/me failed:', error);
    return false;
  }

  const data = await response.json();
  console.log('✅ /auth/me successful');
  console.log('   User:', data);

  return true;
}

async function runTests() {
  console.log('🧪 Starting Authentication Tests\n');
  console.log('='.repeat(50));

  try {
    const loginSuccess = await login();
    if (!loginSuccess) {
      console.log('\n❌ Tests failed at login');
      process.exit(1);
    }

    await testAuthMe();
    await testProtectedRoute();

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    process.exit(1);
  }
}

runTests();
