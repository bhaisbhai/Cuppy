import React, { useState, useMemo } from 'react';

type Node = {
  id: string;
  cx: number;
  cy: number;
  r: number;
  angle: number;
  graphic: string;
  label: string;
  parentId: string;
};

const poolOuter = [
  "🇨🇦", // Ray 0: Canada
  "🇲🇦", // Ray 1: Morocco
  "🇵🇾", // Ray 2: Paraguay
  "🇫🇷", // Ray 3: France
  "🇧🇷", // Ray 4: Brazil
  "🇨🇮", // Ray 5: Ivory Coast
  "🇲🇽", // Ray 6: Mexico
  "🏴󠁧󠁢󠁥󠁮󠁧󠁿", // Ray 7: England
  "🇺🇸", // Ray 8: United States
  "🇧🇪", // Ray 9: Belgium
  "🇪🇸", // Ray 10: Spain
  "🇵🇹", // Ray 11: Portugal
  "🇨🇭", // Ray 12: Switzerland
  "🇦🇷", // Ray 13: Argentina
  "🇦🇺", // Ray 14: Australia
  "🇨🇴"  // Ray 15: Colombia
];

const poolInner = [
  "🇿🇦", // Ray 0: South Africa
  "🇳🇱", // Ray 1: Netherlands
  "🇩🇪", // Ray 2: Germany
  "🇸🇪", // Ray 3: Sweden
  "🇯🇵", // Ray 4: Japan
  "🇳🇴", // Ray 5: Norway
  "🇪🇨", // Ray 6: Ecuador
  "🇨🇩", // Ray 7: DR Congo
  "🇧🇦", // Ray 8: Bosnia and Herzegovina
  "🇸🇳", // Ray 9: Senegal
  "🇦🇹", // Ray 10: Austria
  "🇭🇷", // Ray 11: Croatia
  "🇩🇿", // Ray 12: Algeria
  "🇨🇻", // Ray 13: Cape Verde
  "🇪🇬", // Ray 14: Egypt
  "🇬🇭"  // Ray 15: Ghana
];

const advancedGraphics: Record<string, string> = {
  "t2-out-0": "🇨🇦", // Canada
  "t2-in-0": "🇲🇦",  // Morocco
  "t2-out-1": "🇵🇾", // Paraguay
  "t2-out-2": "🇧🇷", // Brazil
};

