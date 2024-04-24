import { render, screen } from '@testing-library/react'
import App from './App'

test('Page contains app title', () => {
  render(<App />)
  const text = screen.getByText("React on Foundation")
  expect(text).toBeInTheDocument()
})