'use client';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import { use } from 'react';

export default function ProductDetail({ params }) {
  // Unwrap params using React.use - Next.js 15 requirement
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', author: '' });
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        // Fetch product
        const productResponse = await axios.get(`http://localhost:5000/products/${productId}`);
        setProduct(productResponse.data);
        
        // Fetch reviews
        const reviewsResponse = await axios.get(`http://localhost:5000/reviews?productId=${productId}`);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to local data
        import('../../data/products').then(module => {
          const productData = module.default.find(p => p.id === parseInt(productId));
          setProduct(productData);
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      console.log('Adding to cart:', product);
      addToCart(product, 1);
      alert('Product added to cart!');
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.comment || !newReview.author) {
      alert('Please fill out all fields');
      return;
    }

    const reviewData = {
      productId: parseInt(productId),
      ...newReview
    };

    try {
      const response = await axios.post('http://localhost:5000/reviews', reviewData);
      setReviews([...reviews, response.data]);
      setNewReview({ rating: 5, comment: '', author: '' });
      alert('Review added successfully!');
    } catch (error) {
      console.error('Error adding review:', error);
      // Fallback to local state if API fails
      const fakeId = Math.floor(Math.random() * 1000) + reviews.length;
      setReviews([...reviews, { ...reviewData, id: fakeId }]);
      setNewReview({ rating: 5, comment: '', author: '' });
      alert('Review added to local state (API unavailable)');
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="fs-4">
          {i <= rating ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <h2>Product not found.</h2>;
  }

  return (
    <Container>
      <Row className="mb-5">
        <Col md={6}>
          <img src={product.image} alt={product.name} className="img-fluid mb-3" />
        </Col>
        <Col md={6}>
          <h1>{product.name}</h1>
          <div className="mb-2">
            {renderStars(getAverageRating())}
            <span className="ms-2">({getAverageRating()}/5 - {reviews.length} reviews)</span>
          </div>
          <p>{product.description}</p>
          <h4 className="mb-3">${product.price}</h4>
          <Button variant="success" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h3>Customer Reviews</h3>
          <hr />
          
          {reviews.length > 0 ? (
            reviews.map(review => (
              <Card key={review.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <Card.Title>{review.author}</Card.Title>
                      <div>{renderStars(review.rating)}</div>
                    </div>
                  </div>
                  <Card.Text>{review.comment}</Card.Text>
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
            
            <Button variant="primary" type="submit">
              Submit Review
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}



  