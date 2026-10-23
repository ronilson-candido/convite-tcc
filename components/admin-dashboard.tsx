"use client";

import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";

type RsvpRecord = {
  id: string;
  full_name: string;
  relationship: string | null;
  created_at: string;
};

const relationshipFilters = ["Todos", "Amigo(a)", "Familiar", "Professor(a)", "Colega de curso", "Outro"];

export default function AdminDashboard({ records, email }: { records: RsvpRecord[]; email: string }) {
  const [query, setQuery] = useState("");
  const [relationship, setRelationship] = useState("Todos");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return records
      .filter((record) => record.full_name.toLocaleLowerCase("pt-BR").includes(normalizedQuery))
      .filter((record) => relationship === "Todos" || (record.relationship ?? "Outro") === relationship)
      .sort((first, second) => sortNewestFirst
        ? Date.parse(second.created_at) - Date.parse(first.created_at)
        : Date.parse(first.created_at) - Date.parse(second.created_at));
  }, [records, query, relationship, sortNewestFirst]);

  function exportCsv() {
    const quote = (value: string) => {
      const safeValue = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
      return `"${safeValue.replaceAll('"', '""')}"`;
    };
    const csv = [
      ["Nome completo", "Vínculo", "Data da confirmação"].map(quote).join(","),
      ...filteredRecords.map((record) => [
        record.full_name,
        record.relationship ?? "",
        new Date(record.created_at).toLocaleString("pt-BR"),
      ].map(quote).join(",")),
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "confirmacoes-defesa-tcc.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto min-h-svh max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <header className="flex flex-col gap-4 border-b border-[#39ff88]/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs tracking-[0.16em] text-[#39ff88]">{"// PRIVATE_ADMIN_CONSOLE"}</p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Confirmações de presença</h1>
          <p className="mt-2 text-sm text-[#91a197]">Sessão autorizada: {email}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCsv} disabled={!filteredRecords.length} className="inline-flex min-h-10 items-center gap-2 border border-[#39ff88]/35 px-3 font-mono text-[10px] tracking-[0.08em] text-[#39ff88] hover:bg-[#39ff88]/[0.08] disabled:cursor-not-allowed disabled:opacity-40">
            <Download size={14} /> EXPORTAR CSV
          </button>
          <form action="/admin/signout" method="post">
            <button className="min-h-10 border border-white/15 px-3 font-mono text-[10px] tracking-[0.08em] text-[#c3cec6] hover:border-white/30">SAIR</button>
          </form>
        </div>
      </header>

      <section aria-label="Resumo" className="mt-7 grid gap-3 sm:grid-cols-3">
        <div className="border border-[#39ff88]/20 bg-[#09110d] p-5">
          <p className="font-mono text-[10px] tracking-[0.12em] text-[#8c9c91]">TOTAL DE CONFIRMAÇÕES</p>
          <p className="mt-3 font-mono text-4xl tabular-nums text-[#39ff88]">{records.length}</p>
        </div>
        <div className="border border-white/[0.08] bg-[#09110d] p-5 sm:col-span-2">
          <p className="font-mono text-[10px] tracking-[0.12em] text-[#8c9c91]">PRIVACIDADE</p>
          <p className="mt-3 text-sm leading-6 text-[#c3cec6]">Dados visíveis somente para contas administrativas autorizadas. Não compartilhe este painel nem os arquivos exportados.</p>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Pesquisar por nome</span>
            <Search size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#73847a]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar por nome..." className="min-h-11 w-full border border-white/[0.12] bg-[#09110d] pl-10 pr-3 text-sm text-white outline-none focus:border-[#39ff88]/50" />
          </label>
          <label>
            <span className="sr-only">Filtrar por vínculo</span>
            <select value={relationship} onChange={(event) => setRelationship(event.target.value)} className="min-h-11 w-full border border-white/[0.12] bg-[#09110d] px-3 text-sm text-[#dce6df] outline-none focus:border-[#39ff88]/50 sm:w-52">
              {relationshipFilters.map((item) => <option key={item} value={item}>{item === "Todos" ? "Todos os vínculos" : item}</option>)}
            </select>
          </label>
          <button onClick={() => setSortNewestFirst((current) => !current)} className="min-h-11 border border-white/[0.12] px-4 font-mono text-[10px] tracking-[0.06em] text-[#c1cec4] hover:border-[#39ff88]/40">
            DATA: {sortNewestFirst ? "MAIS RECENTES" : "MAIS ANTIGAS"}
          </button>
        </div>
        <div className="overflow-x-auto border border-white/[0.1]">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <thead className="bg-[#0b1710] font-mono text-[10px] tracking-[0.08em] text-[#9eaea3]">
              <tr>
                <th scope="col" className="px-4 py-3 font-normal">NOME COMPLETO</th>
                <th scope="col" className="px-4 py-3 font-normal">VÍNCULO</th>
                <th scope="col" className="px-4 py-3 font-normal">CONFIRMADO EM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07] text-sm text-[#d5dfd8]">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3.5">{record.full_name}</td>
                  <td className="px-4 py-3.5">{record.relationship ?? "—"}</td>
                  <td className="px-4 py-3.5">{new Date(record.created_at).toLocaleString("pt-BR", { dateStyle: "medium", timeStyle: "short" })}</td>
                </tr>
              ))}
              {!filteredRecords.length && (
                <tr><td colSpan={3} className="px-4 py-10 text-center text-sm text-[#8c9c91]">
                  {records.length ? "Nenhuma confirmação corresponde aos filtros." : "Ainda não há confirmações registradas."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 font-mono text-[10px] text-[#718177]">EXIBINDO {filteredRecords.length} DE {records.length} REGISTROS</p>
      </section>
    </main>
  );
}
