import { useState } from "react";
import { Search, MoreHorizontal, Plus, Filter, Play, Square, Radio, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const mockStreams = [
  { id: "1", name: "Music 24/7 Lofi", user: "Ahmad Rizky", platform: "youtube", status: "live", quality: "1080p", viewers: 1234, is_24h: true, created_at: "2024-01-15" },
  { id: "2", name: "Gaming Marathon", user: "Siti Nurhaliza", platform: "twitch", status: "live", quality: "1080p", viewers: 567, is_24h: false, created_at: "2024-01-14" },
  { id: "3", name: "News Channel ID", user: "Budi Santoso", platform: "facebook", status: "idle", quality: "720p", viewers: 0, is_24h: true, created_at: "2024-01-10" },
  { id: "4", name: "Podcast Malam", user: "Dewi Lestari", platform: "youtube", status: "starting", quality: "1080p", viewers: 0, is_24h: false, created_at: "2024-01-08" },
  { id: "5", name: "Tutorial Coding", user: "Eko Prasetyo", platform: "youtube", status: "error", quality: "4k", viewers: 0, is_24h: false, created_at: "2024-01-05" },
  { id: "6", name: "Radio Streaming", user: "Fitri Handayani", platform: "custom", status: "live", quality: "720p", viewers: 89, is_24h: true, created_at: "2024-01-03" },
];

const getStatusBadge = (status: string) => {
  const config: Record<string, { class: string; icon: React.ReactNode }> = {
    live: { class: "bg-green-500/10 text-green-500 border-green-500/20", icon: <Radio className="h-3 w-3 mr-1 animate-pulse" /> },
    idle: { class: "bg-muted text-muted-foreground border-border", icon: null },
    starting: { class: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: <Play className="h-3 w-3 mr-1" /> },
    stopping: { class: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: <Square className="h-3 w-3 mr-1" /> },
    error: { class: "bg-red-500/10 text-red-500 border-red-500/20", icon: null },
  };
  return config[status] || config.idle;
};

const getPlatformBadge = (platform: string) => {
  const styles: Record<string, string> = {
    youtube: "bg-red-500/10 text-red-500",
    facebook: "bg-blue-600/10 text-blue-600",
    twitch: "bg-purple-500/10 text-purple-500",
    custom: "bg-muted text-muted-foreground",
  };
  return styles[platform] || styles.custom;
};

const Streams = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");

  const filteredStreams = mockStreams.filter((stream) => {
    const matchesSearch = 
      stream.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || stream.status === statusFilter;
    const matchesPlatform = platformFilter === "all" || stream.platform === platformFilter;
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const liveCount = mockStreams.filter(s => s.status === "live").length;
  const totalViewers = mockStreams.reduce((sum, s) => sum + s.viewers, 0);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Streams</h1>
          <p className="text-muted-foreground mt-1">
            {liveCount} stream live • {totalViewers.toLocaleString()} total viewers
          </p>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Buat Stream
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari stream atau user..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="idle">Idle</SelectItem>
            <SelectItem value="starting">Starting</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Platform</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="twitch">Twitch</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Stream</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quality</TableHead>
              <TableHead className="text-center">Viewers</TableHead>
              <TableHead>24/7</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStreams.map((stream) => {
              const statusConfig = getStatusBadge(stream.status);
              return (
                <TableRow key={stream.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div>
                      <p className="font-medium">{stream.name}</p>
                      <p className="text-sm text-muted-foreground">{stream.user}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlatformBadge(stream.platform)}>
                      {stream.platform}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig.class}>
                      {statusConfig.icon}
                      {stream.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{stream.quality}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <span>{stream.viewers.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {stream.is_24h ? (
                      <Badge className="bg-primary/10 text-primary">24/7</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem>Edit Stream</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {stream.status === "live" ? (
                          <DropdownMenuItem className="text-orange-500">
                            <Square className="h-4 w-4 mr-2" />
                            Stop Stream
                          </DropdownMenuItem>
                        ) : stream.status === "idle" ? (
                          <DropdownMenuItem className="text-green-500">
                            <Play className="h-4 w-4 mr-2" />
                            Start Stream
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Hapus Stream
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan {filteredStreams.length} dari {mockStreams.length} streams
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Sebelumnya
          </Button>
          <Button variant="outline" size="sm">
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Streams;