const customLabels: Record<string, string> = {
  "t1-out-0": "R32 Match: Canada 🇨🇦 (1)",
  "t1-in-0": "R32 Match: South Africa 🇿🇦 (0) • Canada Advanced",
  "t1-out-1": "R32 Match: Morocco 🇲🇦 (1) • Morocco Advanced via Pens (3-2)",
  "t1-in-1": "R32 Match: Netherlands 🇳🇱 (1)",
  "t1-out-2": "R32 Match: Paraguay 🇵🇾 (1) • Paraguay Advanced via Pens (4-3)",
  "t1-in-2": "R32 Match: Germany 🇩🇪 (1)",
  "t1-out-3": "R32 Match: France 🇫🇷 vs Sweden 🇸🇪 (Upcoming)",
  "t1-in-3": "R32 Match: France 🇫🇷 vs Sweden 🇸🇪 (Upcoming)",
  "t1-out-4": "R32 Match: Brazil 🇧🇷 (2) • Brazil Advanced",
  "t1-in-4": "R32 Match: Japan 🇯🇵 (1)",
  "t1-out-5": "R32 Match: Ivory Coast 🇨🇮 vs Norway 🇳🇴 (Upcoming)",
  "t1-in-5": "R32 Match: Ivory Coast 🇨🇮 vs Norway 🇳🇴 (Upcoming)",
  "t1-out-6": "R32 Match: Mexico 🇲🇽 vs Ecuador 🇪🇨 (Upcoming)",
  "t1-in-6": "R32 Match: Mexico 🇲🇽 vs Ecuador 🇪🇨 (Upcoming)",
  "t1-out-7": "R32 Match: England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs DR Congo 🇨🇩 (Upcoming)",
  "t1-in-7": "R32 Match: England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs DR Congo 🇨🇩 (Upcoming)",
  "t1-out-8": "R32 Match: United States 🇺🇸 vs Bosnia & Herzegovina 🇧🇦 (Upcoming)",
  "t1-in-8": "R32 Match: United States 🇺🇸 vs Bosnia & Herzegovina 🇧🇦 (Upcoming)",
  "t1-out-9": "R32 Match: Belgium 🇧🇪 vs Senegal 🇸🇳 (Upcoming)",
  "t1-in-9": "R32 Match: Belgium 🇧🇪 vs Senegal 🇸🇳 (Upcoming)",
  "t1-out-10": "R32 Match: Spain 🇪🇸 vs Austria 🇦🇹 (Upcoming)",
  "t1-in-10": "R32 Match: Spain 🇪🇸 vs Austria 🇦🇹 (Upcoming)",
  "t1-out-11": "R32 Match: Portugal 🇵🇹 vs Croatia 🇭🇷 (Upcoming)",
  "t1-in-11": "R32 Match: Portugal 🇵🇹 vs Croatia 🇭🇷 (Upcoming)",
  "t1-out-12": "R32 Match: Switzerland 🇨🇭 vs Algeria 🇩🇿 (Upcoming)",
  "t1-in-12": "R32 Match: Switzerland 🇨🇭 vs Algeria 🇩🇿 (Upcoming)",
  "t1-out-13": "R32 Match: Argentina 🇦🇷 vs Cape Verde 🇨🇻 (Upcoming)",
  "t1-in-13": "R32 Match: Argentina 🇦🇷 vs Cape Verde 🇨🇻 (Upcoming)",
  "t1-out-14": "R32 Match: Australia 🇦🇺 vs Egypt 🇪🇬 (Upcoming)",
  "t1-in-14": "R32 Match: Australia 🇦🇺 vs Egypt 🇪🇬 (Upcoming)",
  "t1-out-15": "R32 Match: Colombia 🇨🇴 vs Ghana 🇬🇭 (Upcoming)",
  "t1-in-15": "R32 Match: Colombia 🇨🇴 vs Ghana 🇬🇭 (Upcoming)",
  
  "t2-out-0": "Round of 16: Canada 🇨🇦",
  "t2-in-0": "Round of 16: Morocco 🇲🇦",
  "t2-out-1": "Round of 16: Paraguay 🇵🇾",
  "t2-in-1": "Round of 16: Winner of France vs Sweden",
  "t2-out-2": "Round of 16: Brazil 🇧🇷",
  "t2-in-2": "Round of 16: Winner of Ivory Coast vs Norway",
  "t2-out-3": "Round of 16: Winner of Mexico/Ecuador vs England/DR Congo",
  "t2-in-3": "Round of 16: Winner of US/Bosnia vs Belgium/Senegal",
  "t2-out-4": "Round of 16: Winner of Spain/Austria vs Portugal/Croatia",
  "t2-in-4": "Round of 16: Winner of Switzerland/Algeria vs Argentina/Cape Verde",
  "t2-out-5": "Round of 16: Winner of Australia/Egypt vs Colombia/Ghana",
};

const CENTER = 425;
const SIZE = 850;

const radialMatrix = {
  t1_out: 380, t1_in: 330,
  t2_out: 250, t2_in: 200,
  t3_out: 130, t3_in: 90
};

