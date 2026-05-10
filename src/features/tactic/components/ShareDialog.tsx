"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Share2, Copy, Check, Eye } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  createShare,
  getSharesForTactic,
} from "@/app/(app)/tactic/[id]/actions";

export function ShareDialog({ tacticId }: { tacticId: string }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [copied, setCopied] = useState(false);
  const [shares, setShares] = useState<
    { slug: string; view_count: number | null; pin_hash: string | null }[]
  >([]);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!open || !tacticId) return;
    start(async () => {
      try {
        const rows = await getSharesForTactic(tacticId);
        setShares(rows);
        const latest = rows[0];
        if (latest) {
          setUrl(`${window.location.origin}/share/${latest.slug}`);
        }
      } catch {
        setShares([]);
      }
    });
  }, [open, tacticId]);

  const onGenerate = () => {
    start(async () => {
      try {
        const trimmed = pin.trim();
        const { slug } = await createShare(
          tacticId,
          trimmed.length > 0 ? trimmed : undefined,
        );
        const link = `${window.location.origin}/share/${slug}`;
        setUrl(link);
        setPin("");
        const rows = await getSharesForTactic(tacticId);
        setShares(rows);
        toast.success(
          trimmed ? "Lien protégé par PIN créé" : "Lien public créé",
        );
      } catch (e) {
        console.error(e);
        toast.error(
          e instanceof Error ? e.message : "Impossible de créer le lien",
        );
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

  const latest = shares[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Lien public en lecture seule. PIN optionnel (4–6 chiffres) : sans
            code, la tactique reste lisible par le lien ; avec PIN, seuls les
            lecteurs avec le code voient le jeu (la ligne tactics reste
            protégée côté base).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="share-pin-opt">PIN (optionnel)</Label>
            <Input
              id="share-pin-opt"
              inputMode="numeric"
              placeholder="ex. 4242"
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
            />
          </div>

          {url ? (
            <div className="flex gap-2">
              <Input value={url} readOnly />
              <Button onClick={onCopy} variant="outline" size="icon">
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aucun lien pour cette tactique. Génère-en un ci-dessous.
            </p>
          )}

          {latest && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="size-4 shrink-0" />
              <span>
                Vues sur ce lien :{" "}
                <strong className="text-foreground">
                  {latest.view_count ?? 0}
                </strong>
                {latest.pin_hash ? " · protégé PIN" : ""}
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onGenerate} disabled={pending}>
            {pending ? "Génération..." : url ? "Nouveau lien" : "Générer un lien"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
