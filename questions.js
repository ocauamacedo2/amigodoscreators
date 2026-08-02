// ===============================
// BANCO DE PERGUNTAS — QUIZ 📚
// ===============================

let idc = 1;
const Q = [];
const L = ['A', 'B', 'C', 'D'];

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const getRandomLetterIdx = () => Math.floor(Math.random() * 4);

const compact = (s) => {
  let out = String(s || '').trim().replace(/\s+/g, ' ');
  if (out.length > 84) out = out.slice(0, 81) + '...';
  return out;
};

function addS(categoria, texto, choices, correctIndex) {
  const idx = [0, 1, 2, 3];
  const perm = shuffle(idx);
  const targetLetterIdx = getRandomLetterIdx();
  const posCorrect = perm.indexOf(correctIndex);

  const respostaTexto = choices[correctIndex];
  if (posCorrect !== targetLetterIdx) {
    [perm[posCorrect], perm[targetLetterIdx]] = [perm[targetLetterIdx], perm[posCorrect]];
  }

  const opcoes = perm.map((i, k) => `${L[k]}) ${compact(choices[i])}`);
  const resposta = L[targetLetterIdx];

  Q.push({ id: idc++, categoria, texto, opcoes, resposta, respostaTexto });
}

// --- REGRAS GERAIS / CONDUTA ---
// =========================
// REGRAS GERAIS / CONDUTA
// =========================
addS('Conduta', 'O que a SantaCreators espera de quem faz parte da equipe?', [
  'Boa comunicação, presença e produtividade',
  'Respeito, postura e consciência',
  'Comprometimento, resultado e constância',
  'Postura firme, criatividade e iniciativa'
], 1);

addS('Conduta', 'A entrevista serve principalmente para:', [
  'Validar se a pessoa tem perfil e veste a camisa',
  'Liberar cargo após aprovação técnica',
  'Ver se a pessoa veste a camisa de verdade',
  'Avaliar postura antes da integração final'
], 2);

addS('Conduta', 'Problemas da empresa devem ser resolvidos como?', [
  'Nos canais corretos e com organização',
  'Diretamente com quem estiver disponível',
  'Com alinhamento interno e registro correto',
  'Nos canais corretos e com liderança ciente'
], 0);

addS('Conduta', 'A hierarquia dentro da SantaCreators é vista como:', [
  'Uma referência visual de cargos',
  'Estrutura com função e responsabilidade',
  'Uma divisão de áreas com autonomia',
  'Uma organização formal de liderança'
], 1);

addS('Conduta', 'Cada membro possui um canal privado com seu nome para:', [
  'Resolver questões internas com mais agilidade',
  'Tirar dúvidas e pedir ajuda com segurança',
  'Receber orientações e registrar necessidades',
  'Tratar pendências com acompanhamento'
], 1);

addS('Conduta', 'Qual destas atitudes pode gerar expulsão mesmo se foi "brincadeira"?', [
  'Debochar de regra interna em alinhamento',
  'Ofender alguém com preconceito',
  'Insistir em brincadeira pesada com membro',
  'Racismo, homofobia ou transfobia'
], 3);

addS('Conduta', 'Se você decidir sair da SantaCreators, o procedimento correto é:', [
  'Avisar seu responsável e aguardar orientação final',
  'Pedir demissão em game para a equipe',
  'Solicitar desligamento no setor responsável',
  'Comunicar a liderança antes de remover qualquer coisa'
], 1);

addS('Conduta', 'A idade mínima permitida para participar da SantaCreators é:', [
  '14 anos', '15 anos', '16 anos', '15 anos completos ou quase completos'
], 1);

addS('Conduta', 'Familiares podem atuar juntos na equipe?', [
  'Sim, desde que não estejam na mesma área',
  'Não, por questões éticas e organizacionais',
  'Somente em setores sem poder de decisão',
  'Apenas se houver autorização prévia da liderança'
], 1);

addS('Conduta', 'Se houver vínculo familiar com alguém da equipe, o correto é:', [
  'Informar no momento da entrada ou assim que possível',
  'Avisar imediatamente a liderança responsável',
  'Registrar com o responsável direto antes de atuar',
  'Deixar isso alinhado com a gestão desde o início'
], 1);

// =========================
// IMERSÃO / RP
// =========================
addS('Imersão', 'No meio do RP, falar "meu Discord caiu" é:', [
  'Uma justificativa aceitável em situação urgente',
  'Quebra de imersão',
  'Uma quebra leve, mas tolerável',
  'Algo evitável, mas compreensível'
], 1);

addS('Imersão', 'Se ocorrer bug ou alguém estiver flutuando, o mais correto é:', [
  'Usar uma justificativa criativa dentro da narrativa',
  'Evitar comentar e seguir o RP normalmente',
  'Contornar a situação sem quebrar a cena',
  'Improvisar algo coerente com o contexto'
], 0);

addS('Imersão', 'Se estiver sem microfone no RP, uma substituição mais imersiva seria:', [
  'Minha voz falhou do nada',
  'Minha garganta tá ruim',
  'Hoje eu tô rouco pra caramba',
  'Minha cabeça tá doendo pra falar'
], 1);

// --- UNIFORME / VEÍCULOS ---
addS('Imersão', 'Trocar de roupa na frente de outros players, sem contexto, é:', [
  'Uma quebra de imersão',
  'Uma atitude evitável no RP',
  'Algo incoerente com a cena',
  'Um comportamento fora do ideal'
], 0);

addS('Imersão', 'Ao precisar sair da cidade/logar off perto de outros players, o melhor é:', [
  'Encerrar a cena rapidamente e sair',
  'Sair de forma imersiva e em local adequado',
  'Buscar uma justificativa coerente e se retirar',
  'Evitar desaparecer no meio da interação'
], 1);

addS('Imersão', 'Usar palavras do mundo exterior diretamente no RP deve ser:', [
  'Controlado para não atrapalhar a cena',
  'Evitado',
  'Usado apenas quando não houver opção',
  'Substituído por falas mais imersivas'
], 1);

addS('Imersão', 'A frase "tô com os olhos abertos" é usada para substituir:', [
  'Tô sem áudio',
  'Tô em live',
  'Tô mutado',
  'Tô só ouvindo'
], 1);

addS('Imersão', 'Usar comandos do F8 para flutuar ou sentar no ar sem sentido no RP é:', [
  'Uma quebra desnecessária de imersão',
  'Uma conduta a ser evitada',
  'Um comportamento inadequado em cena',
  'Algo que compromete a seriedade do RP'
], 1);

// =========================
// UNIFORME / PRÉDIO / VEÍCULOS
// =========================
addS('Uniforme', 'Dentro do prédio da SantaCreators, o uso obrigatório é de:', [
  'Ao menos uma peça visível da empresa',
  'Jaqueta da SantaCreators',
  'Uniforme oficial ou peça principal da empresa',
  'Identificação visual da empresa'
], 1);

addS('Uniforme', 'Nas proximidades do prédio, o membro deve usar:', [
  'Ao menos uma peça da SantaCreators',
  'Uma identificação discreta da empresa',
  'Uniforme parcial visível para reconhecimento',
  'Peça oficial compatível com o ambiente'
], 0);

addS('Uniforme', 'Para usar as garagens da empresa, é necessário:', [
  'Ter cargo e estar identificado',
  'Estar com ao menos uma peça da SantaCreators',
  'Estar com uniforme visível da empresa',
  'Ter vínculo ativo e roupa compatível'
], 1);

addS('Uniforme', 'Se a pessoa entrar no prédio sem a jaqueta, o correto é:', [
  'Ajustar o uniforme em local reservado',
  'Ir a uma sala sozinho e vestir a peça',
  'Se retirar por um momento e regularizar a roupa',
  'Corrigir a vestimenta sem expor a cena'
], 1);

addS('Veículos', 'Usar veículos da SantaCreators para troca de tiro é:', [
  'Totalmente inadequado e proibido',
  'Proibido',
  'Vedado mesmo em situação emergencial',
  'Não autorizado em hipótese normal'
], 1);

// --- BAÚS ---
addS('Veículos', 'Usar veículos do prédio para assalto de pista é:', [
  'Incompatível com o uso da empresa',
  'Proibido',
  'Vedado por desvio de finalidade',
  'Não autorizado para ações criminais'
], 1);

addS('Veículos', 'Sequestro com veículo da empresa só é permitido quando:', [
  'Houver contexto aprovado e situação específica',
  'Houver RP organizado e dentro do horário permitido',
  'Existir autorização de liderança e cenário coerente',
  'For uma ação alinhada e dentro da regra'
], 1);

addS('Uniforme', 'Em ações ilegais fora da sede, o uso do uniforme é:', [
  'Desaconselhado, salvo ordem superior',
  'Proibido, devendo trocar de roupa antes',
  'Inadequado por expor a empresa',
  'Vedado para preservar a identificação'
], 1);

addS('Uniforme', 'Trocar de roupa na frente de outros players durante ação externa é:', [
  'Errado, devendo ser feito em local privado',
  'Inadequado, salvo em local seguro e isolado',
  'Uma quebra evitável de coerência',
  'Algo que só deveria ocorrer fora de vista'
], 0);

// =========================
// BAÚS
// =========================
addS('Baús', 'O baú pessoal da SantaCreators é:', [
  'De uso individual do membro responsável',
  'Uso livre e exclusivo do membro',
  'Reservado ao uso particular autorizado',
  'Um espaço pessoal vinculado ao membro'
], 1);

addS('Baús', 'No baú geral, o uso correto é:', [
  'Usar com consciência e sem exagero',
  'Usar com bom senso e pensar nos colegas',
  'Retirar apenas o que realmente vai utilizar',
  'Fazer uso equilibrado pensando no coletivo'
], 1);

addS('Baús', 'No baú geral, qual destas opções respeita a regra?', [
  'Pegar apenas o suficiente para a demanda atual',
  'Pegar somente o necessário para consumo próprio',
  'Retirar o básico sem prejudicar os demais',
  'Usar com limite e sem estocar'
], 1);

addS('Baús', 'O baú creators serve para:', [
  'Doações, repasses e entregas da equipe',
  'Doações e entregas, sem retirada',
  'Armazenar itens destinados à operação interna',
  'Recebimentos da equipe sem uso pessoal'
], 1);

addS('Baús', 'Retirar item do baú creators é:', [
  'Proibido',
  'Vedado salvo autorização expressa',
  'Não permitido para uso comum',
  'Incompatível com a finalidade do baú'
], 0);

addS('Baús', 'No baú de vendas, a divisão correta é:', [
  '60% para você e 40% painel',
  '70% para você e 30% painel',
  '50% para você e 50% para o painel',
  '40% para você e 60% painel'
], 2);

addS('Baús', 'Se alguém usar o baú de vendas e não dividir corretamente, a punição prevista é:', [
  'Advertência grave e devolução',
  'Ban imediato',
  'Punição severa por desvio',
  'Desligamento por quebra de confiança'
], 1);

// --- PODERES ---
addS('Baús', 'O baú coordenação é voltado para:', [
  'Organização interna de metas e entregas',
  'Materiais de apoio da coordenação',
  'Itens voltados ao controle interno',
  'Demandas operacionais da liderança'
], 0);

addS('Baús', 'O baú responsável pode ser acessado por:', [
  'Somente a RESP',
  'Apenas liderança máxima da área',
  'Exclusivamente a responsável da equipe',
  'Somente quem ocupa a função de RESP'
], 0);

// =========================
// PODERES / ANTI-RP
// =========================
addS('Poderes', 'Os poderes da SantaCreators existem para:', [
  'Apoio operacional e controle da empresa',
  'Fins administrativos e empresariais',
  'Organização estrutural e necessidade interna',
  'Gestão de demandas sem benefício pessoal'
], 1);

addS('Poderes', 'Usar comando para ir até um amigo no outro lado da cidade durante o RP é:', [
  'Uso indevido da função',
  'Abuso de poder',
  'Desvio da finalidade do comando',
  'Aproveitamento irregular de privilégio'
], 1);

addS('Poderes', 'A regra de ouro sobre poderes é:', [
  'Você só pode usar quando houver justificativa interna',
  'Se um player comum não pode, você também não pode',
  'Poder não existe para te dar vantagem no RP',
  'Se fugir da lógica do player comum, está errado'
], 1);

addS('Poderes', 'Usar noclip sem necessidade, fora de demanda da empresa, é:', [
  'Uso incorreto de ferramenta administrativa',
  'Abuso de poder',
  'Conduta proibida por desvio de função',
  'Ação irregular fora do contexto empresarial'
], 1);

addS('Poderes', 'Se morrer em uma ação de RP, o correto é:', [
  'Aguardar suporte adequado dentro da cena',
  'Chamar médico ou ir para os bombeiros',
  'Seguir o fluxo normal de atendimento do RP',
  'Prosseguir como qualquer player comum'
], 1);

addS('Poderes', 'Se alguém cometer anti-rp contra você, o primeiro passo correto é:', [
  'Guardar as provas e levar para análise',
  'Clipar tudo e pegar os passaportes',
  'Registrar a situação com evidência completa',
  'Coletar material antes de qualquer ação'
], 1);

addS('Poderes', 'Em caso de anti-rp sofrido, você nunca deve:', [
  'Resolver por conta própria usando comando',
  'Usar seus poderes para resolver na hora',
  'Punir sem fluxo e sem registro',
  'Interferir como staff no calor da cena'
], 1);

// --- HIERARQUIA / SOCIAL / MANAGER ---
addS('Poderes', 'Sem alinhamento e sem autorização, o uso de comando da gestão deve ser:', [
  'Restringido ao mínimo necessário',
  'Evitado',
  'Suspenso até confirmação superior',
  'Não utilizado fora de necessidade clara'
], 1);

addS('Poderes', 'Na dúvida sobre usar um poder, a orientação correta é:', [
  'Perguntar antes',
  'Confirmar com liderança antes da ação',
  'Validar o contexto antes de usar',
  'Checar autorização antes de executar'
], 0);

// =========================
// CALL / ORGANIZAÇÃO / PONTO
// =========================
addS('Organização', 'Ficar em call na cidade é obrigatório para todos?', [
  'Não',
  'Depende do setor e da função',
  'Apenas em situações específicas',
  'Não de forma geral para todos'
], 0);

addS('Organização', 'Para quem busca entrosamento, aprendizado e evolução, a call é:', [
  'Importante para evolução e acompanhamento',
  'Altamente recomendada',
  'Muito útil para integração da equipe',
  'Quase essencial para quem quer crescer'
], 1);

addS('Organização', 'Responsáveis têm obrigação de:', [
  'Acompanhar a equipe com constância',
  'Ficar em call para ajudar a equipe',
  'Estar disponíveis para suporte e orientação',
  'Dar assistência ativa à operação'
], 1);

addS('Organização', 'Alinhamentos na SantaCreators acontecem:', [
  'Em call com o responsável',
  'Em reunião com liderança da área',
  'Em call estruturada com quem acompanha você',
  'Em conversa orientada com o responsável direto'
], 0);

addS('Organização', 'Sempre que usar poderes, você deve:', [
  'Registrar no canal adequado ao fim do uso',
  'Registrar no final do dia no canal correto',
  'Garantir que o uso ficou documentado',
  'Formalizar o registro no fluxo correto'
], 1);

addS('Organização', 'O bate ponto da SantaCreators funciona em quais horários?', [
  '19:00 às 00:00 e 00:30 às 03:30',
  '17:00 às 23:00 e 01:00 às 04:00',
  '18:00 às 23:00 e 00:00 às 03:00',
  'Somente 19:00 às 23:00'
], 0);

addS('Organização', 'Atualmente, qual destes itens gera pontos no sistema?', [
  'Registro de poderes utilizados',
  'Registro correto de uso de poder',
  'Lançamento de poder em canal apropriado',
  'Documentação do uso administrativo'
], 0);

addS('Organização', 'A regra sobre registros importantes é:', [
  'Registrar uma única vez dentro do fluxo correto',
  'Registrar somente uma vez por dia, quando necessário',
  'Evitar duplicidade e registrar com responsabilidade',
  'Documentar apenas quando realmente couber'
], 1);

// =========================
// ADVERTÊNCIAS / PRESENÇA
// =========================
addS('Advertência', 'Qual destas situações pode gerar advertência nas proximidades da sede?', [
  'Estar sem identificação da empresa',
  'Circular sem peça oficial visível',
  'Estar perto da sede sem vestimenta adequada',
  'Ignorar o padrão visual exigido na área'
], 0);

addS('Advertência', 'Qual destes exemplos representa quebra de imersão?', [
  'Minha mãe tá me chamando',
  'Meu telefone tocou aqui agora',
  'Minha internet oscilou do nada',
  'Tive um problema aqui fora do RP'
], 0);

addS('Advertência', 'Má conduta envolve:', [
  'Postura inadequada e tratamento desrespeitoso',
  'Falta de respeito e respostas debochadas',
  'Comportamento incompatível com a função',
  'Atitudes sem educação e sem postura'
], 1);

addS('Advertência', 'Para cargos Coord.+, Resp. Líder e Resp. Influ, a presença nos eventos da operação é:', [
  'Obrigatória no acompanhamento da operação, respeitando o cronograma atual e justificativa quando necessário',
  'Obrigatória apenas nos eventos realizados às 23:30',
  'Facultativa se a pessoa tiver feito pontos na semana',
  'Necessária somente quando houver premiação em dinheiro'
], 0);

addS('Advertência', 'Caso não possa comparecer a um evento obrigatório, é necessário:', [
  'Registrar a ausência com justificativa dentro do prazo oficial',
  'Informar somente depois do evento',
  'Explicar apenas na próxima reunião',
  'Avisar qualquer membro por mensagem privada sem realizar registro'
], 0);

addS('Advertência', 'Falta sem presença e sem justificativa dentro do prazo gera:', [
  'ADV 1/3 e -5 pontos',
  'Advertência com desconto de pontuação',
  'Penalidade por ausência sem cobertura',
  'Punição padrão por falta injustificada'
], 0);

addS('Advertência', 'Ao atingir 3/3 de ADV, acontece:', [
  'Avaliação de permanência e possível redefinição',
  'Revisão da continuidade e da posição ocupada',
  'Reavaliação da permanência e da posição',
  'Análise final sobre permanência na equipe'
], 2);

// =========================
// HIERARQUIA / GI
// =========================
addS('Hierarquia', 'A gestaoinfluencer é:', [
  'Uma divisão interna da própria SantaCreators',
  'O núcleo interno da própria SantaCreators',
  'Um setor avançado da estrutura principal',
  'Uma extensão interna da equipe Creators'
], 1);

addS('Hierarquia', 'O acesso à gestaoinfluencer acontece por:', [
  'Reconhecimento interno e convite por evolução',
  'Convite baseado em evolução e confiança',
  'Convite após destaque consistente e confiança',
  'Entrada por mérito e observação da liderança'
], 1);

addS('Hierarquia', 'O nível 3 da estrutura oficial da SantaCreators é:', [
  'Creator',
  'Base operacional da equipe',
  'Faixa dos creators na estrutura',
  'Nível de entrada após liderança'
], 0);

addS('Hierarquia', 'No nível 2 ficam funções como:', [
  'Social Médias, Manager e Gestor',
  'Cargos intermediários como Social, Manager e Gestor',
  'As áreas técnicas e operacionais acima da base',
  'Funções de suporte e desenvolvimento da equipe'
], 0);

addS('Hierarquia', 'O nível 1 da SantaCreators é formado por:', [
  'Os cargos responsáveis da liderança',
  'A liderança principal da estrutura',
  'Os responsáveis máximos da equipe',
  'A camada mais alta de decisão'
], 0);

addS('Hierarquia', 'O caminho normal até a gestaoinfluencer é:', [
  'Participar, evoluir e ser convidado',
  'Crescer na equipe até ser observado',
  'Se destacar até receber oportunidade interna',
  'Evoluir de forma consistente até o convite'
], 0);

// =========================
// SOCIAL MÉDIAS
// =========================
addS('Social Médias', 'A principal função da Social Médias é:', [
  'Estruturar, organizar e manter a agenda de eventos',
  'Organizar e estruturar os eventos da SantaCreators',
  'Planejar o cronograma e a execução dos eventos',
  'Coordenar a parte operacional dos eventos da equipe'
], 1);

addS('Social Médias', 'Os eventos fixos da SantaCreators acontecem em quais dias?', [
  'De segunda-feira a domingo',
  'Somente de segunda a sábado',
  'Apenas de quinta a domingo',
  'Somente nos dias úteis'
], 0);

addS('Social Médias', 'Na operação fixa atual, qual opção descreve corretamente os horários dos eventos?', [
  'Todos os eventos acontecem somente às 22:00',
  'Há eventos às 21:00 e às 23:30 conforme o dia e a cidade',
  'Todos os eventos acontecem somente às 23:30',
  'Os horários são escolhidos sem cronograma'
], 1);

addS('Social Médias', 'O cronograma da semana deve ser organizado em qual dia?', [
  'Domingo',
  'No domingo anterior à semana',
  'Ao longo do domingo com fechamento final',
  'Domingo, antes do início da nova agenda'
], 0);

addS('Social Médias', 'Na montagem do cronograma, não pode repetir:', [
  'O mesmo evento na mesma cidade e mesmo dia da semana anterior',
  'A mesma combinação da semana anterior',
  'O mesmo formato repetido na mesma posição da agenda',
  'Evento igual no mesmo recorte da semana passada'
], 0);

addS('Social Médias', 'A divulgação do evento deve ser feita no dia do evento entre:', [
  '00:00 e 17:00',
  'Até 17:00 do dia do evento',
  'Dentro da janela da manhã e tarde do mesmo dia',
  'No próprio dia, antes do período da noite'
], 0);

addS('Social Médias', 'Após o evento, a equipe deve registrar presença no canal de:', [
  'Poderes em evento',
  'Registro de presença do evento',
  'Canal operacional de presença da equipe',
  'Canal de presença vinculado ao evento'
], 0);

addS('Social Médias', 'Na premiação, VIPs comerciais como Ouro e Platinum exigem autorização de:', [
  'Macedo ou diretoria da cidade',
  'Diretoria responsável pela cidade',
  'Macedo ou autoridade máxima da cidade',
  'Autorização superior da cidade junto ao Macedo'
], 0);

// =========================
// MANAGER
// =========================
addS('Manager', 'A missão da equipe Manager Creators é:', [
  'Garantir presença das organizações nos eventos',
  'Garantir organizações presentes nos eventos',
  'Atuar para levar organizações à agenda da equipe',
  'Fazer a ponte entre eventos e lideranças convidadas'
], 1);

addS('Manager', 'Os eventos com maior contingente para atuação dos Managers são:', [
  'Quinta, sexta e sábado',
  'A reta final da semana',
  'Os dias de maior movimento da agenda',
  'Quinta a sábado, principalmente'
], 0);

addS('Manager', 'O prazo para registrar organizações vai de:', [
  'Domingo 00:00 até quinta 16:00',
  'Do domingo até quinta às 16:00',
  'Do início da semana até quinta no fim da tarde',
  'De domingo até quinta-feira antes do evento'
], 0);

addS('Manager', 'Para convidar uma organização, o contato deve ser feito com:', [
  'Diretamente com um líder da organização',
  'Com liderança oficial da organização',
  'Com alguém que represente a liderança da facção',
  'Com o líder ou responsável oficial da organização'
], 0);

