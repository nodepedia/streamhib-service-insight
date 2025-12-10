import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Radio, 
  Play, 
  Square, 
  MoreHorizontal, 
  Youtube, 
  Facebook,
  Clock,
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/services/api';

interface Stream {
  id: string;
  name: string;
  platform: 'youtube' | 'facebook' | 'twitch' | 'custom';
  status: 'idle' | 'starting' | 'live' | 'stopping' | 'error';
  quality: string;
  started_at?: string;
  viewer_count: number;
  engineStatus?: {
    fps?: number;
    bitrate?: string;
    uptime?: number;
    currentVideo?: string;
  };
}

const formatUptime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'youtube':
      return <Youtube className="h-4 w-4 text-red-500" />;
    case 'facebook':
      return <Facebook className="h-4 w-4 text-blue-500" />;
    default:
      return <Radio className="h-4 w-4" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode; label: string }> = {
    idle: { variant: 'secondary', icon: <WifiOff className="h-3 w-3 mr-1" />, label: 'Offline' },
    starting: { variant: 'outline', icon: <RefreshCw className="h-3 w-3 mr-1 animate-spin" />, label: 'Starting' },
    live: { variant: 'default', icon: <Wifi className="h-3 w-3 mr-1" />, label: 'Live' },
    stopping: { variant: 'outline', icon: <RefreshCw className="h-3 w-3 mr-1 animate-spin" />, label: 'Stopping' },
    error: { variant: 'destructive', icon: <WifiOff className="h-3 w-3 mr-1" />, label: 'Error' },
  };

  const config = variants[status] || variants.idle;

  return (
    <Badge variant={config.variant} className="flex items-center">
      {config.icon}
      {config.label}
    </Badge>
  );
};

const LiveStreams = () => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStreams = async () => {
    try {
      const response = await api.getStreams();
      if (response.success && response.data) {
        setStreams(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch streams:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStreams();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchStreams, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStreams();
  };

  const handleStart = async (streamId: string) => {
    try {
      await api.startStream(streamId);
      toast.success('Stream starting...');
      fetchStreams();
    } catch (error: any) {
      toast.error(error.message || 'Failed to start stream');
    }
  };

  const handleStop = async (streamId: string) => {
    try {
      await api.stopStream(streamId);
      toast.success('Stream stopped');
      fetchStreams();
    } catch (error: any) {
      toast.error(error.message || 'Failed to stop stream');
    }
  };

  const activeStreams = streams.filter(s => s.status === 'live' || s.status === 'starting');
  const inactiveStreams = streams.filter(s => s.status !== 'live' && s.status !== 'starting');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Streams</h1>
          <p className="text-muted-foreground">
            Kelola dan monitor sesi streaming Anda
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Link to="/user/start-live">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Mulai Live
            </Button>
          </Link>
        </div>
      </div>

      {/* Active Streams */}
      {activeStreams.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Sedang Live ({activeStreams.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activeStreams.map((stream) => (
              <Card key={stream.id} className="border-green-500/50 bg-green-500/5">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={stream.platform} />
                      <CardTitle className="text-lg">{stream.name}</CardTitle>
                    </div>
                    <StatusBadge status={stream.status} />
                  </div>
                  <CardDescription>
                    {stream.quality} • {stream.engineStatus?.currentVideo || 'Loading...'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Live Stats */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Uptime</p>
                        <p className="font-mono font-semibold">
                          {stream.engineStatus?.uptime 
                            ? formatUptime(stream.engineStatus.uptime)
                            : '--:--:--'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">FPS</p>
                        <p className="font-mono font-semibold">
                          {stream.engineStatus?.fps || '--'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Bitrate</p>
                        <p className="font-mono font-semibold">
                          {stream.engineStatus?.bitrate || '--'}
                        </p>
                      </div>
                    </div>

                    {/* Health Indicator */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Stream Health</span>
                        <span className="text-green-500">Excellent</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>

                    {/* Stop Button */}
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => handleStop(stream.id)}
                      disabled={stream.status === 'stopping'}
                    >
                      <Square className="mr-2 h-4 w-4" />
                      Stop Stream
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Streams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Semua Stream</CardTitle>
          <CardDescription>
            Daftar semua konfigurasi stream Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : streams.length === 0 ? (
            <div className="text-center py-8">
              <Radio className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Belum ada stream</p>
              <Link to="/user/start-live">
                <Button>Buat Stream Pertama</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Kualitas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Terakhir Live</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {streams.map((stream) => (
                  <TableRow key={stream.id}>
                    <TableCell className="font-medium">{stream.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform={stream.platform} />
                        <span className="capitalize">{stream.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell>{stream.quality}</TableCell>
                    <TableCell>
                      <StatusBadge status={stream.status} />
                    </TableCell>
                    <TableCell>
                      {stream.started_at 
                        ? new Date(stream.started_at).toLocaleString('id-ID')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {stream.status === 'idle' || stream.status === 'error' ? (
                            <DropdownMenuItem onClick={() => handleStart(stream.id)}>
                              <Play className="mr-2 h-4 w-4" />
                              Mulai
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleStop(stream.id)}>
                              <Square className="mr-2 h-4 w-4" />
                              Stop
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveStreams;
