const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// --- Database setup (in-memory SQLite) ---
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      tier TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      rating REAL NOT NULL,
      in_stock INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  const userStmt = db.prepare(
    'INSERT INTO users (email, password, role, name, tier) VALUES (?, ?, ?, ?, ?)'
  );
  // Indian users for more local, realistic data (including the student's name)
  // Dixit is the primary admin / owner (id=1)
  userStmt.run('dixit@shop.com', 'dixit123', 'admin', 'Dixit Thummar', 'Owner');
  // Rajesh is now a normal customer (id=2)
  userStmt.run('admin@shop.com', 'admin', 'customer', 'Rajesh Kumar', 'Customer');
  userStmt.run('priya@shop.com', 'priya123', 'customer', 'Priya Patel', 'Silver');
  userStmt.run('aarav@shop.com', 'aarav123', 'customer', 'Aarav Verma', 'Bronze');
  userStmt.run('kavya@shop.com', 'kavya123', 'premium', 'Kavya Iyer', 'Platinum');
  userStmt.run('rahul@shop.com', 'rahul123', 'customer', 'Rahul Singh', 'Customer');
  userStmt.run('sneha@shop.com', 'sneha123', 'customer', 'Sneha Nair', 'Customer');
  userStmt.run('ananya@shop.com', 'ananya123', 'customer', 'Ananya Desai', 'Customer');
  userStmt.run('rohan@shop.com', 'rohan123', 'customer', 'Rohan Gupta', 'Customer');
  userStmt.run('meera@shop.com', 'meera123', 'premium', 'Meera Joshi', 'Premium');
  userStmt.finalize();

  const products = [
    ['Strawberry Blast', 'Fresh strawberries blended with lime.', 4.99],
    ['Mango Tango', 'Ripe mango with a citrus twist.', 5.99],
    ['Blueberry Bomb', 'Blueberries and acai power mix.', 6.99],
    ['Citrus Rush', 'Orange, lemon and grapefruit combo.', 4.49],
    ['Green Detox', 'Kale, spinach, apple and ginger.', 6.49],
    ['Pineapple Punch', 'Pineapple, coconut and mint.', 5.49],
    ['Watermelon Wave', 'Chilled watermelon refresher.', 3.99],
    ['Berry Fusion', 'Strawberry, raspberry and blackberry.', 5.49],
    ['Tropical Sunrise', 'Mango, pineapple and passion fruit.', 6.29],
    ['Ginger Shot', 'Concentrated ginger and lemon shot.', 2.99],
    ['Carrot Glow', 'Carrot, orange and turmeric.', 4.79],
    ['Protein Power', 'Banana, peanut butter and whey.', 7.49]
  ];

  const prodStmt = db.prepare(
    'INSERT INTO products (name, description, price, image, rating, in_stock) VALUES (?, ?, ?, ?, ?, ?)'
  );
  products.forEach(([name, description, price], idx) => {
    const rating = 4.3 + (idx % 3) * 0.2;
    prodStmt.run(
      name,
      description,
      price,
      `/images/juice-${idx + 1}.png`,
      rating,
      1
    );
  });
  prodStmt.finalize();

  const orderStmt = db.prepare(
    'INSERT INTO orders (user_id, product_id, quantity, created_at) VALUES (?, ?, ?, ?)'
  );
  // Sample Indian customer orders
  orderStmt.run(2, 1, 2, '2025-01-03'); // Dixit
  orderStmt.run(2, 3, 1, '2025-02-10');
  orderStmt.run(3, 2, 3, '2025-03-21'); // Priya
  orderStmt.run(4, 8, 1, '2025-04-15'); // Aarav
  orderStmt.run(5, 5, 2, '2025-05-02'); // Kavya
  orderStmt.run(6, 6, 1, '2025-05-18'); // Rahul
  orderStmt.run(7, 4, 1, '2025-06-09'); // Sneha
  orderStmt.run(8, 9, 2, '2025-06-21'); // Ananya
  orderStmt.run(9, 7, 1, '2025-07-03'); // Rohan
  orderStmt.run(10, 11, 3, '2025-07-12'); // Meera
  orderStmt.finalize();
});

// --- Middleware & static files ---
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Basic pages ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/search.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.get('/profile.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// --- API: product listing for homepage ---
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// --- CART (fake, in-memory only on client). No server state needed but kept for realism.
app.post('/api/checkout', (req, res) => {
  res.json({
    success: true,
    message: 'Checkout demo only. No real payment processed.',
    orderPreview: req.body
  });
});

// --- 1) SQL Injection vulnerability on login ---
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // VULNERABILITY: SQL INJECTION
  const query =
    "SELECT * FROM users WHERE email='" + username + "' AND password='" + password + "'";

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message, query });
    }
    if (rows.length > 0) {
      return res.json({
        success: true,
        message: 'Logged in (vulnerable SQL query used).',
        user: rows[0],
        query
      });
    }
    res.status(401).json({
      success: false,
      message: 'Invalid credentials (but query was still vulnerable).',
      query
    });
  });
});

