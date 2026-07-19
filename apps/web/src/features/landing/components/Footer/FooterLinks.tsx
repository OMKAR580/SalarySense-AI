import React from 'react';

import { FOOTER_SECTIONS } from './constants';

export const FooterLinks = () => {
  return (
    <>
      {FOOTER_SECTIONS.map((section, index) => (
        <div key={index} className="col-span-1 lg:col-span-2">
          <h4 className="text-white font-semibold mb-6">{section.title}</h4>
          <ul className="flex flex-col gap-4">
            {section.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <a 
                  href={link.href}
                  className="text-gray-400 text-sm hover:text-white hover:translate-x-1 inline-block transition-all duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full opacity-50" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};
