
export default async function ProviderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <div className="min-h-screen bg-background">
      <main>{children}</main>
    </div>
  );
}