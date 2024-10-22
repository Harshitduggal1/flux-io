import { CloudRain, Zap, Shield, Smile } from "lucide-react";

const features = [
  {
    name: "Free Sign-up",
    description:
      "Join the revolution effortlessly. Our seamless registration process gets you started on your journey to blogging success in seconds.",
    icon: CloudRain,
  },
  {
    name: "Lightning-Fast Performance",
    description:
      "Experience unparalleled speed. Our platform is optimized for blazing-fast load times, ensuring your content reaches readers instantly.",
    icon: Zap,
  },
  {
    name: "Fortress-like Security with Kinde",
    description:
      "Rest easy knowing your data is protected. Our Kinde-powered security measures provide an impenetrable shield for your digital assets.",
    icon: Shield,
  },
  {
    name: "Intuitive User Experience",
    description:
      "Simplicity meets sophistication. Our user-friendly interface makes managing your blog a breeze, allowing you to focus on what matters most - your content.",
    icon: Smile,
  },
];
export function Features() {
  return (
    <div className="bg-transparent py-24 sm:py-32">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl lg:text-center">
        <p className="bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-extrabold text-lg text-transparent">
          Revolutionize Your Blogging
        </p>
        <h1 className="bg-clip-text bg-gradient-to-r from-emerald-300 via-blue-500 to-purple-600 mt-4 font-black text-4xl text-transparent sm:text-6xl tracking-tight">
          Unleash the Power of AI-Driven Blogging
        </h1>
        <p className="bg-white/10 shadow-2xl backdrop-blur-sm mt-6 p-6 rounded-xl text-gray-900 text-lg leading-8">
          Welcome to the future of content creation. Our trillion-dollar blogging platform
          harnesses cutting-edge AI technology to supercharge your writing and skyrocket
          your SEO rankings. Dominate the digital landscape with unparalleled ease and efficiency.
        </p>
      </div>

      <div className="mx-auto mt-20 px-6 lg:px-8 max-w-7xl">
        <div className="gap-x-8 gap-y-16 lg:gap-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.name} className="relative bg-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.3)] backdrop-blur-md p-10 rounded-2xl transition-all hover:-translate-y-1 duration-300">
              <div className="mb-4 font-bold text-gray-900 text-xl leading-7">
                <div className="top-5 left-5 absolute flex justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg rounded-full w-16 h-16">
                  <feature.icon className="w-8 h-8 text-gray-900" />
                </div>
                <span className="ml-20">{feature.name}</span>
              </div>
              <p className="mt-2 ml-20 text-base text-gray-900 leading-7">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