addS('Manager', 'Registrar organização sem falar com o líder é:', [
  'Errado',
  'Incorreto por fugir do procedimento',
  'Inválido sem contato with liderança',
  'Fora do padrão exigido para registro'
], 0);

addS('Manager', 'Como Manager, você é staff?', [
  'Não',
  'Não, apesar de representar a equipe',
  'Não, a função não equivale a staff',
  'Não, mesmo atuando em nome da equipe'
], 0);

addS('Manager', 'No RP, convidar organização dentro do NC é:', [
  'Proibido',
  'Incompatível com o RP da função',
  'Errado por fugir da imersão',
  'Vedado dentro do contexto de NC'
], 0);

addS('Manager', 'Cada organização registrada gera para o Manager:', [
  'Pontos no sistema',
  'Pontuação no sistema interno',
  'Registro convertido em pontuação',
  'Ponto contabilizado no sistema'
], 0);

// =========================
// GESTOR
// =========================
addS('Gestor', 'A principal missão do Gestor Creators é:', [
  'Formar e orientar quem está começando',
  'Acompanhar e desenvolver membros em início',
  'Conduzir a evolução de quem entra na equipe',
  'Dar base, direção e orientação aos novatos'
], 0);

addS('Gestor', 'Para ser Gestor Creators, a pessoa deve ter vindo de:', [
  'Social Médias ou Manager Creators',
  'Áreas-base de desenvolvimento da equipe',
  'Setores como Social ou Manager',
  'Funções anteriores ligadas à operação'
], 0);

addS('Gestor', 'O Gestor ensina principalmente quem está em fase:', [
  'Inicial da equipe',
  'De adaptação dentro da operação',
  'De entrada e aprendizado',
  'De começo na trajetória interna'
], 0);

addS('Gestor', 'Os feedbacks do Gestor devem ser:', [
  'Detalhados, com qualidades, erros e evolução',
  'Completos, claros e voltados ao desenvolvimento',
  'Objetivos, construtivos e bem explicados',
  'Profundos o bastante para orientar melhoria'
], 0);

addS('Gestor', 'Sempre que ensinar algo a alguém da equipe, o Gestor deve:', [
  'Registrar o ensinamento',
  'Documentar o que foi orientado',
  'Formalizar o alinhamento realizado',
  'Deixar registrado o conteúdo ensinado'
], 0);

addS('Gestor', 'Ao registrar alinhamento, deve ser informado:', [
  'O ID Discord da pessoa alinhada',
  'A identificação correta de quem recebeu o alinhamento',
  'O Discord ID do membro alinhado',
  'O ID do usuário que foi orientado'
], 0);

addS('Gestor', 'Ser Gestor substitui a função anterior da pessoa?', [
  'Não, ela continua na função de origem também',
  'Não, a função anterior segue junto',
  'Não, o Gestor soma à área de origem',
  'Não, ela mantém a base anterior acumulada'
], 0);

// =========================
// COORD
// =========================
addS('Coordenação', 'O Coord Creators é visto como:', [
  'Braço direito da liderança e quem faz tudo funcionar',
  'Pilar operacional da liderança no dia a dia',
  'Quem sustenta a execução e a organização da equipe',
  'Figura central para fazer a operação rodar'
], 0);

addS('Coordenação', 'O Coord precisa dominar quais áreas?', [
  'Social, Manager e Gestor',
  'As três áreas-base da operação',
  'Social, gestão de convites e desenvolvimento',
  'Os setores centrais de funcionamento da equipe'
], 0);

addS('Coordenação', 'Se faltar alguém em uma área da equipe, o Coord deve:', [
  'Assumir temporariamente para nada quebrar',
  'Cobrir a demanda até normalizar a operação',
  'Entrar na função necessária para manter a equipe rodando',
  'Segurar a ponta até a área se reorganizar'
], 0);

addS('Coordenação', 'Além de executar funções, o Coord também deve:', [
  'Coordenar e acompanhar as equipes',
  'Gerir, observar e acompanhar os setores',
  'Supervisionar o andamento das áreas da equipe',
  'Manter controle sobre execução e desempenho das equipes'
], 0);

addS('Coordenação', 'O próximo passo natural de evolução do Coord Creators é:', [
  'Resp Líder',
  'Subir para a camada de responsável',
  'Avançar para liderança responsável',
  'Migrar para a próxima faixa da hierarquia'
], 0);

// =========================
// RESPONSÁVEIS
// =========================
addS('Responsáveis', 'O Resp Líder deve acompanhar principalmente se:', [
  'A equipe está organizada e a coordenação está funcionando',
  'A estrutura está fluindo sem travas',
  'A coordenação sustenta bem a operação',
  'A liderança intermediária está executando corretamente'
], 0);

addS('Responsáveis', 'Se houver membro iniciante presente, o Resp Líder deve:', [
  'Dar suporte e garantir orientação adequada',
  'Ensinar e orientar na hora',
  'Acompanhar o iniciante de forma ativa',
  'Aproveitar a presença para desenvolver o membro'
], 1);

addS('Responsáveis', 'O Resp Influ possui autoridade para aplicar:', [
  'Banimento do painel e do Discord com regra e evidência',
  'Punições severas quando houver base e prova',
  'Sanções estruturais com respaldo da regra',
  'Medidas de alto impacto mediante evidência'
], 0);

addS('Responsáveis', 'O Resp Creators é:', [
  'Responsável máximo pela operação da equipe Creators',
  'A principal autoridade da operação Creators',
  'Quem responde pela estrutura geral da equipe',
  'O topo da gestão operacional da Creators'
], 0);

addS('Responsáveis', 'Entre as responsabilidades do Resp Creators está:', [
  'Aprovar premiações de eventos e supervisionar decisões importantes',
  'Validar decisões sensíveis e acompanhar premiações',
  'Supervisionar pontos críticos e autorizações relevantes',
  'Responder pelas decisões importantes e aprovações finais'
], 0);

addS('Responsáveis', 'Na hierarquia final da equipe, a ordem correta de subida é:', [
  'Social/Manager > Gestor > Coord > Resp Líder > Resp Influ > Resp Creators',
  'Social > Manager > Gestor > Coord > Resp Líder > Resp Influ > Resp Creators',
  'Social/Manager > Coord > Gestor > Resp Líder > Resp Influ > Resp Creators',
  'Manager/Social > Gestor > Coord > Resp Influ > Resp Líder > Resp Creators'
], 0);



// =========================
// CULTURA, ÉTICA E CONDUTA (ANTI-EGO / ANTI-FUXICO)
// =========================
addS('Cultura', 'Qual é o destino garantido na SantaCreators para quem deixa o ego subir?', [
  'Advertência verbal',
  'Conversa com a coordenação',
  'Banimento garantido',
  'Redução de cargo temporária'
], 2);

addS('Cultura', 'Sobre o "Fuxico" dentro da empresa, qual é a diretriz oficial?', [
  'É permitido se for sobre trabalho',
  'Não agrega nada e resulta em BAN',
  'Deve ser resolvido no privado',
  'É tolerado se não houver provas'
], 1);

addS('Cultura', 'O que acontece com quem entra na Creators pensando em tirar vantagem própria?', [
  'Recebe orientação técnica',
  'Não possui espaço na cultura da empresa',
  'É monitorado pela gestão influencer',
  'Ganha advertência nível 2'
], 1);

addS('Cultura', 'A "Cultura da Santa" é resumida em quais pilares principais?', [
  'Poder, hierarquia e controle',
  'Respeito, humildade e ser gente boa',
  'Quantidade de clips e engajamento',
  'Presença em call e metas batidas'
], 1);

addS('Cultura', 'Ao receber um membro novo, qual deve ser a primeira atitude do responsável?', [
  'Passar a lista de regras',
  'Motivá-lo e criar conexão',
  'Cobrar a setagem no painel',
  'Pedir para entrar em call'
], 1);

addS('Cultura', 'Sobre o uso de Inteligência Artificial nas entrevistas, a SantaCreators:', [
  'Recomenda para agilizar o processo',
  'Identifica e reprova o Ctrl+C/Ctrl+V',
  'Aceita se a resposta estiver correta',
  'Não possui regras sobre isso'
], 1);

addS('Cultura', 'Por que é fundamental denunciar qualquer sinal de abuso de poder?', [
  'Para ganhar pontos no sistema',
  'Para comprometer a liderança',
  'Porque compromete a integridade e a experiência de todos',
  'Para subir de cargo mais rápido'
], 2);

addS('Cultura', 'O que é esperado de um membro no feedback obrigatório de sábado?', [
  'Apenas ouvir a liderança',
  'Participar e ouvir orientações (mesmo novatos)',
  'Ficar mutado em call',
  'Apenas marcar presença no chat'
], 1);

// =========================
// GESTÃO INFLUENCER E HIERARQUIA AVANÇADA
// =========================
addS('Hierarquia', 'Para ter autonomia de comandos (GI 5), o Equipe Creator precisa:', [
  'Ter 1 mês de empresa',
  'Dominar contratações, conduta, baús, vestes e veículos',
  'Ser indicado por um membro comum',
  'Apenas saber usar o noclip'
], 1);

addS('Hierarquia', 'O cargo "Contratador" na cidade é destinado a quem:', [
  'Já é estagiário há muito tempo',
  'Aprendeu a contratar e recebeu o OK da liderança',
  'Possui qualquer cargo de coordenação',
  'Entrou agora na empresa'
], 1);

addS('Hierarquia', 'Um coordenador que está ensinando alguém a contratar precisa de:', [
  'Autorização do Owner',
  'Validação de outro Coordenador ou Responsável',
  'Print de todos os passos',
  'Um vídeo tutorial'
], 1);

addS('Hierarquia', 'Ao liberar o cargo de poderes, o que deve ser feito no canal de controle GI?', [
  'Pausar o controle',
  'Despausar o controle GI',
  'Mandar o ID do membro',
  'Apenas marcar o responsável'
], 1);

addS('Hierarquia', 'Sobre as áreas Social Medias e Manager Creators, o membro:', [
  'Deve atuar em ambas obrigatoriamente',
  'Pode escolher uma e nunca ter os dois cargos de área ao mesmo tempo',
  'Não pode trocar de área após escolher',
  'Não precisa de área se for GI 5'
], 1);

addS('Hierarquia', 'O cargo GI 4 (Coordenação Criativa) exige do membro:', [
  'Resultados constantes e envolvimento em entrevistas/eventos',
  'Apenas ser amigo da liderança',
  'Ter o maior número de pontos do mês',
  'Saber usar o wall perfeitamente'
], 0);

addS('Hierarquia', 'Qual cargo é removido ao subir para GI 4 (Coordenação)?', [
  'Creator Base',
  'Equipe Creator na cidade (GI 5)',
  'Todos os cargos do Discord',
  'Apenas o cargo de área'
], 1);

addS('Hierarquia', 'O GI 3 (Responsável de Liderança) tem como foco principal:', [
  'Executar os eventos sozinho',
  'Cobrança, auxílio à coordenação e aprovação de promoções',
  'Apenas fiscalizar o noclip',
  'Criar artes para o Instagram'
], 1);

addS('Hierarquia', 'Para crescer além de Responsável Líder, o membro deve:', [
  'Focar apenas em uma única frente',
  'Dominar sua área e atuar em ambas as frentes (Social e Manager)',
  'Pedir o cargo ao Resp Creators',
  'Ser o que mais usa poderes em RP'
], 1);

addS('Hierarquia', 'Qual é a principal responsabilidade do Responsável Influ (GI 3)?', [
  'Aprovar apenas o cronograma',
  'Ser referência prática, ensinar e cobrar com equilíbrio',
  'Ficar apenas em call de diretoria',
  'Setar skins aleatórias'
], 1);

// =========================
// PODERES: NC, TPWAY, TPTO E TPTOME
// =========================
addS('Poderes', 'O uso indevido de poderes na SantaCreators resulta em:', [
  'Advertência leve',
  'Remoção imediata dos poderes',
  'Perda de 10 pontos',
  'Conversa em call'
], 1);

addS('Poderes', 'O NC (No-Clip) é permitido individualmente apenas para:', [
  'Locomoção rápida pelo mapa',
  'Casos urgentes a favor da empresa (recrutamento/alinhamento)',
  'Ver o que os outros players estão fazendo',
  'Fugir de abordagem policial'
], 1);

addS('Poderes', 'Qual é a regra de ouro ao sair do NC (No-Clip)?', [
  'Sair em qualquer lugar',
  'NUNCA aparecer na frente de outros players',
  'Sair voando para impressionar',
  'Sair perto da garagem'
], 1);

addS('Poderes', 'O uso de NC e TPWAY como meio de transporte comum é considerado:', [
  'Agilidade operacional',
  'Abuso de poder',
  'Procedimento padrão',
  'Uso estratégico'
], 1);

addS('Poderes', 'NC e TPWAY estão liberados livremente em qual condição?', [
  'Durante a madrugada',
  'Em mundos que não sejam o padrão (sozinho)',
  'Perto de amigos',
  'Dentro da sede'
], 1);

addS('Poderes', 'O TPWAY pode ser usado para:', [
  'Visitar amigos fora da empresa',
  'Apoio rápido a ações da empresa e deslocamento para eventos/resenhas',
  'Chegar mais rápido na praça',
  'Ir até a mecânica'
], 1);

addS('Poderes', 'O comando TPTOME deve ser usado exclusivamente para:', [
  'Puxar qualquer player aleatório',
  'Puxar membros da empresa (com autorização ou consciência)',
  'Puxar administradores da cidade',
  'Trazer veículos'
], 1);

addS('Poderes', 'Como deve ser a comunicação imersiva ao usar TPTOME?', [
  'Falar que usou comando',
  'Dizer que a pessoa "pegou um Uber" até você',
  'Não falar nada',
  'Dizer que ela teletransportou'
], 1);

addS('Poderes', 'Sobre o TPTO para ir até um membro em RP, qual o procedimento?', [
  'Dar TPTO direto na frente dele',
  'Usar o ZipZap e ir até ele usando veículo RP',
  'Usar noclip para chegar por cima',
  'Dar TPTO e sair do NC correndo'
], 1);

addS('Poderes', 'Entrar em uma cena de RP usando TPTO é considerado:', [
  'Boa prática',
  'Abuso de poder grave',
  'Agilidade necessária',
  'Suporte operacional'
], 1);

addS('Poderes', 'Comandos avançados como "dvarea", "godarea" e "wall" são de nível:', [
  'GI 5 (Creator)',
  'GI 4 (Coordenador)',
  'GI 3 (Responsável)',
  'Membro comum'
], 2);

addS('Poderes', 'É permitido usar poderes em amigos ou aliados de fora da empresa?', [
  'Sim, se for para gravação',
  'Não, os poderes são apenas para si ou membros oficiais',
  'Apenas com autorização verbal',
  'Sim, se for para ajudar no conteúdo'
], 1);

// =========================
// REGRAS DE SKIN E IDENTIDADE
// =========================
addS('Imersão', 'Quem pode autorizar o uso de skin para RP na SantaCreators?', [
  'Qualquer coordenador',
  'Apenas GI 3+ (Responsável)',
  'O próprio membro se tiver poder',
  'Um estagiário'
], 1);

addS('Imersão', 'Onde o uso de skin é EXTREMAMENTE proibido?', [
  'Hospital',
  'Praça',
  'Mecânica',
  'Píer'
], 1);

addS('Imersão', 'Ao usar uma skin de animal, a regra de fala é:', [
  'Falar normalmente',
  'Não fala (segue o RP do animal)',
  'Falar apenas no rádio',
  'Usar sintetizador de voz'
], 1);

addS('Imersão', 'Ao usar uma skin de personagem, o membro deve:', [
  'Manter seu nome original',
  'Mudar o nome para o do personagem e viver o personagem',
  'Não precisa mudar nada',
  'Usar o nome da empresa'
], 1);

addS('Imersão', 'Para o uso de skin em GRUPO, o requisito mínimo é:', [
  'No mínimo 2 membros',
  'No mínimo 4 membros participando e RP planejado',
  'Apenas ter autorização por texto',
  'Estar no mesmo veículo'
], 1);

addS('Imersão', 'O uso indevido de skin ou falta de troca de nome resulta em:', [
  'Apenas um aviso',
  'Advertência e rebaixamento imediato',
  'Perda de 5 pontos',
  'Nada, se for a primeira vez'
], 1);

addS('Imersão', 'Em quais locais (com autorização) é permitido circular com skin?', [
  'Somente na sede',
  'Hospital, Mecânica e Píer (Praça nunca)',
  'Qualquer lugar da cidade',
  'Somente em áreas de favela'
], 1);

addS('Imersão', 'Qual é a regra sobre setar skin em membros que não possuem poder?', [
  'É proibido, exceto com autorização específica',
  'É liberado para qualquer GI 5',
  'Pode fazer se for seu amigo',
  'É permitido apenas em eventos'
], 0);

// =========================
// SPAWN DE VEÍCULOS E MUNDO PADRÃO
// =========================
addS('Veículos', 'Spawnar veículos no mundo padrão é considerado:', [
  'Procedimento normal',
  'Abuso de poder e gera punição',
  'Agilidade para a empresa',
  'Permitido para coordenadores'
], 1);

addS('Veículos', 'Ao precisar de um veículo via spawn (em outro mundo), a preferência é:', [
  'Veículos VIP de outros players',
  'Veículos comerciais rápidos',
  'Seus próprios, da garagem pública ou da empresa',
  'Veículos de staff'
], 2);

addS('Veículos', 'É permitido spawnar veículos comerciais ou VIPs de terceiros?', [
  'Sim, se for para teste',
  'Não (Regra: NÃO spawnar)',
  'Apenas com autorização de GI 3',
  'Sim, se for em outro mundo'
], 1);

addS('Veículos', 'Em que situação extrema o spawn pode ser usado em RP?', [
  'Quando estiver com preguiça de andar',
  'somente em eventos/gravações externas da SantaCreators',
  'Para fazer racha na rodovia',
  'Para fugir de perseguição'
], 1);

addS('Veículos', 'A SantaCreators prioriza qual tipo de deslocamento?', [
  'Teleporte e Spawn',
  'Narrativa, imersão e uso de garagens',
  'Noclip por cima dos prédios',
  'Puxar todos os membros com TPTOME'
], 1);

addS('Veículos', 'Spawnar um carro na frente de outros players no mundo padrão é:', [
  'Uma demonstração de poder',
  'Uma falha grave de conduta e abuso',
  'Permitido se você estiver com pressa',
  'Um erro técnico aceitável'
], 1);

addS('Veículos', 'O comando /dv (deletar veículo) deve ser usado:', [
  'Em qualquer carro na rua',
  'Para limpar carros em área ',
  'Para administrar veiculos da cidade',
  'Para sumir com carros de polícia'
], 1);
// =========================

// =========================
// NOVAS PERGUNTAS — BANCO EXTRA (MÉDIA)
// =========================

// CONDUTA / BASE GERAL
addS('Conduta', 'A SantaCreators se define principalmente como:', [
  'Uma empresa organizada de RP',
  'Um grupo livre sem cobrança',
  'Uma guilda casual para eventos',
  'Uma equipe focada apenas em painel'
], 0);

addS('Conduta', 'Além da criação de conteúdo, a SantaCreators valoriza muito:', [
  'Somente número e resultado',
  'Imersão, responsabilidade e crescimento',
  'Apenas presença em call',
  'Exclusivamente eventos semanais'
], 1);

addS('Conduta', 'As perguntas da entrevista servem para mostrar principalmente:', [
  'Se a pessoa decora respostas rápido',
  'Se a pessoa sabe copiar regras',
  'Se a pessoa tem postura e entende o peso da empresa',
  'Se a pessoa conhece todos os canais do Discord'
], 2);

addS('Conduta', 'Na SantaCreators, problemas internos devem ser resolvidos:', [
  'Por DM para ser mais rápido',
  'Nos canais corretos com organização',
  'Somente em call com qualquer pessoa',
  'Em conversa privada fora do Discord'
], 1);

addS('Conduta', 'Ter um canal privado com seu nome significa que:', [
  'Você pode ignorar a liderança',
  'É um espaço seguro para resolver dúvidas e pendências',
  'Serve apenas para receber punições',
  'É um canal decorativo da empresa'
], 1);

addS('Conduta', 'A participação de menores de 15 anos na SantaCreators é:', [
  'Permitida com autorização',
  'Permitida só no painel',
  'Proibida',
  'Aceita apenas em teste'
], 2);

addS('Conduta', 'Se houver vínculo familiar com alguém da equipe, o correto é:', [
  'Esconder para evitar confusão',
  'Avisar imediatamente a liderança responsável',
  'Falar apenas se alguém descobrir',
  'Continuar normalmente sem comentar'
], 1);

addS('Conduta', 'Se você decidir sair da SantaCreators, o procedimento correto é:', [
  'Remover o set sozinho',
  'Pedir saída direto pelo Discord',
  'Pedir demissão em game para a equipe remover corretamente',
  'Sair sem avisar para evitar demora'
], 2);

addS('Conduta', 'A frase “isso aqui não é só mais uma empresa de RP” quer dizer que a SantaCreators:', [
  'Tem menos regras que as outras',
  'Exige postura, consciência e responsabilidade',
  'Aceita qualquer tipo de conduta',
  'Funciona só na base da amizade'
], 1);

addS('Conduta', 'Ofensas preconceituosas disfarçadas de brincadeira são tratadas como:', [
  'Algo tolerável se for sem intenção',
  'Brincadeiras normais entre membros',
  'Conduta grave que não é tolerada',
  'Advertência leve apenas'
], 2);

// IMERSÃO / RP
addS('Imersão', 'Se seu Discord cair no meio do RP, o ideal é:', [
  'Falar no RP que o Discord caiu',
  'Usar uma justificativa imersiva',
  'Ignorar e voltar do nada',
  'Pedir para todos aguardarem fora do RP'
], 1);

addS('Imersão', 'Se você vir alguém bugado ou flutuando, a melhor conduta é:', [
  'Quebrar a cena e rir da situação',
  'Comentar no off na hora',
  'Improvisar algo criativo dentro da imersão',
  'Sair do local imediatamente'
], 2);

addS('Imersão', 'Deslogar na frente de outros players sem contexto é:', [
  'Aceitável se for rápido',
  'Uma quebra de imersão a ser evitada',
  'Normal dentro da cidade',
  'Permitido em qualquer situação'
], 1);

addS('Imersão', 'Trocar de roupa do nada na frente de outros players deve ser:', [
  'Feito normalmente se ninguém reclamar',
  'Evitado, buscando local discreto ou fechado',
  'Aceito somente perto da sede',
  'Usado como piada no RP'
], 1);

addS('Imersão', 'Qual expressão abaixo é mais imersiva?', [
  'Meu microfone parou',
  'Meu Discord bugou',
  'Minha garganta tá ruim',
  'Tô sem áudio no PC'
], 2);

addS('Imersão', 'A expressão “tô com os olhos abertos” substitui melhor:', [
  'Tô em live',
  'Tô sem áudio',
  'Tô lagado',
  'Tô sem teclado'
], 0);

addS('Imersão', 'Usar comandos do F8 para flutuar ou sentar no ar sem contexto é:', [
  'Uma forma criativa de RP',
  'Uma quebra desnecessária da realidade',
  'Permitido em qualquer ocasião',
  'Algo obrigatório em eventos'
], 1);