function generateNodes(): Node[] {
  const nodes: Node[] = [];

  for (let i = 0; i < 16; i++) {
    const angle = (i * 2 * Math.PI / 16) - Math.PI / 2;
    const nextTierIndex = Math.floor(i / 2);
    const routesToOuter = (i % 2 === 0);
    const targetParent = `t2-${routesToOuter ? 'out' : 'in'}-${nextTierIndex}`;

    const outId = `t1-out-${i}`;
    const inId = `t1-in-${i}`;

    nodes.push({
      id: outId,
      cx: CENTER + radialMatrix.t1_out * Math.cos(angle),
      cy: CENTER + radialMatrix.t1_out * Math.sin(angle),
      r: radialMatrix.t1_out,
      angle: angle,
      graphic: poolOuter[i],
      label: customLabels[outId] || `Match Ray ${i} • Outer Attacker`,
      parentId: inId
    });

    nodes.push({
      id: inId,
      cx: CENTER + radialMatrix.t1_in * Math.cos(angle),
      cy: CENTER + radialMatrix.t1_in * Math.sin(angle),
      r: radialMatrix.t1_in,
      angle: angle,
      graphic: poolInner[i],
      label: customLabels[inId] || `Match Ray ${i} • Inner Defender`,
      parentId: targetParent
    });
  }

  for (let i = 0; i < 8; i++) {
    const angle = (i * 2 * Math.PI / 8) - Math.PI / 2 + (Math.PI / 16);
    const nextTierIndex = Math.floor(i / 2);
    const routesToOuter = (i % 2 === 0);
    const targetParent = `t3-${routesToOuter ? 'out' : 'in'}-${nextTierIndex}`;

    const outId = `t2-out-${i}`;
    const inId = `t2-in-${i}`;

    nodes.push({
      id: outId,
      cx: CENTER + radialMatrix.t2_out * Math.cos(angle),
      cy: CENTER + radialMatrix.t2_out * Math.sin(angle),
      r: radialMatrix.t2_out,
      angle: angle,
      graphic: advancedGraphics[outId] || "⏳",
      label: customLabels[outId] || `R16 Ray ${i} • Vector Outer`,
      parentId: inId
    });

    nodes.push({
      id: inId,
      cx: CENTER + radialMatrix.t2_in * Math.cos(angle),
      cy: CENTER + radialMatrix.t2_in * Math.sin(angle),
      r: radialMatrix.t2_in,
      angle: angle,
      graphic: advancedGraphics[inId] || "⏳",
      label: customLabels[inId] || `R16 Ray ${i} • Vector Inner`,
      parentId: targetParent
    });
  }

  for (let i = 0; i < 4; i++) {
    const angle = (i * 2 * Math.PI / 4) - Math.PI / 2 + (Math.PI / 32);

    const outId = `t3-out-${i}`;
    const inId = `t3-in-${i}`;

    nodes.push({
      id: outId,
      cx: CENTER + radialMatrix.t3_out * Math.cos(angle),
      cy: CENTER + radialMatrix.t3_out * Math.sin(angle),
      r: radialMatrix.t3_out,
      angle: angle,
      graphic: advancedGraphics[outId] || "⏳",
      label: customLabels[outId] || `QF Ray ${i} • Outer Channel`,
      parentId: inId
    });

    nodes.push({
      id: inId,
      cx: CENTER + radialMatrix.t3_in * Math.cos(angle),
      cy: CENTER + radialMatrix.t3_in * Math.sin(angle),
      r: radialMatrix.t3_in,
      angle: angle,
      graphic: advancedGraphics[inId] || "⏳",
      label: customLabels[inId] || `QF Ray ${i} • Inner Channel`,
      parentId: 'masterHub'
    });
  }

  return nodes;
}

const Ring = ({ size, type }: { size: number, type: 'solid' | 'dashed' }) => (
  <div
    className="absolute rounded-full pointer-events-none z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    style={{
      width: `${(size / SIZE) * 100}%`,
      height: `${(size / SIZE) * 100}%`,
      borderStyle: type,
      borderWidth: '1px',
      borderColor: 'rgba(255, 255, 255, 0.2)'
    }}
  />
);

function getRadialBracketPath(r1: number, a1: number, r2: number, a2: number, r_mid: number): string {
  const x1 = CENTER + r1 * Math.cos(a1);
  const y1 = CENTER + r1 * Math.sin(a1);
  
  if (Math.abs(a1 - a2) < 0.001) {
    const x2 = CENTER + r2 * Math.cos(a2);
    const y2 = CENTER + r2 * Math.sin(a2);
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }
  
  const x_mid1 = CENTER + r_mid * Math.cos(a1);
  const y_mid1 = CENTER + r_mid * Math.sin(a1);
  
  const x_mid2 = CENTER + r_mid * Math.cos(a2);
  const y_mid2 = CENTER + r_mid * Math.sin(a2);
  
  const x2 = CENTER + r2 * Math.cos(a2);
  const y2 = CENTER + r2 * Math.sin(a2);
  
  let diff = a2 - a1;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  const sweepFlag = diff >= 0 ? 1 : 0;
  
  return `M ${x1} ${y1} L ${x_mid1} ${y_mid1} A ${r_mid} ${r_mid} 0 0 ${sweepFlag} ${x_mid2} ${y_mid2} L ${x2} ${y2}`;
}

