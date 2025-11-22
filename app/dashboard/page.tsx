export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Conversations", value: "24,592", change: "+12.5%" },
          { label: "Resolution Rate", value: "94.2%", change: "+2.1%" },
          { label: "Active Agents", value: "12", change: "+3" },
          { label: "Avg Response Time", value: "0.8s", change: "-15%" },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-sm text-white/40 mb-2">{stat.label}</div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-green-400">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
        <p className="text-white/60">Select a feature from the sidebar to get started</p>
      </div>
    </div>
  );
}

