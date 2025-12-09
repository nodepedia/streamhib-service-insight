import { Server, Smartphone, Shield, Clock, Music, Zap } from "lucide-react";

const features = [
  {
    icon: Server,
    title: "Server kami yang streaming",
    description: "Komputer kamu bisa dimatikan, HP bisa dicharge. Live streaming tetap jalan 24/7 dari server kami yang powerful.",
  },
  {
    icon: Smartphone,
    title: "Kontrol dari HP/laptop",
    description: "Cukup buka browser, login dashboard. Mau di warung kopi atau di rumah, kamu bisa monitor dan kontrol live streaming.",
  },
  {
    icon: Shield,
    title: "Dijamin gak pernah mati",
    description: "Server kami monitoring 24/7 dengan backup otomatis. Uptime 99.9% - live streaming kamu aman dan stabil terus.",
  },
  {
    icon: Clock,
    title: "Jadwal otomatis",
    description: "Mau live jam 8 pagi sampai 10 malam setiap hari? Tinggal set jadwal sekali, sistem otomatis handle semuanya.",
  },
  {
    icon: Music,
    title: "Perfect untuk ASMR & musik",
    description: "Upload 1 video musik relaksasi atau ASMR, akan loop terus selama live aktif. Cocok banget untuk konten ambient.",
  },
  {
    icon: Zap,
    title: "Setup dalam 5 menit",
    description: "Tidak perlu skill teknis. Upload video, masukkan stream key YouTube/Facebook, klik Start. Selesai!",
  },
];

const FeaturesSection = () => {
  return (
    <section id="fitur" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-secondary/30" />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Kenapa Harus <span className="gradient-text">StreamHub</span>?
          </h2>
          <p className="text-lg text-muted-foreground">
            Karena Kita yang Repot, Kamu Tinggal Santai. Udah capek komputer overheat? 
            StreamHub hadir buat ngatasin semua masalah itu.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
