import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Key, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const apiKeySchema = z.object({
  apiKey: z.string()
    .min(30, 'API Key tidak valid')
    .max(100, 'API Key terlalu panjang')
    .regex(/^AIza/, 'API Key harus dimulai dengan "AIza"')
});

type ApiKeyFormData = z.infer<typeof apiKeySchema>;

const YouTubeAPI = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: { apiKey: '' }
  });

  const onSubmit = async (data: ApiKeyFormData) => {
    setIsLoading(true);
    
    // Simulate API validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation - in real app, validate with backend
    setSavedApiKey(data.apiKey);
    setIsConnected(true);
    setIsLoading(false);
    
    toast({
      title: 'API Key tersimpan',
      description: 'YouTube API Key berhasil diverifikasi dan disimpan.'
    });
  };

  const handleDisconnect = () => {
    setSavedApiKey(null);
    setIsConnected(false);
    form.reset();
    toast({
      title: 'API Key dihapus',
      description: 'YouTube API Key telah dihapus dari akun Anda.'
    });
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.slice(0, 4) + '•'.repeat(key.length - 8) + key.slice(-4);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">YouTube API</h1>
        <p className="text-muted-foreground">Hubungkan akun YouTube Anda untuk streaming</p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Status Koneksi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">
                YouTube API terhubung. API Key: {maskApiKey(savedApiKey || '')}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                YouTube API belum terhubung. Masukkan API Key untuk mengaktifkan fitur streaming.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* API Key Form */}
      <Card>
        <CardHeader>
          <CardTitle>{isConnected ? 'Update API Key' : 'Tambah API Key'}</CardTitle>
          <CardDescription>
            Masukkan YouTube Data API v3 Key Anda. Anda bisa mendapatkannya dari{' '}
            <a 
              href="https://console.cloud.google.com/apis/credentials" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Cloud Console
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube API Key</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="AIzaSy..." 
                          type={showApiKey ? 'text' : 'password'}
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      API Key akan dienkripsi dan disimpan dengan aman.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isConnected ? 'Update API Key' : 'Simpan API Key'}
                </Button>
                
                {isConnected && (
                  <Button type="button" variant="destructive" onClick={handleDisconnect}>
                    Hapus API Key
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Mendapatkan YouTube API Key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Buka <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a></li>
            <li>Buat project baru atau pilih project yang sudah ada</li>
            <li>Aktifkan YouTube Data API v3 dari Library</li>
            <li>Buka menu Credentials dan klik "Create Credentials"</li>
            <li>Pilih "API Key" dan salin key yang dihasilkan</li>
            <li>Tempelkan API Key di form di atas</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubeAPI;
