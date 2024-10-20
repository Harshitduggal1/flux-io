import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { SubmitButton } from "../dashboard/SubmitButtons";
import Link from "next/link";
import { CreateSubscription } from "@/app/actions";

interface iAppProps {
  id: number;
  cardTitle: string;
  cardDescription: string;
  priceTitle: string;
  benefits: string[];
}

export const PricingPlans: iAppProps[] = [
  {
    id: 0,
    cardTitle: "Freelancer",
    cardDescription: "Perfect for solo creators and startups.",
    benefits: [
      "1 Site",
      "Up to 10,000 Monthly Visitors",
      "Basic Analytics",
      "24/7 Support",
    ],
    priceTitle: "Free",
  },
  {
    id: 1,
    cardTitle: "Startup",
    cardDescription: "Ideal for growing businesses and teams.",
    priceTitle: "$29",
    benefits: [
      "Unlimited Sites",
      "Unlimited Visitors",
      "Advanced Analytics",
      "Priority Support",
    ],
  },
];

export function PricingTable() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center">
          <p className="bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4 font-extrabold text-lg text-transparent animate-pulse">Pricing</p>
          <h1 className="bg-clip-text bg-gradient-to-r from-emerald-300 via-blue-500 to-purple-600 mt-2 font-black text-5xl text-transparent sm:text-7xl tracking-tight animate-text">
            Elevate Your Blog with Our Plans
          </h1>
        </div>
        <p className="border-white/10 bg-white/5 shadow-2xl backdrop-blur-md mx-auto mt-8 p-6 border rounded-2xl max-w-2xl text-center text-gray-300 text-lg leading-relaxed">
          Choose the perfect plan to supercharge your content creation. From solo bloggers to enterprise teams, we&apos;ve got you covered.
        </p>

        <div className="gap-12 grid grid-cols-1 lg:grid-cols-2 mt-20">
          {PricingPlans.map((item) => (
            <Card key={item.id} className={`${item.id === 1 ? "border-primary border-2" : ""} backdrop-blur-xl bg-white/5 rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-[0_8px_30px_rgba(14,165,233,0.2)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.5)]`}>
              <CardHeader className="bg-gradient-to-r from-purple-800/50 to-indigo-800/50 p-8">
                <CardTitle className="font-black text-3xl">
                  {item.id === 1 ? (
                    <div className="flex justify-between items-center">
                      <h3 className="bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 text-transparent">{item.cardTitle}</h3>
                      <p className="bg-primary/20 px-4 py-2 rounded-full font-bold text-primary text-sm leading-5 animate-pulse">
                        Most popular
                      </p>
                    </div>
                  ) : (
                    <span className="bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent">{item.cardTitle}</span>
                  )}
                </CardTitle>
                <CardDescription className="mt-2 text-gray-300 text-lg">{item.cardDescription}</CardDescription>
              </CardHeader>
              <CardContent className="bg-gradient-to-b from-transparent to-white/5 p-8">
                <p className="bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mt-6 font-black text-6xl text-transparent tracking-tighter">
                  {item.priceTitle}
                </p>

                <ul className="space-y-4 mt-10 text-base text-gray-300 leading-7">
                  {item.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-x-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                      <Check className="text-emerald-400 size-6" />
                      <span className="font-medium text-gray-800 text-xl">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-purple-800/50 to-indigo-800/50 p-8">
                {item.id === 1 ? (
                  <form className="w-full" action={CreateSubscription}>
                    <SubmitButton text="Get Started" className="bg-gradient-to-r from-pink-500 hover:from-pink-600 to-purple-500 hover:to-purple-600 shadow-lg mt-5 px-6 py-3 rounded-full w-full font-bold text-lg text-white transform hover:scale-105 transition-all duration-300" />
                  </form>
                ) : (
                  <Button variant="outline" className="border-2 border-gray-300 bg-transparent hover:bg-white/20 shadow-lg mt-5 px-6 py-3 rounded-full w-full font-bold text-gray-300 text-lg hover:text-white transform hover:scale-105 transition-all duration-300" asChild>
                    <Link href="/dashboard">Try for free</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
