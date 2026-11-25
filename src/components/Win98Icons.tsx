/**
 * Ikon piksel klasik bergaya Windows 98 (16x16 & 32x32)
 * menggunakan SVG shapeRendering="crispEdges" agar tajam tanpa blur.
 */

export function WinFlagIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} aria-hidden="true">
      {/* Classic 4-pane flying retro flag */}
      <rect x="2" y="3" width="5" height="4" fill="#ff3b30" />
      <rect x="8" y="2" width="5" height="4" fill="#34c759" />
      <rect x="2" y="8" width="5" height="4" fill="#007aff" />
      <rect x="8" y="7" width="5" height="4" fill="#ffcc00" />
      <rect x="1" y="4" width="1" height="2" fill="#111111" />
      <rect x="1" y="9" width="1" height="2" fill="#111111" />
    </svg>
  );
}

export function MyComputerIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" shapeRendering="crispEdges" className={className} aria-hidden="true">
      {/* Monitor */}
      <rect x="4" y="3" width="24" height="17" fill="#dfdfdf" />
      <rect x="4" y="3" width="24" height="2" fill="#ffffff" />
      <rect x="4" y="3" width="2" height="17" fill="#ffffff" />
      <rect x="26" y="3" width="2" height="17" fill="#808080" />
      <rect x="4" y="18" width="24" height="2" fill="#808080" />
      <rect x="7" y="6" width="18" height="10" fill="#008080" />
      <rect x="8" y="7" width="14" height="2" fill="#000080" />
      <rect x="9" y="10" width="10" height="4" fill="#ffffff" />
      {/* Stand & Desktop case */}
      <rect x="12" y="20" width="8" height="2" fill="#808080" />
      <rect x="5" y="22" width="22" height="6" fill="#c0c0c0" />
      <rect x="5" y="22" width="22" height="1" fill="#ffffff" />
      <rect x="5" y="27" width="22" height="2" fill="#404040" />
      <rect x="8" y="24" width="7" height="2" fill="#404040" />
      <rect x="22" y="24" width="2" height="2" fill="#22c55e" />
    </svg>
  );
}

export function NotepadIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" shapeRendering="crispEdges" className={className} aria-hidden="true">
      <rect x="6" y="5" width="20" height="24" fill="#ffffff" />
      <rect x="5" y="4" width="1" height="25" fill="#000000" />
      <rect x="26" y="5" width="1" height="24" fill="#000000" />
      <rect x="6" y="29" width="20" height="1" fill="#000000" />
      <rect x="6" y="4" width="20" height="4" fill="#008080" />
      {/* Spiral binding */}
      <rect x="8" y="2" width="2" height="4" fill="#404040" />
      <rect x="13" y="2" width="2" height="4" fill="#404040" />
      <rect x="18" y="2" width="2" height="4" fill="#404040" />
      <rect x="23" y="2" width="2" height="4" fill="#404040" />
      {/* Lines */}
      <rect x="9" y="11" width="14" height="2" fill="#000080" />
      <rect x="9" y="15" width="12" height="2" fill="#808080" />
      <rect x="9" y="19" width="14" height="2" fill="#808080" />
      <rect x="9" y="23" width="9" height="2" fill="#808080" />
    </svg>
  );
}

export function FolderUsersIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" shapeRendering="crispEdges" className={className} aria-hidden="true">
      <rect x="3" y="6" width="10" height="3" fill="#facc15" />
      <rect x="3" y="9" width="26" height="17" fill="#fde047" />
      <rect x="3" y="9" width="26" height="2" fill="#fef08a" />
      <rect x="3" y="25" width="26" height="2" fill="#ca8a04" />
      <rect x="2" y="6" width="1" height="20" fill="#000000" />
      <rect x="29" y="9" width="1" height="17" fill="#000000" />
      <rect x="3" y="26" width="26" height="1" fill="#000000" />
      {/* Mini badge inside folder */}
      <rect x="12" y="13" width="8" height="4" fill="#000080" />
      <rect x="10" y="18" width="12" height="5" fill="#2563eb" />
    </svg>
  );
}

export function SysMonitorIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" shapeRendering="crispEdges" className={className} aria-hidden="true">
      <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" />
      <rect x="4" y="4" width="24" height="2" fill="#ffffff" />
      <rect x="4" y="26" width="24" height="2" fill="#404040" />
      <rect x="7" y="7" width="18" height="16" fill="#0f172a" />
      {/* Grid */}
      <rect x="7" y="14" width="18" height="1" fill="#14532d" />
      <rect x="15" y="7" width="1" height="16" fill="#14532d" />
      {/* Graph pulse */}
      <rect x="8" y="18" width="3" height="2" fill="#4ade80" />
      <rect x="11" y="13" width="2" height="5" fill="#4ade80" />
      <rect x="13" y="10" width="2" height="4" fill="#4ade80" />
      <rect x="15" y="14" width="2" height="6" fill="#4ade80" />
      <rect x="17" y="12" width="3" height="3" fill="#4ade80" />
      <rect x="20" y="16" width="4" height="2" fill="#4ade80" />
    </svg>
  );
}

