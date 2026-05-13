const express = require('express');

const app = express();

const PORT = 3000;

app.use(express.static('public'));

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello from DevOps Lab App'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'UP'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
}

module.exports = app;
