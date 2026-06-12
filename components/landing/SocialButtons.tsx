"use client";
import React from 'react';

interface SocialLink {
  id: string;
  href: string;
  icon: React.ReactNode;
  colorClass: string; 
  rotation: string;    
}

const SocialButtons: React.FC = () => {
  const links: SocialLink[] = [
    {
      id: 'instagram',
      href: 'https://www.instagram.com/proyectorunaflow',
      rotation: 'hover:rotate-3',
      colorClass: 'border-pink-500/20 hover:border-pink-500/50 hover:shadow-pink-500/30 hover:from-pink-500/10',
      icon: (
        <svg viewBox="0 0 448 512" className="w-7 h-7 fill-current text-pink-500 group-hover:text-pink-400 transition-colors duration-300">
          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
        </svg>
      ),
    },
    {
      id: 'tiktok',
      href: 'https://www.tiktok.com/@proyectorunaflow',
      rotation: 'hover:-rotate-2',
      colorClass: 'border-white/20 hover:border-white/50 hover:shadow-cyan-500/30 hover:from-white/10',
      icon: (
        <svg viewBox="0 0 448 512" className="w-7 h-7 fill-current text-white group-hover:text-cyan-400 transition-colors duration-300">
          <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.32c7.12 23.96 20.69 45.38 39.14 61.75a121.06 121.06 0 0 0 81.77 25.84z" />
        </svg>
      ),
    },
    {
      id: 'discord',
      href: 'https://discord.gg/DzPw2VGBX',
      rotation: 'hover:rotate-2',
      colorClass: 'border-indigo-500/20 hover:border-indigo-500/50 hover:shadow-indigo-500/30 hover:from-indigo-500/10',
      icon: (
        <svg viewBox="0 0 640 512" className="w-7 h-7 fill-current text-indigo-500 group-hover:text-indigo-400 transition-colors duration-300">
          <path d="M524.531 69.836a1.5 1.5 0 0 0-.764-.7A485.065 485.065 0 0 0 404.081 32.03a1.816 1.816 0 0 0-1.923.91 337.461 337.461 0 0 0-14.906 30.656 447.848 447.848 0 0 0-134.426 0 309.541 309.541 0 0 0-15.135-30.656 1.812 1.812 0 0 0-1.924-.91 483.689 483.689 0 0 0-119.688 37.107 1.712 1.712 0 0 0-.788.676C39.068 183.651 18.186 294.69 28.43 404.354a2.016 2.016 0 0 0 .765 1.375 487.666 487.666 0 0 0 146.825 74.189 1.9 1.9 0 0 0 2.063-.676A348.2 348.2 0 0 0 208.12 430.4a1.819 1.819 0 0 0-1.017-2.588 328.888 328.888 0 0 1-45.59-21.758 1.807 1.807 0 0 1-.176-3.006c3.037-2.273 6.033-4.655 8.885-7.112a1.8 1.8 0 0 1 1.885-.256c91.221 41.619 189.92 41.619 280 0a1.8 1.8 0 0 1 1.887.256c2.852 2.457 5.848 4.839 8.885 7.112a1.807 1.807 0 0 1-.176 3.006 329.752 329.752 0 0 1-45.59 21.758 1.819 1.819 0 0 0-1.017 2.588 351.34 351.34 0 0 0 20.041 48.353 1.9 1.9 0 0 0 2.063.676 486.248 486.248 0 0 0 146.825-74.189 2.016 2.016 0 0 0 .765-1.375c11.776-126.31-20.158-236.427-101.444-334.518zM209.66 312.78c-28.742 0-52.482-26.387-52.482-58.73s23.364-58.73 52.482-58.73c29.116 0 52.856 26.387 52.856 58.73s-23.364 58.73-52.856 58.73zm180.68 0c-28.742 0-52.482-26.387-52.482-58.73s23.364-58.73 52.482-58.73c29.116 0 52.856 26.387 52.856 58.73s-23.364 58.73-52.856 58.73z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex gap-4 md:gap-6 w-full max-w-fit md:ml-auto">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            p-4 md:p-5 rounded-full backdrop-blur-lg border bg-gradient-to-tr from-black/60 to-black/40 
            shadow-lg transition-all duration-300 ease-out cursor-pointer group relative overflow-hidden
            hover:shadow-2xl hover:scale-110 active:scale-95 active:rotate-0 hover:to-black/40
            ${link.rotation} ${link.colorClass}
          `}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          
          <div className="relative z-10 flex items-center justify-center">
            {link.icon}
          </div>
        </a>
      ))}
    </div>
  );
};

export default SocialButtons;
