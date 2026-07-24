import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">RG</span>
            </div>
            <span className="text-xl font-bold text-white">RiskGate</span>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/50">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Audit Platform for NTI
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
            Scale audits without scaling headcount
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Deploy AI-powered triage to route 70% of audits to auto-clear, 20% to remote verification, and only 10% to in-person visits. Let three engineers cover the work of thirty.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                I'm an Operator
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/queue" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-600 text-white hover:bg-slate-800/50 hover:border-slate-500">
                I'm an NTI Engineer
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>AI-powered vision analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Multi-tier routing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Human sign-off required</span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 mb-24">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl p-8 transition-all duration-300">
              <div className="text-5xl mb-6">📱</div>
              <h3 className="text-xl font-semibold text-white mb-3">Guided Capture</h3>
              <p className="text-slate-400 leading-relaxed">Operators submit evidence through a structured mobile-first audit with photos, videos, and forms mapped to NTI pillars.</p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl p-8 transition-all duration-300">
              <div className="text-5xl mb-6">🤖</div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Triage Engine</h3>
              <p className="text-slate-400 leading-relaxed">Vision analysis plus LLM scoring routes each audit instantly to the optimal tier: auto-clear, video verification, or in-person.</p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl p-8 transition-all duration-300">
              <div className="text-5xl mb-6">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-3">Engineer Amplification</h3>
              <p className="text-slate-400 leading-relaxed">Engineers review only escalations and sign off on outcomes, concentrating expertise where it moves the needle most.</p>
            </div>
          </div>
        </div>

        {/* The Math / Scaling Story */}
        <div className="relative mt-32 mb-24">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl" />
          <div className="relative bg-slate-900/50 border border-slate-800 rounded-3xl p-12 md:p-16">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">The Scaling Math</h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center mb-12">
              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">3</div>
                <p className="text-slate-400 font-medium">Engineers</p>
              </div>

              <div className="flex justify-center">
                <div className="text-3xl text-slate-500">×</div>
              </div>

              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">10</div>
                <p className="text-slate-400 font-medium">Multiplier</p>
              </div>

              <div className="flex justify-center">
                <div className="text-3xl text-slate-500">=</div>
              </div>

              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-br from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">30</div>
                <p className="text-slate-400 font-medium">Effective Coverage</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-center mt-12 pt-12 border-t border-slate-800">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">70%</div>
                <p className="text-slate-400">Auto-clear at Tier 1</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">20%</div>
                <p className="text-slate-400">Verify via Tier 2 video</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">10%</div>
                <p className="text-slate-400">In-person Tier 3 visits</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="text-center py-16">
          <p className="text-slate-400 mb-8">Ready to amplify your audit capacity?</p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
