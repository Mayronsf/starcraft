import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Trash2, Upload, UserPlus, X } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import {
  deleteCharacter,
  fetchCharacters,
  getSkinPublicUrl,
  insertCharacter,
  type CharacterRow,
} from '../lib/characterSheetsDb';

const MinecraftSkinViewer3D = lazy(() => import('./MinecraftSkinViewer3D'));

type Character = {
  id: string;
  nome: string;
  classe: string;
  descricao: string;
  skinUrl?: string;
  /** Caminho no bucket (para apagar o ficheiro ao remover) */
  skinPath?: string | null;
};

const MAX_SKIN_FILE_BYTES = 1_500_000;

function mapRowToCharacter(row: CharacterRow): Character {
  return {
    id: row.id,
    nome: row.nome,
    classe: row.classe,
    descricao: row.descricao,
    skinUrl: getSkinPublicUrl(row.skin_path),
    skinPath: row.skin_path,
  };
}

function MinecraftAvatar({ size = 'small', accent = '#c9a84c' }: { size?: 'small' | 'large'; accent?: string }) {
  const box = size === 'small' ? 'w-[64px] h-[84px]' : 'w-[140px] h-[180px]';
  const head = size === 'small' ? 'w-7 h-7' : 'w-14 h-14';
  const body = size === 'small' ? 'w-9 h-11' : 'w-20 h-24';
  const arm = size === 'small' ? 'w-2.5 h-8' : 'w-5 h-14';
  const leg = size === 'small' ? 'w-3.5 h-10' : 'w-7 h-[72px]';
  const border = size === 'small' ? 'border-[2px]' : 'border-[3px]';

  return (
    <div className={`relative ${box} mx-auto`}>
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-0 ${head} ${border} border-deep-black bg-[#f2d3bb]`}
      />
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-[26px] md:top-[30px] ${body} ${border} border-deep-black`}
        style={{
          backgroundImage: `linear-gradient(180deg, ${accent} 0%, #0f0f0f 100%)`,
        }}
      />
      <div
        className={`absolute left-[6px] md:left-[10px] top-[32px] md:top-[40px] ${arm} ${border} border-deep-black bg-stone-gray`}
      />
      <div
        className={`absolute right-[6px] md:right-[10px] top-[32px] md:top-[40px] ${arm} ${border} border-deep-black bg-stone-gray`}
      />
      <div
        className={`absolute left-[20px] md:left-[38px] bottom-0 ${leg} ${border} border-deep-black bg-[#20242b]`}
      />
      <div
        className={`absolute right-[20px] md:right-[38px] bottom-0 ${leg} ${border} border-deep-black bg-[#20242b]`}
      />
    </div>
  );
}

/** Imagem da skin em formato retrato: mostra o personagem inteiro (render ou textura) sem cortar. */
function SkinFullBodyView({
  src,
  variant,
  className = '',
}: {
  src: string;
  variant: 'card' | 'panel' | 'formPreview';
  className?: string;
}) {
  const [pixelated, setPixelated] = useState(true);

  const boxClass =
    variant === 'card'
      ? 'h-[118px] w-[76px] sm:h-[126px] sm:w-[82px]'
      : variant === 'panel'
        ? 'h-[min(52vh,420px)] w-[min(88vw,220px)] md:w-[240px]'
        : 'h-[120px] w-[78px]';

  return (
    <div
      className={`skin-view-bg relative flex shrink-0 items-center justify-center overflow-hidden rounded-md border-[2px] border-deep-black ${boxClass} ${className}`}
    >
      <img
        src={src}
        alt=""
        className="max-h-full max-w-full object-contain object-center"
        style={{ imageRendering: pixelated ? 'pixelated' : 'auto' }}
        onLoad={(e) => {
          const { naturalWidth, naturalHeight } = e.currentTarget;
          setPixelated(naturalWidth <= 128 && naturalHeight <= 128);
        }}
        draggable={false}
      />
    </div>
  );
}

