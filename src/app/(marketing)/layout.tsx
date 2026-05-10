import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Zone Tactics",
  applicationCategory: "SportsApplication",
  operatingSystem: "Web",
  description:
    "Application web pour créer, animer et partager des tactiques de basketball sur mobile et tablette.",
  url: siteUrl,
  offers: {
    "@type": "Offer",
    price: "10",
    priceCurrency: "EUR",
    description: "Abonnement annuel Coach Pro",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
