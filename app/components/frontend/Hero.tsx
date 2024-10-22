"use client"

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/lego.png";
import { ThemeToggle } from "../dashboard/ThemeToggle";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import HeroImage from "@/public/blogs.png";
import Particles from "@/components/ui/particles";

export function Hero() {
  return (
    <>
      <div className="relative flex bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 bg-opacity-30 shadow-2xl backdrop-blur-lg backdrop-filter mx-auto py-5 rounded-3xl w-full">
     
        <div className="flex flex-row justify-between lg:justify-start items-center px-6 w-full text-sm">
          <Link href="/" className="flex items-center gap-1 hover:scale-105 transition-transform duration-300 ease-in-out">
            <Image src={Logo} className="animate-pulse size-10" alt="Logo" />

            <h4 className="bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 font-extrabold text-5xl text-transparent">
              <span className="hover:text-primary transition-colors duration-300">FLUX.IO</span>
            </h4>
          </Link>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>

        <nav className="md:flex md:justify-end md:space-x-4 hidden pr-6 w-full">
          <ThemeToggle />
          <LoginLink>
            <Button variant="secondary" className="hover:bg-primary shadow-lg hover:text-white transform transition-all duration-300 ease-in-out hover:scale-105">Sign in</Button>
          </LoginLink>
          <RegisterLink>
            <Button className="bg-gradient-to-r from-purple-600 hover:from-purple-700 to-pink-600 hover:to-pink-700 shadow-lg font-bold text-white transform transition-all duration-300 ease-in-out hover:scale-105">Sign up</Button>
          </RegisterLink>
        </nav>
      </div>

      <section className="bg-gradient-to-r from-purple-900 to-violet-900">
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color="#ffffff"
        refresh
      />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative z-10 items-center py-12 lg:py-20 w-full">
          <div className="px-4 w-full text-center">
            <span className="inline-block bg-primary/10 mb-4 px-4 py-2 rounded-full font-medium text-primary text-sm tracking-tight animate-bounce">
              Ultimate Blogging SaaS for Startups
            </span>

            <h1 className="bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mt-8 font-black text-4xl text-transparent sm:text-6xl md:text-7xl lg:text-8xl leading-none animate-text">
              Setup your Blog{" "}
              <span className="block text-primary animate-pulse">in Minutes!</span>
            </h1>

            <p className="bg-white/5 shadow-2xl backdrop-blur-sm mx-auto mt-4 p-6 rounded-xl max-w-xl font-light text-base text-gray-300 lg:text-lg tracking-tighter">
              Setting up your blog is hard and time consuming. We make it easy
              for you to create a blog in minutes
            </p>
            <div className="flex justify-center items-center gap-x-5 mt-8 w-full">
              <LoginLink>
                <Button variant="secondary" className="hover:bg-primary shadow-xl px-8 py-4 text-lg hover:text-white transform transition-all duration-300 ease-in-out hover:scale-110">Sign in</Button>
              </LoginLink>
              <RegisterLink>
                <Button className="bg-gradient-to-r from-purple-500 hover:from-purple-700 to-pink-600 hover:to-pink-700 shadow-xl px-8 py-4 font-bold text-lg text-white transform transition-all duration-300 ease-in-out hover:scale-110">Try for free</Button>
              </RegisterLink>
            </div>
          </div>

          <div className="relative items-center mx-auto mt-12 py-12 w-full">
            <svg
              className="absolute blur-3xl -mt-24 w-full"
              fill="none"
              viewBox="0 0 400 400"
              height="100%"
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_10_20)">
                <g filter="url(#filter0_f_10_20)">
                  <path
                    d="M128.6 0H0V322.2L106.2 134.75L128.6 0Z"
                    fill="#03FFE0"
                  ></path>
                  <path
                    d="M0 322.2V400H240H320L106.2 134.75L0 322.2Z"
                    fill="#7C87F8"
                  ></path>
                  <path
                    d="M320 400H400V78.75L106.2 134.75L320 400Z"
                    fill="#4C65E4"
                  ></path>
                  <path
                    d="M400 0H128.6L106.2 134.75L400 78.75V0Z"
                    fill="#043AFF"
                  ></path>
                </g>
              </g>
              <defs>
                <filter
                  colorInterpolationFilters="sRGB"
                  filterUnits="userSpaceOnUse"
                  height="720.666"
                  id="filter0_f_10_20"
                  width="720.666"
                  x="-160.333"
                  y="-160.333"
                >
                  <feFlood
                    floodOpacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feBlend
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    mode="normal"
                    result="shape"
                  ></feBlend>
                  <feGaussianBlur
                    result="effect1_foregroundBlur_10_20"
                    stdDeviation="80.1666"
                  ></feGaussianBlur>
                </filter>
              </defs>
            </svg>

            <Image
              src={HeroImage}
              alt="Hero image"
              priority
              className="relative shadow-2xl border rounded-lg lg:rounded-2xl w-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
