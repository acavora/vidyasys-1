import React from 'react';

interface VidyasysLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'compact' | 'horizontal' | 'full';
  showTagline?: boolean;
  showPillars?: boolean;
  className?: string;
  dark?: boolean;
}

/**
 * Pure SVG vector emblem strictly reproducing the official Vidyasys brand emblem:
 * - Mortarboard cap with tassel
 * - Three student silhouettes
 * - Open book dynamic 'V' wings with multi-layered pages
 */
export const VidyasysEmblem: React.FC<{
  className?: string;
  size?: number | string;
}> = ({ className = 'w-10 h-10', size }) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 select-none ${className}`}
      style={style}
      aria-label="Vidyasys Logo"
    >
      <defs>
        {/* Navy Cap Gradient */}
        <linearGradient id="vs-navy-grad" x1="40" y1="20" x2="160" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0a2558" />
          <stop offset="50%" stopColor="#0e3478" />
          <stop offset="100%" stopColor="#081e46" />
        </linearGradient>

        {/* Primary Dynamic V Book Wing Gradient */}
        <linearGradient id="vs-wing-left" x1="30" y1="45" x2="100" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0091ff" />
          <stop offset="35%" stopColor="#0072f5" />
          <stop offset="100%" stopColor="#0842a0" />
        </linearGradient>

        <linearGradient id="vs-wing-right" x1="170" y1="45" x2="100" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0091ff" />
          <stop offset="35%" stopColor="#0072f5" />
          <stop offset="100%" stopColor="#0842a0" />
        </linearGradient>

        {/* Lower Open Pages Blue Gradient */}
        <linearGradient id="vs-page-left" x1="25" y1="120" x2="100" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0077ff" />
          <stop offset="100%" stopColor="#0a2862" />
        </linearGradient>

        <linearGradient id="vs-page-right" x1="175" y1="120" x2="100" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0077ff" />
          <stop offset="100%" stopColor="#0a2862" />
        </linearGradient>

        {/* Under-shadow Gradient */}
        <linearGradient id="vs-shadow" x1="100" y1="130" x2="100" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#05193d" />
          <stop offset="100%" stopColor="#0b2c6d" />
        </linearGradient>
      </defs>

      {/* ====================================================
          1. GRADUATION CAP (MORTARBOARD) & TASSEL
         ==================================================== */}
      <g id="mortarboard-cap">
        {/* Skull cap underside */}
        <path
          d="M 66 52 C 66 52, 100 68, 134 52 L 134 62 C 134 62, 100 78, 66 62 Z"
          fill="#061838"
        />

        {/* Diamond mortarboard top plate */}
        <path
          d="M 100 16 L 165 46 L 100 72 L 35 46 Z"
          fill="url(#vs-navy-grad)"
        />

        {/* Cap Button / Rivet */}
        <circle cx="100" cy="45.5" r="3.2" fill="#061633" />

        {/* Tassel cord curving to right */}
        <path
          d="M 100 46 C 114 47, 142 50, 147 62 L 146 76"
          stroke="#0a2558"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Tassel pendant fringe */}
        <path
          d="M 143.5 76 L 148.5 76 L 150 92 L 142 92 Z"
          fill="#081e46"
        />
        <circle cx="146" cy="76" r="2" fill="#081e46" />
      </g>

      {/* ====================================================
          2. THREE STUDENTS SILHOUETTES
         ==================================================== */}
      <g id="students">
        {/* Left Student Silhouette (Light Royal Blue) */}
        <circle cx="75" cy="74" r="7.5" fill="#3284ff" />
        <path
          d="M 62 98 C 62 87, 69 83, 75 83 C 81 83, 87 87, 88 98 Z"
          fill="#3284ff"
        />

        {/* Right Student Silhouette (Light Royal Blue) */}
        <circle cx="125" cy="74" r="7.5" fill="#3284ff" />
        <path
          d="M 112 98 C 113 87, 119 83, 125 83 C 131 83, 138 87, 138 98 Z"
          fill="#3284ff"
        />

        {/* Center Student Silhouette (Deep Navy Leader) */}
        <circle cx="100" cy="70" r="9.5" fill="#0a2558" />
        <path
          d="M 83 103 C 83 89, 91 83, 100 83 C 109 83, 117 89, 117 103 Z"
          fill="#0a2558"
        />
      </g>

      {/* ====================================================
          3. DYNAMIC 'V' BOOK WINGS (PRIMARY OPEN BOOK)
         ==================================================== */}
      <g id="book-v-wings">
        {/* Left V Wing */}
        <path
          d="M 100 148 L 40 56 C 40 56, 52 50, 70 65 L 100 114 Z"
          fill="url(#vs-wing-left)"
        />

        {/* Right V Wing */}
        <path
          d="M 100 148 L 160 56 C 160 56, 148 50, 130 65 L 100 114 Z"
          fill="url(#vs-wing-right)"
        />

        {/* Center Spine Notch Shadow */}
        <path
          d="M 100 114 L 100 148"
          stroke="url(#vs-shadow)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* ====================================================
          4. LOWER CURVED SPREADING BOOK PAGES
         ==================================================== */}
      <g id="book-lower-pages">
        {/* Left Upper Page Swoosh */}
        <path
          d="M 100 148 C 76 138, 48 118, 30 108 C 40 105, 78 126, 100 138 Z"
          fill="url(#vs-page-left)"
        />

        {/* Left Bottom Base Page Swoosh */}
        <path
          d="M 100 156 C 70 150, 38 136, 22 128 C 34 125, 70 139, 100 148 Z"
          fill="#0c3272"
        />

        {/* Right Upper Page Swoosh */}
        <path
          d="M 100 148 C 124 138, 152 118, 170 108 C 160 105, 122 126, 100 138 Z"
          fill="url(#vs-page-right)"
        />

        {/* Right Bottom Base Page Swoosh */}
        <path
          d="M 100 156 C 130 150, 162 136, 178 128 C 166 125, 130 139, 100 148 Z"
          fill="#0c3272"
        />

        {/* Center Book Spine Tip */}
        <polygon points="98,156 100,161 102,156" fill="#081e46" />
      </g>
    </svg>
  );
};

export const VidyasysLogo: React.FC<VidyasysLogoProps> = ({
  size = 'md',
  variant = 'compact',
  showTagline = true,
  showPillars = false,
  className = '',
  dark = false,
}) => {
  // Size mapping
  const emblemSizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  }[size];

  const brandTextClasses = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-4xl sm:text-5xl',
  }[size];

  const taglineClasses = {
    xs: 'text-[9px]',
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base sm:text-lg',
  }[size];

  // If icon only
  if (variant === 'icon') {
    return <VidyasysEmblem className={`${emblemSizeClasses} ${className}`} />;
  }

  // Full presentation variant (ideal for hero, welcome card, about, splash)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {/* Emblem */}
        <VidyasysEmblem className={`${emblemSizeClasses} drop-shadow-sm mb-3`} />

        {/* Logotype "Vidyasys" */}
        <div className="flex items-baseline tracking-tight font-black">
          <span className={dark ? 'text-white' : 'text-[#0a2356]'}>Vidya</span>
          <span className="text-[#0277fa]">sys</span>
        </div>

        {/* Tagline */}
        {showTagline && (
          <div className={`mt-2 font-medium tracking-normal ${taglineClasses}`}>
            <p className={dark ? 'text-slate-300' : 'text-[#0a2356]'}>
              One platform where students
            </p>
            <p className="text-[#0277fa] font-bold mt-0.5">
              Learn, Share, Build &amp; Grow.
            </p>
          </div>
        )}

        {/* 4 Pillars preview from official logo */}
        {showPillars && (
          <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-center gap-4 sm:gap-6 text-xs text-slate-700 font-semibold flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-blue-50 text-[#0277fa] flex items-center justify-center text-xs font-bold">
                📖
              </span>
              <span>Notes</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-50 text-[#10b981] flex items-center justify-center text-xs font-bold">
                ⚙️
              </span>
              <span>Projects</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-purple-50 text-[#8b5cf6] flex items-center justify-center text-xs font-bold">
                👥
              </span>
              <span>Tutoring</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-orange-50 text-[#f97316] flex items-center justify-center text-xs font-bold">
                🔀
              </span>
              <span>Resources</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Compact variant (ideal for navbar headers & cards)
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <VidyasysEmblem className={emblemSizeClasses} />
      <div className="leading-tight">
        <div className={`flex items-baseline font-black tracking-tight ${brandTextClasses}`}>
          <span className={dark ? 'text-white' : 'text-[#0a2356]'}>Vidya</span>
          <span className="text-[#0277fa]">sys</span>
        </div>
        {showTagline && (
          <p className={`text-[10px] sm:text-[11px] leading-none mt-0.5 ${dark ? 'text-slate-300' : 'text-slate-500'}`}>
            Learn, Share, Build &amp; Grow
          </p>
        )}
      </div>
    </div>
  );
};
