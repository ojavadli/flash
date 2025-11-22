"use client";

import React from "react";
import { motion } from "framer-motion";
import { Network, LineChart, Mic, Zap, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Network,
    title: "Agent Builder",
    description: "Visual workflow designer to create sophisticated AI agents without coding. Drag, drop, and configure logic flows in minutes.",
    color: "blue"
  },
  {
    icon: LineChart,
    title: "Analytics Engine",
    description: "Real-time insights into agent performance. Track metrics, identify patterns, and get AI-powered recommendations for improvement.",
    color: "purple"
  },
  {
    icon: Mic,
    title: "Voice Intelligence",
    description: "Natural voice conversations with emotion detection. Handle interruptions, accents, and complex dialogues seamlessly.",
    color: "green"
  },
  {
    icon: Zap,
    title: "Auto-Optimization",
    description: "Machine learning continuously improves your agents. Automatic policy updates based on conversation analysis.",
    color: "yellow"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 compliant infrastructure. End-to-end encryption, role-based access, and audit logs for compliance.",
    color: "red"
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Support customers globally in 40+ languages. Automatic translation and cultural context awareness built-in.",
    color: "cyan"
  }
];

export function Features() {
  return (
    <section className="py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_70%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Everything you need to scale
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              AI operations
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            From visual building to deep analytics, Flash provides enterprise-grade tools for AI deployment
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
            >
              <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
