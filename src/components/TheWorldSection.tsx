import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Wheat, Pickaxe, Trees, Mountain, Waves } from 'lucide-react';

export default function TheWorldSection() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const regions = [
    {
      icon: Wheat,
      name: 'Planícies Centrais',
      description: 'Terras férteis. Quem controla a comida, controla o povo.',
      color: '#c9a84c',
    },
    {
      icon: Pickaxe,
      name: 'Montanhas do Leste',
      description: 'Ferro, ouro, diamantes. Riqueza bruta sob a rocha.',
      color: '#6b7280',
    },
    {
      icon: Trees,
      name: 'Florestas do Norte',
      description: 'Densas e escuras. Perfeitas para emboscadas e segredos.',
      color: '#10b981',
    },
    {
      icon: Mountain,
      name: 'Desertos do Oeste',
      description: 'Terras duras com templos enterrados que ninguém construiu.',
      color: '#d97706',
    },
    {
      icon: Waves,
      name: 'Oceanos Profundos',
      description: 'Monumentos submersos que brilham nas profundezas.',
      color: '#3b82f6',
    },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-gray via-[#1a1612] to-dark-gray overflow-hidden py-20"
    >
      <div className="relative z-10 max-w-6xl px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="font-title text-4xl md:text-6xl text-ancient-gold text-center mb-8"
        >
          A Terra Sem Nome
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-narrative text-parchment/80 text-lg md:text-xl leading-relaxed text-center mb-16 max-w-3xl mx-auto"
        >
          Uma terra vasta e selvagem, com recursos abundantes mas distribuídos de forma desigual.
          Nenhuma região tinha tudo. Para prosperar, era preciso trocar. Ou conquistar.
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 + 0.5 }}
              className="group relative p-6 bg-deep-black/60 border border-stone-gray/30 rounded-lg backdrop-blur-sm hover:border-ancient-gold/50 transition-all duration-300 hover:transform hover:scale-105"
              style={{
                boxShadow: `0 0 0 0 ${region.color}20`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 30px 0 ${region.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 0 ${region.color}20`;
              }}
            >
              <region.icon
                className="w-10 h-10 mb-4 transition-colors duration-300"
                style={{ color: region.color }}
              />
              <h3 className="font-title text-xl text-ancient-gold mb-3 group-hover:text-parchment transition-colors duration-300">
                {region.name}
              </h3>
              <p className="font-narrative text-parchment/70 text-sm leading-relaxed">
                {region.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI0M5QTg0QyIgb3BhY2l0eT0iLjIiLz48L2c+PC9zdmc+')] bg-repeat" />
      </div>
    </section>
  );
}
