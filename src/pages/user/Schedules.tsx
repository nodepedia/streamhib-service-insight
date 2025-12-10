import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Calendar, 
  Clock, 
  Plus, 
  MoreHorizontal, 
  Trash2, 
  Edit,
  Youtube,
  Facebook,
  Play,
  Pause,
  CalendarDays,
  Repeat,
  CalendarClock,
  Video,
  ListVideo
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';

interface Schedule {
  id: string;
  name: string;
  schedule_type: 'once' | 'daily' | 'weekly';
  scheduled_at?: string;
  schedule_time?: string;
  days_of_week?: string;
  video_source: 'video' | 'playlist';
  platform: 'youtube' | 'facebook' | 'twitch' | 'custom';
  quality: string;
  is_active: boolean;
  next_run_at?: string;
  last_run_at?: string;
  run_count: number;
}

// Mock data for videos and playlists
const mockVideos = [
  { id: 'v1', title: 'Tutorial React Dasar - Part 1' },
  { id: 'v2', title: 'Tutorial React Dasar - Part 2' },
  { id: 'v3', title: 'Belajar TypeScript untuk Pemula' },
];

const mockPlaylists = [
  { id: 'p1', title: 'Tutorial React Complete', videoCount: 12 },
  { id: 'p2', title: 'Belajar Web Development', videoCount: 25 },
];

const DAYS_OF_WEEK = [
  { value: '0', label: 'Min' },
  { value: '1', label: 'Sen' },
  { value: '2', label: 'Sel' },
  { value: '3', label: 'Rab' },
  { value: '4', label: 'Kam' },
  { value: '5', label: 'Jum' },
  { value: '6', label: 'Sab' },
];

