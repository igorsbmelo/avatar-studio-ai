# Protótipo de vídeo com avatar — plano de implementação

## Objetivo
Entregar um protótipo validável do Avatar Studio AI com dois caminhos de entrada:
1. selecionar um clipe da biblioteca do aplicativo;
2. enviar um vídeo próprio.

O usuário escolhe um avatar e solicita uma transformação de vídeo. Nesta fase, priorizar um fluxo vertical funcional, custos controlados e validação técnica. Não publicar em produção.

## Estado atual observado no código
- `/videos` apresenta clipes de biblioteca e seleção local; a própria interface informa que a seleção ainda não gera o vídeo final.
- O upload atual usa uma URL local do navegador para pré-visualização. Não envia o arquivo ao servidor nem cria um trabalho de IA.
- `/avatars` lista modelos do catálogo e permite selecioná-los.
- A geração paga de imagens OpenAI está desativada no modo gratuito. Recomendações do catálogo não criam uma imagem nova.
- O projeto é Next.js 15, React 19 e Supabase; não há dependência de processamento de vídeo já instalada.

## Escopo do protótipo
### Fluxo do usuário
1. Escolher origem: biblioteca ou vídeo próprio.
2. Selecionar/confirmar o avatar.
3. Validar vídeo e avatar antes de submeter (tipo, tamanho, duração, resolução; limites configuráveis).
4. Criar um registro de trabalho com estado `queued`.
5. Processar fora do request HTTP da página, com estados `queued → processing → succeeded/failed`.
6. Mostrar progresso honesto e, quando disponível, player de resultado com download.
7. Excluir arquivos temporários segundo uma política de retenção explícita.

### Arquitetura proposta
- **Next.js**: UI, autenticação, validação, criação/consulta do trabalho; não executar inferência pesada no servidor web.
- **Supabase**: autenticação e metadados do trabalho. Definir uma tabela dedicada, por exemplo `video_jobs`, com dono, origem, status, progresso, erro público, paths de entrada/saída, provedor/modelo e timestamps.
- **Storage privado**: buckets privados para entrada e saída; URLs assinadas de curta duração. Aplicar políticas RLS que restrinjam cada trabalho ao seu proprietário.
- **Worker separado**: serviço/container de processamento de vídeo que busca trabalhos na fila, processa e atualiza estados. Nunca colocar a chave do provedor no browser ou em logs.
- **Adaptador de provedor**: interface interna independente de fornecedor (`submitJob`, `getJobStatus`, `cancelJob` quando suportado), para testar um provedor de vídeo/face-swap e comparar depois com modelos abertos executados em GPU própria/alugada.
- **Limites de custo/abuso**: autenticação obrigatória, limite de tamanho/duração, concorrência por usuário, quota diária de protótipo, timeout, retries limitados, cancelamento e logs sem dados sensíveis.

## Etapas de entrega
### Etapa 1 — especificação e validação da entrada
- Definir limites iniciais modestos para vídeos e formatos.
- Definir o que significa “trocar avatar”: troca de rosto mantendo o corpo/áudio/movimento original, ou avatar de corpo inteiro. O protótipo deve começar com uma única definição.
- Escolher clipes licenciados e validar consentimento/autorização para vídeos enviados.
- Criar contrato TypeScript para `VideoJob` e estados da UI; nenhum processamento pago ainda.

### Etapa 2 — pipeline de jobs sem IA
- Criar tabela/migração, RLS e bucket privado em ambiente de desenvolvimento.
- Implementar upload real e armazenamento temporário seguro.
- Implementar criação/consulta de jobs, estados e mensagens de erro.
- Implementar worker de teste que recebe um vídeo e devolve uma cópia/transcodificação de teste, provando o fluxo ponta a ponta sem custos de IA.

### Etapa 3 — prova de conceito de IA
- Avaliar 1 serviço hospedado com créditos de teste/cota gratuita e 1 opção de modelo aberto.
- Antes de integrar, verificar licença do código e dos pesos/modelos, política de conteúdo, privacidade, limite de duração, resolução, fila e preço real.
- Fazer teste com vídeos curtos autorizados e avatares próprios/consentidos.
- Medir latência, taxa de falha, qualidade temporal, artefatos e custo por minuto; não prometer “gratuito ilimitado”.
- Implementar o provedor atrás do adaptador, com chave somente no worker/servidor.

### Etapa 4 — experiência completa em Preview
- Conectar biblioteca e upload próprio ao mesmo fluxo de jobs.
- Exibir progresso, falhas recuperáveis, retry seguro e resultado MP4.
- Testar acesso cruzado entre usuários, arquivos inválidos, timeouts, cancelamento e limites.
- Validar no deployment Preview; registrar os resultados de lint/build/testes efetivamente executados.

### Etapa 5 — decisão de produto
- Revisar qualidade, custo, licenças e experiência.
- Só depois decidir se haverá plano gratuito limitado, BYOK (chave própria) ou planos pagos.
- Produção permanece intocada até aprovação explícita.

## Critérios de aceitação do protótipo
- Os dois tipos de entrada chegam ao mesmo fluxo de trabalho.
- Um usuário só consegue ver seus próprios trabalhos e arquivos.
- O estado é persistido e sobrevive a atualizar a página.
- Falhas de processamento não aparecem falsamente como sucesso.
- Existe pelo menos uma prova ponta a ponta sem IA antes de habilitar inferência.
- A IA só é habilitada após confirmar fornecedor/modelo, licença, custo e proteção contra abuso.
- Nenhuma alteração é publicada em produção sem aprovação explícita.

## Riscos e decisões pendentes
- Troca de rosto em vídeo é diferente de geração de vídeo completo e tem requisitos/qualidade distintos.
- Modelos abertos podem exigir GPU e têm licenças de código e pesos separadas.
- Cotas gratuitas de serviços externos mudam e não devem ser tratadas como garantia de operação permanente.
- Vídeos podem conter dados biométricos/pessoais; obter autorização, explicar retenção e limitar acesso.
- Não usar rostos de terceiros sem autorização nem apresentar deepfakes enganosos como autênticos.

## Fora do escopo desta fase
- Produção, faturamento, créditos de usuários, planos comerciais ou compra automática de serviços.
- Prometer processamento ilimitado/gratuito.
- Armazenar mídia pública ou deixar arquivos de usuário acessíveis por URL permanente.
