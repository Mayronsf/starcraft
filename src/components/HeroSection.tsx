import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const lines = [
    'Antes dos reinos.',
    'Antes das guerras.',
    'Antes dos nomes que o mundo jamais esqueceria.',
    '',
    'Havia apenas a terra.',
    'Vasta. Silenciosa. Esperando.',
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-deep-black via-deep-black to-dark-gray overflow-hidden">
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div className="space-y-4 mb-16">
          {lines.map((line, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: index * 0.8,
                ease: 'easeOut',
              }}
              className={`font-narrative text-parchment ${
                line === '' ? 'h-8' : 'text-xl md:text-2xl leading-relaxed'
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.5,
            delay: lines.length * 0.8 + 0.5,
            ease: 'easeOut',
          }}
          className="mb-8"
        >
          <h1 className="font-title text-5xl md:text-7xl lg:text-8xl font-black text-ancient-gold mb-6 drop-shadow-[0_0_30px_rgba(201,168,76,0.5)]">
            STARCRAFT
          </h1>
          <h2 className="font-title text-3xl md:text-4xl lg:text-5xl text-ancient-gold/80 mb-8">
            A Gênese
          </h2>
          <p className="font-narrative text-parchment/80 text-lg md:text-xl italic">
            O mundo está nascendo. A história é sua.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            delay: lines.length * 0.8 + 2,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 0.5,
          }}
          className="flex flex-col items-center gap-2"
        >
          <p className="font-body text-parchment/60 text-sm uppercase tracking-widest">
            Descubra
          </p>
          <ChevronDown className="text-ancient-gold w-8 h-8" />
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(10,10,10,0.8)_100%)]" />
    </section>
  );
}
