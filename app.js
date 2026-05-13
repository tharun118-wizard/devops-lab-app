const express = require('express');

const app = express();

const PORT = 3000;

// Serve frontend
app.use(express.static('public'));

// API route
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello from DevOps Lab App'
  });
});

// Health route
app.get('/health', (req, res) => {
  res.json({
    status: 'UP'
  });
});

// Start server only if file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
}

// Export app for testing
module.exports = app;
