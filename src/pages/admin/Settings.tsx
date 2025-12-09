import { Save, Bell, Shield, Database, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Konfigurasi sistem dan preferensi
          </p>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground">
          <Save className="h-4 w-4 mr-2" />
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Pengaturan Umum
            </CardTitle>
            <CardDescription>
              Konfigurasi dasar aplikasi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">Nama Aplikasi</Label>
              <Input id="app-name" defaultValue="InfinityStream" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="app-url">URL Aplikasi</Label>
              <Input id="app-url" defaultValue="https://infinitystream.id" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Email Support</Label>
              <Input id="support-email" type="email" defaultValue="support@infinitystream.id" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifikasi
            </CardTitle>
            <CardDescription>
              Atur preferensi notifikasi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifikasi Email</Label>
                <p className="text-sm text-muted-foreground">Terima update via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Alert Stream Down</Label>
                <p className="text-sm text-muted-foreground">Notifikasi saat stream error</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>User Signup Alert</Label>
                <p className="text-sm text-muted-foreground">Notifikasi user baru</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Keamanan
            </CardTitle>
            <CardDescription>
              Pengaturan keamanan sistem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Auth</Label>
                <p className="text-sm text-muted-foreground">Aktifkan 2FA untuk admin</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Rate Limiting</Label>
                <p className="text-sm text-muted-foreground">Batasi request API</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (menit)</Label>
              <Input id="session-timeout" type="number" defaultValue="60" />
            </div>
          </CardContent>
        </Card>

        {/* SMTP Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email SMTP
            </CardTitle>
            <CardDescription>
              Konfigurasi pengiriman email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" placeholder="smtp.example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-port">Port</Label>
                <Input id="smtp-port" placeholder="587" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-secure">Encryption</Label>
                <Input id="smtp-secure" placeholder="TLS" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-user">Username</Label>
              <Input id="smtp-user" placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-pass">Password</Label>
              <Input id="smtp-pass" type="password" placeholder="••••••••" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
