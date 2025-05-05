'use client';
import Link from 'next/link';
import { Button, Card } from 'react-bootstrap';

export default function ProductCard({ product }) {
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
        <Button variant="success">Add to Cart</Button>
      </Card.Body>
    </Card>
  );
}
