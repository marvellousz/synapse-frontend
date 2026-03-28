"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { getMemoryGraph } from "@/lib/api";
import { Loader2, Zap, Tag, Folder, ArrowLeft, RefreshCw, ZoomIn, Info, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

export default function GraphPage() {
  const [data, setData] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [hoverNode, setHoverNode] = useState<any>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const gData = await getMemoryGraph();
      setData(gData);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load graph");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const nodeColor = (node: any) => {
    if (node === selectedNode) return "#F43F5E"; // Rose for selected
    if (node === hoverNode) return "#22C55E";    // Emerald for hover
    
    // Category-based colors
    const colors: Record<string, string> = {
      "Work": "#6366F1",
      "Personal": "#EC4899",
      "Education": "#EAB308",
      "Technology": "#06B6D4",
      "Finance": "#10B981",
      "Entertainment": "#8B5CF6",
      "Health": "#F87171",
      "Science": "#3B82F6",
    };
    return colors[node.category] || "#94A3B8";
  };

  const nodeLabel = (node: any) => {
    return `
      <div style="
        padding: 12px; 
        background: white; 
        border: 4px solid black; 
        box-shadow: 6px 6px 0px 0px rgba(0,0,0,1); 
        min-width: 200px;
        color: black;
      ">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="
            background: #E0E7FF; 
            color: #4338CA; 
            padding: 2px 6px; 
            font-weight: 900; 
            font-size: 10px; 
            text-transform: uppercase;
            border: 2px solid #4338CA;
          ">${node.category}</span>
          <span style="
            background: #F3F4F6; 
            color: #4B5563; 
            padding: 2px 6px; 
            font-weight: 900; 
            font-size: 10px; 
            text-transform: uppercase;
            border: 2px solid #000;
          ">${node.type}</span>
        </div>
        <div style="font-weight: 900; text-transform: uppercase; font-size: 14px; margin-bottom: 4px; line-height: 1.2;">
          ${node.title}
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;">
          ${node.tags.slice(0, 4).map((t: string) => `
            <span style="background: black; color: white; padding: 1px 4px; font-weight: 900; font-size: 8px; text-transform: uppercase;">
              #${t}
            </span>
          `).join('')}
        </div>
      </div>
    `;
  };

  return (
    <div className="flex flex-col h-full gap-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="heading-brut text-5xl md:text-6xl">Graph.</h1>
          <p className="font-bold text-gray-400 uppercase text-xs tracking-[0.2em] mt-2">Visualize synaptic connections</p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={fetchData}
            className="brut-button-secondary border-4 border-black p-3 hover:bg-gray-100 transition-colors"
            title="Refresh Graph"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link href="/memories" className="brut-button px-6 bg-black text-white">
            <ArrowLeft className="w-5 h-5" />
            <span className="ml-2 uppercase font-black text-sm">To Archive</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Graph Container */}
        <div 
          ref={containerRef}
          className="flex-1 brut-card bg-white relative overflow-hidden grid-bg min-h-[500px]"
        >
          {loading && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
              <p className="font-black uppercase text-xs tracking-widest text-indigo-600 animate-pulse">Mapping neurons...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-12">
              <div className="brut-card p-8 bg-rose-50 border-rose-500 text-rose-700 max-w-md text-center">
                <h3 className="font-black text-2xl mb-2 uppercase">Neural Collapse</h3>
                <p className="font-bold mb-6">{error}</p>
                <button onClick={fetchData} className="brut-button bg-rose-500 w-full justify-center">Try Again</button>
              </div>
            </div>
          )}

          {!loading && !error && data.nodes.length === 0 && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 border-4 border-black bg-gray-100 flex items-center justify-center mb-6">
                <Info className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="heading-brut text-3xl mb-4">Empty Brain</h3>
              <p className="font-bold text-gray-500 uppercase text-xs tracking-widest max-w-sm">No connections detected. Start by creating memories with shared tags.</p>
              <Link href="/memories/new" className="brut-button mt-8">Create Memory</Link>
            </div>
          )}

          {containerSize.width > 0 && containerSize.height > 0 && (
            <ForceGraph2D
              ref={fgRef}
              graphData={data}
              width={containerSize.width}
              height={containerSize.height}
              backgroundColor="#ffffff"
              nodeLabel={nodeLabel}
              linkLabel={(link: any) => `
                <div style="background: white; border: 2px solid black; padding: 6px; box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); font-size: 10px;">
                  <div style="font-weight: 900; text-transform: uppercase; border-bottom: 2px solid #EEE; margin-bottom: 4px; padding-bottom: 2px;">Shared Connections</div>
                  <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${link.sharedTags?.map((t: string) => `<span style="background: #F3F4F6; color: black; padding: 1px 4px; font-weight: 900; border: 1px solid black;">#${t}</span>`).join('') || 'Generic link'}
                  </div>
                </div>
              `}
              nodeRelSize={8}
              nodeVal={(n: any) => (n.tags?.length || 1) + 2}
              linkColor={() => "#CBD5E1"}
              linkWidth={1}
              linkDirectionalParticles={1}
              linkDirectionalParticleSpeed={0.005}
              onNodeClick={(node: any) => setSelectedNode(node)}
              onNodeHover={(node: any) => setHoverNode(node)}
              onBackgroundClick={() => setSelectedNode(null)}
              cooldownTicks={100}
              onEngineStop={() => {
                if (fgRef.current) fgRef.current.zoomToFit(400, 50);
              }}
              nodeCanvasObject={(node: any, ctx, globalScale) => {
                const label = node.title;
                const fontSize = 12 / globalScale;
                const radius = (node.tags?.length || 1) + 4;
                const color = nodeColor(node);
                const isSelected = node === selectedNode;
                const isHover = node === hoverNode;

                // Draw Circle Shadow/Outer Ring
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius + (isHover || isSelected ? 2 : 1), 0, 2 * Math.PI, false);
                ctx.fillStyle = isSelected ? '#F43F5E' : (isHover ? '#22C55E' : '#00000022');
                ctx.fill();

                // Draw Core Circle
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
                ctx.fillStyle = color;
                ctx.fill();
                
                // Draw Border
                ctx.strokeStyle = isSelected || isHover ? 'white' : 'black';
                ctx.lineWidth = 1 / globalScale;
                ctx.stroke();

                // Draw Label if zoomed in enough
                if (globalScale > 1.2) {
                  ctx.font = `${fontSize}px Inter, sans-serif`;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = '#111827';
                  const shortLabel = label.length > 20 ? label.substring(0, 17) + '...' : label;
                  ctx.fillText(shortLabel, node.x, node.y + radius + 4);
                }
              }}
            />
          )}

          {/* Graph Controls overlay */}
          <div className="absolute bottom-6 left-6 flex flex-col gap-2">
            <div className="flex gap-2">
               <button onClick={() => fgRef.current?.zoomToFit(400, 50)} className="bg-white border-2 border-black p-2 hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
                 <ZoomIn className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-80 h-full">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key="sidebar"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="brut-card bg-indigo-50 flex flex-col h-full border-l-[6px] border-l-indigo-600 p-0 relative"
              >
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-rose-500 text-white border-2 border-black flex items-center justify-center hover:bg-rose-600 shadow-[2px_2px_0px_0px_black] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all z-10"
                  title="Close Panel"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="brut-badge bg-indigo-600 text-white mb-4 border-none uppercase text-[10px] tracking-widest inline-block px-3">Selected Node</div>
                  <h3 className="heading-brut text-2xl mb-4 leading-none">{selectedNode.title}</h3>
                  
                  <div className="flex gap-2 mb-6">
                    <span className="brut-tag flex items-center gap-1 bg-white border-black border-2 px-2 py-1">
                      <Folder className="w-3 h-3 text-indigo-600" />
                      {selectedNode.category}
                    </span>
                  </div>

                  <div className="mb-8">
                    <div className="uppercase font-black text-[10px] tracking-widest text-gray-500 mb-3">Associations</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.tags.map((tag: string) => (
                        <span key={tag} className="bg-black text-white px-2 py-0.5 font-bold text-[10px] uppercase">#{tag}</span>
                      ))}
                    </div>
                  </div>

                  <Link 
                    href={`/memories/${selectedNode.id}`}
                    className="brut-button w-full bg-indigo-600 text-white justify-center py-3 mb-4"
                  >
                    OPEN FILE
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="brut-card bg-white p-6 opacity-40 flex flex-col items-center justify-center text-center h-full border-dashed">
                <Info className="w-12 h-12 text-gray-300 mb-4" />
                <p className="font-black uppercase text-xs tracking-widest text-gray-400">Select a node to inspect synaptic data</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
