import React, { useState, useMemo } from 'react';

type Node = {
  id: string;
  cx: number;
  cy: number;
  graphic: string;
  label: string;
  parentId: string;
};

const poolOuter = ["🇨🇦", "🇩🇪", "🇧🇷", "🏴", "🇦🇷", "🇫🇷", "🇪🇸", "🇲🇽", "🇺🇸", "🇳🇴", "🇮🇪", "🇯🇵", "🇨🇭", "🇨🇴", "🇸🇳", "🇭🇷"];
const poolInner = ["🇳🇱", "🇵🇾", "🇯🇵", "🇨🇩", "🇨🇻", "🇸🇪", "🇦🇹", "🇪🇨", "🇧🇦", "🇿🇦", "🇮🇪", "🇪🇬", "🇩🇿", "🇬🇭", "🇧🇪", "🇵🇹"];

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

    nodes.push({
      id: `t1-out-${i}`,
      cx: CENTER + radialMatrix.t1_out * Math.cos(angle),
      cy: CENTER + radialMatrix.t1_out * Math.sin(angle),
      graphic: poolOuter[i],
      label: `Match Ray ${i} • Outer Attacker`,
      parentId: targetParent
    });

    nodes.push({
      id: `t1-in-${i}`,
      cx: CENTER + radialMatrix.t1_in * Math.cos(angle),
      cy: CENTER + radialMatrix.t1_in * Math.sin(angle),
      graphic: poolInner[i],
      label: `Match Ray ${i} • Inner Defender`,
      parentId: targetParent
    });
  }

  for (let i = 0; i < 8; i++) {
    const angle = (i * 2 * Math.PI / 8) - Math.PI / 2 + (Math.PI / 16);
    const nextTierIndex = Math.floor(i / 2);
    const routesToOuter = (i % 2 === 0);
    const targetParent = `t3-${routesToOuter ? 'out' : 'in'}-${nextTierIndex}`;

    nodes.push({
      id: `t2-out-${i}`,
      cx: CENTER + radialMatrix.t2_out * Math.cos(angle),
      cy: CENTER + radialMatrix.t2_out * Math.sin(angle),
      graphic: "⏳",
      label: `R16 Ray ${i} • Vector Outer`,
      parentId: targetParent
    });

    nodes.push({
      id: `t2-in-${i}`,
      cx: CENTER + radialMatrix.t2_in * Math.cos(angle),
      cy: CENTER + radialMatrix.t2_in * Math.sin(angle),
      graphic: "⏳",
      label: `R16 Ray ${i} • Vector Inner`,
      parentId: targetParent
    });
  }

  for (let i = 0; i < 4; i++) {
    const angle = (i * 2 * Math.PI / 4) - Math.PI / 2 + (Math.PI / 32);

    nodes.push({
      id: `t3-out-${i}`,
      cx: CENTER + radialMatrix.t3_out * Math.cos(angle),
      cy: CENTER + radialMatrix.t3_out * Math.sin(angle),
      graphic: "⏳",
      label: `QF Ray ${i} • Outer Channel`,
      parentId: 'masterHub'
    });

    nodes.push({
      id: `t3-in-${i}`,
      cx: CENTER + radialMatrix.t3_in * Math.cos(angle),
      cy: CENTER + radialMatrix.t3_in * Math.sin(angle),
      graphic: "⏳",
      label: `QF Ray ${i} • Inner Channel`,
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
            let destX, destY;
            if (node.parentId === 'masterHub') {
              destX = CENTER;
              destY = CENTER;
            } else {
              const parent = nodes.find(n => n.id === node.parentId);
              if (!parent) return null;
              destX = parent.cx;
              destY = parent.cy;
            }
            const isActive = activePath.has(node.id);

            return (
              <path
                key={`pipe-${node.id}`}
                d={`M ${node.cx} ${node.cy} L ${destX} ${destY}`}
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
          return (
            <div
              key={node.id}
              className={`absolute flex items-center justify-center bg-slate-900 border rounded-full cursor-pointer transition-all duration-300 ease-out will-change-transform -translate-x-1/2 -translate-y-1/2
                w-6 h-6 text-[10px]
                sm:w-8 sm:h-8 sm:text-[14px]
                md:w-10 md:h-10 md:text-lg
                ${isActive
                  ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-125 z-20 border-2'
                  : 'border-white/20 z-10 hover:border-emerald-500/50'
                }
              `}
              style={{ left: `${(node.cx / SIZE) * 100}%`, top: `${(node.cy / SIZE) * 100}%` }}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              {node.graphic}
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

