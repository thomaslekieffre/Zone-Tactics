"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TacticViewer } from "@/features/tactic/components/TacticViewer";
import type { TacticData } from "@/features/tactic/lib/types";
import { unlockSharedTactic } from "@/app/share/actions";

export function SharePinGate({ slug }: { slug: string }) {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState<{
    id: string;
    name: string;
    data: TacticData;
  } | null>(null);
  const [pending, start] = useTransition();

  if (unlocked) {
    return (
      <TacticViewer
        id={unlocked.id}
        name={unlocked.name}
        data={unlocked.data}
      />
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = pin.trim();
    if (code.length < 4) {
      toast.error("Code trop court");
      return;
    }
    start(async () => {
      const res = await unlockSharedTactic(slug, code);
      if (!res.ok) {
        toast.error(res.badPin ? "Code incorrect" : "Accès impossible");
        return;
      }
      setUnlocked({
        id: res.id,
        name: res.name,
        data: res.data,
      });
    });
  };

  return (
    <div className="min-h-[100dvh] grid place-items-center p-6 bg-background">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-6 shadow-lg"
      >
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Lock className="size-5 text-primary" />
          Lien protégé
        </div>
        <p className="text-sm text-muted-foreground">
          Entre le code PIN communiqué par le coach pour voir la tactique.
        </p>
        <div className="space-y-2">
          <Label htmlFor="share-pin">Code PIN</Label>
          <Input
            id="share-pin"
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
          />
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Vérification…" : "Déverrouiller"}
        </Button>
      </form>
    </div>
  );
}
