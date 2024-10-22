"use client"

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
import { motion } from "framer-motion";

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
    <div className="relative bg-transparent">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center">
          <motion.p 
            className="bg-clip-text bg-gradient-to-r from-purple-500 to-pink-700 mb-4 font-extrabold text-lg text-transparent transition-transform animate-pulse duration-500 hover:scale-110"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1, ease: [0.68, -0.55, 0.27, 1.55] }}
          >
            Pricing
          </motion.p>
          <motion.h1 
            className="bg-clip-text bg-gradient-to-r from-emerald-300 via-blue-500 to-purple-600 mt-2 font-black text-5xl text-transparent sm:text-7xl tracking-tight animate-text"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Elevate Your Blog with Our Plans
          </motion.h1>
        </div>
        <motion.p 
          className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-2xl hover:shadow-lg backdrop-blur-md mx-auto mt-8 p-6 border border-transparent rounded-2xl max-w-2xl text-center text-lg text-white leading-relaxed transition-shadow duration-300"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Choose the perfect plan to supercharge your content creation. From solo bloggers to enterprise teams, we&apos;ve got you covered.
        </motion.p>

        <div className="gap-12 grid grid-cols-1 lg:grid-cols-2 mt-20">
          {PricingPlans.map((item) => (
            <motion.div 
              key={item.id} 
              className={`${item.id === 1 ? "border-primary border-2" : ""} backdrop-blur-xl bg-white/5 rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-[0_8px_30px_rgba(14,165,233,0.2)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.5)]`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CardHeader className="bg-gradient-to-r from-purple-900/70 to-indigo-900/70 shadow-lg p-10 rounded-lg transform transition-transform hover:scale-105 duration-500 ease-in-out">
                <CardTitle className="font-extrabold text-4xl transition-all duration-300 ease-in-out">
                  {item.id === 1 ? (
                    <div className="flex justify-between items-center">
                      <h3 className="bg-clip-text bg-gradient-to-r from-pink-600 to-violet-600 text-transparent transform transition-transform hover:scale-125 motion-safe:animate-bounce duration-500 ease-in-out">
                        {item.cardTitle}
                      </h3>
                      <p className="bg-gradient-to-r from-purple-800 via-blue-800 to-pink-900 shadow-lg hover:shadow-xl px-6 py-3 rounded-full font-bold text-sm text-white leading-6 transform transition-shadow motion-safe:animate-pulse duration-300 hover:scale-105">
                        Most popular
                      </p>
                    </div>
                  ) : (
                    <span className="bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500 text-transparent transform transition-transform hover:scale-110 duration-300">{item.cardTitle}</span>
                  )}
                </CardTitle>
                <CardDescription className="mt-2 text-gray-200 text-lg transition-opacity duration-300 ease-in-out">{item.cardDescription}</CardDescription>
              </CardHeader>
              <CardContent className="bg-gradient-to-b from-transparent to-white/10 shadow-md p-10 rounded-lg transform transition-transform hover:scale-105 duration-500 ease-in-out">
                <p className="bg-clip-text bg-gradient-to-r from-purple-500 to-pink-700 mt-6 font-extrabold text-7xl text-transparent tracking-tighter transform transition-transform hover:scale-110 duration-300">
                  {item.priceTitle}
                </p>

                <ul className="space-y-4 mt-10 text-base text-gray-300 leading-7">
                  {item.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-x-3 bg-white/20 backdrop-blur-md p-4 rounded-lg transform transition-transform hover:scale-105 duration-300">
                      <Check className="text-emerald-500 size-6" />
                      <span className="font-medium text-gray-800 text-xl">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-purple-900/70 to-indigo-900/70 shadow-lg p-10 rounded-lg transform transition-transform hover:scale-105 duration-500 ease-in-out">
                {item.id === 1 ? (
                  <form className="w-full" action={CreateSubscription}>
                    <SubmitButton text="Get Started" className="bg-gradient-to-r from-pink-600 hover:from-pink-700 to-purple-600 hover:to-purple-700 shadow-xl mt-5 px-6 py-3 rounded-full w-full font-bold text-lg text-white transform hover:scale-110 transition-all duration-300" />
                  </form>
                ) : (
                  <Button variant="outline" className="border-2 border-gray-400 bg-transparent hover:bg-white/30 shadow-xl mt-5 px-6 py-3 rounded-full w-full font-bold text-gray-300 text-lg hover:text-white transform hover:scale-110 transition-all duration-300" asChild>
                    <Link href="/dashboard">Try for free</Link>
                  </Button>
                )}
              </CardFooter>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
