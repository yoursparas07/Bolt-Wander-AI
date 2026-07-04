import { BookOpen, Share2, Map, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Map,
    title: 'Tell us your world',
    desc: 'Choose your interest — heritage, food, art, nightlife, or nature. Set your budget and the time you have.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'We match the depth',
    desc: 'Our logic prioritizes local artisans and hidden gems when you choose authentic. Never generic — always branching.',
  },
  {
    number: '03',
    icon: BookOpen,
    title: 'Hear the real story',
    desc: 'Each recommendation carries a narrative, not a fact sheet — written as a local elder might tell it.',
  },
  {
    number: '04',
    icon: Share2,
    title: 'Share the culture',
    desc: 'Every place comes with a ready-to-post caption and story blurb. Turn discovery into content that promotes heritage.',
  },
];

export default function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="py-20 bg-night-800"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-label text-marigold-400 mb-3">The process</p>
          <h2 id="how-it-works-heading" className="font-fraunces text-4xl text-ivory-100">
            How Wanderlore works
          </h2>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
          {steps.map(({ number, icon: Icon, title, desc }) => (
            <li
              key={number}
              className="relative bg-night-700 border border-night-600 rounded-2xl p-6 group hover:border-marigold-600 transition-colors duration-300"
            >
              {/* Number */}
              <span className="font-mono text-5xl font-500 text-night-600 group-hover:text-marigold-700 transition-colors duration-300 leading-none block mb-4" aria-hidden="true">
                {number}
              </span>

              {/* Icon */}
              <div className="w-10 h-10 bg-marigold-500/20 text-marigold-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-marigold-500/30 transition-colors">
                <Icon size={20} aria-hidden="true" />
              </div>

              <h3 className="font-fraunces text-lg text-ivory-100 mb-2">{title}</h3>
              <p className="text-sm text-night-300 font-work-sans leading-relaxed">{desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