/** Texturas de skin (atlas ~quadrado) → 3D; imagens altas (render pronto) → 2D no xadrez. */
function SkinDisplay({
  src,
  variant,
  className = '',
}: {
  src: string;
  variant: 'card' | 'panel' | 'formPreview';
  className?: string;
}) {
  const [mode, setMode] = useState<'loading' | '3d' | '2d'>('loading');

  const handleViewer3DError = useCallback(() => {
    setMode('2d');
  }, []);

  useEffect(() => {
    setMode('loading');
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const r = h / Math.max(w, 1);
      setMode(r > 1.28 ? '2d' : '3d');
    };
    img.onerror = () => setMode('2d');
    img.src = src;
  }, [src]);

  const dims =
    variant === 'card'
      ? { w: 100, h: 146 }
      : variant === 'panel'
        ? { w: 240, h: 420 }
        : { w: 88, h: 128 };

  if (mode === 'loading') {
    return (
      <div
        className={`skin-view-bg mx-auto overflow-hidden rounded-md border-[2px] border-deep-black ${className}`}
        style={{ width: dims.w, height: dims.h }}
        aria-hidden
      />
    );
  }

  if (mode === '3d') {
    return (
      <Suspense
        fallback={
          <div
            className={`skin-view-bg mx-auto overflow-hidden rounded-md border-[2px] border-deep-black ${className}`}
            style={{ width: dims.w, height: dims.h }}
            aria-hidden
          />
        }
      >
        <MinecraftSkinViewer3D
          skinUrl={src}
          width={dims.w}
          height={dims.h}
          enableControls={variant === 'panel'}
          className={className}
          onLoadError={handleViewer3DError}
        />
      </Suspense>
    );
  }

  return <SkinFullBodyView src={src} variant={variant} className={className} />;
}

function CharacterPortrait({
  size,
  accent,
  skinUrl,
}: {
  size: 'small' | 'large';
  accent: string;
  skinUrl?: string;
}) {
  if (skinUrl) {
    return <SkinDisplay src={skinUrl} variant={size === 'small' ? 'card' : 'panel'} className="mx-auto" />;
  }

  return <MinecraftAvatar size={size} accent={accent} />;
}

