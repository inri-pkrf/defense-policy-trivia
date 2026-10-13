import { motion } from 'framer-motion';

export function Person({ pose = 'standing', skin = '#E8B894', shirt = '#3B82C4', pants = '#2C3E50', hair = '#3D2B1F', size = 1 }) {
  if (pose === 'lying') {
    return (
      <svg width={90 * size} height={25 * size} viewBox="-45 -15 90 25">
        <ellipse cx="0" cy="0" rx="28" ry="9" fill={shirt} />
        <circle cx="-30" cy="-3" r="8" fill={skin} />
        <path d="M-38,-6 Q-30,-13 -22,-6 L-22,-10 Q-30,-12 -38,-10 Z" fill={hair} />
        <ellipse cx="-24" cy="-10" rx="5" ry="3" fill={skin} />
        <ellipse cx="24" cy="0" rx="14" ry="7" fill={pants} />
        <ellipse cx="36" cy="0" rx="6" ry="5" fill={pants} />
      </svg>
    );
  }

  if (pose === 'crouching') {
    return (
      <svg width={40 * size} height={55 * size} viewBox="-20 -50 40 55">
        <circle cx="0" cy="-35" r="9" fill={skin} />
        <path d="M-9,-38 Q0,-46 9,-38 L9,-42 Q0,-45 -9,-42 Z" fill={hair} />
        <path d="M-12,-26 Q-12,-29 -9,-29 L9,-29 Q12,-29 12,-26 L11,-8 L-11,-8 Z" fill={shirt} />
        <rect x="-15" y="-27" width="6" height="16" rx="3" fill={shirt} />
        <rect x="9" y="-27" width="6" height="16" rx="3" fill={shirt} />
        <circle cx="-12" cy="-31" r="3.5" fill={skin} />
        <circle cx="12" cy="-31" r="3.5" fill={skin} />
        <rect x="-10" y="-8" width="8" height="12" rx="2" fill={pants} />
        <rect x="2" y="-8" width="8" height="12" rx="2" fill={pants} />
        <ellipse cx="-6" cy="4" rx="6" ry="3" fill="#2C2C3E" />
        <ellipse cx="6" cy="4" rx="6" ry="3" fill="#2C2C3E" />
      </svg>
    );
  }

  const walking = pose === 'walking';
  return (
    <svg width={40 * size} height={85 * size} viewBox="-20 -80 40 85">
      <circle cx="0" cy="-68" r="9" fill={skin} />
      <path d="M-9,-71 Q0,-79 9,-71 L9,-75 Q0,-78 -9,-75 Z" fill={hair} />
      <rect x="-3" y="-60" width="6" height="5" fill={skin} />
      <path d="M-14,-55 Q-14,-58 -11,-58 L11,-58 Q14,-58 14,-55 L13,-25 L-13,-25 Z" fill={shirt} />
      {walking ? (
        <>
          <rect x="-17" y="-56" width="6" height="28" rx="3" fill={shirt} transform="rotate(15,-14,-56)" />
          <rect x="11" y="-56" width="6" height="28" rx="3" fill={shirt} transform="rotate(-15,14,-56)" />
          <circle cx="-19" cy="-28" r="3.5" fill={skin} />
          <circle cx="19" cy="-28" r="3.5" fill={skin} />
          <rect x="-10" y="-25" width="8" height="26" rx="2" fill={pants} transform="rotate(20,-6,-25)" />
          <rect x="2" y="-25" width="8" height="26" rx="2" fill={pants} transform="rotate(-20,6,-25)" />
          <ellipse cx="-13" cy="3" rx="6" ry="3" fill="#2C2C3E" transform="rotate(20,-13,3)" />
          <ellipse cx="13" cy="3" rx="6" ry="3" fill="#2C2C3E" transform="rotate(-20,13,3)" />
        </>
      ) : (
        <>
          <rect x="-17" y="-56" width="6" height="30" rx="3" fill={shirt} />
          <rect x="11" y="-56" width="6" height="30" rx="3" fill={shirt} />
          <circle cx="-14" cy="-24" r="3.5" fill={skin} />
          <circle cx="14" cy="-24" r="3.5" fill={skin} />
          <rect x="-10" y="-25" width="8" height="26" rx="2" fill={pants} />
          <rect x="2" y="-25" width="8" height="26" rx="2" fill={pants} />
          <ellipse cx="-6" cy="2" rx="6" ry="3" fill="#2C2C3E" />
          <ellipse cx="6" cy="2" rx="6" ry="3" fill="#2C2C3E" />
        </>
      )}
    </svg>
  );
}

