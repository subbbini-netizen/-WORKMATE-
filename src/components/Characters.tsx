import React from 'react';

interface CharacterProps {
  className?: string;
  size?: number;
}

export const StarCharacter: React.FC<CharacterProps> = ({ className = '', size = 52 }) => {
  return (
    <div className={`inline-block select-none pointer-events-none drop-shadow-sm transition-transform hover:scale-110 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Star Body */}
        <path
          d="M50 10 L61 34 L87 37 L67 55 L73 81 L50 68 L27 81 L33 55 L13 37 L39 34 Z"
          fill="#93C5FD"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Eyes */}
        <ellipse cx="42" cy="46" rx="3.5" ry="5" fill="#1E3A8A" />
        <ellipse cx="58" cy="46" rx="3.5" ry="5" fill="#1E3A8A" />
        <circle cx="43.5" cy="44" r="1.5" fill="#FFFFFF" />
        <circle cx="59.5" cy="44" r="1.5" fill="#FFFFFF" />
        {/* Rosy Cheeks */}
        <ellipse cx="37" cy="51" rx="3" ry="1.8" fill="#F472B6" opacity="0.7" />
        <ellipse cx="63" cy="51" rx="3" ry="1.8" fill="#F472B6" opacity="0.7" />
        {/* Smile */}
        <path
          d="M45 52 Q50 58 55 52"
          stroke="#1E3A8A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Dangling Legs */}
        <path
          d="M44 75 Q42 88 38 90 M56 75 Q58 88 62 90"
          stroke="#3B82F6"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export const CloudCharacter: React.FC<CharacterProps> = ({ className = '', size = 56 }) => {
  return (
    <div className={`inline-block select-none pointer-events-none drop-shadow-sm transition-transform hover:scale-110 ${className}`}>
      <svg
        width={size}
        height={size * 0.75}
        viewBox="0 0 120 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cloud Body */}
        <path
          d="M30 65 Q15 65 15 50 Q15 35 30 35 Q35 15 55 15 Q75 15 80 30 Q95 25 102 38 Q110 50 100 65 Z"
          fill="#DDD6FE"
          stroke="#8B5CF6"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Eyes */}
        <ellipse cx="48" cy="44" rx="3.5" ry="4.5" fill="#4C1D95" />
        <ellipse cx="68" cy="44" rx="3.5" ry="4.5" fill="#4C1D95" />
        <circle cx="49.5" cy="42" r="1.2" fill="#FFFFFF" />
        <circle cx="69.5" cy="42" r="1.2" fill="#FFFFFF" />
        {/* Rosy Cheeks */}
        <ellipse cx="41" cy="49" rx="3.5" ry="2" fill="#F472B6" opacity="0.6" />
        <ellipse cx="75" cy="49" rx="3.5" ry="2" fill="#F472B6" opacity="0.6" />
        {/* Smile */}
        <path
          d="M53 49 Q58 55 63 49"
          stroke="#4C1D95"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Cute Legs */}
        <path
          d="M48 68 L46 82 M68 68 L70 82"
          stroke="#8B5CF6"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export const EggCharacter: React.FC<CharacterProps> = ({ className = '', size = 48 }) => {
  return (
    <div className={`inline-block select-none pointer-events-none drop-shadow-sm transition-transform hover:scale-110 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Egg/Pebble Body */}
        <path
          d="M50 15 C30 15 22 35 22 60 C22 80 34 88 50 88 C66 88 78 80 78 60 C78 35 70 15 50 15 Z"
          fill="#FEF08A"
          stroke="#CA8A04"
          strokeWidth="3"
        />
        {/* Inner face patch */}
        <ellipse cx="50" cy="56" rx="18" ry="16" fill="#FEF9C3" />
        {/* Eyes */}
        <ellipse cx="44" cy="52" rx="3" ry="4" fill="#713F12" />
        <ellipse cx="56" cy="52" rx="3" ry="4" fill="#713F12" />
        <circle cx="45" cy="50.5" r="1" fill="#FFFFFF" />
        <circle cx="57" cy="50.5" r="1" fill="#FFFFFF" />
        {/* Cheeks */}
        <ellipse cx="38" cy="56" rx="2.5" ry="1.5" fill="#F87171" opacity="0.6" />
        <ellipse cx="62" cy="56" rx="2.5" ry="1.5" fill="#F87171" opacity="0.6" />
        {/* Smile */}
        <path
          d="M47 57 Q50 61 53 57"
          stroke="#713F12"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Little arms */}
        <path
          d="M23 58 Q15 62 16 70 M77 58 Q85 62 84 70"
          stroke="#CA8A04"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Little feet */}
        <path
          d="M40 88 L38 96 M60 88 L62 96"
          stroke="#CA8A04"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export const PencilBlob: React.FC<CharacterProps> = ({ className = '', size = 52 }) => {
  return (
    <div className={`inline-block select-none pointer-events-none drop-shadow-sm transition-transform hover:scale-110 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pink round body */}
        <circle cx="45" cy="52" r="28" fill="#FBCFE8" stroke="#DB2777" strokeWidth="3" />
        {/* Eyes */}
        <ellipse cx="39" cy="48" rx="3" ry="4" fill="#831843" />
        <ellipse cx="51" cy="48" rx="3" ry="4" fill="#831843" />
        <circle cx="40" cy="46.5" r="1" fill="#FFFFFF" />
        <circle cx="52" cy="46.5" r="1" fill="#FFFFFF" />
        {/* Cheeks */}
        <ellipse cx="33" cy="53" rx="2.5" ry="1.5" fill="#F43F5E" opacity="0.6" />
        <ellipse cx="57" cy="53" rx="2.5" ry="1.5" fill="#F43F5E" opacity="0.6" />
        {/* Smile */}
        <path
          d="M42 53 Q45 58 48 53"
          stroke="#831843"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Pencil in hand */}
        <g transform="translate(62, 38) rotate(25)">
          <rect x="0" y="0" width="8" height="24" rx="2" fill="#A855F7" stroke="#6B21A8" strokeWidth="1.5" />
          <polygon points="0,24 8,24 4,32" fill="#FDE047" stroke="#6B21A8" strokeWidth="1.5" />
          <polygon points="2,29 6,29 4,32" fill="#1F2937" />
        </g>
        {/* Little feet */}
        <path
          d="M38 79 L36 89 M52 79 L54 89"
          stroke="#DB2777"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

// Pentagon character with cute legs and smile from IMG_2707
export const PentagonCharacter: React.FC<CharacterProps> = ({ className = '', size = 52 }) => {
  return (
    <div className={`inline-block select-none pointer-events-none drop-shadow-sm transition-transform hover:scale-110 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pentagon Body */}
        <polygon
          points="50,16 88,43 73,85 27,85 12,43"
          fill="#BFDBFE"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Eyes */}
        <ellipse cx="40" cy="46" rx="3.5" ry="4" fill="#1E3A8A" />
        <ellipse cx="60" cy="46" rx="3.5" ry="4" fill="#1E3A8A" />
        <circle cx="41.5" cy="44.5" r="1.2" fill="#FFFFFF" />
        <circle cx="61.5" cy="44.5" r="1.2" fill="#FFFFFF" />
        {/* Rosy Cheeks */}
        <ellipse cx="34" cy="51" rx="2.5" ry="1.5" fill="#F472B6" opacity="0.6" />
        <ellipse cx="66" cy="51" rx="2.5" ry="1.5" fill="#F472B6" opacity="0.6" />
        {/* Smile */}
        <path
          d="M45 52 Q50 57 55 52"
          stroke="#1E3A8A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Little Arms */}
        <path
          d="M16 52 Q8 58 10 65 M84 52 Q92 58 90 65"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Little Feet */}
        <path
          d="M38 85 L35 96 M62 85 L65 96"
          stroke="#3B82F6"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

