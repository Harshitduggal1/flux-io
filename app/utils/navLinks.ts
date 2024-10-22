import { BarChart2, DollarSign, Globe, Home, Plug, Settings, Sparkles, Users } from "lucide-react";

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
