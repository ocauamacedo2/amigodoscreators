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
addS('Organização', 'Quem tem disponibilidade OBRIGATÓRIA nos eventos das 19:00?', ['Apenas os novatos', 'Coord.+, Resp. Líder e Resp. Influ', 'Toda a empresa sem exceção', 'Apenas o Social Médias'], 1);
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
addS('Conduta', 'A regra de disponibilidade obrigatória às 19:00 serve para:', ['Ocupar o tempo do membro', 'Sustentar a base da operação semanal da empresa', 'Testar a paciência da equipe', 'Ganhar visualização no YouTube'], 1);
addS('Organização', 'O registro de ausência até 18:30 é uma prova de:', ['Burocracia', 'Comprometimento e organização', 'Falta de liberdade', 'Controle de staff'], 1);
addS('Conduta', 'Ao atingir 3/3 ADVs, o membro pode ser:', ['Promovido', 'Desligado ou rebaixado após reavaliação', 'Suspenso por 5 minutos', 'Convidado para uma festa'], 1);
addS('Conduta', 'O primeiro passo ao ter dúvidas sobre conduta é:', ['Fazer o que der na telha', 'Procurar alguém da liderança', 'Perguntar no chat geral da cidade', 'Ignorar a dúvida'], 1);
addS('Conduta', 'A SantaCreators se baseia em:', ['Respeito mútuo e evolução coletiva', 'Competição interna feroz', 'Individualismo', 'Apenas lucro in-game'], 0);
addS('Conduta', 'O "Comprometimento" na empresa é avaliado por:', ['Presença, pontualidade e respeito às regras', 'Quantidade de dinheiro in-game', 'Nível de amizade com o Owner', 'Poderes de staff'], 0);
addS('Organização', 'Se você é Coord.+ e não avisou que ia faltar, você perde:', ['100 pontos', '5 pontos e recebe ADV 1/3 permanente', 'A skin do personagem', 'O acesso à sede por 1 mês'], 1);
addS('Imersão', 'O RP de verdade, segundo a SantaCreators, se faz com:', ['Armas caras', 'Atitude, postura e respeito', 'Gritos e polêmicas', 'Muitos comandos de F8'], 1);
addS('Imersão', 'A imersão na cidade começa com:', ['O Admin', 'Você (cada membro fazendo sua parte)', 'O mapa novo', 'O rádio da empresa'], 1);

export const SC_QUIZ_BANK = Q;