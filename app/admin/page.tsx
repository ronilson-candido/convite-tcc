import AdminDashboard from "@/components/admin-dashboard";
import AdminLogin from "@/components/admin-login";
import { getAuthorizedAdminEmails } from "@/lib/event";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type RsvpRecord = {
  id: string;
  full_name: string;
  relationship: string | null;
  created_at: string;
};

export default async function AdminPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <AdminMessage title="Configuração pendente" message="Configure o Supabase para acessar o painel administrativo." />;
  }

  const authClient = await createSupabaseServerClient();
  const { data: { user } } = await authClient.auth.getUser();
  const authorizedEmails = getAuthorizedAdminEmails();

  if (!user) {
    return <AdminLogin />;
  }

  const userEmail = user.email?.trim().toLowerCase();
  if (!userEmail || !user.email_confirmed_at || !authorizedEmails.includes(userEmail)) {
    return <AdminMessage title="Acesso não autorizado" message="Esta conta não está na lista de administradores autorizados." signOut />;
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return <AdminMessage title="Configuração pendente" message="A chave privada do Supabase não está configurada no servidor." signOut />;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("rsvps")
    .select("id, full_name, relationship, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin RSVP query failed:", error.code);
    return <AdminMessage title="Não foi possível carregar os dados" message="Verifique a configuração do banco e tente novamente." signOut />;
  }

  return <AdminDashboard records={(data ?? []) as RsvpRecord[]} email={userEmail} />;
}

function AdminMessage({ title, message, signOut = false }: { title: string; message: string; signOut?: boolean }) {
  return (
    <main className="flex min-h-svh items-center justify-center px-5">
      <div className="w-full max-w-md border border-[#39ff88]/20 bg-[#09110d] p-8">
        <p className="font-mono text-xs tracking-[0.16em] text-[#39ff88]">{"// ADMIN_CONSOLE"}</p>
        <h1 className="mt-4 text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#a1b1a6]">{message}</p>
        {signOut && (
          <form action="/admin/signout" method="post">
            <button className="mt-6 border border-white/15 px-4 py-2 font-mono text-xs text-[#dce6df] hover:border-[#39ff88]/40">SAIR DA CONTA</button>
          </form>
        )}
      </div>
    </main>
  );
}
