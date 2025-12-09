import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Bagaimana cara kerja LiveForge?",
    answer: "LiveForge menggunakan infrastruktur cloud enterprise untuk menjalankan siaran Anda. Cukup upload video ke dashboard, masukkan stream key dari YouTube/Facebook, dan aktifkan siaran. Server kami akan melakukan streaming secara otomatis 24/7, bahkan saat Anda tidur atau perangkat Anda mati.",
  },
  {
    question: "Apakah aman untuk channel saya?",
    answer: "Sangat aman. Kami hanya memerlukan stream key, bukan password akun Anda. Stream key dapat di-reset kapan saja melalui dashboard YouTube/Facebook. Semua data dienkripsi dengan standar AES-256 dan server kami memiliki sertifikasi ISO 27001.",
  },
  {
    question: "Platform apa saja yang didukung?",
    answer: "Saat ini kami mendukung YouTube Live dan Facebook Live. Paket Professional dan Enterprise mendukung siaran simultan ke kedua platform sekaligus. Dukungan untuk Twitch, TikTok Live, dan Instagram Live sedang dalam pengembangan.",
  },
  {
    question: "Berapa lama waktu setup?",
    answer: "Rata-rata pengguna baru dapat memulai siaran pertama dalam waktu kurang dari 5 menit. Prosesnya: (1) Buat akun, (2) Upload video, (3) Masukkan stream key, (4) Klik Start. Tidak diperlukan pengetahuan teknis sama sekali.",
  },
  {
    question: "Bagaimana jika ada gangguan pada server?",
    answer: "Server kami memiliki uptime 99.9% dengan sistem redundansi multi-region. Jika terjadi gangguan, sistem failover otomatis akan mengambil alih dalam hitungan detik. Anda juga akan menerima notifikasi real-time via email dan dashboard.",
  },
  {
    question: "Apakah ada batasan durasi siaran?",
    answer: "Tergantung paket. Starter: 12 jam/hari, Professional: 24/7 tanpa batas, Enterprise: 24/7 dengan SLA guarantee. Video akan loop otomatis selama siaran aktif.",
  },
  {
    question: "Metode pembayaran apa saja yang diterima?",
    answer: "Kami menerima Transfer Bank (BCA, Mandiri, BNI, BRI), E-wallet (GoPay, OVO, DANA, ShopeePay), dan Kartu Kredit/Debit (Visa, Mastercard). Tersedia juga opsi pembayaran tahunan dengan diskon 20%.",
  },
  {
    question: "Bagaimana cara menghubungi support?",
    answer: "Tim support kami tersedia 24/7 melalui live chat di dashboard, email (support@liveforge.id), dan WhatsApp. Pengguna Professional dan Enterprise mendapatkan akses ke priority support dengan response time maksimal 1 jam.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Pertanyaan yang <span className="text-gradient">Sering Diajukan</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Temukan jawaban untuk pertanyaan umum tentang layanan kami.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-2xl px-6 data-[state=open]:border-primary/30 data-[state=open]:shadow-soft transition-all"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors py-5 [&[data-state=open]]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
