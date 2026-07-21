// Íconos SVG inline. Se renderizan directo en el DOM (currentColor),
// sin mask-image ni archivos externos: por eso nunca quedan "vacíos".
const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const Icon = {
  home: (p) => (<svg {...base} {...p}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>),
  clock: (p) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>),
  sliders: (p) => (<svg {...base} {...p}><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" /><circle cx="8" cy="18" r="2" fill="currentColor" stroke="none" /></svg>),
  book: (p) => (<svg {...base} {...p}><path d="M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2z" /><path d="M8 3v18" /></svg>),
  users: (p) => (<svg {...base} {...p}><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5" /><path d="M17 11a3 3 0 000-6" /><path d="M21 20c0-2-1.5-3.5-3.5-4.2" /></svg>),
  userPlus: (p) => (<svg {...base} {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 3-5.5 6-5.5" /><path d="M17 8v6M14 11h6" /></svg>),
  monitor: (p) => (<svg {...base} {...p}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>),
  chart: (p) => (<svg {...base} {...p}><path d="M4 20V4" /><path d="M4 20h16" /><rect x="7" y="12" width="3" height="5" fill="currentColor" stroke="none" /><rect x="12" y="8" width="3" height="9" fill="currentColor" stroke="none" /><rect x="17" y="5" width="3" height="12" fill="currentColor" stroke="none" /></svg>),
  fingerprint: (p) => (<svg {...base} {...p}><path d="M12 4a8 8 0 00-8 8v2" /><path d="M12 4a8 8 0 018 8v2a10 10 0 01-.3 2.5" /><path d="M8 12a4 4 0 018 0v3a6 6 0 01-.5 2.5" /><path d="M12 12v4a3 3 0 01-.3 1.3" /><path d="M6.5 17.5a10 10 0 01-.5-3v-2" /></svg>),
  logout: (p) => (<svg {...base} {...p}><path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3" /><path d="M10 12H3" /><path d="M6 8l-4 4 4 4" /></svg>),
  check: (p) => (<svg {...base} {...p}><path d="M20 6L9 17l-5-5" /></svg>),
  alert: (p) => (<svg {...base} {...p}><path d="M12 3l9 16H3z" /><path d="M12 9v5M12 17h.01" /></svg>),
  x: (p) => (<svg {...base} {...p}><path d="M18 6L6 18M6 6l12 12" /></svg>),
  download: (p) => (<svg {...base} {...p}><path d="M12 3v12M8 11l4 4 4-4" /><path d="M4 19h16" /></svg>),
  search: (p) => (<svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>),
  calendar: (p) => (<svg {...base} {...p}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>),
  eye: (p) => (<svg {...base} {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>),
}
