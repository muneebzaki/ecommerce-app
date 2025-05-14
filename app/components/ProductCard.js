'use client';

import Link from 'next/link';
import { Button, Card } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    // Optionally replace alert with a toast message or UI badge if desired
    console.log(`✔️ Added "${product.name}" to cart`);
  };

  return (
    <Card className="mb-4 shadow-sm h-100">
      <Card.Img
        variant="top"
        src={imgError ? 'https://via.placeholder.com/300x200?text=Image+Unavailable' : product.image}
        alt={product.name}
        onError={() => setImgError(true)}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text className="text-muted small">{product.description}</Card.Text>
        <h5 className="mt-auto">${product.price}</h5>
        <div className="d-flex justify-content-between mt-3">
          <Link href={`/product/${product.id}`} passHref>
            <Button variant="primary">View</Button>
          </Link>
          <Button variant="success" onClick={handleAddToCart}>Add to Cart</Button>
        </div>
      </Card.Body>
    </Card>
  );
}
