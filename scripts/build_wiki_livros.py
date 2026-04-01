"""
Extrai os Livros II–V dos .txt (exportados dos PDF) e gera src/data/wikiLivroII.ts … V.ts.
Executar: python scripts/build_wiki_livros.py
Pastas: coloca os quatro .txt em Downloads com os nomes originais ou ajusta DOWNLOADS abaixo.
"""
from __future__ import annotations

import json
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
DOWNLOADS = pathlib.Path.home() / "Downloads"

FILES = {
    "II": "LIVRO II — AS SEMENTES DA CIVILIZAÇÃO.txt",
    "III": "LIVRO III — O MAPA DAS ERAS.txt",
    "IV": "LIVRO IV — O PERGAMINHO DO AVENTUREIRO.txt",
    "V": "LIVRO V — O LIVRO DOS SUSSURROS.txt",
}


def one_line(text: str) -> str:
    text = re.sub(r"[\n\r]+", " ", text)
    return re.sub(r" +", " ", text).strip()


def body_paragraphs(body: str, max_len: int = 850) -> list[str]:
    body = body.strip()
    if not body:
        return []
    parts = re.split(r"(?<=[.!?…])\s+(?=[A-ZÁÉÍÓÚÊÇ0-9\"●(])", body)
    paras: list[str] = []
    buf: list[str] = []
    cur = 0
    for s in parts:
        s = s.strip()
        if not s:
            continue
        if cur + len(s) > max_len and buf:
            paras.append(" ".join(buf))
            buf = [s]
            cur = len(s)
        else:
            buf.append(s)
            cur += len(s) + 1
    if buf:
        paras.append(" ".join(buf))
    return [p for p in paras if len(p) > 15]


def book_ii(text: str) -> dict:
    t = one_line(text)
    parts = re.split(r"(?=SEMENTE\s+\d+\s+—)", t)
    intro = parts[0].strip()
    chapters: list[dict] = []
    chapters.append({"title": "Introdução", "paragraphs": body_paragraphs(intro)})
    for p in parts[1:]:
        p = p.strip()
        m = re.match(r"^(SEMENTE\s+\d+\s+—.+?\))\s", p)
        if not m:
            m = re.match(r"^(SEMENTE\s+\d+\s+—.{5,120}?)\s(?=[A-Z])", p)
        title = (m.group(1).strip() if m else p[:100]).strip()
        body = (p[len(m.group(1)) :].strip() if m else p).strip()
        chapters.append({"title": title, "paragraphs": body_paragraphs(body)})
    return {
        "title": "Livro II — As Sementes da Civilização",
        "subtitle": "Documento interno da staff — como os clãs nascem (também disponível na wiki)",
        "epigraph": "Quatro necessidades. Quatro respostas. Quatro caminhos que, uma vez tomados, não poderiam ser desandados.",
        "epigraphAttribution": "— Epígrafe do manuscrito",
        "chapters": chapters,
        "closingBlockquote": [],
        "closingAttribution": "",
        "fin": "— Fim do Livro II —",
    }


def book_iii(text: str) -> dict:
    t = one_line(text)
    parts = re.split(r"(?=ERA\s+[IVX]+\s+—)", t)
    head = parts[0].strip()
    chapters: list[dict] = [{"title": "Visão geral", "paragraphs": body_paragraphs(head)}]
    for p in parts[1:]:
        p = p.strip()
        m = re.match(r"^(ERA\s+[IVX]+\s+—[^\"]{2,80}?)\s", p)
        title = m.group(1).strip() if m else p[:60]
        body = p[len(m.group(1)) :].strip() if m else p
        chapters.append({"title": title, "paragraphs": body_paragraphs(body)})
    return {
        "title": "Livro III — O Mapa das Eras",
        "subtitle": "Cronologia do mundo de StarCraft — da Gênese ao Crepúsculo",
        "epigraph": "O tempo não pede permissão para passar. Ele simplesmente passa. E aqueles que não prestam atenção acordam um dia e descobrem que já são história.",
        "epigraphAttribution": "— Trecho da crônica",
        "chapters": chapters,
        "closingBlockquote": [],
        "closingAttribution": "",
        "fin": "— Fim do Livro III —",
    }


