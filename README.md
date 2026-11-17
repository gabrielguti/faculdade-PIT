# Vitrine Digital do Bairro - Ribeirão da Ilha, Florianópolis (SC)

Ferramenta gratuita e de código aberto que gera uma página de "vitrine digital" para pequenos negócios de bairro, mais um QR Code imprimível. Ligada ao **ODS 8 da ONU, meta 8.3**: promover políticas que apoiem atividades produtivas, a geração de empregos decentes e o crescimento de micro e pequenas empresas, inclusive pelo acesso a serviços digitais.

O negócio ganha uma página pública com serviços, preços, horário, conversa no WhatsApp e finalização da compra pela conversa, sem custo e sem banco de dados.

## Stack

Next.js 15 (App Router, `output: 'export'`) · TypeScript strict · Tailwind CSS 4 · Zod · Vitest · Playwright · Vercel Analytics

## Arquitetura

```
content/businesses/*.json   um arquivo validado por negócio (fonte da verdade)
src/lib/                    lógica pura e testada (schema, format, search, jsonld, qr, loader)
src/components/             componentes pequenos (servidor por padrão, cliente só quando preciso)
src/app/                    rotas: /, /[slug], /qr/[slug], /cadastro
scripts/qr.ts               exporta os QR Codes em PNG para qr-output/
tests/unit, tests/e2e       suítes Vitest e Playwright
docs/                       plano de testes, laudo de qualidade, roteiro do vídeo
```

Fluxo de dados: `loadBusinesses()` lê e valida cada JSON com Zod durante o build. Um arquivo inválido, ou um slug diferente do nome do arquivo, **faz o build falhar**. As páginas são totalmente estáticas.

## Cobertura dos requisitos

| ID | Implementação |
| --- | --- |
| RF01 | `src/app/[slug]/page.tsx`, `ServiceList` |
| RF02 | `ContactButton`, `contactLink` em `src/lib/format.ts` e `CATEGORY_ACTIONS` em `src/lib/category.ts` (botão de WhatsApp com texto e mensagem por categoria) |
| RF03 | Pix como forma de pagamento aceita (`payments`), sem expor a chave; o pagamento é combinado na conversa |
| RF04 | `src/app/page.tsx`, `BusinessSearch`, `src/lib/search.ts` |
| RF05 | `src/app/cadastro/page.tsx`, `RegistrationForm` (checkbox de autorização LGPD) |
| RF06 | `src/app/qr/[slug]/page.tsx` (CSS de impressão A6) |
| RF07 | `npm run qr` |
| RF08 | `generateMetadata`, `src/lib/jsonld.ts` |
| RF09 | `@vercel/analytics` em `layout.tsx` |

## Como rodar

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build      # exportação estática em out/
```

Qualidade: `npm run lint`, `npm run typecheck`, `npm run test:coverage` e `npm run test:e2e` (exige `npx playwright install chromium` e um `npm run build` antes).

## Como cadastrar um negócio

1. O dono abre `/cadastro`, preenche o formulário e marca a autorização de publicação.
2. Ao gerar, um arquivo `<slug>.json` é salvo no aparelho e aparece o botão **Enviar para o administrador pelo WhatsApp**, que abre a conversa com o cadastro já escrito.
3. O administrador copia o conteúdo para `content/businesses/<slug>.json` (o `slug` deve ser igual ao nome do arquivo) e faz o commit ou abre um pull request. A Vercel publica sozinha.

O cadastro não vai direto ao ar de propósito: o conteúdo é validado no build e revisado no pull request antes de ser publicado. Veja o motivo em [Documentação do projeto](docs/DOCUMENTACAO.md#fluxo-de-publicação-por-que-o-cadastro-não-vai-direto-ao-ar).

## Como gerar os QR Codes

```bash
NEXT_PUBLIC_SITE_URL=https://seu-projeto.vercel.app npm run qr
```

Os PNGs são gravados em `qr-output/`. Para imprimir, abra `/qr/<slug>` e use o botão de impressão (layout A6).

## Deploy

Importe o repositório na Vercel (preset Next.js) e defina as variáveis de ambiente abaixo (Settings, Environment Variables, ambiente Production). Ative o Web Analytics no projeto para o contador de visitas. Depois de definir as variáveis, faça um novo deploy.

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL de produção, sem barra no final. Usada no QR Code, nos metadados e no JSON-LD |
| `NEXT_PUBLIC_ADMIN_WHATSAPP` | WhatsApp do administrador (DDI + DDD + número, só dígitos). Recebe os cadastros enviados pelo formulário. Sem ela, o botão de envio não aparece |

Localmente, copie `.env.example` para `.env.local` e preencha. O `.env.local` não vai para o repositório. Para rodar o e2e, a variável do WhatsApp precisa estar definida antes do build.

## Dados de exemplo

Os 8 negócios em `content/businesses/` (como `padaria-pao-da-ilha` e `salao-mare-alta`) são fictícios, ambientados no Ribeirão da Ilha, e aparecem como negócios reais para simular o ambiente de produção. O rodapé do site informa que se trata de um projeto acadêmico.

**Números de WhatsApp dos dados de demonstração:** todos os negócios fictícios usam o número do autor do projeto, apenas para os cenários de teste. Assim, os botões de WhatsApp podem ser testados de verdade sem contatar terceiros. Em produção, cada negócio informa o seu próprio número no cadastro.

## Documentação

- [Documentação do projeto](docs/DOCUMENTACAO.md)
- [Plano de testes](docs/PLANO_DE_TESTES.md)
- [Laudo de qualidade](docs/LAUDO_DE_QUALIDADE.md)
- [Roteiro do vídeo](docs/ROTEIRO_VIDEO.md)

## Licença

MIT
