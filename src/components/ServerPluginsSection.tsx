import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Puzzle } from 'lucide-react';

/**
 * Plugins instalados no servidor. Adicione entradas conforme forem definidos.
 * Opcional: `description` para uma linha curta sobre o que o plugin faz.
 */
export const SERVER_PLUGINS: { name: string; description?: string }[] = [];

type ServerPluginsSectionProps = {
  variant?: 'section' | 'page';
};

export default function ServerPluginsSection({ variant = 'section' }: ServerPluginsSectionProps) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const hasPlugins = SERVER_PLUGINS.length > 0;
  const isPage = variant === 'page';
  const Title = isPage ? motion.h1 : motion.h2;

  return (
    <section
      ref={ref}
      className={`relative flex items-center justify-center bg-gradient-to-b from-deep-black via-[#0c0a06] to-deep-black overflow-hidden py-20 ${
        isPage ? 'min-h-[calc(100vh-4.5rem)]' : 'min-h-[70vh]'
      }`}
    >
      <div className="relative z-10 max-w-4xl px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-ancient-gold/40 bg-ancient-gold/5 mb-6">
            <Puzzle className="w-7 h-7 text-ancient-gold" aria-hidden />
          </div>
          <Title className="font-title text-4xl md:text-5xl text-ancient-gold mb-4">
            Plugins do servidor
          </Title>
          <p className="font-narrative text-parchment/75 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Ferramentas que moldam a experiência no mundo. A lista será atualizada conforme o servidor evolui.
          </p>
        </motion.div>

        {hasPlugins ? (
          <ul className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {SERVER_PLUGINS.map((plugin, index) => (
              <motion.li
                key={`${plugin.name}-${index}`}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.06 }}
                className="relative p-5 md:p-6 rounded-lg border border-ancient-gold/25 bg-deep-black/70 backdrop-blur-sm text-left"
              >
                <h3 className="font-title text-lg md:text-xl text-ancient-gold mb-1">{plugin.name}</h3>
                {plugin.description ? (
                  <p className="font-body text-parchment/70 text-sm md:text-base leading-relaxed">
                    {plugin.description}
                  </p>
                ) : null}
              </motion.li>
            ))}
          </ul>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-lg border border-dashed border-ancient-gold/35 bg-dark-gray/40 px-8 py-12 text-center"
          >
            <p className="font-narrative text-parchment/60 text-lg italic">
              Lista em preparação — em breve os nomes dos plugins aparecerão aqui.
            </p>
          </motion.div>
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            rgba(201, 168, 76, 0.15) 40px,
            rgba(201, 168, 76, 0.15) 41px
          )`,
        }}
      />
    </section>
  );
}
