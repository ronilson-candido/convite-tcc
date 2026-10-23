"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: String(formData.get("email") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
      });

      if (signInError) {
        setError("Não foi possível autenticar. Confira os dados ou a autorização da conta.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("O serviço de autenticação não está configurado.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-5 py-12">
      <div className="w-full max-w-md border border-[#39ff88]/20 bg-[#09110d] p-7 sm:p-9">
        <p className="font-mono text-xs tracking-[0.16em] text-[#39ff88]">{"// ADMIN_AUTHENTICATION"}</p>
        <h1 className="mt-5 text-3xl font-semibold text-white">Acesso restrito</h1>
        <p className="mt-3 text-sm leading-6 text-[#a1b1a6]">Entre com a conta administrativa previamente autorizada para consultar as confirmações.</p>
        <form action={handleSubmit} className="mt-7 space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="font-mono text-[10px] tracking-[0.1em] text-[#c1cec4]">E-MAIL</label>
            <input id="email" name="email" type="email" autoComplete="username" required className="min-h-12 w-full border border-white/[0.13] bg-[#050a08] px-3 text-sm text-white outline-none focus:border-[#39ff88]/65" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="font-mono text-[10px] tracking-[0.1em] text-[#c1cec4]">SENHA</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="min-h-12 w-full border border-white/[0.13] bg-[#050a08] px-3 text-sm text-white outline-none focus:border-[#39ff88]/65" />
          </div>
          <button disabled={pending} className="min-h-12 w-full bg-[#39ff88] font-mono text-xs font-bold tracking-[0.1em] text-[#041008] hover:bg-[#63ffa0] disabled:opacity-60">
            {pending ? "VERIFICANDO..." : "ENTRAR"}
          </button>
          {error && <p role="alert" className="text-sm leading-6 text-[#ffb3b3]">{error}</p>}
        </form>
        <Link href="/" className="mt-6 inline-block font-mono text-[10px] tracking-[0.08em] text-[#83958a] hover:text-[#39ff88]">← VOLTAR AO CONVITE</Link>
      </div>
    </main>
  );
}