// Orange round blob character from IMG_2707 & IMG_2710
export const OrangeBlobCharacter: React.FC<CharacterProps> = ({ className = '', size = 38 }) => {
  return (
    <div className={`inline-block select-none pointer-events-none drop-shadow-2xs transition-transform hover:scale-110 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="38" fill="#FED7AA" stroke="#EA580C" strokeWidth="3.5" />
        <ellipse cx="40" cy="44" rx="4" ry="5" fill="#7C2D12" />
        <ellipse cx="60" cy="44" rx="4" ry="5" fill="#7C2D12" />
        <circle cx="41.5" cy="42" r="1.5" fill="#FFFFFF" />
        <circle cx="61.5" cy="42" r="1.5" fill="#FFFFFF" />
        <ellipse cx="32" cy="52" rx="3.5" ry="2" fill="#F97316" opacity="0.6" />
        <ellipse cx="68" cy="52" rx="3.5" ry="2" fill="#F97316" opacity="0.6" />
        <path d="M45 52 Q50 60 55 52" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M38 88 L34 98 M62 88 L66 98" stroke="#EA580C" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// WORKMATE Logo Icon matching IMG_2710: Star character office worker with desk computer & smiling clock
export const WorkmateLogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 42, className = '' }) => {
  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Circular Background Glow */}
        <circle cx="60" cy="60" r="56" fill="#EDE9FE" />
        
        {/* Smiling Wall Clock in the background (as in IMG_2710) */}
        <g transform="translate(68, 12)">
          <circle cx="20" cy="20" r="17" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="2.5" />
          {/* Clock face eyes and smile */}
          <circle cx="15" cy="17" r="1.5" fill="#6D28D9" />
          <circle cx="25" cy="17" r="1.5" fill="#6D28D9" />
          <path d="M17 21 Q20 24 23 21" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Clock hands */}
          <line x1="20" y1="20" x2="20" y2="10" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="20" x2="27" y2="20" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
          {/* Little colorful star decoration on top of clock */}
          <polygon points="20,0 22,5 27,6 23,9 24,14 20,11 16,14 17,9 13,6 18,5" fill="#FBBF24" />
        </g>

        {/* Desk with Computer */}
        <rect x="22" y="78" width="76" height="5" rx="2" fill="#D8B4FE" stroke="#7C3AED" strokeWidth="2" />
        <rect x="30" y="83" width="5" height="24" fill="#C4B5FD" stroke="#7C3AED" strokeWidth="1.5" />
        <rect x="85" y="83" width="5" height="24" fill="#C4B5FD" stroke="#7C3AED" strokeWidth="1.5" />
        
        {/* Laptop/Desktop Monitor */}
        <rect x="58" y="60" width="22" height="15" rx="2" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="2" />
        <rect x="67" y="75" width="4" height="4" fill="#7C3AED" />
        <rect x="63" y="78" width="12" height="2" rx="1" fill="#7C3AED" />

        {/* Star Head Character Worker Sitting at Desk */}
        <g>
          {/* Star Head */}
          <path
            d="M42 22 L47 34 L60 36 L50 45 L53 58 L42 51 L31 58 L34 45 L24 36 L37 34 Z"
            fill="#A78BFA"
            stroke="#6D28D9"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Eyes */}
          <ellipse cx="38" cy="40" rx="2" ry="2.5" fill="#2E1065" />
          <ellipse cx="46" cy="40" rx="2" ry="2.5" fill="#2E1065" />
          {/* Cheeks */}
          <ellipse cx="34" cy="43" rx="1.8" ry="1.2" fill="#F472B6" opacity="0.8" />
          <ellipse cx="50" cy="43" rx="1.8" ry="1.2" fill="#F472B6" opacity="0.8" />
          {/* Smile */}
          <path d="M40 43 Q42 46 44 43" stroke="#2E1065" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          
          {/* Body sitting in chair */}
          <path d="M34 54 C34 54 30 70 32 82 L48 82 C50 70 48 54 48 54 Z" fill="#818CF8" stroke="#4F46E5" strokeWidth="2" />
          {/* Arm typing on keyboard */}
          <path d="M44 64 Q54 68 62 76" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </div>
  );
};

// --- STICKERS FROM IMG_2721 ---

// Violet / Pansy flower sticker with die-cut white outline
export const FlowerSticker: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => {
  return (
    <div className={`inline-block drop-shadow-md select-none pointer-events-none hover:rotate-6 transition-transform ${className}`}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White die-cut sticker border */}
        <circle cx="50" cy="50" r="44" fill="#FFFFFF" />
        {/* Flower Petals */}
        <g transform="translate(50, 50)">
          {/* 5 Petals */}
          <ellipse cx="0" cy="-22" rx="15" ry="18" fill="#6D28D9" />
          <ellipse cx="20" cy="-6" rx="15" ry="17" fill="#7C3AED" />
          <ellipse cx="14" cy="18" rx="16" ry="18" fill="#5B21B6" />
          <ellipse cx="-14" cy="18" rx="16" ry="18" fill="#5B21B6" />
          <ellipse cx="-20" cy="-6" rx="15" ry="17" fill="#7C3AED" />
          {/* Inner petal highlights & texture */}
          <circle cx="0" cy="-15" r="9" fill="#8B5CF6" opacity="0.6" />
          <circle cx="12" cy="-4" r="8" fill="#8B5CF6" opacity="0.6" />
          <circle cx="9" cy="12" r="9" fill="#4C1D95" opacity="0.7" />
          <circle cx="-9" cy="12" r="9" fill="#4C1D95" opacity="0.7" />
          <circle cx="-12" cy="-4" r="8" fill="#8B5CF6" opacity="0.6" />
          {/* Center core */}
          <circle cx="0" cy="0" r="8" fill="#FDE047" />
          <circle cx="0" cy="0" r="4" fill="#EAB308" />
        </g>
      </svg>
    </div>
  );
};

// Pop-art Heart Sticker with white border
export const HeartSticker: React.FC<{ size?: number; className?: string }> = ({ size = 42, className = '' }) => {
  return (
    <div className={`inline-block drop-shadow-md select-none pointer-events-none hover:scale-105 transition-transform ${className}`}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Die-cut white border */}
        <path
          d="M50 88 C20 66 8 50 8 30 C8 16 19 8 32 8 C40 8 47 13 50 18 C53 13 60 8 68 8 C81 8 92 16 92 30 C92 50 80 66 50 88 Z"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* Main Heart */}
        <path
          d="M50 82 C23 62 12 48 12 30 C12 18 21 11 32 11 C39 11 45 15 50 21 C55 15 61 11 68 11 C79 11 88 18 88 30 C88 48 77 62 50 82 Z"
          fill="url(#heartGrad)"
        />
        {/* Highlight sheen */}
        <ellipse cx="30" cy="24" rx="8" ry="4" transform="rotate(-35 30 24)" fill="#FFFFFF" opacity="0.6" />
        <defs>
          <linearGradient id="heartGrad" x1="12" y1="11" x2="88" y2="82" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FB7185" />
            <stop offset="1" stopColor="#E11D48" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// "thank you" hand-drawn badge sticker
export const ThankYouSticker: React.FC<{ size?: number; className?: string }> = ({ size = 64, className = '' }) => {
  return (
    <div className={`inline-block drop-shadow-md select-none pointer-events-none hover:rotate-3 transition-transform ${className}`}>
      <svg width={size} height={size * 0.55} viewBox="0 0 120 66" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White sticker backing */}
        <rect x="3" y="3" width="114" height="60" rx="30" fill="#FFFFFF" />
        <rect x="6" y="6" width="108" height="54" rx="27" fill="#EDE9FE" />
        <text x="60" y="32" fill="#6D28D9" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          thank
        </text>
        <text x="60" y="48" fill="#DB2777" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          ♥ you ♥
        </text>
      </svg>
    </div>
  );
};

// Golden star sparkle sticker
export const StarSticker: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => {
  return (
    <div className={`inline-block drop-shadow-sm select-none pointer-events-none ${className}`}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="44" fill="#FFFFFF" />
        <path
          d="M50 10 L61 36 L88 38 L67 56 L74 82 L50 68 L26 82 L33 56 L12 38 L39 36 Z"
          fill="#FDE047"
          stroke="#EAB308"
          strokeWidth="3"
        />
        <circle cx="43" cy="46" r="3" fill="#713F12" />
        <circle cx="57" cy="46" r="3" fill="#713F12" />
        <path d="M47 52 Q50 56 53 52" stroke="#713F12" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};


