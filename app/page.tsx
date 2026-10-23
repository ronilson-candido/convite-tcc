import { ArrowDown, ArrowUpRight, Fingerprint, LockKeyhole, Network, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Countdown from "@/components/countdown";
import RsvpForm from "@/components/rsvp-form";
import { eventDetails } from "@/lib/event";

const researchModules = [
  {
    number: "01",
    icon: Network,
    title: "Internet das Coisas",
    text: "Dispositivos conectados trocam informações pela rede. Muitos têm recursos limitados, o que torna importante estabelecer comunicações eficientes e protegidas.",
  },
  {
    number: "02",
    icon: Fingerprint,
    title: "Autenticação",
    text: "É o processo de verificar a identidade de quem se comunica. Protocolos definem as etapas e as mensagens usadas para estabelecer essa confiança.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Verificação formal",
    text: "Usa modelos matemáticos para examinar comportamentos possíveis de um protocolo e investigar se propriedades de segurança especificadas se mantêm.",
  },
  {
    number: "04",
    icon: LockKeyhole,
    title: "Tamarin Prover",
    text: "Ferramenta para modelar e analisar protocolos criptográficos. Neste trabalho, ela é usada para investigar formalmente o protocolo de autenticação EDHOC.",
  },
];

const binaryColumns = [
  "01001001 01000011",
  "10110010 00100101",
  "00101101 11100010",
  "11001010 01010110",
  "01011100 10101001",
];

export default function HomePage() {
  return (
    <main>
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="#" className="font-mono text-sm font-bold tracking-[0.16em] text-white">
          <span className="text-[#39ff88]">IC</span> / DEFESA 2026
        </Link>
        <nav aria-label="Navegação principal" className="hidden items-center gap-7 font-mono text-xs text-[#a1b1a6] md:flex">
          <a className="transition hover:text-[#39ff88]" href="#pesquisa">PESQUISA</a>
          <a className="transition hover:text-[#39ff88]" href="#evento">EVENTO</a>
          <a className="transition hover:text-[#39ff88]" href="#rsvp">PRESENÇA</a>
        </nav>
        <a
          href="#rsvp"
          className="rounded-sm border border-[#39ff88]/40 px-3 py-2 font-mono text-[10px] tracking-[0.12em] text-[#39ff88] transition hover:border-[#39ff88] hover:bg-[#39ff88]/10 sm:px-4 sm:text-xs"
        >
          CONFIRMAR <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="relative isolate mx-auto flex min-h-[calc(100svh-76px)] w-full max-w-7xl items-center overflow-hidden px-5 pb-16 pt-10 sm:px-8 lg:pb-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="binary-drift absolute -right-5 top-12 grid grid-cols-5 gap-8 font-mono text-[10px] leading-8 text-[#39ff88]/[0.11] sm:right-0 sm:gap-16">
            {binaryColumns.map((column, index) => (
              <span key={column} className="whitespace-pre opacity-70" style={{ transform: `translateY(${index * 21}px)` }}>
                {`${column}\n${column.split("").reverse().join("")}\n${column}\n${column.split("").reverse().join("")}`}
              </span>
            ))}
          </div>
          <div className="absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-[#00c853]/[0.08] blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 h-px w-2/3 bg-gradient-to-r from-transparent via-[#39ff88]/25 to-transparent" />
        </div>

        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="max-w-3xl">
            <div className="mb-9 inline-flex items-center gap-2.5 border border-[#39ff88]/20 bg-[#0a120e]/80 px-3 py-2 font-mono text-[10px] tracking-[0.11em] text-[#a8c9b3] sm:text-xs">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#39ff88]" />
              [ SYSTEM STATUS: EVENT INITIALIZED ]
            </div>
            <p className="mb-4 font-mono text-xs tracking-[0.2em] text-[#39ff88] sm:text-sm">
              ACESSO AUTORIZADO: VOCÊ ESTÁ CONVIDADO
            </p>
            <h1 className="text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-7xl lg:text-[5.5rem]">
              DEFESA DE TCC
              <span className="mt-3 block font-mono text-3xl font-normal tracking-[-0.04em] text-[#39ff88] sm:text-5xl lg:text-6xl">
                {"// 2026"}
              </span>
            </h1>
            <p className="mt-9 max-w-xl text-xl font-semibold leading-snug text-[#edf5ef] sm:text-2xl">
              {eventDetails.author}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#a1b1a6] sm:text-base">
              Amigos, familiares, professores e colegas: será uma alegria contar com vocês neste momento tão importante da minha trajetória acadêmica.
            </p>
            <div className="mt-8 max-w-2xl border-l border-[#39ff88]/45 pl-4">
              <p className="font-mono text-[10px] tracking-[0.17em] text-[#39ff88]/75">TÍTULO DO TRABALHO</p>
              <p className="mt-2 text-base font-medium leading-relaxed text-[#d5e0d8] sm:text-lg">{eventDetails.title}</p>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#9caaa0]">{eventDetails.description}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#rsvp"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-[#39ff88] px-6 font-mono text-xs font-bold tracking-[0.1em] text-[#041008] transition hover:bg-[#63ffa0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#39ff88]"
              >
                CONFIRMAR PRESENÇA <ArrowUpRight size={16} />
              </a>
              <a
                href="#evento"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm border border-white/15 bg-white/[0.025] px-6 font-mono text-xs tracking-[0.08em] text-[#e2ebe4] transition hover:border-[#39ff88]/45 hover:text-[#39ff88] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#39ff88]"
              >
                VER DETALHES DO EVENTO <ArrowDown size={15} />
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[380px] lg:max-w-[420px]">
            <div className="relative border border-[#39ff88]/35 bg-[#0a120e]/80 p-2 shadow-[0_0_70px_rgba(0,200,83,0.09)]">
              <span aria-hidden="true" className="absolute -left-px -top-px h-8 w-8 border-l border-t border-[#39ff88]" />
              <span aria-hidden="true" className="absolute -bottom-px -right-px h-8 w-8 border-b border-r border-[#39ff88]" />
              <div className="relative aspect-[4/5] overflow-hidden bg-[#101b15]">
                <Image
                  src="/miguel.png"
                  alt="Espaço reservado para uma fotografia de Ronilson Candido do Nascimento"
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 420px"
                  className="object-cover"
                />
                <div className="scanlines absolute inset-0" />
                <div className="absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[9px] tracking-[0.13em] text-[#c8f7d6]">
                  <span>IDENTITY / VERIFIED</span>
                  <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#39ff88]" /> LIVE</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050a08] via-[#050a08]/65 to-transparent px-5 pb-5 pt-16">
                  <p className="font-mono text-[10px] tracking-[0.13em] text-[#39ff88]">PESQUISADOR // COMPUTAÇÃO</p>
                  <p className="mt-1 text-lg font-semibold text-white">Ronilson Candido</p>
                </div>
              </div>
              <div className="flex items-center justify-between px-2 pb-1 pt-3 font-mono text-[9px] tracking-[0.1em] text-[#789080]">
                <span>UFAL · INSTITUTO DE COMPUTAÇÃO</span>
                <span>25.11.2026</span>
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[9px] tracking-[0.08em] text-[#64766a]">
              SUBSTITUA <code className="text-[#91a498]">public/portrait-placeholder.svg</code> PELA SUA FOTO
            </p>
          </div>
        </div>
        <div aria-hidden="true" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 font-mono text-[9px] tracking-[0.2em] text-[#6a7c70] lg:block">
          SCROLL TO EXPLORE <span className="ml-2 text-[#39ff88]">↓</span>
        </div>
      </section>

      <section aria-labelledby="countdown-title" className="border-y border-[#39ff88]/10 bg-[#07100b]/80">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-9 sm:px-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#39ff88]">{"// EVENT COUNTDOWN"}</p>
            <h2 id="countdown-title" className="mt-2 text-xl font-semibold text-white">A contagem para esse encontro</h2>
            <p className="mt-1 text-xs text-[#89998e]">Contagem provisória até o início do dia; horário oficial a confirmar.</p>
          </div>
          <Countdown />
        </div>
      </section>

      <section id="pesquisa" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <div className="mb-12 max-w-2xl">
          <p className="font-mono text-xs tracking-[0.18em] text-[#39ff88]">{"// RESEARCH_PROTOCOL"}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Segurança que pode ser analisada, passo a passo.</h2>
          <p className="mt-5 text-base leading-8 text-[#a1b1a6]">
            O trabalho investiga a modelagem e a análise formal do protocolo de autenticação EDHOC utilizando o Tamarin Prover. A pesquisa busca representar o protocolo e examinar propriedades de segurança por meio de métodos formais — sem presumir resultados antes da análise.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {researchModules.map(({ number, icon: Icon, title, text }) => (
            <article key={number} className="group relative border border-white/[0.09] bg-[#09110d]/85 p-5 transition hover:border-[#39ff88]/35">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#39ff88]/65">{number} / MODULE</span>
                <Icon aria-hidden="true" size={19} strokeWidth={1.5} className="text-[#39ff88]" />
              </div>
              <h3 className="mt-7 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#9caaa0]">{text}</p>
              <div aria-hidden="true" className="absolute bottom-0 left-0 h-px w-0 bg-[#39ff88] transition-all duration-300 group-hover:w-full" />
            </article>
          ))}
        </div>
      </section>

      <section id="evento" className="border-y border-[#39ff88]/10 bg-[#07100b]/75">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="font-mono text-xs tracking-[0.18em] text-[#39ff88]">{"// EVENT_COORDINATES"}</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Um momento importante. Um lugar para compartilhar.</h2>
              <p className="mt-5 text-base leading-8 text-[#a1b1a6]">
                Sua presença será muito especial e fará parte de uma etapa importante da minha trajetória acadêmica. Espero você para acompanhar e celebrar esse momento comigo.
              </p>
              <a
                href={eventDetails.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex min-h-11 items-center gap-2 border border-[#39ff88]/35 px-4 font-mono text-[11px] tracking-[0.08em] text-[#39ff88] transition hover:bg-[#39ff88]/[0.08] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#39ff88]"
              >
                ABRIR LOCALIZAÇÃO NO MAPS <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <EventCard label="DATA" value={eventDetails.date} marker="01" />
              <EventCard label="HORÁRIO" value="[HORÁRIO A CONFIRMAR]" marker="02" />
              <EventCard label="LOCAL" value="Auditório do Instituto de Computação — Universidade Federal de Alagoas (UFAL)" marker="03" />
              <EventCard label="CIDADE" value={eventDetails.city} marker="04" />
            </div>
          </div>
        </div>
      </section>

      <section id="rsvp" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto grid max-w-5xl overflow-hidden border border-[#39ff88]/20 bg-[#09110d] md:grid-cols-[0.85fr_1.15fr]">
          <div className="relative overflow-hidden border-b border-[#39ff88]/15 bg-[#0b1710] p-7 sm:p-9 md:border-b-0 md:border-r">
            <div aria-hidden="true" className="absolute -right-10 -top-8 h-48 w-48 rounded-full bg-[#00c853]/10 blur-3xl" />
            <p className="relative font-mono text-xs tracking-[0.16em] text-[#39ff88]">{"// ACCESS_REQUEST: RSVP"}</p>
            <h2 className="relative mt-5 text-3xl font-semibold leading-tight text-white">Sua presença faz parte desta conquista.</h2>
            <p className="relative mt-5 text-sm leading-7 text-[#a1b1a6]">
              Estou preparando esse momento com muito carinho e gostaria de contar com você. Confirme sua presença para me ajudar na organização da defesa.
            </p>
            <div className="relative mt-8 flex items-center gap-3 border-t border-white/[0.08] pt-5">
              <LockKeyhole size={16} className="shrink-0 text-[#39ff88]" />
              <p className="text-xs leading-5 text-[#85968a]">Sua confirmação é privada e será usada somente para a organização do evento.</p>
            </div>
            <p className="relative mt-8 font-mono text-[10px] tracking-[0.1em] text-[#65766a]">AUTHENTICATION: NOT REQUIRED</p>
          </div>
          <div className="p-7 sm:p-9">
            <RsvpForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-[#39ff88]/12 bg-[#060c08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.13em] text-[#39ff88]">{eventDetails.author}</p>
            <p className="mt-2 text-sm text-[#bac7bd]">{eventDetails.shortTitle}</p>
            <p className="mt-1 text-xs text-[#78877d]">Instituto de Computação — UFAL · 2026</p>
          </div>
          <div className="font-mono text-[9px] leading-5 tracking-[0.09em] text-[#65766a] md:text-right">
            <p><span className="text-[#39ff88]">[OK]</span> EVENT INITIALIZED · INVITATION READY</p>
            <p className="mt-1">SECURITY IS NOT A FEATURE. IT IS A FOUNDATION.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function EventCard({ label, value, marker }: { label: string; value: string; marker: string }) {
  return (
    <article className="min-h-32 border border-white/[0.09] bg-[#0a120e] p-5">
      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.12em]">
        <span className="text-[#39ff88]">{label}</span>
        <span className="text-[#5f7064]">LOC_{marker}</span>
      </div>
      <p className="mt-5 text-sm leading-6 text-[#d4dfd7]">{value}</p>
    </article>
  );
}
