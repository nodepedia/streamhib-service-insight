import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 gradient-bg opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="relative bg-card border border-border rounded-3xl p-8 md:p-16 text-center overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 gradient-bg opacity-10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-48 h-48 gradient-bg opacity-10 rounded-full blur-2xl" />

          {/* Content */}
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Siap Mulai <span className="gradient-text">Live Streaming</span> 24/7?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Bergabung dengan 100+ kreator yang sudah merasakan kemudahan StreamHub. 
              Coba gratis 7 hari, tanpa kartu kredit!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" className="group">
                <Play className="w-5 h-5" />
                Mulai Gratis Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                Jadwalkan Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                Free trial 7 hari
              </div>
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                Tanpa kartu kredit
              </div>
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                Cancel kapan saja
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
