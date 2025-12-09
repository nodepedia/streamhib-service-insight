import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Budi Santoso",
    role: "YouTube Creator",
    avatar: "BS",
    rating: 5,
    content: "Dulu laptop saya overheat terus kalau live streaming lama. Sekarang pakai StreamHub, laptop bisa istirahat, live tetap jalan 24 jam. Revenue naik 3x lipat!",
  },
  {
    name: "Siti Rahayu",
    role: "ASMR Creator",
    avatar: "SR",
    rating: 5,
    content: "Konten ASMR saya butuh live non-stop. StreamHub solusi perfect! Upload sekali, streaming terus. Viewers dari seluruh dunia bisa nikmatin kapan saja.",
  },
  {
    name: "Andi Wijaya",
    role: "Music Channel Owner",
    avatar: "AW",
    rating: 5,
    content: "Channel musik lo-fi saya sekarang live 24/7. Dulu harus gantian jaga, sekarang tinggal set jadwal dan tidur nyenyak. Best investment ever!",
  },
  {
    name: "Dewi Lestari",
    role: "Podcast Host",
    avatar: "DL",
    rating: 5,
    content: "Awalnya ragu, tapi setelah coba free trial langsung jatuh cinta. Setup gampang banget, support-nya juga responsif. Highly recommended!",
  },
  {
    name: "Reza Pratama",
    role: "Gaming Streamer",
    avatar: "RP",
    rating: 5,
    content: "Sekarang bisa multi-platform YouTube dan Facebook sekaligus. Audience makin luas, income meningkat drastis. Terima kasih StreamHub!",
  },
  {
    name: "Maya Kusuma",
    role: "Meditation Channel",
    avatar: "MK",
    rating: 5,
    content: "Channel meditasi butuh suasana tenang 24/7. StreamHub bikin saya bisa fokus buat konten berkualitas tanpa khawatir server down.",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimoni" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-secondary/30" />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Apa Kata <span className="gradient-text">Mereka</span>?
          </h2>
          <p className="text-lg text-muted-foreground">
            Ribuan kreator sudah merasakan manfaatnya. Ini cerita sukses mereka.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover-lift"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-primary/20 absolute top-6 right-6" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 relative z-10">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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
