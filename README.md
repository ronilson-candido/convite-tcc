# Convite de defesa de TCC — EDHOC

Convite digital responsivo para a defesa de **“Modelagem e Análise Formal do Protocolo de Autenticação EDHOC utilizando o Tamarin Prover”**, de Ronilson Candido do Nascimento. A aplicação usa Next.js App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL/Auth, Zod e React Hook Form.

## Requisitos

- Node.js 20.9 ou superior e npm.
- Projeto Supabase.
- Conta administrativa criada no Supabase Auth (não há cadastro público).
- Conta Vercel para publicação.

## Executar localmente

1. Instale as dependências: `npm install`.
2. Copie `.env.example` para `.env.local`.
3. Preencha as variáveis conforme a seção Supabase abaixo.
4. Inicie o servidor de desenvolvimento: `npm run dev`.
5. Verifique os tipos e o build com `npm run typecheck` e `npm run build`.

## Configurar o Supabase

1. Crie um projeto no [Supabase](https://supabase.com/dashboard) e escolha uma região adequada.
2. Em **Project Settings → API**, copie a Project URL e a chave pública `anon` para `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Copie a chave `service_role` para `SUPABASE_SERVICE_ROLE_KEY` **somente** no ambiente privado do servidor. Nunca use o prefixo `NEXT_PUBLIC_` nessa chave nem a publique no GitHub.
4. Gere um segredo independente para `RATE_LIMIT_SECRET`, com pelo menos 32 caracteres (por exemplo `openssl rand -hex 32`). A aplicação usa HMAC; o IP original não é gravado no banco.
5. Aplique a migration `supabase/migrations/202610230001_create_private_rsvps.sql` pelo SQL Editor do Supabase (cole e execute seu conteúdo) ou pela Supabase CLI (`supabase db push`, depois de vincular o projeto).
6. Em **Authentication → Users**, crie/invite a conta administrativa. Desative qualquer fluxo de cadastro público que não seja necessário.
7. Preencha `ADMIN_EMAILS` com os e-mails das contas administrativas, separados por vírgula. A verificação compara o e-mail verificado da sessão com essa lista no servidor.
8. Em **Authentication → URL Configuration**, inclua os endereços locais e de produção como URLs de redirecionamento permitidas, conforme o fluxo de autenticação configurado.

## Variáveis de ambiente

| Nome | Exposição | Finalidade |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Pública | Endereço do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pública | Chave pública sujeita a RLS; usada apenas no login |
| `SUPABASE_SERVICE_ROLE_KEY` | **Somente servidor** | Inserir RSVP, aplicar rate limit e ler a lista após autorização administrativa |
| `ADMIN_EMAILS` | Servidor | Lista explícita de contas administrativas autorizadas |
| `RATE_LIMIT_SECRET` | **Somente servidor** | HMAC para pseudonimizar o endereço IP usado no limite |

Não envie `.env.local` ao Git; ele está ignorado pelo `.gitignore`. Nunca compartilhe chaves em issues, logs ou screenshots.

## Publicar com GitHub e Vercel

1. Crie um repositório GitHub privado ou público e envie o código, sem arquivos `.env`.
2. No painel da Vercel, escolha **Add New → Project**, importe o repositório e mantenha os padrões do Next.js.
3. Em **Project → Settings → Environment Variables**, cadastre as cinco variáveis acima para os ambientes de produção (e preview se necessário). `SUPABASE_SERVICE_ROLE_KEY` e `RATE_LIMIT_SECRET` precisam estar disponíveis somente no servidor.
4. Faça o deploy e associe o domínio/subdomínio em **Settings → Domains**. Configure os registros DNS indicados pela Vercel.
5. Inclua o domínio final nas URLs permitidas do Supabase Auth. O Maps abre uma busca institucional sem coordenadas predefinidas.
6. Faça novo deploy depois de alterar variáveis de ambiente.

## Personalização do evento

- Substitua `public/portrait-placeholder.svg` pela foto local do autor. Atualize o caminho e o texto alternativo em `app/page.tsx` se mudar o nome do arquivo.
- Edite nome, título e dados institucionais em `lib/event.ts`.
- O horário segue como **[HORÁRIO A CONFIRMAR]**. Para ajustar a contagem, defina `EVENT_DATETIME_LOCAL` no topo de `components/countdown.tsx` como uma data ISO com fuso explícito, por exemplo `2026-11-25T14:00:00-03:00`. O valor nulo atual conta provisoriamente até o início do dia em Maceió (UTC−03:00), sem afirmar um horário de defesa.

## Proteções e limites conhecidos

- A rota `/api/rsvp` valida os dados com Zod no servidor; exige nome e sobrenome, limita o tamanho, restringe os vínculos e usa campo honeypot.
- Uma chave de idempotência aleatória impede que uma repetição acidental da mesma submissão crie outra confirmação.
- O limite de requisições é persistido no PostgreSQL, em janelas horárias e por IP pseudonimizado com HMAC. A migration permite até 10 submissões por IP por hora. Como em qualquer limite por IP, redes compartilhadas podem compartilhar a cota; a origem do IP depende dos cabeçalhos do provedor de hospedagem configurado.
- RLS está habilitado e não existem políticas de leitura/escrita para `anon` ou `authenticated`; a tabela e a função de rate limit só são acessíveis pelo servidor com `service_role`.
- A sessão do Supabase é validada no servidor para cada renderização do painel; a autorização também exige correspondência com `ADMIN_EMAILS`. O navegador nunca recebe a lista de convidados. Não existe cadastro público de administradores.
- Cabeçalhos HTTP incluem CSP, proteção contra framing, MIME sniffing, política de referenciador e permissões; HSTS é aplicado em produção.
- Senhas são geridas exclusivamente pelo Supabase Auth. Erros enviados ao navegador não contêm credenciais ou detalhes internos; logs de falhas do servidor incluem somente códigos, não nomes ou dados enviados.
- O limite implementado é básico: um visitante malicioso ainda pode distribuir tentativas por diversos IPs. Para risco maior, use um provedor gerenciado de bot protection/rate limit e monitore o consumo; mantenha a `service_role` segura e rotacione segredos em caso de exposição.

## Checklist de publicação e segurança

- [ ] Migration aplicada; tabela `rsvps`, índices, trigger e função de rate limit existem.
- [ ] RLS está habilitado e `anon`/`authenticated` não conseguem consultar nem inserir registros.
- [ ] A função `consume_rsvp_rate_limit` não pode ser chamada por `anon` ou `authenticated`.
- [ ] `service_role` e `RATE_LIMIT_SECRET` existem somente nas variáveis protegidas da Vercel e no ambiente local não versionado.
- [ ] Confirmar presença sem conta salva o registro; atualizar a página não remove o registro.
- [ ] Nome inválido, honeypot preenchido e requisição malformada são rejeitados; duplo clique/repetição com a mesma chave não duplica o RSVP.
- [ ] Limite excedido retorna HTTP 429 e falhas de configuração não simulam sucesso.
- [ ] Visitante anônimo não vê a lista; usuário autenticado fora de `ADMIN_EMAILS` também não.
- [ ] Administrador autorizado consegue pesquisar, filtrar, ordenar e exportar CSV; encerrar sessão bloqueia o painel após atualizar.
- [ ] Validar visualização, navegação por teclado, redução de movimento e formulário em smartphone, tablet e desktop.
- [ ] Testar o deploy de produção e as URLs de autenticação no domínio real da Vercel.
