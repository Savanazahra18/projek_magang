import { ReactNode } from 'react'

export type IconName =
  | 'grid' | 'clipboard' | 'file' | 'copy' | 'layers' | 'calc' | 'fileText'
  | 'chart' | 'files' | 'search' | 'bell' | 'calendar' | 'plus' | 'arrowRight'
  | 'chevronRight' | 'chevronLeft' | 'chevronDown' | 'sliders' | 'clock' | 'logout'
  | 'trend' | 'briefcase' | 'fileEdit' | 'checkCircle' | 'fileCheck' | 'close'
  | 'check' | 'globe' | 'inbox' | 'menu' | 'download' | 'database' | 'users'
  | 'arrowUp' | 'pin' | 'arrowUpRight' | 'upload' | 'send' | 'pdf' | 'back' | 'pulse'

const paths: Record<IconName, ReactNode> = {
  menu: <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3" /></>,
  file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /></>,
  copy: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M4 16V5a2 2 0 012-2h11" /></>,
  layers: <><rect x="3" y="7" width="14" height="14" rx="2" /><path d="M7 3h12a2 2 0 012 2v12" /></>,
  calc: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" /></>,
  fileText: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h4" /></>,
  chart: <><path d="M3 20h18" /><path d="M5 16l5-5 3 3 6-7" /></>,
  files: <><path d="M8 7h8l3 3v11H8z" /><path d="M5 17V4h8" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  bell: <><path d="M18 9a6 6 0 00-12 0c0 6-3 7-3 8h18c0-1-3-2-3-8" /><path d="M10 21h4" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevronRight: <path d="M9 18l6-6-6-6" />,
  chevronLeft: <path d="M15 18l-6-6 6-6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  sliders: <><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  logout: <><path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3" /><path d="M10 17l-5-5 5-5M5 12h11" /></>,
  trend: <><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5h6v2M3 12h18" /></>,
  fileEdit: <><path d="M14 3H6v18h6" /><path d="M14 3l4 4v3" /><path d="M19.5 13.5l2 2L16 21h-2v-2z" /></>,
  checkCircle: <><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></>,
  fileCheck: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9.5 14l2 2 3.5-4" /></>,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12l5 5L20 7" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></>,
  inbox: <><path d="M4 4h16v16H4z" /><path d="M4 13h4l2 3h4l2-3h4" /></>,
  download: <><path d="M12 4v11M7 10l5 5 5-5" /><path d="M4 20h16" /></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-4 2.5-6.5 6-6.5s6 2.5 6 6.5" /><path d="M16 5a3 3 0 010 6M18 14c2 .6 3 2.7 3 6" /></>,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
  arrowUpRight: <><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></>,
  upload: <><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m8 16 4-4 4 4" /></>,
  send: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
  pdf: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
  back: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
  pulse: <><circle cx="12" cy="12" r="9" /><path d="M7 12h2l2-4 2 8 2-4h2" /></>,
}

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || null}
    </svg>
  )
}

