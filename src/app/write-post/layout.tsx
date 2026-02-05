import Footer from "@/components/layout/footer";

export default function WritePostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
