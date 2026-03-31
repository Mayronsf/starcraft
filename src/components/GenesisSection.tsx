import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function GenesisSection() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const paragraphs = [
    'No princípio, não havia nada além do Éter — uma vastidão infinita e sem forma.',
    'Então, algo despertou. Uma Centelha rasgou o vazio. E de um momento para o outro, havia um mundo.',
    'A terra se espalhou em todas as direções — montanhas, oceanos, florestas, desertos. Perfeita em sua selvageria. Sem caminhos, sem cercas, sem marcas de presença inteligente.',
    'Mas o mundo não estava completamente vazio. Coisas se moviam na escuridão. E nas profundezas, abaixo de tudo, algo pulsava. Lento. Constante. Como o coração de algo adormecido.',
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-gray via-[#0f1729] to-[#1a1f35] overflow-hidden py-20"
    >
      <div className="relative z-10 max-w-4xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="font-title text-4xl md:text-6xl text-ancient-gold text-center mb-16"
        >
          A Gênese
        </motion.h2>

        <div className="space-y-8">
          {paragraphs.map((text, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.3 + 0.5 }}
              className="font-narrative text-parchment/90 text-lg md:text-xl leading-relaxed text-center"
            >
              {text}
            </motion.p>
          ))}
        </div>
      </div>

      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 0.1 } : {}}
            transition={{ duration: 2, delay: i * 0.2 }}
            className="absolute rounded-full bg-ancient-gold blur-3xl"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