addS('Imersão', 'Quando algo técnico acontece, o ideal é:', [
  'Trazer o off direto para a cidade',
  'Improvisar e sustentar a narrativa',
  'Parar toda a cena para explicar',
  'Mandar todos aguardarem no Discord'
], 1);

// PRÉDIO / UNIFORME / GARAGENS
addS('Uniforme', 'Dentro do prédio da SantaCreators, é obrigatório usar:', [
  'Qualquer roupa escura',
  'Apenas um boné da empresa',
  'A jaqueta da SantaCreators',
  'Somente roupa social'
], 2);

addS('Uniforme', 'Se entrar no prédio sem a jaqueta, o correto é:', [
  'Continuar assim até alguém avisar',
  'Ir imediatamente a uma sala sozinho e vestir a jaqueta',
  'Sair correndo do prédio',
  'Mandar mensagem para a liderança'
], 1);

addS('Uniforme', 'Nas proximidades do prédio, o membro deve usar:', [
  'Ao menos uma peça da SantaCreators',
  'Somente a jaqueta oficial',
  'Uniforme completo sempre',
  'Apenas calça da empresa'
], 0);

addS('Uniforme', 'Para usar qualquer garagem da empresa, é necessário:', [
  'Ter cargo alto apenas',
  'Estar com uma peça do uniforme da SantaCreators',
  'Estar em call with a equipe',
  'Ter registro no painel no mesmo dia'
], 1);

addS('Uniforme', 'Em ações ilegais fora da sede, o uniforme deve ser:', [
  'Mantido para mostrar autoridade',
  'Usado só se estiver com aliados',
  'Retirado antes de sair para proteger a imagem da empresa',
  'Usado apenas à noite'
], 2);

addS('Uniforme', 'Nunca se deve trocar de roupa na frente de outros players porque isso:', [
  'Pode atrasar a ação',
  'Prejudica a coerência do RP',
  'Tira ponto do painel',
  'Impede uso da garagem'
], 1);

// VEÍCULOS
addS('Veículos', 'Usar veículos da SantaCreators em troca de tiro é:', [
  'Permitido com líder presente',
  'Proibido',
  'Aceitável só no norte',
  'Permitido se for rápido'
], 1);

addS('Veículos', 'Usar veículos da empresa em assalto de pista é:', [
  'Autorizado com organização',
  'Proibido',
  'Aceito fora do horário de evento',
  'Permitido sem uniforme'
], 1);

addS('Veículos', 'Sequestro com veículo da empresa só pode acontecer quando:', [
  'For um RP organizado, coerente e dentro do horário permitido',
  'Qualquer membro quiser usar',
  'Não houver veículos próprios',
  'For decidido no calor do momento'
], 0);

addS('Veículos', 'Se vir alguém usando veículo da empresa de forma errada, o correto é:', [
  'Se envolver na confusão',
  'Ignorar porque não é problema seu',
  'Gravar, reportar e não se envolver',
  'Tomar o veículo da pessoa'
], 2);

// BAÚS
addS('Baús', 'O baú pessoal é de uso:', [
  'Livre e exclusivo do membro',
  'Coletivo da equipe toda',
  'Apenas da coordenação',
  'Somente para eventos'
], 0);

addS('Baús', 'No baú geral, a regra principal é:', [
  'Pegar o máximo possível',
  'Usar com responsabilidade e apenas o necessário',
  'Retirar só com autorização da RESP',
  'Pegar apenas para vender'
], 1);

addS('Baús', 'No baú geral, vender, trocar ou distribuir itens livremente é:', [
  'Permitido entre aliados',
  'Aceito se repor depois',
  'Proibido',
  'Autorizado em evento'
], 2);

addS('Baús', 'Uma das limitações do baú geral é:', [
  '1 arma/item e 100 munições',
  '3 armas e munição livre',
  '2 armas e 300 munições',
  'Somente kits reparo'
], 0);

addS('Baús', 'O baú creators serve para:', [
  'Consumo dos membros',
  'Doações e entregas',
  'Uso exclusivo da coordenação',
  'Separar itens de eventos pessoais'
], 1);

addS('Baús', 'Retirar itens do baú creators é:', [
  'Permitido com aviso prévio',
  'Permitido para quem doou',
  'Proibido',
  'Liberado aos fins de semana'
], 2);

addS('Baús', 'No baú de vendas, a divisão correta é:', [
  '70% para você e 30% para o painel',
  '50% para você e 50% para o painel',
  '40% para você e 60% para o painel',
  '100% para o painel'
], 1);

addS('Baús', 'Se alguém pegar no baú de vendas e não dividir corretamente, a punição prevista é:', [
  'Advertência simples',
  'Perda temporária do baú',
  'Ban imediato',
  'Apenas devolução dos itens'
], 2);

addS('Baús', 'O baú coordenação é destinado para:', [
  'Organização interna de metas e entregas',
  'Uso livre de todos os membros',
  'Troca de itens entre equipes',
  'Guardar prêmios pessoais'
], 0);

addS('Baús', 'O baú responsável possui acesso:', [
  'Liberado para Coord+',
  'Restrito à RESP',
  'Disponível para Gestores',
  'Aberto a qualquer liderança'
], 1);

// PODERES / ADMINISTRAÇÃO
addS('Poderes', 'Os poderes da SantaCreators existem para:', [
  'Dar vantagem no RP',
  'Facilitar ações pessoais',
  'Fins administrativos e empresariais',
  'Ajudar amigos na cidade'
], 2);

addS('Poderes', 'A regra de ouro sobre poderes é:', [
  'Se um player comum não pode, você também não pode',
  'Você pode usar se ninguém ver',
  'Poder sempre vale acima do RP',
  'Responsável pode tudo'
], 0);

addS('Poderes', 'Usar F8 para ir até um amigo do outro lado da cidade é:', [
  'Ajuda operacional normal',
  'Abuso de poder',
  'Permitido em horários vazios',
  'Aceitável se não houver carro'
], 1);

addS('Poderes', 'Usar noclip sem necessidade para se locomover é:', [
  'Uma forma rápida de ajudar',
  'Aceitável fora de evento',
  'Abuso de poder',
  'Obrigatório para gestão'
], 2);

addS('Poderes', 'Se morrer em uma ação de RP, o correto é:', [
  'Usar /god para voltar',
  'Chamar médico ou ir para os bombeiros',
  'Levantar e seguir a ação',
  'Pedir para alguém usar poder'
], 1);

addS('Poderes', 'Se alguém cometer anti-rp contra você, o primeiro passo é:', [
  'Resolver na hora com comando',
  'Clipar tudo e pegar os passaportes',
  'Usar wall para acompanhar',
  'Punir a pessoa imediatamente'
], 1);

addS('Poderes', 'Sem alinhamento e sem autorização, comandos da gestão devem ser:', [
  'Usados com cautela',
  'Testados antes',
  'Não utilizados',
  'Aplicados só em amigos'
], 2);

addS('Poderes', 'Na dúvida sobre usar um poder, a melhor atitude é:', [
  'Usar e explicar depois',
  'Perguntar antes',
  'Deixar outro resolver sem avisar',
  'Testar em local vazio'
], 1);

addS('Poderes', 'Usar fix em benefício próprio ou de amigos, fora do contexto correto, é:', [
  'Permitido para Coord+',
  'Aceitável se não houver combate',
  'Proibido',
  'Permitido se for rápido'
], 2);

addS('Poderes', 'No treinamento de MKT Ticket, a regra de ouro dos botões é:', [
  'Clicar para aprender na prática',
  'Se não entende 100%, não clique',
  'Testar em qualquer canal',
  'Usar primeiro e perguntar depois'
], 1);

// CALL / ORGANIZAÇÃO / REGISTROS
addS('Organização', 'Ficar em call enquanto está na cidade é:', [
  'Obrigatório para todos',
  'Não obrigatório, mas recomendado para evolução',
  'Proibido em horários de evento',
  'Permitido só para liderança'
], 1);

addS('Organização', 'Responsáveis devem ficar em call porque:', [
  'É parte da obrigação deles ajudar e orientar',
  'Ganham mais pontos assim',
  'Sem call o bot não funciona',
  'É exigência só em domingo'
], 0);

addS('Organização', 'Os alinhamentos da SantaCreators devem ser feitos:', [
  'Por texto no Discord',
  'Por DM com qualquer membro',
  'Em call com o responsável',
  'Por e-mail interno'
], 2);

addS('Organização', 'Sempre que usar poderes, você deve:', [
  'Registrar no final do dia no canal correto',
  'Registrar apenas se alguém pedir',
  'Mandar por DM para a coordenação',
  'Anotar só se usar mais de uma vez'
], 0);

addS('Organização', 'O bate ponto funciona nos horários:', [
  '18:00 às 22:00 e 00:00 às 03:00',
  '17:00 às 23:00 e 01:00 às 04:00',
  '16:00 às 23:00 e 00:00 às 05:00',
  'Somente 19:00 às 23:00'
], 1);

addS('Organização', 'Hoje, um dos itens que gera pontos no sistema é:', [
  'Registro de poderes utilizados',
  'Estar online no Discord',
  'Mandar mensagem em call',
  'Usar uniforme na sede'
], 0);

addS('Organização', 'A frase “se não foi registrado, não aconteceu” reforça que:', [
  'O importante é só executar',
  'Registro é opcional se a liderança viu',
  'Tudo precisa ser documentado corretamente',
  'Basta avisar verbalmente depois'
], 2);

// ADVERTÊNCIA / PRESENÇA
addS('Advertência', 'Estar perto da sede sem nenhuma peça da empresa pode gerar:', [
  'Somente orientação verbal',
  'Advertência',
  'Nada, se estiver parado',
  'Aviso informal sem registro'
], 1);

addS('Advertência', 'Qual dessas frases representa quebra de imersão?', [
  'Vou meditar um cado',
  'Preciso mentalizar um portão abrindo',
  'Minha mãe tá me chamando',
  'Tive uma tontura forte'
], 2);

addS('Advertência', 'Flutuar sentado usando comando de F8 sem contexto é exemplo de:', [
  'Criatividade no RP',
  'Anti-RP',
  'Registro incorreto',
  'Conduta leve'
], 1);

addS('Advertência', 'Má conduta pode envolver:', [
  'Falta de respeito, deboche e rispidez',
  'Somente ausência em eventos',
  'Apenas erro de registro',
  'Só quebra de uniforme'
], 0);

addS('Advertência', 'Para Coord.+, Resp. Líder e Resp. Influ, os eventos obrigatórios da operação são:', [
  'Facultativos em qualquer situação',
  'Obrigatórios, salvo ausência justificada no fluxo correto',
  'Opcionais com aviso somente depois',
  'Necessários apenas na sexta-feira'
], 1);

addS('Advertência', 'Se não puder comparecer a um evento obrigatório, o correto é:', [
  'Avisar apenas depois do evento',
  'Registrar a ausência com justificativa dentro do prazo oficial',
  'Explicar somente na próxima call',
  'Mandar DM para qualquer membro e não registrar'
], 1);

addS('Advertência', 'Falta sem presença e sem justificativa dentro do prazo gera:', [
  'ADV 1/3 e -5 pontos',
  'Somente advertência verbal',
  'Apenas perda de cargo',
  'Bloqueio de uniforme'
], 0);

addS('Advertência', 'Ao atingir 3/3 de ADV, ocorre:', [
  'Reset automático das advertências',
  'Suspensão de 24 horas apenas',
  'Reavaliação da permanência e da posição na equipe',
  'Troca imediata para Creator base'
], 2);

// HIERARQUIA / GI
addS('Hierarquia', 'A gestaoinfluencer é:', [
  'Um grupo separado da SantaCreators',
  'O núcleo interno da própria SantaCreators',
  'Uma equipe temporária externa',
  'Um sistema usado só em eventos'
], 1);

addS('Hierarquia', 'O acesso à gestaoinfluencer acontece:', [
  'Por formulário público',
  'Por pedido direto ao Owner',
  'Por convite baseado em evolução e confiança',
  'Por sorteio interno'
], 2);

addS('Hierarquia', 'No painel oficial da SantaCreators, o Nível 3 corresponde a:', [
  'Responsáveis',
  'Creator',
  'Gestão da equipe',
  'Coordenação'
], 1);

addS('Hierarquia', 'No Nível 2 ficam funções como:', [
  'Resp Influ e Resp Creators',
  'Equipe Creator e Junior',
  'Social Médias, Manager e Gestor',
  'Somente Coordenação'
], 2);

addS('Hierarquia', 'O Nível 1 da estrutura é formado por:', [
  'Os cargos responsáveis da liderança',
  'A base da operação',
  'Os iniciantes da equipe',
  'A equipe de eventos'
], 0);

addS('Hierarquia', 'O caminho normal até a gestaoinfluencer é:', [
  'Entrar e pedir cargo',
  'Ser conhecido fora da empresa',
  'Participar, evoluir e ser convidado',
  'Ter amizade com alguém da liderança'
], 2);

// SOCIAL MÉDIAS
addS('Social Médias', 'A função principal da Social Médias é:', [
  'Registrar líderes de org',
  'Organizar e estruturar os eventos da SantaCreators',
  'Aplicar punições internas',
  'Cuidar do baú geral'
], 1);

addS('Social Médias', 'Os eventos fixos da SantaCreators acontecem:', [
  'De segunda a sábado',
  'Somente de terça a sexta',
  'Todos os dias da semana',
  'Apenas no fim de semana'
], 2);

addS('Social Médias', 'Qual é o principal horário fixo dos eventos da SantaCreators?', [
  '18:00',
  '20:00',
  '23:00',
  '21:00'
], 3);

addS('Social Médias', 'O cronograma da semana deve ser organizado em:', [
  'Segunda',
  'Domingo',
  'Quarta',
  'Sábado após o evento'
], 1);

addS('Social Médias', 'Na organização do cronograma, não pode repetir:', [
  'O mesmo evento na mesma cidade e no mesmo dia da semana anterior',
  'Nenhum evento já usado no mês',
  'Qualquer evento da mesma categoria',
  'Eventos em cidades diferentes'
], 0);

addS('Social Médias', 'A divulgação do evento deve ser feita:', [
  'Somente depois das 17:00',
  'Entre 00:00 e 17:00 do dia do evento',
  'Na semana anterior',
  'Apenas durante o evento'
], 1);

addS('Social Médias', 'Após o evento, a equipe deve registrar presença no canal de:', [
  'Cronograma',
  'Hall da fama',
  'Poderes em evento',
  'Convites líderes'
], 2);

addS('Social Médias', 'VIPs comerciais como Ouro e Platinum exigem autorização de:', [
  'Qualquer Gestor',
  'Macedo ou diretoria da cidade',
  'Somente Social Médias',
  'Apenas o vencedor do evento'
], 1);

// MANAGER
addS('Manager', 'A missão da equipe Manager Creators é:', [
  'Cuidar do ranking geral',
  'Garantir organizações presentes nos eventos',
  'Criar roupas de eventos',
  'Aprovar pagamentos de premiação'
], 1);

addS('Manager', 'Os eventos com maior contingente para atuação dos Managers costumam ser:', [
  'Quinta, sexta e sábado',
  'Segunda e terça',
  'Somente domingo',
  'Quarta e quinta apenas'
], 0);

addS('Manager', 'O prazo para registrar organizações vai de:', [
  'Segunda até sexta 18:00',
  'Domingo 00:00 até quinta 16:00',
  'Terça 00:00 até sábado 12:00',
  'Somente no dia do evento'
], 1);

addS('Manager', 'Para convidar uma organização, o contato deve ser feito com:', [
  'Qualquer membro da facção',
  'O líder ou representante oficial',
  'Somente com membros em call',
  'O primeiro que responder no Discord'
], 1);

addS('Manager', 'Registrar organização sem falar diretamente com o líder é:', [
  'Errado',
  'Aceitável se os membros confirmarem',
  'Permitido em evento grande',
  'Normal na ausência do líder'
], 0);

addS('Manager', 'Como Manager, você é staff?', [
  'Sim, sempre',
  'Não',
  'Apenas durante eventos',
  'Somente no Discord'
], 1);

addS('Manager', 'Convidar organização dentro do NC é:', [
  'Correto para agilizar',
  'Proibido',
  'Permitido se estiver sozinho',
  'Aceitável na garagem'
], 1);

addS('Manager', 'Cada organização registrada gera para o Manager:', [
  'Convite automático',
  'Apenas reconhecimento verbal',
  'Pontos no sistema',
  'Permissão temporária'
], 2);

// GESTOR
addS('Gestor', 'A principal missão do Gestor Creators é:', [
  'Aplicar punições',
  'Formar e orientar quem está começando',
  'Montar o cronograma semanal',
  'Controlar os baús'
], 1);

addS('Gestor', 'Para ser Gestor Creators, a pessoa deve ter vindo de:', [
  'Social Médias ou Manager Creators',
  'Resp Influ ou Resp Creators',
  'Equipe Creator apenas',
  'Qualquer área externa'
], 0);

addS('Gestor', 'O Gestor ensina principalmente membros que estão em fase:', [
  'Final da hierarquia',
  'Inicial da equipe',
  'Exclusiva de eventos',
  'De liderança máxima'
], 1);

addS('Gestor', 'Um feedback correto do Gestor deve ser:', [
  'Curto e genérico',
  'Detalhado, com qualidades, erros e evolução',
  'Apenas positivo',
  'Feito só por emoji'
], 1);

addS('Gestor', 'Sempre que ensinar algo a alguém da equipe, o Gestor deve:', [
  'Registrar o ensinamento',
  'Guardar para comentar no sábado',
  'Avisar apenas em call',
  'Esperar o membro pedir'
], 0);

addS('Gestor', 'Ao registrar alinhamento, deve ser informado:', [
  'O nome do Gestor apenas',
  'O ID Discord da pessoa alinhada',
  'O nome da cidade',
  'O horário da call somente'
], 1);

addS('Gestor', 'Ser Gestor substitui a função anterior da pessoa?', [
  'Sim, a antiga é removida',
  'Não, ela continua com a função de origem também',
  'Sim, mas só por um tempo',
  'Não, porém perde pontuação'
], 1);

// COORDENAÇÃO
addS('Coordenação', 'O Coord Creators é visto como:', [
  'Apoio secundário sem autonomia',
  'Braço direito da liderança e quem faz tudo funcionar',
  'Alguém focado só em eventos',
  'Um cargo exclusivo de registro'
], 1);

addS('Coordenação', 'O Coord precisa dominar:', [
  'Somente Social Médias',
  'Somente Manager',
  'Social, Manager e Gestor',
  'Apenas a parte financeira'
], 2);

addS('Coordenação', 'Se faltar alguém em uma área da equipe, o Coord deve:', [
  'Esperar a liderança resolver',
  'Assumir temporariamente para nada quebrar',
  'Cancelar a função do dia',
  'Ignorar se não for sua área favorita'
], 1);

addS('Coordenação', 'Além de executar funções, o Coord também deve:', [
  'Coordenar e acompanhar as equipes',
  'Focar só na própria pontuação',
  'Atuar apenas em call',
  'Registrar apenas presença'
], 0);

addS('Coordenação', 'O próximo passo natural de evolução do Coord Creators é:', [
  'Gestor',
  'Manager',
  'Resp Líder',
  'Equipe Creator'
], 2);

// RESPONSÁVEIS
addS('Responsáveis', 'O Resp Líder deve acompanhar principalmente se:', [
  'A coordenação e a equipe estão funcionando corretamente',
  'Só o hall da fama foi postado',
  'Apenas a própria call está cheia',
  'Somente o bate ponto da equipe'
], 0);

addS('Responsáveis', 'Se houver membro iniciante presente, o Resp Líder deve:', [
  'Fazer tudo sozinho para ganhar tempo',
  'Ensinar e orientar na hora',
  'Mandar o membro observar apenas',
  'Pedir para o iniciante sair da função'
], 1);

addS('Responsáveis', 'O Resp Influ possui autoridade para aplicar:', [
  'Somente alinhamentos',
  'Banimento do painel e do Discord com regra e evidência',
  'Apenas mudanças no uniforme',
  'Somente aprovação de cronograma'
], 1);

addS('Responsáveis', 'O Resp Creators é:', [
  'Um apoio temporário da equipe',
  'O responsável máximo pela operação da equipe Creators',
  'Um cargo exclusivo de eventos',
  'A base da gestão interna'
], 1);

addS('Responsáveis', 'Entre as responsabilidades do Resp Creators está:', [
  'Supervisionar decisões importantes e aprovar premiações',
  'Cuidar apenas do baú responsável',
  'Registrar orgs no lugar do Manager',
  'Fazer somente alinhamentos'
], 0);

// =========================
// NOVAS QUESTÕES — REGRAS E COMANDOS (RP AVALIAÇÃO)
// =========================

// --- IDENTIFICAÇÃO E SEDE ---
addS('Conduta', 'Estar nas proximidades da sede sem nenhuma peça da empresa gera:', ['Apenas um aviso verbal', 'Advertência', 'Nada, se estiver a pé', 'Perda de pontos apenas'], 1);
addS('Conduta', 'Onde o uso de uniforme/identificação é obrigatório?', ['Apenas dentro das salas', 'Na sede e áreas próximas', 'Somente em eventos', 'Apenas quando estiver em live'], 1);
addS('Conduta', 'Se você estiver parado na garagem da sede, você precisa estar:', ['Sem roupa para não sujar', 'Identificado visualmente como membro', 'Com qualquer roupa de civil', 'Invisível para não atrapalhar'], 1);
addS('Conduta', 'A regra de identificação na sede vale para quem está:', ['Apenas em veículos da empresa', 'A pé, parado ou usando a garagem', 'Somente em reuniões', 'Apenas os novatos'], 1);

// --- QUEBRA DE IMERSÃO E SUBSTITUIÇÕES ---
addS('Imersão', 'Trazer assuntos do "mundo real" para dentro do RP é chamado de:', ['Meta-RP', 'Quebra de imersão', 'Power-gaming', 'RP Avançado'], 1);
addS('Imersão', 'Qual a forma correta de avisar que vai ao banheiro no RP?', ['"Peraí que vou no banheiro"', '"Vou ali rapidinho"', '"Vou meditar um cado"', '"Vou deslogar um pouco"'], 2);
addS('Imersão', 'Para "mentalizar um portão abrindo do além", você está se referindo a:', ['Abrir o Discord', 'Abrir um chamado', 'Usar o F8', 'Abrir o mapa'], 0);
addS('Imersão', 'Substituição imersiva para "Meu Discord caiu":', ['Minha cabeça doeu', 'Meu e-mail bugou', 'Fui para Nárnia', 'Dormi no meio da rua'], 1);
addS('Imersão', 'Substituição imersiva para "Tô sem microfone":', ['Tô mutado no PC', 'Minha garganta tá ruim / sumiu', 'O microfone quebrou', 'Tô sem voz no Windows'], 1);
addS('Imersão', 'Substituição imersiva para "Tô em live":', ['Tô com os olhos abertos', 'Tô transmitindo', 'Tô sendo filmado', 'Tô gravando pro YouTube'], 0);
addS('Imersão', 'Falar "tô com febre" ou "meio gripado" pode substituir:', ['Tô com lag', 'Tô sem áudio (ouvir os outros)', 'Tô sem bateria', 'Tô com sono'], 1);
addS('Imersão', 'Por que devemos evitar termos como "Nárnia"?', ['Porque é um termo infantil', 'Porque quebra a imersão (prefira substituições criativas)', 'Porque é proibido pelo FiveM', 'Porque ninguém entende'], 1);
addS('Imersão', 'O que fazer se a imersão for quebrada por outro player?', ['Gritar que ele está errado', 'Chamar admin na hora', 'Improvisar e tirar proveito da situação narrativamente', 'Sair correndo e ignorar'], 2);
addS('Imersão', 'Qual destas frases é proibida por quebrar o RP?', ['"Minha cabeça tá doendo"', '"Tô com bug no voip"', '"Vou dar uma cochilada"', '"Meu rádio tá falhando"'], 1);

