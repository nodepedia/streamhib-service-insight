import { Button } from "@/components/ui/button";
import { Play, Rocket, Users, Star, CheckCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Bikin Live jadi CUAN</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-slide-up">
              Live YouTube 24/7{" "}
              <span className="gradient-text">Tanpa Komputer</span>
              <br />
              <span className="text-muted-foreground text-3xl md:text-4xl lg:text-5xl">
                — Juga Bisa Live Facebook!
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Bosan komputer overheat? HP cepat rusak? Internet sering putus?{" "}
              <strong className="text-foreground">StreamHub solusinya!</strong> Upload video sekali, 
              live streaming jalan terus dari server kami. Bahkan saat kamu tidur.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Button variant="hero" size="xl" className="group">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Coba Gratis
              </Button>
              <Button variant="hero-secondary" size="xl">
                <Rocket className="w-5 h-5" />
                Mulai Live Hari Ini
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background gradient-bg flex items-center justify-center text-primary-foreground text-xs font-bold"
                    style={{ backgroundColor: `hsl(${280 + i * 20}, 70%, 60%)` }}
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">100+</span>
                  <span className="text-muted-foreground">Channel Aktif</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                  <span className="font-semibold ml-1">4.9/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative animate-float">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 gradient-bg rounded-2xl blur-2xl opacity-20" />
              
              {/* Dashboard Card */}
              <div className="relative glass rounded-2xl p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-success" />
                  </div>
                  <div className="text-xs font-medium px-3 py-1 rounded-full bg-success/20 text-success flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    24/7 Online
                  </div>
                </div>

                {/* Title */}
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Simulasi StreamHub Dashboard</p>
                </div>

                {/* Status Card */}
                <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Status Live Streaming</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-success/20 text-success flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      LIVE 24/7
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Durasi Live</span>
                      <span className="font-mono font-semibold text-primary">168:45:12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Viewers</span>
                      <span className="font-mono font-semibold text-primary">12,847</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Server Status</span>
                      <span className="font-mono font-semibold text-success">99.9% Uptime</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="hero" size="sm" className="w-full">
                    <Play className="w-4 h-4" />
                    Start Live
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    📅 Set Jadwal
                  </Button>
                </div>

                {/* Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-secondary border border-border text-xs font-medium">
                  🌐 Web-Based
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