export function Building({ width = 60, height = 120, color = '#7BA7CC', roofColor }) {
  const cols = Math.max(1, Math.floor((width - 8) / 18));
  const rows = Math.max(1, Math.floor((height - 12) / 22));
  const winW = 10;
  const winH = 12;
  const startX = (width - (cols * winW + (cols - 1) * 6)) / 2;
  const roof = roofColor || color;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect x="0" y="4" width={width} height={height - 4} rx="4" fill={color} />
      <rect x="-2" y="0" width={width + 4} height="10" rx="3" fill={roof} />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={startX + c * (winW + 6)}
            y={12 + r * (winH + 6)}
            width={winW}
            height={winH}
            rx="1.5"
            fill="#B8D8F0"
            opacity="0.5"
          />
        ))
      )}
      <rect x={width / 2 - 7} y={height - 22} width="14" height="22" rx="2" fill={color} opacity="0.6" />
    </svg>
  );
}

export function BuildingWithLights({ width = 60, height = 120, color = '#7BA7CC', seed = 0 }) {
  const cols = Math.max(1, Math.floor((width - 8) / 18));
  const rows = Math.max(1, Math.floor((height - 12) / 22));
  const winW = 10;
  const winH = 12;
  const startX = (width - (cols * winW + (cols - 1) * 6)) / 2;
  const totalWindows = cols * rows;

  // Deterministically pick ~18% of windows to be "lit"
  const litSet = new Set();
  const numLit = Math.max(2, Math.floor(totalWindows * 0.18));
  let s = seed * 7919;
  while (litSet.size < numLit) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    litSet.add(s % totalWindows);
  }
  const litArray = [...litSet];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect x="0" y="4" width={width} height={height - 4} rx="4" fill={color} />
      <rect x="-2" y="0" width={width + 4} height="10" rx="3" fill={color} />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const idx = r * cols + c;
          const isLit = litArray.includes(idx);
          return (
            <motion.rect
              key={`${r}-${c}`}
              x={startX + c * (winW + 6)}
              y={12 + r * (winH + 6)}
              width={winW}
              height={winH}
              rx="1.5"
              fill={isLit ? '#FFD966' : '#B8D8F0'}
              opacity={isLit ? 0.4 : 0.5}
              animate={isLit ? { opacity: [0.2, 0.8, 0.2] } : {}}
              transition={isLit ? { duration: 5 + (idx % 4), repeat: Infinity, ease: 'easeInOut', delay: (idx * 0.7) % 4 } : {}}
            />
          );
        })
      )}
      <rect x={width / 2 - 7} y={height - 22} width="14" height="22" rx="2" fill={color} opacity="0.6" />
    </svg>
  );
}

export function Car({ color = '#E74C3C' }) {
  return (
    <svg width="100" height="50" viewBox="0 0 100 50">
      <rect x="5" y="18" width="90" height="22" rx="8" fill={color} />
      <path d="M25,18 Q30,4 50,4 Q70,4 75,18 Z" fill={color} />
      <path d="M28,18 Q32,7 48,7 L48,18 Z" fill="#A8D4F0" opacity="0.7" />
      <path d="M52,18 L52,7 Q68,7 72,18 Z" fill="#A8D4F0" opacity="0.7" />
      <circle cx="25" cy="42" r="9" fill="#2C2C3E" />
      <circle cx="25" cy="42" r="4" fill="#6B6B7E" />
      <circle cx="75" cy="42" r="9" fill="#2C2C3E" />
      <circle cx="75" cy="42" r="4" fill="#6B6B7E" />
      <circle cx="93" cy="26" r="3" fill="#FFD700" />
    </svg>
  );
}

export function Bus({ color = '#3498DB' }) {
  return (
    <svg width="140" height="65" viewBox="0 0 140 65">
      <rect x="5" y="5" width="130" height="50" rx="8" fill={color} />
      <rect x="12" y="12" width="20" height="18" rx="2" fill="#A8D4F0" opacity="0.7" />
      <rect x="38" y="12" width="20" height="18" rx="2" fill="#A8D4F0" opacity="0.7" />
      <rect x="64" y="12" width="20" height="18" rx="2" fill="#A8D4F0" opacity="0.7" />
      <rect x="90" y="12" width="20" height="18" rx="2" fill="#A8D4F0" opacity="0.7" />
      <rect x="116" y="12" width="14" height="18" rx="2" fill="#A8D4F0" opacity="0.7" />
      <rect x="6" y="22" width="8" height="30" rx="2" fill="#2C5F8A" />
      <circle cx="30" cy="57" r="8" fill="#2C2C3E" />
      <circle cx="110" cy="57" r="8" fill="#2C2C3E" />
      <circle cx="133" cy="25" r="2" fill="#FFD700" />
    </svg>
  );
}

export function Cloud({ scale = 1 }) {
  return (
    <svg width={80 * scale} height={40 * scale} viewBox="0 0 80 40">
      <ellipse cx="20" cy="25" rx="18" ry="14" fill="white" opacity="0.85" />
      <ellipse cx="40" cy="20" rx="22" ry="16" fill="white" opacity="0.9" />
      <ellipse cx="58" cy="25" rx="16" ry="12" fill="white" opacity="0.85" />
    </svg>
  );
}

