export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container py-6 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Zone Tactics</p>
        <p>Fait avec passion pour les coachs de basket.</p>
      </div>
    </footer>
  );
}
