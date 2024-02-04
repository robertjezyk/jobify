import Image from "next/image";
import Logo from "../assets/logo.svg";
import Main from "../assets/main.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <header className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
        <Image src={Logo} alt="logo" />
      </header>
      <section className="max-w-6xl mx-auto px-4 sm:px-8 h-screen -mt-20 grid lg:grid-cols-[1fr,400px] items-center">
        <div>
          <h1 className="capitalize text-4xl md:text-7xl font-bold">
            job <span className="text-primary">tracking</span> app
          </h1>
          <p className="leading-loose max-w-md mt-4">
            Welcome to Jobify – your go-to app for seamless job hunting!
            Effortlessly log job applications, track deadlines, and receive
            real-time updates. Gain valuable insights to optimize your strategy.
            Take control of your job search with Jobify – download now for a
            more organized and successful career journey!
          </p>
          <Button asChild className="mt-4">
            <Link href="/add-job">Get Started</Link>
          </Button>
        </div>
        <Image src={Main} alt="main" className="hidden lg:block" />
      </section>
    </main>
  );
}