// --- ANTI-RP E REALIDADE ---
addS('Anti-RP', 'Flutuar sentado usando comandos do F8 sem sentido narrativo é:', ['Um truque legal', 'Anti-RP', 'RP Criativo', 'Permitido para veteranos'], 1);
addS('Anti-RP', 'Pular de lugares altos e não interpretar dor é considerado:', ['Coragem no RP', 'Anti-RP (falta de coerência com a realidade)', 'Habilidade de parkour', 'Normal no jogo'], 1);
addS('Anti-RP', 'Se algo absurdo ou um bug acontecer no RP, você deve:', ['Parar de falar', 'Interpretar com sentido e lógica real', 'Dar risada no chat local', 'Deslogar imediatamente'], 1);
addS('Anti-RP', 'Ignorar a lógica da vida real só porque é um jogo resulta em:', ['Mais diversão', 'Punições e quebra de imersão', 'Melhor desempenho', 'Cargo de staff'], 1);

// --- MÁ CONDUTA E ÉTICA ---
addS('Conduta', 'Qual o motivo mais sério de advertência na SantaCreators?', ['Uniforme errado', 'Má conduta (falta de respeito/rispidez)', 'Faltar um evento', 'Esquecer o kit'], 1);
addS('Conduta', 'Respostas debochadas ou atravessadas com colegas são tratadas como:', ['Personalidade forte', 'Má conduta', 'Zoeira saudável', 'Liberdade de expressão'], 1);
addS('Conduta', 'O que acontece com quem ignora orientações dos superiores?', ['Nada, cada um faz o seu', 'Pode ser advertido por má conduta', 'Recebe um prêmio', 'Ganha mais autonomia'], 1);
addS('Conduta', 'Sobre piadas racistas ou homofóbicas disfarçadas de "zoeira":', ['São aceitas entre amigos', 'A SantaCreators não tolera de forma alguma', 'Gera apenas um aviso verbal', 'Pode se for sem intenção'], 1);
addS('Conduta', 'Qual a "vibe" esperada dos membros na SantaCreators?', ['Competição e seriedade extrema', 'Respeito, conexão e diversão com consciência', 'Ficar mutado o dia todo', 'Falar apenas o necessário'], 1);
addS('Conduta', 'Se você não tem certeza se uma piada vai ofender, você deve:', ['Falar logo para testar', 'Perguntar antes ou não fazer', 'Falar e pedir desculpa depois', 'Mandar por DM'], 1);
addS('Conduta', 'O primeiro deslize grave de desrespeito ou preconceito resulta em:', ['Advertência 1/3', 'Expulsão direta sem segunda chance', 'Conversa de 1 hora', 'Perda de 5 pontos'], 1);

// --- PRESENÇA E LIDERANÇA ---
addS('Organização', 'Quem tem disponibilidade obrigatória nos eventos da operação?', [
  'Apenas os novatos',
  'Coord.+, Resp. Líder e Resp. Influ',
  'Toda a empresa sem exceção',
  'Apenas o Social Médias'
], 1);
addS('Organização', 'Qual o prazo limite para registrar ausência justificável?', ['Até o início do evento', 'Até às 18:30 do dia do evento', 'Até 1 hora depois do evento', 'Qualquer hora do dia'], 1);
addS('Organização', 'Não comparecer e não justificar no prazo gera qual penalidade?', ['Apenas um aviso', 'ADV 1/3 permanente e -5 pontos', 'Suspensão de 2 dias', 'Nada, se for a primeira vez'], 1);
addS('Organização', 'O que acontece ao acumular 3/3 advertências?', ['Resetam as ADVs', 'Reavaliação da permanência e posição na equipe', 'Ganha um bônus de consolação', 'Fica 1 semana sem poder'], 1);
addS('Organização', 'A justificativa de ausência deve conter:', ['Apenas um "não vou"', 'Motivo real/Justificativa', 'O nome de quem vai cobrir', 'O horário que vai voltar'], 1);
addS('Organização', 'Em quais dias ocorrem os eventos obrigatórios de liderança?', ['Segunda a Sexta', 'Segunda a Sábado', 'Terça a Domingo', 'Apenas nos fins de semana'], 1);

// --- COMANDOS FIVEM (F8) ---
addS('Comandos', 'O comando "hud" no F8 serve para:', ['Aumentar o volume', 'Remover informações da tela e o mapa/GPS', 'Ver o nome dos players', 'Ligar o carro'], 1);
addS('Comandos', 'O comando "hud2" é ideal para gravações porque silencia:', ['O rádio do carro', 'Anúncios VIP, zaralho e chats de eventos', 'A voz dos amigos', 'O som dos tiros'], 1);
addS('Comandos', 'Como se desativa o efeito do comando "hud2"?', ['Digitando hud3', 'Tomando um chá', 'Reiniciando o PC', 'Dando TP'], 1);
addS('Comandos', 'O comando "rec" no F8 grava:', ['Sons de músicas do jogo', 'Apenas o vídeo (sem sons de música ou vozes)', 'Vozes de todos os players', 'O menu do Discord'], 1);
addS('Comandos', 'Para alterar o ângulo da câmera em gravações, usamos:', ['hud', 'hubcam', 'camshow', 'freecam'], 1);
addS('Comandos', 'O comando "hidepromo" serve para remover:', ['Mensagens de erro', 'Informações de VIP no canto esquerdo da tela', 'O chat geral', 'Os nomes em cima da cabeça'], 1);
addS('Comandos', 'Qual comando limpa a roupa suja de sangue?', ['/limpar', 'sangue (no F8)', 'kitinf', 'lavar'], 1);
addS('Comandos', 'O comando "barreira" no F8 é ideal para:', ['Trancar a porta da sede', 'Compor cenas e dar suporte em ações/gravações', 'Fugir da polícia', 'Prender outros players'], 1);
addS('Comandos', 'Os comandos de F8 da SantaGroup são focados em:', ['Facilitar trapaças', 'Melhorar a experiência, imersão e criação de conteúdo', 'Ganhar dinheiro mais rápido', 'Ficar invisível'], 1);

// --- KITS EXCLUSIVOS ---
addS('Kits', 'O kit "KITINF" é voltado para:', ['Venda de itens', 'Suporte rápido pro RP e conteúdo diário', 'Ações de grande porte apenas', 'Eventos de sábado'], 1);
addS('Kits', 'Quais armas vêm no "KITINF"?', ['2 G3 e 2 Pistolas', '1 Sniper e 1 SMG', '3 Doze e 1 Faca', 'Somente munição'], 0);
addS('Kits', 'Quantas munições de G3 vêm no "KITINF"?', ['50', '150', '500', '1000'], 1);
addS('Kits', 'O kit "KITINFLU" (Premium) tem foco em:', ['Troca de tiro pesada', 'Mobilidade, suporte e performance nas gravações', 'Entregar comida pros outros', 'Limpar o prédio'], 1);
addS('Kits', 'Qual item de cura/suporte vem no "KITINFLU"?', ['10 Bandagens', '1 Adrenalina e 1 Kit de Reparo', '5 Coletes', '20 Sanduíches'], 1);
addS('Kits', 'Qual a frequência de renovação dos kits?', ['A cada 24 horas', 'A cada 1 hora', 'A cada 15 minutos', 'Apenas uma vez por dia'], 1);
addS('Kits', 'Quem tem direito a resgatar os kits exclusivos?', ['Qualquer player da cidade', 'Apenas Creators ativos da empresa', 'Somente a Staff', 'Quem ganhar o quiz'], 1);

// --- REGRAS GERAIS DE CONDUTA RP ---
addS('Imersão', 'Quitar na frente de outros players sem contexto é:', ['Uma conduta a ser evitada (procure local vazio/justificativa)', 'Permitido se você estiver com pressa', 'Normal se for fora da sede', 'Direito de todo jogador'], 0);
addS('Imersão', 'Uma justificativa imersiva para sair do expediente (deslogar) é:', ['"Meu PC tá travando"', '"Vou sair por agora"', '"Tô passando mal, vou sair do expediente"', '"Vou ali no Discord"'], 2);
addS('Imersão', 'Trocar de roupa na frente dos outros players é errado porque:', ['O uniforme é feio', 'Cria quebra de imersão e desorganiza o ambiente', 'Gasta pontos de skin', 'Atrai a polícia'], 1);
addS('Imersão', 'Substituição correta para "Tá com bug no voip":', ['"Minha voz tá lagada"', '"Minha garganta sumiu aqui rapidinho"', '"O servidor tá bugado"', '"Meu microfone faliu"'], 1);
addS('Imersão', 'Perguntar "Você está em live?" de forma direta é:', ['Recomendado para ganhar fama', 'Uma quebra de RP (prefira observar ou perguntar no off)', 'Obrigatório para segurança', 'Normal em qualquer conversa'], 1);
addS('Imersão', 'O uso de comandos F8 que quebram a física (como sentar no ar) deve:', ['Ser feito sempre por ser engraçado', 'Ser evitado, salvo se fizer sentido pro RP', 'Ser usado para tirar print', 'Ser livre em qualquer lugar'], 1);
addS('Imersão', 'O que significa "viver a cidade" no contexto SantaCreators?', ['Correr o tempo todo', 'Ter atitude, postura, respeito e manter a imersão', 'Ter o carro mais caro', 'Conhecer todos os admins'], 1);
addS('Conduta', 'Ser "Gente Boa" na SantaCreators envolve:', ['Dar itens de graça', 'Tratar todos com leveza, empatia e responsabilidade', 'Não falar com ninguém', 'Seguir apenas as ordens do Owner'], 1);
addS('Conduta', 'Se você ofender alguém em uma "zoeira", quem está errado?', ['Quem se ofendeu', 'Você (ofensa não é brincadeira)', 'Ninguém, é só um jogo', 'A coordenação por não ver'], 1);
addS('Conduta', 'A SantaCreators busca ser um ambiente:', ['Hostil para selecionar os fortes', 'Saudável, acolhedor e divertido para geral', 'Apenas para quem tem PC bom', 'Focado em guerra de facções'], 1);

// --- CONTINUAÇÃO DE QUESTÕES ATÉ CHEGAR EM 100+ ---
addS('Conduta', 'A disponibilidade de 19:00 é para quais dias?', ['Segunda a Sexta', 'Segunda a Sábado', 'Todos os dias', 'Finais de semana'], 1);
addS('Organização', 'O registro de ausência até 18:30 é:', ['Opcional', 'Obrigatório para cargos de responsabilidade', 'Apenas para novatos', 'Apenas se houver punição'], 1);
addS('Conduta', 'Rispidez em mensagens ou reuniões gera qual motivo de ADV?', ['Falta de kit', 'Má conduta', 'Anti-RP', 'Quebra de uniforme'], 1);
addS('Conduta', 'O que é "Falta de interesse em aprender" para a empresa?', ['Algo normal', 'Um tipo de Má Conduta', 'Motivo de bônus', 'Direito do membro'], 1);
addS('Conduta', 'Se você ignorar conselhos dos superiores, você está tendo:', ['Autonomia', 'Má conduta', 'Visão de líder', 'Iniciativa'], 1);
addS('Conduta', 'A advertência por falta de identificação vale para áreas:', ['Apenas dentro da sede', 'Proximidades da sede ou áreas próximas', 'Apenas no hospital', 'Somente na praça'], 1);
addS('Comandos', 'O kit emergencial de RP no F8 é o:', ['kitinflu', 'kitinf', 'kitmed', 'kitrp'], 1);
addS('Comandos', 'Qual comando do F8 remove as informações de VIP do lado esquerdo?', ['hidepromo', 'novip', 'limparvip', 'hudoff'], 0);
addS('Comandos', 'O comando "rec" grava as vozes dos players?', ['Sim', 'Não', 'Apenas se estiverem perto', 'Apenas a sua'], 1);
addS('Imersão', 'Dizer "Tô com febre" no RP pode significar que você:', ['Está com frio', 'Está sem áudio (não ouve os outros)', 'Quer ir pro hospital', 'Vai deslogar'], 1);
addS('Conduta', 'A regra "Respeito nunca sai de moda" refere-se a:', ['Uniforme novo', 'Tratar todos bem, independente do cargo ou clima', 'Usar roupas sociais', 'Falar formalmente'], 1);
addS('Conduta', 'O que é "falas maldosas disfarçadas de brincadeira"?', ['Humor inteligente', 'Preconceito/Má conduta (não tolerado)', 'Forma de entrosamento', 'Regra da empresa'], 1);
addS('Conduta', 'A SantaCreators agradece quem é:', ['O melhor atirador', 'Luz, leve e gente boa', 'O mais rico da cidade', 'O mais polêmico'], 1);
addS('Comandos', 'O comando "hud2" é bom para editores porque:', ['Aumenta o FPS', 'Silencia chats e sons que poluem a gravação', 'Luzes ficam mais fortes', 'Mostra os nomes'], 1);
addS('Comandos', 'O kit "KITINFLU" vem com quantos baseados?', ['1', '2', '5', '10'], 1);
addS('Comandos', 'O kit "KITINFLU" vem com quantas metanfetaminas?', ['1', '2', '3', '4'], 1);
addS('Comandos', 'O kit "KITINF" vem com quantas munições de pistola?', ['100', '250', '500', '50'], 0);
addS('Conduta', 'O status "Permanente" na ADV 1/3 por falta injustificada significa:', ['Sai depois de 1 mês', 'Não sai do registro (fica no histórico)', 'Pode ser removida com pontos', 'É resetada todo domingo'], 1);
addS('Conduta', 'Perder 5 pontos no sistema por falta é uma punição para:', ['Quem chega atrasado', 'Quem falta e não justifica no prazo', 'Quem erra o uniforme', 'Quem usa comando errado'], 1);
addS('Conduta', 'A reavaliação com 3/3 ADVs serve para:', ['Dar um cargo maior', 'Verificar se o membro tem comprometimento para continuar', 'Trocar o uniforme dele', 'Dar férias remuneradas'], 1);
addS('Imersão', 'O termo "Mentalizar" no RP geralmente substitui a ação de:', ['Pensar', 'Usar um comando ou tecla (tecnicamente)', 'Dormir', 'Falar'], 1);
addS('Conduta', 'Se um membro ignora a identidade visual da empresa, ele está:', ['Sendo estiloso', 'Desrespeitando a regra de identificação/uniforme', 'Inovando no RP', 'Seguindo a regra de civil'], 1);
addS('Conduta', 'A má conduta é o motivo mais sério porque:', ['É difícil de provar', 'Ataca a base de respeito e parceria do grupo', 'Gasta muito tempo do RESP', 'O Owner não gosta'], 1);
addS('Comandos', 'O kit resgatado via "kitinflu" é renovável a cada:', ['10 minutos', '1 hora', '5 horas', '12 horas'], 1);
addS('Conduta', 'O aviso "Seja exemplo" foca em qual perfil de membro?', ['Apenas os novatos', 'Todos (especialmente lideranças e quem quer crescer)', 'Apenas a Staff', 'Somente quem está em live'], 1);
addS('Conduta', 'O que a SantaCreators faz com quem não quer evoluir com o grupo?', ['Dá um cargo de conselheiro', 'Acaba ficando pra trás (desligamento/rebaixamento)', 'Ignora e deixa lá', 'Aumenta o salário'], 1);
addS('Comandos', 'O comando "hud" remove qual item essencial do GPS?', ['O rádio', 'O mapa da cidade', 'O velocímetro', 'A bússola'], 1);
addS('Imersão', 'Dizer "Minha garganta tá ruim" é melhor que dizer:', ['"Tô gripado"', '"Tô sem microfone"', '"Vou beber água"', '"Tô com sono"'], 1);
addS('Imersão', 'Dizer "Meu e-mail bugou" substitui imersivamente:', ['"Meu PC desligou"', '"Meu Discord caiu"', '"Meu rádio quebrou"', '"Meu mouse parou"'], 1);
addS('Conduta', 'A SantaCreators prioriza membros que:', ['Causam polêmica', 'Estão dispostos a crescer, respeitar e ter parceria', 'Jogam sozinhos', 'Têm muitos seguidores'], 1);
addS('Comandos', 'O comando "rec" é usado via:', ['F1', 'F8', 'T (Chat)', 'F10'], 1);
addS('Comandos', 'O comando "sangue" limpa:', ['A sede', 'A roupa suja de sangue', 'O carro', 'As mãos'], 1);
addS('Conduta', 'A regra de disponibilidade obrigatória nos eventos serve para:', [
  'Ocupar o tempo do membro',
  'Sustentar a base da operação semanal da empresa',
  'Testar a paciência da equipe',
  'Ganhar visualização no YouTube'
], 1);
addS('Organização', 'O registro de ausência até 18:30 é uma prova de:', ['Burocracia', 'Comprometimento e organização', 'Falta de liberdade', 'Controle de staff'], 1);
addS('Conduta', 'Ao atingir 3/3 ADVs, o membro pode ser:', ['Promovido', 'Desligado ou rebaixado após reavaliação', 'Suspenso por 5 minutos', 'Convidado para uma festa'], 1);
addS('Conduta', 'O primeiro passo ao ter dúvidas sobre conduta é:', ['Fazer o que der na telha', 'Procurar alguém da liderança', 'Perguntar no chat geral da cidade', 'Ignorar a dúvida'], 1);
addS('Conduta', 'A SantaCreators se baseia em:', ['Respeito mútuo e evolução coletiva', 'Competição interna feroz', 'Individualismo', 'Apenas lucro in-game'], 0);
addS('Conduta', 'O "Comprometimento" na empresa é avaliado por:', ['Presença, pontualidade e respeito às regras', 'Quantidade de dinheiro in-game', 'Nível de amizade com o Owner', 'Poderes de staff'], 0);
addS('Organização', 'Se você é Coord.+ e não avisou que ia faltar, você perde:', ['100 pontos', '5 pontos e recebe ADV 1/3 permanente', 'A skin do personagem', 'O acesso à sede por 1 mês'], 1);
addS('Imersão', 'O RP de verdade, segundo a SantaCreators, se faz com:', ['Armas caras', 'Atitude, postura e respeito', 'Gritos e polêmicas', 'Muitos comandos de F8'], 1);
addS('Imersão', 'A imersão na cidade começa com:', ['O Admin', 'Você (cada membro fazendo sua parte)', 'O mapa novo', 'O rádio da empresa'], 1);

// =========================
// NOVAS 200 QUESTÕES — MANUAL ATUAL SANTACREATORS
// Inserir antes de: export const SC_QUIZ_BANK = Q;
// =========================
addS('Conduta', 'A SantaCreators existe principalmente para quê?', [
  'Criar conteúdo, entretenimento, experiências e desenvolver pessoas',
  'Ser apenas uma empresa de eventos com prédio próprio',
  'Reunir membros para conviver sem processo interno',
  'Funcionar como uma staff informal da cidade'
], 0);

addS('Conduta', 'Qual interpretação mais correta sobre a frase “não é só mais uma empresa de RP”?', [
  'A empresa possui cultura, processo, desenvolvimento e responsabilidade',
  'A empresa possui menos regras por ser criativa',
  'A empresa só aceita pessoas famosas ou influenciadores grandes',
  'A empresa existe apenas para entregar premiações'
], 0);

addS('Conduta', 'O que a empresa mais observa em alguém que quer crescer?', [
  'Participação, postura, responsabilidade e constância',
  'Apenas quantidade de seguidores e clips postados',
  'Amizade com liderança e tempo parado em call',
  'Saber todos os comandos antes de entrar'
], 0);

addS('Conduta', 'Uma pessoa talentosa, mas ausente e sem participação, tende a:', [
  'Evoluir menos que alguém presente e comprometido',
  'Ser promovida mais rápido por ter talento natural',
  'Receber cargo por não precisar de acompanhamento',
  'Entrar direto na gestaoinfluencer'
], 0);

addS('Organização', 'O domingo operacional da SantaCreators serve principalmente para:', [
  'Planejamento, revisão de cronogramas, organização e preparação',
  'Aplicar punições antigas e zerar todas as regras',
  'Fazer apenas eventos sem revisar nada',
  'Cancelar demandas da semana anterior'
], 0);

addS('Organização', 'A regra “se não foi registrado, não aconteceu” significa que:', [
  'O trabalho precisa de comprovação, histórico e documentação',
  'Só vale registrar quando alguém da liderança cobrar',
  'Registro é opcional quando a tarefa foi bem feita',
  'A fala em call substitui qualquer registro'
], 0);

addS('Organização', 'Por que a SantaCreators evita resolver assuntos oficiais apenas por DM?', [
  'Para manter transparência, histórico e evitar mal-entendidos',
  'Porque DM nunca deve ser usada em nenhuma situação',
  'Porque apenas responsáveis podem conversar no privado',
  'Porque registro só importa em casos de punição'
], 0);

addS('Organização', 'Quando existe um problema interno, o fluxo mais correto é:', [
  'Procurar liderança direta, coordenação ou responsáveis conforme a necessidade',
  'Pular direto para o Owner em qualquer situação simples',
  'Resolver em conversa paralela sem deixar histórico',
  'Comentar com terceiros até alguém resolver'
], 0);

addS('Imersão', 'O que melhor define imersão dentro da SantaCreators?', [
  'Agir de forma coerente com o universo do personagem',
  'Falar o mínimo possível durante qualquer cena',
  'Usar comandos de F8 para resolver cenas rapidamente',
  'Evitar participar de RP com desconhecidos'
], 0);

addS('Imersão', 'Qual frase mantém melhor a imersão ao precisar sair de uma cena?', [
  'Vou meditar um pouco e já volto quando estiver melhor',
  'Meu teclado parou e preciso reiniciar o PC',
  'Meu Discord bugou, espera eu reconectar',
  'Vou no banheiro rapidinho, segura aí'
], 0);

addS('Imersão', 'Um comportamento técnico possível no jogo, mas incoerente no RP, é tratado como:', [
  'Anti-RP',
  'Apenas estilo de gameplay',
  'Permissão administrativa automática',
  'RP criativo sem limite'
], 0);

addS('Imersão', 'Se algo bugado acontecer em cena, a melhor postura é:', [
  'Contornar com criatividade sem trazer o off diretamente',
  'Parar tudo e explicar o bug para todos',
  'Rir no personagem falando de Discord e teclado',
  'Usar poder para corrigir sem registrar nada'
], 0);

addS('Uniforme', 'Dentro do prédio da SantaCreators, a regra atual exige:', [
  'Jaqueta oficial da SantaCreators',
  'Qualquer peça escura parecida com uniforme',
  'Apenas estar com cargo no Discord',
  'Uma peça da empresa, mesmo sem jaqueta'
], 0);

