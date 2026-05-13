export const OWNER_PHONE = '919942408260';

export function openWhatsApp(text: string) {
  const url = `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(text)}`;
  // Use anchor click to bypass popup blockers more reliably than window.open
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  return url;
}
