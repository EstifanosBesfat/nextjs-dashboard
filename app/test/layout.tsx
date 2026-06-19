import "@/app/ui/global.css";
export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <h1>you are inside the test url</h1>
      <body>{children}</body>
    </html>
  );
}
