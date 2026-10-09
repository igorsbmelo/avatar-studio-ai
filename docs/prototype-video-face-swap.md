# Protótipo: troca de rosto em vídeo enviado pelo usuário

## Objetivo
Permitir que uma pessoa autenticada envie um vídeo próprio/devidamente autorizado, selecione um avatar e obtenha um MP4 de prévia com a troca de rosto. Esta etapa é um plano de protótipo; não implementa processamento facial nem habilita serviços pagos.

## Restrições do protótipo
- Trabalhar somente na branch `fix/consolidated-avatar-video-checkout`.
- Não fazer merge em `main`, deploy de produção, nem alterar Supabase/produção.
- Não chamar a API paga de geração de imagens da OpenAI.
- Não prometer processamento gratuito ilimitado; a inferência pode exigir GPU e armazenamento temporário.
- Só aceitar vídeos e rostos que o usuário tenha direito de usar; bloquear conteúdo sexual, menores, assédio e uso para personificação enganosa. Pedir confirmação explícita de consentimento/autorização.
- Verificar licença comercial e termos dos pesos/modelos antes de selecionar tecnologia.

## Arquitetura proposta
1. **Web (Next.js)**: upload autenticado, seleção do avatar, estado do job e link de download.
2. **Armazenamento privado**: upload temporário para bucket privado; nomes aleatórios, limites de tamanho/duração e tipos MIME verificados no servidor. URLs assinadas curtas, sem exposição pública.
3. **API de jobs**: cria um registro de job, valida autenticação e autorização, aplica limites por usuário e retorna `job_id`; não processa vídeo dentro de uma função serverless curta.
4. **Worker separado**: serviço Python isolado para FFmpeg e modelo de face swap aprovado. Fila com estados `queued`, `processing`, `completed`, `failed`; timeout, limite de memória e limpeza garantida dos arquivos temporários.
5. **Resultado**: MP4 armazenado em privado, URL assinada temporária, expiração automática e opção de apagar arquivo.
6. **Custos e observabilidade**: limitar resolução, duração, tamanho, concorrência e tentativas; registrar duração e consumo por job sem registrar rostos ou prompts sensíveis.

## Plano incremental

### Fase 0 — Inventário e segurança
- Revisar fluxo atual de `/videos`, autenticação, tabelas/buckets e políticas RLS.
- Definir limite inicial do protótipo (ex.: vídeo curto de baixa resolução) após medir infraestrutura.
- Avaliar modelos candidatos, licenças de código e pesos, requisitos de GPU e regras de uso.
- Confirmar que nenhuma rota pública consegue iniciar geração paga por engano.

### Fase 1 — UX sem inferência
- Construir formulário de upload e seleção de avatar.
- Validar extensão, MIME real, tamanho, duração e consentimento.
- Criar job simulado com estados e mensagens reais de erro; não fingir que o vídeo foi processado.
- Testar autorização, remoção de arquivos e limites.

### Fase 2 — Worker mínimo
- Criar serviço separado com Docker, FFmpeg e fila.
- Primeiro executar somente transcodificação de um vídeo de teste autorizado para validar pipeline e armazenamento.
- Adicionar modelo de troca facial somente após revisão de licença/segurança e teste de qualidade.
- Manter o worker desligado por padrão e sem endpoint público aberto.

### Fase 3 — Validação
- Testar vídeos variados, áudio sincronizado, orientação, falhas, cancelamento e expiração.
- Medir tempo por minuto de vídeo, RAM/VRAM, armazenamento e custo estimado.
- Executar testes de abuso, autenticação, acesso cruzado entre usuários e exclusão de arquivos.

### Fase 4 — Decisão
- Comparar processamento local com serviço externo de cota gratuita.
- Documentar limites reais e custos; não anunciar plano gratuito ilimitado.
- Pedir aprovação explícita antes de qualquer merge/deploy de produção.

## Critérios de aceite do protótipo
- Usuário não autenticado não consegue enviar ou consultar jobs.
- Um usuário não consegue acessar arquivos ou jobs de outro usuário.
- Upload inválido ou acima do limite é rejeitado no servidor.
- Falhas são mostradas claramente; nenhuma prévia falsa é exibida como resultado.
- Arquivos temporários expiram e podem ser apagados.
- Nenhuma chamada paga à OpenAI é feita pelo fluxo de troca de rosto.
- A troca facial só é habilitada após aprovação de modelo/licença e testes.

## Riscos conhecidos
- “Open source” não significa que os pesos sejam livres para uso comercial.
- Troca facial realista pode exigir GPU; serviço gratuito pode ter fila, limite ou indisponibilidade.
- Não armazenar uploads permanentemente por padrão. Definir retenção curta e comunicar claramente ao usuário.
- Não executar FFmpeg/modelos em rotas Next.js de curta duração; usar worker isolado.
