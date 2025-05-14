'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cart } = useCart();

  // Total quantity of items in the cart
  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      {/* Brand */}
      <Link href="/" className="navbar-brand">
        🛍 Shop
      </Link>

      {/* Toggle button for mobile */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon" />
      </button>

      {/* Nav links */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link href="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/add-campaign" className="nav-link">
              Add Campaign
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/cart" className="nav-link d-flex align-items-center gap-1">
              Cart
              {cartItemCount > 0 && (
                <span className="badge bg-danger rounded-pill">{cartItemCount}</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
