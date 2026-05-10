"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Download, Loader2, Smartphone, Tv, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTacticStore } from "../hooks/useTacticStore";
import type { CourtHandle } from "./Court";
import {
  downloadVideoBlob,
  exportTacticVideo,
  type ExportFormat,
} from "../lib/exportVideo";
import { downloadGifBlob, exportTacticGif } from "../lib/exportGif";

type Props = {
  courtRef: React.MutableRefObject<CourtHandle | null>;
};

export function ExportVideoButton({ courtRef }: Props) {
  const data = useTacticStore((s) => s.data);
  const name = useTacticStore((s) => s.name);
  const [pending, start] = useTransition();
  const abortRef = useRef<AbortController | null>(null);

  const run = (format: ExportFormat) => {
    const court = courtRef.current;
    if (!court) {
      toast.error("Terrain pas prêt");
      return;
    }
    if (data.sequences.length === 0) {
      toast.error("Ajoute au moins une séquence animée");
      return;
    }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    start(async () => {
      const label =
        format === "reels"
          ? "Reels / TikTok (9:16)"
          : "YouTube / paysage (16:9)";
      toast.loading(`Export ${label}…`, { id: "export-vid" });
      try {
        const blob = await exportTacticVideo({
          data,
          court,
          format,
          signal: ctrl.signal,
        });
        downloadVideoBlob(blob, name || "tactique");
        toast.success("Vidéo .webm téléchargée — tu peux la poster tel quel ou la convertir en MP4.", {
          id: "export-vid",
          duration: 6000,
        });
      } catch (e) {
        if ((e as Error).name === "AbortError") {
          toast.dismiss("export-vid");
          return;
        }
        toast.error((e as Error).message || "Export impossible", {
          id: "export-vid",
        });
      }
    });
  };

  const runGif = () => {
    const court = courtRef.current;
    if (!court) {
      toast.error("Terrain pas prêt");
      return;
    }
    if (data.sequences.length === 0) {
      toast.error("Ajoute au moins une séquence animée");
      return;
    }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    start(async () => {
      toast.loading("Export GIF…", { id: "export-gif" });
      try {
        const blob = await exportTacticGif({
          data,
          court,
          signal: ctrl.signal,
        });
        downloadGifBlob(blob, name || "tactique");
        toast.success("GIF téléchargé.", { id: "export-gif" });
      } catch (e) {
        if ((e as Error).name === "AbortError") {
          toast.dismiss("export-gif");
          return;
        }
        toast.error((e as Error).message || "Export GIF impossible", {
          id: "export-gif",
        });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={pending || data.sequences.length === 0}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          <span className="hidden sm:inline">Exporter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          WebM — idéal pour montage ou réseaux (Chrome / Edge)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => run("reels")} className="gap-2 cursor-pointer">
          <Smartphone className="size-4 text-primary" />
          <div>
            <div className="font-medium">9:16 Reels / Shorts</div>
            <div className="text-xs text-muted-foreground">1080 × 1920</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => run("youtube")} className="gap-2 cursor-pointer">
          <Tv className="size-4 text-primary" />
          <div>
            <div className="font-medium">16:9 YouTube</div>
            <div className="text-xs text-muted-foreground">1920 × 1080</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          GIF — léger pour Slack / Discord
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => runGif()} className="gap-2 cursor-pointer">
          <FileImage className="size-4 text-primary" />
          <div>
            <div className="font-medium">Animation GIF</div>
            <div className="text-xs text-muted-foreground">640 × 360 · palette fixe</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