export function RoadmapHelpIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" shapeRendering="crispEdges" className={className} aria-hidden="true">
      <rect x="5" y="4" width="20" height="24" fill="#facc15" />
      <rect x="5" y="4" width="20" height="2" fill="#fef08a" />
      <rect x="5" y="26" width="20" height="2" fill="#a16207" />
      <rect x="5" y="4" width="4" height="24" fill="#b45309" />
      {/* Question / Map Emblem */}
      <rect x="13" y="9" width="6" height="2" fill="#000080" />
      <rect x="17" y="11" width="2" height="3" fill="#000080" />
      <rect x="14" y="14" width="4" height="2" fill="#000080" />
      <rect x="14" y="16" width="2" height="3" fill="#000080" />
      <rect x="14" y="21" width="2" height="2" fill="#000080" />
    </svg>
  );
}

export function PictureGalleryIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" shapeRendering="crispEdges" className={className} aria-hidden="true">
      <rect x="4" y="5" width="24" height="22" fill="#ffffff" />
      <rect x="3" y="4" width="26" height="1" fill="#000000" />
      <rect x="3" y="27" width="26" height="1" fill="#000000" />
      <rect x="3" y="5" width="1" height="22" fill="#000000" />
      <rect x="28" y="5" width="1" height="22" fill="#000000" />
      {/* Sky & Sun */}
      <rect x="6" y="7" width="20" height="13" fill="#7dd3fc" />
      <rect x="20" y="9" width="4" height="4" fill="#fde047" />
      {/* Pixel mountains */}
      <rect x="6" y="17" width="20" height="4" fill="#16a34a" />
      <rect x="9" y="14" width="6" height="3" fill="#15803d" />
      <rect x="16" y="15" width="7" height="2" fill="#15803d" />
      <rect x="6" y="22" width="14" height="2" fill="#808080" />
    </svg>
  );
}

export function NetworkGlobeIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" shapeRendering="crispEdges" className={className} aria-hidden="true">
      <rect x="9" y="4" width="14" height="14" fill="#38bdf8" />
      <rect x="11" y="6" width="4" height="4" fill="#4ade80" />
      <rect x="17" y="8" width="4" height="6" fill="#4ade80" />
      <rect x="12" y="12" width="5" height="4" fill="#4ade80" />
      <rect x="8" y="4" width="1" height="14" fill="#000080" />
      <rect x="23" y="4" width="1" height="14" fill="#000080" />
      <rect x="9" y="3" width="14" height="1" fill="#000080" />
      <rect x="9" y="18" width="14" height="1" fill="#000080" />
      {/* LAN Cable Base */}
      <rect x="15" y="19" width="2" height="5" fill="#404040" />
      <rect x="6" y="24" width="20" height="2" fill="#404040" />
      <rect x="7" y="22" width="4" height="6" fill="#c0c0c0" />
      <rect x="21" y="22" width="4" height="6" fill="#c0c0c0" />
      <rect x="8" y="23" width="2" height="2" fill="#22c55e" />
      <rect x="22" y="23" width="2" height="2" fill="#22c55e" />
    </svg>
  );
}

export function RecycleBinIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" shapeRendering="crispEdges" className={className} aria-hidden="true">
      <rect x="8" y="6" width="16" height="3" fill="#dfdfdf" />
      <rect x="12" y="4" width="8" height="2" fill="#808080" />
      <rect x="9" y="9" width="14" height="18" fill="#c0c0c0" />
      <rect x="9" y="9" width="2" height="18" fill="#ffffff" />
      <rect x="21" y="9" width="2" height="18" fill="#808080" />
      <rect x="8" y="27" width="16" height="1" fill="#000000" />
      {/* Recycle symbol */}
      <rect x="13" y="14" width="6" height="2" fill="#16a34a" />
      <rect x="12" y="16" width="2" height="4" fill="#16a34a" />
      <rect x="18" y="16" width="2" height="4" fill="#16a34a" />
      <rect x="14" y="20" width="4" height="2" fill="#16a34a" />
    </svg>
  );
}

export function RunKeyIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className={className} aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" fill="#c0c0c0" />
      <rect x="2" y="4" width="20" height="4" fill="#000080" />
      <rect x="5" y="10" width="14" height="4" fill="#ffffff" />
      <rect x="6" y="11" width="2" height="2" fill="#000000" />
      <rect x="13" y="16" width="6" height="2" fill="#808080" />
    </svg>
  );
}