addS('Uniforme', 'Nos arredores da sede ou ao usar garagem, o membro deve:', [
  'Usar pelo menos uma peça oficial da empresa',
  'Usar obrigatoriamente o uniforme completo',
  'Ficar identificado apenas se houver evento',
  'Usar qualquer roupa desde que esteja em call'
], 0);

addS('Uniforme', 'A falta de identificação perto da sede pode gerar advertência porque:', [
  'Afeta imagem, organização e reconhecimento da empresa',
  'Só atrapalha quando há transmissão ao vivo',
  'Impede o sistema de contar pontos automaticamente',
  'É proibido apenas para membros novos'
], 0);

addS('Uniforme', 'O uniforme oficial representa principalmente:', [
  'Identidade, pertencimento e responsabilidade ao representar a empresa',
  'Vantagem hierárquica para mandar em outros players',
  'Permissão para usar veículos em qualquer RP',
  'Obrigação estética sem relação com cultura'
], 0);

addS('Veículos', 'Os veículos da SantaCreators devem ser usados para:', [
  'Eventos, operações e deslocamentos relacionados à empresa',
  'Troca de tiro, assalto e ações pessoais rápidas',
  'Substituir qualquer garagem pessoal do membro',
  'Emprestar para aliados de fora da empresa'
], 0);

addS('Veículos', 'Usar veículo da empresa em ação ilegal sem contexto adequado é problema porque:', [
  'Expõe a imagem e desvia a finalidade do recurso',
  'É permitido se o membro estiver sem uniforme',
  'Só vira erro quando alguém grava em vídeo',
  'É uma escolha individual sem efeito na empresa'
], 0);

addS('Veículos', 'Spawnar veículo no mundo padrão na frente de players é:', [
  'Falha grave de conduta e abuso de poder',
  'Uma forma aceitável de agilizar eventos',
  'Permitido quando o veículo é da própria empresa',
  'Apenas quebra leve se não houver combate'
], 0);

addS('Veículos', 'Ao usar recurso da empresa, a mentalidade correta é:', [
  'Zelo, responsabilidade e cuidado com o patrimônio coletivo',
  'Usar o máximo possível antes que outro use',
  'Priorizar benefício pessoal se estiver com pressa',
  'Pedir desculpa apenas se alguém perceber'
], 0);

addS('Baús', 'A regra geral dos baús da empresa é:', [
  'Usar com consciência, controle e finalidade correta',
  'Retirar bastante para garantir estoque pessoal',
  'Usar livremente se a pessoa tiver cargo alto',
  'Pegar primeiro e justificar depois'
], 0);

addS('Baús', 'O baú creators existe principalmente para:', [
  'Doações e entregas ligadas à operação',
  'Consumo livre dos membros mais ativos',
  'Guardar itens pessoais de responsáveis',
  'Venda particular sem divisão'
], 0);

addS('Baús', 'No baú geral, uma retirada correta é aquela que:', [
  'Pega apenas o necessário e não prejudica os demais',
  'Garante estoque individual para a semana toda',
  'Retira para revender e depois repor se lembrar',
  'É feita sem pensar no coletivo'
], 0);

addS('Baús', 'Por que retirar do baú creators para uso pessoal é errado?', [
  'Porque desvia a finalidade de doações e entregas',
  'Porque apenas novatos são proibidos de retirar',
  'Porque só pode retirar depois das 23:30',
  'Porque o baú serve para lucro pessoal'
], 0);

addS('Poderes', 'A filosofia correta sobre poderes é:', [
  'Poder é responsabilidade, não privilégio pessoal',
  'Poder serve para facilitar a vida do membro',
  'Quem tem poder pode corrigir qualquer RP na hora',
  'Poder substitui registro quando usado corretamente'
], 0);

addS('Poderes', 'Usar poder para vantagem própria ou de amigos é:', [
  'Abuso de poder',
  'Autonomia de gestão',
  'Apoio informal permitido',
  'Erro leve sem impacto'
], 0);

addS('Poderes', 'Quando houver dúvida sobre usar um poder, o correto é:', [
  'Perguntar antes e validar o contexto',
  'Usar primeiro e explicar no registro',
  'Evitar registrar para não gerar confusão',
  'Pedir para um amigo confirmar'
], 0);

addS('Poderes', 'O registro de poderes existe para garantir:', [
  'Transparência, controle e responsabilidade',
  'Apenas contagem automática de dinheiro',
  'Permissão para usar comandos fora da empresa',
  'Substituição de qualquer alinhamento'
], 0);

addS('GI', 'A gestaoinfluencer é melhor definida como:', [
  'Núcleo interno administrativo da própria SantaCreators',
  'Staff da cidade voltada a punir jogadores',
  'Equipe separada que funciona independente da empresa',
  'Cargo único entregue por formulário'
], 0);

addS('GI', 'A entrada na gestaoinfluencer acontece por:', [
  'Evolução, confiança, participação e convite',
  'Pedido direto em formulário público',
  'Tempo de Discord sem atuação prática',
  'Indicação de amizade sem observação'
], 0);

addS('GI', 'A missão final da gestaoinfluencer é:', [
  'Formar pessoas capazes de fortalecer a SantaCreators',
  'Distribuir cargos e poderes para quem pedir',
  'Controlar a cidade como staff administrativa',
  'Separar a gestão do restante da empresa'
], 0);

addS('GI', 'Possuir cargo na gestão não significa automaticamente:', [
  'Ter acesso total a todas as permissões',
  'Ter responsabilidades maiores que antes',
  'Ser observado pela liderança',
  'Precisar manter postura'
], 0);

addS('Hierarquia', 'No painel oficial, o Nível 3 representa:', [
  'Creator',
  'Resp Líder',
  'Coord Creators',
  'Social Media e Manager'
], 0);

addS('Hierarquia', 'No painel oficial, o Nível 2 reúne:', [
  'Social Medias, Manager, Gestor e Coord',
  'Apenas Resp Influ e Resp Creators',
  'Somente Creator e Creator Líder',
  'Todos os membros sem função'
], 0);

addS('Hierarquia', 'No painel oficial, o Nível 1 representa:', [
  'Responsáveis da liderança operacional',
  'Base de entrada da empresa',
  'Área exclusiva dos Managers',
  'Equipe temporária de eventos'
], 0);

addS('Hierarquia', 'O caminho natural de evolução é melhor representado por:', [
  'Creator > Creator Líder > Social/Manager > Gestor > Coord > Responsáveis',
  'Creator > Responsável > Manager > Social > Coord',
  'Social > Creator > Gestor > Resp Creators',
  'Manager > Creator > Resp Influ > Equipe Social'
], 0);

addS('Creator', 'O Creator é importante porque:', [
  'Sustenta comunidade, movimentação, crescimento e retenção',
  'É apenas um cargo decorativo antes da gestão',
  'Serve somente para preencher lista de membros',
  'Recebe todas as permissões administrativas'
], 0);

addS('Creator', 'O Creator não precisa entrar sabendo tudo, mas precisa:', [
  'Demonstrar interesse, participação e vontade de aprender',
  'Cobrar promoção antes de participar',
  'Escolher cargo alto logo na entrada',
  'Focar apenas em premiação'
], 0);

addS('Creator Líder', 'O Creator Líder representa:', [
  'Primeiro passo dentro da gestão e formação de liderança',
  'Cargo máximo da equipe de eventos',
  'Função externa sem ligação com Social/Manager',
  'Cargo automático para quem faz live'
], 0);

addS('Creator Líder', 'O Creator Líder é formado por quais bases?', [
  'Equipe Social Medias e Equipe Manager',
  'Gestor e Coordenação apenas',
  'Resp Líder e Resp Influ',
  'Staff e Marketing'
], 0);

addS('Social Médias', 'A Social Media constrói a experiência porque cuida de:', [
  'Eventos, cronogramas, premiações, hall da fama e registros',
  'Apenas convites de líderes e facções',
  'Punições da cidade e denúncias gerais',
  'Somente roupas pessoais dos membros'
], 0);

addS('Social Médias', 'A escolha dos eventos importa porque eles existem para:', [
  'Movimentar cidades, gerar retenção e entretenimento',
  'Distribuir prêmio sem estratégia',
  'Aumentar cargos automaticamente',
  'Substituir presença da liderança'
], 0);

addS('Social Médias', 'A regra de repetição do cronograma impede repetir:', [
  'Mesmo evento, mesma cidade e mesmo dia da semana anterior',
  'Qualquer evento que já aconteceu no mês',
  'Qualquer cidade usada por outra equipe',
  'Qualquer premiação com VIP'
], 0);

addS('Social Médias', 'Após eventos, o registro de presença/poderes serve para:', [
  'Criar histórico da atuação da equipe',
  'Apenas mostrar quem ganhou o evento',
  'Substituir pagamento e hall da fama',
  'Evitar que Managers precisem registrar orgs'
], 0);

addS('Manager', 'A missão central do Manager é:', [
  'Garantir organizações presentes nos eventos',
  'Criar sozinho todos os cronogramas',
  'Aplicar punição em organização ausente',
  'Montar hall da fama das cidades'
], 0);

addS('Manager', 'O Manager deve confirmar participação com:', [
  'Liderança oficial da organização',
  'Qualquer membro que responda rápido',
  'Terceiros que conhecem a facção',
  'Apenas prints antigos de presença'
], 0);

addS('Manager', 'Registrar organização sem confirmação direta do líder é:', [
  'Incorreto e fora do procedimento',
  'Aceitável se muitos membros prometerem ir',
  'Correto quando o evento está vazio',
  'Permitido se for cidade Nobre'
], 0);

addS('Manager', 'A relação correta entre Social Media e Manager é:', [
  'Social cria o evento e Manager leva participantes',
  'Manager substitui Social quando há pouco contingente',
  'Social cuida apenas de imagem e Manager de tudo',
  'São áreas rivais com objetivos opostos'
], 0);

addS('Gestor', 'O Gestor existe principalmente para:', [
  'Desenvolver pessoas em formação',
  'Produzir tudo sozinho para ganhar pontos',
  'Substituir permanentemente Coordenação',
  'Aprovar premiação sem supervisão'
], 0);

addS('Gestor', 'Um Gestor obrigatoriamente veio de:', [
  'Social Media ou Manager Creators',
  'Creator recém-entrado sem área',
  'Resp Influ ou Resp Creators',
  'Qualquer staff externa'
], 0);

addS('Gestor', 'O Gestor ensina principalmente membros em fase:', [
  'Inicial/GI 5, que ainda estão aprendendo',
  'De Resp Creators, já no topo',
  'Externa à SantaCreators',
  'Sem vínculo com a empresa'
], 0);

addS('Gestor', 'Um feedback útil precisa conter:', [
  'Pontos fortes, dificuldades, evolução, comportamento e desempenho',
  'Apenas elogio curto para motivar',
  'Somente crítica sem contexto',
  'Uma frase genérica para economizar tempo'
], 0);

addS('Coordenação', 'O Coord enxerga a operação de forma:', [
  'Completa, atravessando Social, Manager e Gestor',
  'Limitada apenas à área de origem',
  'Exclusiva de punições disciplinares',
  'Voltada apenas a premiações VIP'
], 0);

addS('Coordenação', 'Quando falta alguém em uma área, o Coord deve:', [
  'Assumir temporariamente sem centralizar para sempre',
  'Cancelar a área até o responsável voltar',
  'Fazer tudo sozinho permanentemente',
  'Ignorar se não for sua área favorita'
], 0);

addS('Coordenação', 'O Coord não deve centralizar tudo porque o objetivo é:', [
  'Fortalecer equipes, não substituir equipes permanentemente',
  'Mostrar que só ele trabalha bem',
  'Impedir Gestores de ensinar',
  'Concentrar pontos em uma pessoa'
], 0);

addS('Coordenação', 'A diferença mais clara entre Gestor e Coord é:', [
  'Gestor foca evolução do membro; Coord foca funcionamento da equipe',
  'Gestor manda mais que Coord em eventos',
  'Coord só registra e Gestor só pune',
  'Não existe diferença prática'
], 0);

addS('Responsáveis', 'O Resp Líder acompanha principalmente:', [
  'Liderança, desenvolvimento, registros e evolução da equipe',
  'Apenas o próprio desempenho individual',
  'Somente skins e comandos de F8',
  'Apenas pagamentos de VIP'
], 0);

addS('Responsáveis', 'O Resp Líder não deve simplesmente executar tudo porque precisa:', [
  'Ensinar, orientar, acompanhar e formar líderes',
  'Evitar qualquer contato com a base',
  'Ficar somente em call de diretoria',
  'Delegar tudo sem acompanhar'
], 0);

addS('Responsáveis', 'O Resp Influ tem foco em:', [
  'Estabilidade, disciplina, organização e funcionamento da gestão',
  'Apenas cronograma visual de eventos',
  'Somente criação de roupas e imagens',
  'Substituir todos os Managers'
], 0);

addS('Responsáveis', 'O Resp Creators é responsável por:', [
  'Supervisão completa, estratégia, premiações e decisões importantes',
  'Apenas presença em evento de sábado',
  'Somente registro de organizações',
  'Função decorativa acima do Coord'
], 0);

addS('Tiers', 'O tier mede principalmente:', [
  'Maturidade, liderança, autonomia, responsabilidade e visão de gestão',
  'Quantidade de horas online sem qualidade',
  'Apenas número de eventos vencidos',
  'Somente cargo atual no Discord'
], 0);

addS('Tiers', 'Duas pessoas com o mesmo cargo podem ter tiers diferentes porque:', [
  'Tier representa qualidade de liderança, não só cargo',
  'O sistema sorteia tiers por antiguidade',
  'Tier depende apenas de amizade com responsável',
  'Cargo e tier são exatamente a mesma coisa'
], 0);

addS('Tiers', 'A ordem correta dos tiers é:', [
  'Teste > T1 > T2 > T3 > T4 > T5',
  'T5 > T1 > Teste > T3 > T2',
  'T1 > Teste > T5 > T4 > T2',
  'Coord > Creator > T1 > Resp'
], 0);

addS('Tiers', 'O T5 representa alguém com:', [
  'Visão estratégica, autonomia completa e preparo para liderança máxima',
  'Apenas mais pontos no mês atual',
  'Permissão para ignorar registros',
  'Cargo de entrada em teste'
], 0);

addS('Registros', 'Os dashboards existem para:', [
  'Transformar registros em informações visuais de acompanhamento',
  'Substituir completamente avaliação humana',
  'Mostrar apenas quem está online no Discord',
  'Guardar punições sem relação com produtividade'
], 0);

addS('Registros', 'O ranking geral deve ser entendido como:', [
  'Indicador de contribuição e produtividade, sem substituir qualidade',
  'Prova absoluta de quem deve ser promovido sempre',
  'Sistema apenas estético sem utilidade',
  'Lista de quem tem mais cargo'
], 0);

addS('Registros', 'Um evento bem executado costuma gerar:', [
  'Pagamento, hall da fama, poderes, pontuação e dashboard',
  'Apenas print do vencedor e fim',
  'Somente convite de organização',
  'Nenhum registro se todos estavam em call'
], 0);

addS('Registros', 'A liderança toma decisões melhores quando possui:', [
  'Histórico, registros, números e dashboards',
  'Opiniões soltas sem comprovação',
  'Apenas mensagens privadas antigas',
  'Impressões de quem fala mais alto'
], 0);

addS('Horários', 'O bate ponto atual da SantaCreators funciona em quais janelas?', [
  '19:00 às 00:00 e 00:30 às 03:30',
  '17:00 às 23:00 e 01:00 às 04:00',
  '18:00 às 23:00 e 00:00 às 03:00',
  'Somente 19:00 às 23:00'
], 0);

addS('Horários', 'Sobre eventos da SantaCreators, a regra atual deixou de ser:', [
  'Um horário fixo simples de 19:00 para tudo',
  'Uma operação com planejamento semanal',
  'Uma agenda ligada às cidades da operação',
  'Uma estrutura com registros e responsáveis'
], 0);

addS('Horários', 'Na operação atual, segunda-feira tem como cidade principal:', [
  'Maresia',
  'Grande',
  'Santa',
  'Nobre'
], 0);

addS('Horários', 'Na operação atual, terça-feira tem como cidade principal:', [
  'Grande',
  'Maresia',
  'Santa',
  'Nobre'
], 0);

addS('Horários', 'Na operação atual, quarta-feira tem como cidade principal:', [
  'Santa',
  'Nobre',
  'Grande',
  'Maresia'
], 0);

addS('Horários', 'Na operação atual, quinta, sexta e sábado concentram-se principalmente em:', [
  'Nobre',
  'Santa',
  'Maresia',
  'Grande'
], 0);

addS('Horários', 'A Nobre é tratada como centro operacional porque:', [
  'Concentra eventos importantes, especialmente de retenção',
  'É a única cidade onde existe SantaCreators',
  'Não precisa de registros por ser principal',
  'Substitui todas as demais cidades'
], 0);

addS('Horários', 'Quando a liderança não puder acompanhar a operação, deve:', [
  'Justificar previamente no fluxo correto e dentro do prazo',
  'Avisar apenas depois se alguém cobrar',
  'Pedir para um membro comum esconder a falta',
  'Ignorar se tiver feito pontos na semana'
], 0);

addS('Conduta', 'Em uma situação prática: a SantaCreators existe principalmente para quê?', [
  'Ser apenas uma empresa de eventos com prédio próprio',
  'Criar conteúdo, entretenimento, experiências e desenvolver pessoas',
  'Reunir membros para conviver sem processo interno',
  'Funcionar como uma staff informal da cidade'
], 1);

addS('Conduta', 'Em uma situação prática: qual interpretação mais correta sobre a frase “não é só mais uma empresa de RP”?', [
  'A empresa possui menos regras por ser criativa',
  'A empresa possui cultura, processo, desenvolvimento e responsabilidade',
  'A empresa só aceita pessoas famosas ou influenciadores grandes',
  'A empresa existe apenas para entregar premiações'
], 1);

addS('Conduta', 'Em uma situação prática: o que a empresa mais observa em alguém que quer crescer?', [
  'Apenas quantidade de seguidores e clips postados',
  'Participação, postura, responsabilidade e constância',
  'Amizade com liderança e tempo parado em call',
  'Saber todos os comandos antes de entrar'
], 1);

addS('Conduta', 'Em uma situação prática: uma pessoa talentosa, mas ausente e sem participação, tende a:', [
  'Ser promovida mais rápido por ter talento natural',
  'Evoluir menos que alguém presente e comprometido',
  'Receber cargo por não precisar de acompanhamento',
  'Entrar direto na gestaoinfluencer'
], 1);

addS('Organização', 'Em uma situação prática: o domingo operacional da SantaCreators serve principalmente para:', [
  'Aplicar punições antigas e zerar todas as regras',
  'Planejamento, revisão de cronogramas, organização e preparação',
  'Fazer apenas eventos sem revisar nada',
  'Cancelar demandas da semana anterior'
], 1);

addS('Organização', 'Em uma situação prática: a regra “se não foi registrado, não aconteceu” significa que:', [
  'Só vale registrar quando alguém da liderança cobrar',
  'O trabalho precisa de comprovação, histórico e documentação',
  'Registro é opcional quando a tarefa foi bem feita',
  'A fala em call substitui qualquer registro'
], 1);

addS('Organização', 'Em uma situação prática: por que a SantaCreators evita resolver assuntos oficiais apenas por DM?', [
  'Porque DM nunca deve ser usada em nenhuma situação',
  'Para manter transparência, histórico e evitar mal-entendidos',
  'Porque apenas responsáveis podem conversar no privado',
  'Porque registro só importa em casos de punição'
], 1);

addS('Organização', 'Em uma situação prática: quando existe um problema interno, o fluxo mais correto é:', [
  'Pular direto para o Owner em qualquer situação simples',
  'Procurar liderança direta, coordenação ou responsáveis conforme a necessidade',
  'Resolver em conversa paralela sem deixar histórico',
  'Comentar com terceiros até alguém resolver'
], 1);

addS('Imersão', 'Em uma situação prática: o que melhor define imersão dentro da SantaCreators?', [
  'Falar o mínimo possível durante qualquer cena',
  'Agir de forma coerente com o universo do personagem',
  'Usar comandos de F8 para resolver cenas rapidamente',
  'Evitar participar de RP com desconhecidos'
], 1);

addS('Imersão', 'Em uma situação prática: qual frase mantém melhor a imersão ao precisar sair de uma cena?', [
  'Meu teclado parou e preciso reiniciar o PC',
  'Vou meditar um pouco e já volto quando estiver melhor',
  'Meu Discord bugou, espera eu reconectar',
  'Vou no banheiro rapidinho, segura aí'
], 1);

addS('Imersão', 'Em uma situação prática: um comportamento técnico possível no jogo, mas incoerente no RP, é tratado como:', [
  'Apenas estilo de gameplay',
  'Anti-RP',
  'Permissão administrativa automática',
  'RP criativo sem limite'
], 1);

addS('Imersão', 'Em uma situação prática: se algo bugado acontecer em cena, a melhor postura é:', [
  'Parar tudo e explicar o bug para todos',
  'Contornar com criatividade sem trazer o off diretamente',
  'Rir no personagem falando de Discord e teclado',
  'Usar poder para corrigir sem registrar nada'
], 1);

addS('Uniforme', 'Em uma situação prática: dentro do prédio da SantaCreators, a regra atual exige:', [
  'Qualquer peça escura parecida com uniforme',
  'Jaqueta oficial da SantaCreators',
  'Apenas estar com cargo no Discord',
  'Uma peça da empresa, mesmo sem jaqueta'
], 1);

addS('Uniforme', 'Em uma situação prática: nos arredores da sede ou ao usar garagem, o membro deve:', [
  'Usar obrigatoriamente o uniforme completo',
  'Usar pelo menos uma peça oficial da empresa',
  'Ficar identificado apenas se houver evento',
  'Usar qualquer roupa desde que esteja em call'
], 1);

addS('Uniforme', 'Em uma situação prática: a falta de identificação perto da sede pode gerar advertência porque:', [
  'Só atrapalha quando há transmissão ao vivo',
  'Afeta imagem, organização e reconhecimento da empresa',
  'Impede o sistema de contar pontos automaticamente',
  'É proibido apenas para membros novos'
], 1);

addS('Uniforme', 'Em uma situação prática: o uniforme oficial representa principalmente:', [
  'Vantagem hierárquica para mandar em outros players',
  'Identidade, pertencimento e responsabilidade ao representar a empresa',
  'Permissão para usar veículos em qualquer RP',
  'Obrigação estética sem relação com cultura'
], 1);

addS('Veículos', 'Em uma situação prática: os veículos da SantaCreators devem ser usados para:', [
  'Troca de tiro, assalto e ações pessoais rápidas',
  'Eventos, operações e deslocamentos relacionados à empresa',
  'Substituir qualquer garagem pessoal do membro',
  'Emprestar para aliados de fora da empresa'
], 1);

addS('Veículos', 'Em uma situação prática: usar veículo da empresa em ação ilegal sem contexto adequado é problema porque:', [
  'É permitido se o membro estiver sem uniforme',
  'Expõe a imagem e desvia a finalidade do recurso',
  'Só vira erro quando alguém grava em vídeo',
  'É uma escolha individual sem efeito na empresa'
], 1);

