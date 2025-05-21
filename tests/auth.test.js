// tests/auth.test.js
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mPrismaClient),
  };
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const request = require('supertest');
const app = require('../index');

describe('Auth Routes', () => {
  const testEmail = 'testuser@example.com';
  const testPassword = 'test1234';

  beforeAll(async () => {
    // Clean up if user exists
    prisma.user.deleteMany.mockResolvedValue({});
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    // Mock findUnique returns null (no existing user)
    prisma.user.findUnique.mockResolvedValue(null);
    // Mock create returns fake user
    prisma.user.create.mockResolvedValue({ id: 1, email: testEmail });

    const res = await request(app).post('/auth/signup').send({
      email: testEmail,
      password: testPassword
    });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.message).toBeDefined();
    expect(res.body.userId).toBeDefined();
  });

  it('should not allow duplicate registration', async () => {
    // Mock findUnique returns existing user
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: testEmail });

    const res = await request(app).post('/auth/signup').send({
      email: testEmail,
      password: testPassword
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe('User with this email already exists');
  });

  it('should return 400 if signup data is missing', async () => {
    const res = await request(app).post('/auth/signup').send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Email and password are required');
  });

  it('should login the user and return a token', async () => {
    // Mock findUnique returns existing user with hashed password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    prisma.user.findUnique.mockResolvedValue({ id: 1, email: testEmail, password: hashedPassword });

    const res = await request(app).post('/auth/login').send({
      email: testEmail,
      password: testPassword
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    global.token = res.body.token; // if needed for other tests
  });

  it('should return 400 if login data is missing', async () => {
    const res = await request(app).post('/auth/login').send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Email and password are required');
  });

  it('should return 401 for invalid credentials (wrong password)', async () => {
    // Mock findUnique returns existing user with hashed password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    prisma.user.findUnique.mockResolvedValue({ id: 1, email: testEmail, password: hashedPassword });

    const res = await request(app).post('/auth/login').send({
      email: testEmail,
      password: 'wrongpassword'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('should return 401 for invalid credentials (non-existing user)', async () => {
    // Mock findUnique returns null (user not found)
    prisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app).post('/auth/login').send({
      email: 'doesnotexist@example.com',
      password: 'anypassword'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('should handle server error during signup gracefully', async () => {
    // Make findUnique throw error for this test
    prisma.user.findUnique.mockRejectedValueOnce(new Error('Simulated DB error'));

    const res = await request(app).post('/auth/signup').send({
      email: 'errorcase@example.com',
      password: 'password'
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});
