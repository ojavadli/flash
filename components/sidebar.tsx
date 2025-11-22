"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Network, MessageSquare, BarChart, Mic, Settings, Phone } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Agent Builder", href: "/dashboard/canvas", icon: Network },
    { name: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
    { name: "Outbound Calls", href: "/dashboard/outbound", icon: Phone },
    { name: "Analytics", href: "/dashboard/insights", icon: BarChart },
    { name: "Voice AI", href: "/dashboard/voice", icon: Mic },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-black border-r border-white/10 flex flex-col">
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <Link href="/" className="text-2xl font-bold text-white">Flash</Link>
      </div>

      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all mb-1 ${
                isActive
                  ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-white/40 mb-1">API Status</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-white">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}

