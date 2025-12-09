import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Building2 } from "lucide-react";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: "149",
    period: "/bulan",
    description: "Untuk kreator yang baru memulai",
    features: [
      "1 Channel streaming",
      "10 video library",
      "Kualitas 720p",
      "12 jam siaran/hari",
      "Dashboard standar",
      "Email support",
    ],
    cta: "Mulai Gratis",
    variant: "outline" as const,
    highlight: false,
  },
  {
    name: "Professional",
    icon: Crown,
    price: "349",
    period: "/bulan",
    description: "Untuk kreator serius dan bisnis kecil",
    features: [
      "5 Channel streaming",
      "50 video library",
      "Kualitas 1080p Full HD",
      "Siaran 24/7 non-stop",
      "Penjadwalan otomatis",
      "Analitik lengkap",
      "Priority support 24/7",
      "Custom branding",
    ],
    cta: "Pilih Professional",
    variant: "gradient" as const,
    highlight: true,
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "",
    description: "Untuk agensi dan perusahaan besar",
    features: [
      "Unlimited channel",
      "Unlimited video library",
      "Kualitas hingga 4K",
      "Multi-platform simultan",
      "API & webhook access",
      "White label solution",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom integration",
    ],
    cta: "Hubungi Sales",
    variant: "dark" as const,
    highlight: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">Harga</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Paket yang <span className="text-gradient">Transparan</span> dan Terjangkau
          </h2>
          <p className="text-muted-foreground text-lg">
            Mulai gratis, upgrade sesuai kebutuhan. Tidak ada biaya tersembunyi.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
                plan.highlight
                  ? "bg-gradient-to-b from-primary/10 to-accent/10 border-2 border-primary/30 shadow-strong scale-[1.02]"
                  : "card-elevated"
              }`}
            >
              {/* Highlight Badge */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-medium">
                  Paling Populer
                </div>
              )}

              {/* Plan Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  plan.highlight ? "bg-gradient-primary text-primary-foreground" : "bg-secondary"
                }`}>
                  <plan.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>

              {/* Price */}
              <div className="mb-2">
                {plan.price === "Custom" ? (
                  <span className="text-3xl font-bold">Custom</span>
                ) : (
                  <>
                    <span className="text-sm text-muted-foreground">Rp</span>
                    <span className="text-4xl font-bold mx-1">{plan.price}K</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6">{plan.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.highlight ? "bg-primary/20 text-primary" : "bg-success/20 text-success"
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
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

        {/* Guarantee */}
        <p className="text-center text-muted-foreground mt-12">
          🔒 <span className="font-medium">Garansi 14 hari uang kembali</span> — Tidak puas? Kami kembalikan 100% pembayaran Anda.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
