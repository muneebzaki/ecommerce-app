'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import api from '../utils/api';

export default function AddCampaignPage() {
  const router = useRouter();
  const [campaign, setCampaign] = useState({
    title: '',
    description: '',
    image: '',
    startDate: '',
    endDate: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    const { title, description, image, startDate, endDate } = campaign;

    if (!title || !description || !startDate || !endDate) {
      setFeedback({ type: 'danger', message: 'All fields except image URL are required.' });
      setIsSubmitting(false);
      return;
    }

    const imageUrl = image.startsWith('http')
      ? image
      : `https://via.placeholder.com/800x400?text=${encodeURIComponent(title)}`;

    const newCampaign = { title, description, image: imageUrl, startDate, endDate };

    try {
      await api.post('/campaigns', newCampaign);
      setFeedback({ type: 'success', message: 'Campaign added successfully!' });
      setCampaign({ title: '', description: '', image: '', startDate: '', endDate: '' });
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      console.error('Failed to save campaign:', err);
      setFeedback({ type: 'danger', message: 'Failed to save campaign. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPreviewImage = () => {
    return campaign.image.startsWith('http')
      ? campaign.image
      : `https://via.placeholder.com/800x400?text=${encodeURIComponent(campaign.title)}`;
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Add New Campaign</h1>

      {feedback.message && <Alert variant={feedback.type}>{feedback.message}</Alert>}

      <Row>
        {/* Form */}
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Campaign Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={campaign.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                value={campaign.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={campaign.image}
                onChange={handleChange}
                placeholder="Leave blank to auto-generate"
              />
              <Form.Text className="text-muted">
                If left empty, a placeholder image will be generated.
              </Form.Text>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={campaign.startDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={campaign.endDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Campaign'}
            </Button>
          </Form>
        </Col>

        {/* Preview */}
        <Col md={4}>
          <div className="bg-light p-3 rounded">
            <h5>Preview</h5>
            <hr />
            {campaign.title ? (
              <>
                <h6>{campaign.title}</h6>
                <p className="small">{campaign.description}</p>
                <img
                  src={getPreviewImage()}
                  alt={campaign.title}
                  className="img-fluid rounded mb-2"
                />
                {campaign.startDate && campaign.endDate && (
                  <p className="small text-muted">
                    Active from {new Date(campaign.startDate).toLocaleDateString()} to{' '}
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted">Fill in the form to preview the campaign.</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
