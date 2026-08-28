export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  // iOS Safari ignores select() on a textarea unless the range is explicit.
  textArea.setSelectionRange(0, textArea.value.length);

  try {
    const succeeded = document.execCommand('copy');
    if (!succeeded) {
      throw new Error('document.execCommand("copy") returned false');
    }
  } finally {
    document.body.removeChild(textArea);
  }
}
