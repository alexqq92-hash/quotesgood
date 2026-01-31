export type QuoteCategory =
  | 'motivacion'
  | 'vida'
  | 'amor'
  | 'exito'
  | 'sabiduria'
  | 'felicidad'
  | 'superacion'
  | 'filosofia';

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: QuoteCategory;
}

export const QUOTE_CATEGORY_LABELS: Record<QuoteCategory, string> = {
  motivacion: 'Motivación',
  vida: 'Vida',
  amor: 'Amor',
  exito: 'Éxito',
  sabiduria: 'Sabiduría',
  felicidad: 'Felicidad',
  superacion: 'Superación',
  filosofia: 'Filosofía',
};

const quotesData: Quote[] = [
  // Motivación
  { id: 'q1', text: 'El único modo de hacer un gran trabajo es amar lo que haces', author: 'Steve Jobs', category: 'motivacion' },
  { id: 'q2', text: 'No cuentes los días, haz que los días cuenten', author: 'Muhammad Ali', category: 'motivacion' },
  { id: 'q3', text: 'El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el coraje de continuar', author: 'Winston Churchill', category: 'motivacion' },
  { id: 'q4', text: 'Cree que puedes y ya estarás a medio camino', author: 'Theodore Roosevelt', category: 'motivacion' },
  { id: 'q5', text: 'La motivación es lo que te pone en marcha, el hábito es lo que hace que sigas', author: 'Jim Ryun', category: 'motivacion' },
  { id: 'q6', text: 'Tu tiempo es limitado, no lo desperdicies viviendo la vida de otro', author: 'Steve Jobs', category: 'motivacion' },
  { id: 'q7', text: 'El futuro pertenece a quienes creen en la belleza de sus sueños', author: 'Eleanor Roosevelt', category: 'motivacion' },
  { id: 'q8', text: 'No importa lo lento que vayas mientras no te detengas', author: 'Confucio', category: 'motivacion' },
  { id: 'q9', text: 'Mantente hambriento, mantente alocado', author: 'Steve Jobs', category: 'motivacion' },
  { id: 'q10', text: 'El éxito es ir de fracaso en fracaso sin perder el entusiasmo', author: 'Winston Churchill', category: 'motivacion' },

  // Vida
  { id: 'q11', text: 'La vida es lo que pasa mientras estás ocupado haciendo otros planes', author: 'John Lennon', category: 'vida' },
  { id: 'q12', text: 'Vive como si fueras a morir mañana. Aprende como si fueras a vivir siempre', author: 'Mahatma Gandhi', category: 'vida' },
  { id: 'q13', text: 'La vida no se trata de encontrarte a ti mismo, se trata de crearte a ti mismo', author: 'George Bernard Shaw', category: 'vida' },
  { id: 'q14', text: 'En tres palabras puedo resumir todo lo que he aprendido sobre la vida: continúa adelante', author: 'Robert Frost', category: 'vida' },
  { id: 'q15', text: 'La vida es realmente simple, pero insistimos en hacerla complicada', author: 'Confucio', category: 'vida' },
  { id: 'q16', text: 'No es la más fuerte de las especies la que sobrevive, sino la que mejor se adapta al cambio', author: 'Charles Darwin', category: 'vida' },
  { id: 'q17', text: 'La vida es un 10% lo que te sucede y un 90% cómo reaccionas ante ello', author: 'Charles R. Swindoll', category: 'vida' },
  { id: 'q18', text: 'Solo se vive una vez, pero si lo haces bien, una vez es suficiente', author: 'Mae West', category: 'vida' },
  { id: 'q19', text: 'La vida es como montar en bicicleta. Para mantener el equilibrio debes seguir moviéndote', author: 'Albert Einstein', category: 'vida' },
  { id: 'q20', text: 'La vida es demasiado importante como para tomársela en serio', author: 'Oscar Wilde', category: 'vida' },

  // Amor
  { id: 'q21', text: 'Amar no es mirarse el uno al otro, sino mirar juntos en la misma dirección', author: 'Antoine de Saint-Exupéry', category: 'amor' },
  { id: 'q22', text: 'El amor no se mira con los ojos, sino con el alma', author: 'William Shakespeare', category: 'amor' },
  { id: 'q23', text: 'Donde hay amor, hay vida', author: 'Mahatma Gandhi', category: 'amor' },
  { id: 'q24', text: 'El amor es la única fuerza capaz de transformar a un enemigo en amigo', author: 'Martin Luther King Jr.', category: 'amor' },
  { id: 'q25', text: 'Ama y haz lo que quieras', author: 'San Agustín', category: 'amor' },
  { id: 'q26', text: 'El amor es como el viento, no puedo verlo pero puedo sentirlo', author: 'Nicholas Sparks', category: 'amor' },
  { id: 'q27', text: 'Amar es encontrar en la felicidad de otro tu propia felicidad', author: 'Gottfried Leibniz', category: 'amor' },
  { id: 'q28', text: 'Nos amamos porque es la única verdadera aventura', author: 'Nikki Giovanni', category: 'amor' },
  { id: 'q29', text: 'La medida del amor es amar sin medida', author: 'San Agustín', category: 'amor' },
  { id: 'q30', text: 'El amor todo lo puede', author: 'Virgilio', category: 'amor' },

  // Éxito
  { id: 'q31', text: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día', author: 'Robert Collier', category: 'exito' },
  { id: 'q32', text: 'No tengas miedo de renunciar a lo bueno para perseguir lo grandioso', author: 'John D. Rockefeller', category: 'exito' },
  { id: 'q33', text: 'El secreto del éxito es la constancia en el propósito', author: 'Benjamin Disraeli', category: 'exito' },
  { id: 'q34', text: 'El éxito no es la clave de la felicidad. La felicidad es la clave del éxito', author: 'Albert Schweitzer', category: 'exito' },
  { id: 'q35', text: 'La diferencia entre una persona exitosa y otras no es la falta de fuerza o conocimiento, sino la falta de voluntad', author: 'Vince Lombardi', category: 'exito' },
  { id: 'q36', text: 'El éxito consiste en obtener lo que se desea. La felicidad, en disfrutar lo que se obtiene', author: 'Ralph Waldo Emerson', category: 'exito' },
  { id: 'q37', text: 'Nunca dejes que el miedo a perder te impida jugar', author: 'Babe Ruth', category: 'exito' },
  { id: 'q38', text: 'El éxito es caminar de fracaso en fracaso sin perder el entusiasmo', author: 'Winston Churchill', category: 'exito' },
  { id: 'q39', text: 'Los ganadores nunca abandonan y los que abandonan nunca ganan', author: 'Vince Lombardi', category: 'exito' },
  { id: 'q40', text: 'El éxito no se mide por lo que logras, sino por los obstáculos que superas', author: 'Booker T. Washington', category: 'exito' },

  // Sabiduría
  { id: 'q41', text: 'Solo sé que no sé nada', author: 'Sócrates', category: 'sabiduria' },
  { id: 'q42', text: 'La verdadera sabiduría está en reconocer la propia ignorancia', author: 'Sócrates', category: 'sabiduria' },
  { id: 'q43', text: 'El conocimiento habla, pero la sabiduría escucha', author: 'Jimi Hendrix', category: 'sabiduria' },
  { id: 'q44', text: 'La paciencia es la madre de todas las ciencias', author: 'Miguel de Cervantes', category: 'sabiduria' },
  { id: 'q45', text: 'Conocerse a uno mismo es el principio de toda sabiduría', author: 'Aristóteles', category: 'sabiduria' },
  { id: 'q46', text: 'La duda es el principio de la sabiduría', author: 'Aristóteles', category: 'sabiduria' },
  { id: 'q47', text: 'Dame un punto de apoyo y moveré el mundo', author: 'Arquímedes', category: 'sabiduria' },
  { id: 'q48', text: 'La imaginación es más importante que el conocimiento', author: 'Albert Einstein', category: 'sabiduria' },
  { id: 'q49', text: 'La sabiduría comienza en el asombro', author: 'Sócrates', category: 'sabiduria' },
  { id: 'q50', text: 'El que tiene un porqué para vivir puede soportar casi cualquier cómo', author: 'Friedrich Nietzsche', category: 'sabiduria' },

  // Felicidad
  { id: 'q51', text: 'La felicidad no es algo hecho. Viene de tus propias acciones', author: 'Dalai Lama', category: 'felicidad' },
  { id: 'q52', text: 'La felicidad depende de nosotros mismos', author: 'Aristóteles', category: 'felicidad' },
  { id: 'q53', text: 'No hay camino hacia la felicidad: la felicidad es el camino', author: 'Buda', category: 'felicidad' },
  { id: 'q54', text: 'La felicidad es un perfume que no puedes derramar sobre otros sin que te caigan unas gotas', author: 'Ralph Waldo Emerson', category: 'felicidad' },
  { id: 'q55', text: 'La mayor felicidad del ser humano es encontrar lo que puede dar', author: 'Honoré de Balzac', category: 'felicidad' },
  { id: 'q56', text: 'La felicidad no es un destino, es una forma de viajar', author: 'Margaret Lee Runbeck', category: 'felicidad' },
  { id: 'q57', text: 'El secreto de la felicidad no es hacer siempre lo que se quiere, sino querer siempre lo que se hace', author: 'León Tolstói', category: 'felicidad' },
  { id: 'q58', text: 'La felicidad es interior, no exterior; por lo tanto, no depende de lo que tenemos, sino de lo que somos', author: 'Henry Van Dyke', category: 'felicidad' },
  { id: 'q59', text: 'Muy poco se necesita para hacer una vida feliz', author: 'Marco Aurelio', category: 'felicidad' },
  { id: 'q60', text: 'La verdadera felicidad consiste en hacer el bien', author: 'Aristóteles', category: 'felicidad' },

  // Superación
  { id: 'q61', text: 'Nuestra mayor gloria no es no caer nunca, sino levantarnos cada vez que caemos', author: 'Confucio', category: 'superacion' },
  { id: 'q62', text: 'Los obstáculos son esas cosas espantosas que ves cuando apartas los ojos de tu meta', author: 'Henry Ford', category: 'superacion' },
  { id: 'q63', text: 'Lo que no te mata te hace más fuerte', author: 'Friedrich Nietzsche', category: 'superacion' },
  { id: 'q64', text: 'En medio de la dificultad reside la oportunidad', author: 'Albert Einstein', category: 'superacion' },
  { id: 'q65', text: 'Cuando todo parezca ir contra ti, recuerda que el avión despega contra el viento, no a favor de él', author: 'Henry Ford', category: 'superacion' },
  { id: 'q66', text: 'Las dificultades preparan a personas comunes para destinos extraordinarios', author: 'C.S. Lewis', category: 'superacion' },
  { id: 'q67', text: 'La persistencia es el camino del éxito', author: 'Charles Chaplin', category: 'superacion' },
  { id: 'q68', text: 'Caer está permitido, levantarse es obligatorio', author: 'Proverbio ruso', category: 'superacion' },
  { id: 'q69', text: 'He fallado una y otra vez en mi vida y por eso he tenido éxito', author: 'Michael Jordan', category: 'superacion' },
  { id: 'q70', text: 'Siempre parece imposible hasta que se hace', author: 'Nelson Mandela', category: 'superacion' },

  // Filosofía
  { id: 'q71', text: 'Pienso, luego existo', author: 'René Descartes', category: 'filosofia' },
  { id: 'q72', text: 'El hombre es un lobo para el hombre', author: 'Thomas Hobbes', category: 'filosofia' },
  { id: 'q73', text: 'La felicidad es el bien supremo', author: 'Aristóteles', category: 'filosofia' },
  { id: 'q74', text: 'El hombre está condenado a ser libre', author: 'Jean-Paul Sartre', category: 'filosofia' },
  { id: 'q75', text: 'El que tiene un porqué para vivir, encontrará casi siempre el cómo', author: 'Friedrich Nietzsche', category: 'filosofia' },
  { id: 'q76', text: 'La existencia precede a la esencia', author: 'Jean-Paul Sartre', category: 'filosofia' },
  { id: 'q77', text: 'El infierno son los otros', author: 'Jean-Paul Sartre', category: 'filosofia' },
  { id: 'q78', text: 'Todo lo que sé es que no sé nada', author: 'Sócrates', category: 'filosofia' },
  { id: 'q79', text: 'La vida sin examen no merece ser vivida', author: 'Sócrates', category: 'filosofia' },
  { id: 'q80', text: 'Somos lo que hacemos repetidamente. La excelencia no es un acto, sino un hábito', author: 'Aristóteles', category: 'filosofia' },

  // Más frases motivacionales
  { id: 'q81', text: 'Empieza donde estás. Usa lo que tienes. Haz lo que puedas', author: 'Arthur Ashe', category: 'motivacion' },
  { id: 'q82', text: 'La mejor manera de predecir el futuro es crearlo', author: 'Peter Drucker', category: 'motivacion' },
  { id: 'q83', text: 'No esperes. El momento nunca será el adecuado', author: 'Napoleon Hill', category: 'motivacion' },
  { id: 'q84', text: 'Sueña en grande y atrévete a fallar', author: 'Norman Vaughan', category: 'motivacion' },
  { id: 'q85', text: 'Todo lo que siempre has querido está al otro lado del miedo', author: 'George Addair', category: 'motivacion' },

  // Más sobre vida
  { id: 'q86', text: 'No llores porque se terminó, sonríe porque sucedió', author: 'Dr. Seuss', category: 'vida' },
  { id: 'q87', text: 'La vida es una obra de teatro que no permite ensayos', author: 'Charles Chaplin', category: 'vida' },
  { id: 'q88', text: 'Cada momento es un nuevo comienzo', author: 'T.S. Eliot', category: 'vida' },
  { id: 'q89', text: 'La vida es aquello que te va sucediendo mientras te empeñas en hacer otros planes', author: 'Allen Saunders', category: 'vida' },
  { id: 'q90', text: 'Que tu alimento sea tu medicina, y tu medicina sea tu alimento', author: 'Hipócrates', category: 'vida' },

  // Más sobre superación
  { id: 'q91', text: 'El fracaso es simplemente la oportunidad de comenzar de nuevo, esta vez de forma más inteligente', author: 'Henry Ford', category: 'superacion' },
  { id: 'q92', text: 'No te preocupes por los fracasos, preocúpate por las oportunidades que pierdes cuando ni siquiera lo intentas', author: 'Jack Canfield', category: 'superacion' },
  { id: 'q93', text: 'Los grandes logros siempre se realizan en el marco de grandes expectativas', author: 'Jack Kinder', category: 'superacion' },
  { id: 'q94', text: 'Convierte tus heridas en sabiduría', author: 'Oprah Winfrey', category: 'superacion' },
  { id: 'q95', text: 'La perseverancia no es una carrera larga; son muchas carreras cortas una detrás de otra', author: 'Walter Elliot', category: 'superacion' },

  // Más sobre felicidad
  { id: 'q96', text: 'La felicidad no es tener lo que quieres, sino querer lo que tienes', author: 'Dale Carnegie', category: 'felicidad' },
  { id: 'q97', text: 'Si quieres ser feliz, establece una meta que controle tus pensamientos, libere tu energía e inspire tus esperanzas', author: 'Andrew Carnegie', category: 'felicidad' },
  { id: 'q98', text: 'La felicidad es una dirección, no un lugar', author: 'Sydney J. Harris', category: 'felicidad' },
  { id: 'q99', text: 'La felicidad de tu vida depende de la calidad de tus pensamientos', author: 'Marco Aurelio', category: 'felicidad' },
  { id: 'q100', text: 'La felicidad es cuando lo que piensas, lo que dices y lo que haces están en armonía', author: 'Mahatma Gandhi', category: 'felicidad' },

  // Frases adicionales de autores famosos
  { id: 'q101', text: 'Sé el cambio que quieres ver en el mundo', author: 'Mahatma Gandhi', category: 'motivacion' },
  { id: 'q102', text: 'La creatividad es la inteligencia divirtiéndose', author: 'Albert Einstein', category: 'sabiduria' },
  { id: 'q103', text: 'Un viaje de mil millas comienza con un solo paso', author: 'Lao Tzu', category: 'superacion' },
  { id: 'q104', text: 'El único imposible es aquel que no intentas', author: 'Michael Jordan', category: 'motivacion' },
  { id: 'q105', text: 'La educación es el arma más poderosa que puedes usar para cambiar el mundo', author: 'Nelson Mandela', category: 'sabiduria' },
  { id: 'q106', text: 'No se puede cruzar el mar simplemente mirando el agua', author: 'Rabindranath Tagore', category: 'motivacion' },
  { id: 'q107', text: 'El tiempo que disfrutas perdiéndolo no es tiempo perdido', author: 'John Lennon', category: 'vida' },
  { id: 'q108', text: 'Quien mira hacia afuera sueña, quien mira hacia adentro despierta', author: 'Carl Jung', category: 'filosofia' },
  { id: 'q109', text: 'La simplicidad es la máxima sofisticación', author: 'Leonardo da Vinci', category: 'sabiduria' },
  { id: 'q110', text: 'No hay nada permanente excepto el cambio', author: 'Heráclito', category: 'filosofia' },
];

export const quotes: Quote[] = quotesData;

export function shuffleQuotes(quotesToShuffle: Quote[]): Quote[] {
  const shuffled = [...quotesToShuffle];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getQuotesByCategory(category: QuoteCategory): Quote[] {
  return quotes.filter((q) => q.category === category);
}

export function getQuotesByCategories(categories: QuoteCategory[]): Quote[] {
  return quotes.filter((q) => categories.includes(q.category));
}
