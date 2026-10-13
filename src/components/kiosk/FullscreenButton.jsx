import { useState, useEffect, useCallback } from 'react';
import { Maximize, Minimize } from 'lucide-react';

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }, []);

  return (
    <button
      onClick={toggle}
      style={{
        width: 'clamp(50px, 7vw, 64px)',
        height: 'clamp(50px, 7vw, 64px)',
      }}
      className="rounded-full overflow-hidden shadow-lg hover:scale-110 transition-transform flex items-center justify-center flex-shrink-0 bg-white/80 backdrop-blur-md"
      aria-label={isFullscreen ? 'יציאה ממסך מלא' : 'מסך מלא'}
    >
      {isFullscreen ? (
        <Minimize size={26} className="text-blue-700" />
      ) : (
        <Maximize size={26} className="text-blue-700" />
      )}
    </button>
  );
}