addS('Veículos', 'Em uma situação prática: spawnar veículo no mundo padrão na frente de players é:', [
  'Uma forma aceitável de agilizar eventos',
  'Falha grave de conduta e abuso de poder',
  'Permitido quando o veículo é da própria empresa',
  'Apenas quebra leve se não houver combate'
], 1);

addS('Veículos', 'Em uma situação prática: ao usar recurso da empresa, a mentalidade correta é:', [
  'Usar o máximo possível antes que outro use',
  'Zelo, responsabilidade e cuidado com o patrimônio coletivo',
  'Priorizar benefício pessoal se estiver com pressa',
  'Pedir desculpa apenas se alguém perceber'
], 1);

addS('Baús', 'Em uma situação prática: a regra geral dos baús da empresa é:', [
  'Retirar bastante para garantir estoque pessoal',
  'Usar com consciência, controle e finalidade correta',
  'Usar livremente se a pessoa tiver cargo alto',
  'Pegar primeiro e justificar depois'
], 1);

addS('Baús', 'Em uma situação prática: o baú creators existe principalmente para:', [
  'Consumo livre dos membros mais ativos',
  'Doações e entregas ligadas à operação',
  'Guardar itens pessoais de responsáveis',
  'Venda particular sem divisão'
], 1);

addS('Baús', 'Em uma situação prática: no baú geral, uma retirada correta é aquela que:', [
  'Garante estoque individual para a semana toda',
  'Pega apenas o necessário e não prejudica os demais',
  'Retira para revender e depois repor se lembrar',
  'É feita sem pensar no coletivo'
], 1);

addS('Baús', 'Em uma situação prática: por que retirar do baú creators para uso pessoal é errado?', [
  'Porque apenas novatos são proibidos de retirar',
  'Porque desvia a finalidade de doações e entregas',
  'Porque só pode retirar depois das 23:30',
  'Porque o baú serve para lucro pessoal'
], 1);

addS('Poderes', 'Em uma situação prática: a filosofia correta sobre poderes é:', [
  'Poder serve para facilitar a vida do membro',
  'Poder é responsabilidade, não privilégio pessoal',
  'Quem tem poder pode corrigir qualquer RP na hora',
  'Poder substitui registro quando usado corretamente'
], 1);

addS('Poderes', 'Em uma situação prática: usar poder para vantagem própria ou de amigos é:', [
  'Autonomia de gestão',
  'Abuso de poder',
  'Apoio informal permitido',
  'Erro leve sem impacto'
], 1);

addS('Poderes', 'Em uma situação prática: quando houver dúvida sobre usar um poder, o correto é:', [
  'Usar primeiro e explicar no registro',
  'Perguntar antes e validar o contexto',
  'Evitar registrar para não gerar confusão',
  'Pedir para um amigo confirmar'
], 1);

addS('Poderes', 'Em uma situação prática: o registro de poderes existe para garantir:', [
  'Apenas contagem automática de dinheiro',
  'Transparência, controle e responsabilidade',
  'Permissão para usar comandos fora da empresa',
  'Substituição de qualquer alinhamento'
], 1);

addS('GI', 'Em uma situação prática: a gestaoinfluencer é melhor definida como:', [
  'Staff da cidade voltada a punir jogadores',
  'Núcleo interno administrativo da própria SantaCreators',
  'Equipe separada que funciona independente da empresa',
  'Cargo único entregue por formulário'
], 1);

addS('GI', 'Em uma situação prática: a entrada na gestaoinfluencer acontece por:', [
  'Pedido direto em formulário público',
  'Evolução, confiança, participação e convite',
  'Tempo de Discord sem atuação prática',
  'Indicação de amizade sem observação'
], 1);

addS('GI', 'Em uma situação prática: a missão final da gestaoinfluencer é:', [
  'Distribuir cargos e poderes para quem pedir',
  'Formar pessoas capazes de fortalecer a SantaCreators',
  'Controlar a cidade como staff administrativa',
  'Separar a gestão do restante da empresa'
], 1);

addS('GI', 'Em uma situação prática: possuir cargo na gestão não significa automaticamente:', [
  'Ter responsabilidades maiores que antes',
  'Ter acesso total a todas as permissões',
  'Ser observado pela liderança',
  'Precisar manter postura'
], 1);

addS('Hierarquia', 'Em uma situação prática: no painel oficial, o Nível 3 representa:', [
  'Resp Líder',
  'Creator',
  'Coord Creators',
  'Social Media e Manager'
], 1);

addS('Hierarquia', 'Em uma situação prática: no painel oficial, o Nível 2 reúne:', [
  'Apenas Resp Influ e Resp Creators',
  'Social Medias, Manager, Gestor e Coord',
  'Somente Creator e Creator Líder',
  'Todos os membros sem função'
], 1);

addS('Hierarquia', 'Em uma situação prática: no painel oficial, o Nível 1 representa:', [
  'Base de entrada da empresa',
  'Responsáveis da liderança operacional',
  'Área exclusiva dos Managers',
  'Equipe temporária de eventos'
], 1);

addS('Hierarquia', 'Em uma situação prática: o caminho natural de evolução é melhor representado por:', [
  'Creator > Responsável > Manager > Social > Coord',
  'Creator > Creator Líder > Social/Manager > Gestor > Coord > Responsáveis',
  'Social > Creator > Gestor > Resp Creators',
  'Manager > Creator > Resp Influ > Equipe Social'
], 1);

addS('Creator', 'Em uma situação prática: o Creator é importante porque:', [
  'É apenas um cargo decorativo antes da gestão',
  'Sustenta comunidade, movimentação, crescimento e retenção',
  'Serve somente para preencher lista de membros',
  'Recebe todas as permissões administrativas'
], 1);

addS('Creator', 'Em uma situação prática: o Creator não precisa entrar sabendo tudo, mas precisa:', [
  'Cobrar promoção antes de participar',
  'Demonstrar interesse, participação e vontade de aprender',
  'Escolher cargo alto logo na entrada',
  'Focar apenas em premiação'
], 1);

addS('Creator Líder', 'Em uma situação prática: o Creator Líder representa:', [
  'Cargo máximo da equipe de eventos',
  'Primeiro passo dentro da gestão e formação de liderança',
  'Função externa sem ligação com Social/Manager',
  'Cargo automático para quem faz live'
], 1);

addS('Creator Líder', 'Em uma situação prática: o Creator Líder é formado por quais bases?', [
  'Gestor e Coordenação apenas',
  'Equipe Social Medias e Equipe Manager',
  'Resp Líder e Resp Influ',
  'Staff e Marketing'
], 1);

addS('Social Médias', 'Em uma situação prática: a Social Media constrói a experiência porque cuida de:', [
  'Apenas convites de líderes e facções',
  'Eventos, cronogramas, premiações, hall da fama e registros',
  'Punições da cidade e denúncias gerais',
  'Somente roupas pessoais dos membros'
], 1);

addS('Social Médias', 'Em uma situação prática: a escolha dos eventos importa porque eles existem para:', [
  'Distribuir prêmio sem estratégia',
  'Movimentar cidades, gerar retenção e entretenimento',
  'Aumentar cargos automaticamente',
  'Substituir presença da liderança'
], 1);

addS('Social Médias', 'Em uma situação prática: a regra de repetição do cronograma impede repetir:', [
  'Qualquer evento que já aconteceu no mês',
  'Mesmo evento, mesma cidade e mesmo dia da semana anterior',
  'Qualquer cidade usada por outra equipe',
  'Qualquer premiação com VIP'
], 1);

addS('Social Médias', 'Em uma situação prática: após eventos, o registro de presença/poderes serve para:', [
  'Apenas mostrar quem ganhou o evento',
  'Criar histórico da atuação da equipe',
  'Substituir pagamento e hall da fama',
  'Evitar que Managers precisem registrar orgs'
], 1);

addS('Manager', 'Em uma situação prática: a missão central do Manager é:', [
  'Criar sozinho todos os cronogramas',
  'Garantir organizações presentes nos eventos',
  'Aplicar punição em organização ausente',
  'Montar hall da fama das cidades'
], 1);

addS('Manager', 'Em uma situação prática: o Manager deve confirmar participação com:', [
  'Qualquer membro que responda rápido',
  'Liderança oficial da organização',
  'Terceiros que conhecem a facção',
  'Apenas prints antigos de presença'
], 1);

addS('Manager', 'Em uma situação prática: registrar organização sem confirmação direta do líder é:', [
  'Aceitável se muitos membros prometerem ir',
  'Incorreto e fora do procedimento',
  'Correto quando o evento está vazio',
  'Permitido se for cidade Nobre'
], 1);

addS('Manager', 'Em uma situação prática: a relação correta entre Social Media e Manager é:', [
  'Manager substitui Social quando há pouco contingente',
  'Social cria o evento e Manager leva participantes',
  'Social cuida apenas de imagem e Manager de tudo',
  'São áreas rivais com objetivos opostos'
], 1);

addS('Gestor', 'Em uma situação prática: o Gestor existe principalmente para:', [
  'Produzir tudo sozinho para ganhar pontos',
  'Desenvolver pessoas em formação',
  'Substituir permanentemente Coordenação',
  'Aprovar premiação sem supervisão'
], 1);

addS('Gestor', 'Em uma situação prática: um Gestor obrigatoriamente veio de:', [
  'Creator recém-entrado sem área',
  'Social Media ou Manager Creators',
  'Resp Influ ou Resp Creators',
  'Qualquer staff externa'
], 1);

addS('Gestor', 'Em uma situação prática: o Gestor ensina principalmente membros em fase:', [
  'De Resp Creators, já no topo',
  'Inicial/GI 5, que ainda estão aprendendo',
  'Externa à SantaCreators',
  'Sem vínculo com a empresa'
], 1);

addS('Gestor', 'Em uma situação prática: um feedback útil precisa conter:', [
  'Apenas elogio curto para motivar',
  'Pontos fortes, dificuldades, evolução, comportamento e desempenho',
  'Somente crítica sem contexto',
  'Uma frase genérica para economizar tempo'
], 1);

addS('Coordenação', 'Em uma situação prática: o Coord enxerga a operação de forma:', [
  'Limitada apenas à área de origem',
  'Completa, atravessando Social, Manager e Gestor',
  'Exclusiva de punições disciplinares',
  'Voltada apenas a premiações VIP'
], 1);

addS('Coordenação', 'Em uma situação prática: quando falta alguém em uma área, o Coord deve:', [
  'Cancelar a área até o responsável voltar',
  'Assumir temporariamente sem centralizar para sempre',
  'Fazer tudo sozinho permanentemente',
  'Ignorar se não for sua área favorita'
], 1);

addS('Coordenação', 'Em uma situação prática: o Coord não deve centralizar tudo porque o objetivo é:', [
  'Mostrar que só ele trabalha bem',
  'Fortalecer equipes, não substituir equipes permanentemente',
  'Impedir Gestores de ensinar',
  'Concentrar pontos em uma pessoa'
], 1);

addS('Coordenação', 'Em uma situação prática: a diferença mais clara entre Gestor e Coord é:', [
  'Gestor manda mais que Coord em eventos',
  'Gestor foca evolução do membro; Coord foca funcionamento da equipe',
  'Coord só registra e Gestor só pune',
  'Não existe diferença prática'
], 1);

addS('Responsáveis', 'Em uma situação prática: o Resp Líder acompanha principalmente:', [
  'Apenas o próprio desempenho individual',
  'Liderança, desenvolvimento, registros e evolução da equipe',
  'Somente skins e comandos de F8',
  'Apenas pagamentos de VIP'
], 1);

addS('Responsáveis', 'Em uma situação prática: o Resp Líder não deve simplesmente executar tudo porque precisa:', [
  'Evitar qualquer contato com a base',
  'Ensinar, orientar, acompanhar e formar líderes',
  'Ficar somente em call de diretoria',
  'Delegar tudo sem acompanhar'
], 1);

addS('Responsáveis', 'Em uma situação prática: o Resp Influ tem foco em:', [
  'Apenas cronograma visual de eventos',
  'Estabilidade, disciplina, organização e funcionamento da gestão',
  'Somente criação de roupas e imagens',
  'Substituir todos os Managers'
], 1);

addS('Responsáveis', 'Em uma situação prática: o Resp Creators é responsável por:', [
  'Apenas presença em evento de sábado',
  'Supervisão completa, estratégia, premiações e decisões importantes',
  'Somente registro de organizações',
  'Função decorativa acima do Coord'
], 1);

addS('Tiers', 'Em uma situação prática: o tier mede principalmente:', [
  'Quantidade de horas online sem qualidade',
  'Maturidade, liderança, autonomia, responsabilidade e visão de gestão',
  'Apenas número de eventos vencidos',
  'Somente cargo atual no Discord'
], 1);

addS('Tiers', 'Em uma situação prática: duas pessoas com o mesmo cargo podem ter tiers diferentes porque:', [
  'O sistema sorteia tiers por antiguidade',
  'Tier representa qualidade de liderança, não só cargo',
  'Tier depende apenas de amizade com responsável',
  'Cargo e tier são exatamente a mesma coisa'
], 1);

addS('Tiers', 'Em uma situação prática: a ordem correta dos tiers é:', [
  'T5 > T1 > Teste > T3 > T2',
  'Teste > T1 > T2 > T3 > T4 > T5',
  'T1 > Teste > T5 > T4 > T2',
  'Coord > Creator > T1 > Resp'
], 1);

addS('Tiers', 'Em uma situação prática: o T5 representa alguém com:', [
  'Apenas mais pontos no mês atual',
  'Visão estratégica, autonomia completa e preparo para liderança máxima',
  'Permissão para ignorar registros',
  'Cargo de entrada em teste'
], 1);

addS('Registros', 'Em uma situação prática: os dashboards existem para:', [
  'Substituir completamente avaliação humana',
  'Transformar registros em informações visuais de acompanhamento',
  'Mostrar apenas quem está online no Discord',
  'Guardar punições sem relação com produtividade'
], 1);

addS('Registros', 'Em uma situação prática: o ranking geral deve ser entendido como:', [
  'Prova absoluta de quem deve ser promovido sempre',
  'Indicador de contribuição e produtividade, sem substituir qualidade',
  'Sistema apenas estético sem utilidade',
  'Lista de quem tem mais cargo'
], 1);

addS('Registros', 'Em uma situação prática: um evento bem executado costuma gerar:', [
  'Apenas print do vencedor e fim',
  'Pagamento, hall da fama, poderes, pontuação e dashboard',
  'Somente convite de organização',
  'Nenhum registro se todos estavam em call'
], 1);

addS('Registros', 'Em uma situação prática: a liderança toma decisões melhores quando possui:', [
  'Opiniões soltas sem comprovação',
  'Histórico, registros, números e dashboards',
  'Apenas mensagens privadas antigas',
  'Impressões de quem fala mais alto'
], 1);

addS('Horários', 'Em uma situação prática: o bate ponto atual da SantaCreators funciona em quais janelas?', [
  '17:00 às 23:00 e 01:00 às 04:00',
  '19:00 às 00:00 e 00:30 às 03:30',
  '18:00 às 23:00 e 00:00 às 03:00',
  'Somente 19:00 às 23:00'
], 1);

addS('Horários', 'Em uma situação prática: sobre eventos da SantaCreators, a regra atual deixou de ser:', [
  'Uma operação com planejamento semanal',
  'Um horário fixo simples de 19:00 para tudo',
  'Uma agenda ligada às cidades da operação',
  'Uma estrutura com registros e responsáveis'
], 1);

addS('Horários', 'Em uma situação prática: na operação atual, segunda-feira tem como cidade principal:', [
  'Grande',
  'Maresia',
  'Santa',
  'Nobre'
], 1);

addS('Horários', 'Em uma situação prática: na operação atual, terça-feira tem como cidade principal:', [
  'Maresia',
  'Grande',
  'Santa',
  'Nobre'
], 1);

addS('Horários', 'Em uma situação prática: na operação atual, quarta-feira tem como cidade principal:', [
  'Nobre',
  'Santa',
  'Grande',
  'Maresia'
], 1);

addS('Horários', 'Em uma situação prática: na operação atual, quinta, sexta e sábado concentram-se principalmente em:', [
  'Santa',
  'Nobre',
  'Maresia',
  'Grande'
], 1);

addS('Horários', 'Em uma situação prática: a Nobre é tratada como centro operacional porque:', [
  'É a única cidade onde existe SantaCreators',
  'Concentra eventos importantes, especialmente de retenção',
  'Não precisa de registros por ser principal',
  'Substitui todas as demais cidades'
], 1);

addS('Horários', 'Em uma situação prática: quando a liderança não puder acompanhar a operação, deve:', [
  'Avisar apenas depois se alguém cobrar',
  'Justificar previamente no fluxo correto e dentro do prazo',
  'Pedir para um membro comum esconder a falta',
  'Ignorar se tiver feito pontos na semana'
], 1);

addS('Conduta', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Reunir membros para conviver sem processo interno',
  'Ser apenas uma empresa de eventos com prédio próprio',
  'Criar conteúdo, entretenimento, experiências e desenvolver pessoas',
  'Funcionar como uma staff informal da cidade'
], 2);

addS('Conduta', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'A empresa só aceita pessoas famosas ou influenciadores grandes',
  'A empresa possui menos regras por ser criativa',
  'A empresa possui cultura, processo, desenvolvimento e responsabilidade',
  'A empresa existe apenas para entregar premiações'
], 2);

addS('Conduta', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Amizade com liderança e tempo parado em call',
  'Apenas quantidade de seguidores e clips postados',
  'Participação, postura, responsabilidade e constância',
  'Saber todos os comandos antes de entrar'
], 2);

addS('Conduta', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Receber cargo por não precisar de acompanhamento',
  'Ser promovida mais rápido por ter talento natural',
  'Evoluir menos que alguém presente e comprometido',
  'Entrar direto na gestaoinfluencer'
], 2);

addS('Organização', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Fazer apenas eventos sem revisar nada',
  'Aplicar punições antigas e zerar todas as regras',
  'Planejamento, revisão de cronogramas, organização e preparação',
  'Cancelar demandas da semana anterior'
], 2);

addS('Organização', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Registro é opcional quando a tarefa foi bem feita',
  'Só vale registrar quando alguém da liderança cobrar',
  'O trabalho precisa de comprovação, histórico e documentação',
  'A fala em call substitui qualquer registro'
], 2);

addS('Organização', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Porque apenas responsáveis podem conversar no privado',
  'Porque DM nunca deve ser usada em nenhuma situação',
  'Para manter transparência, histórico e evitar mal-entendidos',
  'Porque registro só importa em casos de punição'
], 2);

addS('Organização', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Resolver em conversa paralela sem deixar histórico',
  'Pular direto para o Owner em qualquer situação simples',
  'Procurar liderança direta, coordenação ou responsáveis conforme a necessidade',
  'Comentar com terceiros até alguém resolver'
], 2);

addS('Imersão', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Usar comandos de F8 para resolver cenas rapidamente',
  'Falar o mínimo possível durante qualquer cena',
  'Agir de forma coerente com o universo do personagem',
  'Evitar participar de RP com desconhecidos'
], 2);

addS('Imersão', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Meu Discord bugou, espera eu reconectar',
  'Meu teclado parou e preciso reiniciar o PC',
  'Vou meditar um pouco e já volto quando estiver melhor',
  'Vou no banheiro rapidinho, segura aí'
], 2);

addS('Imersão', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Permissão administrativa automática',
  'Apenas estilo de gameplay',
  'Anti-RP',
  'RP criativo sem limite'
], 2);

addS('Imersão', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Rir no personagem falando de Discord e teclado',
  'Parar tudo e explicar o bug para todos',
  'Contornar com criatividade sem trazer o off diretamente',
  'Usar poder para corrigir sem registrar nada'
], 2);

addS('Uniforme', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Apenas estar com cargo no Discord',
  'Qualquer peça escura parecida com uniforme',
  'Jaqueta oficial da SantaCreators',
  'Uma peça da empresa, mesmo sem jaqueta'
], 2);

addS('Uniforme', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Ficar identificado apenas se houver evento',
  'Usar obrigatoriamente o uniforme completo',
  'Usar pelo menos uma peça oficial da empresa',
  'Usar qualquer roupa desde que esteja em call'
], 2);

addS('Uniforme', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Impede o sistema de contar pontos automaticamente',
  'Só atrapalha quando há transmissão ao vivo',
  'Afeta imagem, organização e reconhecimento da empresa',
  'É proibido apenas para membros novos'
], 2);

addS('Uniforme', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Permissão para usar veículos em qualquer RP',
  'Vantagem hierárquica para mandar em outros players',
  'Identidade, pertencimento e responsabilidade ao representar a empresa',
  'Obrigação estética sem relação com cultura'
], 2);

addS('Veículos', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Substituir qualquer garagem pessoal do membro',
  'Troca de tiro, assalto e ações pessoais rápidas',
  'Eventos, operações e deslocamentos relacionados à empresa',
  'Emprestar para aliados de fora da empresa'
], 2);

addS('Veículos', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Só vira erro quando alguém grava em vídeo',
  'É permitido se o membro estiver sem uniforme',
  'Expõe a imagem e desvia a finalidade do recurso',
  'É uma escolha individual sem efeito na empresa'
], 2);

addS('Veículos', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Permitido quando o veículo é da própria empresa',
  'Uma forma aceitável de agilizar eventos',
  'Falha grave de conduta e abuso de poder',
  'Apenas quebra leve se não houver combate'
], 2);

addS('Veículos', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Priorizar benefício pessoal se estiver com pressa',
  'Usar o máximo possível antes que outro use',
  'Zelo, responsabilidade e cuidado com o patrimônio coletivo',
  'Pedir desculpa apenas se alguém perceber'
], 2);

addS('Baús', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Usar livremente se a pessoa tiver cargo alto',
  'Retirar bastante para garantir estoque pessoal',
  'Usar com consciência, controle e finalidade correta',
  'Pegar primeiro e justificar depois'
], 2);

addS('Baús', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Guardar itens pessoais de responsáveis',
  'Consumo livre dos membros mais ativos',
  'Doações e entregas ligadas à operação',
  'Venda particular sem divisão'
], 2);

addS('Baús', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Retira para revender e depois repor se lembrar',
  'Garante estoque individual para a semana toda',
  'Pega apenas o necessário e não prejudica os demais',
  'É feita sem pensar no coletivo'
], 2);

addS('Baús', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Porque só pode retirar depois das 23:30',
  'Porque apenas novatos são proibidos de retirar',
  'Porque desvia a finalidade de doações e entregas',
  'Porque o baú serve para lucro pessoal'
], 2);

addS('Poderes', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Quem tem poder pode corrigir qualquer RP na hora',
  'Poder serve para facilitar a vida do membro',
  'Poder é responsabilidade, não privilégio pessoal',
  'Poder substitui registro quando usado corretamente'
], 2);

addS('Poderes', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Apoio informal permitido',
  'Autonomia de gestão',
  'Abuso de poder',
  'Erro leve sem impacto'
], 2);

addS('Poderes', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Evitar registrar para não gerar confusão',
  'Usar primeiro e explicar no registro',
  'Perguntar antes e validar o contexto',
  'Pedir para um amigo confirmar'
], 2);

addS('Poderes', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Permissão para usar comandos fora da empresa',
  'Apenas contagem automática de dinheiro',
  'Transparência, controle e responsabilidade',
  'Substituição de qualquer alinhamento'
], 2);

