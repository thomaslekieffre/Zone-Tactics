"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteTactic, type TacticListItem } from "./actions";

export function TacticCard({ tactic }: { tactic: TacticListItem }) {
  const [pending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      try {
        await deleteTactic(tactic.id);
        toast.success("Tactique supprimée");
      } catch (e) {
        toast.error("Suppression impossible");
        console.error(e);
      }
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2">{tactic.name}</CardTitle>
        <CardDescription>
          {tactic.sequenceCount} séquence{tactic.sequenceCount > 1 ? "s" : ""} ·{" "}
          {new Date(tactic.updatedAt).toLocaleDateString("fr-FR")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1" />
      <CardFooter className="flex justify-between gap-2">
        <Button asChild variant="default" size="sm" className="flex-1">
          <Link href={`/tactic/${tactic.id}`}>
            <Pencil className="size-4" /> Ouvrir
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon" disabled={pending}>
              <Trash2 className="size-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer cette tactique ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est définitive. La tactique « {tactic.name} » sera
                supprimée pour toujours.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
