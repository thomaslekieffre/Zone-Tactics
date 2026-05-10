"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createShare } from "@/app/(app)/tactic/[id]/actions";

export function ShareDialog({ tacticId }: { tacticId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();

  const onGenerate = () => {
    start(async () => {
      try {
        const { slug } = await createShare(tacticId);
        const link = `${window.location.origin}/share/${slug}`;
        setUrl(link);
      } catch (e) {
        console.error(e);
        toast.error("Impossible de créer le lien");
      }
    });
  };

  const onCopy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Lien copié");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="default" className="gap-2">
          <Share2 className="size-4" />
          <span className="hidden sm:inline">Partager</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Partager la tactique</DialogTitle>
          <DialogDescription>
            Crée un lien public en lecture seule. Ton équipe pourra y accéder
            sans compte.
          </DialogDescription>
        </DialogHeader>

        {url ? (
          <div className="flex gap-2">
            <Input value={url} readOnly />
            <Button onClick={onCopy} variant="outline" size="icon">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucun lien actif. Clique pour en générer un.
          </p>
        )}

        <DialogFooter>
          <Button onClick={onGenerate} disabled={pending}>
            {pending ? "Génération..." : url ? "Régénérer" : "Générer un lien"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