addS('GI', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Equipe separada que funciona independente da empresa',
  'Staff da cidade voltada a punir jogadores',
  'Núcleo interno administrativo da própria SantaCreators',
  'Cargo único entregue por formulário'
], 2);

addS('GI', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Tempo de Discord sem atuação prática',
  'Pedido direto em formulário público',
  'Evolução, confiança, participação e convite',
  'Indicação de amizade sem observação'
], 2);

addS('GI', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Controlar a cidade como staff administrativa',
  'Distribuir cargos e poderes para quem pedir',
  'Formar pessoas capazes de fortalecer a SantaCreators',
  'Separar a gestão do restante da empresa'
], 2);

addS('GI', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Ser observado pela liderança',
  'Ter responsabilidades maiores que antes',
  'Ter acesso total a todas as permissões',
  'Precisar manter postura'
], 2);

addS('Hierarquia', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Coord Creators',
  'Resp Líder',
  'Creator',
  'Social Media e Manager'
], 2);

addS('Hierarquia', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Somente Creator e Creator Líder',
  'Apenas Resp Influ e Resp Creators',
  'Social Medias, Manager, Gestor e Coord',
  'Todos os membros sem função'
], 2);

addS('Hierarquia', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Área exclusiva dos Managers',
  'Base de entrada da empresa',
  'Responsáveis da liderança operacional',
  'Equipe temporária de eventos'
], 2);

addS('Hierarquia', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Social > Creator > Gestor > Resp Creators',
  'Creator > Responsável > Manager > Social > Coord',
  'Creator > Creator Líder > Social/Manager > Gestor > Coord > Responsáveis',
  'Manager > Creator > Resp Influ > Equipe Social'
], 2);

addS('Creator', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Serve somente para preencher lista de membros',
  'É apenas um cargo decorativo antes da gestão',
  'Sustenta comunidade, movimentação, crescimento e retenção',
  'Recebe todas as permissões administrativas'
], 2);

addS('Creator', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Escolher cargo alto logo na entrada',
  'Cobrar promoção antes de participar',
  'Demonstrar interesse, participação e vontade de aprender',
  'Focar apenas em premiação'
], 2);

addS('Creator Líder', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Função externa sem ligação com Social/Manager',
  'Cargo máximo da equipe de eventos',
  'Primeiro passo dentro da gestão e formação de liderança',
  'Cargo automático para quem faz live'
], 2);

addS('Creator Líder', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Resp Líder e Resp Influ',
  'Gestor e Coordenação apenas',
  'Equipe Social Medias e Equipe Manager',
  'Staff e Marketing'
], 2);

addS('Social Médias', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Punições da cidade e denúncias gerais',
  'Apenas convites de líderes e facções',
  'Eventos, cronogramas, premiações, hall da fama e registros',
  'Somente roupas pessoais dos membros'
], 2);

addS('Social Médias', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Aumentar cargos automaticamente',
  'Distribuir prêmio sem estratégia',
  'Movimentar cidades, gerar retenção e entretenimento',
  'Substituir presença da liderança'
], 2);

addS('Social Médias', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Qualquer cidade usada por outra equipe',
  'Qualquer evento que já aconteceu no mês',
  'Mesmo evento, mesma cidade e mesmo dia da semana anterior',
  'Qualquer premiação com VIP'
], 2);

addS('Social Médias', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Substituir pagamento e hall da fama',
  'Apenas mostrar quem ganhou o evento',
  'Criar histórico da atuação da equipe',
  'Evitar que Managers precisem registrar orgs'
], 2);

addS('Manager', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Aplicar punição em organização ausente',
  'Criar sozinho todos os cronogramas',
  'Garantir organizações presentes nos eventos',
  'Montar hall da fama das cidades'
], 2);

addS('Manager', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Terceiros que conhecem a facção',
  'Qualquer membro que responda rápido',
  'Liderança oficial da organização',
  'Apenas prints antigos de presença'
], 2);

addS('Manager', 'Qual alternativa parece parecida, mas representa a conduta correta sobre este tema?', [
  'Correto quando o evento está vazio',
  'Aceitável se muitos membros prometerem ir',
  'Incorreto e fora do procedimento',
  'Permitido se for cidade Nobre'
], 2);

// ===================================================================
// 500 PERGUNTAS — EVENTOS DA SANTA CREATORS
// ===================================================================

const SC_EVENT_QUESTION_VARIATIONS = [
  (f) => `Qual alternativa está correta sobre ${f.assunto}?`,
  (f) => `De acordo com as regras dos eventos, o que é correto sobre ${f.assunto}?`,
  (f) => `No quiz da Santa Creators, como deve ser respondida esta questão sobre ${f.assunto}?`,
  (f) => `Considerando o cronograma e as regras atuais, qual informação sobre ${f.assunto} está correta?`,
  (f) => `Qual opção descreve corretamente ${f.assunto}?`
];

