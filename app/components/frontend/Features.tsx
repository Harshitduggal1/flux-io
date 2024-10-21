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
    <div className="py-24 sm:py-32 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="max-w-4xl mx-auto lg:text-center px-4 sm:px-6 lg:px-8">
        <p className="font-extrabold text-transparent text-lg bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Revolutionize Your Blogging
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-blue-500 to-purple-600">
          Unleash the Power of AI-Driven Blogging
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300 backdrop-blur-sm bg-white/10 rounded-xl p-6 shadow-2xl">
          Welcome to the future of content creation. Our trillion-dollar blogging platform
          harnesses cutting-edge AI technology to supercharge your writing and skyrocket
          your SEO rankings. Dominate the digital landscape with unparalleled ease and efficiency.
        </p>
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-2 lg:gap-24">
          {features.map((feature) => (
            <div key={feature.name} className="relative backdrop-blur-md bg-white/5 rounded-2xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(14,165,233,0.3)] hover:-translate-y-1">
              <div className="text-xl font-bold leading-7 text-white mb-4">
                <div className="absolute left-5 top-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <span className="ml-20">{feature.name}</span>
              </div>
              <p className="mt-2 text-base text-gray-300 leading-7 ml-20">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
