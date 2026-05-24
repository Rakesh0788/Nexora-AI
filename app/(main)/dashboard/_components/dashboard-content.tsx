"use client";

import { format } from "date-fns";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Zap,
  Lightbulb,
  RefreshCw,
  Award,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CareerProgress } from "@/components/career-progress";
import type { IndustryInsightWithSalary } from "@/lib/types";
import type { CareerProgressData } from "@/actions/progress";
import type { User } from "@prisma/client";

interface DashboardContentProps {
  insights: IndustryInsightWithSalary;
  user: User | null;
  progress: CareerProgressData;
}

const demandConfig = {
  High: { color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", icon: TrendingUp, progress: 90 },
  Medium: { color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", icon: Minus, progress: 55 },
  Low: { color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/20", icon: TrendingDown, progress: 25 },
};

const outlookConfig = {
  Positive: { label: "Positive", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30" },
  Neutral: { label: "Neutral", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30" },
  Negative: { label: "Negative", color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/30" },
};

function formatSalary(val: number) {
  return `$${Math.round(val / 1000)}K`;
}

export function DashboardContent({ insights, user, progress }: DashboardContentProps) {
  const demand = demandConfig[insights.demandLevel];
  const outlook = outlookConfig[insights.marketOutlook];
  const DemandIcon = demand.icon;

  const salaryData = insights.salaryRanges.map((s) => ({
    role: s.role,
    Min: s.min,
    Median: s.median,
    Max: s.max,
  }));

  const radarData = insights.topSkills.slice(0, 6).map((skill, i) => ({
    skill,
    demand: Math.max(60, 100 - i * 8),
  }));

  const industryLabel = insights.industry
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black gradient-title">Industry Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {industryLabel} · Last updated{" "}
            {format(new Date(insights.lastUpdated), "MMM d, yyyy")}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`self-start sm:self-auto px-3 py-1.5 text-sm font-semibold border ${outlook.bg} ${outlook.color}`}
        >
          Market Outlook: {outlook.label}
        </Badge>
      </div>

      {/* Career Progress Section */}
      <CareerProgress data={progress} />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Growth Rate</span>
              <div className="w-7 h-7 rounded-md bg-violet-500/10 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
              </div>
            </div>
            <p className="text-3xl font-black">{insights.growthRate}<span className="text-lg font-semibold text-muted-foreground">%</span></p>
            <p className="text-xs text-muted-foreground mt-1">Annual growth rate</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Demand Level</span>
              <div className={`w-7 h-7 rounded-md flex items-center justify-center border ${demand.bg}`}>
                <DemandIcon className={`w-3.5 h-3.5 ${demand.color}`} />
              </div>
            </div>
            <p className={`text-3xl font-black ${demand.color}`}>{insights.demandLevel}</p>
            <Progress value={demand.progress} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Median Salary</span>
              <div className="w-7 h-7 rounded-md bg-emerald-500/10 flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
            <p className="text-3xl font-black">
              {formatSalary(
                insights.salaryRanges.reduce((acc, r) => acc + r.median, 0) /
                  insights.salaryRanges.length
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Avg across all roles</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">In-Demand Skills</span>
              <div className="w-7 h-7 rounded-md bg-amber-500/10 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
            <p className="text-3xl font-black">{insights.topSkills.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Key skills tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Salary Ranges by Role</CardTitle>
            <CardDescription className="text-xs">Min, Median & Max compensation (USD)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={salaryData} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="role" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tickFormatter={formatSalary} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={48} />
                <Tooltip
                  formatter={(value: number) => [formatSalary(value), ""]}
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                />
                <Bar dataKey="Min" fill="hsl(var(--chart-3))" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Median" fill="hsl(var(--chart-1))" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Max" fill="hsl(var(--chart-2))" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-2">
              {["Min", "Median", "Max"].map((label, i) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: ["hsl(var(--chart-3))", "hsl(var(--chart-1))", "hsl(var(--chart-2))"][i] }} />
                  {label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Skills Demand Radar</CardTitle>
            <CardDescription className="text-xs">Relative demand for top skills in {industryLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Radar name="Demand" dataKey="demand" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <CardTitle className="text-base font-semibold">Key Trends</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {insights.keyTrends.map((trend, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/40 border border-border/40">
                <span className="text-xs font-bold text-violet-400 mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-xs text-muted-foreground leading-relaxed">{trend}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <CardTitle className="text-base font-semibold">Top Skills</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.topSkills.map((skill, i) => (
                <Badge key={skill} variant="secondary" className="text-xs font-medium px-2.5 py-1 bg-muted/60 border border-border/60" style={{ opacity: 1 - i * 0.08 }}>
                  {skill}
                </Badge>
              ))}
            </div>
            {user?.skills && user.skills.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/40">
                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> Your matching skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {user.skills.filter((s) => insights.topSkills.some((ts) => ts.toLowerCase() === s.toLowerCase())).map((skill) => (
                    <Badge key={skill} className="text-xs bg-violet-500/15 text-violet-400 border border-violet-500/30">{skill}</Badge>
                  ))}
                  {user.skills.filter((s) => insights.topSkills.some((ts) => ts.toLowerCase() === s.toLowerCase())).length === 0 && (
                    <p className="text-xs text-muted-foreground">No direct matches — consider adding recommended skills.</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              <CardTitle className="text-base font-semibold">Recommended to Learn</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {insights.recommendedSkills.map((skill, i) => (
              <div key={skill} className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15 group hover:bg-emerald-500/10 transition-colors">
                <span className="text-xs font-medium">{skill}</span>
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-emerald-500/30 text-emerald-400">#{i + 1} priority</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground/60 pb-4">
        <RefreshCw className="w-3 h-3" />
        <span>
          Data refreshes automatically every Sunday · Next update:{" "}
          {format(new Date(insights.nextUpdate), "MMMM d, yyyy")}
        </span>
      </div>
    </div>
  );
}

