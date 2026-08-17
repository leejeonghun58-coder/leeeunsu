"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Heart, Menu, X, Share2, Play, CalendarDays, Sparkles, ArrowRight, Check, ChevronDown } from "lucide-react";
import { profile } from "@/data/profile";
import { drawings } from "@/data/drawings";
import { characters } from "@/data/characters";
import { videos } from "@/data/videos";
import { memories } from "@/data/memories";
import type { Drawing, DrawingCategory } from "@/data/types";

type ModalItem = { kind: "drawing" | "character" | "video"; item: Drawing | (typeof characters)[number] | (typeof videos)[number] } | null;
const nav = [["home","Home"],["profile","은수 소개"],["characters","좋아하는 캐릭터"],["drawings","은수의 그림"],["videos","동영상"],["memories","추억"],["about","About"]];
const todayItems = [
  { label: "오늘 은수의 한마디", text: "아빠, 내가 만든 로봇은 달까지 갈 수 있어!", emoji: "🚀" },
  { label: "오늘의 그림", text: "무지개 고래가 구름 바다를 여행해요.", emoji: "🐳" },
  { label: "오늘의 재미있는 이야기", text: "눈사람에게 여름휴가 계획을 세워 주었어요.", emoji: "☃️" },
  { label: "오늘의 순간", text: "종이 상자 하나가 멋진 우주선으로 변했어요!", emoji: "✨" },
];

