import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Upload, 
  Video as VideoIcon, 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Search,
  HardDrive,
  FileVideo,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import api, { Video } from "@/services/api";

// Mock data for demonstration
const mockVideos: Video[] = [
  {
    id: "1",
    user_id: "user-1",
    title: "Tutorial React Hooks",
    description: "Belajar React Hooks dari dasar",
    filename: "react-hooks.mp4",
    original_filename: "react-hooks.mp4",
    file_size: 256000000,
    duration_seconds: 3600,
    mime_type: "video/mp4",
    status: "ready",
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    user_id: "user-1",
    title: "Live Coding Session #1",
    description: "Building a full-stack app",
    filename: "live-coding-1.mp4",
    original_filename: "live-coding-1.mp4",
    file_size: 512000000,
    duration_seconds: 7200,
    mime_type: "video/mp4",
    status: "ready",
    created_at: "2024-01-14T14:00:00Z"
  },
  {
    id: "3",
    user_id: "user-1",
    title: "JavaScript Tips",
    description: "Tips dan trik JavaScript",
    filename: "js-tips.mp4",
    original_filename: "js-tips.mp4",
    file_size: 128000000,
    duration_seconds: 1800,
    mime_type: "video/mp4",
    status: "processing",
    created_at: "2024-01-16T09:00:00Z"
  }
];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStorage = videos.reduce((acc, v) => acc + v.file_size, 0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Hanya file video yang diperbolehkan");
        return;
      }
      setSelectedFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Pilih file video terlebih dahulu");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    try {
      // In production, use api.uploadVideo(selectedFile, uploadTitle, uploadDescription)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(interval);
      setUploadProgress(100);

      const newVideo: Video = {
        id: Date.now().toString(),
        user_id: "user-1",
        title: uploadTitle,
        description: uploadDescription,
        filename: selectedFile.name,
        original_filename: selectedFile.name,
        file_size: selectedFile.size,
        duration_seconds: 0,
        mime_type: selectedFile.type,
        status: "processing",
        created_at: new Date().toISOString()
      };

      setVideos(prev => [newVideo, ...prev]);
      toast.success("Video berhasil diupload!");
      setUploadDialogOpen(false);
      resetUploadForm();
    } catch {
      toast.error("Gagal mengupload video");
    } finally {
      setIsUploading(false);
      clearInterval(interval);
    }
  };

  const resetUploadForm = () => {
    setSelectedFile(null);
    setUploadTitle("");
    setUploadDescription("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (video: Video) => {
    setSelectedVideo(video);
    setEditTitle(video.title);
    setEditDescription(video.description || "");
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedVideo) return;

    try {
      // In production, use api.updateVideo(selectedVideo.id, { title: editTitle, description: editDescription })
      setVideos(prev =>
        prev.map(v =>
          v.id === selectedVideo.id
            ? { ...v, title: editTitle, description: editDescription }
            : v
        )
      );
      toast.success("Video berhasil diupdate!");
      setEditDialogOpen(false);
    } catch {
      toast.error("Gagal mengupdate video");
    }
  };

  const handleDelete = async (video: Video) => {
    try {
      // In production, use api.deleteVideo(video.id)
      setVideos(prev => prev.filter(v => v.id !== video.id));
      toast.success("Video berhasil dihapus!");
    } catch {
      toast.error("Gagal menghapus video");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Video Manager</h1>
        <p className="text-muted-foreground">
          Upload dan kelola video untuk live streaming
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Video</CardTitle>
            <FileVideo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{videos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Penggunaan Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(totalStorage)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Durasi</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(videos.reduce((acc, v) => acc + (v.duration_seconds || 0), 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari video..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Video
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Video</DialogTitle>
              <DialogDescription>
                Upload video untuk digunakan dalam live streaming
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>File Video</Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Judul video"
                  disabled={isUploading}
                />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi (Opsional)</Label>
                <Textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Deskripsi video"
                  disabled={isUploading}
                />
              </div>
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Videos Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Video</CardTitle>
          <CardDescription>
            Semua video yang sudah diupload
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Video</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Ukuran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Upload</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVideos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <VideoIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Belum ada video</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredVideos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-20 bg-muted rounded flex items-center justify-center">
                          <VideoIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{video.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {video.description || video.original_filename}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {video.duration_seconds
                        ? formatDuration(video.duration_seconds)
                        : "-"}
                    </TableCell>
                    <TableCell>{formatFileSize(video.file_size)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          video.status === "ready"
                            ? "default"
                            : video.status === "processing"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {video.status === "ready"
                          ? "Siap"
                          : video.status === "processing"
                          ? "Memproses"
                          : "Error"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(video.created_at).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(video)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(video)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
            <DialogDescription>
              Update informasi video
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Judul</Label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <Button onClick={handleSaveEdit} className="w-full">
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Videos;
