export default function BrandMark({ compact = false }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "" : "mb-8"}`}>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500 text-ink shadow-lg shadow-gold-500/20">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
          <path
            d="M4 8.5A2.5 2.5 0 0 1 6.5 6H18a2 2 0 0 1 2 2v9.5a1.5 1.5 0 0 1-1.5 1.5h-13A2 2 0 0 1 3.5 17V10"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path d="M8 10h8M8 13.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium tracking-[0.18em] text-gold-400">TICKETIN</p>
        <p className="text-sm text-white/70">Event Ticketing</p>
      </div>
    </div>
  );
}
