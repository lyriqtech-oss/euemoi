export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  type: 'conto' | 'cronica' | 'poesia';
  status: 'draft' | 'published' | 'scheduled';
  cover_image?: string;
  featured: boolean;
  published_at: string;
  scheduled_at?: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  tags?: Tag[];
}

export interface AuthorProfile {
  name: string;
  pseudonym: string;
  biography: string;
  short_bio: string;
  hero_phrase: string;
  photo: string;
  signature: string;
  instagram: string;
  other_social_links: { label: string; url: string }[];
}

export const INITIAL_AUTHOR_PROFILE: AuthorProfile = {
  name: "Natália Mello",
  pseudonym: "Eu e Moi",
  hero_phrase: "Entre palavras, silêncios e aquilo que permanece.",
  short_bio: "Professora de Português e escritora. Colecionadora de miudezas cotidianas, investiga a memória e o tempo através da palavra escrita.",
  biography: `Natália Mello é professora de Língua Portuguesa e Literatura, nascida e residente no Brasil. Sob o pseudônimo literário **Eu e Moi**, encontra a distância exata necessária para transformar suas vivências e reflexões íntimas em narrativas universais.

Sua escrita navega pelas margens da memória, pelas miudezas do cotidiano que costumam passar despercebidas e pela densidade do que silenciamos. O pseudônimo "Eu e Moi" surgiu do desejo de representar essa dualidade constante que habita todo escritor: o eu que vive as pressões e belezas do dia a dia, e o "moi" que se desliga para observar, recortar e registrar no papel o que resta do tempo.

Atualmente, concilia a docência na educação básica com oficinas de escrita criativa e a produção constante de seus próprios textos literários. Acredita que ler e escrever são as formas mais cruas e bonitas de permanecermos vivos.`,
  photo: "/natalia-bg.jpg",
  signature: "", // Empty to trigger the built-in SVG signature
  instagram: "https://instagram.com/euemoi",
  other_social_links: [
    { label: "E-mail de Contato", url: "mailto:contato@euemoi.com.br" },
    { label: "Medium", url: "https://medium.com/@euemoi" }
  ]
};

