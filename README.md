# E-commerce App (CS391 Project)

A full-featured e-commerce application built with Next.js (App Router), React, Bootstrap, and json-server for the backend.

## Features

- Home page with product listing
- Campaign carousel with 3+ slides
- Product detail page with reviews and ratings
- Shopping cart with item management
- Add new campaigns

## Tech Stack

- **Frontend**: React, Next.js (App Router), Bootstrap, React-Bootstrap
- **Backend**: json-server (for mock API)
- **State Management**: React Context API
- **API Calls**: Axios
- **Package Management**: npm

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev:all
```

This will start both the Next.js application and the json-server API.

- Frontend: http://localhost:3000
- API: http://localhost:5000

## Project Structure

```
ecommerce-app/
├── app/                   # Next.js app directory
│   ├── add-campaign/      # Add Campaign page
│   ├── cart/              # Cart page
│   ├── components/        # Reusable components
│   ├── context/           # Context providers
│   ├── data/              # Static data
│   ├── product/           # Product detail page
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── data.json              # JSON server data
├── public/                # Static assets
└── package.json           # Project dependencies
```

## API Endpoints

- `GET /products` - Get all products
- `GET /products/:id` - Get a single product
- `GET /campaigns` - Get all campaigns
- `POST /campaigns` - Create a campaign
- `GET /cart` - Get cart items
- `POST /cart` - Add item to cart
- `PUT /cart/:id` - Update cart item
- `DELETE /cart/:id` - Remove item from cart
- `GET /reviews?productId=:id` - Get reviews for a product
- `POST /reviews` - Add a review

## Features Implemented

- **Navbar** with Home, Add Campaign, and Cart links
- **Campaign Carousel** showing promotional campaigns
- **Search and Sort** functionality for products
- **Product Grid** with cards displaying products
- **"Add to Cart"** button on product cards
- **Product Detail Page** with image, description, price
- **Review System** with star ratings
- **Add Campaign Page** with form to add new campaigns
- **Cart Management** with quantity updates, item deletion, notes
- **Checkout Process** with order summary and payment (dummy)

## License

MIT
