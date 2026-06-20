/**
 * 卡通宠物装饰 — 用于空状态、登录页等场景。
 */

/** 坐着的卡通狗 SVG */
export function CuteDog({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className="animate-float"
    >
      {/* 身体 */}
      <ellipse cx="50" cy="70" rx="28" ry="22" fill="#F4A460" />
      {/* 肚皮 */}
      <ellipse cx="50" cy="75" rx="18" ry="14" fill="#FEF3E2" />
      {/* 头 */}
      <circle cx="50" cy="42" r="24" fill="#F4A460" />
      {/* 耳朵左 */}
      <ellipse cx="30" cy="28" rx="10" ry="16" fill="#D4843A" transform="rotate(-15 30 28)" />
      {/* 耳朵右 */}
      <ellipse cx="70" cy="28" rx="10" ry="16" fill="#D4843A" transform="rotate(15 70 28)" />
      {/* 眼睛左 */}
      <circle cx="40" cy="40" r="4" fill="#333" />
      <circle cx="41" cy="38" r="1.5" fill="#fff" />
      {/* 眼睛右 */}
      <circle cx="60" cy="40" r="4" fill="#333" />
      <circle cx="61" cy="38" r="1.5" fill="#fff" />
      {/* 鼻子 */}
      <ellipse cx="50" cy="48" rx="6" ry="4" fill="#333" />
      {/* 嘴 */}
      <path d="M44 52 Q50 58 56 52" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* 舌头 */}
      <ellipse cx="50" cy="56" rx="3" ry="4" fill="#FF8C8C" />
      {/* 前爪 */}
      <ellipse cx="32" cy="82" rx="10" ry="7" fill="#F4A460" />
      <ellipse cx="68" cy="82" rx="10" ry="7" fill="#F4A460" />
      {/* 尾巴 */}
      <path d="M78 65 Q88 55 82 45" stroke="#F4A460" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/** 坐着的卡通猫 SVG */
export function CuteCat({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className="animate-float"
    >
      {/* 身体 */}
      <ellipse cx="50" cy="72" rx="24" ry="20" fill="#C0C0C0" />
      {/* 肚皮 */}
      <ellipse cx="50" cy="76" rx="16" ry="12" fill="#F0F0F0" />
      {/* 头 */}
      <circle cx="50" cy="44" r="22" fill="#C0C0C0" />
      {/* 耳朵左 */}
      <polygon points="30,28 36,12 42,28" fill="#C0C0C0" />
      <polygon points="33,26 36,16 39,26" fill="#FFB6C1" />
      {/* 耳朵右 */}
      <polygon points="58,28 64,12 70,28" fill="#C0C0C0" />
      <polygon points="61,26 64,16 67,26" fill="#FFB6C1" />
      {/* 眼睛左 */}
      <ellipse cx="40" cy="42" rx="4" ry="5" fill="#5B8C5A" />
      <ellipse cx="40" cy="42" rx="2" ry="4" fill="#111" />
      <circle cx="41" cy="39" r="1.5" fill="#fff" />
      {/* 眼睛右 */}
      <ellipse cx="60" cy="42" rx="4" ry="5" fill="#5B8C5A" />
      <ellipse cx="60" cy="42" rx="2" ry="4" fill="#111" />
      <circle cx="61" cy="39" r="1.5" fill="#fff" />
      {/* 鼻子 */}
      <polygon points="50,47 47,50 53,50" fill="#FFB6C1" />
      {/* 嘴 */}
      <path d="M47 50 Q50 54 53 50" stroke="#999" strokeWidth="1" fill="none" />
      {/* 胡须左 */}
      <line x1="25" y1="45" x2="38" y2="47" stroke="#999" strokeWidth="0.8" />
      <line x1="25" y1="50" x2="38" y2="50" stroke="#999" strokeWidth="0.8" />
      {/* 胡须右 */}
      <line x1="62" y1="47" x2="75" y2="45" stroke="#999" strokeWidth="0.8" />
      <line x1="62" y1="50" x2="75" y2="50" stroke="#999" strokeWidth="0.8" />
      {/* 前爪 */}
      <ellipse cx="35" cy="82" rx="9" ry="6" fill="#C0C0C0" />
      <ellipse cx="65" cy="82" rx="9" ry="6" fill="#C0C0C0" />
      {/* 尾巴 */}
      <path d="M74 68 Q84 58 80 46 Q78 40 74 44" stroke="#C0C0C0" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/** 爪印装饰 */
export function PawPrints({ count = 5 }: { count?: number }) {
  const positions = [
    'right-10 top-20',
    'right-16 top-40',
    'right-8 top-60',
    'right-14 top-80',
  ]

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-[0.04]">
      {positions.slice(0, count).map((pos, i) => (
        <span
          key={i}
          className={`absolute ${pos} text-6xl`}
          style={{ transform: `rotate(${i * 20 - 20}deg)` }}
        >
          🐾
        </span>
      ))}
    </div>
  )
}