export function Tree({ scale = 1 }) {
  return (
    <svg width={40 * scale} height={60 * scale} viewBox="0 0 40 60">
      <rect x="17" y="35" width="6" height="22" rx="2" fill="#8B6F47" />
      <circle cx="20" cy="25" r="18" fill="#5BAE5B" />
      <circle cx="12" cy="18" r="12" fill="#7BC97B" />
      <circle cx="28" cy="18" r="12" fill="#7BC97B" />
    </svg>
  );
}

export function Bird({ scale = 1 }) {
  return (
    <svg width={30 * scale} height={16 * scale} viewBox="0 0 30 16">
      <motion.path
        d="M2,8 Q8,1 14,8 Q20,1 28,8"
        stroke="#5A87B0"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        animate={{ d: ['M2,8 Q8,1 14,8 Q20,1 28,8', 'M2,8 Q8,14 14,8 Q20,14 28,8', 'M2,8 Q8,1 14,8 Q20,1 28,8'] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}

export function BusStop({ scale = 1 }) {
  return (
    <svg width={70 * scale} height={80 * scale} viewBox="0 0 70 80">
      <rect x="8" y="20" width="4" height="60" fill="#4A5568" />
      <rect x="2" y="8" width="34" height="16" rx="2" fill="#2A6BC4" />
      <rect x="6" y="13" width="22" height="3" rx="1" fill="white" opacity="0.8" />
      <rect x="6" y="18" width="16" height="2" rx="1" fill="white" opacity="0.6" />
      <rect x="15" y="30" width="50" height="5" rx="2" fill="#5A87B0" />
      <rect x="20" y="35" width="40" height="40" rx="2" fill="#A8D4F0" opacity="0.35" />
      <rect x="25" y="55" width="30" height="4" rx="1" fill="#4A5568" />
    </svg>
  );
}

export function Mitgonit({ scale = 1 }) {
  return (
    <svg width={85 * scale} height={70 * scale} viewBox="0 0 85 70">
      <rect x="5" y="20" width="75" height="50" rx="4" fill="#8B9DAF" />
      <rect x="0" y="14" width="85" height="9" rx="3" fill="#6B7D8F" />
      <rect x="32" y="34" width="20" height="36" rx="2" fill="#5A6B7D" />
      <rect x="5" y="5" width="22" height="12" rx="2" fill="#FF7A30" />
      <text x="16" y="14" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">מ</text>
    </svg>
  );
}

export function ChildWithBackpack({ scale = 1, shirt = '#3B82C4', pants = '#2C3E50' }) {
  return (
    <svg width={28 * scale} height={55 * scale} viewBox="-14 -50 28 55">
      <circle cx="0" cy="-38" r="6" fill="#E8B894" />
      <path d="M-6,-41 Q0,-47 6,-41 L6,-44 Q0,-46 -6,-44 Z" fill="#3D2B1F" />
      <rect x="-10" y="-33" width="5" height="13" rx="2" fill="#1E5AA8" />
      <rect x="-11" y="-28" width="3" height="6" rx="1" fill="#163E78" />
      <path d="M-8,-33 Q-8,-35 -6,-35 L6,-35 Q8,-35 8,-33 L7,-15 L-7,-15 Z" fill={shirt} />
      <rect x="-10" y="-33" width="5" height="15" rx="2" fill={shirt} transform="rotate(12,-7,-33)" />
      <rect x="5" y="-33" width="5" height="15" rx="2" fill={shirt} transform="rotate(-12,7,-33)" />
      <rect x="-6" y="-15" width="5" height="14" rx="2" fill={pants} transform="rotate(15,-3,-15)" />
      <rect x="1" y="-15" width="5" height="14" rx="2" fill={pants} transform="rotate(-15,3,-15)" />
      <ellipse cx="-7" cy="1" rx="4" ry="2" fill="#2C2C3E" transform="rotate(15,-7,1)" />
      <ellipse cx="7" cy="1" rx="4" ry="2" fill="#2C2C3E" transform="rotate(-15,7,1)" />
    </svg>
  );
}

export function Phone({ scale = 1, screenContent = null }) {
  return (
    <svg width={50 * scale} height={90 * scale} viewBox="0 0 50 90">
      <rect x="3" y="3" width="44" height="84" rx="8" fill="#2C2C3E" />
      <rect x="6" y="10" width="38" height="65" rx="3" fill={screenContent ? '#1A1A2E' : '#0D0D1A'} />
      {screenContent === 'alert' && (
        <>
          <rect x="9" y="16" width="32" height="52" rx="3" fill="#FF7A30" opacity="0.15" />
          <circle cx="25" cy="32" r="8" fill="#FF7A30" />
          <text x="25" y="37" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">!</text>
          <rect x="11" y="46" width="28" height="4" rx="1" fill="#FF7A30" opacity="0.7" />
          <rect x="11" y="53" width="22" height="3" rx="1" fill="#FF7A30" opacity="0.5" />
          <rect x="11" y="59" width="25" height="3" rx="1" fill="#FF7A30" opacity="0.5" />
        </>
      )}
      <circle cx="25" cy="82" r="3" fill="#6B6B7E" />
    </svg>
  );
}