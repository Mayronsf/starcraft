import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { X } from 'lucide-react';

type RulesModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function RulesModal({ open, onClose }: RulesModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={() => onClose()}
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Regras do mundo"
            className="relative w-full max-w-3xl rounded-xl border shadow-[0_0_60px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.22 }}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#1a1a1a', borderColor: 'rgba(201,168,76,0.45)' }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#e8e4d9]/70 hover:text-[#e8e4d9] transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="px-6 py-7 md:px-8 md:py-8">
              <h2 className="font-title text-2xl md:text-3xl text-[#e8e4d9] mb-5 pr-12">
                ⚔️ LEIS DO MUNDO — STARCRAFT: A GÊNESE
              </h2>

              <div className="max-h-[70vh] overflow-y-auto pr-2 text-[#e8e4d9] font-body">
                <div className="space-y-5 text-base leading-relaxed">
                  <p className="font-narrative text-[#e8e4d9]/90">
                    Estas são as leis que regem esta terra. Quebrá-las é desafiar a própria ordem do mundo — e o mundo sempre
                    cobra.
                  </p>

                  <div className="space-y-4">
                    <section className="space-y-1">
                      <h3 className="font-title text-lg text-[#e8e4d9]">I. RESPEITO ENTRE OS PRIMEIROS</h3>
                      <p className="text-[#e8e4d9]/90">
                        Somos todos recém-chegados nesta terra. Ofensas, discriminação, assédio ou qualquer forma de hostilidade
                        FORA do roleplay são proibidas. Dentro do jogo, seja o vilão que quiser. Fora dele, seja humano.
                      </p>
                    </section>

                    <section className="space-y-1">
                      <h3 className="font-title text-lg text-[#e8e4d9]">II. O ROLEPLAY É SAGRADO</h3>
                      <p className="text-[#e8e4d9]/90">
                        Este é um servidor de história. Suas ações dentro do jogo fazem parte da narrativa. Mate, roube, traia —
                        se fizer sentido para sua história. Mas griefing sem propósito (destruir por destruir, sem contexto
                        narrativo) é proibido.
                      </p>
                    </section>

                    <section className="space-y-1">
                      <h3 className="font-title text-lg text-[#e8e4d9]">III. CONSTRUÇÕES SÃO LEGADO</h3>
                      <p className="text-[#e8e4d9]/90">
                        Construções de outros jogadores são parte da história do mundo. Não destrua construções alheias sem um
                        motivo narrativo legítimo (guerra declarada, conquista de território, etc). Destruição gratuita será
                        punida.
                      </p>
                    </section>

                    <section className="space-y-1">
                      <h3 className="font-title text-lg text-[#e8e4d9]">IV. HACKS E TRAPAÇAS SÃO BANIMENTO</h3>
                      <p className="text-[#e8e4d9]/90">
                        Clientes modificados, x-ray, fly, kill aura ou qualquer forma de trapaça resultam em banimento
                        permanente. Sem exceções. Sem apelação. Sem segunda chance.
                      </p>
                    </section>

                    <section className="space-y-1">
                      <h3 className="font-title text-lg text-[#e8e4d9]">V. O END É SELADO</h3>
                      <p className="text-[#e8e4d9]/90">
                        A dimensão do End está trancada por forças além da nossa compreensão. Tentar acessá-la antes que o selo
                        seja quebrado oficialmente é proibido. Quando chegar a hora, todos saberão.
                      </p>
                    </section>

                    <section className="space-y-1">
                      <h3 className="font-title text-lg text-[#e8e4d9]">VI. ALIANÇAS E GUERRAS</h3>
                      <p className="text-[#e8e4d9]/90">
                        Alianças, traições e guerras são permitidas e encorajadas — desde que façam parte da narrativa. Declare
                        suas intenções. Guerras precisam ser comunicadas à staff para serem registradas nas crônicas.
                      </p>
                    </section>

                    <section className="space-y-1">
                      <h3 className="font-title text-lg text-[#e8e4d9]">VII. COMÉRCIO É LIVRE</h3>
                      <p className="text-[#e8e4d9]/90">
                        Compre, venda, troque, monopolize. A economia é selvagem como o mundo. Golpes comerciais fazem parte do
                        jogo — mas lembre-se: a reputação é o bem mais valioso que existe.
                      </p>
                    </section>

                    <section className="space-y-1">
                      <h3 className="font-title text-lg text-[#e8e4d9]">VIII. A STAFF É O DESTINO</h3>
                      <p className="text-[#e8e4d9]/90">
                        A equipe de administração atua como as forças do mundo. Suas decisões são finais. Eventos, mudanças
                        climáticas, invasões e anomalias fazem parte da narrativa. Não questione o destino — adapte-se a ele.
                      </p>
                    </section>

                    <section className="space-y-1">
                      <h3 className="font-title text-lg text-[#e8e4d9]">IX. DIVIRTA-SE</h3>
                      <p className="text-[#e8e4d9]/90">
                        Acima de tudo, este mundo existe para ser vivido. Faça amigos, faça inimigos, construa impérios ou ande
                        sozinho. Mas aproveite cada momento. O mundo está assistindo.
                      </p>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

