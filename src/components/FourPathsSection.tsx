import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swords, Wheat, Scale, Blocks } from 'lucide-react';

export default function FourPathsSection() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const paths = [
    {
      icon: Swords,
      title: 'A Espada',
      quote: 'A força é a única lei que o mundo respeita.',
      description: [
        'Alguns responderam à hostilidade com hostilidade.',
        'Empunharam armas, vestiram armaduras,',
        'e juraram que ninguém mais cairia sob sua proteção.',
        '',
        'Ou sob sua lâmina.',
      ],
      color: '#991b1b',
      borderColor: 'border-blood-red/40',
      glowColor: 'shadow-[0_0_30px_rgba(153,27,27,0.3)]',
    },
    {
      icon: Wheat,
      title: 'O Trigo',
      quote: 'Quem controla a fome, controla o mundo.',
      description: [
        'Alguns olharam para a terra e viram não perigo,',
        'mas oportunidade. Plantaram, colheram, multiplicaram.',
        'E quando os guerreiros sentiram fome,',
        'souberam exatamente quem procurar.',
      ],
      color: '#c9a84c',
      borderColor: 'border-ancient-gold/40',
      glowColor: 'shadow-[0_0_30px_rgba(201,168,76,0.3)]',
    },
    {
      icon: Scale,
      title: 'A Balança',
      quote: 'A espada resolve batalhas. A palavra resolve guerras.',
      description: [
        'Alguns recusaram a violência e a ganância.',
        'Buscaram acordos, mediaram conflitos,',
        'e apostaram que a diplomacia',
        'duraria mais que qualquer exército.',
      ],
      color: '#94a3b8',
      borderColor: 'border-stone-gray/40',
      glowColor: 'shadow-[0_0_30px_rgba(148,163,184,0.3)]',
    },
    {
      icon: Blocks,
      title: 'A Pedra',
      quote: 'Impérios caem. Espadas enferrujam. A pedra permanece.',
      description: [
        'Alguns não lutaram, não plantaram, não negociaram.',
        'Construíram.',
        'Muralhas, pontes, monumentos.',
        'Poucos os notaram. Mas o que fizeram',
        'duraria mais que todos os outros.',
      ],
      color: '#6b7280',
      borderColor: 'border-stone-gray/40',
      glowColor: 'shadow-[0_0_30px_rgba(107,115,128,0.3)]',
    },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-deep-black via-[#0f0a00] to-deep-black overflow-hidden py-20"
    >
      <div className="relative z-10 max-w-7xl px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="font-title text-4xl md:text-6xl text-ancient-gold text-center mb-8"
        >
          Quatro Necessidades. Quatro Caminhos.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-narrative text-parchment/80 text-lg md:text-xl leading-relaxed text-center mb-16 max-w-4xl mx-auto"
        >
          O mundo exigia respostas. E de suas necessidades,
          nasceram quatro caminhos — quatro formas de sobreviver, de liderar, de existir.
          <br />
          <br />
          <span className="italic text-ancient-gold">
            Nenhum estava certo. Nenhum estava errado.
            Todos eram necessários.
          </span>
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8">
          {paths.map((path, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
              className={`relative p-8 bg-deep-black/80 border ${path.borderColor} rounded-lg backdrop-blur-sm hover:${path.glowColor} transition-all duration-500 group`}
            >
              <path.icon
                className="w-14 h-14 mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ color: path.color }}
              />

              <h3 className="font-title text-3xl mb-4" style={{ color: path.color }}>
                {path.title}
              </h3>

              <blockquote className="font-narrative text-parchment/90 text-base md:text-lg italic mb-6 pl-4 border-l-2"
                style={{ borderColor: path.color }}
              >
                {path.quote}
              </blockquote>

              <div className="space-y-2">
                {path.description.map((line, i) => (
                  <p
                    key={i}
                    className={`font-narrative text-parchment/80 text-sm md:text-base leading-relaxed ${
                      line === '' ? 'h-2' : ''
                    } ${i === path.description.length - 1 ? 'italic' : ''}`}
                  >
                    {line}
                  </p>
                ))}
              </div>

              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundColor: path.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              delay: i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full bg-ancient-gold blur-3xl"
            style={{
              width: '400px',
              height: '400px',
              left: `${(i * 33)}%`,
              top: `${(i * 25)}%`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
