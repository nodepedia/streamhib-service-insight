import { Server, Globe, Shield, Calendar, Headphones, Gauge } from "lucide-react";

const features = [
  {
    icon: Server,
    title: "Infrastruktur Cloud",
    description: "Server enterprise-grade menangani siaran Anda. Tidak perlu komputer atau perangkat yang terus menyala.",
    color: "primary",
  },
  {
    icon: Globe,
    title: "Multi-Platform",
    description: "Siaran simultan ke YouTube dan Facebook dari satu dashboard terpusat yang mudah digunakan.",
    color: "accent",
  },
  {
    icon: Shield,
    title: "Keandalan Tinggi",
    description: "Uptime 99.9% dengan failover otomatis. Siaran Anda tetap berjalan bahkan saat terjadi gangguan.",
    color: "success",
  },
  {
    icon: Calendar,
    title: "Penjadwalan Cerdas",
    description: "Atur jadwal siaran untuk minggu atau bulan ke depan. Sistem berjalan otomatis sesuai jadwal.",
    color: "warning",
  },
  {
    icon: Headphones,
    title: "Konten Ambient",
    description: "Ideal untuk musik lo-fi, ASMR, atau suara alam. Video loop otomatis selama siaran berlangsung.",
    color: "primary",
  },
  {
    icon: Gauge,
    title: "Analitik Real-time",
    description: "Pantau performa siaran dengan metrik langsung: viewer, durasi, engagement, dan lainnya.",
    color: "accent",
  },
];

const colorClasses = {
  primary: "bg-primary/10 text-primary border-primary/20",
  accent: "bg-accent/10 text-accent border-accent/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-secondary/40" />

      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">Fitur Unggulan</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Semua yang Anda Butuhkan untuk <span className="text-gradient">Siaran Profesional</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Teknologi streaming terdepan dalam platform yang sederhana dan mudah digunakan.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-elevated p-6 group"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${colorClasses[feature.color as keyof typeof colorClasses]} transition-transform group-hover:scale-110`}>
                <feature.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
