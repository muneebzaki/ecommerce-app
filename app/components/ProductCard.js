'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, Button } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    showToast(`${product.title} added to cart.`);
  };

  return (
    <Card className="mb-4 shadow-sm h-100">
      <Card.Img
        variant="top"
        src={imgError ? 'https://via.placeholder.com/300x200?text=No+Image' : product.thumbnail}
        alt={product.title}
        onError={() => setImgError(true)}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.title}</Card.Title>
        <Card.Text className="text-muted small">{product.description}</Card.Text>
        <h5 className="mt-auto">${product.price.toFixed(2)}</h5>
        <div className="d-flex justify-content-between mt-3">
          <Link href={`/product/${product.id}`} passHref>
            <Button variant="primary">View</Button>
          </Link>
          <Button variant="success" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
