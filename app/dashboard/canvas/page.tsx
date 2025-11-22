"use client";

import React, { useCallback, useState, useRef } from 'react';
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
import { Plus, Save, Play, Upload } from 'lucide-react';
import { useAgent } from '@/context/AgentContext';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    position: { x: 250, y: 50 },
    data: { label: 'Incoming Call' },
    style: { background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '600' }
  },
  {
    id: '2',
    position: { x: 250, y: 200 },
    data: { label: 'Greeting Message' },
    style: { background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '8px', padding: '12px' }
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#94a3b8' } }
];

export default function CanvasPage() {
  const { setSystemPrompt } = useAgent();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState('');
  const idCounter = useRef(3);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#94a3b8' } }, eds)),
    [setEdges]
  );

  const addNode = () => {
    if (!nodeName.trim()) return;
    
    const newNode: Node = {
      id: `${idCounter.current++}`,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { label: nodeName },
      style: { background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '8px', padding: '12px' },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeName('');
  };

  const saveWorkflow = () => {
    const workflow = { nodes, edges };
    localStorage.setItem('flash-workflow', JSON.stringify(workflow));
    
    // Generate system prompt from workflow
    const prompt = `You are an AI agent following this workflow: ${nodes.map(n => n.data.label).join(' → ')}. Be helpful and follow this flow.`;
    setSystemPrompt(prompt);
    
    alert('Workflow saved successfully!');
  };

  return (
    <div className="h-screen w-full flex">
      {/* Toolbar */}
      <div className="w-80 bg-black/40 border-r border-white/10 p-6 flex flex-col gap-6 backdrop-blur-sm">
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Agent Builder</h3>
          <p className="text-white/60 text-sm mb-6">Create your agent workflow by adding nodes and connecting them</p>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm text-white/60">Node Name</label>
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNode()}
            placeholder="e.g., Check Account Status"
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 placeholder:text-white/30"
          />
          <button 
            onClick={addNode}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Node
          </button>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">
            <Upload className="w-4 h-4" /> Import Workflow
          </button>
          <button 
            onClick={saveWorkflow}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/10"
          >
            <Save className="w-4 h-4" /> Save Workflow
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors">
            <Play className="w-4 h-4" /> Test Agent
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 h-full bg-black/20 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-black/20"
        >
          <Controls className="bg-white/10 border border-white/10 fill-white text-white" />
          <MiniMap 
            className="bg-black/60 border border-white/10 rounded-lg" 
            nodeColor={() => '#3b82f6'} 
            maskColor="rgba(0, 0, 0, 0.6)" 
          />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="rgba(255, 255, 255, 0.1)" />
        </ReactFlow>
      </div>
    </div>
  );
}
