"use client";

import Link from "next/link";
import {
  ArrowRight,
  Copy,
  Film,
  Lock,
  Pencil,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

const ITEMS = [
  {
    icon: Film,
    title: "GIF + WebM",
    text: "Export animé pour Slack ou montage vertical Reels / TikTok.",
  },
  {
    icon: Lock,
    title: "Partage à PIN",
    text: "Lien public avec code coach — stats de vues sur le partage.",
  },
  {
    icon: Pencil,
    title: "Annotations parquet",
    text: "Craie et libellés figés sur le terrain pour tes consignes.",
  },
  {
    icon: Copy,
    title: "Dupliquer en 1 clic",
    text: "Copie une tactique depuis la bibliothèque pour itérer vite.",
  },
] as const;

export function LandingFeatureHighlights() {
  return (
    <section className="border-y bg-muted/20 py-16">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
            <Sparkles className="size-3.5 text-primary" />
            Fonctionnalités récentes
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Tout ce qu&apos;il faut pour préparer le match
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border bg-card p-5 shadow-sm"
            >
              <it.icon className="size-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">{it.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {it.text}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="text-center mt-10 text-sm text-muted-foreground">
          <Link
            href="/signup"
            className="text-primary font-medium inline-flex items-center gap-1 hover:underline"
          >
            Créer un compte
            <ArrowRight className="size-4" />
          </Link>
          {" · "}
          <Link href="/demo" className="underline-offset-4 hover:underline">
            ou voir la démo
          </Link>
        </p>
      </div>
    </section>
  );
}