export const INITIAL_TAGS: Tag[] = [
  { id: "tag-1", name: "tempo", slug: "tempo" },
  { id: "tag-2", name: "saudade", slug: "saudade" },
  { id: "tag-3", name: "cotidiano", slug: "cotidiano" },
  { id: "tag-4", name: "infância", slug: "infancia" },
  { id: "tag-5", name: "despedidas", slug: "despedidas" },
  { id: "tag-6", name: "silêncio", slug: "silencio" }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    title: "O lugar onde deixamos as coisas",
    slug: "o-lugar-onde-deixamos-as-coisas",
    excerpt: "Talvez algumas despedidas não aconteçam de uma só vez. Algumas coisas se perdem na gaveta, outras ficam no peito.",
    content: `<p>Talvez algumas despedidas não aconteçam de uma só vez. Há desfechos que se estendem no tempo, como notas de um piano que continuam vibrando muito depois que a tecla foi solta. Nós nos despedimos de pessoas, de casas, de cidades e, principalmente, das versões de nós mesmos que habitavam aqueles espaços.</p>
<p>Na semana passada, encontrei um chaveiro antigo no fundo de uma gaveta esquecida. Não abria porta alguma que ainda me pertença. Ficou ali, metal fosco e argola frouxa, guardando o segredo de uma chave que já não sei onde deitei. Olhei para aquele objeto sem utilidade e pensei no acúmulo silencioso das coisas que deixamos para trás.</p>
<blockquote>
  "Deixar ir não é um ato de coragem instantânea; é uma faxina diária que fazemos na memória."
</blockquote>
<p>Guardamos gavetas inteiras de pequenos silêncios, de palavras que deveriam ter sido ditas na hora certa e de gestos que guardamos no bolso por pura timidez. Onde ficam as coisas que não dissemos? Talvez flutuem na poeira suspensa do fim de tarde, esperando que alguém abra a janela e as deixe finalmente ir.</p>
<p>Viver é esse exercício constante de decidir o que vai na mala e o que se dissolve no caminho. Ao final, a escrita é a única gaveta onde consigo colocar ordem na bagunça do que insiste em não passar.</p>`,
    type: "cronica",
    status: "published",
    featured: true,
    published_at: "2026-08-14T10:00:00Z",
    created_at: "2026-08-14T10:00:00Z",
    updated_at: "2026-08-14T10:00:00Z",
    author_id: "author-1",
    tags: [INITIAL_TAGS[2], INITIAL_TAGS[4], INITIAL_TAGS[0]]
  },
  {
    id: "post-2",
    title: "Um lugar entre dois silêncios",
    slug: "um-lugar-entre-dois-silencios",
    excerpt: "No espaço vazio que se instala entre a pergunta e a resposta tardia, há uma verdade difícil de nomear.",
    content: `<p>O relógio da sala marcava cinco batidas. Nem tarde demais para o café, nem cedo o suficiente para a noite. Naquele hiato, sentamo-nos à mesa de madeira antiga que Natália herdou da avó. Entre nós, a xícara fumegava um aroma forte de terra molhada, mas nenhuma palavra ousava quebrar a crosta fina que havia se formado sobre os nossos assuntos.</p>
<p>Há dois tipos de silêncio. Aquele que acolhe, quando a presença do outro é tão inteira que dispensa o som. E aquele que separa, que funciona como uma parede invisível e intransponível revestida de tudo aquilo que escolhemos calar. Nós estávamos no segundo grupo.</p>
<p>Ele moveu os dedos, traçando círculos imaginários na borda do pires. Eu olhava para a janela, observando o vento curvar os galhos da amoreira. Estávamos tão perto que eu podia ouvir sua respiração ritmada, e ao mesmo tempo tão distantes quanto duas margens de um rio largo no inverno.</p>
<p>— Você acha que o tempo cura tudo? — ele perguntou, de repente. A voz soou quase áspera na sala quieta.</p>
<p>Pensei em responder que o tempo não cura nada, apenas nos ensina a conviver com as cicatrizes. Mas a resposta demorou a vir, e quando finalmente abri os lábios, ele já havia se levantado para ir embora. O silêncio que retornou depois que a porta se fechou era ainda mais espesso. Um silêncio que se instalou confortavelmente no lugar dele, ocupando a cadeira vazia.</p>`,
    type: "conto",
    status: "published",
    featured: false,
    published_at: "2026-08-12T15:30:00Z",
    created_at: "2026-08-12T15:30:00Z",
    updated_at: "2026-08-12T15:30:00Z",
    author_id: "author-1",
    tags: [INITIAL_TAGS[5], INITIAL_TAGS[0]]
  },
  {
    id: "post-3",
    title: "O que permanece",
    slug: "o-que-permanece",
    excerpt: "Dizem que a casa onde nascemos guarda o cheiro do tempo. Mas o tempo não tem cheiro, tem apenas ausências.",
    content: `<p>A memória é um editor infiel. Ela corta as arestas ásperas do que nos magoou e ilumina com luz dourada os domingos ensolarados que talvez nunca tenham sido tão quentes assim. Quando volto à velha casa da infância, no interior do estado, percebo que os cômodos diminuíram.</p>
<p>O quintal, que na minha lembrança era uma savana sem fim onde eu caçava monstros de vento, não passa de um retângulo de terra batida com uma mangueira cansada a um canto. O que mudou? O espaço físico ou os olhos de quem o mede?</p>
<blockquote>
  "Escrever é uma forma de restaurar as paredes que o tempo derrubou na cabeça."
</blockquote>
<p>Restam vestígios. O risco de lápis na ombreira da porta da cozinha indicando minha altura em março de 1998. O azulejo trincado perto do fogão onde minha mãe costumava bater a colher de pau. Pequenos fragmentos que resistem à demolição dos anos. São essas miudezas que justificam a escrita: recolher os destroços do ontem para que o amanhã não os enterre totalmente.</p>`,
    type: "cronica",
    status: "published",
    featured: false,
    published_at: "2026-08-08T09:00:00Z",
    created_at: "2026-08-08T09:00:00Z",
    updated_at: "2026-08-08T09:00:00Z",
    author_id: "author-1",
    tags: [INITIAL_TAGS[3], INITIAL_TAGS[0], INITIAL_TAGS[1]]
  },
  {
    id: "post-4",
    title: "Domingo às cinco",
    slug: "domingo-as-cinco",
    excerpt: "Um poema sobre a luz oblíqua de fim de tarde que bate na parede da sala, desenhando a sombra da saudade.",
    content: `<p>há uma luz oblíqua que atravessa a veneziana
e corta o tapete da sala em duas metades exatas

uma de sol morno
outra de poeira e sombra.

o relógio de parede
não corre
apenas empurra a tarde para dentro do abismo.

o domingo às cinco é uma dobra na semana
um lugar suspenso
onde o silêncio faz barulho de água caindo.

não há nada a fazer
a não ser ver a sombra do vaso de flores
esticar-se na parede
até tocar a moldura do retrato

onde você ainda sorri
sem saber
do inverno que viria.</p>`,
    type: "poesia",
    status: "published",
    featured: false,
    published_at: "2026-08-05T17:00:00Z",
    created_at: "2026-08-05T17:00:00Z",
    updated_at: "2026-08-05T17:00:00Z",
    author_id: "author-1",
    tags: [INITIAL_TAGS[1], INITIAL_TAGS[5]]
  },
  {
    id: "post-5",
    title: "Pequenas coisas que não dissemos",
    slug: "pequenas-coisas-que-nao-dissemos",
    excerpt: "Às vezes, o amor não reside nas grandes declarações, mas sim nos detalhes que guardamos por medo de perder a compostura.",
    content: `<p>Se eu tivesse que fazer uma lista de tudo o que deixei guardado sob a língua naqueles anos, começaria pelas palavras pequenas. Aquelas de três ou quatro letras que servem de apoio para decisões enormes. Nós conversávamos sobre o preço da gasolina, sobre o clima chuvoso, sobre a reforma do banheiro. Mas nunca falávamos sobre a forma como o silêncio se instalava entre nós logo após o jantar.</p>
<p>Lembro-me de uma noite em que o vento batia forte nas janelas e você se encolheu no sofá. Tive vontade de cobrir seus ombros com a manta de lã vermelha, mas o gesto pareceu-me solene demais, uma quebra desproporcional do pacto de indiferença que havíamos assinado sem querer. Guardei a manta, guardei o gesto e fui dormir com frio.</p>
<p>— O que você está pensando? — você me perguntou certa vez, enquanto esperávamos o sinal fechar.</p>
<p>— Nada relevante — respondi.</p>
<p>Menti. Estava pensando que o formato da sua orelha esquerda contra o sol da tarde era a coisa mais bela e triste que eu veria naquela semana. Mas como se diz algo assim no trânsito das seis? Não se diz. Deixa-se passar. E assim fomos acumulando pequenos nadas até que a soma deles nos esmagasse por completo.</p>`,
    type: "conto",
    status: "published",
    featured: false,
    published_at: "2026-08-01T14:00:00Z",
    created_at: "2026-08-01T14:00:00Z",
    updated_at: "2026-08-01T14:00:00Z",
    author_id: "author-1",
    tags: [INITIAL_TAGS[2], INITIAL_TAGS[5], INITIAL_TAGS[1]]
  },
  {
    id: "post-6",
    title: "Quase primavera",
    slug: "quase-primavera",
    excerpt: "A transição das estações na janela do quarto, onde as flores insistem em nascer apesar do asfalto quente.",
    content: `<p>ainda faz frio nas manhãs de agosto
mas o vento já traz um cheiro diferente
um sopro morno que vem do norte
conversando com as copas das árvores.

na calçada da frente
o ipê-roxo derramou suas últimas pétalas
um tapete de cor sobre o cinza do asfalto
que os carros pisam sem pressa.

a primavera não chega com alarde
ela se insinua nas pequenas brechas:
um broto verde na roseira seca
um sol que entra mais cedo pela janela.

também no peito
as coisas começam a mudar de temperatura.
o gelo das palavras guardadas
começa, sutilmente, a escorrer.</p>`,
    type: "poesia",
    status: "published",
    featured: false,
    published_at: "2026-07-28T08:00:00Z",
    created_at: "2026-07-28T08:00:00Z",
    updated_at: "2026-07-28T08:00:00Z",
    author_id: "author-1",
    tags: [INITIAL_TAGS[0], INITIAL_TAGS[3]]
  }
];
