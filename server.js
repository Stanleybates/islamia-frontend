const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the built static files
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback: any route that isn't a real static file gets index.html,
// letting React Router take over and render the correct page client-side.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
