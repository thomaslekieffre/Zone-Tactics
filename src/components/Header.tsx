import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { BasketballIcon } from "@/components/BasketballIcon";
import { displayUsername } from "@/lib/supabase/profileDisplay";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  return (
    <header className="sticky top-0 z-30 bg-background/95 border-b">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold group">
          <BasketballIcon className="size-7 transition-transform group-hover:rotate-180 duration-700" />
          <span>Zone Tactics</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/#features" className="hover:text-foreground">
            Fonctionnalités
          </Link>
          <Link href="/pricing" className="hover:text-foreground">
            Tarifs
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/library">Bibliothèque</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/tactic/new">Nouvelle tactique</Link>
              </Button>
              <UserMenu
                username={displayUsername(user, profile)}
                email={user.email ?? undefined}
              />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Connexion</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">S'inscrire</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
