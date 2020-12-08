import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('App.js renders', () => {
  const { getByText } = render(<App />);
  const element = getByText(/CarList/i);
  expect(element).toBeInTheDocument();
});
