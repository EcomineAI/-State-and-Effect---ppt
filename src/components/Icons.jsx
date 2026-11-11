import React from 'react';

/* 16x16 pixel-art icons. Each sprite is 16 rows of 16 palette keys ('.' = transparent). */
const PAL = {
  n: '#10204f', B: '#0b3fb8', b: '#2f6fe4', l: '#7fb2ff', p: '#cfe1ff', w: '#ffffff',
  g: '#6c7686', s: '#b8c0cc', G: '#2b8a2e', h: '#6fcf6a', c: '#f6f7ef',
  r: '#d9442b', o: '#f08a24', y: '#f5c318',
};

const sprites = {
  file: [
    '..nnnnnnnnn.....',
    '..nllllllnpn....',
    '..nbbbbbbnppn...',
    '..nbbbbbbnnnnn..',
    '..nbbbbbbbbbbn..',
    '..nbbbbbbbbbbn..',
    '..nbwwbbbbwwbn..',
    '..nbwbbbbbbwbn..',
    '..nwwbbbbbbwwn..',
    '..nbwbbbbbbwbn..',
    '..nbwwbbbbwwbn..',
    '..nbbbbbbbbbbn..',
    '..nbbbbbbbbbbn..',
    '..nBBBBBBBBBBn..',
    '..nnnnnnnnnnnn..',
    '................',
  ],
  chip: [
    '................',
    '....g.g..g.g....',
    '....g.g..g.g....',
    '...nnnnnnnnnn...',
    '.ggnlbbbbbbbngg.',
    '...nbbbbbbbbn...',
    '.ggnbbppppbbngg.',
    '...nbbpbbpbbn...',
    '...nbbpbbpbbn...',
    '.ggnbbppppbbngg.',
    '...nbbbbbbbbn...',
    '.ggnBBBBBBBBngg.',
    '...nnnnnnnnnn...',
    '....g.g..g.g....',
    '....g.g..g.g....',
    '................',
  ],
  brackets: [
    '................',
    '................',
    '.nnnnnnnnnnnnnn.',
    'nlllllllllllllln',
    'nbbbbbbbbbbbbbbn',
    'nbwwbbbbbbbbwwbn',
    'nbwbbbbbbbbbbwbn',
    'nbwbbbbbbbbbbwbn',
    'nbwbbbbwbbbbbwbn',
    'nbwbbbbwbbbbbwbn',
    'nbwwbbwbbbbbwwbn',
    'nbbbbbbbbbbbbbbn',
    'nBBBBBBBBBBBBBBn',
    '.nnnnnnnnnnnnnn.',
    '................',
    '................',
  ],
  cursor: [
    'nnnnnnnnnnn.....',
    'nbbbbbbbbbn.....',
    'nbbbbbbbbbn.....',
    'nbcccccbbbn.....',
    'nbcccccbbbn.....',
    'nbbbbbnbbbn.....',
    'nbbbbbnnbbn.....',
    'nnnnnnnwnnn.....',
    '......nwwn......',
    '......nwwwn.....',
    '......nwwwwn....',
    '......nwwwwwn...',
    '......nwwnnnnn..',
    '......nwn.nwn...',
    '......nn...nwn..',
    '............nn..',
  ],
  lock: [
    '................',
    '.....ssssss.....',
    '....ss....ss....',
    '....s......s....',
    '....s......s....',
    '....s......s....',
    '..nnnnnnnnnnnn..',
    '..nlllllllllln..',
    '..nbbbbbbbbbbn..',
    '..nbbbbnnbbbbn..',
    '..nbbbbnnbbbbn..',
    '..nbbbbbnbbbbn..',
    '..nbbbbbnbbbbn..',
    '..nBBBBBBBBBBn..',
    '..nnnnnnnnnnnn..',
    '................',
  ],
  magnifier: [
    '...nnnnn........',
    '.nnpppppnn......',
    '.npwwppppn......',
    'npwpppppppn.....',
    'npwpppppppn.....',
    'npppppppppn.....',
    'npppppppppn.....',
    '.npppppppn......',
    '.nnpppppnn......',
    '...nnnnngg......',
    '.........nnn....',
    '..........nnn...',
    '...........nnn..',
    '............nnn.',
    '.............nn.',
    '................',
  ],
  clipboard: [
    '................',
    '.....nnnnnn.....',
    '..nGGssssssGGn..',
    '..nGGGGGGGGGGn..',
    '..nGccccccccGn..',
    '..nGhcnnnnncGn..',
    '..nGccccccccGn..',
    '..nGhcnnnnncGn..',
    '..nGccccccccGn..',
    '..nGhcnnnnncGn..',
    '..nGccccccccGn..',
    '..nGhcnnnnncGn..',
    '..nGccccccccGn..',
    '..nGGGGGGGGGGn..',
    '..nnnnnnnnnnnn..',
    '................',
  ],
  rocket: [
    '.......nn.......',
    '......nwwn......',
    '.....nwwwwn.....',
    '.....nbbbbn.....',
    '.....nbppbn.....',
    '.....nbppbn.....',
    '.....nbbbbn.....',
    '.....nbbbbn.....',
    '....nnbbbbnn....',
    '...nrnbbbbnrn...',
    '..nrrnbbbbnrrn..',
    '..nrrnnnnnnrrn..',
    '..nnn.oyyo.nnn..',
    '......oyyo......',
    '.......oo.......',
    '................',
  ],
  cycle: [
    '................',
    '.....nnnnnn.....',
    '...nnbbbbbbnn...',
    '..nbbnnnnnnbbn..',
    '.nbn......nbbbbn',
    '.nbn.......nbbn.',
    'nbn.........nn..',
    'nbn.............',
    '.............nbn',
    '..nn.........nbn',
    '.nbbn.......nbn.',
    'nbbbbn......nbn.',
    '..nbbnnnnnnbbn..',
    '...nnbbbbbbnn...',
    '.....nnnnnn.....',
    '................',
  ],
  plug: [
    '....nn....nn....',
    '....gg....gg....',
    '....gg....gg....',
    '....gg....gg....',
    '..nnnnnnnnnnnn..',
    '..nllbbbbbbbbn..',
    '..nlbbbbbbbbbn..',
    '..nbbbbbbbbbbn..',
    '...nbbbbbbbbn...',
    '....nbbbbbbn....',
    '.....nBBBBn.....',
    '......nnnn......',
    '.......nn.......',
    '.......nn.......',
    '.......nn.......',
    '.......nn.......',
  ],
  trash: [
    '................',
    '......nnnn......',
    '......nssn......',
    '..nnnnnnnnnnnn..',
    '..nssssssssssn..',
    '..nnnnnnnnnnnn..',
    '...nbbbbbbbbn...',
    '...nbbpbbpbbn...',
    '...nbbpbbpbbn...',
    '...nbbpbbpbbn...',
    '...nbbpbbpbbn...',
    '...nbbpbbpbbn...',
    '...nbbbbbbbbn...',
    '...nBBBBBBBBn...',
    '....nnnnnnnn....',
    '................',
  ],
};

