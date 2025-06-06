import { averageRating } from '../app/utils/ratings.js';

test('averageRating returns correct value', () => {
  const reviews = [
    { rating: 5 },
    { rating: 3 },
    { rating: 4 },
  ];
  expect(averageRating(reviews)).toBeCloseTo(4);
});
