import { Mail, Phone, MessageCircle } from 'lucide-react';
import React from 'react';

const GitHub = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const socialLinks = [
  { icon: GitHub, href: 'https://github.com/OMKAR580', title: 'GitHub' },
  { icon: Mail, href: 'mailto:omkardubey165@gmail.com', title: 'Email' },
  { icon: Phone, href: 'tel:9305240893', title: 'Phone' },
  { icon: MessageCircle, href: 'https://wa.me/919721132989', title: 'WhatsApp' }
];

export const FooterSocial = () => {
  return (
    <div className="flex items-center gap-4">
      {socialLinks.map((item, index) => {
        const Icon = item.icon;
        return (
          <a
            key={index}
            href={item.href}
            title={item.title}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 group"
          >
            <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
          </a>
        );
      })}
    </div>
  );
};

