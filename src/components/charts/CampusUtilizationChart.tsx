import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from '@/types';

interface CampusUtilizationChartProps {
  data: ChartDataPoint[];
  height?: number;
}

export const CampusUtilizationChart = ({
  data,
  height = 240,
}: CampusUtilizationChartProps) => {
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
            Weekly Campus Utilization
          </h3>
          <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            Average space occupancy over the week
          </p>
        </div>
        <span className="pill pill-success">68.4% Avg</span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="utilizationGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div
                      className="px-3 py-2 rounded-xl text-[12px] shadow-lg"
                      style={{
                        backgroundColor: 'var(--bg-inverse)',
                        color: 'var(--text-inverse)',
                      }}
                    >
                      <p className="font-semibold">{label}</p>
                      <p className="mt-0.5" style={{ opacity: 0.9 }}>
                        Utilization: <span className="font-bold">{payload[0].value}%</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#utilizationGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CampusUtilizationChart;
