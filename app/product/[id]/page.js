'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function ProductDetail() {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:5000/products/${id}`),
          axios.get(`http://localhost:5000/reviews?productId=${id}`)
        ]);
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Failed to fetch product or reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      alert(`✔️ ${product.title} added to cart`);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const { author, comment, rating } = newReview;

    if (!author || !comment) {
      alert('Please fill in your name and review.');
      return;
    }

    const reviewData = {
      productId: parseInt(id),
      author,
      comment,
      rating
    };

    try {
      const res = await axios.post('http://localhost:5000/reviews', reviewData);
      setReviews(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to submit review:', err);
    }

    setNewReview({ rating: 5, comment: '', author: '' });
  };

  const getAverageRating = () => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => (
    [...Array(5)].map((_, i) => (
      <span key={i} className="fs-5">{i < rating ? '★' : '☆'}</span>
    ))
  );

  if (loading) return <p>Loading product details...</p>;
  if (!product) return <h2>Product not found.</h2>;

  return (
    <Container className="my-4">
      <Row className="mb-5">
        <Col md={6}>
          <img
            src={imgError ? 'https://via.placeholder.com/400x300?text=Image+Unavailable' : product.thumbnail}
            onError={() => setImgError(true)}
            alt={product.title}
            className="img-fluid mb-3 rounded"
          />
        </Col>
        <Col md={6}>
          <h1>{product.title}</h1>
          <div className="mb-2">
            {renderStars(getAverageRating())}
            <span className="ms-2 text-muted">
              ({getAverageRating()}/5 from {reviews.length} review{reviews.length !== 1 ? 's' : ''})
            </span>
          </div>
          <p>{product.description}</p>
          <h4 className="mb-3">${product.price.toFixed(2)}</h4>
          <Button variant="success" onClick={handleAddToCart}>Add to Cart</Button>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h3>Customer Reviews</h3>
          <hr />
          {reviews.length > 0 ? (
            reviews.map(r => (
              <Card key={r.id} className="mb-3">
                <Card.Body>
                  <Card.Title>{r.author}</Card.Title>
                  <div className="mb-1">{renderStars(r.rating)}</div>
                  <Card.Text>{r.comment}</Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No reviews yet. Be the first to review this product!</p>
          )}
        </Col>
      </Row>

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
                {[5, 4, 3, 2, 1].map(star => (
                  <option key={star} value={star}>
                    {star} Star{star > 1 ? 's' : ''}
                  </option>
                ))}
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

            <Button type="submit" variant="primary">Submit Review</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
