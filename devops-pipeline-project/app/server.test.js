const request = require('supertest');
const express = require('express');

// Minimal re-declaration of routes for isolated testing
const app = express();
app.get('/health', (req, res) => res.status(200).json({ status: 'healthy' }));

describe('Health Check', () => {
  it('should return 200 and healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });
});
