import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Flame, Sparkles } from 'lucide-react';

export default function DimensionsSection() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
    >
      <div className="relative z-10 max-w-6xl px-6 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="relative p-8 md:p-10 bg-gradient-to-br from-blood-red/20 to-deep-black border border-blood-red/30 rounded-lg backdrop-blur-sm overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blood-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <Flame className="w-12 h-12 text-blood-red mb-6 relative z-10" />

            <h3 className="font-title text-3xl md:text-4xl text-blood-red mb-6 relative z-10">
              O Submundo
            </h3>

            <div className="space-y-4 relative z-10">
              <p className="font-narrative text-parchment/90 text-base md:text-lg leading-relaxed">
                Um inferno vermelho além dos portais de obsidiana.
                Hostil. Mortal. Mas cheio de recursos raros
                e uma propriedade que muda tudo:
              </p>
              <p className="font-narrative text-parchment/90 text-base md:text-lg leading-relaxed italic">
                a distância é comprimida.
              </p>
              <p className="font-narrative text-blood-red text-lg md:text-xl leading-relaxed font-semibold mt-6">
                Quem controlar o Submundo
                <br />
                controlará as rotas do mundo.
              </p>
            </div>

            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blood-red/20 rounded-full blur-3xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative p-8 md:p-10 bg-gradient-to-br from-end-purple/20 to-deep-black border border-end-purple/30 rounded-lg backdrop-blur-sm overflow-hidden group"
          >
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-t from-end-purple/10 to-transparent"
            />

            <Sparkles className="w-12 h-12 text-end-purple mb-6 relative z-10" />

            <h3 className="font-title text-3xl md:text-4xl text-end-purple mb-6 relative z-10">
              A Dimensão Selada
            </h3>

            <div className="space-y-4 relative z-10">
              <p className="font-narrative text-parchment/90 text-base md:text-lg leading-relaxed">
                Algo mais existe.
                Partículas estranhas no ar.
                Criaturas de olhos púrpura que aparecem à noite.
                Tremores vindos de lugar nenhum.
              </p>
              <p className="font-narrative text-parchment/90 text-base md:text-lg leading-relaxed">
                Uma dimensão trancada.
                Selada por quem veio antes de nós.
                Ninguém sabe o que há lá dentro.
              </p>
              <p className="font-narrative text-end-purple text-lg md:text-xl leading-relaxed font-semibold mt-6 italic">
                Ainda.
              </p>
            </div>

            <div className="absolute top-0 left-0 w-32 h-32 bg-end-purple/20 rounded-full blur-3xl" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-end-purple/30 rounded-full blur-2xl"
            />
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-dark-gray via-deep-black to-deep-black" />
    </section>
  );
}
