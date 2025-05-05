'use client';
import products from './data/products';
import ProductCard from './components/ProductCard';
import { Container, Row, Col } from 'react-bootstrap';

export default function Home() {
  return (
    <Container>
      <h1 className="mb-4">Products</h1>
      <Row>
        {products.map(product => (
          <Col key={product.id} sm={12} md={6} lg={4}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
