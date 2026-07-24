import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react";

export default function EngineerQueue() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Engineer Dashboard</h1>
              <p className="text-sm text-slate-600">Audit queue & portfolio analytics</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">Live</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-slate-200">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-medium text-slate-600">This Week</p>
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">12</div>
            <p className="text-xs text-slate-600 mt-1">submissions</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-slate-200 bg-green-50/50">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-medium text-slate-600">Auto-Cleared</p>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">8</div>
            <p className="text-xs text-slate-600 mt-1">67% tier 1</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-slate-200 bg-blue-50/50">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-medium text-slate-600">Video Verified</p>
              <AlertCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600">3</div>
            <p className="text-xs text-slate-600 mt-1">25% tier 2</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-slate-200 bg-orange-50/50">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-medium text-slate-600">Visits Needed</p>
              <TrendingDown className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600">1</div>
            <p className="text-xs text-slate-600 mt-1">8% tier 3</p>
          </Card>
        </div>

        {/* Queue Table Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Active Queue</h2>
              <p className="text-sm text-slate-600">Submissions waiting for action</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-100">
                Filter
              </Button>
              <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-100">
                Sort
              </Button>
            </div>
          </div>

          <Card className="border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 bg-slate-50/50 hover:bg-slate-50">
                    <TableHead className="font-semibold">Operator</TableHead>
                    <TableHead className="font-semibold">Fleet Size</TableHead>
                    <TableHead className="font-semibold">Tier</TableHead>
                    <TableHead className="font-semibold">Risk Score</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-slate-200 hover:bg-blue-50/30 transition-colors duration-150">
                    <TableCell className="font-medium text-slate-900">Acme Transport</TableCell>
                    <TableCell className="text-slate-600">45 vehicles</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Tier 1
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600 font-semibold">1.8/5.0</span>
                      <p className="text-xs text-slate-600">Low risk</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Cleared
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-slate-200 hover:bg-yellow-50/30 transition-colors duration-150">
                    <TableCell className="font-medium text-slate-900">Northern Freight</TableCell>
                    <TableCell className="text-slate-600">120 vehicles</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Tier 2
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-yellow-600 font-semibold">2.9/5.0</span>
                      <p className="text-xs text-slate-600">Medium risk</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Video Requested
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-slate-200 hover:bg-orange-50/30 transition-colors duration-150">
                    <TableCell className="font-medium text-slate-900">Highway Haulage</TableCell>
                    <TableCell className="text-slate-600">15 vehicles</TableCell>
                    <TableCell>
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Tier 3
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-orange-600 font-semibold">4.2/5.0</span>
                      <p className="text-xs text-slate-600">High risk</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        Escalated
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="default" size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Assign Visit
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Portfolio Summary */}
        <Card className="p-8 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Portfolio Impact</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <p className="text-sm text-slate-600 mb-2">Engineer Hours Saved</p>
              <div className="text-3xl font-bold text-blue-600">24h</div>
              <p className="text-xs text-slate-600 mt-1">This month</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">Travel Distances Avoided</p>
              <div className="text-3xl font-bold text-green-600">1,200km</div>
              <p className="text-xs text-slate-600 mt-1">Approximate</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">Throughput Multiplier</p>
              <div className="text-3xl font-bold text-purple-600">8.5x</div>
              <p className="text-xs text-slate-600 mt-1">vs. manual audits</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">Avg Response Time</p>
              <div className="text-3xl font-bold text-emerald-600">3.2s</div>
              <p className="text-xs text-slate-600 mt-1">Triage engine</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
