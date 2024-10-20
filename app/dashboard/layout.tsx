import Link from "next/link";
import { ReactNode } from "react";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import { DashboardItems } from "../components/dashboard/DashboardItems";
import { BarChart2, CircleUser, DollarSign, Globe, Home ,Plug,Settings,Sparkles, Users  } from "lucide-react";
import { ThemeToggle } from "../components/dashboard/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export const navLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Sites",
    href: "/dashboard/sites",
    icon: Globe,
  },
  {
    name: "Pricing",
    href: "/dashboard/pricing",
    icon: DollarSign,
  },
  {
    name: "Generate",
    href: "/dashboard/generate",
    icon: Sparkles,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart2,
  },
  {
    name: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    name: "Integrations",
    href: "/dashboard/integrations",
    icon: Plug,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <section className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] w-full min-h-screen">
      <div className="md:block hidden bg-muted/40 border-r">
        <div className="flex flex-col gap-2 h-full max-h-screen">
          <div className="flex items-center px-4 lg:px-6 border-b h-14 lg:h-[60px]">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image src={Logo} alt="Logo" className="size-8" />

              <h3 className="text-2xl">
                <span className="bg-clip-text bg-gradient-to-r from-blue-500 hover:from-cyan-600 via-purple-500 hover:via-purple-600 to-pink-500 hover:to-pink-600 font-extrabold text-2xl text-transparent transition-all animate-pulse duration-300">Flux.io</span>
              </h3>
            </Link>
          </div>

          <div className="flex-1">
            <nav className="items-start grid px-2 lg:px-4 font-medium">
              <DashboardItems />
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex items-center gap-4 bg-muted/40 px-4 lg:px-6 border-b h-14 lg:h-[60px]">
          <div className="flex items-center gap-x-5 ml-auto">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <LogoutLink>Log out</LogoutLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-col flex-1 gap-4 lg:gap-6 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </section>
  );
}