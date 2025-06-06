🛍️ E-commerce App — CS391 Project
A fully functional e-commerce web application built with Next.js (App Router), React, Bootstrap, and json-server for a mock backend API.

🚀 Features
🏠 Home page with product grid, search, filter, and sort

📢 Campaign carousel (3+ slides)

🛒 Shopping cart with quantity control, delete, and notes

📦 Product detail page with reviews and ratings

➕ Add Campaign page (POST to backend)

💳 Checkout modal with order summary and dummy payment

🧰 Tech Stack
Frontend: Next.js (App Router), React, Bootstrap, React-Bootstrap

Backend: json-server (mock REST API)

State Management: React Context API

HTTP Requests: Axios

Package Manager: npm

🛠️ Getting Started
✅ Prerequisites
Node.js (v18+ recommended)

npm

📦 Installation
Clone the repository:

bash
Copy
Edit
git clone <repository-url>
cd ecommerce-app
Install dependencies:

bash
Copy
Edit
npm install
Start the development server and backend:

bash
Copy
Edit
npm run dev:all
This runs both:

Frontend: http://localhost:3000

Backend (json-server): http://localhost:5000

🗂 Project Structure
csharp
Copy
Edit
ecommerce-app/
├── app/
│   ├── add-campaign/        # Campaign form page
│   ├── cart/                # Shopping cart page
│   ├── product/             # Product detail page
│   ├── components/          # Shared UI components
│   ├── context/             # CartContext Provider
│   ├── globals.css          # Global styles
│   ├── layout.js            # Root layout (Navbar, Bootstrap, Fonts)
│   └── page.js              # Home page
├── data.json                # json-server data
├── public/                  # Static assets
└── package.json             # Dependencies and scripts
📡 API Endpoints (json-server)
Method	Endpoint	Description
GET	/products	Get all products
GET	/products/:id	Get a product by ID
GET	/campaigns	Get all campaigns
POST	/campaigns	Add a new campaign
GET	/cart	Get all cart items
POST	/cart	Add item to cart
PUT	/cart/:id	Update cart item
DELETE	/cart/:id	Delete cart item
GET	/reviews?productId=:id	Get product reviews
POST	/reviews	Add a new review

🧪 Implemented Features
✅ Navbar with Home, Add Campaign, Cart

✅ Campaign Carousel with auto-slide and responsive images

✅ Search / Sort / Filter on Home Page

✅ Product Cards with image, title, price, and "Add to Cart"

✅ Cart Page with:

Quantity control

Item notes

Remove button

Order summary

Checkout modal

✅ Product Detail Page with:

Description

Rating & Reviews

Add Review form

✅ Add Campaign Page with form and POST submission

🪪 License
MIT License — Free to use and modify for educational purposes.

## Environment Variables
Create a `.env.local` file based on `.env.local.example` to configure the API URL:

```
cp .env.local.example .env.local
```

## Running Tests
Install dependencies and run:

```
npm test
```
