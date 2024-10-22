"use client" // Client-side rendering

import React, { useState } from 'react'; // Importing React and useState hook
import {
  Github, // Github icon
  Twitter, // Twitter icon
  Instagram, // Instagram icon
  Linkedin, // LinkedIn icon
  Facebook, // Facebook icon
  Youtube // YouTube icon
} from 'lucide-react'; // Importing icons from lucide-react

// Interface for footer link properties
interface FooterLinkProps {
  text: string; // Link text
  href: string; // Link URL
}

// Footer link component
const FooterLink: React.FC<FooterLinkProps> = ({ text, href }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false); // State for hover effect

  return (
    <a
      href={href} // Link URL
      className="relative px-4 py-2 rounded-lg transition-all duration-300 group" // Styling for the link
      onMouseEnter={() => setIsHovered(true)} // Set hover state on mouse enter
      onMouseLeave={() => setIsHovered(false)} // Reset hover state on mouse leave
    >
      <span className="group-hover:text-white relative z-20 font-medium text-sm transition-colors duration-300">
        {text} // Display link text
      </span>
      
      {/* Hover background effect */}
      <div className={`
        absolute inset-0 z-10 rounded-lg transition-all duration-300
        bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-red-500/0
        group-hover:from-purple-500/20 group-hover:via-pink-500/60 group-hover:to-blue-500
        opacity-0 group-hover:opacity-100 backdrop-blur-sm
      `}>
        <div className="absolute inset-0 bg-gray-800/50 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 blur-xl rounded-lg transition-opacity duration-300" />
      </div>

      {/* Bottom gradient line */}
      <div className={`
        absolute bottom-0 left-0 right-0 h-[2px] z-10
        bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
        transform origin-left transition-transform duration-300 ease-out
        ${isHovered ? 'scale-x-100' : 'scale-x-0'} // Scale effect based on hover state
      `} />
    </a>
  );
};

// Interface for social icon properties
interface SocialIconProps {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>; // Icon component
  href: string; // Link URL
  label: string; // Accessibility label
}

// Social icon component
const SocialIcon: React.FC<SocialIconProps> = ({ Icon, href, label }) => (
  <a
    href={href} // Link URL
    target="_blank" // Open in a new tab
    rel="noopener noreferrer" // Security best practices
    aria-label={label} // Accessibility label
    className="relative group" // Styling for the icon
    onClick={() => {
      // Log the click for analytics or debugging
      console.log(`Navigating to ${label}: ${href}`); // Log navigation
    }}
  >
    <div className="group-hover:scale-110 relative bg-gray-800/50 backdrop-blur-sm rounded-xl w-12 h-12 transition-all duration-300 overflow-hidden">
      <div className="group-hover:from-purple-500/20 group-hover:via-pink-500/20 group-hover:to-red-500/20 absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-red-500/0 transition-all duration-300" />
      <div className="absolute inset-0 bg-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 flex justify-center items-center w-full h-full">
        <Icon className="group-hover:text-white w-5 h-5 text-gray-400 transition-colors duration-300" /> // Icon styling
      </div>
    </div>
  </a>
);

// Interface for footer section properties
interface FooterSectionProps {
  title: string; // Section title
  links: FooterLinkProps[]; // Array of footer links
}

// Footer section component
const FooterSection: React.FC<FooterSectionProps> = ({ title, links }) => (
  <div className="flex flex-col space-y-1">
    <h3 className="bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-3 font-semibold text-lg text-transparent">
      {title} // Display section title
    </h3>
    {links.map((link, index) => (
      <FooterLink key={index} {...link} /> // Render footer links
    ))}
  </div>
);