export default function App() {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const nodes = useMemo(() => generateNodes(), []);

  const activePath = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    const path = new Set<string>();
    let currentId: string | undefined = hoveredNodeId;
    while (currentId) {
      path.add(currentId);
      const node = nodes.find(n => n.id === currentId);
      currentId = node?.parentId;
      if (currentId === 'masterHub') {
        path.add('masterHub');
        break;
      }
    }
    return path;
  }, [hoveredNodeId, nodes]);

  const activeNode = hoveredNodeId ? nodes.find(n => n.id === hoveredNodeId) : null;
  const activeLabel = activeNode ? activeNode.label : 'Awaiting Vector Lock';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#05070a] text-slate-200 font-sans relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Top HUD Panel */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-xl shadow-2xl z-50 pointer-events-none text-center w-[90%] max-w-fit">
        <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-bold mb-1">
          Live Professional Visualization Engine
        </div>
        <h1 className="m-0 text-xl md:text-2xl font-black tracking-tighter text-white uppercase">
          Concentric Clash <span className="text-slate-500">PRO</span>
        </h1>
      </div>

      <div className="relative w-full max-w-[850px] aspect-square flex items-center justify-center mt-16 mb-16 z-10">
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {nodes.map(node => {
            if (!node.parentId) return null;
            
            let r2 = 0;
            let a2 = node.angle;
            
            if (node.parentId !== 'masterHub') {
              const parent = nodes.find(n => n.id === node.parentId);
              if (!parent) return null;
              r2 = parent.r;
              a2 = parent.angle;
            }
            
            const isActive = activePath.has(node.id);
            const r_mid = (node.r + r2) / 2;
            const pathD = getRadialBracketPath(node.r, node.angle, r2, a2, r_mid);

            return (
              <path
                key={`pipe-${node.id}`}
                d={pathD}
                className="fill-none transition-all duration-300 ease-out"
                stroke={isActive ? '#10b981' : 'rgba(255,255,255,0.2)'}
                strokeWidth={isActive ? 2 : 0.5}
                style={{
                  filter: isActive ? 'drop-shadow(0 0 8px rgba(16,185,129,0.6))' : 'none'
                }}
              />
            );
          })}
        </svg>

        <Ring size={760} type="solid" />
        <Ring size={660} type="dashed" />
        <Ring size={500} type="solid" />
        <Ring size={400} type="dashed" />
        <Ring size={260} type="solid" />
        <Ring size={180} type="dashed" />

        <div
          className={`absolute left-1/2 top-1/2 flex items-center justify-center rounded-full z-30 transition-all duration-400 ease-out -translate-x-1/2 -translate-y-1/2 border-2 bg-slate-900
            w-12 h-12 text-xl
            sm:w-16 sm:h-16 sm:text-3xl
            md:w-24 md:h-24 md:text-5xl
            ${activePath.has('masterHub')
              ? 'border-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.4)]'
              : 'border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)]'
            }`}
          id="masterHub"
        >
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-pulse pointer-events-none"></div>
          <span className="drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10">🏆</span>
        </div>

        {nodes.map(node => {
          const isActive = activePath.has(node.id);
          const isPlaceholder = node.graphic === "⏳";

          if (isPlaceholder) {
            return (
              <div
                key={node.id}
                className={`absolute flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ease-out will-change-transform -translate-x-1/2 -translate-y-1/2
                  ${isActive
                    ? 'w-4 h-4 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] z-20 scale-125'
                    : 'w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-slate-800 border border-white/20 z-10 hover:border-emerald-500/50 hover:bg-slate-700 hover:scale-125'
                  }
                `}
                style={{ left: `${(node.cx / SIZE) * 100}%`, top: `${(node.cy / SIZE) * 100}%` }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              />
            );
          }

          return (
            <div
              key={node.id}
              className={`absolute flex items-center justify-center bg-slate-900 border rounded-full cursor-pointer overflow-hidden transition-all duration-300 ease-out will-change-transform -translate-x-1/2 -translate-y-1/2
                w-8 h-8
                sm:w-10 sm:h-10
                md:w-12 md:h-12
                ${isActive
                  ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-125 z-20 border-2'
                  : 'border-white/20 z-10 hover:border-emerald-500/50'
                }
              `}
              style={{ left: `${(node.cx / SIZE) * 100}%`, top: `${(node.cy / SIZE) * 100}%` }}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <span className="text-3xl sm:text-4xl md:text-5xl select-none pointer-events-none transform scale-160 flex items-center justify-center leading-none">
                {node.graphic}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Telemetry Banner */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/60 backdrop-blur-md border border-white/5 py-2 px-6 rounded-full flex items-center gap-4 md:gap-6 pointer-events-none shadow-2xl z-50 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase">System HUD</span>
          <span className="text-xs font-mono text-emerald-400 transition-colors duration-300">{activeLabel}</span>
        </div>
      </div>
    </div>
  );
}

