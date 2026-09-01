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

interface RoomUtilizationChartProps {
  data: ChartDataPoint[];
  height?: number;
}

export const RoomUtilizationChart = ({
  data,
  height = 240,
}: RoomUtilizationChartProps) => {
  const getBarColor = (value: number) => {
    if (value >= 85) return '#ef4444';
    if (value >= 70) return '#2563eb';
    if (value >= 50) return '#10b981';
    return '#71717a';
  };

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
            Classroom Space Load
          </h3>
          <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            Individual room capacity utilization
          </p>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
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
                  const val = Number(payload[0].value);
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
                        Utilization: <span className="font-bold">{val}%</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RoomUtilizationChart;
