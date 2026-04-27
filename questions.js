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

let nextLetterIdx = 0;
const rotateLetter = () => {
  const t = nextLetterIdx;
  nextLetterIdx = (nextLetterIdx + 1) % 4;
  return t;
};

const compact = (s) => {
  let out = String(s || '').trim().replace(/\s+/g, ' ');
  if (out.length > 84) out = out.slice(0, 81) + '...';
  return out;
};

function addS(categoria, texto, choices, correctIndex) {
  const idx = [0, 1, 2, 3];
  const perm = shuffle(idx);
  const targetLetterIdx = rotateLetter();
  const posCorrect = perm.indexOf(correctIndex);

  if (posCorrect !== targetLetterIdx) {
    [perm[posCorrect], perm[targetLetterIdx]] = [perm[targetLetterIdx], perm[posCorrect]];
  }

  const opcoes = perm.map((i, k) => `${L[k]}) ${compact(choices[i])}`);
  const resposta = L[targetLetterIdx];

  Q.push({ id: idc++, categoria, texto, opcoes, resposta });
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
  '17:00 às 23:00 e 01:00 às 04:00',
  '18:00 às 23:00 e 00:00 às 03:00',
  '17:00 às 22:00 e 01:00 às 04:00',
  '17:00 às 23:00 e 00:00 às 04:00'
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

addS('Advertência', 'Para cargos Coord.+, Resp. Líder e Resp. Influ, os eventos das 19:00 são:', [
  'Obrigatórios',
  'Compromissos fixos da liderança',
  'De presença esperada salvo justificativa',
  'Parte da obrigação dos cargos citados'
], 0);

addS('Advertência', 'Caso não possa comparecer ao evento das 19:00, é obrigatório:', [
  'Registrar ausência até 18:30 com justificativa',
  'Informar ausência antes do horário-limite',
  'Formalizar justificativa antes do evento',
  'Avisar no fluxo correto dentro do prazo'
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

addS('Social Médias', 'Os eventos da SantaCreators acontecem em quais dias?', [
  'Segunda a sábado',
  'De segunda até sábado',
  'Ao longo da semana, exceto domingo',
  'Seis dias por semana, sem domingo'
], 0);

addS('Social Médias', 'O horário padrão dos eventos é:', [
  '19:00',
  '20:00 com chamada antes',
  '19:00 como horário-base',
  'Por volta das 19:00'
], 0);

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

addS('Advertência', 'Para Coord.+, Resp. Líder e Resp. Influ, os eventos das 19:00 são:', [
  'Facultativos',
  'Obrigatórios',
  'Opcionais with aviso depois',
  'Necessários apenas na sexta'
], 1);

addS('Advertência', 'Se não puder comparecer ao evento das 19:00, o correto é:', [
  'Avisar depois do evento',
  'Registrar ausência até 18:30 com justificativa',
  'Explicar na próxima call',
  'Mandar DM para qualquer membro'
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

addS('Social Médias', 'Os eventos da SantaCreators acontecem:', [
  'De segunda a sábado',
  'Somente de terça a sexta',
  'Todos os dias da semana',
  'Apenas no fim de semana'
], 0);

addS('Social Médias', 'O horário padrão dos eventos é:', [
  '18:00',
  '20:00',
  '19:00',
  '21:00'
], 2);

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

export const SC_QUIZ_BANK = Q;