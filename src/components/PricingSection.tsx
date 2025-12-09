import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Building } from "lucide-react";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: "99K",
    period: "/bulan",
    description: "Cocok untuk pemula yang mau coba",
    features: [
      "1 Channel streaming",
      "Upload hingga 5 video",
      "720p Quality",
      "8 jam/hari live",
      "Dashboard dasar",
      "Email support",
    ],
    cta: "Mulai Gratis",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    icon: Crown,
    price: "249K",
    period: "/bulan",
    description: "Paling populer untuk kreator serius",
    features: [
      "3 Channel streaming",
      "Upload hingga 20 video",
      "1080p Quality",
      "24/7 non-stop live",
      "Jadwal otomatis",
      "Analytics lengkap",
      "Priority support",
      "Custom branding",
    ],
    cta: "Pilih Pro",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Business",
    icon: Building,
    price: "599K",
    period: "/bulan",
    description: "Untuk bisnis dan agensi",
    features: [
      "10 Channel streaming",
      "Unlimited video",
      "4K Quality",
      "24/7 non-stop live",
      "Multi-platform (YT + FB)",
      "API Access",
      "White label option",
      "Dedicated support",
      "Custom integration",
    ],
    cta: "Hubungi Sales",
    variant: "outline" as const,
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="harga" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pilih Paket yang <span className="gradient-text">Pas</span> Buat Kamu
          </h2>
          <p className="text-lg text-muted-foreground">
            Mulai gratis, upgrade kapan saja. Tidak ada hidden fee atau biaya tersembunyi.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-2xl p-8 border-2 transition-all duration-300 hover-lift ${
                plan.popular
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-bg text-primary-foreground text-sm font-semibold">
                  Paling Populer
                </div>
              )}

              {/* Icon & Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  plan.popular ? "gradient-bg" : "bg-secondary"
                }`}>
                  <plan.icon className={`w-5 h-5 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`} />
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-bold">Rp {plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6">{plan.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? "text-primary" : "text-success"}`} />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button variant={plan.variant} size="lg" className="w-full">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            🔒 <strong>Garansi 7 hari uang kembali</strong> — Tidak puas? Kami kembalikan 100% uang kamu.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
