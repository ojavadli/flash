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
import { Save, Play, Phone, Zap } from 'lucide-react';

// SINGLE INTELLIGENT AGENT - No explicit routing
const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'input',
    position: { x: 400, y: 50 },
    data: { label: '📞 Incoming Call' },
    style: { background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', padding: '16px', fontWeight: '600', minWidth: '200px' }
  },
  {
    id: 'intelligent-agent',
    position: { x: 300, y: 200 },
    data: { label: '🤖 Intelligent Agent\n"How can I help you today?"\n\nAuto-detects: Driver, Customer, or Restaurant\nHandles all issues in one conversation' },
    style: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: '3px solid #a78bfa', borderRadius: '16px', padding: '20px', minWidth: '320px', whiteSpace: 'pre-line', textAlign: 'center', fontWeight: '500' }
  },
  {
    id: 'actions',
    position: { x: 250, y: 420 },
    data: { label: '⚡ Available Actions:\n• Lookup Order\n• Process Refund\n• Notify Driver\n• Call Customer\n• Escalate to Human\n• Update Status' },
    style: { background: '#1e293b', color: '#fff', border: '2px solid #3b82f6', borderRadius: '12px', padding: '16px', minWidth: '280px', whiteSpace: 'pre-line', fontSize: '13px' }
  },
  {
    id: 'crm-log',
    position: { x: 600, y: 420 },
    data: { label: '📝 CRM Logging\n• Transcript\n• Actions Taken\n• Outcome\n• Sentiment Analysis' },
    style: { background: '#1e293b', color: '#fff', border: '2px solid #10b981', borderRadius: '12px', padding: '16px', minWidth: '220px', whiteSpace: 'pre-line', fontSize: '13px' }
  },
  {
    id: 'end',
    type: 'output',
    position: { x: 400, y: 600 },
    data: { label: '✓ Call Complete' },
    style: { background: '#059669', color: '#fff', border: 'none', borderRadius: '12px', padding: '16px', minWidth: '200px', fontWeight: '600' }
  },
];

const initialEdges: Edge[] = [
  { id: 'e-start-agent', source: 'start', target: 'intelligent-agent', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
  { id: 'e-agent-actions', source: 'intelligent-agent', target: 'actions', label: 'Uses tools', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'e-agent-crm', source: 'intelligent-agent', target: 'crm-log', label: 'Logs data', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'e-actions-end', source: 'actions', target: 'end', animated: true, style: { stroke: '#64748b', strokeWidth: 2 } },
  { id: 'e-crm-end', source: 'crm-log', target: 'end', animated: true, style: { stroke: '#64748b', strokeWidth: 2 } },
];

export default function CanvasPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [deployStatus, setDeployStatus] = useState<"idle" | "deploying" | "deployed">("idle");

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  const deployToElevenLabs = async () => {
    setDeployStatus("deploying");
    
    setTimeout(() => {
      setDeployStatus("deployed");
      alert('✓ Intelligent agent deployed!\n\nThe agent will now:\n• Auto-detect caller type from conversation\n• Handle driver, customer, and restaurant issues\n• Take actions (refunds, escalations, notifications)\n• Log everything to CRM\n\nNo manual routing needed!');
    }, 2000);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <div className="bg-black/40 border-b border-white/10 p-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Snoonu Intelligent Agent</h1>
            <p className="text-sm text-white/60">Single AI agent handles all call types automatically</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={deployToElevenLabs}
              disabled={deployStatus === "deploying"}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 shadow-lg"
            >
              {deployStatus === "deploying" ? (
                <>Deploying...</>
              ) : deployStatus === "deployed" ? (
                <><Zap className="w-4 h-4" /> Live & Intelligent</>
              ) : (
                <><Phone className="w-4 h-4" /> Deploy Smart Agent</>
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
              if (node.id === 'intelligent-agent') return '#8b5cf6';
              if (node.id === 'actions') return '#3b82f6';
              if (node.id === 'crm-log') return '#10b981';
              return '#059669';
            }}
            maskColor="rgba(0, 0, 0, 0.6)" 
          />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="rgba(255, 255, 255, 0.1)" />
        </ReactFlow>
      </div>

      {/* Info Panel */}
      <div className="bg-black/40 border-t border-white/10 p-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-white/60">Voice AI: Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-white/60">Mode: Context-Aware (No Manual Routing)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-white/60">Languages: English + Arabic</span>
              </div>
            </div>
            <div className="text-sm text-white/60">
              Status: <span className={deployStatus === "deployed" ? "text-green-400 font-semibold" : "text-white/40"}>{deployStatus === "deployed" ? "Live" : "Draft"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