function PixelSprite({ rows }) {
  const rects = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const fill = PAL[row[x]];
      if (fill) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={fill} />);
    }
  });
  return <svg viewBox="0 0 16 16" shapeRendering="crispEdges">{rects}</svg>;
}

/* 8x8 inline marks (replace emoji) */
const marks = {
  ok: ['GGGGGGGG', 'GhhhhhhG', 'GhhhhwhG', 'GhhhwwhG', 'GwhwwhhG', 'GwwwhhhG', 'GhwhhhhG', 'GGGGGGGG'],
  no: ['rr....rr', 'rrr..rrr', '.rrrrrr.', '..rrrr..', '..rrrr..', '.rrrrrr.', 'rrr..rrr', 'rr....rr'],
  boom: ['...o....', '.o.y..o.', '..yyyo..', 'oyyryyyo', '.oyyry..', '..oyyo..', '.o..y.o.', '....o...'],
  clock: ['..nnnn..', '.nwwwwn.', 'nwwnwwwn', 'nwwnwwwn', 'nwwnnnwn', 'nwwwwwwn', '.nwwwwn.', '..nnnn..'],
  play: ['ww......', 'wwww....', 'wwwwww..', 'wwwwwwww', 'wwwwwwww', 'wwwwww..', 'wwww....', 'ww......'],
  stop: ['........', '.wwwwww.', '.wwwwww.', '.wwwwww.', '.wwwwww.', '.wwwwww.', '.wwwwww.', '........'],
};

export function Mark({ name, size = 12, color }) {
  const rows = marks[name];
  return (
    <svg className="mark" viewBox="0 0 8 8" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) => [...row].map((k, x) => (PAL[k]
        ? <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={color && k === 'w' ? color : PAL[k]} />
        : null)))}
    </svg>
  );
}

export default function Icon({ name, size = 90, className = '' }) {
  return (
    <div className={`icon pix icon-${name} ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <PixelSprite rows={sprites[name]} />
    </div>
  );
}
