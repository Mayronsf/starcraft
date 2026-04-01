import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles } from 'lucide-react';

export default function CTASection() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const discordHref = 'https://discord.gg/Zxa3N3kX7F';

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-deep-black via-dark-gray to-deep-black overflow-hidden py-20"
    >
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="space-y-6 mb-12"
        >
          <p className="font-narrative text-parchment/90 text-xl md:text-2xl leading-relaxed">
            O mundo está nascendo.
          </p>
          <p className="font-narrative text-parchment/90 text-xl md:text-2xl leading-relaxed">
            Os clãs ainda não existem.
          </p>
          <p className="font-narrative text-parchment/90 text-xl md:text-2xl leading-relaxed">
            As guerras ainda não foram travadas.
          </p>
          <p className="font-narrative text-parchment/90 text-xl md:text-2xl leading-relaxed">
            As lendas ainda não foram escritas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-8 mb-12"
        >
          <p className="font-title text-3xl md:text-5xl text-ancient-gold leading-relaxed">
            Tudo começa agora.
            <br />
            Tudo começa com você.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1 }}
        >
          <a
            href={discordHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex px-12 py-5 bg-ancient-gold text-deep-black font-title text-xl md:text-2xl font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(201,168,76,0.6)]"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              ENTRAR NO MUNDO
            </span>
            <motion.div
              className="absolute inset-0 bg-parchment"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </a>

          <p className="font-body text-parchment/50 text-sm mt-6">
            StarCraft — A Gênese
          </p>
          <p className="font-narrative text-parchment/60 text-base italic mt-2">
            "O mundo está assistindo. Não o decepcionem."
          </p>
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(10,10,10,0.9)_100%)]" />
    </section>
  );
}
