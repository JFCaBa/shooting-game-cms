import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login when not authenticated', () => {
  render(<App />);
  const loginElement = screen.getByText(/Sign in to CMS/i);
  expect(loginElement).toBeInTheDocument();
});