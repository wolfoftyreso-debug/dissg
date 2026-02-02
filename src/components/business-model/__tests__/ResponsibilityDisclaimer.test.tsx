/**
 * Responsibility Disclaimer Component Tests
 * 
 * Ensures the disclaimer component renders correctly and contains required legal text.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ResponsibilityDisclaimer } from '../ResponsibilityDisclaimer';

describe('ResponsibilityDisclaimer', () => {
  it('renders compact variant with legal statement', () => {
    const { container } = render(<ResponsibilityDisclaimer variant="compact" language="en" />);
    expect(container.textContent).toContain('platform provides data aggregation');
  });

  it('renders full variant with all sections', () => {
    const { container } = render(<ResponsibilityDisclaimer variant="full" language="en" />);
    
    // Check for section headers
    expect(container.textContent).toContain('Platform Provides');
    expect(container.textContent).toContain('Platform Does Not');
    expect(container.textContent).toContain('User Responsibility');
  });

  it('renders legal variant with prominent statement', () => {
    const { container } = render(<ResponsibilityDisclaimer variant="legal" language="en" />);
    expect(container.textContent).toContain('Responsibility Model');
  });

  it('renders in Swedish when language is sv', () => {
    const { container } = render(<ResponsibilityDisclaimer variant="full" language="sv" />);
    expect(container.textContent).toContain('Ansvarsmodell');
  });

  it('shows platform provides items', () => {
    const { container } = render(<ResponsibilityDisclaimer variant="full" language="en" />);
    expect(container.textContent).toContain('Data aggregation');
    expect(container.textContent).toContain('Analytical tools');
  });

  it('shows platform does not items', () => {
    const { container } = render(<ResponsibilityDisclaimer variant="full" language="en" />);
    expect(container.textContent).toContain('Interpret results');
    expect(container.textContent).toContain('Recommend actions');
  });

  it('shows user responsibility items', () => {
    const { container } = render(<ResponsibilityDisclaimer variant="full" language="en" />);
    expect(container.textContent).toContain('Assumptions');
    expect(container.textContent).toContain('Decisions');
  });
});
