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

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Journal API - Login</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 400px;
          padding: 40px;
        }
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 10px;
          font-size: 28px;
        }
        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
        }
        .tabs {
          display: flex;
          margin-bottom: 30px;
          border-bottom: 2px solid #eee;
        }
        .tab {
          flex: 1;
          padding: 12px;
          text-align: center;
          cursor: pointer;
          color: #666;
          font-weight: 500;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
        }
        .tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 500;
          font-size: 14px;
        }
        input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #eee;
          border-radius: 10px;
          font-size: 14px;
          transition: border-color 0.3s;
        }
        input:focus {
          outline: none;
          border-color: #667eea;
        }
        button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }
        button:active {
          transform: translateY(0);
        }
        .message {
          margin-top: 20px;
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          font-size: 14px;
          display: none;
        }
        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .token-display {
          margin-top: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          display: none;
        }
        .token-display.show {
          display: block;
        }
        .token-label {
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          font-size: 12px;
          text-transform: uppercase;
        }
        .token-value {
          background: white;
          padding: 10px;
          border-radius: 6px;
          word-break: break-all;
          font-family: monospace;
          font-size: 11px;
          color: #667eea;
          border: 1px solid #eee;
        }
        .hidden { display: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📔 Journal API</h1>
        <p class="subtitle">Sign in or create an account</p>
        
        <div class="tabs">
          <div class="tab active" onclick="showTab('login')">Login</div>
          <div class="tab" onclick="showTab('register')">Register</div>
        </div>

        <form id="loginForm" onsubmit="handleLogin(event)">
          <div class="form-group">
            <label for="loginEmail">Email</label>
            <input type="email" id="loginEmail" required>
          </div>
          <div class="form-group">
            <label for="loginPassword">Password</label>
            <input type="password" id="loginPassword" required>
          </div>
          <button type="submit">Login</button>
        </form>

        <form id="registerForm" class="hidden" onsubmit="handleRegister(event)">
          <div class="form-group">
            <label for="registerUsername">Username</label>
            <input type="text" id="registerUsername" required>
          </div>
          <div class="form-group">
            <label for="registerEmail">Email</label>
            <input type="email" id="registerEmail" required>
          </div>
          <div class="form-group">
            <label for="registerPassword">Password</label>
            <input type="password" id="registerPassword" required minlength="6">
          </div>
          <button type="submit">Create Account</button>
        </form>

        <div id="message" class="message"></div>
        
        <div id="tokenDisplay" class="token-display">
          <div class="token-label">Your Access Token:</div>
          <div class="token-value" id="tokenValue"></div>
        </div>
      </div>

      <script>
        // Set your API base URL here
        const API_BASE_URL = window.location.origin; // Uses current domain/port
        
        function showTab(tab) {
          const tabs = document.querySelectorAll('.tab');
          tabs.forEach(t => t.classList.remove('active'));
          event.target.classList.add('active');
          
          document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
          document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
          document.getElementById('message').style.display = 'none';
          document.getElementById('tokenDisplay').classList.remove('show');
        }

        function showMessage(text, type) {
          const msg = document.getElementById('message');
          msg.textContent = text;
          msg.className = 'message ' + type;
          msg.style.display = 'block';
        }

        function showToken(token) {
          document.getElementById('tokenValue').textContent = token;
          document.getElementById('tokenDisplay').classList.add('show');
        }

        async function handleLogin(e) {
          e.preventDefault();
          const email = document.getElementById('loginEmail').value;
          const password = document.getElementById('loginPassword').value;

          try {
            const response = await fetch(API_BASE_URL + '/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
              showMessage('Login successful! 🎉', 'success');
              showToken(data.data.token);
              localStorage.setItem('token', data.data.token);
            } else {
              showMessage(data.error || 'Login failed', 'error');
            }
          } catch (error) {
            console.error('Login error:', error);
            showMessage('Connection error. Please try again.', 'error');
          }
        }

        async function handleRegister(e) {
          e.preventDefault();
          const username = document.getElementById('registerUsername').value;
          const email = document.getElementById('registerEmail').value;
          const password = document.getElementById('registerPassword').value;

          try {
            const response = await fetch(API_BASE_URL + '/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (data.success) {
              showMessage(data.message + ' 🎉 You can now login.', 'success');
              setTimeout(() => showTab('login'), 2000);
            } else {
              showMessage(data.error || 'Registration failed', 'error');
            }
          } catch (error) {
            console.error('Register error:', error);
            showMessage('Connection error. Please try again.', 'error');
          }
        }
      </script>
    </body>
    </html>
  `);
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

