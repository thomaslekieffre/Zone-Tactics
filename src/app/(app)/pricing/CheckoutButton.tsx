"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CheckoutButton({ className }: { className?: string }) {
  const [pending, start] = useTransition();

  const onClick = () => {
    start(async () => {
      try {
        const res = await fetch("/api/stripe/checkout", { method: "POST" });
        if (!res.ok) throw new Error(await res.text());
        const { url } = await res.json();
        window.location.href = url;
      } catch (e) {
        console.error(e);
        toast.error("Impossible de lancer le paiement");
      }
    });
  };

  return (
    <Button className={className || "w-full"} onClick={onClick} disabled={pending}>
      {pending ? "Redirection..." : "S'abonner"}
    </Button>
  );
}
