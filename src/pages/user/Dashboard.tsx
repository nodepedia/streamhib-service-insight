import { 
  PlayCircle, 
  Calendar, 
  CalendarClock, 
  CalendarDays,
  PauseCircle, 
  Film, 
  HardDrive 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  badge?: { label: string; variant: 'default' | 'secondary' | 'outline' };
}

const StatCard = ({ title, value, icon: Icon, description, badge }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
      </div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

const UserDashboard = () => {
  // Mock data - akan diganti dengan data real dari API
  const stats = {
    liveSessions: 2,
    scheduledOnce: 3,
    scheduledDaily: 5,
    scheduledWeekly: 2,
    inactiveSessions: 8,
    totalVideos: 45,
    diskUsage: '2.4 GB',
    diskLimit: '10 GB'
  };

  const scheduledStreams = [
    { id: 1, name: 'Morning Show', type: 'daily', nextRun: '08:00', platform: 'YouTube' },
    { id: 2, name: 'Weekly Podcast', type: 'weekly', nextRun: 'Senin 19:00', platform: 'YouTube' },
    { id: 3, name: 'Product Launch', type: 'once', nextRun: '15 Des 2024', platform: 'Facebook' },
  ];

  const getScheduleTypeBadge = (type: string) => {
    switch (type) {
      case 'once':
        return { label: 'Sekali', variant: 'outline' as const };
      case 'daily':
        return { label: 'Harian', variant: 'default' as const };
      case 'weekly':
        return { label: 'Mingguan', variant: 'secondary' as const };
      default:
        return { label: type, variant: 'outline' as const };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas streaming Anda</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Sesi Live Aktif"
          value={stats.liveSessions}
          icon={PlayCircle}
          description="Sedang streaming sekarang"
        />
        <StatCard
          title="Terjadwal Sekali"
          value={stats.scheduledOnce}
          icon={Calendar}
          badge={{ label: 'Sekali', variant: 'outline' }}
        />
        <StatCard
          title="Terjadwal Harian"
          value={stats.scheduledDaily}
          icon={CalendarClock}
          badge={{ label: 'Harian', variant: 'default' }}
        />
        <StatCard
          title="Terjadwal Mingguan"
          value={stats.scheduledWeekly}
          icon={CalendarDays}
          badge={{ label: 'Mingguan', variant: 'secondary' }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Sesi Tidak Aktif"
          value={stats.inactiveSessions}
          icon={PauseCircle}
          description="Siap untuk diaktifkan"
        />
        <StatCard
          title="Total Video"
          value={stats.totalVideos}
          icon={Film}
          description="Video yang tersimpan"
        />
        <StatCard
          title="Penggunaan Disk"
          value={stats.diskUsage}
          icon={HardDrive}
          description={`Dari ${stats.diskLimit} tersedia`}
        />
      </div>

      {/* Scheduled Streams */}
      <Card>
        <CardHeader>
          <CardTitle>Jadwal Streaming</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledStreams.map((stream) => (
              <div 
                key={stream.id} 
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <PlayCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{stream.name}</p>
                    <p className="text-sm text-muted-foreground">{stream.nextRun}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getScheduleTypeBadge(stream.type).variant}>
                    {getScheduleTypeBadge(stream.type).label}
                  </Badge>
                  <Badge variant="outline">{stream.platform}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
