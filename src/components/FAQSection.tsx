import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Bagaimana cara kerja StreamHub?",
    answer: "StreamHub menggunakan cloud server untuk menjalankan live streaming kamu. Kamu cukup upload video, masukkan stream key dari YouTube/Facebook, dan klik Start. Server kami akan streaming video tersebut secara otomatis, bahkan saat komputer kamu mati.",
  },
  {
    question: "Apakah aman untuk channel saya?",
    answer: "100% aman! Kami hanya membutuhkan stream key (bukan password akun). Stream key bisa kamu reset kapan saja dari dashboard YouTube/Facebook. Data kamu dienkripsi dan server kami memiliki sertifikasi keamanan enterprise-grade.",
  },
  {
    question: "Berapa lama bisa live streaming?",
    answer: "Tergantung paket yang kamu pilih. Paket Starter bisa live 8 jam/hari, sedangkan paket Pro dan Business bisa live 24/7 non-stop tanpa batas waktu. Video akan loop otomatis selama live aktif.",
  },
  {
    question: "Platform apa saja yang didukung?",
    answer: "Saat ini kami mendukung YouTube Live dan Facebook Live. Paket Business mendukung multi-platform streaming secara bersamaan. Kami sedang mengembangkan dukungan untuk Twitch dan TikTok Live.",
  },
  {
    question: "Bagaimana jika server down?",
    answer: "Server kami memiliki uptime 99.9% dengan sistem backup otomatis. Jika terjadi masalah, sistem akan otomatis restart streaming dalam hitungan detik. Kamu juga akan mendapat notifikasi via email jika ada issue.",
  },
  {
    question: "Apakah ada free trial?",
    answer: "Ya! Kamu bisa mencoba StreamHub gratis selama 7 hari dengan semua fitur paket Pro. Tidak perlu kartu kredit untuk daftar. Jika tidak puas, kamu bisa cancel kapan saja tanpa biaya.",
  },
  {
    question: "Bagaimana cara pembayaran?",
    answer: "Kami menerima berbagai metode pembayaran: Transfer Bank (BCA, Mandiri, BNI, BRI), E-wallet (GoPay, OVO, DANA), dan Kartu Kredit/Debit. Pembayaran bisa bulanan atau tahunan (hemat 20%).",
  },
  {
    question: "Apakah bisa request fitur custom?",
    answer: "Tentu! Untuk paket Business, kami menyediakan opsi custom integration sesuai kebutuhan bisnis kamu. Hubungi tim sales kami untuk diskusi lebih lanjut.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pertanyaan yang <span className="gradient-text">Sering Ditanya</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Masih bingung? Cek jawaban dari pertanyaan yang paling sering ditanyakan.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
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
