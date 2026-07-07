// Editorial fashion illustration for the hero — a woman in a full Kanjeevaram
// drape, framed by a temple arch. Deliberately stylised (minimal face) in the
// manner of luxury fashion sketches; photoreal vector faces read uncanny.
export default function HeroWoman({ height = 480 }: { height?: number }) {
  return (
    <svg width={height * 0.57} height={height} viewBox="0 0 340 600" aria-hidden="true">
      <defs>
        <linearGradient id="hw-silk" x1="0" y1="0" x2="1" y2="0.1">
          <stop offset="0" stopColor="#5A0F26" />
          <stop offset="0.45" stopColor="#8C1F3B" />
          <stop offset="0.62" stopColor="#6E1730" />
          <stop offset="1" stopColor="#480B1D" />
        </linearGradient>
        <linearGradient id="hw-pallu" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6E1730" />
          <stop offset="0.55" stopColor="#4E0B1F" />
          <stop offset="1" stopColor="#380714" />
        </linearGradient>
        <linearGradient id="hw-zari" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F0DFA6" />
          <stop offset="0.5" stopColor="#C9A227" />
          <stop offset="1" stopColor="#8F6D14" />
        </linearGradient>
        <linearGradient id="hw-blouse" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B8862B" />
          <stop offset="1" stopColor="#8F6414" />
        </linearGradient>
        <radialGradient id="hw-glow" cx="0.5" cy="0.4" r="0.65">
          <stop offset="0" stopColor="#E9C868" stopOpacity="0.16" />
          <stop offset="1" stopColor="#E9C868" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* backdrop: glow + temple arch */}
      <ellipse cx="170" cy="270" rx="150" ry="230" fill="url(#hw-glow)" />
      <path d="M62,585 L62,300 Q62,62 170,50 Q278,62 278,300 L278,585" fill="none" stroke="#C9A227" strokeWidth="1.3" opacity="0.55" />
      <path d="M74,585 L74,305 Q74,76 170,64 Q266,76 266,305 L266,585" fill="none" stroke="#C9A227" strokeWidth="0.7" opacity="0.3" />
      <circle cx="170" cy="42" r="2.4" fill="#C9A227" opacity="0.7" />
      {/* corner zari florets */}
      <g fill="#C9A227" opacity="0.35">
        {[[92, 128], [248, 150]].map(([cx, cy], i) => (
          <g key={i}>
            <ellipse cx={cx} cy={cy - 4} rx="1.8" ry="3.4" />
            <ellipse cx={cx} cy={cy + 4} rx="1.8" ry="3.4" />
            <ellipse cx={cx - 4} cy={cy} rx="3.4" ry="1.8" />
            <ellipse cx={cx + 4} cy={cy} rx="3.4" ry="1.8" />
          </g>
        ))}
      </g>

      {/* ground shadow */}
      <ellipse cx="170" cy="576" rx="80" ry="9" fill="#000000" opacity="0.28" />

      {/* hair bun (behind head) + gajra */}
      <circle cx="197" cy="95" r="15" fill="#1C0E08" />
      <path d="M184,86 Q198,78 210,92" fill="none" stroke="#F6EFE2" strokeWidth="0" />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = -0.6 + i * 0.55;
        return <circle key={i} cx={197 + 15 * Math.cos(a)} cy={95 + 15 * Math.sin(a)} r="2.1" fill="#F6EFE2" opacity="0.9" />;
      })}

      {/* cascading pallu behind the shoulder */}
      <path d="M142,120 C118,166 108,250 112,336 C115,428 122,478 130,506 L162,498 C152,424 149,334 154,244 C156,192 152,150 160,126 Z" fill="url(#hw-pallu)" />
      <path d="M142,120 C118,166 108,250 112,336 C115,428 122,478 130,506 L138,504 C129,470 123,424 121,336 C118,252 127,168 148,124 Z" fill="url(#hw-zari)" opacity="0.9" />
      {[190, 250, 310, 370, 430].map((y, i) => (
        <circle key={i} cx={132 + (i % 2) * 12} cy={y} r="1.7" fill="#C9A227" opacity="0.75" />
      ))}

      {/* skirt drape */}
      <path d="M150,198 C138,203 131,209 127,218 L104,548 Q170,570 236,548 L213,218 C209,209 202,203 190,198 Q170,191 150,198 Z" fill="url(#hw-silk)" />
      {/* zari buttis on the skirt */}
      {[[146, 300], [192, 268], [176, 356], [138, 396], [200, 420], [162, 470]].map(([x, y], i) => (
        <path key={i} d={`M${x},${y - 3.4} L${x + 3},${y} L${x},${y + 3.4} L${x - 3},${y} Z`} fill="#C9A227" opacity="0.6" />
      ))}
      {/* hem zari band + temple motifs */}
      <path d="M106,522 Q170,543 234,522 L236,548 Q170,570 104,548 Z" fill="url(#hw-zari)" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const x = 116 + i * 14;
        const y = 527 + Math.sin((i / 8) * Math.PI) * 6;
        return <path key={i} d={`M${x},${y + 9} L${x + 5},${y} L${x + 10},${y + 9}`} fill="#4E0B1F" opacity="0.55" />;
      })}
      {/* front pleats */}
      {[160, 166, 172, 178].map((x, i) => (
        <path key={i} d={`M${x},206 C${x + 1},300 ${x + 2.5},420 ${x + 4},522`} stroke={i % 2 ? "#F0DFA6" : "#3E0916"} strokeWidth={i % 2 ? 0.7 : 1.6} strokeOpacity={i % 2 ? 0.5 : 0.45} fill="none" />
      ))}

      {/* midriff */}
      <path d="M152,178 Q170,186 188,178 L189,199 Q170,193 151,199 Z" fill="#D9A06B" />

      {/* blouse */}
      <path d="M140,122 Q170,110 200,122 L196,140 Q194,166 190,180 Q170,188 150,180 Q146,166 144,140 Z" fill="url(#hw-blouse)" />
      <path d="M140,122 L128,152 Q133,158 141,158 L148,132 Z" fill="url(#hw-blouse)" />
      <path d="M200,122 L212,152 Q207,158 199,158 L192,132 Z" fill="url(#hw-blouse)" />
      <path d="M150,180 Q170,188 190,180" fill="none" stroke="#C9A227" strokeWidth="1.6" opacity="0.9" />

      {/* arms as smooth connected limbs (drawn under the pallu sweep) */}
      <path d="M144,130 C126,148 116,170 117,190 C118,208 130,220 146,226" fill="none" stroke="#D9A06B" strokeWidth="13" strokeLinecap="round" />
      <path d="M196,130 C214,150 222,176 221,200 C220,224 214,244 206,258" fill="none" stroke="#D9A06B" strokeWidth="13" strokeLinecap="round" />

      {/* pallu sweep across the torso (over blouse and shoulder) */}
      <path d="M208,242 C196,236 168,204 150,168 C142,152 138,136 142,118 L166,112 C162,132 168,152 180,172 C192,192 206,212 216,226 Z" fill="url(#hw-pallu)" />
      <path d="M208,242 C196,236 168,204 150,168 C144,156 140,144 140,130 L147,126 C148,140 152,152 158,164 C172,192 194,220 212,236 Z" fill="url(#hw-zari)" opacity="0.85" />

      {/* bangles + hands (over the sweep) */}
      {[240, 246, 252].map((y, i) => (
        <path key={i} d={`M199,${y} Q207,${y + 3} 215,${y - 1}`} fill="none" stroke="#C9A227" strokeWidth={i === 1 ? 2.2 : 1.3} />
      ))}
      <ellipse cx="147" cy="228" rx="7" ry="9" fill="#D9A06B" />
      <ellipse cx="206" cy="261" rx="7" ry="9" fill="#D9A06B" />

      {/* neck + face */}
      <path d="M163,101 L177,101 L176,120 Q170,124 164,120 Z" fill="#D9A06B" />
      <ellipse cx="170" cy="78" rx="21" ry="25" fill="#E0AA76" />
      {/* hair: smooth dome with a fine centre parting */}
      <path d="M148,82 Q145,50 170,46 Q195,50 192,82 Q188,59 170,57 Q152,59 148,82 Z" fill="#1C0E08" />
      <path d="M170,47 L170,57" stroke="#3A241A" strokeWidth="0.8" />
      {/* bindi */}
      <circle cx="170" cy="68" r="1.8" fill="#C9A227" />
      {/* jhumka earrings */}
      {[149, 191].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={97} r="1.6" fill="#C9A227" />
          <path d={`M${x - 3},99 L${x + 3},99 L${x},106 Z`} fill="#C9A227" />
          <circle cx={x} cy={108} r="1.2" fill="#C9A227" />
        </g>
      ))}
      {/* necklace */}
      <path d="M159,120 Q170,132 181,120" fill="none" stroke="#C9A227" strokeWidth="1.8" />
      <circle cx="170" cy="129" r="2" fill="#C9A227" />
    </svg>
  );
}
