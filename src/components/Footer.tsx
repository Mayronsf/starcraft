import { motion } from 'framer-motion';
import { MessageCircle, Server, BookOpen } from 'lucide-react';

type FooterProps = {
  onOpenRules: () => void;
};

export default function Footer({ onOpenRules }: FooterProps) {
  const links = [
    { icon: MessageCircle, label: 'Discord', href: 'https://discord.gg/Zxa3N3kX7F', external: true },
    { icon: Server, label: 'IP do Servidor', href: '#' },
    { icon: BookOpen, label: 'Regras', href: '#', onClick: onOpenRules },
  ];

  return (
    <footer className="relative bg-deep-black border-t border-ancient-gold/20 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {links.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              onClick={(e) => {
                if (!link.onClick) return;
                e.preventDefault();
                link.onClick();
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center gap-2 text-parchment/70 hover:text-ancient-gold transition-colors duration-300 font-body"
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </motion.a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-narrative text-parchment/50 text-sm text-center italic"
        >
          "Cada era termina com fogo. Mas do fogo, sempre nasce algo novo."
        </motion.p>
      </div>
    </footer>
  );
}
