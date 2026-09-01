import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import type { RoomStatus, ConflictSeverity, ConflictStatus } from '@/types';

export const RoomStatusBadge = ({ status }: { status: RoomStatus }) => {
  const map: Record<RoomStatus, { label: string; variant: BadgeVariant }> = {
    available: { label: 'Available', variant: 'success' },
    occupied: { label: 'Occupied', variant: 'info' },
    reserved: { label: 'Reserved', variant: 'warning' },
    maintenance: { label: 'Maintenance', variant: 'error' },
    underutilized: { label: 'Underutilized', variant: 'slate' },
    overcrowded: { label: 'Overcrowded', variant: 'orange' },
  };

  const item = map[status] || { label: status, variant: 'default' };

  return (
    <Badge variant={item.variant} dot>
      {item.label}
    </Badge>
  );
};

export const SeverityBadge = ({ severity }: { severity: ConflictSeverity }) => {
  const map: Record<ConflictSeverity, { label: string; variant: BadgeVariant }> = {
    CRITICAL: { label: 'CRITICAL', variant: 'error' },
    HIGH: { label: 'HIGH', variant: 'orange' },
    MEDIUM: { label: 'MEDIUM', variant: 'warning' },
    LOW: { label: 'LOW', variant: 'info' },
  };

  const item = map[severity] || { label: severity, variant: 'default' };

  return <Badge variant={item.variant}>{item.label}</Badge>;
};

export const ConflictStatusBadge = ({ status }: { status: ConflictStatus }) => {
  const map: Record<ConflictStatus, { label: string; variant: BadgeVariant }> = {
    open: { label: 'Open', variant: 'error' },
    'in-progress': { label: 'In Progress', variant: 'warning' },
    resolved: { label: 'Resolved', variant: 'success' },
  };

  const item = map[status] || { label: status, variant: 'default' };

  return <Badge variant={item.variant}>{item.label}</Badge>;
};
