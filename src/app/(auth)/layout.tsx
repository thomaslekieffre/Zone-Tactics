export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh grid place-items-center px-4 py-10 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
