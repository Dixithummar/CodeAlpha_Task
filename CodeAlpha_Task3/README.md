# VulnerableShopApp – CodeAlpha Cyber Security Internship Project

Author: **Dixit Thummar – Cyber Security Intern (CodeAlpha)**  
Project: **TASK 3 (SECURE CODING REVIEW)** (Juice Shop style)

> **Warning:** This application is purposely vulnerable and for training only.  
> Do **NOT** deploy to production or expose to the public internet.

---
  

## 1. How to Run the Application

From the project root:

```bash
npm install
node server.js
```

Then open: `http://localhost:3000`

The SQLite database is **in‑memory**, so every time you restart `node server.js`, the data is freshly recreated.

---

## 2. Technology Stack & Structure

- **Backend**: Node.js, Express, in‑memory SQLite (`server.js`)
- **Frontend**: Plain HTML + modern dark CSS + small vanilla JS (`public/`)

**Folder layout**

```text
VulnerableShopApp/
├── package.json
├── server.js
├── public/
│   ├── index.html     # Homepage – product catalog + cart
│   ├── login.html     # SQL Injection demo (login)
│   ├── search.html    # XSS demo (forwards to /search endpoint)
│   ├── profile.html   # Broken authentication / IDOR demo
│   ├── admin.html     # Insecure deserialization / RCE demo
│   ├── style.css      # Dark ecommerce theme
│   └── app.js         # Cart + AJAX + login popup logic
└── README.md
```

All vulnerable spots in `server.js` are clearly marked with comments:

- `// VULNERABILITY: SQL INJECTION`
- `// VULNERABILITY: XSS`
- `// VULNERABILITY: BROKEN AUTHENTICATION`
- `// VULNERABILITY: INSECURE DESERIALIZATION / CODE EXECUTION`

---

## 3. Demo Data – Indian Users & Products

### 3.1 Users (created every time the server starts)

The app uses a `users` table with 10 Indian‑style demo accounts. Some key ones:

- `id=1` – **Dixit Thummar**
  - Email: `dixit@shop.com`
  - Password: `dixit123`
  - Role: `admin`
  - Tier: `Owner`
- `id=2` – **Rajesh Kumar**
  - Email: `admin@shop.com`
  - Password: `admin`
  - Role: `customer`
  - Tier: `Customer`
- `id=3` – **Priya Patel** – `priya@shop.com / priya123` (customer)
- `id=4` – **Aarav Verma** – `aarav@shop.com / aarav123` (customer)
- `id=5` – **Kavya Iyer** – `kavya@shop.com / kavya123` (premium)
- `id=6` – **Rahul Singh** – `rahul@shop.com / rahul123`
- `id=7` – **Sneha Nair** – `sneha@shop.com / sneha123`
- `id=8` – **Ananya Desai** – `ananya@shop.com / ananya123`
- `id=9` – **Rohan Gupta** – `rohan@shop.com / rohan123`
- `id=10` – **Meera Joshi** – `meera@shop.com / meera123` (premium)

The **owner / main admin** of the application is **Dixit Thummar** (`id=1`). This matches the internship identity and can be shown clearly in the report.

### 3.2 Products and Orders

- 12 juice products (Strawberry Blast, Mango Tango, etc.) seeded with:
  - Name, description, price, rating, simple stock flag.
- `orders` table simulates past purchases for different users (including Dixit and others) to make the profile page and admin statistics look realistic.

---

## 4. Pages & How the Vulnerabilities Work

### 4.1 Homepage – `index.html` (Product Catalog & Cart)

**URL:** `http://localhost:3000/`

What you see:

- Dark Indian‑style juice shop UI.
- Cards for 12 juices with price, rating, and **“Add to Cart”** buttons.
- Floating cart pill that opens a slide‑in cart drawer (purely client‑side / fake checkout).
- Testimonials mentioning **Dixit Thummar (Owner)**, Priya and Rajesh.

Purpose for internship:

- Shows that the vulnerable application still looks like a real ecommerce site.
- Great for screenshots in reports and LinkedIn posts (professional UI + vulnerabilities behind the scenes).

### 4.2 SQL Injection – `/login` (POST) via `login.html`

**Page URL:** `http://localhost:3000/login.html`  
**API URL:** `POST /login`

Relevant code (simplified):

```js
// VULNERABILITY: SQL INJECTION
const query =
  "SELECT * FROM users WHERE email='" + username + "' AND password='" + password + "'";
db.all(query, ...);
```

- The query is built by string concatenation with **no parameter binding**.
- This allows classic SQL injection on the `email` field.

On the **Login page**:

- You can log in normally as:
  - `dixit@shop.com / dixit123` (Owner / admin)
  - `admin@shop.com / admin` (Rajesh – customer)
- Or exploit SQL injection using the examples shown on the page:
  - Bypass with real admin email (Dixit as Owner):
    - Email: `dixit@shop.com'--`
    - Password: anything
  - Generic bypass that often returns the first row:
    - Email: `' OR 1=1--`
    - Password: anything

What happens on success:

- JSON response from `/login` returns `success: true`, the vulnerable `query`, and the selected user.
- Frontend (`app.js`) stores user info in `localStorage` as a fake session.
- A **green toast popup** appears: “Congratulations, [Name]! You logged in successfully.”
- The navbar shows `Hi, [Name] (role)`.
- You are automatically redirected to `/profile?userId=[id]`.

