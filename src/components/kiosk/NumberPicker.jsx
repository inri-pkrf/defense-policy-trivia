import { useRef, useState, useEffect, useCallback } from 'react';

const ITEM_HEIGHT = 64;
const VISIBLE_ITEMS = 3;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export default function NumberPicker({ min, max, value, onChange }) {
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(value - min);
  const selectedIndexRef = useRef(value - min);

  const numbers = [];
  for (let i = min; i <= max; i++) numbers.push(i);

  const padTop = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = (value - min) * ITEM_HEIGHT;
      setSelectedIndex(value - min);
      selectedIndexRef.current = value - min;
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!listRef.current) return;
    const scrollTop = listRef.current.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(numbers.length - 1, index));
    if (clamped !== selectedIndexRef.current) {
      selectedIndexRef.current = clamped;
      setSelectedIndex(clamped);
      onChange(numbers[clamped]);
    }
  }, [numbers, onChange]);

  return (
    <div className="relative" style={{ height: CONTAINER_HEIGHT }}>
      <div
        className="absolute left-2 right-2 pointer-events-none z-10"
        style={{
          top: (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2,
          height: ITEM_HEIGHT,
          background: 'rgba(30, 90, 168, 0.08)',
          borderRadius: '16px',
          border: '2px solid rgba(30, 90, 168, 0.15)',
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2,
          background: 'linear-gradient(0deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)',
        }}
      />
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="overflow-y-scroll h-full no-scrollbar"
        style={{
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
        }}
      >
        <div style={{ paddingTop: padTop, paddingBottom: padTop }}>
          {numbers.map((n, i) => {
            const distance = Math.abs(i - selectedIndex);
            const opacity = Math.max(0.25, 1 - distance * 0.3);
            const scale = Math.max(0.65, 1 - distance * 0.12);
            return (
              <div
                key={n}
                style={{
                  height: ITEM_HEIGHT,
                  scrollSnapAlign: 'center',
                }}
                className="flex items-center justify-center"
              >
                <span
                  className="font-bold transition-all duration-200"
                  style={{
                    fontSize: i === selectedIndex ? '2.5rem' : '1.75rem',
                    opacity,
                    transform: `scale(${scale})`,
                    color: i === selectedIndex ? '#1E5AA8' : '#6B95C0',
                  }}
                >
                  {n}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}