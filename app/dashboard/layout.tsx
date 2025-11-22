import { AgentProvider } from "@/context/AgentContext";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AgentProvider>
      <div className="min-h-screen bg-black">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />
        <Sidebar />
        <main className="pl-64 min-h-screen relative">
          {children}
        </main>
      </div>
    </AgentProvider>
  );
}