export default function EunsuArchive() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, setCategory] = useState<DrawingCategory | "전체">("전체");
  const [modal, setModal] = useState<ModalItem>(null);
  const [copied, setCopied] = useState(false);
  const [todayIndex, setTodayIndex] = useState(0);

  useEffect(() => { const timer = window.setTimeout(() => setTodayIndex(Math.floor(Math.random() * todayItems.length)), 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")), { threshold: .08 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const close = (e: KeyboardEvent) => e.key === "Escape" && setModal(null);
    window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close);
  }, []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase(); if (!q) return [];
    return [
      ...drawings.map(x => ({ type: "그림", title: x.title, text: `${x.description} ${x.quote} ${x.category}`, image: x.image, go: () => setModal({ kind: "drawing", item: x }) })),
      ...characters.map(x => ({ type: "캐릭터", title: x.name, text: `${x.reason} ${x.description}`, image: x.image, go: () => setModal({ kind: "character", item: x }) })),
      ...videos.map(x => ({ type: "동영상", title: x.title, text: x.description, image: x.thumbnail, go: () => setModal({ kind: "video", item: x }) })),
    ].filter(x => `${x.title} ${x.text}`.toLowerCase().includes(q));
  }, [query]);
  const filteredDrawings = category === "전체" ? drawings : drawings.filter(d => d.category === category);

  const share = async (title: string) => {
    const payload = { title, text: `${title} - 우리 아들 특별한 이은수`, url: window.location.href };
    try { if (navigator.share) await navigator.share(payload); else { await navigator.clipboard.writeText(payload.url); setCopied(true); setTimeout(() => setCopied(false), 1800); } } catch { /* share cancelled */ }
  };
  const move = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return <main>
    <header className="header">
      <button className="brand" onClick={() => move("home")} aria-label="홈으로"><span className="brand-mark">은</span><span><b>특별한 이은수</b><small>우리 가족의 성장 아카이브</small></span></button>
      <nav className={menuOpen ? "nav open" : "nav"} aria-label="주 메뉴">{nav.map(([id,label]) => <button key={id} onClick={() => move(id)}>{label}</button>)}</nav>
      <div className="header-actions"><button className="icon-button" onClick={() => setSearchOpen(!searchOpen)} aria-label="검색"><Search size={20}/></button><button className="icon-button mobile" onClick={() => setMenuOpen(!menuOpen)} aria-label="메뉴">{menuOpen ? <X/> : <Menu/>}</button></div>
      {searchOpen && <div className="search-panel"><div className="search-box"><Search/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="로봇, 그림, 추억을 검색해 보세요" aria-label="기록 검색"/><button onClick={() => { setSearchOpen(false); setQuery(""); }}><X/></button></div>{query && <div className="results">{searchResults.length ? searchResults.map((r,i) => <button key={i} onClick={() => {r.go(); setSearchOpen(false);}}><img src={r.image} alt=""/><span><small>{r.type}</small><b>{r.title}</b></span><ArrowRight/></button>) : <p>“{query}”에 해당하는 기록이 없어요.</p>}</div>}</div>}
    </header>

    <section className="hero" id="home"><div className="hero-copy"><span className="eyebrow"><Sparkles size={15}/> 반짝이는 순간을 모아요</span><h1>우리 아들<br/><em>특별한 이은수</em></h1><p>은수가 좋아하는 것들과 직접 만든 작품,<br/>그리고 우리 가족의 소중한 순간을 기록합니다.</p><div className="hero-buttons"><button className="primary" onClick={() => move("drawings")}>은수의 그림 보기 <ArrowRight size={18}/></button><button className="secondary" onClick={() => move("memories")}>추억 둘러보기</button></div></div><div className="hero-art"><div className="hero-photo"><img src="/images/eunsu/eunsu-main.jpg" alt="은수 대표 사진"/><span className="photo-note">우리의 특별한 은수 ♡</span></div><span className="doodle d1">✦</span><span className="doodle d2">♡</span><span className="doodle d3">☻</span></div><button className="scroll-cue" onClick={() => move("today")} aria-label="아래로 이동"><ChevronDown/></button></section>

    <section className="today reveal" id="today"><div className="today-icon">{todayItems[todayIndex].emoji}</div><div><span>{todayItems[todayIndex].label}</span><blockquote>“{todayItems[todayIndex].text}”</blockquote></div><button onClick={() => setTodayIndex((todayIndex + 1) % todayItems.length)} aria-label="다른 이야기 보기">다른 이야기 <ArrowRight size={16}/></button></section>

    <section className="section reveal" id="profile"><SectionTitle kicker="HELLO, EUNSU" title="은수를 소개해요" text={profile.tagline}/><div className="profile-wrap"><div className="profile-main"><div className="avatar">은수</div><div><small>이름</small><h3>{profile.name}</h3><p>호기심 가득한 눈으로 세상을 바라보고,<br/>머릿속 이야기를 멋진 작품으로 만들어요.</p></div></div><div className="profile-grid">{profile.details.map(d => <article key={d.label}><span>{d.icon}</span><div><small>{d.label}</small><b>{d.value}</b></div></article>)}</div></div></section>

    <section className="section soft reveal" id="drawings"><SectionTitle kicker="EUNSU’S ART" title="은수의 그림" text="상상력이 활짝 피어난 은수만의 특별한 작품들이에요." action="모든 작품 보기"/><div className="filters">{(["전체","캐릭터","동물","가족","상상","학교"] as const).map(c => <button key={c} className={category===c?"active":""} onClick={() => setCategory(c)}>{c}</button>)}</div><div className="drawing-grid">{filteredDrawings.map(d => <article className="art-card" key={d.id}><button className="image-button" onClick={() => setModal({kind:"drawing",item:d})}><img src={d.image} alt={d.title}/><span className="tag">{d.category}</span></button><div className="card-body"><small>{d.date}</small><h3>{d.title}</h3><p>{d.description}</p><div className="quote">“{d.quote}”</div><button className="share" onClick={() => share(d.title)}><Share2 size={16}/> 공유하기</button></div></article>)}</div></section>

    <section className="section reveal" id="characters"><SectionTitle kicker="FAVORITE FRIENDS" title="좋아하는 캐릭터" text="은수에게 용기와 상상력을 선물하는 멋진 친구들이에요."/><div className="character-grid">{characters.map(c => <button className="character-card" key={c.id} style={{"--card-color":c.color} as React.CSSProperties} onClick={() => setModal({kind:"character",item:c})}><div className="character-img"><img src={c.image} alt={c.name}/><Heart className="heart" size={20}/></div><small>좋아하는 이유 · {c.reason}</small><h3>{c.name}</h3><p>{c.description}</p></button>)}</div></section>

    <section className="section video-section reveal" id="videos"><SectionTitle kicker="EUNSU’S VIDEO" title="움직이는 순간들" text="은수의 웃음소리와 즐거운 이야기를 영상으로 다시 만나요."/><div className="video-grid">{videos.map(v => <article key={v.id}><button className="video-thumb" onClick={() => setModal({kind:"video",item:v})}><img src={v.thumbnail} alt={v.title}/><span><Play fill="currentColor"/></span></button><small>{v.date}</small><h3>{v.title}</h3><p>{v.description}</p><button className="share light" onClick={() => share(v.title)}><Share2 size={15}/> 공유</button></article>)}</div></section>

    <section className="section reveal" id="memories"><SectionTitle kicker="OUR MEMORIES" title="소중한 추억" text="함께여서 더 행복했던 우리 가족의 시간을 차곡차곡 담았어요."/><div className="timeline">{memories.map((m,i) => <article key={m.id}><div className="time-dot">{i+1}</div><div className="memory-img"><img src={m.image} alt={m.title}/></div><div className="memory-copy"><span>{m.category}</span><small><CalendarDays size={15}/>{m.period}</small><h3>{m.title}</h3><p>{m.description}</p><button className="share" onClick={() => share(m.title)}><Share2 size={15}/> 공유하기</button></div></article>)}</div></section>

    <section className="section growth reveal"><SectionTitle kicker="GROWING UP" title="은수의 성장 기록" text="매년 조금씩 더 자라는 은수의 특별한 이야기를 펼쳐보세요."/><div className="year-grid">{[{y:2026,a:"11살 은수",n:"지금, 반짝이는 상상"},{y:2027,a:"12살 은수",n:"새로운 이야기를 기다려요"},{y:2028,a:"13살 은수",n:"앞으로 채워질 페이지"}].map((x,i) => <details key={x.y} open={i===0}><summary><span>{x.y}</span><div><b>{x.a}</b><small>{x.n}</small></div><ChevronDown/></summary><p>{i===0 ? "그림 6개 · 영상 3개 · 추억 4개가 기록되어 있어요." : "이 해의 사진, 그림, 동영상과 추억이 이곳에 쌓일 거예요."}</p></details>)}</div></section>

    <section className="about" id="about"><div><span className="eyebrow">OUR LITTLE ARCHIVE</span><h2>평범한 하루도<br/><em>기록하면 특별해져요.</em></h2></div><p>이곳은 은수의 그림과 취미, 가족의 소중한 순간을 오래도록 간직하기 위한 공간이에요. 개인 정보는 꼭 필요한 만큼만 안전하게 기록해 주세요.</p></section>
    <footer><div className="footer-brand"><span className="brand-mark">은</span><b>우리 아들 특별한 이은수</b></div><p>은수의 오늘이 내일의 소중한 추억이 됩니다.</p><span>Made with <Heart size={15} fill="#ef7186"/> for Eunsu</span><small>© 2026 Eunsu’s Family Archive</small></footer>

    {modal && <div className="modal-backdrop" role="button" tabIndex={0} aria-label="상세 창 닫기" onKeyDown={e => e.key === "Enter" && setModal(null)} onMouseDown={e => e.target===e.currentTarget && setModal(null)}><div className="modal" role="dialog" aria-modal="true"><button className="modal-close" onClick={() => setModal(null)}><X/></button><ModalContent modal={modal}/><button className="primary wide" onClick={() => share("title" in modal.item ? modal.item.title : modal.item.name)}>{copied ? <><Check/> 링크가 복사됐어요</> : <><Share2/> 이 기록 공유하기</>}</button></div></div>}
  </main>;
}

