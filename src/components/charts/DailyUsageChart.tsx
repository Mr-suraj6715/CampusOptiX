import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { TimeSeriesPoint } from '@/types';

interface DailyUsageChartProps {
  data: TimeSeriesPoint[];
  height?: number;
}

export const DailyUsageChart = ({
  data,
  height = 240,
}: DailyUsageChartProps) => {
  return (
    <div
      className="surface-card p-4 rounded-2xl flex flex-col justify-between"
      style={{
        backgroundColor: 'var(--surface-1)',
        borderColor: 'var(--border-primary)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-[13px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Hourly Resource Demand
          </h3>
          <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            Concurrent active sessions across campus facilities
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
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div
                      className="px-3 py-2 rounded-xl text-[12px] shadow-lg space-y-1"
                      style={{
                        backgroundColor: 'var(--bg-inverse)',
                        color: 'var(--text-inverse)',
                      }}
                    >
                      <p className="font-semibold">{label}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-3 text-[11px]">
                          <span className="flex items-center gap-1.5">
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            {entry.name}:
                          </span>
                          <span className="font-bold">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={6}
              wrapperStyle={{ fontSize: 11, paddingBottom: 6 }}
            />
            <Bar dataKey="rooms" name="Classrooms" fill="#2563eb" radius={[3, 3, 0, 0]} />
            <Bar dataKey="labs" name="Labs" fill="#10b981" radius={[3, 3, 0, 0]} />
            <Bar dataKey="halls" name="Seminar Halls" fill="#f59e0b" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyUsageChart;
