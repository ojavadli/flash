"use client";

import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Save, Play, Phone } from 'lucide-react';

// Snoonu-specific workflow matching ElevenLabs structure
const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'input',
    position: { x: 400, y: 50 },
    data: { label: '📞 Start - Incoming Call' },
    style: { background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', padding: '16px', fontWeight: '600', minWidth: '200px' }
  },
  {
    id: 'qualification',
    position: { x: 350, y: 180 },
    data: { label: 'Qualification Agent\n"Are you a driver, customer, or restaurant?"' },
    style: { background: '#3b82f6', color: '#fff', border: '2px solid #60a5fa', borderRadius: '12px', padding: '16px', minWidth: '250px', whiteSpace: 'pre-line', textAlign: 'center' }
  },
  {
    id: 'driver-support',
    position: { x: 100, y: 350 },
    data: { label: 'Driver Support\nHandle: Location, Pickup, Wait Times' },
    style: { background: '#8b5cf6', color: '#fff', border: '2px solid #a78bfa', borderRadius: '12px', padding: '16px', minWidth: '220px', whiteSpace: 'pre-line' }
  },
  {
    id: 'customer-support',
    position: { x: 400, y: 350 },
    data: { label: 'Customer Support\nHandle: Missing/Wrong Orders, Refunds' },
    style: { background: '#ec4899', color: '#fff', border: '2px solid #f472b6', borderRadius: '12px', padding: '16px', minWidth: '220px', whiteSpace: 'pre-line' }
  },
  {
    id: 'merchant-support',
    position: { x: 700, y: 350 },
    data: { label: 'Merchant Support\nHandle: Tablet, Orders, Tech Issues' },
    style: { background: '#f59e0b', color: '#fff', border: '2px solid #fbbf24', borderRadius: '12px', padding: '16px', minWidth: '220px', whiteSpace: 'pre-line' }
  },
  {
    id: 'end-driver',
    type: 'output',
    position: { x: 100, y: 520 },
    data: { label: '✓ End Call - Driver' },
    style: { background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '12px', padding: '12px', minWidth: '180px' }
  },
  {
    id: 'end-customer',
    type: 'output',
    position: { x: 400, y: 520 },
    data: { label: '✓ End Call - Customer' },
    style: { background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '12px', padding: '12px', minWidth: '180px' }
  },
  {
    id: 'end-merchant',
    type: 'output',
    position: { x: 700, y: 520 },
    data: { label: '✓ End Call - Merchant' },
    style: { background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '12px', padding: '12px', minWidth: '180px' }
  },
];

const initialEdges: Edge[] = [
  { id: 'e-start-qual', source: 'start', target: 'qualification', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e-qual-driver', source: 'qualification', target: 'driver-support', label: 'Driver', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'e-qual-customer', source: 'qualification', target: 'customer-support', label: 'Customer', animated: true, style: { stroke: '#ec4899', strokeWidth: 2 } },
  { id: 'e-qual-merchant', source: 'qualification', target: 'merchant-support', label: 'Merchant', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-driver-end', source: 'driver-support', target: 'end-driver', animated: true, style: { stroke: '#64748b', strokeWidth: 2 } },
  { id: 'e-customer-end', source: 'customer-support', target: 'end-customer', animated: true, style: { stroke: '#64748b', strokeWidth: 2 } },
  { id: 'e-merchant-end', source: 'merchant-support', target: 'end-merchant', animated: true, style: { stroke: '#64748b', strokeWidth: 2 } },
];

export default function CanvasPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [deployStatus, setDeployStatus] = useState<"idle" | "deploying" | "deployed">("idle");

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  const saveWorkflow = () => {
    const workflow = { nodes, edges };
    localStorage.setItem('snoonu-workflow', JSON.stringify(workflow));
    alert('Snoonu workflow saved successfully!');
  };

  const deployToProduction = async () => {
    setDeployStatus("deploying");
    
    // Simulate deployment to ElevenLabs
    setTimeout(() => {
      setDeployStatus("deployed");
      alert('Workflow deployed! Your Snoonu IVR is now live and handling calls.');
    }, 2000);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <div className="bg-black/40 border-b border-white/10 p-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Snoonu IVR Workflow</h1>
            <p className="text-sm text-white/60">100,000+ calls/month automation</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={saveWorkflow}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/10"
            >
              <Save className="w-4 h-4" /> Save
            </button>
            <button 
              onClick={deployToProduction}
              disabled={deployStatus === "deploying"}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {deployStatus === "deploying" ? (
                <>Deploying...</>
              ) : deployStatus === "deployed" ? (
                <>✓ Live</>
              ) : (
                <><Phone className="w-4 h-4" /> Deploy to Production</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-black/20 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-black/20"
        >
          <Controls className="bg-white/10 border border-white/10 fill-white text-white rounded-lg" />
          <MiniMap 
            className="bg-black/60 border border-white/10 rounded-lg" 
            nodeColor={(node) => {
              if (node.id === 'start') return '#10b981';
              if (node.id === 'qualification') return '#3b82f6';
              if (node.id.includes('driver')) return '#8b5cf6';
              if (node.id.includes('customer')) return '#ec4899';
              if (node.id.includes('merchant')) return '#f59e0b';
              return '#64748b';
            }}
            maskColor="rgba(0, 0, 0, 0.6)" 
          />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="rgba(255, 255, 255, 0.1)" />
        </ReactFlow>
      </div>

      {/* Info Panel */}
      <div className="bg-black/40 border-t border-white/10 p-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-white/60">ElevenLabs: Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-white/60">Workflow: 3 Agent Types</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-white/60">Status: {deployStatus === "deployed" ? "Live" : "Draft"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