const scheduleSchema = z.object({
  name: z.string().min(1, 'Nama jadwal harus diisi').max(255),
  schedule_type: z.enum(['once', 'daily', 'weekly']),
  scheduled_date: z.string().optional(),
  scheduled_time: z.string().optional(),
  schedule_time: z.string().optional(),
  days_of_week: z.array(z.string()).optional(),
  video_source: z.enum(['video', 'playlist']),
  video_id: z.string().optional(),
  playlist_id: z.string().optional(),
  playback_mode: z.enum(['loop', 'sequential', 'random']),
  platform: z.enum(['youtube', 'facebook']),
  stream_key: z.string().min(10, 'Stream key tidak valid'),
  quality: z.enum(['720p', '1080p', '4k']),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

const Schedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      name: '',
      schedule_type: 'once',
      video_source: 'video',
      playback_mode: 'loop',
      platform: 'youtube',
      quality: '1080p',
      days_of_week: [],
    },
  });

  const scheduleType = form.watch('schedule_type');
  const videoSource = form.watch('video_source');

  const fetchSchedules = async () => {
    try {
      // In production, use api.getSchedules()
      // For now, use mock data
      setSchedules([
        {
          id: '1',
          name: 'Morning Show Daily',
          schedule_type: 'daily',
          schedule_time: '08:00',
          video_source: 'playlist',
          platform: 'youtube',
          quality: '1080p',
          is_active: true,
          next_run_at: new Date(Date.now() + 3600000).toISOString(),
          run_count: 15,
        },
        {
          id: '2',
          name: 'Weekend Gaming',
          schedule_type: 'weekly',
          schedule_time: '20:00',
          days_of_week: '5,6',
          video_source: 'video',
          platform: 'youtube',
          quality: '1080p',
          is_active: true,
          next_run_at: new Date(Date.now() + 86400000).toISOString(),
          run_count: 8,
        },
        {
          id: '3',
          name: 'Special Event',
          schedule_type: 'once',
          scheduled_at: new Date(Date.now() + 172800000).toISOString(),
          video_source: 'playlist',
          platform: 'facebook',
          quality: '720p',
          is_active: false,
          run_count: 0,
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      // Build scheduled_at for one-time schedules
      let scheduled_at: string | undefined;
      if (data.schedule_type === 'once' && data.scheduled_date && data.scheduled_time) {
        scheduled_at = new Date(`${data.scheduled_date}T${data.scheduled_time}`).toISOString();
      }

      // Build days_of_week for weekly schedules
      const days_of_week = data.days_of_week?.join(',');

      // In production, use api.createSchedule()
      const newSchedule: Schedule = {
        id: Date.now().toString(),
        name: data.name,
        schedule_type: data.schedule_type,
        scheduled_at,
        schedule_time: data.schedule_time,
        days_of_week,
        video_source: data.video_source,
        platform: data.platform,
        quality: data.quality,
        is_active: true,
        next_run_at: scheduled_at || new Date().toISOString(),
        run_count: 0,
      };

      setSchedules(prev => [newSchedule, ...prev]);
      toast.success('Jadwal berhasil dibuat!');
      setDialogOpen(false);
      form.reset();
    } catch (error) {
      toast.error('Gagal membuat jadwal');
    }
  };

  const handleToggle = async (id: string) => {
    setSchedules(prev =>
      prev.map(s => (s.id === id ? { ...s, is_active: !s.is_active } : s))
    );
    toast.success('Status jadwal diperbarui');
  };

  const handleDelete = async (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast.success('Jadwal berhasil dihapus');
  };

  const getScheduleTypeIcon = (type: string) => {
    switch (type) {
      case 'once': return <CalendarClock className="h-4 w-4" />;
      case 'daily': return <Repeat className="h-4 w-4" />;
      case 'weekly': return <CalendarDays className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getScheduleTypeLabel = (type: string) => {
    switch (type) {
      case 'once': return 'Sekali';
      case 'daily': return 'Harian';
      case 'weekly': return 'Mingguan';
      default: return type;
    }
  };

  const formatDaysOfWeek = (days?: string) => {
    if (!days) return '-';
    return days.split(',').map(d => DAYS_OF_WEEK.find(day => day.value === d)?.label).join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jadwal Streaming</h1>
          <p className="text-muted-foreground">
            Atur jadwal otomatis untuk live streaming
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Buat Jadwal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Buat Jadwal Streaming</DialogTitle>
              <DialogDescription>
                Atur jadwal untuk streaming otomatis
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Jadwal</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Morning Show" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Schedule Type */}
                <FormField
                  control={form.control}
                  name="schedule_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Jadwal</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          <div>
                            <RadioGroupItem value="once" id="once" className="peer sr-only" />
                            <Label
                              htmlFor="once"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent peer-data-[state=checked]:border-primary cursor-pointer"
                            >
                              <CalendarClock className="mb-2 h-5 w-5" />
                              <span className="text-sm font-medium">Sekali Jalan</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="daily" id="daily" className="peer sr-only" />
                            <Label
                              htmlFor="daily"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent peer-data-[state=checked]:border-primary cursor-pointer"
                            >
                              <Repeat className="mb-2 h-5 w-5" />
                              <span className="text-sm font-medium">Harian</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="weekly" id="weekly" className="peer sr-only" />
                            <Label
                              htmlFor="weekly"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent peer-data-[state=checked]:border-primary cursor-pointer"
                            >
                              <CalendarDays className="mb-2 h-5 w-5" />
                              <span className="text-sm font-medium">Mingguan</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* One-time schedule fields */}
                {scheduleType === 'once' && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="scheduled_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tanggal</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="scheduled_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Waktu</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Daily/Weekly time field */}
                {(scheduleType === 'daily' || scheduleType === 'weekly') && (
                  <FormField
                    control={form.control}
                    name="schedule_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Waktu Streaming</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormDescription>
                          Streaming akan dimulai setiap hari pada waktu ini
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Weekly days selection */}
                {scheduleType === 'weekly' && (
                  <FormField
                    control={form.control}
                    name="days_of_week"
                    render={() => (
                      <FormItem>
                        <FormLabel>Hari Streaming</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {DAYS_OF_WEEK.map((day) => (
                            <FormField
                              key={day.value}
                              control={form.control}
                              name="days_of_week"
                              render={({ field }) => (
                                <FormItem key={day.value}>
                                  <FormControl>
                                    <div className="flex items-center gap-2">
                                      <Checkbox
                                        checked={field.value?.includes(day.value)}
                                        onCheckedChange={(checked) => {
                                          const current = field.value || [];
                                          if (checked) {
                                            field.onChange([...current, day.value]);
                                          } else {
                                            field.onChange(current.filter(v => v !== day.value));
                                          }
                                        }}
                                      />
                                      <Label className="text-sm">{day.label}</Label>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Video Source */}
                <FormField
                  control={form.control}
                  name="video_source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sumber Video</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div>
                            <RadioGroupItem value="video" id="src-video" className="peer sr-only" />
                            <Label
                              htmlFor="src-video"
                              className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-transparent p-3 hover:bg-accent peer-data-[state=checked]:border-primary cursor-pointer"
                            >
                              <Video className="h-4 w-4" />
                              <span className="text-sm">Video</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="playlist" id="src-playlist" className="peer sr-only" />
                            <Label
                              htmlFor="src-playlist"
                              className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-transparent p-3 hover:bg-accent peer-data-[state=checked]:border-primary cursor-pointer"
                            >
                              <ListVideo className="h-4 w-4" />
                              <span className="text-sm">Playlist</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Video/Playlist Selection */}
                {videoSource === 'video' && (
                  <FormField
                    control={form.control}
                    name="video_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pilih Video</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih video" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockVideos.map((video) => (
                              <SelectItem key={video.id} value={video.id}>
                                {video.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {videoSource === 'playlist' && (
                  <FormField
                    control={form.control}
                    name="playlist_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pilih Playlist</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih playlist" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockPlaylists.map((playlist) => (
                              <SelectItem key={playlist.id} value={playlist.id}>
                                {playlist.title} ({playlist.videoCount} video)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Playback Mode */}
                <FormField
                  control={form.control}
                  name="playback_mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mode Pemutaran</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="loop">Loop 1 Video</SelectItem>
                          <SelectItem value="sequential">Playlist Urut</SelectItem>
                          <SelectItem value="random">Playlist Acak</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Platform & Stream Key */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="youtube">
                              <div className="flex items-center gap-2">
                                <Youtube className="h-4 w-4 text-red-500" />
                                YouTube
                              </div>
                            </SelectItem>
                            <SelectItem value="facebook">
                              <div className="flex items-center gap-2">
                                <Facebook className="h-4 w-4 text-blue-500" />
                                Facebook
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kualitas</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="720p">720p</SelectItem>
                            <SelectItem value="1080p">1080p (HD)</SelectItem>
                            <SelectItem value="4k">4K (Ultra HD)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="stream_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stream Key</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Masukkan stream key" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Buat Jadwal
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Schedules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Jadwal</CardTitle>
          <CardDescription>
            Semua jadwal streaming yang telah dibuat
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Belum ada jadwal</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dijalankan</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getScheduleTypeIcon(schedule.schedule_type)}
                        <span>{getScheduleTypeLabel(schedule.schedule_type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {schedule.schedule_type === 'once' ? (
                        schedule.scheduled_at ? new Date(schedule.scheduled_at).toLocaleString('id-ID') : '-'
                      ) : (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {schedule.schedule_time || '-'}
                          {schedule.schedule_type === 'weekly' && (
                            <span className="text-xs text-muted-foreground ml-1">
                              ({formatDaysOfWeek(schedule.days_of_week)})
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {schedule.platform === 'youtube' ? (
                          <Youtube className="h-4 w-4 text-red-500" />
                        ) : (
                          <Facebook className="h-4 w-4 text-blue-500" />
                        )}
                        <span className="capitalize">{schedule.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={schedule.is_active}
                        onCheckedChange={() => handleToggle(schedule.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{schedule.run_count}x</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(schedule.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
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

export default Schedules;