// --- 2) XSS vulnerability on /search ---
app.get('/search', (req, res) => {
  const q = req.query.q || '';

  db.all(
    'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?',
    [`%${q}%`, `%${q}%`],
    (err, rows) => {
      const results = rows || [];

      // VULNERABILITY: XSS
      // The raw search term is reflected into the HTML without any escaping or sanitization.
      const html = `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <title>Search Results - VulnerableShop</title>
            <link rel="stylesheet" href="/style.css" />
          </head>
          <body class="page">
            <main class="container">
              <header class="header">
                <h1>Product Search</h1>
                <p class="subtitle">This page intentionally reflects your query without escaping.</p>
              </header>

              <nav class="nav">
                <a href="/" class="nav-link">Home</a>
                <a href="/login.html" class="nav-link">Login</a>
                <a href="/search.html" class="nav-link active">Search</a>
                <a href="/profile.html" class="nav-link">Profile</a>
                <a href="/admin.html" class="nav-link">Admin</a>
              </nav>

              <section class="card">
                <h2>Search: ${q}</h2>
                <form class="form" method="GET" action="/search">
                  <label>
                    Search again
                    <input name="q" type="text" value="${q}" />
                  </label>
                  <button class="btn btn-primary" type="submit">Search Products</button>
                </form>
                <div class="grid grid-compact">
                  ${results
                    .map(
                      (p) => `
                    <article class="card mini">
                      <h3>${p.name}</h3>
                      <p>${p.description}</p>
                      <p><strong>$${p.price.toFixed(2)}</strong> · Rating ${p.rating.toFixed(1)}★</p>
                    </article>
                  `
                    )
                    .join('') || '<p class="hint">No results found.</p>'}
                </div>
              </section>
            </main>
          </body>
        </html>
      `;

      if (err) {
        return res.status(500).send('Error loading search results');
      }

      res.send(html);
    }
  );
});

// --- 3) Broken Authentication on /profile ---
app.get('/profile', (req, res) => {
  const userId = req.query.userId;

  // VULNERABILITY: BROKEN AUTHENTICATION
  // Any user can view any profile just by changing the userId query string.
  // No session, no ownership checks.
  if (!userId) {
    return res.redirect('/profile.html');
  }

  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(404).send('<h1>User not found</h1>');
    }

    db.all(
      'SELECT o.id, o.quantity, o.created_at, p.name, p.price FROM orders o JOIN products p ON o.product_id = p.id WHERE o.user_id = ?',
      [userId],
      (orderErr, orders) => {
        if (orderErr) {
          return res.status(500).send('Error loading orders');
        }

        const trophy =
          user.id === 1
            ? '<div class="badge badge-admin">🏆 Basket Full of Challenges (Admin)</div>'
            : '';

        const html = `
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="utf-8" />
              <title>User Profile - VulnerableShop</title>
              <link rel="stylesheet" href="/style.css" />
            </head>
            <body class="page">
              <main class="container">
                <header class="header">
                  <h1>User Profile</h1>
                  <p class="subtitle">This profile is loaded only from the userId query parameter.</p>
                </header>

                <nav class="nav">
                  <a href="/" class="nav-link">Home</a>
                  <a href="/login.html" class="nav-link">Login</a>
                  <a href="/search.html" class="nav-link">Search</a>
                  <a href="/profile.html" class="nav-link active">Profile</a>
                  <a href="/admin.html" class="nav-link">Admin</a>
                </nav>

                <section class="grid">
                  <article class="card">
                    <h2>${user.name}</h2>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Role:</strong> ${user.role}</p>
                    <p><strong>Membership:</strong> ${user.tier}</p>
                    ${trophy}
                  </article>

                  <article class="card">
                    <h2>Order History</h2>
                    ${
                      orders.length === 0
                        ? '<p class="hint">No orders yet.</p>'
                        : `<ul class="order-list">
                            ${orders
                              .map(
                                (o) =>
                                  `<li>#${o.id} · ${o.quantity} × ${o.name} · $${(
                                    o.price * o.quantity
                                  ).toFixed(2)} on ${o.created_at}</li>`
                              )
                              .join('')}
                          </ul>`
                    }
                  </article>
                </section>
              </main>
            </body>
          </html>
        `;

        res.send(html);
      }
    );
  });
});

// --- 4) Insecure Deserialization / Admin config ---
app.post('/admin/config', (req, res) => {
  const { config } = req.body;

  // VULNERABILITY: INSECURE DESERIALIZATION / CODE EXECUTION
  // Directly eval user-controlled string as JavaScript object.
  try {
    const obj = eval('(' + config + ')');
    let result = { parsed: obj };

    if (obj && typeof obj.cmd === 'string') {
      try {
        const out = require('child_process').execSync(obj.cmd).toString();
        result.commandOutput = out;
      } catch (e) {
        result.commandError = e.message;
      }
    }

    res.json({ success: true, ...result });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`VulnerableShopApp listening on http://localhost:${PORT}`);
});