const SC_EVENT_FACTS = [
  {
    categoria: 'Eventos — Agenda',
    assunto: 'a segunda-feira às 21:00',
    correta: 'O evento ocorre na Cidade Maresia',
    erradas: [
      'O evento ocorre na Cidade Grande',
      'O evento ocorre na Cidade Santa',
      'O evento ocorre na Cidade Nobre'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'o evento de segunda-feira às 21:00',
    correta: 'É o Maresia do Crime',
    erradas: [
      'É o Nobre do Crime',
      'É o Santa do Crime',
      'É o Grande do Crime'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'a segunda-feira às 23:30',
    correta: 'O evento ocorre na Cidade Grande',
    erradas: [
      'O evento ocorre na Cidade Nobre',
      'O evento ocorre na Cidade Santa',
      'O evento ocorre na Cidade Maresia'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'o evento de segunda-feira às 23:30',
    correta: 'É a Missão Pântano na Cidade Grande',
    erradas: [
      'É a Missão Rosa na Cidade Nobre',
      'É o Santa do Crime na Cidade Santa',
      'É o Maresia do Crime na Cidade Maresia'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'a terça-feira às 21:00',
    correta: 'O evento ocorre na Cidade Santa',
    erradas: [
      'O evento ocorre na Cidade Grande',
      'O evento ocorre na Cidade Nobre',
      'O evento ocorre na Cidade Maresia'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'o evento de terça-feira às 21:00',
    correta: 'É a Missão Pântano na Cidade Santa',
    erradas: [
      'É a Missão Rosa na Cidade Nobre',
      'É o Grande do Crime na Cidade Grande',
      'É o Maresia do Crime na Cidade Maresia'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'a terça-feira às 23:30',
    correta: 'O evento ocorre na Cidade Grande',
    erradas: [
      'O evento ocorre na Cidade Santa',
      'O evento ocorre na Cidade Nobre',
      'O evento ocorre na Cidade Maresia'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'o evento de terça-feira às 23:30',
    correta: 'É o Grande do Crime',
    erradas: [
      'É o Nobre do Crime',
      'É o Santa do Crime',
      'É o Maresia do Crime'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'a quarta-feira às 21:00',
    correta: 'O evento ocorre na Cidade Santa',
    erradas: [
      'O evento ocorre na Cidade Grande',
      'O evento ocorre na Cidade Nobre',
      'O evento ocorre na Cidade Maresia'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'o evento de quarta-feira às 21:00',
    correta: 'É o Santa do Crime',
    erradas: [
      'É o Grande do Crime',
      'É o Nobre do Crime',
      'É o Maresia do Crime'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'a quarta-feira às 23:30',
    correta: 'O evento ocorre na Cidade Maresia',
    erradas: [
      'O evento ocorre na Cidade Santa',
      'O evento ocorre na Cidade Grande',
      'O evento ocorre na Cidade Nobre'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'o Socializar da agenda fixa',
    correta: 'Acontece na quarta-feira às 23:30, na Cidade Maresia',
    erradas: [
      'Acontece na segunda-feira às 21:00, na Cidade Santa',
      'Acontece na sexta-feira às 23:30, na Cidade Grande',
      'Acontece no domingo às 21:00, na Cidade Nobre'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'a quinta-feira às 21:00',
    correta: 'O evento ocorre na Cidade Nobre',
    erradas: [
      'O evento ocorre na Cidade Grande',
      'O evento ocorre na Cidade Santa',
      'O evento ocorre na Cidade Maresia'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'o evento fixo de quinta-feira',
    correta: 'É a Missão Rosa com dois veículos',
    erradas: [
      'É a Missão Rosa Bônus com quatro veículos',
      'É o Nobre do Crime',
      'É a Missão Pântano'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'a sexta-feira às 21:00',
    correta: 'O evento ocorre na Cidade Nobre',
    erradas: [
      'O evento ocorre na Cidade Grande',
      'O evento ocorre na Cidade Santa',
      'O evento ocorre na Cidade Maresia'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'o evento fixo de sexta-feira',
    correta: 'É a Missão Pântano na Cidade Nobre',
    erradas: [
      'É a Missão Rosa Bônus',
      'É o Nobre do Crime',
      'É o Grande do Crime'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'o sábado às 21:00',
    correta: 'O Nobre do Crime acontece na Cidade Nobre',
    erradas: [
      'O Grande do Crime acontece na Cidade Grande',
      'O Santa do Crime acontece na Cidade Santa',
      'O Maresia do Crime acontece na Cidade Maresia'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'o evento fixo de sábado',
    correta: 'É o Nobre do Crime',
    erradas: [
      'É a Missão Pântano',
      'É a Missão Rosa de dois veículos',
      'É o Socializar'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'o domingo às 21:00',
    correta: 'A Missão Rosa Bônus ocorre na Cidade Nobre',
    erradas: [
      'A Missão Pântano ocorre na Cidade Grande',
      'O Santa do Crime ocorre na Cidade Santa',
      'O Socializar ocorre na Cidade Maresia'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'a Missão Rosa de domingo',
    correta: 'Possui quatro veículos rosa',
    erradas: [
      'Possui somente um veículo rosa',
      'Possui dois veículos rosa',
      'Não possui veículos rosa'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'a Missão Rosa de quinta-feira',
    correta: 'Possui dois veículos rosa',
    erradas: [
      'Possui quatro veículos rosa',
      'Possui seis veículos rosa',
      'Não possui veículos rosa'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'os eventos das 23:30 de segunda e terça',
    correta: 'Acontecem na Cidade Grande',
    erradas: [
      'Acontecem na Cidade Nobre',
      'Acontecem na Cidade Santa',
      'Acontecem na Cidade Maresia'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'o horário fixo da Cidade Grande',
    correta: 'É 23:30, na segunda e na terça-feira',
    erradas: [
      'É 21:00, na quinta e na sexta-feira',
      'É 19:00, em todos os dias',
      'É 00:00, no sábado e no domingo'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'o horário fixo da Cidade Santa',
    correta: 'É 21:00, na terça e na quarta-feira',
    erradas: [
      'É 23:30, na segunda e na terça-feira',
      'É 19:00, no sábado e no domingo',
      'É 00:00, na quinta e na sexta-feira'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'os horários da Cidade Maresia',
    correta: 'São alternados entre 21:00 e 23:30',
    erradas: [
      'São sempre às 19:00',
      'São sempre às 23:30',
      'São sempre à 01:00'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'os eventos de quinta a domingo',
    correta: 'Acontecem às 21:00 na Cidade Nobre',
    erradas: [
      'Acontecem às 23:30 na Cidade Grande',
      'Acontecem às 19:00 na Cidade Santa',
      'Acontecem à 01:00 na Cidade Maresia'
    ]
  },
  {
    categoria: 'Eventos — Agenda',
    assunto: 'os horários das 23:30 entre quinta e domingo',
    correta: 'Não existem na agenda fixa informada',
    erradas: [
      'Existem todos os dias na Cidade Grande',
      'Existem somente no sábado',
      'Existem somente no domingo'
    ]
  },
  {
    categoria: 'Eventos — Identidade',
    assunto: 'a proposta dos eventos da Santa Creators',
    correta: 'Criar experiências interativas, dinâmicas e diferentes',
    erradas: [
      'Copiar exatamente as ações normais da cidade',
      'Realizar somente corridas sem interação',
      'Fazer eventos sem regras ou organização'
    ]
  },
  {
    categoria: 'Eventos — Identidade',
    assunto: 'a experiência buscada nos eventos',
    correta: 'Deve ser divertida, interessante e interativa',
    erradas: [
      'Deve ser repetitiva e previsível',
      'Deve excluir a interação dos participantes',
      'Deve acontecer sem dinâmica ou objetivo'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'a entrada nos eventos do tipo Crime',
    correta: 'Os participantes entram no Mundo Royale pelo F8',
    erradas: [
      'Os participantes entram apenas pelo F3',
      'Os participantes devem entrar pelo hospital',
      'Os participantes entram automaticamente pela garagem'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'o limite de entrada nos eventos do tipo Crime das 21:00',
    correta: 'A orientação é entrar no Mundo Royale até 20:50',
    erradas: [
      'A orientação é entrar somente depois das 21:10',
      'A orientação é entrar até 19:00',
      'Não existe preparação antes do evento'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'o limite de entrada no Grande do Crime',
    correta: 'A orientação é entrar no Mundo Royale até 23:20',
    erradas: [
      'A orientação é entrar até 20:50',
      'A orientação é entrar depois de 00:00',
      'A orientação é entrar somente às 22:00'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'o início do combate nos eventos do tipo Crime',
    correta: 'É proibido matar antes do FF',
    erradas: [
      'O combate começa assim que cada pessoa entra',
      'É permitido matar durante a organização inicial',
      'O combate começa dez minutos antes do horário'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'VDM e RDM nos eventos do tipo Crime',
    correta: 'São permitidos durante o combate liberado',
    erradas: [
      'São sempre proibidos durante todo o evento',
      'Apenas o VDM é permitido',
      'Apenas o RDM é permitido'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'as armas nos eventos do tipo Crime',
    correta: 'Todas as armas de fogo estão liberadas',
    erradas: [
      'Somente armas brancas são permitidas',
      'Nenhuma arma pode ser utilizada',
      'Somente pistolas sem munição são permitidas'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'as binds nos eventos do tipo Crime',
    correta: 'As binds são liberadas',
    erradas: [
      'As binds são proibidas em todas as fases',
      'Somente a administração pode usar bind',
      'Bind causa eliminação automática'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'o uso de drogas nos eventos do tipo Crime',
    correta: 'As drogas são liberadas',
    erradas: [
      'Todas as drogas são proibidas',
      'Somente água pode ser utilizada',
      'O uso de qualquer droga encerra a participação'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'a regra após morrer nos eventos do tipo Crime',
    correta: 'Quem morreu não pode voltar',
    erradas: [
      'Quem morreu pode retornar imediatamente',
      'Quem morreu retorna após cinco minutos',
      'Quem morreu pode voltar usando outro veículo'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'os veículos nos eventos do tipo Crime',
    correta: 'Somente os veículos pessoais dos participantes podem ser usados',
    erradas: [
      'Qualquer veículo spawnado é permitido',
      'Somente veículos policiais podem ser usados',
      'Nenhum participante pode usar seu próprio veículo'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'o momento de guardar os veículos nos eventos do tipo Crime',
    correta: 'Os veículos são guardados no final',
    erradas: [
      'Os veículos são guardados antes do FF',
      'Os veículos são apagados no início',
      'Os veículos devem ser abandonados fora da safe'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'a movimentação pelos prédios nos eventos do tipo Crime',
    correta: 'É permitido utilizar teto, chão e elevadores',
    erradas: [
      'É permitido permanecer somente no chão',
      'Elevadores sempre causam desclassificação',
      'É proibido entrar em qualquer prédio'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'a participação individual ou em grupo',
    correta: 'É possível jogar sozinho ou em grupo',
    erradas: [
      'Somente grupos de dez pessoas podem participar',
      'Somente jogadores individuais podem participar',
      'A participação em grupo é sempre proibida'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'a condição de vitória nos eventos do tipo Crime',
    correta: 'Os últimos jogadores vivos vencem',
    erradas: [
      'Vence quem entrar primeiro no mundo',
      'Vence quem tiver o veículo mais caro',
      'Vence quem sair da safe primeiro'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'a safe nos eventos do tipo Crime',
    correta: 'A safe fecha durante o evento',
    erradas: [
      'A safe permanece aberta para sempre',
      'Não existe limite de combate',
      'A safe só abre depois que o evento termina'
    ]
  },
  {
    categoria: 'Evento — Crime',
    assunto: 'a toxicidade e o abuso de bugs',
    correta: 'São proibidos',
    erradas: [
      'São liberados após o FF',
      'São permitidos para quem estiver sozinho',
      'São incentivados pela organização'
    ]
  },
  {
    categoria: 'Evento — Missão Pântano',
    assunto: 'o terreno principal da Missão Pântano',
    correta: 'A batalha acontece na região do pântano',
    erradas: [
      'A batalha acontece somente em prédios',
      'A batalha acontece em uma pista de corrida',
      'A batalha acontece dentro de navios'
    ]
  },
  {
    categoria: 'Evento — Missão Pântano',
    assunto: 'as armas da Missão Pântano',
    correta: 'Todas as armas de fogo são liberadas',
    erradas: [
      'Somente lanternas são permitidas',
      'Somente tacos de golfe são permitidos',
      'Armas de fogo são proibidas'
    ]
  },
  {
    categoria: 'Evento — Missão Pântano',
    assunto: 'o uso de veículos na Missão Pântano',
    correta: 'É proibido utilizar veículos',
    erradas: [
      'É obrigatório utilizar motocicletas',
      'Somente helicópteros são permitidos',
      'Qualquer veículo pessoal é permitido'
    ]
  },
  {
    categoria: 'Evento — Missão Pântano',
    assunto: 'o deslocamento durante a Missão Pântano',
    correta: 'O trajeto deve ser realizado inteiramente a pé',
    erradas: [
      'O trajeto deve ser feito de navio',
      'O trajeto deve ser feito de motocicleta',
      'O trajeto deve ser feito em carros pessoais'
    ]
  },
  {
    categoria: 'Evento — Missão Pântano',
    assunto: 'o perímetro da Missão Pântano',
    correta: 'Quem ultrapassar o perímetro fica fora da guerra',
    erradas: [
      'Quem ultrapassar o perímetro vence automaticamente',
      'O perímetro pode ser ignorado',
      'Sair do pântano concede uma vida extra'
    ]
  },
  {
    categoria: 'Evento — Missão Pântano',
    assunto: 'a roupa na Missão Pântano',
    correta: 'Trocar ou alterar a roupa pode causar eliminação',
    erradas: [
      'Trocar de roupa é obrigatório durante o combate',
      'Cada eliminação exige uma roupa diferente',
      'A roupa não possui relação com as regras'
    ]
  },
  {
    categoria: 'Evento — Missão Pântano',
    assunto: 'as equipes na Missão Pântano',
    correta: 'Os participantes podem formar equipes e lutar com aliados',
    erradas: [
      'É proibido conversar com qualquer aliado',
      'Todos devem lutar obrigatoriamente sozinhos',
      'Somente a administração pode formar equipes'
    ]
  },
  {
    categoria: 'Evento — Missão Pântano',
    assunto: 'a estratégia de terreno da Missão Pântano',
    correta: 'É possível usar a lama, a escuridão e esconderijos',
    erradas: [
      'É obrigatório permanecer em uma estrada iluminada',
      'É proibido se esconder',
      'Todos devem permanecer no mesmo ponto'
    ]
  },
  {
    categoria: 'Evento — Missão Rosa',
    assunto: 'o objetivo principal da Missão Rosa',
    correta: 'Sobreviver próximo a um dos veículos rosa',
    erradas: [
      'Destruir todos os veículos rosa',
      'Levar o veículo rosa até uma garagem',
      'Vender o veículo rosa durante o evento'
    ]
  },
  {
    categoria: 'Evento — Missão Rosa',
    assunto: 'a entrada nos veículos rosa',
    correta: 'É proibido entrar nos veículos',
    erradas: [
      'É obrigatório dirigir os veículos',
      'Somente o líder da tropa pode entrar',
      'É permitido fugir com os veículos'
    ]
  },
  {
    categoria: 'Evento — Missão Rosa',
    assunto: 'o uso dos veículos rosa como proteção',
    correta: 'Eles podem ser usados como cover, defesa ou distração',
    erradas: [
      'Eles devem ser usados como transporte',
      'Eles não podem ser aproximados',
      'Eles precisam ser destruídos antes da final'
    ]
  },
  {
    categoria: 'Evento — Missão Rosa',
    assunto: 'carregar outro jogador',
    correta: 'É proibido carregar outro jogador',
    erradas: [
      'É obrigatório carregar um aliado',
      'É permitido carregar somente o líder',
      'Carregar concede vantagem na pontuação'
    ]
  },
  {
    categoria: 'Evento — Missão Rosa',
    assunto: 'o comando ou ação de carregar',
    correta: 'Usar /carregar, forçar no H ou explorar bug causa desclassificação',
    erradas: [
      'Usar /carregar é obrigatório na fase final',
      'Forçar no H concede imunidade',
      'Explorar bug é permitido perto dos veículos'
    ]
  },
  {
    categoria: 'Evento — Missão Rosa',
    assunto: 'a adrenalina',
    correta: 'A adrenalina é proibida',
    erradas: [
      'A adrenalina é obrigatória',
      'Somente a adrenalina pode ser usada',
      'A adrenalina define o vencedor'
    ]
  },
  {
    categoria: 'Evento — Missão Rosa',
    assunto: 'as demais drogas e binds',
    correta: 'Bind e drogas podem ser usados, exceto adrenalina',
    erradas: [
      'Bind e todas as drogas são proibidos',
      'Somente adrenalina é permitida',
      'Apenas a administração pode usar drogas'
    ]
  },
  {
    categoria: 'Evento — Missão Rosa',
    assunto: 'as imagens no Fotogram',
    correta: 'Podem revelar pistas sobre a localização dos veículos',
    erradas: [
      'Servem apenas para anunciar a premiação',
      'Eliminam automaticamente quem visualizá-las',
      'Não possuem relação com o evento'
    ]
  },
  {
    categoria: 'Evento — Missão Rosa',
    assunto: 'a formação de tropas',
    correta: 'Os participantes podem organizar estratégias com suas organizações',
    erradas: [
      'É proibido participar com a organização',
      'Somente jogadores sem organização podem jogar',
      'A comunicação entre aliados causa eliminação'
    ]
  },
  {
    categoria: 'Evento — Missão Rosa',
    assunto: 'o horário normal de encerramento',
    correta: 'O evento busca terminar por volta das 22:00, sem atrasos',
    erradas: [
      'O evento termina obrigatoriamente às 19:00',
      'O evento dura apenas cinco minutos',
      'O evento termina sempre depois da meia-noite'
    ]
  },
  {
    categoria: 'Evento — Missão Rosa',
    assunto: 'a duração aproximada',
    correta: 'A duração é de aproximadamente uma hora quando não há atrasos',
    erradas: [
      'A duração é de aproximadamente dez minutos',
      'A duração é sempre de quatro horas',
      'Não existe previsão de duração'
    ]
  },
  {
    categoria: 'Evento — Missão Rosa',
    assunto: 'a definição de quem recebe a premiação da tropa',
    correta: 'A tropa precisa entrar em consenso',
    erradas: [
      'A administração escolhe uma pessoa aleatoriamente',
      'O veículo escolhe automaticamente o ganhador',
      'A premiação é obrigatoriamente dividida com todos'
    ]
  },
  {
    categoria: 'Evento — Missão Rosa',
    assunto: 'as versões do evento',
    correta: 'Pode haver versão com armas brancas ou com armas de fogo',
    erradas: [
      'O evento permite somente armas de fogo em todas as edições',
      'O evento permite somente armas brancas em todas as edições',
      'O evento nunca permite qualquer tipo de arma'
    ]
  },
  {
    categoria: 'Evento — Missão Rosa',
    assunto: 'a edição com armas brancas',
    correta: 'Todas as armas brancas ficam liberadas',
    erradas: [
      'Somente armas de fogo ficam liberadas',
      'Nenhuma arma fica liberada',
      'Somente veículos podem causar dano'
    ]
  },
  {
    categoria: 'Evento — Missão Rosa',
    assunto: 'a edição com armas de fogo',
    correta: 'Todas as armas de fogo ficam liberadas',
    erradas: [
      'Somente armas brancas ficam liberadas',
      'Somente lanternas ficam liberadas',
      'Nenhuma arma pode ser utilizada'
    ]
  },
  {
    categoria: 'Evento — Socializar',
    assunto: 'o acesso ao Socializar',
    correta: 'O convite pode ser feito pelo F3',
    erradas: [
      'O acesso é exclusivamente pelo hospital',
      'O acesso depende de comprar um veículo',
      'O acesso acontece somente pelo F8 Mundo Royale'
    ]
  },
  {
    categoria: 'Evento — Socializar',
    assunto: 'a proposta do Socializar',
    correta: 'Promover interação, diversão e desafios temáticos',
    erradas: [
      'Realizar apenas uma troca de tiros sem objetivo',
      'Impedir a comunicação entre participantes',
      'Funcionar somente como corrida de veículos'
    ]
  },
  {
    categoria: 'Evento — Socializar',
    assunto: 'a edição inspirada em Round 6',
    correta: 'Possui atividades inspiradas no universo de Round 6',
    erradas: [
      'É uma batalha exclusivamente naval',
      'É uma corrida de motocicletas',
      'É um evento sem tema definido'
    ]
  },
  {
    categoria: 'Evento — Socializar',
    assunto: 'a importância da comunicação',
    correta: 'A comunicação pode ajudar o participante a vencer',
    erradas: [
      'A comunicação é proibida durante todo o evento',
      'Quem falar é eliminado imediatamente',
      'Somente a administração pode se comunicar'
    ]
  },
  {
    categoria: 'Evento — Naval Creators',
    assunto: 'o objetivo do Naval Creators',
    correta: 'Dominar os mares e ser a última equipe viva',
    erradas: [
      'Chegar primeiro ao topo de um prédio',
      'Encontrar veículos rosa pela cidade',
      'Sobreviver dentro de um presídio'
    ]
  },
  {
    categoria: 'Evento — Naval Creators',
    assunto: 'a bind da equipe',
    correta: 'Deve ser enviada no ticket da organização até 20:30',
    erradas: [
      'Deve ser enviada depois do evento',
      'Deve ser enviada somente no chat geral',
      'Não é necessário enviar bind'
    ]
  },
  {
    categoria: 'Evento — Naval Creators',
    assunto: 'o local de preparação',
    correta: 'Os participantes devem caminhar até o Píer Sul',
    erradas: [
      'Os participantes devem ir até o hospital',
      'Os participantes devem permanecer na praça',
      'Os participantes devem ir até o presídio'
    ]
  },
  {
    categoria: 'Evento — Naval Creators',
    assunto: 'os veículos utilizados',
    correta: 'Cada equipe utiliza o navio entregue pela administração',
    erradas: [
      'Cada equipe utiliza seus carros pessoais',
      'Cada participante deve levar uma motocicleta',
      'Somente aeronaves podem ser utilizadas'
    ]
  },
  {
    categoria: 'Evento — Naval Creators',
    assunto: 'o uso de outro veículo',
    correta: 'É proibido usar outro veículo além do navio fornecido',
    erradas: [
      'Qualquer veículo aquático pode ser roubado',
      'Carros pessoais podem substituir o navio',
      'Helicópteros são obrigatórios'
    ]
  },
  {
    categoria: 'Evento — Naval Creators',
    assunto: 'a rotação antes do FF',
    correta: 'É proibido rotacionar antes do FF',
    erradas: [
      'É obrigatório rotacionar antes do FF',
      'A rotação libera uma vida extra',
      'Somente a equipe vencedora pode rotacionar'
    ]
  },
  {
    categoria: 'Evento — Naval Creators',
    assunto: 'o combate liberado',
    correta: 'Armas de fogo, bind e combate corporal são permitidos',
    erradas: [
      'Somente lanternas são permitidas',
      'Nenhum tipo de combate é permitido',
      'Somente veículos podem causar dano'
    ]
  },
  {
    categoria: 'Evento — Naval Creators',
    assunto: 'os itens de regeneração',
    correta: 'Metanfetamina, baseados, bandagens e energéticos são permitidos',
    erradas: [
      'Todos os itens de regeneração são proibidos',
      'Somente adrenalina é permitida',
      'Apenas água pode ser utilizada'
    ]
  },
  {
    categoria: 'Evento — Free Fire Creators',
    assunto: 'o cenário do Free Fire Creators',
    correta: 'A batalha acontece no topo dos prédios',
    erradas: [
      'A batalha acontece dentro de navios',
      'A batalha acontece no pântano',
      'A batalha acontece em uma pista subterrânea'
    ]
  },
  {
    categoria: 'Evento — Free Fire Creators',
    assunto: 'o F3 de preparação',
    correta: 'A divulgação informa uma janela entre 20:30 e 21:00',
    erradas: [
      'A janela ocorre somente depois das 23:30',
      'A preparação começa à 01:00',
      'Não existe convite pelo F3'
    ]
  },
  {
    categoria: 'Evento — Free Fire Creators',
    assunto: 'o combate antes da safe',
    correta: 'É proibido atirar antes de a safe iniciar',
    erradas: [
      'O combate começa imediatamente ao entrar',
      'É obrigatório eliminar alguém durante a preparação',
      'Atirar antes da safe concede pontos extras'
    ]
  },
  {
    categoria: 'Evento — Free Fire Creators',
    assunto: 'a formação de equipes',
    correta: 'É possível formar equipes ou jogar sozinho',
    erradas: [
      'Todos devem jogar obrigatoriamente sozinhos',
      'Somente organizações completas podem participar',
      'Equipes são proibidas'
    ]
  },
  {
    categoria: 'Evento — Free Fire Creators',
    assunto: 'os paraquedas',
    correta: 'São entregues pela organização',
    erradas: [
      'São proibidos durante todo o evento',
      'Devem ser comprados de outro participante',
      'Somente o vencedor recebe paraquedas'
    ]
  },
  {
    categoria: 'Evento — Free Fire Creators',
    assunto: 'o fechamento da safe',
    correta: 'A safe fecha gradualmente e força os confrontos',
    erradas: [
      'A safe aumenta até cobrir a cidade inteira',
      'A safe não muda durante o evento',
      'A safe é removida antes do combate'
    ]
  },
  {
    categoria: 'Evento — Pegando Fogo',
    assunto: 'a roupa dos participantes',
    correta: 'Todos utilizam roupa de bombeiro',
    erradas: [
      'Todos utilizam roupa de astronauta',
      'Todos utilizam roupa policial',
      'Cada pessoa deve usar roupa social'
    ]
  },
  {
    categoria: 'Evento — Pegando Fogo',
    assunto: 'a arma dos participantes',
    correta: 'A luta ocorre somente com chave inglesa',
    erradas: [
      'A luta ocorre somente com fuzil',
      'A luta ocorre somente com lanterna',
      'A luta ocorre somente com arco e flecha'
    ]
  },
  {
    categoria: 'Evento — Pegando Fogo',
    assunto: 'a atuação da equipe Santa Creators',
    correta: 'A equipe pode ficar espalhada pelo mapa e eliminar participantes',
    erradas: [
      'A equipe não pode interferir de nenhuma maneira',
      'A equipe deve permanecer fora da cidade',
      'A equipe participa somente como espectadora'
    ]
  },
  {
    categoria: 'Evento — Pegando Fogo',
    assunto: 'a safe',
    correta: 'Geralmente fecha na região dos Bombeiros',
    erradas: [
      'Fecha obrigatoriamente no Píer Sul',
      'Fecha dentro de um navio',
      'Não existe safe'
    ]
  },
  {
    categoria: 'Evento — Pegando Fogo',
    assunto: 'a fase final',
    correta: 'Os sobreviventes fazem um mata-mata até restarem três campeões',
    erradas: [
      'Todos os sobreviventes vencem sem confronto',
      'A fase final é uma corrida de barcos',
      'A fase final termina com dez vencedores'
    ]
  },
  {
    categoria: 'Evento — Rebelião Creators',
    assunto: 'o objetivo principal',
    correta: 'Encontrar e libertar o Creator preso',
    erradas: [
      'Destruir todos os veículos rosa',
      'Chegar ao topo de um prédio',
      'Vencer uma corrida de motocicletas'
    ]
  },
  {
    categoria: 'Evento — Rebelião Creators',
    assunto: 'o local do Creator sequestrado',
    correta: 'Ele está em uma das dez torres do presídio',
    erradas: [
      'Ele está em um dos navios do Píer Sul',
      'Ele está em um veículo rosa',
      'Ele está no topo de um prédio'
    ]
  },
  {
    categoria: 'Evento — Rebelião Creators',
    assunto: 'as armas de fogo',
    correta: 'São proibidas',
    erradas: [
      'São obrigatórias',
      'Somente fuzis são permitidos',
      'Somente pistolas são permitidas'
    ]
  },
  {
    categoria: 'Evento — Rebelião Creators',
    assunto: 'o combate permitido',
    correta: 'Armas brancas e combate corporal são permitidos',
    erradas: [
      'Somente armas de fogo são permitidas',
      'Nenhum combate é permitido',
      'Somente veículos podem causar dano'
    ]
  },
  {
    categoria: 'Evento — Rebelião Creators',
    assunto: 'o uso de veículos',
    correta: 'É proibido',
    erradas: [
      'É obrigatório',
      'Somente tanques podem ser usados',
      'Somente motocicletas podem ser usadas'
    ]
  },
  {
    categoria: 'Evento — Sobre Pressão',
    assunto: 'o espaço de combate',
    correta: 'Os participantes ficam sobre uma única prancha',
    erradas: [
      'Os participantes ficam dentro de vários navios',
      'Os participantes ficam em torres do presídio',
      'Os participantes ficam em veículos rosa'
    ]
  },
  {
    categoria: 'Evento — Sobre Pressão',
    assunto: 'a arma disponível',
    correta: 'Somente Karambit é permitida',
    erradas: [
      'Somente fuzil é permitido',
      'Somente chave inglesa é permitida',
      'Somente arma de fogo é permitida'
    ]
  },
  {
    categoria: 'Evento — Sobre Pressão',
    assunto: 'o uso de binds',
    correta: 'É proibido',
    erradas: [
      'É obrigatório',
      'É permitido somente para fugir da prancha',
      'Define automaticamente o vencedor'
    ]
  },
  {
    categoria: 'Evento — Sobre Pressão',
    assunto: 'a cocaína',
    correta: 'Pode ser utilizada para aumentar a velocidade',
    erradas: [
      'É proibida em qualquer situação',
      'Serve para entrar em veículos',
      'Substitui a Karambit'
    ]
  },
  {
    categoria: 'Evento — Sobre Pressão',
    assunto: 'a quantidade de vencedores',
    correta: 'Restam três competidores vencedores',
    erradas: [
      'Resta somente uma organização inteira',
      'Restam dez vencedores',
      'Todos vencem automaticamente'
    ]
  },
  {
    categoria: 'Evento — SantaCaos',
    assunto: 'a arma entregue aos participantes',
    correta: 'Um taco de golfe',
    erradas: [
      'Um fuzil',
      'Uma chave inglesa',
      'Uma arma de choque'
    ]
  },
  {
    categoria: 'Evento — SantaCaos',
    assunto: 'os anti-heróis',
    correta: 'Usam Karambit e possuem superpulos',
    erradas: [
      'Usam somente navios',
      'Não podem atacar os participantes',
      'Permanecem parados durante o evento'
    ]
  },
  {
    categoria: 'Evento — SantaCaos',
    assunto: 'atacar um anti-herói',
    correta: 'É proibido e pode fazer o participante ser eliminado com arma de fogo',
    erradas: [
      'É obrigatório para ganhar',
      'Concede imunidade até o final',
      'Transforma o participante em administrador'
    ]
  },
  {
    categoria: 'Evento — SantaCaos',
    assunto: 'o uso de veículos',
    correta: 'É proibido entrar em veículos',
    erradas: [
      'É obrigatório usar veículos',
      'Somente veículos voadores podem ser usados',
      'Entrar em veículo concede vitória'
    ]
  },
  {
    categoria: 'Evento — Fuga Espacial',
    assunto: 'o objetivo principal',
    correta: 'Esconder-se e sobreviver aos astronautas',
    erradas: [
      'Destruir os navios no píer',
      'Encontrar veículos rosa',
      'Vencer uma corrida de motos'
    ]
  },
  {
    categoria: 'Evento — Fuga Espacial',
    assunto: 'o período antes do FF',
    correta: 'Os participantes devem se esconder',
    erradas: [
      'Os participantes devem atirar nos astronautas',
      'Os participantes devem entrar em veículos',
      'Os participantes devem sair do bunker'
    ]
  },
  {
    categoria: 'Evento — Fuga Espacial',
    assunto: 'a lanterna',
    correta: 'Pode ser utilizada apenas para defesa',
    erradas: [
      'É proibida em qualquer situação',
      'Deve ser usada para atacar os astronautas',
      'Serve para dirigir veículos'
    ]
  },
  {
    categoria: 'Evento — Fuga Espacial',
    assunto: 'atingir um astronauta',
    correta: 'É proibido e pode causar eliminação com bala',
    erradas: [
      'É obrigatório para avançar',
      'Concede uma vida extra',
      'Libera o uso de veículos'
    ]
  },
  {
    categoria: 'Evento — Karambit Wars',
    assunto: 'a divisão dos participantes',
    correta: 'São formados dois times com a mesma quantidade de jogadores',
    erradas: [
      'Todos formam um único time invencível',
      'Não existe divisão de participantes',
      'São formados dez times obrigatoriamente'
    ]
  },
  {
    categoria: 'Evento — Karambit Wars',
    assunto: 'o local do combate',
    correta: 'Um labirinto gigante',
    erradas: [
      'Um navio no Píer Sul',
      'Uma ponte em chamas',
      'Uma prancha pequena'
    ]
  },
  {
    categoria: 'Evento — Karambit Wars',
    assunto: 'a arma utilizada',
    correta: 'Todos lutam com Karambit',
    erradas: [
      'Todos lutam com fuzis',
      'Todos lutam com chave inglesa',
      'Todos lutam com taco de golfe'
    ]
  },
  {
    categoria: 'Evento — Karambit Wars',
    assunto: 'os itens de regeneração',
    correta: 'São proibidos',
    erradas: [
      'São obrigatórios',
      'Somente adrenalina é permitida',
      'Bandagens devem ser usadas a cada minuto'
    ]
  },
  {
    categoria: 'Evento — Karambit Wars',
    assunto: 'a traição do próprio time',
    correta: 'Não existe regra impedindo a traição',
    erradas: [
      'É impossível atacar alguém do próprio time',
      'Causa banimento automático do servidor',
      'Somente a administração pode trair'
    ]
  },
  {
    categoria: 'Evento — Karambit Wars',
    assunto: 'o encerramento da partida',
    correta: 'O jogo termina quando restam três jogadores vivos',
    erradas: [
      'O jogo termina quando restam dez jogadores',
      'O jogo termina quando um time entra no labirinto',
      'Todos vencem ao mesmo tempo'
    ]
  },
  {
    categoria: 'Evento — Santa Cross',
    assunto: 'o objetivo principal',
    correta: 'Chegar com vida à favela no final do percurso',
    erradas: [
      'Dominar um navio',
      'Encontrar um veículo rosa',
      'Permanecer dentro de uma torre'
    ]
  },
  {
    categoria: 'Evento — Santa Cross',
    assunto: 'as motocicletas',
    correta: 'São limitadas e ficam um pouco à frente do ponto inicial',
    erradas: [
      'São ilimitadas e entregues a todos',
      'São proibidas durante todo o evento',
      'Devem ser levadas pelos participantes'
    ]
  },
  {
    categoria: 'Evento — Santa Cross',
    assunto: 'a disputa inicial pelas motocicletas',
    correta: 'Pode ocorrer usando somente o soco inglês fornecido',
    erradas: [
      'Pode ocorrer usando qualquer fuzil',
      'Não existe disputa pelas motocicletas',
      'Deve ocorrer usando veículos pessoais'
    ]
  },
  {
    categoria: 'Evento — Santa Cross',
    assunto: 'as armas de fogo antes das motocicletas',
    correta: 'São proibidas',
    erradas: [
      'São obrigatórias',
      'Somente fuzis são permitidos',
      'Seu uso concede uma motocicleta'
    ]
  },
  {
    categoria: 'Evento — Santa Cross',
    assunto: 'a roupa oficial',
    correta: 'É proibido trocar de roupa durante o evento',
    erradas: [
      'É obrigatório trocar de roupa a cada etapa',
      'A roupa pode ser alterada livremente',
      'Somente o vencedor usa roupa oficial'
    ]
  },
  {
    categoria: 'Evento — Santa Apocalipse',
    assunto: 'o objetivo principal',
    correta: 'Cruzar a ponte e chegar vivo ao final do túnel',
    erradas: [
      'Encontrar um Creator preso',
      'Dominar um navio',
      'Permanecer perto de um veículo rosa'
    ]
  },
  {
    categoria: 'Evento — Santa Apocalipse',
    assunto: 'o percurso',
    correta: 'Deve ser realizado inteiramente a pé pela ponte',
    erradas: [
      'Deve ser realizado em motocicletas',
      'Deve ser realizado de navio',
      'Pode ser realizado por qualquer atalho'
    ]
  },
  {
    categoria: 'Evento — Santa Apocalipse',
    assunto: 'a arma permitida aos participantes',
    correta: 'Karambit',
    erradas: [
      'Fuzil',
      'Chave inglesa',
      'Taco de golfe'
    ]
  },
  {
    categoria: 'Evento — Santa Apocalipse',
    assunto: 'as drogas e binds',
    correta: 'Qualquer droga e qualquer bind podem ser utilizados',
    erradas: [
      'Todas as drogas e binds são proibidas',
      'Somente adrenalina é proibida e nenhuma bind pode ser usada',
      'Apenas a administração pode usar drogas'
    ]
  },
  {
    categoria: 'Evento — Santa Apocalipse',
    assunto: 'os poderes',
    correta: 'São proibidos',
    erradas: [
      'São obrigatórios',
      'Podem ser usados para pular a ponte',
      'Garantem vitória automática'
    ]
  },
  {
    categoria: 'Evento — Santa Apocalipse',
    assunto: 'carregar outro participante',
    correta: 'É proibido e causa desclassificação',
    erradas: [
      'É obrigatório',
      'É permitido para qualquer pessoa',
      'Concede uma vida extra'
    ]
  },
  {
    categoria: 'Evento — Esconde-Esconde',
    assunto: 'o local do Esconde-Esconde do Presídio',
    correta: 'A Prisão da Cidade Maresia',
    erradas: [
      'O Píer Sul da Cidade Nobre',
      'O pântano da Cidade Grande',
      'Os prédios da Cidade Santa'
    ]
  },
  {
    categoria: 'Evento — Esconde-Esconde',
    assunto: 'o objetivo dos participantes',
    correta: 'Encontrar esconderijos e sobreviver aos caçadores',
    erradas: [
      'Destruir todos os veículos',
      'Vencer uma corrida de navios',
      'Atacar astronautas com armas de fogo'
    ]
  },
  {
    categoria: 'Evento — Resgate ao Macedo',
    assunto: 'o objetivo principal',
    correta: 'Resgatar o Macedo vivo',
    erradas: [
      'Eliminar o Macedo',
      'Abandonar o Macedo no local',
      'Levar o Macedo até o pântano para lutar'
    ]
  },
  {
    categoria: 'Evento — Resgate ao Macedo',
    assunto: 'matar o Macedo',
    correta: 'É proibido',
    erradas: [
      'É obrigatório',
      'Concede premiação dobrada',
      'É permitido depois do resgate'
    ]
  },
  {
    categoria: 'Evento — Resgate ao Macedo',
    assunto: 'os carros voadores',
    correta: 'São proibidos',
    erradas: [
      'São obrigatórios',
      'Somente líderes podem utilizá-los',
      'Devem ser usados para carregar o Macedo'
    ]
  },
  {
    categoria: 'Evento — Resgate ao Macedo',
    assunto: 'o bate-bate de veículos',
    correta: 'É proibido',
    erradas: [
      'É obrigatório',
      'É o objetivo principal',
      'É permitido somente perto do Macedo'
    ]
  }
];

const SC_EVENT_FACTS_TO_USE = SC_EVENT_FACTS.slice(0, 100);

if (SC_EVENT_FACTS_TO_USE.length !== 100) {
  throw new Error(
    `[QUIZ EVENTOS] O banco precisa possuir pelo menos 100 assuntos, mas possui ${SC_EVENT_FACTS.length}.`
  );
}

if (SC_EVENT_QUESTION_VARIATIONS.length !== 5) {
  throw new Error(
    `[QUIZ EVENTOS] O gerador precisa possuir exatamente 5 variações, mas possui ${SC_EVENT_QUESTION_VARIATIONS.length}.`
  );
}

for (const fact of SC_EVENT_FACTS_TO_USE) {
  if (!fact || typeof fact !== 'object') {
    throw new Error('[QUIZ EVENTOS] Foi encontrado um assunto inválido.');
  }

  if (!fact.categoria || !fact.assunto || !fact.correta) {
    throw new Error(
      `[QUIZ EVENTOS] Um assunto está incompleto: ${JSON.stringify(fact)}`
    );
  }

  if (!Array.isArray(fact.erradas) || fact.erradas.length !== 3) {
    throw new Error(
      `[QUIZ EVENTOS] O assunto "${fact.assunto}" precisa possuir exatamente três alternativas incorretas.`
    );
  }

  const alternativas = [
    fact.correta,
    fact.erradas[0],
    fact.erradas[1],
    fact.erradas[2]
  ];

  for (const criarTexto of SC_EVENT_QUESTION_VARIATIONS) {
    addS(
      fact.categoria,
      criarTexto(fact),
      alternativas,
      0
    );
  }
}

const SC_EVENT_TOTAL_QUESTIONS =
  SC_EVENT_FACTS_TO_USE.length * SC_EVENT_QUESTION_VARIATIONS.length;

if (SC_EVENT_TOTAL_QUESTIONS !== 500) {
  throw new Error(
    `[QUIZ EVENTOS] Era esperado gerar 500 perguntas, mas foram geradas ${SC_EVENT_TOTAL_QUESTIONS}.`
  );
}

console.log(
  `[QUIZ EVENTOS] ${SC_EVENT_TOTAL_QUESTIONS} perguntas de eventos adicionadas com sucesso.`
);

export const SC_QUIZ_BANK = Q;