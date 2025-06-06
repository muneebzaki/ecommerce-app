'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Carousel } from 'react-bootstrap';
import ProductCard from './components/ProductCard';
import axios from 'axios';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [loading, setLoading] = useState(true);

  const API = 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, campaignRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/campaigns`)
        ]);
        setProducts(productRes.data);
        setCampaigns(campaignRes.data);
      } catch (error) {
        console.error('Failed to fetch products or campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = products
    .filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || p.category === selectedCategory)
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-asc': return a.title.localeCompare(b.title);
        case 'name-desc': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Container className="my-4">
      {/* Campaign Carousel */}
      <Carousel className="mb-4">
        {campaigns.map(c => (
          <Carousel.Item key={c.id}>
            <img src={c.image} alt={c.title} className="d-block w-100" />
            <Carousel.Caption>
              <h5>{c.title}</h5>
              <p>{c.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Search + Filters */}
      <Form className="mb-4">
        <Row>
          <Col md={4} className="mb-2">
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={3} className="mb-2">
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3} className="mb-2">
            <Form.Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {/* Product List */}
      <h4>Products</h4>
      <Row>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(p => (
            <Col key={p.id} sm={12} md={6} lg={4} className="mb-4">
              <ProductCard product={p} />
            </Col>
          ))
        ) : (
          <Col>
            <p>No products found.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}
