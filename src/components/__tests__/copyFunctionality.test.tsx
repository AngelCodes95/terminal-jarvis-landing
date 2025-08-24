import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TerminalJarvisLanding } from '../TerminalJarvisLanding';

// Mock the API service to prevent real API calls during testing
vi.mock('../../api', () => ({
  realDataService: {
    getTools: () => Promise.resolve({ data: null, error: null }),
    getLiveStats: () => Promise.resolve({ data: null, error: null }),
  },
}));

// Mock clipboard API to track calls
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

// Mock window.isSecureContext for clipboard API
Object.defineProperty(window, 'isSecureContext', {
  writable: true,
  value: true,
});

describe('Copy Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('copy button should copy command to clipboard and show feedback', async () => {
    render(<TerminalJarvisLanding />);

    // Wait for component to load (skip loading screen)
    await waitFor(
      () => {
        expect(screen.queryByText('Initializing connection...')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Find the copy button in the real component
    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    // Should call clipboard API with default npx command
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('npx terminal-jarvis');
    });

    // Should show success feedback
    await waitFor(() => {
      expect(screen.getByText('COPIED!')).toBeInTheDocument();
    });

    // Should revert back to COPY after timeout
    await waitFor(
      () => {
        expect(screen.getByText('COPY')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  test('copy button should copy correct command when different method is selected', async () => {
    render(<TerminalJarvisLanding />);

    // Wait for component to load
    await waitFor(
      () => {
        expect(screen.queryByText('Initializing connection...')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Click on NPM tab
    const npmButton = screen.getByRole('button', { name: /Install via NPM/i });
    fireEvent.click(npmButton);

    // Click copy button
    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    // Should call clipboard API with npm command
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('npm install -g terminal-jarvis');
    });
  });
});
