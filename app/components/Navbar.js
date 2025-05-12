'use client';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cart } = useCart();
  
  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" href="/">🛍 Shop</Link>
      <button 
        className="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" href="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/add-campaign">Add Campaign</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/cart">
              Cart {cartItemCount > 0 && <span className="badge bg-danger">{cartItemCount}</span>}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
