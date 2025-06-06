'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link href="/" className="navbar-brand fs-4">
          🛒 ShopMate
        </Link>

        <ul className="navbar-nav flex-row align-items-center mb-0 gap-4">
          <li className="nav-item">
            <Link href="/" className="nav-link text-white">
              🏠 Home
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/add-campaign" className="nav-link text-white">
              📢 Add Campaign
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/cart" className="nav-link text-white d-flex align-items-center gap-1">
              🛍️ Cart
              {cartItemCount > 0 && (
                <span className="badge bg-danger rounded-pill">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
