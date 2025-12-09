import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Andi Pratama",
    role: "Founder, LoFi Indonesia",
    avatar: "AP",
    content: "Sebelum pakai LiveForge, laptop saya harus nyala 24 jam. Sekarang? Tidur nyenyak, channel tetap live. Revenue naik 200% dalam 3 bulan.",
    rating: 5,
  },
  {
    name: "Sari Dewi",
    role: "Content Creator",
    avatar: "SD",
    content: "Setup-nya literally 5 menit. Upload video, masukkan stream key, done. Yang paling saya suka adalah dashboard analitiknya yang sangat informatif.",
    rating: 5,
  },
  {
    name: "Rizky Hidayat",
    role: "Digital Agency Owner",
    avatar: "RH",
    content: "Kami manage 15 channel klien dengan LiveForge. White label feature-nya memudahkan kami memberikan layanan profesional kepada klien.",
    rating: 5,
  },
  {
    name: "Maya Putri",
    role: "ASMR Creator",
    avatar: "MP",
    content: "Konten ASMR butuh konsistensi. LiveForge memastikan channel saya selalu aktif. Subscriber organik terus bertambah setiap hari.",
    rating: 5,
  },
  {
    name: "Budi Santoso",
    role: "Music Producer",
    avatar: "BS",
    content: "Kualitas streaming 1080p-nya luar biasa jernih. Tidak ada buffering atau lag. Sangat profesional untuk channel musik saya.",
    rating: 5,
  },
  {
    name: "Lina Kusuma",
    role: "Podcast Host",
    avatar: "LK",
    content: "Support team-nya responsif banget. Ada masalah jam 2 pagi, langsung dibantu. Ini yang membedakan LiveForge dari kompetitor.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-secondary/40" />

      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">Testimoni</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Dipercaya oleh <span className="text-gradient">Ribuan Kreator</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Lihat bagaimana LiveForge membantu mereka mengembangkan channel.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card-elevated p-6"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
