'use client';

import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Update form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Validate all fields
    const { title, description, image, startDate, endDate } = campaign;
    if (!title || !description || !startDate || !endDate) {
      setError('All fields except image URL are required.');
      setIsSubmitting(false);
      return;
    }

    // If image URL is invalid or empty, use a placeholder
    const imageUrl = image.startsWith('http')
      ? image
      : `https://via.placeholder.com/800x400?text=${encodeURIComponent(title)}`;

    const campaignData = {
      ...campaign,
      image: imageUrl,
    };

    try {
      // Attempt to save to backend
      await axios.post('http://localhost:3000/campaigns', campaignData);
      setSuccess('Campaign added successfully!');
      setCampaign({
        title: '',
        description: '',
        image: '',
        startDate: '',
        endDate: '',
      });

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      console.error('API failed. Trying localStorage fallback.', err);

      try {
        const existing = JSON.parse(localStorage.getItem('campaigns') || '[]');
        const newCampaign = { ...campaignData, id: Date.now() };
        localStorage.setItem('campaigns', JSON.stringify([...existing, newCampaign]));
        setSuccess('Campaign saved to local storage.');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (localErr) {
        console.error('localStorage fallback also failed:', localErr);
        setError('Failed to save campaign.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Add New Campaign</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Campaign Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={campaign.title}
                onChange={handleChange}
                placeholder="Enter campaign title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={campaign.description}
                onChange={handleChange}
                placeholder="Enter campaign description"
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
                placeholder="Leave empty to use a placeholder image"
              />
              <Form.Text className="text-muted">
                Leave blank to auto-generate a placeholder image with your title.
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

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="mt-3"
            >
              {isSubmitting ? 'Adding Campaign...' : 'Add Campaign'}
            </Button>
          </Form>
        </Col>

        {/* Campaign Preview */}
        <Col md={4}>
          <div className="bg-light p-3 rounded">
            <h5>Campaign Preview</h5>
            <hr />
            {campaign.title ? (
              <>
                <h6>{campaign.title}</h6>
                <p className="small">{campaign.description}</p>
                <img
                  src={
                    campaign.image.startsWith('http')
                      ? campaign.image
                      : `https://via.placeholder.com/800x400?text=${encodeURIComponent(campaign.title)}`
                  }
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
              <p className="text-muted">Fill in the form to see a live preview.</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
