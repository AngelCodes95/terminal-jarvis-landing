import { render, fireEvent, waitFor, within } from '@testing-library/react';
import { TerminalJarvisLanding } from '../TerminalJarvisLanding';

// Mock the API service to prevent real API calls during testing
vi.mock('../../api', () => ({
  realDataService: {
    getFallbackTools: () => ({ tools: [], totalCount: 0 }),
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

async function waitForLoaded() {
  return waitFor(
    () => {
      const el = document.getElementById('hero');
      if (!el) throw new Error('still loading');
      return el;
    },
    { timeout: 5000 }
  );
}

describe('Copy Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('hero copy button copies the npx command and shows feedback', async () => {
    render(<TerminalJarvisLanding />);
    const heroSection = await waitForLoaded();

    const copyButton = within(heroSection).getByRole('button', { name: /^copy$/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('npx terminal-jarvis');
    });

    await waitFor(() => {
      expect(within(heroSection).getByText('Copied')).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(within(heroSection).getByText('Copy')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  test('quick start copies the correct command for the selected OS and method', async () => {
    render(<TerminalJarvisLanding />);
    await waitForLoaded();

    const quickstart = document.getElementById('quickstart')!;

    fireEvent.click(within(quickstart).getByRole('button', { name: /^linux$/i }));
    fireEvent.click(within(quickstart).getByRole('button', { name: /^npm$/i }));
    fireEvent.click(within(quickstart).getByRole('button', { name: /^copy$/i }));

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('npm install -g terminal-jarvis');
    });
  });

  test('windows tab does not offer homebrew as an install method', async () => {
    render(<TerminalJarvisLanding />);
    await waitForLoaded();

    const quickstart = document.getElementById('quickstart')!;

    fireEvent.click(within(quickstart).getByRole('button', { name: /^windows$/i }));

    expect(within(quickstart).queryByRole('button', { name: /homebrew/i })).not.toBeInTheDocument();
  });
});
