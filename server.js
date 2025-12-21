// ===================================
// FILE STRUCTURE:
// project/
// ├── server.js
// ├── package.json
// ├── .env
// ├── config/
// │   └── db.js
// ├── middleware/
// │   └── auth.js
// └── routes/
//     ├── auth.js
//     ├── users.js
//     └── journalEntries.js
// ===================================

// ===================================
// server.js
// ===================================
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const journalEntriesRouter = require('./routes/journalEntries');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});

app.use('/api/journal-entries', journalEntriesRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);



app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}`);
});

