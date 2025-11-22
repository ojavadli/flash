import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Features />
      
      {/* CTA Section */}
      <section className="py-32 bg-black relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            See it in action
            <br />
            right now
          </h2>
          <p className="text-xl text-white/60 mb-10">
            Try our live demo - no signup, no API keys required
          </p>
          <Link href="/demo" className="inline-block px-8 py-4 rounded-full bg-white text-black text-lg font-semibold hover:bg-gray-100 transition-all">
            Try Live Demo →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
