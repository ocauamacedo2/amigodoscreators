// ===============================
// BANCO DE PERGUNTAS — QUIZ 📚
// ===============================

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

// --- IMERSÃO / RP ---
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
addS('Uniforme', 'Dentro do prédio da SantaCreators, o uso obrigatório é de:', [
  'Ao menos uma peça visível da empresa',
  'Jaqueta da SantaCreators',
  'Uniforme oficial ou peça principal da empresa',
  'Identificação visual da empresa'
], 1);

addS('Veículos', 'Usar veículos da SantaCreators para troca de tiro é:', [
  'Totalmente inadequado e proibido',
  'Proibido',
  'Vedado mesmo em situação emergencial',
  'Não autorizado em hipótese normal'
], 1);

// --- BAÚS ---
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
addS('Poderes', 'A regra de ouro sobre poderes é:', [
  'Você só pode usar quando houver justificativa interna',
  'Se um player comum não pode, você também não pode',
  'Poder não existe para te dar vantagem no RP',
  'Se fugir da lógica do player comum, está errado'
], 1);

addS('Poderes', 'Em caso de anti-rp sofrido, você nunca deve:', [
  'Resolver por conta própria usando comando',
  'Usar seus poderes para resolver na hora',
  'Punir sem fluxo e sem registro',
  'Interferir como staff no calor da cena'
], 1);

// --- HIERARQUIA / SOCIAL / MANAGER ---
addS('Hierarquia', 'O nível 3 da estrutura oficial da SantaCreators é:', [
  'Creator',
  'Base operacional da equipe',
  'Faixa dos creators na estrutura',
  'Nível de entrada após liderança'
], 0);

addS('Social Médias', 'A principal função da Social Médias é:', [
  'Estruturar, organizar e manter a agenda de eventos',
  'Organizar e estruturar os eventos da SantaCreators',
  'Planejar o cronograma e a execução dos eventos',
  'Coordenar a parte operacional dos eventos da equipe'
], 1);

addS('Manager', 'A missão da equipe Manager Creators é:', [
  'Garantir presença das organizações nos eventos',
  'Garantir organizações presentes nos eventos',
  'Atuar para levar organizações à agenda da equipe',
  'Fazer a ponte entre eventos e lideranças convidadas'
], 1);

addS('Responsáveis', 'O Resp Influ possui autoridade para aplicar:', [
  'Banimento do painel e do Discord com regra e evidência',
  'Punições severas quando houver base e prova',
  'Sanções estruturais com respaldo da regra',
  'Medidas de alto impacto mediante evidência'
], 0);

export const SC_QUIZ_BANK = Q;