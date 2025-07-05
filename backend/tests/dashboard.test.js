const request = require('supertest');
const express = require('express');
const dashboardRoutes = require('../routes/dashboard.js');
const verifyToken = require('../middleware/verifyToken.js');
const User = require('../models/User.js');

// Mock express app
const app = express();
app.use(express.json());
app.use('/backend/dashboard', dashboardRoutes);

// Mock verifyToken middleware to bypass auth for testing
jest.mock('../middleware/verifyToken.js', () => (req, res, next) => {
  req.user = { id: 'testuserid' };
  next();
});

// Mock User model
jest.mock('../models/User.js');

describe('Dashboard Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /backend/dashboard/leaderboard returns leaderboard data', async () => {
    const mockUsers = [
      {
        _id: '1',
        email: 'user1@example.com',
        points: 300,
        level: 2,
        badges: [{ id: 'b1' }],
      },
      {
        _id: '2',
        email: 'user2@example.com',
        points: 500,
        level: 3,
        badges: [{ id: 'b2' }, { id: 'b3' }],
      },
      {
        _id: 'testuserid',
        email: 'currentuser@example.com',
        points: 400,
        level: 2,
        badges: [],
      }
    ];

    User.find.mockResolvedValue(mockUsers);

    const res = await request(app)
      .get('/backend/dashboard/leaderboard')
      .set('Authorization', 'Bearer faketoken');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user: expect.objectContaining({ id: '2' }),
          totalPoints: 500,
          rank: 1,
        }),
        expect.objectContaining({
          user: expect.objectContaining({ id: 'testuserid' }),
          totalPoints: 400,
        }),
      ])
    );
  });
});
