import { BottomNavBar } from "@/components/navigation/BottomNavBar";
import { SideBar } from "@/components/navigation/SideBar";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1">
        {/* Add padding to the bottom on mobile to avoid overlap with the nav bar */}
        <main className="pb-20 md:pb-0">{children}</main>
        <BottomNavBar />
      </div>
    </div>
  );
}