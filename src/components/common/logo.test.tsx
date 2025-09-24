
import { render, screen } from '@testing-library/react';
import Logo from './logo';

describe('Logo', () => {
  it('should render the logo', () => {
    render(<Logo />);
    const logo = screen.getByAltText('Loki Logo');
    expect(logo).toBeInTheDocument();
  });
});
