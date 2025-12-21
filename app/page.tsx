import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Palette, Share2, Code2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-[#0a0a0a] text-white selection:bg-indigo-500/30">

      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        {/* Rotating Star Field */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] animate-spin-slow opacity-30">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
                transform: `scale(${Math.random() * 0.5 + 0.5})`,
                animation: `pulse ${Math.random() * 3 + 2}s infinite ease-in-out`
              }}
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <div
              key={`sm-${i}`}
              className="absolute w-0.5 h-0.5 bg-indigo-200 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.4 + 0.1,
              }}
            />
          ))}
        </div>

        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] rotate-12" />
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/1/18/Transparent_Square_Tiles_Texture.png')] opacity-[0.03] bg-repeat" />
      </div>

      <div className="z-10 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center text-center">

        {/* Badge */}
        <div className="mb-8 animate-fade-in-down">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
            <Sparkles size={16} />
            <span>The Most Aesthetic Code Editor</span>
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 animate-fade-in-up space-y-4">
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 drop-shadow-sm">
            Make Your Code
          </span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg">
            Look Beautiful.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 animate-fade-in-up animation-delay-200 leading-relaxed">
          Create stunning, shareable code snippets in seconds. <br className="hidden md:block" />
          Choose from elegant themes, fonts, and backgrounds to make your work shine.
        </p>

        {/* CTA Button */}
        <div className="animate-fade-in-up animation-delay-400 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <Link href="/editor">
            <button className="relative px-8 py-4 bg-black rounded-xl leading-none flex items-center gap-3 transition-transform duration-200 group-hover:-translate-y-1 active:scale-95">
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white">
                Let's Try
              </span>
              <ArrowRight className="text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Features Preview */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl animate-fade-in-up animation-delay-600">
          {[
            {
              icon: <Palette size={24} className="text-pink-400" />,
              title: "Modern Themes",
              desc: "Curated collection of aesthetic themes and gradients."
            },
            {
              icon: <Code2 size={24} className="text-indigo-400" />,
              title: "Smart Syntax",
              desc: "Auto-detection for 20+ programming languages."
            },
            {
              icon: <Zap size={24} className="text-yellow-400" />,
              title: "Instant Export",
              desc: "Export high-resolution PNG, JPG, or SVG in one click."
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm flex flex-col items-center">
              <div className="p-3 rounded-xl bg-white/5 mb-4 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-200">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-24 text-sm text-gray-600 animate-fade-in flex flex-col items-center gap-4">
          <p>Designed for developers, by developers.</p>
          {/* Product Hunt Badge - Static for Landing */}
          <a
            href="https://www.producthunt.com/products/syntaray?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-syntaray"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1052897&theme=dark"
              alt="SyntaRay - Create beautiful code snippets | Product Hunt"
              style={{ width: '200px', height: '43px' }}
              width="200"
              height="43"
            />
          </a>
        </footer>

      </div>
    </main>
  );
}