export default function CharacterSheetsSection() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [personagens, setPersonagens] = useState<Character[]>([]);
  const [listLoading, setListLoading] = useState(!!isSupabaseConfigured());
  const [listError, setListError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [novoPersonagemOpen, setNovoPersonagemOpen] = useState(false);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [novoNome, setNovoNome] = useState('');
  const [novaClasse, setNovaClasse] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novaSkinDataUrl, setNovaSkinDataUrl] = useState<string | null>(null);
  const [skinUploadError, setSkinUploadError] = useState<string | null>(null);
  const skinFileInputRef = useRef<HTMLInputElement>(null);
  const pendingSkinFileRef = useRef<File | null>(null);

  const selected = useMemo(
    () => (selectedId === null ? null : personagens.find((p) => p.id === selectedId) ?? null),
    [selectedId, personagens],
  );

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setListLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setListLoading(true);
      setListError(null);
      try {
        const rows = await fetchCharacters();
        if (!cancelled) setPersonagens(rows.map(mapRowToCharacter));
      } catch (e) {
        if (!cancelled) {
          setListError(e instanceof Error ? e.message : 'Erro ao carregar as fichas.');
        }
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!novoPersonagemOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNovoPersonagemOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [novoPersonagemOpen]);

  const classeCor: Record<string, string> = {
    Guerreiro: '#991b1b',
    Mago: '#8b5cf6',
    Arqueiro: '#16a34a',
    Tank: '#6b7280',
  };

  const handleCardClick = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleClose = () => setSelectedId(null);

  const handleRemover = async (personagem: Character) => {
    if (!isSupabaseConfigured()) return;
    try {
      await deleteCharacter(personagem.id, personagem.skinPath ?? null);
      setPersonagens((prev) => prev.filter((p) => p.id !== personagem.id));
      setSelectedId((cur) => (cur === personagem.id ? null : cur));
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Não foi possível remover.');
    }
  };

  const clearNovaSkin = () => {
    setNovaSkinDataUrl(null);
    pendingSkinFileRef.current = null;
    setSkinUploadError(null);
    if (skinFileInputRef.current) skinFileInputRef.current.value = '';
  };

  const handleSkinFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSkinUploadError(null);
    pendingSkinFileRef.current = null;
    if (!file) {
      setNovaSkinDataUrl(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setSkinUploadError('Use um arquivo de imagem (PNG ou JPEG).');
      clearNovaSkin();
      return;
    }
    if (file.size > MAX_SKIN_FILE_BYTES) {
      setSkinUploadError('Imagem muito grande (máx. ~1,5 MB).');
      setNovaSkinDataUrl(null);
      if (skinFileInputRef.current) skinFileInputRef.current.value = '';
      return;
    }
    pendingSkinFileRef.current = file;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') setNovaSkinDataUrl(result);
    };
    reader.onerror = () => setSkinUploadError('Não foi possível ler o arquivo.');
    reader.readAsDataURL(file);
  };

  const handleAdicionar = async (e: FormEvent) => {
    e.preventDefault();
    const nome = novoNome.trim();
    const classe = novaClasse.trim();
    const descricao = novaDescricao.trim();
    if (!nome || !classe || !isSupabaseConfigured()) return;

    setFormSaving(true);
    setFormError(null);
    try {
      const id = crypto.randomUUID();
      await insertCharacter({
        id,
        nome,
        classe,
        descricao: descricao || '—',
        skinFile: pendingSkinFileRef.current,
      });
      const rows = await fetchCharacters();
      setPersonagens(rows.map(mapRowToCharacter));
      setNovoNome('');
      setNovaClasse('');
      setNovaDescricao('');
      clearNovaSkin();
      setNovoPersonagemOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Não foi possível guardar o personagem.');
    } finally {
      setFormSaving(false);
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-deep-black via-[#111112] to-dark-gray overflow-hidden py-20"
    >
      {/* Botão flutuante: abre o formulário "Novo personagem" */}
      <button
        type="button"
        onClick={() => setNovoPersonagemOpen(true)}
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-full border border-ancient-gold/60 bg-deep-black/95 px-5 py-3.5 font-title text-sm tracking-wide text-ancient-gold shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-all hover:border-ancient-gold hover:bg-deep-black hover:shadow-[0_0_28px_rgba(201,168,76,0.25)] md:bottom-8 md:right-8"
        aria-haspopup="dialog"
        aria-expanded={novoPersonagemOpen}
        aria-controls="modal-novo-personagem"
      >
        <UserPlus className="w-5 h-5 shrink-0" aria-hidden />
        Personagens
      </button>

      <AnimatePresence>
        {novoPersonagemOpen && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
            onMouseDown={() => setNovoPersonagemOpen(false)}
          >
            <motion.div
              id="modal-novo-personagem"
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-novo-personagem"
              className="relative w-full max-w-lg rounded-lg border border-ancient-gold/70 bg-deep-black p-6 shadow-[0_0_48px_rgba(0,0,0,0.65)]"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22 }}
              onMouseDown={(ev) => ev.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setNovoPersonagemOpen(false)}
                className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-md border border-stone-gray/50 text-parchment/70 hover:border-ancient-gold/50 hover:text-ancient-gold"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>

              <form onSubmit={handleAdicionar}>
                <h3
                  id="titulo-novo-personagem"
                  className="font-title text-center text-lg tracking-[0.2em] text-ancient-gold md:text-xl mb-6 pr-8"
                >
                  NOVO PERSONAGEM
                </h3>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <label className="block">
                    <span className="font-body text-[10px] uppercase tracking-[0.15em] text-parchment/45">
                      Nome
                    </span>
                    <input
                      value={novoNome}
                      onChange={(ev) => setNovoNome(ev.target.value)}
                      className="mt-1.5 w-full rounded border border-stone-gray/35 bg-deep-black px-3 py-2 font-body text-sm text-parchment placeholder:text-parchment/30 focus:border-ancient-gold/55 focus:outline-none"
                      placeholder="Nome do personagem"
                      maxLength={80}
                      autoFocus
                    />
                  </label>
                  <label className="block">
                    <span className="font-body text-[10px] uppercase tracking-[0.15em] text-parchment/45">
                      Classe
                    </span>
                    <input
                      value={novaClasse}
                      onChange={(ev) => setNovaClasse(ev.target.value)}
                      className="mt-1.5 w-full rounded border border-stone-gray/35 bg-deep-black px-3 py-2 font-body text-sm text-parchment placeholder:text-parchment/30 focus:border-ancient-gold/55 focus:outline-none"
                      placeholder="Ex.: Guerreiro, Mago…"
                      list="classes-sugestoes-fichas"
                      maxLength={40}
                    />
                    <datalist id="classes-sugestoes-fichas">
                      <option value="Guerreiro" />
                      <option value="Mago" />
                      <option value="Arqueiro" />
                      <option value="Tank" />
                    </datalist>
                  </label>
                </div>

                <div className="mb-4">
                  <span className="font-body text-[10px] uppercase tracking-[0.15em] text-parchment/45">
                    Skin do Minecraft
                  </span>
                  <p className="mt-0.5 font-body text-[11px] text-parchment/35">
                    Arquivo de skin PNG (64×64 ou HD) para ver o modelo 3D; ou uma imagem em pé (render) para
                    exibição 2D. Opcional.
                  </p>
                  <input
                    ref={skinFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    id="input-skin-minecraft"
                    onChange={handleSkinFileChange}
                  />
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <label
                      htmlFor="input-skin-minecraft"
                      className="inline-flex cursor-pointer items-center gap-2 rounded border border-stone-gray/40 bg-deep-black px-3 py-2 font-body text-xs text-parchment/85 transition-colors hover:border-ancient-gold/50 hover:text-ancient-gold"
                    >
                      <Upload className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      Escolher imagem
                    </label>
                    {novaSkinDataUrl && (
                      <button
                        type="button"
                        onClick={clearNovaSkin}
                        className="font-body text-xs text-blood-red/90 underline-offset-2 hover:underline"
                      >
                        Remover imagem
                      </button>
                    )}
                  </div>
                  {novaSkinDataUrl && (
                    <div className="mt-3 flex justify-center">
                      <SkinDisplay src={novaSkinDataUrl} variant="formPreview" />
                    </div>
                  )}
                  {skinUploadError && (
                    <p className="mt-2 font-body text-xs text-blood-red/80">{skinUploadError}</p>
                  )}
                </div>

                <label className="block mb-6">
                  <span className="font-body text-[10px] uppercase tracking-[0.15em] text-parchment/45">
                    Descrição
                  </span>
                  <textarea
                    value={novaDescricao}
                    onChange={(ev) => setNovaDescricao(ev.target.value)}
                    rows={4}
                    className="mt-1.5 w-full resize-y rounded border border-stone-gray/35 bg-deep-black px-3 py-2 font-body text-sm text-parchment placeholder:text-parchment/30 focus:border-ancient-gold/55 focus:outline-none min-h-[100px]"
                    placeholder="Breve história ou traços do personagem"
                    maxLength={2000}
                  />
                </label>

                {formError && (
                  <p className="mb-4 text-center font-body text-xs text-blood-red/90">{formError}</p>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={!novoNome.trim() || !novaClasse.trim() || formSaving || !isSupabaseConfigured()}
                    className="w-full max-w-xs rounded py-3 font-title text-xs tracking-[0.2em] text-deep-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40 bg-[#4a4428] hover:bg-[#5c5434]"
                  >
                    {formSaving ? 'A GUARDAR…' : 'ADICIONAR PERSONAGEM'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="font-title text-4xl md:text-6xl text-ancient-gold text-center mb-8"
        >
          Fichas de Personagens
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-narrative text-parchment/80 text-lg md:text-xl leading-relaxed text-center mb-8 max-w-3xl mx-auto"
        >
          {selectedId === null
            ? 'Clique em uma ficha para abrir a história e os detalhes. Use o botão Personagens no canto para criar um novo.'
            : 'Ficha aberta — clique em outro card para trocar, no mesmo para fechar, ou use o botão fechar.'}
        </motion.p>

        {!isSupabaseConfigured() && (
          <div className="mb-8 max-w-3xl mx-auto rounded-lg border border-ancient-gold/35 bg-deep-black/60 px-4 py-3 text-center font-body text-sm text-parchment/80">
            Para guardar personagens no site (Vercel), define{' '}
            <span className="text-ancient-gold/90">VITE_SUPABASE_URL</span> e{' '}
            <span className="text-ancient-gold/90">VITE_SUPABASE_ANON_KEY</span> nas variáveis de ambiente e corre o
            SQL em <span className="text-ancient-gold/90">supabase/schema_characters.sql</span> no teu projeto Supabase.
          </div>
        )}

        {listError && (
          <p className="mb-6 text-center font-body text-sm text-blood-red/90 max-w-2xl mx-auto">{listError}</p>
        )}

        {isSupabaseConfigured() && listLoading && (
          <p className="mb-8 text-center font-narrative text-parchment/55">Carregando fichas…</p>
        )}

        {!listLoading && personagens.length === 0 ? (
          <p className="text-center font-narrative text-parchment/55 text-lg py-12 border border-dashed border-stone-gray/40 rounded-lg">
            Nenhum personagem ainda
            {isSupabaseConfigured()
              ? '. Use o botão Personagens no canto para adicionar o primeiro.'
              : ' — configura o Supabase para começar a guardar fichas.'}
          </p>
        ) : !listLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {personagens.map((personagem, index) => {
              const active = personagem.id === selectedId;
              return (
                <motion.div
                  key={personagem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.08 + 0.2 }}
                  className="relative"
                >
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCardClick(personagem.id)}
                    aria-pressed={active}
                    aria-expanded={active}
                    className={`relative w-full text-left p-4 border rounded-lg backdrop-blur-sm transition-all duration-300 ${
                      active ? 'pr-12' : 'pr-4'
                    } ${
                      active
                        ? 'border-ancient-gold bg-deep-black/90 shadow-[0_0_28px_rgba(201,168,76,0.35)]'
                        : 'border-stone-gray/40 bg-deep-black/70 hover:border-ancient-gold/60'
                    }`}
                  >
                    <CharacterPortrait
                      size="small"
                      accent={classeCor[personagem.classe] ?? '#c9a84c'}
                      skinUrl={personagem.skinUrl}
                    />
                    <h3 className="font-title text-2xl text-ancient-gold mt-3">{personagem.nome}</h3>
                    <p className="font-narrative text-parchment/80 text-base">{personagem.classe}</p>
                  </motion.button>
                  {active && (
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        void handleRemover(personagem);
                      }}
                      className="absolute top-2 right-2 z-10 flex items-center justify-center w-9 h-9 rounded-md border border-blood-red/40 bg-deep-black/90 text-blood-red/90 hover:bg-blood-red/20 hover:border-blood-red/60 transition-colors"
                      aria-label={`Remover ${personagem.nome}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : null}

        <div className="mt-10 min-h-[1px]">
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative p-6 md:p-8 bg-gradient-to-br from-deep-black/95 to-dark-gray/95 border border-ancient-gold/40 rounded-lg backdrop-blur-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-md border border-ancient-gold/40 bg-deep-black/80 text-parchment/80 hover:text-ancient-gold hover:border-ancient-gold/70 transition-colors"
                  aria-label="Fechar ficha"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid md:grid-cols-[minmax(200px,260px),1fr] gap-8 items-start pr-8 md:pr-12">
                  <CharacterPortrait
                    size="large"
                    accent={classeCor[selected.classe] ?? '#c9a84c'}
                    skinUrl={selected.skinUrl}
                  />

                  <div>
                    <h3 className="font-title text-4xl md:text-5xl text-ancient-gold mb-2">{selected.nome}</h3>
                    <p className="font-narrative text-parchment text-2xl mb-6">{selected.classe}</p>
                    <div className="space-y-3">
                      <p className="font-body text-parchment/85 text-base md:text-lg">{selected.descricao}</p>
                      <p className="font-body text-parchment/70 text-sm md:text-base border-b border-ancient-gold/20 pb-2">
                        Especialidade: Combate e sobrevivência em terreno hostil.
                      </p>
                      <p className="font-body text-parchment/70 text-sm md:text-base border-b border-ancient-gold/20 pb-2">
                        Estilo: Progressão focada em domínio de recursos e conflito tático.
                      </p>
                      <p className="font-body text-parchment/70 text-sm md:text-base border-b border-ancient-gold/20 pb-2">
                        Lealdade: Jurado ao próprio reino.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleRemover(selected)}
                      className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-blood-red/50 font-body text-sm text-blood-red hover:bg-blood-red/15 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remover este personagem
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,168,76,0.22),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.12),transparent_45%)]" />
      </div>
    </section>
  );
}
