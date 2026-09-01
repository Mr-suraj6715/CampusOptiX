import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ChartDataPoint } from '@/types';

interface ConflictsByTypeChartProps {
  data: ChartDataPoint[];
  height?: number;
}

const COLORS = ['#2563eb', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'];

export const ConflictsByTypeChart = ({
  data,
  height = 240,
}: ConflictsByTypeChartProps) => {
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
            Conflicts by Type
          </h3>
          <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            Distribution of identified scheduling anomalies
          </p>
        </div>
        <span className="pill pill-error">3 Open</span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
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
                        Conflicts: <span className="font-bold">{item.value}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={6}
              wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConflictsByTypeChart;
