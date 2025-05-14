'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import axios from 'axios';

export default function ProductDetail({ params }) {
  const productId = params.id;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    author: ''
  });

  // Fetch product & reviews
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:3000/products/${productId}`),
          axios.get(`http://localhost:3000/reviews?productId=${productId}`)
        ]);

        setProduct(productRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Error fetching product or reviews:', error);
        // Fallback to local data
        const local = await import('../../data/products');
        const fallbackProduct = local.default.find(p => p.id === parseInt(productId));
        setProduct(fallbackProduct);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, 1);
    console.log(`✔️ Added "${product.name}" to cart`);
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!newReview.author || !newReview.comment) {
      alert('Please fill in your name and review.');
      return;
    }

    const reviewData = {
      productId: parseInt(productId),
      ...newReview
    };

    try {
      const res = await axios.post('http://localhost:3000/reviews', reviewData);
      setReviews(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to post review:', err);
      // Local fallback
      const fallbackReview = { ...reviewData, id: Date.now() };
      setReviews(prev => [...prev, fallbackReview]);
    }

    // Reset form
    setNewReview({ rating: 5, comment: '', author: '' });
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className="fs-4">{i < rating ? '★' : '☆'}</span>
    ));
  };

  if (loading) return <p>Loading product details...</p>;
  if (!product) return <h2>Product not found.</h2>;

  return (
    <Container>
      {/* Product Info */}
      <Row className="mb-5">
        <Col md={6}>
          <img
            src={imgError ? 'https://via.placeholder.com/400x300?text=Image+Not+Available' : product.image}
            onError={() => setImgError(true)}
            alt={product.name}
            className="img-fluid mb-3"
          />
        </Col>
        <Col md={6}>
          <h1>{product.name}</h1>
          <div className="mb-2">
            {renderStars(getAverageRating())}
            <span className="ms-2">({getAverageRating()}/5 - {reviews.length} reviews)</span>
          </div>
          <p>{product.description}</p>
          <h4 className="mb-3">${product.price}</h4>
          <Button variant="success" onClick={handleAddToCart}>Add to Cart</Button>
        </Col>
      </Row>

      {/* Customer Reviews */}
      <Row className="mb-5">
        <Col>
          <h3>Customer Reviews</h3>
          <hr />
          {reviews.length ? (
            reviews.map(review => (
              <Card key={review.id} className="mb-3">
                <Card.Body>
                  <Card.Title>{review.author}</Card.Title>
                  <div>{renderStars(review.rating)}</div>
                  <Card.Text>{review.comment}</Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No reviews yet. Be the first to write one!</p>
          )}
        </Col>
      </Row>

      {/* Review Form */}
      <Row className="mb-5">
        <Col>
          <h3>Write a Review</h3>
          <Form onSubmit={handleSubmitReview}>
            <Form.Group className="mb-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={newReview.author}
                onChange={handleReviewChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Select
                name="rating"
                value={newReview.rating}
                onChange={handleReviewChange}
              >
                <option value="5">5 Stars - Excellent</option>
                <option value="4">4 Stars - Very Good</option>
                <option value="3">3 Stars - Good</option>
                <option value="2">2 Stars - Fair</option>
                <option value="1">1 Star - Poor</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Your Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="comment"
                value={newReview.comment}
                onChange={handleReviewChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">Submit Review</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