function SectionTitle({kicker,title,text,action}:{kicker:string,title:string,text:string,action?:string}) { return <div className="section-title"><div><span>{kicker}</span><h2>{title}</h2><p>{text}</p></div>{action && <span className="section-action">{action} <ArrowRight size={17}/></span>}</div>; }
function ModalContent({modal}:{modal:NonNullable<ModalItem>}) {
  const item = modal.item;
  if (modal.kind === "video") { const v = item as (typeof videos)[number]; return <><div className="modal-media">{v.youtubeId ? <iframe src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`} title={v.title} allowFullScreen/> : <img src={v.thumbnail} alt={v.title}/>}</div><small>{v.date}</small><h2>{v.title}</h2><p>{v.description}</p></>; }
  if (modal.kind === "drawing") { const d = item as Drawing; return <><img className="modal-image" src={d.image} alt={d.title}/><div className="modal-meta"><span>{d.category}</span><small>{d.date}</small></div><h2>{d.title}</h2><p>{d.description}</p><blockquote>은수의 한마디<br/>“{d.quote}”</blockquote></>; }
  const c = item as (typeof characters)[number]; return <><img className="modal-image" src={c.image} alt={c.name}/><small>좋아하는 이유 · {c.reason}</small><h2>{c.name} <Heart size={24} fill="#ef7186"/></h2><p>{c.description}</p></>;
}
