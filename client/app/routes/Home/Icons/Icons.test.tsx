import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Icons, { type IconItem } from './Icons';
import React from 'react';

const mockIcons: IconItem[] = [
  { key: 'test1', icon: 'test1.svg', text: 'Test 1' },
  { key: 'test2', icon: 'test2.svg', text: 'Test 2' },
];

describe('Icons component', () => {
  it('should render the correct number of icons', () => {
    render(<Icons content={mockIcons} />);
    const iconElements = screen.getAllByRole('img');
    expect(iconElements).toHaveLength(mockIcons.length);
  });

  it('should render the correct text for each icon', () => {
    render(<Icons content={mockIcons} />);
    mockIcons.forEach((icon) => {
      expect(screen.getByText(icon.text)).toBeInTheDocument();
    });
  });

  it('should render the correct image for each icon', () => {
    render(<Icons content={mockIcons} />);
    mockIcons.forEach((icon) => {
      const imgElement = screen.getByAltText(icon.key);
      expect(imgElement).toHaveAttribute('src', icon.icon);
    });
  });

  it('should render with default content if no content is provided', () => {
    render(<Icons />);
    // Check for a default item
    expect(screen.getByText(/Быстрая доставка/)).toBeInTheDocument();
  });
});
