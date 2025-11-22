"use client";

import React from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

const conversationData = [
  { name: "Mon", total: 4200, resolved: 3990 },
  { name: "Tue", total: 3800, resolved: 3610 },
  { name: "Wed", total: 5100, resolved: 4845 },
  { name: "Thu", total: 4600, resolved: 4370 },
  { name: "Fri", total: 3900, resolved: 3705 },
  { name: "Sat", total: 2800, resolved: 2660 },
  { name: "Sun", total: 3200, resolved: 3040 },
];

const insights = [
  { title: "Add self-service password reset flow", impact: "928 tickets", improvement: "13.8%", type: "Policy Update" },
  { title: "Improve greeting message clarity", impact: "1,190 tickets", improvement: "22.2%", type: "Content Optimization" },
  { title: "Add FAQ for billing inquiries", impact: "672 tickets", improvement: "9.7%", type: "Knowledge Gap" },
];

export default function InsightsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics & Insights</h1>
        <p className="text-white/60">AI-powered recommendations to improve your agent performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Resolution Rate", value: "94.8%", change: "+2.3%", trend: "up" },
          { label: "Avg Response Time", value: "0.7s", change: "-18%", trend: "up" },
          { label: "Customer Satisfaction", value: "4.8/5", change: "+0.2", trend: "up" },
          { label: "Cost per Conversation", value: "$0.12", change: "-24%", trend: "up" },
        ].map((kpi, i) => (
          <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-sm text-white/40 mb-2">{kpi.label}</div>
            <div className="text-3xl font-bold text-white mb-2">{kpi.value}</div>
            <div className={`flex items-center gap-1 text-sm font-medium ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-6">Conversation Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={conversationData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-6">Resolution Rate Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={conversationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">AI-Generated Insights</h3>
            <p className="text-sm text-white/60">Recommendations to improve performance</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
            Generate New Insights
          </button>
        </div>

        <div className="space-y-4">
          {insights.map((insight, i) => (
            <div key={i} className="p-4 rounded-lg bg-black/20 border border-white/10 hover:border-white/20 transition-colors cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1 group-hover:text-blue-400 transition-colors">{insight.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-xs">{insight.type}</span>
                    <span>{insight.impact}</span>
                    <span className="text-green-400 font-medium">{insight.improvement} improvement</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
