import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto">
        <div className="relative bg-gradient-to-br from-foreground to-foreground/90 rounded-3xl p-10 md:p-16 text-center overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)`,
              backgroundSize: '32px 32px'
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Mulai Hari Ini</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-background mb-6 tracking-tight">
              Siap Streaming 24/7 Tanpa Ribet?
            </h2>

            <p className="text-lg text-background/70 mb-10 leading-relaxed">
              Bergabung dengan 1,000+ kreator yang sudah mengoptimalkan channel mereka 
              dengan LiveForge. Coba gratis selama 7 hari.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button size="xl" className="bg-background text-foreground hover:bg-background/90 shadow-strong group">
                Mulai 7 Hari Gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" className="border-background/30 text-background hover:bg-background/10 hover:border-background/50">
                Jadwalkan Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-background/60">
              <span>✓ Trial 7 hari gratis</span>
              <span>✓ Tanpa kartu kredit</span>
              <span>✓ Batal kapan saja</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
