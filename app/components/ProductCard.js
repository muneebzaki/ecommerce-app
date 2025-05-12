'use client';
import Link from 'next/link';
import { Button, Card } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    console.log('Adding to cart from ProductCard:', product);
    addToCart(product, 1);
    alert('Product added to cart!');
  };

  return (
    <Card className="mb-4" style={{ width: '18rem' }}>
      <Card.Img variant="top" src={product.image} />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <h5>${product.price}</h5>
        <Link href={`/product/${product.id}`}>
          <Button variant="primary" className="me-2">View</Button>
        </Link>
        <Button variant="success" onClick={handleAddToCart}>Add to Cart</Button>
      </Card.Body>
    </Card>
  );
}
