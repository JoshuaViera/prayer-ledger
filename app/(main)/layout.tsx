import { BottomNavBar } from "@/components/navigation/BottomNavBar";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Add padding to the bottom of the main content to prevent overlap */}
      <main className="pb-20 md:pb-0">{children}</main>
      <BottomNavBar />
    </div>
  );
}