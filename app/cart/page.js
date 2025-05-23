'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Container, Row, Col, Table, Button, Form, Card, Modal } from 'react-bootstrap';
import Link from 'next/link';

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    addNotes,
    clearCart,
    getTotalPrice,
    isLoading,
  } = useCart();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Handle quantity change
  const handleQuantityChange = (itemId, quantity) => {
    const parsedQty = parseInt(quantity);
    if (!isNaN(parsedQty)) {
      updateQuantity(itemId, parsedQty);
    }
  };

  const handleNotesChange = (itemId, notes) => {
    addNotes(itemId, notes);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to empty your cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => setShowCheckoutModal(true);
  const handleProceedToPayment = () => {
    setShowCheckoutModal(false);
    setShowPaymentModal(true);
  };
  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    clearCart();
    alert('Thank you for your order!');
  };

  if (isLoading) return <p>Loading cart...</p>;

  if (cart.length === 0) {
    return (
      <Container className="text-center mt-5">
        <h2>Your cart is empty.</h2>
        <Link href="/" className="btn btn-primary mt-3">
          Continue Shopping
        </Link>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Shopping Cart</h1>

      <Row>
        {/* Cart Table & Notes */}
        <Col lg={8}>
          {/* 🛒 Cart Table */}
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th style={{ width: '90px' }}>Qty</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id || item.productId}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '50px', marginRight: '10px' }}
                      />
                      <div>
                        <strong>{item.name}</strong>
                        {item.notes && (
                          <p className="small text-muted mb-0">Note: {item.notes}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>${item.price}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity || 1}
                      onChange={(e) =>
                        handleQuantityChange(item.id || item.productId, e.target.value)
                      }
                    />
                  </td>
                  <td>${(item.price * (item.quantity || 1)).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id || item.productId)}
                    >
                      X
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* 📝 Add Notes Section */}
          <h5 className="mb-3">Special Instructions</h5>
          {cart.map((item) => (
            <div key={`note-${item.id || item.productId}`} className="mb-3">
              <Form.Group>
                <Form.Label>{item.name}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Add notes (e.g., gift wrap, color preference)..."
                  value={item.notes || ''}
                  onChange={(e) =>
                    handleNotesChange(item.id || item.productId, e.target.value)
                  }
                />
              </Form.Group>
            </div>
          ))}

          <div className="d-flex justify-content-between mt-4">
            <Link href="/" className="btn btn-outline-primary">
              Continue Shopping
            </Link>
            <Button variant="outline-danger" onClick={handleClearCart}>
              Empty Cart
            </Button>
          </div>
        </Col>

        {/* 💳 Order Summary */}
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>${getTotalPrice().toFixed(2)}</strong>
              </div>
              <Button variant="success" className="w-100" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ✅ Checkout Modal */}
      <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Your Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={`checkout-${item.id || item.productId}`}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" className="text-end">
                  <strong>Grand Total:</strong>
                </td>
                <td>
                  <strong>${getTotalPrice().toFixed(2)}</strong>
                </td>
              </tr>
            </tfoot>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>
            Back
          </Button>
          <Button variant="primary" onClick={handleProceedToPayment}>
            Proceed to Payment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control type="text" placeholder="1234 5678 9012 3456" />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry</Form.Label>
                  <Form.Control type="text" placeholder="MM/YY" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control type="text" placeholder="123" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control type="text" placeholder="John Doe" />
            </Form.Group>
            <hr />
            <h5>Total: ${getTotalPrice().toFixed(2)}</h5>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handlePaymentComplete}>
            Complete Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
