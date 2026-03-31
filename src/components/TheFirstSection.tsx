import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Wheat, Eye, Skull } from 'lucide-react';

export default function TheFirstSection() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const traits = [
    {
      icon: Wheat,
      title: 'A fome',
      description: 'o mundo não oferecia nada de graça.',
    },
    {
      icon: Eye,
      title: 'A curiosidade',
      description: 'cada colina podia esconder um segredo.',
    },
    {
      icon: Skull,
      title: 'O medo',
      description: 'as noites eram longas, e algo caçava na escuridão.',
    },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1f35] via-[#251f1a] to-dark-gray overflow-hidden py-20"
    >
      <div className="relative z-10 max-w-4xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="font-title text-4xl md:text-6xl text-ancient-gold text-center mb-16"
        >
          Os Primeiros
        </motion.h2>

        <div className="space-y-8 mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-narrative text-parchment/90 text-lg md:text-xl leading-relaxed text-center italic"
          >
            Eles não nasceram neste mundo.
          </motion.p>

          {[
            'Apareceram sem memória, sem pertences, sem nome. Cada um acordou sozinho, em algum ponto daquela terra vasta, com nada além do próprio corpo e uma sensação inexplicável de propósito.',
            'Todos compartilhavam três coisas:',
          ].map((text, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 + 0.6 }}
              className="font-narrative text-parchment/90 text-lg md:text-xl leading-relaxed text-center"
            >
              {text}
            </motion.p>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {traits.map((trait, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 + 1 }}
              className="flex flex-col items-center text-center p-6 bg-deep-black/40 border border-ancient-gold/20 rounded-lg backdrop-blur-sm hover:border-ancient-gold/40 transition-all duration-300"
            >
              <trait.icon className="w-12 h-12 text-ancient-gold mb-4" />
              <h3 className="font-title text-xl text-ancient-gold mb-2">{trait.title}</h3>
              <p className="font-narrative text-parchment/70 text-sm">{trait.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 2 }}
          className="space-y-6"
        >
          <p className="font-narrative text-parchment/90 text-lg md:text-xl leading-relaxed text-center">
            Mas havia um mistério: os que caíam, retornavam.
            <br />
            O mundo se recusava a deixá-los partir.
          </p>
          <p className="font-narrative text-parchment/70 text-lg md:text-xl leading-relaxed text-center italic">
            A morte não era o fim. Mas perder tudo... isso era real.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
