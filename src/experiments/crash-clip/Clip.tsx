// Top-down crossroads, drawn in SVG and animated with CSS (see .clip in global.css).
// There is deliberately no broken glass anywhere in the scene.
export function Clip({ playing }: { playing: boolean }) {
  return (
    <div className={`clip${playing ? ' playing' : ''}`}>
      <svg
        viewBox="0 0 400 300"
        role="img"
        aria-label="Top-down view of a crossroads with buildings on each corner. A blue car drives in from the left and a red car drives up from the bottom. They collide in the middle of the junction and both stop, turned at an angle."
      >
        <rect className="block-a" x="0" y="0" width="170" height="122" />
        <rect className="block-b" x="230" y="0" width="170" height="122" />
        <rect className="block-c" x="0" y="190" width="170" height="110" />
        <rect className="block-d" x="230" y="190" width="170" height="110" />
        <circle className="tree" cx="40" cy="40" r="16" />
        <circle className="tree" cx="80" cy="70" r="12" />
        <circle className="tree" cx="360" cy="250" r="16" />
        <circle className="tree" cx="300" cy="270" r="11" />
        <rect className="road" x="0" y="122" width="400" height="68" />
        <rect className="road" x="170" y="0" width="60" height="300" />
        <line className="dash" x1="0" y1="156" x2="160" y2="156" />
        <line className="dash" x1="240" y1="156" x2="400" y2="156" />
        <line className="dash" x1="200" y1="0" x2="200" y2="112" />
        <line className="dash" x1="200" y1="200" x2="200" y2="300" />
        <g className="impact" transform="translate(181 151)">
          <line x1="-14" y1="-10" x2="-20" y2="-16" />
          <line x1="4" y1="-14" x2="6" y2="-22" />
          <line x1="14" y1="-6" x2="21" y2="-10" />
        </g>
        <g className="car car-a">
          <rect className="car-body-a" x="-22" y="-11" width="44" height="22" rx="5" />
          <rect className="car-glass" x="4" y="-8" width="9" height="16" rx="2" />
          <rect className="car-glass" x="-15" y="-8" width="6" height="16" rx="2" />
        </g>
        <g className="car car-b">
          <rect className="car-body-b" x="-11" y="-22" width="22" height="44" rx="5" />
          <rect className="car-glass" x="-8" y="-13" width="16" height="9" rx="2" />
          <rect className="car-glass" x="-8" y="9" width="16" height="6" rx="2" />
        </g>
      </svg>
    </div>
  );
}
