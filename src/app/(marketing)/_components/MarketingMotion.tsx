"use client";

import { motion, type Variants } from "motion/react";
import { type ReactNode } from "react";
import {
  Mic,
  Share2,
  Smartphone,
  Sparkles,
  PlayCircle,
  Users,
} from "lucide-react";
import { BasketballIcon } from "@/components/BasketballIcon";

const ICONS = {
  smartphone: Smartphone,
  mic: Mic,
  share: Share2,
  users: Users,
  play: PlayCircle,
  sparkles: Sparkles,
} as const;

export type FeatureIconKey = keyof typeof ICONS;

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeUpVariants}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export function StaggerChildren({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={staggerItemVariants}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Ballons de basket décoratifs en arrière-plan du hero (CSS-only, GPU friendly). */
export function HeroBackground() {
  const balls = [
    { x: "8%", y: "20%", size: 56, delay: "0s" },
    { x: "85%", y: "15%", size: 80, delay: "1s" },
    { x: "12%", y: "75%", size: 64, delay: "2s" },
    { x: "90%", y: "70%", size: 48, delay: "1.5s" },
  ];
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden motion-reduce:hidden">
      {balls.map((b, i) => (
        <div
          key={i}
          className="absolute opacity-15 will-change-transform [animation:float_8s_ease-in-out_infinite]"
          style={{
            left: b.x,
            top: b.y,
            animationDelay: b.delay,
          }}
        >
          <BasketballIcon
            style={{ width: b.size, height: b.size } as React.CSSProperties}
          />
        </div>
      ))}
    </div>
  );
}

export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: FeatureIconKey;
  title: string;
  description: string;
}) {
  const Icon = ICONS[icon];
  return (
    <div
      className="bg-background p-6 rounded-2xl border shadow-sm hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-[transform,box-shadow,border-color] duration-200 h-full group"
    >
      <div className="relative h-12 w-12 rounded-lg overflow-hidden mb-6 grid place-items-center bg-primary/10 group-hover:bg-primary transition-colors duration-300">
        <Icon className="size-6 text-primary absolute transition-opacity duration-200 group-hover:opacity-0" />
        <Icon className="size-6 text-primary-foreground absolute opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
