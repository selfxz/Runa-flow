import Link from "next/link";
import SocialButtons from "./SocialButtons";

export default function Footer() {
  return (
    <footer className="w-full py-10 px-6 md:px-12 lg:px-20 bg-black border-t border-green-600/10 mt-auto">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left: Copyright */}
        <div className="flex flex-col gap-1 items-center md:items-start flex-shrink-0">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
             © 2026 Runa Flow
           </p>
           <p className="text-[8px] text-green-500/30 uppercase tracking-[0.2em] italic">
             Self desing
           </p>
        </div>

        {/* Right: SocialButtons */}
        <div className="w-full md:w-auto flex justify-center md:justify-end">
          <SocialButtons />
        </div>
      </div>
    </footer>
  );
}