// Main footer component
const ModernFooter: React.FC = () => {
  const footerData: FooterSectionProps[] = [
    {
      title: "Products", // Section title
      links: [
        { text: "AI Assistant", href: "/dashboard/products/ai-assistant" },
        { text: "Code Generator", href: "/dashboard/products/code-generator" },
        { text: "API Access", href: "/dashboard/products/api-access" },
        { text: "Integrations", href: "/dashboard/products/integrations" },
        { text: "Extensions", href: "/dashboard/products/extensions" },
        { text: "Enterprise", href: "/dashboard/products/enterprise" }
      ]
    },
    {
      title: "Platform", // Section title
      links: [
        { text: "Web Editor", href: "/dashboard/platform/web-editor" },
        { text: "Desktop App", href: "/dashboard/platform/desktop-app" },
        { text: "Mobile App", href: "/dashboard/platform/mobile-app" },
        { text: "CLI Tools", href: "/dashboard/platform/cli-tools" },
        { text: "VS Code", href: "/dashboard/platform/vs-code" },
        { text: "JetBrains", href: "/dashboard/platform/jetbrains" }
      ]
    },
    {
      title: "Resources", // Section title
      links: [
        { text: "Documentation", href: "/dashboard/resources/documentation" },
        { text: "API Reference", href: "/dashboard/resources/api-reference" },
        { text: "Community", href: "/dashboard/resources/community" },
        { text: "Discord", href: "/dashboard/resources/discord" },
        { text: "Blog", href: "/dashboard/resources/blog" },
        { text: "Tutorials", href: "/dashboard/resources/tutorials" }
      ]
    },
    {
      title: "Company", // Section title
      links: [
        { text: "About Us", href: "/dashboard/company/about-us" },
        { text: "Careers", href: "/dashboard/company/careers" },
        { text: "Press", href: "/dashboard/company/press" },
        { text: "Contact", href: "/dashboard/company/contact" },
        { text: "Partners", href: "/dashboard/company/partners" },
        { text: "Legal", href: "/dashboard/company/legal" }
      ]
    },
    {
      title: "Solutions", // Section title
      links: [
        { text: "Startups", href: "/dashboard/solutions/startups" },
        { text: "Enterprise", href: "/dashboard/solutions/enterprise" },
        { text: "Education", href: "/dashboard/solutions/education" },
        { text: "Teams", href: "/dashboard/solutions/teams" },
        { text: "Individual", href: "/dashboard/solutions/individual" },
        { text: "Compare", href: "/dashboard/solutions/compare" }
      ]
    },
    {
      title: "Support", // Section title
      links: [
        { text: "Help Center", href: "/dashboard/support/help-center" },
        { text: "Status", href: "/dashboard/support/status" },
        { text: "Training", href: "/dashboard/support/training" },
        { text: "FAQs", href: "/dashboard/support/faqs" },
        { text: "Forums", href: "/dashboard/support/forums" },
        { text: "Contact", href: "/dashboard/support/contact" }
      ]
    }
  ];

  const socialLinks: SocialIconProps[] = [
    { Icon: Github, href: "https://github.com/harshitduggal1", label: "Github" },
    { Icon: Twitter, href: "https://x.com/harshitduggal5", label: "Twitter" },
    { Icon: Instagram, href: "https://instagram.com/harshitduggal", label: "Instagram" },
    { Icon: Linkedin, href: "https://linkedin.com/in/harshitduggal", label: "LinkedIn" },
    { Icon: Facebook, href: "https://facebook.com/harshitduggal", label: "Facebook" },
    { Icon: Youtube, href: "https://youtube.com/harshitduggal", label: "Youtube" }
  ];

  return (
    <footer className="relative bg-black py-24 text-gray-300 overflow-hidden"> // Footer styling
      {/* Ambient background gradients */}
      <div className="bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),transparent_50%)] absolute inset-0" />
      <div className="bg-[radial-gradient(ellipse_at_bottom,rgba(120,119,198,0.15),transparent_50%)] absolute inset-0" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
      
      <div className="relative mx-auto px-6 max-w-7xl"> // Container for footer content
        {/* Main Footer Grid */}
        <div className="gap-x-8 gap-y-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {footerData.map((section, index) => (
            <FooterSection key={index} {...section} /> // Render footer sections
          ))}
        </div>

        {/* Gradient Divider */}
        <div className="relative my-16 h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600 to-transparent blur-sm" />
        </div>

        {/* Social Links and Copyright */}
        <div className="flex flex-col items-center space-y-8">
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((link) => (
              <div className="relative group" key={link.label}>
                <SocialIcon {...link} /> // Render social icon
                <div className="group-hover:from-purple-500/20 group-hover:to-blue-500/60 absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300" />
              </div>
            ))}
          </div>

          <p className="bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 font-semibold text-center text-lg text-transparent tracking-wide">
            © {new Date().getFullYear()} Flux - IO Enterprise Software. All rights reserved. // Copyright notice
          </p>
        </div>

        {/* Bottom accent gradient */}
        <div className="right-0 bottom-0 left-0 absolute h-1">
          <div className="relative h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 opacity-40 blur-lg" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-30 blur-md" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter; // Exporting the ModernFooter component