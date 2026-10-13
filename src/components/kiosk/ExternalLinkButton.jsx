import { Home } from 'lucide-react';

const EXTERNAL_URL = 'https://totem-smart-flow.base44.app/';

export default function ExternalLinkButton() {
  return (
    <button
      onClick={() => {
        window.location.href = EXTERNAL_URL;
      }}
      style={{
        width: 'clamp(50px, 7vw, 64px)',
        height: 'clamp(50px, 7vw, 64px)',
        backgroundColor: 'rgba(247, 179, 124, 0.9)',
      }}
      className="rounded-full overflow-hidden shadow-lg hover:scale-110 transition-transform flex items-center justify-center flex-shrink-0"
      aria-label="חזרה לטוטם הראשי"
    >
      <Home size={32} strokeWidth={2} style={{ color: '#1E5AA8' }} />
    </button>
  );
}