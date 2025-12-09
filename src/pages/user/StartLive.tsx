import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlayCircle, Loader2, Youtube, Facebook, Video, ListVideo, Repeat, Shuffle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const startLiveSchema = z.object({
  sessionName: z.string()
    .min(3, 'Nama sesi minimal 3 karakter')
    .max(100, 'Nama sesi maksimal 100 karakter'),
  liveSource: z.enum(['video', 'playlist'], {
    required_error: 'Pilih sumber live'
  }),
  playbackMode: z.enum(['loop', 'sequential', 'random'], {
    required_error: 'Pilih mode pemutaran'
  }),
  selectedVideo: z.string().optional(),
  selectedPlaylist: z.string().optional(),
  streamKey: z.string()
    .min(10, 'Stream key tidak valid')
    .max(100, 'Stream key terlalu panjang'),
  platform: z.enum(['youtube', 'facebook'], {
    required_error: 'Pilih platform'
  })
}).refine((data) => {
  if (data.liveSource === 'video' && !data.selectedVideo) {
    return false;
  }
  if (data.liveSource === 'playlist' && !data.selectedPlaylist) {
    return false;
  }
  return true;
}, {
  message: 'Pilih video atau playlist',
  path: ['selectedVideo']
});

type StartLiveFormData = z.infer<typeof startLiveSchema>;

// Mock data
const mockVideos = [
  { id: 'v1', title: 'Tutorial React Dasar - Part 1', duration: '15:30' },
  { id: 'v2', title: 'Tutorial React Dasar - Part 2', duration: '22:45' },
  { id: 'v3', title: 'Belajar TypeScript untuk Pemula', duration: '45:00' },
  { id: 'v4', title: 'Next.js 14 Crash Course', duration: '1:30:00' },
];

const mockPlaylists = [
  { id: 'p1', title: 'Tutorial React Complete', videoCount: 12 },
  { id: 'p2', title: 'Belajar Web Development', videoCount: 25 },
  { id: 'p3', title: 'JavaScript Tips & Tricks', videoCount: 8 },
];

const StartLive = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<StartLiveFormData>({
    resolver: zodResolver(startLiveSchema),
    defaultValues: {
      sessionName: '',
      liveSource: undefined,
      playbackMode: undefined,
      selectedVideo: '',
      selectedPlaylist: '',
      streamKey: '',
      platform: undefined
    }
  });

  const liveSource = form.watch('liveSource');

  const onSubmit = async (data: StartLiveFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    
    toast({
      title: 'Sesi Live Dimulai!',
      description: `"${data.sessionName}" sedang streaming ke ${data.platform === 'youtube' ? 'YouTube' : 'Facebook'}.`
    });

    form.reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mulai Sesi Live</h1>
        <p className="text-muted-foreground">Konfigurasi dan mulai streaming video Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Konfigurasi Streaming
          </CardTitle>
          <CardDescription>
            Isi semua field untuk memulai sesi live streaming
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Session Name */}
              <FormField
                control={form.control}
                name="sessionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Sesi</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Morning Show Episode 1" {...field} />
                    </FormControl>
                    <FormDescription>Nama untuk mengidentifikasi sesi streaming ini</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Live Source */}
              <FormField
                control={form.control}
                name="liveSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sumber Live</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div>
                          <RadioGroupItem value="video" id="video" className="peer sr-only" />
                          <Label
                            htmlFor="video"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <Video className="mb-3 h-6 w-6" />
                            <span className="text-sm font-medium">Pilih Video Manual</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="playlist" id="playlist" className="peer sr-only" />
                          <Label
                            htmlFor="playlist"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <ListVideo className="mb-3 h-6 w-6" />
                            <span className="text-sm font-medium">Gunakan Playlist</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Playback Mode */}
              <FormField
                control={form.control}
                name="playbackMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode Pemutaran</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-3 gap-4"
                      >
                        <div>
                          <RadioGroupItem value="loop" id="loop" className="peer sr-only" />
                          <Label
                            htmlFor="loop"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <Repeat className="mb-2 h-5 w-5" />
                            <span className="text-xs font-medium text-center">Loop 1 Video</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="sequential" id="sequential" className="peer sr-only" />
                          <Label
                            htmlFor="sequential"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <ArrowRight className="mb-2 h-5 w-5" />
                            <span className="text-xs font-medium text-center">Playlist Urut</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="random" id="random" className="peer sr-only" />
                          <Label
                            htmlFor="random"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <Shuffle className="mb-2 h-5 w-5" />
                            <span className="text-xs font-medium text-center">Playlist Acak</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Video Selection */}
              {liveSource === 'video' && (
                <FormField
                  control={form.control}
                  name="selectedVideo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pilih Video</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih video untuk streaming" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockVideos.map((video) => (
                            <SelectItem key={video.id} value={video.id}>
                              <div className="flex items-center justify-between gap-4">
                                <span>{video.title}</span>
                                <span className="text-xs text-muted-foreground">{video.duration}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Playlist Selection */}
              {liveSource === 'playlist' && (
                <FormField
                  control={form.control}
                  name="selectedPlaylist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pilih Playlist</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih playlist untuk streaming" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockPlaylists.map((playlist) => (
                            <SelectItem key={playlist.id} value={playlist.id}>
                              <div className="flex items-center justify-between gap-4">
                                <span>{playlist.title}</span>
                                <span className="text-xs text-muted-foreground">{playlist.videoCount} video</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Stream Key */}
              <FormField
                control={form.control}
                name="streamKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stream Key</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Masukkan stream key dari platform" 
                        type="password"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Dapatkan stream key dari YouTube Studio atau Facebook Live Producer
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Platform */}
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div>
                          <RadioGroupItem value="youtube" id="youtube" className="peer sr-only" />
                          <Label
                            htmlFor="youtube"
                            className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <Youtube className="h-5 w-5 text-red-500" />
                            <span className="font-medium">YouTube</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="facebook" id="facebook" className="peer sr-only" />
                          <Label
                            htmlFor="facebook"
                            className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <Facebook className="h-5 w-5 text-blue-500" />
                            <span className="font-medium">Facebook</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memulai Streaming...
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Mulai Live Streaming
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartLive;