How to explain in report:

- Show screenshot of login form, successful normal login (Dixit), then SQLi login using `' OR 1=1--`.
- Include the vulnerable query from `server.js` and explain that an attacker can bypass authentication and log in as any user.

### 4.3 Reflected XSS – `/search` (GET) via `search.html`

**Page URL:** `http://localhost:3000/search.html`  
**API URL:** `GET /search?q=...`

Simplified vulnerable code:

```js
// VULNERABILITY: XSS
const html = `
  <h2>Search: ${q}</h2>
  <input name="q" value="${q}" />
  ...
`;
```

- The search term `q` is directly injected into HTML with **no escaping**, creating a reflected XSS.

How to test:

- Open:  
  `http://localhost:3000/search?q=<script>alert('XSS')</script>`
- Or use an HTML injection payload such as:  
  `http://localhost:3000/search?q=<img src=x onerror=alert(1)>`

Expected behavior:

- The browser executes your script and shows an `alert`, demonstrating reflected XSS.

Report usage:

- Screenshot the search form, then the resulting page with your XSS payload executed.
- Explain that any user performing a search could have malicious JavaScript executed in their browser.

### 4.4 Broken Authentication / IDOR – `/profile` (GET) via `profile.html`

**Page URL:** `http://localhost:3000/profile.html`  
**API URL:** `GET /profile?userId=N`

Simplified vulnerable code:

```js
// VULNERABILITY: BROKEN AUTHENTICATION
// Any user can view any profile just by changing the userId query string.
db.get('SELECT * FROM users WHERE id = ?', [userId], ...);
```

- No real session checking.
- No verification that the logged‑in user “owns” the profile being requested.
- Direct Object Reference via `userId` → an **IDOR / insecure direct object reference**.

How to use:

- Login as any user (or use SQLi to become Dixit).
- Then **manually change the URL**:
  - `http://localhost:3000/profile?userId=1` → **Dixit Thummar (Owner / admin)** with trophy badge.
  - `http://localhost:3000/profile?userId=2` → Rajesh Kumar (customer).
  - `http://localhost:3000/profile?userId=3` → Priya Patel.
  - Any ID from `1` to `10` shows a different Indian user.

Report usage:

- Screenshot profile page for two different `userId` values.
- Explain that by only changing the `userId` parameter, an attacker can read other users’ profile data and order history.

### 4.5 Insecure Deserialization / RCE – `/admin/config` (POST) via `admin.html`

**Page URL:** `http://localhost:3000/admin.html`  
**API URL:** `POST /admin/config`

Simplified vulnerable code:

```js
// VULNERABILITY: INSECURE DESERIALIZATION / CODE EXECUTION
const obj = eval('(' + config + ')');
if (obj && typeof obj.cmd === 'string') {
  require('child_process').execSync(obj.cmd);
}
```

- The admin “config” is parsed using **`eval`** on user input.
- If a `cmd` property exists, it executes system commands on the server.

How to test from the UI:

1. Open `http://localhost:3000/admin.html`
2. In the textarea, use payloads like:

   ```json
   { "cmd": "dir" }
   ```

   (On Linux/macOS use `{ "cmd": "ls" }`)

3. Submit the form. The response displays:
   - `parsed`: the evaluated object.
   - `commandOutput` or `commandError`: raw output or error from the command.

Report usage:

- Screenshot the admin panel, the payload in the textarea, and the JSON response.
- Explain this as an example of **insecure deserialization leading to Remote Code Execution (RCE)**.

---

## 5. How to Use This Project in Your CodeAlpha Internship

You can structure your internship report / documentation as follows:

1. **Introduction**
   - Mention that you (Dixit Thummar) built a realistic vulnerable ecommerce application for CodeAlpha.
   - Explain that the goal is to practice detecting, exploiting, and explaining common web vulnerabilities.

2. **Architecture Overview**
   - Add a diagram or bullet points from this README (Express + SQLite, `public` frontend).
   - Describe the four main pages: Home, Login, Search, Profile, Admin.

3. **Per‑Vulnerability Sections**
   For each issue (SQLi, XSS, Broken Auth/IDOR, Insecure Deserialization):
   - **Location**: endpoint + function in `server.js`.
   - **Vulnerable code**: include the snippet with `// VULNERABILITY:` comment.
   - **Steps to reproduce**: URL, payloads, and which user you logged in as.
   - **Impact**: what an attacker gains (e.g., login as Owner, execute commands).
   - **Screenshots**: from the real UI showing:
     - Login success toast with Dixit as Owner.
     - XSS alert box.
     - Profile pages for different `userId` values.
     - Admin panel with command output.
   - **Mitigation**: short explanation of how to fix (parameterized queries, escape output, enforce session checks, remove `eval`, etc.).

4. **Conclusion**
   - Summarize what you learned about web vulnerabilities.
   - Mention how this project demonstrates your skills as a **Cyber Security Intern** at CodeAlpha (finding, exploiting and documenting vulnerabilities in a realistic application).

---

## 6. Summary

VulnerableShopApp is a **modern‑looking but intentionally insecure juice shop** application, customized with Indian users and ownership by **Dixit Thummar**.  
It provides a complete environment to demonstrate SQL Injection, XSS, Broken Authentication/IDOR and Insecure Deserialization, along with realistic content suitable for CodeAlpha internship reports, screenshots and presentations.
