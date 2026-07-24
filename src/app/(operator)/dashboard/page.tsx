import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

export default function OperatorDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Operator Portal</h1>
            <p className="text-sm text-slate-600">Acme Transport</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Compliant
            </Badge>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Policy Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-slate-600 font-medium">Fleet Size</div>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-4xl font-bold text-slate-900">45</div>
            <p className="text-xs text-slate-600 mt-2">Active vehicles</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-slate-600 font-medium">Annual Premium</div>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-4xl font-bold text-slate-900">$285K</div>
            <p className="text-xs text-slate-600 mt-2">All-risk coverage</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-slate-600 font-medium">Total Mileage</div>
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-4xl font-bold text-slate-900">2.1M</div>
            <p className="text-xs text-slate-600 mt-2">Fleet km (YTD)</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-slate-200 bg-blue-50/50">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-slate-600 font-medium">Next Audit</div>
              <AlertCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-4xl font-bold text-slate-900">21 days</div>
            <p className="text-xs text-slate-600 mt-2">Aug 15, 2026</p>
          </Card>
        </div>

        {/* Main CTA Section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300" />
          <Card className="relative p-12 border-0 bg-gradient-to-br from-white to-slate-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Ready to run your next audit?
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Submit your guided audit now and get instant risk assessment. The process takes just 15 minutes with our mobile-optimized capture flow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  Start Guided Audit
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300 hover:bg-slate-100">
                  View Previous Audits
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Last Audit Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Asset Management</p>
                    <p className="text-sm text-slate-600">Tyre and brake inspection</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Clear</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Site Safety</p>
                    <p className="text-sm text-slate-600">Load restraint verification</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Clear</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">People Capability</p>
                    <p className="text-sm text-slate-600">Driver training records</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Clear</Badge>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6 border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Score</h3>
              <div className="text-center py-8">
                <div className="text-6xl font-bold text-green-600 mb-2">1.8</div>
                <p className="text-slate-600">out of 5.0</p>
                <p className="text-sm text-slate-600 mt-4">Tier 1: Auto-cleared</p>
              </div>
              <p className="text-xs text-slate-600 text-center mt-4">
                Your fleet meets all NTI standards for this audit period. No immediate action required.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
