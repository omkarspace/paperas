"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface AnalyticsProps {
  dailyViews: { date: string; views: number }[]
  topPapers: { title: string; views: number }[]
  editorialStats: { label: string; value: number }[]
}

export function AnalyticsCharts({ dailyViews, topPapers, editorialStats }: AnalyticsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Daily Views</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyViews}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Top Papers</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topPapers} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="title" type="category" width={150} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="views" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 lg:col-span-2">
        <h3 className="font-semibold mb-4">Editorial Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {editorialStats.map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
