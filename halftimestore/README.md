# HALFTIME STORE

A premium football merchandise store front-end, focused on a sleek, responsive, and easy-to-understand user experience. Built with pure HTML, CSS, and vanilla JavaScript. 

This project is a static frontend. It does not require a backend or a build step to run.

## Features

- **Product Catalogue**: Display football jerseys from top clubs across Europe.
- **Search**: Fully functional search by product name and team name.
- **Product Details**: View product images, descriptions, select sizes, and add to cart.
- **Shopping Cart**: Add items, increase/decrease quantities, remove items, and see live subtotal updates. Includes persistent state via LocalStorage.
- **Checkout Flow**: 2-step frontend mock checkout process with validation for shipping details and payment card information (for demonstration). 

## Running Locally

Since this is a static site, you can view it simply by opening `index.html` in your web browser. 

For the best experience and to avoid CORS issues on local files (though they are minimal here), use a simple local server:

### Python
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`

### Node.js (http-server)
```bash
npx http-server
```

## Deployment

This project is deployment-ready for static hosting platforms like **Vercel**, **Netlify**, or **GitHub Pages**.

- Push the repository to GitHub.
- Connect the repository to your chosen platform.
- Deploy the root directory. No build command is necessary.
