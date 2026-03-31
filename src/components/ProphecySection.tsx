import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function ProphecySection() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const floatingDots = useMemo(
    () =>
      Array.from({ length: 6 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      })),
    [],
  );

  const prophecyLines = [
    'Virão quatro.',
    'Não juntos. Não iguais.',
    'Mas necessários — todos.',
    '',
    'O primeiro carregará a espada',
    'e dirá que a força é a única verdade.',
    '',
    'O segundo carregará o trigo',
    'e dirá que a fome é a única mentira.',
    '',
    'O terceiro carregará a balança',
    'e dirá que o equilíbrio é a única esperança.',
    '',
    'O quarto carregará a pedra',
    'e não dirá nada.',
    'Apenas construirá.',
    '',
    'Quando os quatro se erguerem, o mundo terá forma.',
    'Quando os quatro caírem, o mundo lembrará.',
  ];

  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (!inView) return;

    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev < prophecyLines.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [inView, prophecyLines.length]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center bg-deep-black overflow-hidden py-20"
    >
      <div className="relative z-10 max-w-3xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="font-title text-4xl md:text-6xl text-ancient-gold text-center mb-16"
        >
          O Sussurro
        </motion.h2>

        <div className="relative p-8 md:p-12 bg-gradient-to-br from-deep-black via-dark-gray to-deep-black border border-ancient-gold/30 rounded-lg backdrop-blur-sm">
          <div className="space-y-3 mb-12">
            {prophecyLines.slice(0, visibleLines).map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`font-prophecy text-ancient-gold/90 text-lg md:text-2xl leading-relaxed ${
                  line === '' ? 'h-6' : ''
                } ${index === 0 || index === 4 || index === 7 || index === 10 || index === 13 ? 'text-parchment font-semibold' : ''}`}
              >
                {line}
              </motion.p>
            ))}
            {visibleLines < prophecyLines.length && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-2 h-6 bg-ancient-gold ml-1"
              />
            )}
          </div>

          {visibleLines >= prophecyLines.length && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="font-narrative text-parchment/60 text-sm md:text-base italic text-center border-t border-ancient-gold/20 pt-6"
            >
              — Fragmento encontrado em um baú que ninguém se lembra de ter colocado ali.
            </motion.p>
          )}

          <div className="absolute -top-2 -right-2 w-4 h-4 bg-ancient-gold rounded-full opacity-50" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-ancient-gold rounded-full opacity-50" />
        </div>
      </div>

      {floatingDots.map((dot, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + i,
            delay: i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-1 h-1 bg-end-purple rounded-full"
          style={dot}
        />
      ))}

      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-gradient-radial from-end-purple/10 via-transparent to-transparent"
      />
    </section>
  );
}
