import { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

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

// Simple component to test just the copy functionality
function CopyButton({ command }: { command: string }) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyCommand = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(command);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = command;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Copy operation failed:', err);
    }
  };

  return <button onClick={handleCopyCommand}>{copySuccess ? 'COPIED!' : 'COPY'}</button>;
}

describe('Copy Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('copy button should copy command to clipboard and show feedback', async () => {
    render(<CopyButton command="npx terminal-jarvis" />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    // Should call clipboard API
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
});
