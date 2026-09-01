import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ChartDataPoint } from '@/types';

interface LabUtilizationChartProps {
  data: ChartDataPoint[];
  height?: number;
}

export const LabUtilizationChart = ({
  data,
  height = 240,
}: LabUtilizationChartProps) => {
  return (
    <div
      className="surface-card p-4 rounded-2xl flex flex-col justify-between"
      style={{
        backgroundColor: 'var(--surface-1)',
        borderColor: 'var(--border-primary)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[13px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Laboratory Utilization
          </h3>
          <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            Equipment-intensive facility workloads
          </p>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
              width={85}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div
                      className="px-3 py-2 rounded-xl text-[12px] shadow-lg"
                      style={{
                        backgroundColor: 'var(--bg-inverse)',
                        color: 'var(--text-inverse)',
                      }}
                    >
                      <p className="font-semibold">{item.name}</p>
                      <p className="mt-0.5" style={{ opacity: 0.9 }}>
                        Usage: <span className="font-bold">{item.value}%</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.value >= 90
                      ? '#f97316'
                      : entry.value >= 70
                      ? '#2563eb'
                      : entry.value >= 40
                      ? '#10b981'
                      : '#71717a'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LabUtilizationChart;
