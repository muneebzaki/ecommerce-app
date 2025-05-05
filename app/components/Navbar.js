'use client';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" href="/">🛍 Shop</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" href="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/cart">Cart</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/add-campaign">Add Campaign</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
