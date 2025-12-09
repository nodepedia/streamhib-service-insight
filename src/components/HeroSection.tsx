import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Shield, Clock, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-[100px]" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />
      </div>

      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Cloud Streaming Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6 animate-in-delay-1">
              Streaming 24/7
              <br />
              <span className="text-gradient">Tanpa Batas.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 animate-in-delay-2">
              Platform cloud streaming yang memungkinkan Anda siaran langsung ke YouTube & Facebook 
              sepanjang waktu — tanpa perangkat keras, tanpa maintenance.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 animate-in-delay-3">
              <Button variant="gradient" size="xl" className="group">
                Mulai 7 Hari Gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                <Play className="w-4 h-4" />
                Lihat Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground animate-in-delay-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
                <span>Uptime 99.9%</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-success" />
                <span>Setup 5 menit</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-success" />
                <span>Tanpa kartu kredit</span>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative animate-float">
            {/* Glow */}
            <div className="absolute inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
            
            {/* Main Card */}
            <div className="relative card-glass p-6 rounded-3xl shadow-strong">
              {/* Window Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/80" />
                  <div className="w-3 h-3 rounded-full bg-warning/80" />
                  <div className="w-3 h-3 rounded-full bg-success/80" />
                </div>
                <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-success/15 text-success border border-success/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-soft" />
                  LIVE
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-secondary/50 rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Durasi Siaran</p>
                  <p className="text-2xl font-bold font-mono text-gradient">142:38:05</p>
                </div>
                <div className="bg-secondary/50 rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Total Penonton</p>
                  <p className="text-2xl font-bold font-mono">18,429</p>
                </div>
              </div>

              {/* Channel Info */}
              <div className="bg-secondary/50 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Channel Aktif</span>
                  <span className="text-xs px-2 py-1 rounded-lg bg-primary/15 text-primary font-medium">3/5</span>
                </div>
                <div className="space-y-2">
                  {["YouTube - Relaxing Music 24/7", "Facebook - Lo-Fi Beats"].map((channel, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      <span className="text-muted-foreground truncate">{channel}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="gradient" size="sm" className="w-full">
                  <Play className="w-4 h-4" />
                  Kelola Siaran
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Analitik
                </Button>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-card border border-border shadow-medium text-sm font-medium">
              ⚡ Berbasis Cloud
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
