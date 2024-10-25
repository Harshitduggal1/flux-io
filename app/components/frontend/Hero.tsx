"use client";

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
import GradualSpacing from "@/components/ui/gradual-spacing";

export function Hero() {
  return (
    <>
      <div className="bg-gradient-to-r from-black to-gray-900 opacity-90 w-full">
        <div className="flex flex-col justify-between items-center px-6 w-full text-sm">
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
      </div>

      <section className="bg-transparent relative">
        <Particles
          className="absolute inset-0"
          quantity={100}
          ease={80}
          color="#ffffff"
          refresh
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.5))]"></div>
        <div className="relative z-10 items-center py-12 lg:py-20 w-full">
          <div className="px-4 w-full text-center">
            <span className="inline-block bg-gradient-to-r from-green-400 to-blue-500 shadow-lg mb-4 px-4 py-2 rounded-full font-medium text-sm text-white tracking-tight animate-bounce">
              Ultimate Blogging SaaS for Startups
            </span>

            <GradualSpacing
              className="font-bold font-display text-8xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 md:leading-[5rem] -tracking-widest"
              text="BLOGGING SOFTWARE"
            />
            <GradualSpacing
              className="font-bold font-display text-8xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 md:leading-[5rem] -tracking-widest"
              text="FOR PROFESSIONALS"
            />

            <p className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl backdrop-blur-sm mx-auto mt-4 p-6 rounded-xl max-w-xl font-light text-base text-white lg:text-lg tracking-tighter">
              Setting up your blog is hard and time-consuming. We make it easy
              for you to create a blog in minutes.
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
