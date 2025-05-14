'use client';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Carousel } from 'react-bootstrap';
import ProductCard from './components/ProductCard';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch products and campaigns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get('http://localhost:3000/products');
        const campaignsResponse = await axios.get('http://localhost:3000/campaigns');
        setProducts(productsResponse.data);
        setCampaigns(campaignsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to local data if API fails
        import('./data/products').then(module => {
          setProducts(module.default);
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique categories
  const categories = [
    ...new Set(products.map(product => product.category)),
  ].filter(Boolean);

  // Filter products
  const filteredProducts = products.filter(product => {
    // Filter by search term
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Apply filters
  const handleApplyFilters = (e) => {
    e.preventDefault();
    // Filters are already applied reactively, this is just for the button
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      {/* Campaign Carousel */}
      <Row className="mb-4">
        <Col>
          <Carousel>
            {campaigns.map(campaign => (
              <Carousel.Item key={campaign.id}>
                <img
                  className="d-block w-100"
                  src={campaign.image}
                  alt={campaign.title}
                />
                <Carousel.Caption>
                  <h3>{campaign.title}</h3>
                  <p>{campaign.description}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col>
          <Form onSubmit={handleApplyFilters}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
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
                </Form.Group>
              </Col>
              <Col md={2}>
                <Button variant="primary" type="submit" className="w-100">
                  List
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      {/* Products */}
      <h2 className="mb-4">Products</h2>
      <Row>
        {sortedProducts.length > 0 ? (
          sortedProducts.map(product => (
            <Col key={product.id} sm={12} md={6} lg={4}>
              <ProductCard product={product} />
            </Col>
          ))
        ) : (
          <Col>
            <p>No products found matching your criteria.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}
