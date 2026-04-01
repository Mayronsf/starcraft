import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { MessageCircle, Server, BookOpen, Puzzle, ScrollText } from 'lucide-react';

type FooterProps = {
  onOpenRules: () => void;
};

type FooterLinkItem =
  | { icon: LucideIcon; label: string; to: string }
  | { icon: LucideIcon; label: string; href: string; external?: boolean; onClick?: () => void };

export default function Footer({ onOpenRules }: FooterProps) {
  const links: FooterLinkItem[] = [
    { icon: MessageCircle, label: 'Discord', href: 'https://discord.gg/Zxa3N3kX7F', external: true },
    { icon: Puzzle, label: 'Plugins', to: '/plugins' },
    { icon: ScrollText, label: 'Wiki', to: '/wiki' },
    { icon: Server, label: 'IP do Servidor', href: '#' },
    { icon: BookOpen, label: 'Regras', href: '#', onClick: onOpenRules },
  ];

  const linkClass =
    'flex items-center gap-2 text-parchment/70 hover:text-ancient-gold transition-colors duration-300 font-body';

  return (
    <footer className="relative bg-deep-black border-t border-ancient-gold/20 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {links.map((link, index) => {
            const motionProps = {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.5, delay: index * 0.1 },
            };

            if ('to' in link) {
              return (
                <Link key={link.label} to={link.to} className={linkClass}>
                  <motion.span className="flex items-center gap-2" {...motionProps}>
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </motion.span>
                </Link>
              );
            }

            return (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                  if (!link.onClick) return;
                  e.preventDefault();
                  link.onClick();
                }}
                {...motionProps}
                className={linkClass}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </motion.a>
            );
          })}
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