def book_iv(text: str) -> dict:
    t = one_line(text)
    markers = [
        "AO RECÉM-CHEGADO",
        "O QUE VOCÊ PRECISA SABER",
        "QUEM VOCÊ É",
        "CLÃS E FACÇÕES",
        "O QUE VOCÊ PODE FAZER",
        "O QUE SEU LEGADO SERÁ",
        "OS SUSSURROS",
        "PALAVRAS FINAIS",
    ]
    positions = [(t.find(m), m) for m in markers if t.find(m) >= 0]
    positions.sort(key=lambda x: x[0])
    chapters: list[dict] = []
    # PÁGINA inicial (pergaminho) antes do primeiro marcador
    if positions:
        preamble = t[: positions[0][0]].strip()
        if len(preamble) > 80:
            chapters.append(
                {
                    "title": "O pergaminho encontrado",
                    "paragraphs": body_paragraphs(preamble),
                }
            )
    for i, (start, title) in enumerate(positions):
        end = positions[i + 1][0] if i + 1 < len(positions) else len(t)
        body = t[start + len(title) : end].strip()
        chapters.append({"title": title, "paragraphs": body_paragraphs(body)})
    return {
        "title": "Livro IV — O Pergaminho do Aventureiro",
        "subtitle": "Guia para os jogadores — escrito como documento do mundo",
        "epigraph": "",
        "epigraphAttribution": "",
        "chapters": chapters,
        "closingBlockquote": [],
        "closingAttribution": "",
        "fin": "— Fim do Livro IV —",
    }


def book_v(text: str) -> dict:
    t = one_line(text)
    chapters = rebuild_book_v_chapters(t)
    return {
        "title": "Livro V — O Livro dos Sussurros",
        "subtitle": "Profecias, fragmentos e mistérios (textos para espalhar pelo mundo)",
        "epigraph": "",
        "epigraphAttribution": "",
        "chapters": chapters,
        "closingBlockquote": [],
        "closingAttribution": "",
        "fin": "— Fim do Livro V —",
    }


def rebuild_book_v_chapters(t_raw: str) -> list[dict]:
    """Livro V: introdução + cabeçalhos de era + cada Fragmento numerado."""
    t = one_line(t_raw)
    idx = t.find("FRAGMENTOS DA ERA")
    chapters: list[dict] = []
    if idx == -1:
        return [{"title": "Texto integral", "paragraphs": body_paragraphs(t)}]
    chapters.append({"title": "Introdução e como usar", "paragraphs": body_paragraphs(t[:idx].strip())})
    rest = t[idx:]
    blocks = re.split(r"(?=Fragmento\s+\d+\s+—)", rest)
    for b in blocks:
        b = b.strip()
        if len(b) < 25:
            continue
        if b.startswith("FRAGMENTOS DA ERA") and not re.match(r"^FRAGMENTOS[^F]*Fragmento", b):
            head = b.split("Fragmento")[0].strip()[:160]
            if head:
                chapters.append({"title": head, "paragraphs": []})
            b = b[len(head) :].strip() if head else b
        m = re.match(r'(Fragmento\s+\d+\s+—\s*\"[^\"]+\")\s*', b)
        if m:
            chapters.append(
                {"title": m.group(1).strip(), "paragraphs": body_paragraphs(b[len(m.group(0)) :])}
            )
    return [c for c in chapters if c["paragraphs"] or c["title"].startswith("FRAGMENTOS")]


def main() -> None:
    builders = {"II": book_ii, "III": book_iii, "IV": book_iv, "V": book_v}
    names = {"II": "wikiLivroII", "III": "wikiLivroIII", "IV": "wikiLivroIV", "V": "wikiLivroV"}
    for key, fname in FILES.items():
        path = DOWNLOADS / fname
        if not path.exists():
            raise SystemExit(f"Ficheiro em falta: {path}")
        text = path.read_text(encoding="utf-8")
        data = builders[key](text)
        var_prefix = f"WIKI_LIVRO_{key}"
        out = emit_ts_correct(var_prefix, data)
        out_path = ROOT / "src" / "data" / f"{names[key]}.ts"
        out_path.write_text(out, encoding="utf-8")
        print("Written", out_path, "chapters", len(data["chapters"]))


def emit_ts_correct(var: str, data: dict) -> str:
    lines = [
        "/** Conteúdo extraído do PDF oficial — gerado por scripts/build_wiki_livros.py */",
        "",
        f"export const {var}_TITLE = {json.dumps(data['title'], ensure_ascii=False)};",
        f"export const {var}_SUBTITLE = {json.dumps(data.get('subtitle') or '', ensure_ascii=False)};",
        f"export const {var}_EPIGRAPH = {json.dumps(data.get('epigraph') or '', ensure_ascii=False)};",
        f"export const {var}_EPIGRAPH_ATTRIBUTION = {json.dumps(data.get('epigraphAttribution') or '', ensure_ascii=False)};",
        "",
        "export type WikiGenesisChapter = { title: string; paragraphs: string[] };",
        "",
        f"export const {var}_CHAPTERS: WikiGenesisChapter[] = {json.dumps(data['chapters'], ensure_ascii=False, indent=2)};",
        "",
        f"export const {var}_CLOSING_BLOCKQUOTE: string[] = {json.dumps(data.get('closingBlockquote') or [], ensure_ascii=False)};",
        f"export const {var}_CLOSING_ATTRIBUTION = {json.dumps(data.get('closingAttribution') or '', ensure_ascii=False)};",
        f"export const {var}_FIN = {json.dumps(data.get('fin') or '', ensure_ascii=False)};",
        "",
    ]
    return "\n".join(lines)


if __name__ == "__main__":
    main()
