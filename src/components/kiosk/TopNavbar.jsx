import Logos from './Logos';
import ExternalLinkButton from './ExternalLinkButton';
import FullscreenButton from './FullscreenButton';

export default function TopNavbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[55] flex items-center justify-between px-4 py-2 bg-white/85 backdrop-blur-md shadow-md border-b border-blue-100">
      <Logos />
      <h1 className="text-xl font-bold text-blue-950 absolute left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">
        מדיניות התגוננות
      </h1>
      <div className="flex items-center gap-3">
        <ExternalLinkButton />
        <FullscreenButton />
      </div>
    </div>
  );
}