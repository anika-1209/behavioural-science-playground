/** A plain ceramic mug. Decorative: the text around it describes it. */
export function Mug() {
  return (
    <svg className="mug" viewBox="0 0 160 140" aria-hidden="true">
      <ellipse cx="72" cy="128" rx="54" ry="7" className="mug-shadow" />
      <path d="M30 26 h84 v78 a18 18 0 0 1 -18 18 h-48 a18 18 0 0 1 -18 -18 z" className="mug-body" />
      <path d="M114 44 h10 a20 20 0 0 1 0 40 h-10" className="mug-handle" />
      <ellipse cx="72" cy="26" rx="42" ry="8" className="mug-rim" />
      <path d="M44 64 l14 -14 l14 14 l14 -14 l14 14" className="mug-pattern" />
      <path d="M44 82 l14 -14 l14 14 l14 -14 l14 14" className="mug-pattern" />
    </svg>
  );
}
