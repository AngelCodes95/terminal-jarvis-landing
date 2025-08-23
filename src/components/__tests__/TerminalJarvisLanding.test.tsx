import { render, screen, fireEvent } from '@testing-library/react';
import { TerminalJarvisLanding } from '../TerminalJarvisLanding';

// Mock clipboard API to track if it gets called
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('TerminalJarvisLanding Copy Bug Reproduction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('copy button exists but has no click functionality (reproduces issue #5)', () => {
    render(<TerminalJarvisLanding />);

    // First verify we can find a button with "COPY" text in loading screen or main content
    // This test should pass - button exists but is broken
    const copyButtons = screen.queryAllByText('COPY');
    
    if (copyButtons.length > 0) {
      const copyButton = copyButtons[0];
      
      // Click the copy button
      fireEvent.click(copyButton);

      // BUG VERIFICATION: Clipboard should not be called (no onClick handler)
      expect(mockWriteText).not.toHaveBeenCalled();
      
      // BUG VERIFICATION: Button text should not change (no state management)
      expect(copyButton).toHaveTextContent('COPY');
    } else {
      // If no copy button found, that's also a bug
      throw new Error('Copy button not found - this indicates the Quick Start section is not rendering');
    }
  });
});