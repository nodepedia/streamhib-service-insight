import { Users, Radio, DollarSign, TrendingUp, Play, Clock } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data - in production would come from API
const recentStreams = [
  { id: "1", name: "Music 24/7", platform: "youtube", status: "live", viewers: 1234 },
  { id: "2", name: "Gaming Stream", platform: "twitch", status: "live", viewers: 567 },
  { id: "3", name: "News Channel", platform: "facebook", status: "idle", viewers: 0 },
  { id: "4", name: "Podcast Live", platform: "youtube", status: "starting", viewers: 0 },
];

const recentUsers = [
  { id: "1", name: "Ahmad Rizky", email: "ahmad@email.com", plan: "professional", joined: "2 jam lalu" },
  { id: "2", name: "Siti Nurhaliza", email: "siti@email.com", plan: "starter", joined: "5 jam lalu" },
  { id: "3", name: "Budi Santoso", email: "budi@email.com", plan: "free", joined: "1 hari lalu" },
];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    live: "bg-green-500/10 text-green-500 border-green-500/20",
    idle: "bg-muted text-muted-foreground border-border",
    starting: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    error: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  return styles[status] || styles.idle;
};

const getPlanBadge = (plan: string) => {
  const styles: Record<string, string> = {
    free: "bg-muted text-muted-foreground",
    starter: "bg-blue-500/10 text-blue-500",
    professional: "bg-primary/10 text-primary",
    enterprise: "bg-purple-500/10 text-purple-500",
  };
  return styles[plan] || styles.free;
};

const Dashboard = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Selamat datang di Admin Panel InfinityStream
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value="1,234"
          change="+12% dari bulan lalu"
          changeType="positive"
          icon={Users}
        />
        <StatsCard
          title="Active Streams"
          value="89"
          change="15 live sekarang"
          changeType="positive"
          icon={Radio}
        />
        <StatsCard
          title="Revenue Bulan Ini"
          value="Rp 45.2M"
          change="+8% dari bulan lalu"
          changeType="positive"
          icon={DollarSign}
        />
        <StatsCard
          title="Uptime"
          value="99.9%"
          change="30 hari terakhir"
          changeType="neutral"
          icon={TrendingUp}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Streams */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Stream Terbaru</CardTitle>
            <a href="/admin/streams" className="text-sm text-primary hover:underline">
              Lihat Semua
            </a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      {stream.status === "live" ? (
                        <Play className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{stream.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {stream.platform}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {stream.status === "live" && (
                      <span className="text-sm text-muted-foreground">
                        {stream.viewers.toLocaleString()} viewers
                      </span>
                    )}
                    <Badge variant="outline" className={getStatusBadge(stream.status)}>
                      {stream.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">User Baru</CardTitle>
            <a href="/admin/users" className="text-sm text-primary hover:underline">
              Lihat Semua
            </a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getPlanBadge(user.plan)}>
                      {user.plan}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{user.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
