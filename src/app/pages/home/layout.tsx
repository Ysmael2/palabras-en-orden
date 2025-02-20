import SideNav from '@/app/components/sidenav';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="flex h-screen flex-col md:flex-row md:overflow-hidden"
    >
      <div className="w-full flex-none md:w-64"
      >
        <SideNav />
      </div>
      {children}
    </section>
  );
}