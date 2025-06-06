'use client';

import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { Container, Row, Col, Button, Form, Modal, Image } from 'react-bootstrap';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, addNotes, getTotalPrice, clearCart } = useCart();
  const [notes, setNotes] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleNoteChange = (id, value) => {
    setNotes(prev => ({ ...prev, [id]: value }));
    addNotes(id, value);
  };

  const total = getTotalPrice();
  const delivery = total < 1000 ? 50 : 0;
  const grandTotal = total + delivery;

  const handleCheckout = () => {
    clearCart();
    setShowModal(true);
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <Row className="mb-4">
            {cart.map(item => (
              <Col key={item.id} md={6} className="mb-4">
                <div className="p-3 border rounded shadow-sm h-100">
                  <h5>{item.title}</h5>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fluid
                    className="mb-2"
                    style={{ maxHeight: '150px', objectFit: 'contain' }}
                  />
                  <p>${item.price} each</p>

                  <Form.Group className="mb-2">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id || item.productId, parseInt(e.target.value) || 1)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Note (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Add note..."
                      value={notes[item.id || item.productId] || item.notes || ''}
                      onChange={(e) => handleNoteChange(item.id || item.productId, e.target.value)}
                    />
                  </Form.Group>

                  <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id || item.productId)}>
                    Remove
                  </Button>
                </div>
              </Col>
            ))}
          </Row>

          <h5>Subtotal: ${total.toFixed(2)}</h5>
          <h6>Delivery: ${delivery.toFixed(2)}</h6>
          <h4>Total: ${grandTotal.toFixed(2)}</h4>

          <Button variant="success" onClick={handleCheckout}>Proceed to Checkout</Button>
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Checkout Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ✅ Thank you for your order! Your payment has been processed.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
