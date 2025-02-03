# **Backend - HTML Accessibility Checker - By Emmanuel Paul**

This backend is built with **Node.js and Express.js** and provides an API for analyzing HTML files for accessibility issues.

---

## **📌 Prerequisites**
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

---

## **🚀 Setup Instructions**

### **1️⃣ Install Dependencies**
```sh
npm install
```

### **2️⃣ Start the Server**
```sh
node server.js
```

### **3️⃣ API Endpoints**

- **Upload HTML File:** `POST http://localhost:3001/api/upload`
- **Expected Response:**

```json
{
  "score": 80,
  "issues": [
    { "description": "Image missing alt attribute.", "element": "<img src='logo.png'>" },
    { "description": "Skipped heading level: Found <h3> after <h1>", "element": "<h3>Main Section</h3>" }
  ]
}
```

---

## **✅ Summary**

| Component                | Command          |
| ------------------------ | ---------------- |
| **Install Dependencies** | `npm install`    |
| **Run Backend**          | `node server.js` |

Your backend is now set up and ready to analyze HTML files for accessibility! 🚀