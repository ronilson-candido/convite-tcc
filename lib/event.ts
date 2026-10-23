export const eventDetails = {
  author: "RONILSON CANDIDO DO NASCIMENTO",
  advisor: "LEANDRO DIAS DA SILVA",
  title: "Modelagem e Análise Formal do Protocolo de Autenticação EDHOC utilizando o Tamarin Prover",
  shortTitle: "Análise formal do protocolo EDHOC",
  date: "25 de novembro de 2026",
  dateIso: "2026-11-25",
  venue: "Auditório do Instituto de Computação (IC), Universidade Federal de Alagoas (UFAL)",
  city: "Maceió, Alagoas, Brasil",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Instituto+de+Computa%C3%A7%C3%A3o+UFAL+Macei%C3%B3",
  description:
    "Uma investigação sobre a modelagem e a análise formal de protocolos de autenticação, explorando métodos para avaliar propriedades de segurança em sistemas conectados.",
};

export const relationshipOptions = [
  "Amigo(a)",
  "Familiar",
  "Professor(a)",
  "Colega de curso",
  "Outro",
] as const;

export type Relationship = (typeof relationshipOptions)[number];

export function getAuthorizedAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}
