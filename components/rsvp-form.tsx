"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { relationshipOptions } from "@/lib/event";
import { rsvpSchema, type RsvpFormValues, type RsvpSubmission } from "@/lib/validations";

type FormStatus = { type: "success" | "error"; message: string } | null;

export default function RsvpForm() {
  const [status, setStatus] = useState<FormStatus>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormValues, unknown, RsvpSubmission>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: { full_name: "", relationship: "", submission_key: "", website: "" },
  });

  useEffect(() => {
    setValue("submission_key", crypto.randomUUID());
  }, [setValue]);
  const submissionKeyReady = Boolean(useWatch({ control, name: "submission_key" }));

  async function onSubmit(values: RsvpSubmission) {
    setStatus(null);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus({ type: "error", message: result.error ?? "Não foi possível confirmar agora. Tente novamente." });
        return;
      }

      setStatus({
        type: "success",
        message: "[ ACCESS GRANTED ] Presença confirmada com sucesso! Obrigado por fazer parte desse momento.",
      });
      reset({ full_name: "", relationship: "", submission_key: crypto.randomUUID(), website: "" });
    } catch {
      setStatus({ type: "error", message: "Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente." });
    }
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label htmlFor="full_name" className="font-mono text-[10px] tracking-[0.1em] text-[#c1cec4]">
          NOME COMPLETO <span className="text-[#39ff88]">*</span>
        </label>
        <input
          id="full_name"
          autoComplete="name"
          maxLength={120}
          {...register("full_name")}
          aria-invalid={Boolean(errors.full_name)}
          aria-describedby={errors.full_name ? "full_name-error" : undefined}
          className="min-h-12 w-full border border-white/[0.13] bg-[#050a08] px-3.5 text-sm text-white outline-none transition placeholder:text-[#647168] focus:border-[#39ff88]/65"
          placeholder="Seu nome e sobrenome"
        />
        {errors.full_name && <p id="full_name-error" role="alert" className="text-xs text-[#ff9d9d]">{errors.full_name.message}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="relationship" className="font-mono text-[10px] tracking-[0.1em] text-[#c1cec4]">VÍNCULO COM O AUTOR <span className="text-[#78877d]">(OPCIONAL)</span></label>
        <select
          id="relationship"
          {...register("relationship")}
          className="min-h-12 w-full border border-white/[0.13] bg-[#050a08] px-3.5 text-sm text-[#e5eee7] outline-none transition focus:border-[#39ff88]/65"
        >
          <option value="">Selecione uma opção</option>
          {relationshipOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <input type="hidden" {...register("submission_key")} />
      <button
        type="submit"
        disabled={isSubmitting || !submissionKeyReady}
        className="flex min-h-12 w-full items-center justify-center gap-2 bg-[#39ff88] px-5 font-mono text-xs font-bold tracking-[0.1em] text-[#041008] transition hover:bg-[#63ffa0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#39ff88] disabled:cursor-wait disabled:opacity-60"
      >
        {isSubmitting ? "ENVIANDO CONFIRMAÇÃO..." : submissionKeyReady ? "CONFIRMAR PRESENÇA" : "PREPARANDO FORMULÁRIO..."}
        {!isSubmitting && submissionKeyReady && <span aria-hidden="true">↗</span>}
      </button>
      {status && (
        <p role={status.type === "error" ? "alert" : "status"} aria-live="polite"
          className={`border px-3.5 py-3 text-sm leading-6 ${status.type === "success" ? "border-[#39ff88]/25 bg-[#39ff88]/[0.06] text-[#b8f7cc]" : "border-[#ff7777]/30 bg-[#ff7777]/[0.05] text-[#ffb3b3]"}`}>
          {status.message}
        </p>
      )}
    </form>
  );
}
