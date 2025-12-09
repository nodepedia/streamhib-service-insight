import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Search,
  ListVideo,
  Video as VideoIcon,
  GripVertical
} from "lucide-react";
import { toast } from "sonner";

interface Video {
  id: string;
  title: string;
  duration_seconds: number;
  file_size: number;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  video_count: number;
  videos?: Video[];
  created_at: string;
}

// Mock data
const mockPlaylists: Playlist[] = [
  {
    id: "1",
    name: "Tutorial Series",
    description: "Kumpulan tutorial programming",
    video_count: 5,
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    name: "Live Coding Collection",
    description: "Video live coding sessions",
    video_count: 3,
    created_at: "2024-01-14T14:00:00Z"
  },
  {
    id: "3",
    name: "Gaming Content",
    description: "Video gaming untuk streaming",
    video_count: 8,
    created_at: "2024-01-13T09:00:00Z"
  }
];

const mockVideos: Video[] = [
  { id: "1", title: "Tutorial React Hooks", duration_seconds: 3600, file_size: 256000000 },
  { id: "2", title: "Live Coding Session #1", duration_seconds: 7200, file_size: 512000000 },
  { id: "3", title: "JavaScript Tips", duration_seconds: 1800, file_size: 128000000 },
  { id: "4", title: "CSS Animations", duration_seconds: 2400, file_size: 192000000 },
  { id: "5", title: "Node.js Basics", duration_seconds: 5400, file_size: 384000000 },
];

const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) {
    return `${hrs}j ${mins}m`;
  }
  return `${mins}m`;
};

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [playlistVideos, setPlaylistVideos] = useState<Video[]>([]);
  const [availableVideos] = useState<Video[]>(mockVideos);

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async () => {
    if (!playlistName.trim()) {
      toast.error("Nama playlist harus diisi");
      return;
    }

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: playlistName,
      description: playlistDescription,
      video_count: 0,
      created_at: new Date().toISOString()
    };

    setPlaylists(prev => [newPlaylist, ...prev]);
    toast.success("Playlist berhasil dibuat!");
    setCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setPlaylistName(playlist.name);
    setPlaylistDescription(playlist.description || "");
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedPlaylist) return;

    setPlaylists(prev =>
      prev.map(p =>
        p.id === selectedPlaylist.id
          ? { ...p, name: playlistName, description: playlistDescription }
          : p
      )
    );
    toast.success("Playlist berhasil diupdate!");
    setEditDialogOpen(false);
    resetForm();
  };

  const handleManageVideos = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    // In production, fetch playlist videos from API
    setPlaylistVideos(mockVideos.slice(0, playlist.video_count));
    setManageDialogOpen(true);
  };

  const handleAddVideo = (video: Video) => {
    if (playlistVideos.find(v => v.id === video.id)) {
      toast.error("Video sudah ada di playlist");
      return;
    }
    setPlaylistVideos(prev => [...prev, video]);
    toast.success("Video ditambahkan ke playlist");
  };

  const handleRemoveVideo = (videoId: string) => {
    setPlaylistVideos(prev => prev.filter(v => v.id !== videoId));
    toast.success("Video dihapus dari playlist");
  };

  const handleDelete = async (playlist: Playlist) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlist.id));
    toast.success("Playlist berhasil dihapus!");
  };

  const resetForm = () => {
    setPlaylistName("");
    setPlaylistDescription("");
    setSelectedPlaylist(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Playlist Manager</h1>
        <p className="text-muted-foreground">
          Kelola playlist video untuk live streaming
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari playlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Buat Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Playlist Baru</DialogTitle>
              <DialogDescription>
                Buat playlist untuk mengorganisir video streaming
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nama Playlist</Label>
                <Input
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Nama playlist"
                />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi (Opsional)</Label>
                <Textarea
                  value={playlistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
                  placeholder="Deskripsi playlist"
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                Buat Playlist
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Playlists Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlaylists.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ListVideo className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Belum ada playlist</p>
            </CardContent>
          </Card>
        ) : (
          filteredPlaylists.map((playlist) => (
            <Card key={playlist.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ListVideo className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{playlist.name}</CardTitle>
                      <CardDescription className="line-clamp-1">
                        {playlist.description || "Tidak ada deskripsi"}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleManageVideos(playlist)}>
                        <VideoIcon className="mr-2 h-4 w-4" />
                        Kelola Video
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(playlist)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(playlist)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {playlist.video_count} video
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(playlist.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Playlist</DialogTitle>
            <DialogDescription>
              Update informasi playlist
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Playlist</Label>
              <Input
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
              />
            </div>
            <Button onClick={handleSaveEdit} className="w-full">
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Videos Dialog */}
      <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kelola Video - {selectedPlaylist?.name}</DialogTitle>
            <DialogDescription>
              Tambah atau hapus video dari playlist
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Video dalam Playlist</Label>
              {playlistVideos.length === 0 ? (
                <div className="border rounded-lg p-4 text-center text-muted-foreground">
                  Belum ada video dalam playlist
                </div>
              ) : (
                <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                  {playlistVideos.map((video, index) => (
                    <div key={video.id} className="flex items-center gap-3 p-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <span className="text-sm text-muted-foreground w-6">{index + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{video.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDuration(video.duration_seconds)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveVideo(video.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tambah Video</Label>
              <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                {availableVideos
                  .filter(v => !playlistVideos.find(pv => pv.id === v.id))
                  .map((video) => (
                    <div key={video.id} className="flex items-center gap-3 p-3">
                      <VideoIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{video.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDuration(video.duration_seconds)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddVideo(video)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Tambah
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Playlists;
