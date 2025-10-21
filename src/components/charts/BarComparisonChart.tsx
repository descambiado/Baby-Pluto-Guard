import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BarComparisonChartProps {
  title: string;
  description?: string;
  data: Array<{ name: string; current: number; previous?: number }>;
}

export function BarComparisonChart({ title, description, data }: BarComparisonChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid gap-2">
                        <span className="text-[0.70rem] font-medium uppercase text-muted-foreground">
                          {payload[0].payload.name}
                        </span>
                        {payload.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground capitalize">
                              {item.name}:
                            </span>
                            <span className="font-bold text-foreground">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="current" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            {data[0]?.previous !== undefined && (
              <Bar dataKey="previous" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
