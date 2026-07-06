const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let requestCount = 0;

app.use((req, res, next) => {
  requestCount++;
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from your CI/CD pipeline!',
    version: process.env.APP_VERSION || '1.0.0',
    hostname: require('os').hostname(),
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint - used by Docker/Kubernetes/Load Balancer
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

// Basic metrics endpoint - can be scraped by Prometheus
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(
    `app_requests_total ${requestCount}\napp_uptime_seconds ${process.uptime()}\n`
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
