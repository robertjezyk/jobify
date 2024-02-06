import { PropsWithChildren } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

function layout({ children }: PropsWithChildren) {
  return (
    <main className="grid lg:grid-cols-5">
      {/* first-col hide on small screen */}
      <div className="hidden lg:block lg:col-span-1 lg:min-h-screen">
        <Sidebar />
      </div>
      {/* second-col hide on small screen */}
      <div className="lg:col-span-4">
        <Navbar />
        <div className="py-16 px-4 sm:px-8">{children}</div>
      </div>
    </main>
  );
}

export default layout;
