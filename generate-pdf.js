/**
 * Generador del PDF "Reinicia tu Foco"
 * Guía práctica de ~30 páginas sobre concentración y productividad digital
 * 
 * Ejecutar: node generate-pdf.js
 * Requiere: npm install pdfkit
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// ── Configuración de colores ──
const COLORS = {
  bg: '#0a0e1a',
  bgLight: '#0f1425',
  accent: '#00e5c3',
  accentBlue: '#0094ff',
  textPrimary: '#e8ecf4',
  textSecondary: '#8892a8',
  white: '#ffffff',
  black: '#000000',
  darkCard: '#141c37',
  red: '#ff6b6b',
  green: '#00e5c3',
  pageBg: '#fafbfc',
  pageText: '#1a1a2e',
  pageTextLight: '#4a4a6a',
  chapterAccent: '#0094ff',
  sectionBg: '#f0f4f8',
};

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 72, bottom: 72, left: 60, right: 60 },
  info: {
    Title: 'Reinicia tu Foco — Guía Práctica',
    Author: 'Reinicia tu Foco',
    Subject: 'Productividad y concentración en la era digital',
    Keywords: 'concentración, productividad, enfoque, distracción digital',
    CreationDate: new Date(),
  },
  bufferPages: true,
});

const outputPath = path.join(__dirname, 'Reinicia-tu-Foco.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const PAGE_WIDTH = doc.page.width;
const PAGE_HEIGHT = doc.page.height;
const CONTENT_WIDTH = PAGE_WIDTH - 120;
let pageNumber = 0;

// ── Helpers ──
function addPageNumber() {
  pageNumber++;
  if (pageNumber > 2) {
    doc.fontSize(9)
      .fillColor('#999999')
      .text(`${pageNumber}`, 0, PAGE_HEIGHT - 50, { align: 'center', width: PAGE_WIDTH });
  }
}

function newPage() {
  doc.addPage();
  addPageNumber();
}

function drawSectionDivider(y) {
  const gradient_start = 200;
  const gradient_end = PAGE_WIDTH - 200;
  doc.moveTo(gradient_start, y)
    .lineTo(gradient_end, y)
    .lineWidth(1)
    .strokeColor('#dde1e8')
    .stroke();
}

function chapterTitle(number, title, subtitle) {
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill('#0a0e1a');

  // Chapter number
  doc.fontSize(120)
    .fillColor('#141c37')
    .text(number.toString().padStart(2, '0'), 60, 180, { width: CONTENT_WIDTH });

  // Accent line
  doc.rect(60, 340, 60, 4).fill(COLORS.accent);

  // Title
  doc.fontSize(36)
    .fillColor(COLORS.white)
    .font('Helvetica-Bold')
    .text(title, 60, 370, { width: CONTENT_WIDTH });

  // Subtitle
  if (subtitle) {
    doc.fontSize(14)
      .fillColor(COLORS.textSecondary)
      .font('Helvetica')
      .text(subtitle, 60, 430, { width: CONTENT_WIDTH, lineGap: 6 });
  }
}

function sectionTitle(text, y) {
  if (y === undefined) y = doc.y;
  doc.fontSize(20)
    .fillColor(COLORS.pageText)
    .font('Helvetica-Bold')
    .text(text, 60, y, { width: CONTENT_WIDTH });
  doc.moveDown(0.5);
  doc.rect(60, doc.y, 40, 3).fill(COLORS.accent);
  doc.moveDown(0.8);
}

function subTitle(text) {
  doc.fontSize(14)
    .fillColor(COLORS.chapterAccent)
    .font('Helvetica-Bold')
    .text(text, 60, doc.y, { width: CONTENT_WIDTH });
  doc.moveDown(0.4);
}

function bodyText(text) {
  doc.fontSize(11)
    .fillColor(COLORS.pageTextLight)
    .font('Helvetica')
    .text(text, 60, doc.y, { width: CONTENT_WIDTH, lineGap: 5, paragraphGap: 8 });
  doc.moveDown(0.3);
}

function bulletPoint(text, icon = '•') {
  const startY = doc.y;
  doc.fontSize(11)
    .fillColor(COLORS.accent)
    .font('Helvetica-Bold')
    .text(icon, 70, startY, { continued: false });
  doc.fontSize(11)
    .fillColor(COLORS.pageTextLight)
    .font('Helvetica')
    .text(text, 90, startY, { width: CONTENT_WIDTH - 30, lineGap: 4 });
  doc.moveDown(0.3);
}

function numberedItem(num, title, desc) {
  const startY = doc.y;
  // Number circle
  doc.circle(78, startY + 8, 12).fill(COLORS.accent);
  doc.fontSize(11)
    .fillColor(COLORS.white)
    .font('Helvetica-Bold')
    .text(num.toString(), 70, startY + 2, { width: 16, align: 'center' });

  // Title
  doc.fontSize(12)
    .fillColor(COLORS.pageText)
    .font('Helvetica-Bold')
    .text(title, 100, startY, { width: CONTENT_WIDTH - 40 });

  // Description
  doc.fontSize(10.5)
    .fillColor(COLORS.pageTextLight)
    .font('Helvetica')
    .text(desc, 100, doc.y, { width: CONTENT_WIDTH - 40, lineGap: 4 });
  doc.moveDown(0.6);
}

function tipBox(title, text) {
  const startY = doc.y;
  const boxHeight = 80;
  doc.roundedRect(60, startY, CONTENT_WIDTH, boxHeight, 6)
    .fill('#e8f8f5');
  doc.roundedRect(60, startY, 4, boxHeight, 2)
    .fill(COLORS.accent);

  doc.fontSize(11)
    .fillColor(COLORS.accent)
    .font('Helvetica-Bold')
    .text(`💡 ${title}`, 76, startY + 14, { width: CONTENT_WIDTH - 32 });

  doc.fontSize(10)
    .fillColor(COLORS.pageTextLight)
    .font('Helvetica')
    .text(text, 76, doc.y + 4, { width: CONTENT_WIDTH - 32, lineGap: 4 });
  doc.y = startY + boxHeight + 16;
}

function warningBox(title, text) {
  const startY = doc.y;
  const boxHeight = 80;
  doc.roundedRect(60, startY, CONTENT_WIDTH, boxHeight, 6)
    .fill('#fff5f5');
  doc.roundedRect(60, startY, 4, boxHeight, 2)
    .fill(COLORS.red);

  doc.fontSize(11)
    .fillColor(COLORS.red)
    .font('Helvetica-Bold')
    .text(`⚠️ ${title}`, 76, startY + 14, { width: CONTENT_WIDTH - 32 });

  doc.fontSize(10)
    .fillColor(COLORS.pageTextLight)
    .font('Helvetica')
    .text(text, 76, doc.y + 4, { width: CONTENT_WIDTH - 32, lineGap: 4 });
  doc.y = startY + boxHeight + 16;
}

function statCard(stat, label, y, x) {
  doc.roundedRect(x, y, 110, 70, 6)
    .fill(COLORS.sectionBg);
  doc.fontSize(22)
    .fillColor(COLORS.chapterAccent)
    .font('Helvetica-Bold')
    .text(stat, x, y + 12, { width: 110, align: 'center' });
  doc.fontSize(8.5)
    .fillColor(COLORS.pageTextLight)
    .font('Helvetica')
    .text(label, x + 8, y + 42, { width: 94, align: 'center' });
}

function checklistItem(text, checked = false) {
  const startY = doc.y;
  const icon = checked ? '☑' : '☐';
  doc.fontSize(13)
    .fillColor(checked ? COLORS.accent : '#cccccc')
    .font('Helvetica')
    .text(icon, 70, startY);
  doc.fontSize(11)
    .fillColor(COLORS.pageTextLight)
    .font('Helvetica')
    .text(text, 95, startY, { width: CONTENT_WIDTH - 35, lineGap: 3 });
  doc.moveDown(0.2);
}

function templateRow(time, activity, notes) {
  const y = doc.y;
  const rowH = 26;
  doc.rect(60, y, CONTENT_WIDTH, rowH).fill(doc.y % 50 < 26 ? '#f8f9fc' : '#ffffff');
  doc.rect(60, y, CONTENT_WIDTH, rowH).stroke('#e2e6ee');

  doc.fontSize(10).fillColor(COLORS.pageText).font('Helvetica-Bold')
    .text(time, 70, y + 7, { width: 80 });
  doc.fontSize(10).fillColor(COLORS.pageTextLight).font('Helvetica')
    .text(activity, 160, y + 7, { width: 200 });
  doc.fontSize(9).fillColor('#999')
    .text(notes, 370, y + 7, { width: 140 });
  doc.y = y + rowH;
}


// ══════════════════════════════════════
// PORTADA
// ══════════════════════════════════════
doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.bg);

// Decorative elements
doc.circle(PAGE_WIDTH - 80, 120, 200).fill('#0d1228');
doc.circle(100, PAGE_HEIGHT - 100, 150).fill('#0d1228');

// Accent line
doc.rect(60, 200, 80, 5).fill(COLORS.accent);

// Title
doc.fontSize(52)
  .fillColor(COLORS.white)
  .font('Helvetica-Bold')
  .text('Reinicia', 60, 230, { width: CONTENT_WIDTH });

doc.fontSize(52)
  .fillColor(COLORS.accent)
  .font('Helvetica-Bold')
  .text('tu Foco', 60, 285, { width: CONTENT_WIDTH });

// Subtitle
doc.fontSize(16)
  .fillColor(COLORS.textSecondary)
  .font('Helvetica')
  .text('Guía práctica para recuperar tu concentración\nen la era de las distracciones digitales', 60, 360, {
    width: CONTENT_WIDTH,
    lineGap: 6,
  });

// Bottom info
doc.fontSize(10)
  .fillColor(COLORS.textSecondary)
  .text('Método de 3 pasos · Plan de 7 días · Ejercicios prácticos', 60, PAGE_HEIGHT - 130, {
    width: CONTENT_WIDTH,
  });

doc.rect(60, PAGE_HEIGHT - 100, CONTENT_WIDTH, 1).fill('#1a2040');

doc.fontSize(9)
  .fillColor('#5a6480')
  .text('© 2026 Reinicia tu Foco. Todos los derechos reservados.', 60, PAGE_HEIGHT - 85, {
    width: CONTENT_WIDTH,
  });

addPageNumber();


// ══════════════════════════════════════
// TABLA DE CONTENIDOS (Page 2)
// ══════════════════════════════════════
newPage();

sectionTitle('Tabla de Contenidos', 90);
doc.moveDown(1);

const tocItems = [
  { num: '01', title: 'La Crisis de Atención Digital', page: '3' },
  { num: '', title: 'Por qué tu cerebro está sobrecargado', page: '4' },
  { num: '', title: 'El costo real de las distracciones', page: '5' },
  { num: '02', title: 'Diagnóstico Digital', page: '7' },
  { num: '', title: 'Test de dependencia digital', page: '8' },
  { num: '', title: 'Mapa de distracciones personal', page: '9' },
  { num: '03', title: 'El Método Reinicia: 3 Pasos', page: '11' },
  { num: '', title: 'Paso 1: Auditoría de Atención', page: '12' },
  { num: '', title: 'Paso 2: Desintoxicación Progresiva', page: '13' },
  { num: '', title: 'Paso 3: Rutina de Enfoque', page: '14' },
  { num: '04', title: 'Plan de 7 Días', page: '16' },
  { num: '', title: 'Día 1 al 7: guía paso a paso', page: '17-23' },
  { num: '05', title: 'Ejercicios Prácticos', page: '24' },
  { num: '06', title: 'Checklist de Desintoxicación Digital', page: '27' },
  { num: '07', title: 'Plantillas de Rutina de Enfoque', page: '29' },
];

tocItems.forEach(item => {
  const y = doc.y;
  const isChapter = item.num !== '';

  if (isChapter) {
    doc.fontSize(8).fillColor(COLORS.accent).font('Helvetica-Bold')
      .text(item.num, 60, y + 2, { width: 30 });
    doc.fontSize(12).fillColor(COLORS.pageText).font('Helvetica-Bold')
      .text(item.title, 95, y, { width: 350 });
  } else {
    doc.fontSize(11).fillColor(COLORS.pageTextLight).font('Helvetica')
      .text(item.title, 95, y, { width: 350 });
  }

  doc.fontSize(11).fillColor(isChapter ? COLORS.pageText : COLORS.pageTextLight)
    .text(item.page, 0, y, { width: PAGE_WIDTH - 60, align: 'right' });

  doc.moveDown(isChapter ? 0.7 : 0.5);
});


// ══════════════════════════════════════
// CAPÍTULO 1: LA CRISIS DE ATENCIÓN DIGITAL
// ══════════════════════════════════════
newPage();
chapterTitle(1, 'La Crisis de\nAtención Digital', 'Entendiendo por qué tu cerebro pierde la batalla contra las notificaciones, las redes sociales y el exceso de información.');

// Page 4 - Content
newPage();
sectionTitle('Tu cerebro no fue diseñado para esto', 80);

bodyText('Estamos viviendo la mayor crisis de atención de la historia humana. Cada día, el ser humano promedio consume más información de la que una persona del siglo XV procesaba en toda su vida.');

bodyText('Tu cerebro evolucionó durante miles de años para enfocarse en una tarea a la vez, detectar cambios en el entorno y responder a estímulos urgentes. Hoy, la tecnología explota exactamente estos mecanismos para mantenerte pegado a la pantalla.');

doc.moveDown(0.5);

// Stats
statCard('150+', 'Veces que revisas\ntu celular al día', doc.y, 60);
statCard('23 min', 'Para recuperar\nel foco perdido', doc.y - 86, 190);
statCard('4.7h', 'Horas perdidas\nen distracciones', doc.y - 86, 320);
statCard('2,617', 'Notificaciones\npor semana', doc.y - 86, 450);

doc.y += 90;
doc.moveDown(1);

subTitle('La economía de la atención');
bodyText('Las redes sociales, las apps y las plataformas de contenido no son gratuitas. Tú pagas con tu atención. Equipos de ingenieros y psicólogos trabajan día y noche para hacer sus productos lo más adictivos posible.');

bodyText('El scroll infinito, las notificaciones push, los puntos rojos de notificación, los algoritmos de recomendación... todo está diseñado con un solo objetivo: que no puedas dejar de mirar.');

doc.moveDown(0.5);
tipBox('Dato clave', 'Un exempleado de Google reveló que las notificaciones de las apps usan los mismos principios psicológicos que las máquinas tragamonedas de los casinos.');

// Page 5 - El costo real
newPage();
sectionTitle('El costo real de las distracciones', 80);

bodyText('Las distracciones digitales no solo te hacen perder tiempo. Tienen un impacto profundo en tu capacidad cognitiva, tu bienestar emocional y tu rendimiento profesional.');

doc.moveDown(0.5);
subTitle('Impacto cognitivo');
bulletPoint('Cada interrupción requiere un promedio de 23 minutos y 15 segundos para recuperar la concentración (Universidad de California).');
bulletPoint('El "multitasking" digital reduce tu IQ efectivo en hasta 10 puntos — más que el efecto de fumar marihuana (Instituto de Psiquiatría de Londres).');
bulletPoint('La exposición constante a notificaciones genera un estado de "atención parcial continua" que impide el pensamiento profundo.');
bulletPoint('Tu memoria de trabajo se reduce significativamente cuando tu celular está visible, incluso si está apagado (Universidad de Texas).');

doc.moveDown(0.5);
subTitle('Impacto emocional');
bulletPoint('Aumento de ansiedad y FOMO (miedo a perderse algo).');
bulletPoint('Reducción de la capacidad de disfrutar momentos presentes.');
bulletPoint('Incremento de la comparación social que afecta la autoestima.');
bulletPoint('Dificultad para tolerar el aburrimiento, que es esencial para la creatividad.');

doc.moveDown(0.5);
warningBox('La paradoja de la productividad', 'Cuanto más tiempo pasas "conectado", menos productivo eres realmente. La sensación de estar ocupado no es lo mismo que avanzar en lo importante.');

// Page 6 - Más contenido introductorio
newPage();
sectionTitle('¿Te identificas con esto?', 80);

bodyText('Antes de seguir, tómate un momento para reflexionar honestamente sobre estas situaciones. Marca las que te ocurren regularmente:');

doc.moveDown(0.5);
checklistItem('Desbloqueas el celular sin razón, solo por costumbre.');
checklistItem('Abres Instagram/TikTok para "ver rápido" y 40 minutos después sigues scrolleando.');
checklistItem('Te cuesta leer un artículo completo sin sentir la urgencia de revisar algo más.');
checklistItem('Sientes ansiedad cuando tu celular no está cerca o se queda sin batería.');
checklistItem('Empiezas una tarea importante y a los 5 minutos ya estás en otra cosa.');
checklistItem('Terminas el día agotado pero sientes que no avanzaste en nada.');
checklistItem('Necesitas ruido o estímulos constantes; el silencio te incomoda.');
checklistItem('Revisas el celular como primera actividad al despertar.');
checklistItem('Te cuesta mantener una conversación sin mirar tu teléfono.');
checklistItem('Sientes que tu capacidad de concentración ha empeorado en los últimos años.');

doc.moveDown(0.8);
bodyText('Si marcaste 3 o más, las distracciones digitales ya están afectando tu vida significativamente. La buena noticia: tiene solución, y no requiere desconectarte del mundo.');

doc.moveDown(0.5);
tipBox('Tu siguiente paso', 'En el próximo capítulo harás un diagnóstico detallado de tus patrones digitales para entender exactamente qué te distrae más y cuánto tiempo te roba.');


// ══════════════════════════════════════
// CAPÍTULO 2: DIAGNÓSTICO DIGITAL
// ══════════════════════════════════════
newPage();
chapterTitle(2, 'Diagnóstico\nDigital', 'Antes de cambiar algo, necesitas datos reales. En este capítulo mapearás exactamente tus patrones de distracción.');

// Page 8
newPage();
sectionTitle('Test de Dependencia Digital', 80);

bodyText('Responde cada pregunta con una puntuación del 1 (nunca) al 5 (siempre). Sé honesto — este test es solo para ti.');

doc.moveDown(0.5);

const testQuestions = [
  '¿Revisas tu celular dentro de los primeros 10 minutos al despertar?',
  '¿Sientes ansiedad cuando no puedes acceder a tu teléfono?',
  '¿Pasas más tiempo en redes sociales del que planeas?',
  '¿Te resulta difícil completar una tarea sin interrumpirte para revisar notificaciones?',
  '¿Usas el celular mientras comes, caminas o mantienes conversaciones?',
  '¿Revisas repetidamente las mismas apps aunque no haya nada nuevo?',
  '¿Tu último pensamiento antes de dormir involucra una pantalla?',
  '¿Sientes que no puedes concentrarte como lo hacías hace algunos años?',
  '¿Has intentado reducir tu tiempo en pantalla sin éxito?',
  '¿El ruido de una notificación te genera urgencia de revisarla inmediatamente?',
];

testQuestions.forEach((q, i) => {
  const y = doc.y;
  doc.fontSize(10)
    .fillColor(COLORS.chapterAccent)
    .font('Helvetica-Bold')
    .text(`${i + 1}.`, 60, y, { width: 25 });
  doc.fontSize(10.5)
    .fillColor(COLORS.pageTextLight)
    .font('Helvetica')
    .text(q, 85, y, { width: CONTENT_WIDTH - 100 });

  // Score boxes
  for (let s = 1; s <= 5; s++) {
    doc.roundedRect(430 + (s - 1) * 22, y - 1, 18, 18, 3)
      .strokeColor('#dde1e8').stroke();
    doc.fontSize(7.5).fillColor('#aaa').font('Helvetica')
      .text(s.toString(), 430 + (s - 1) * 22, y + 3, { width: 18, align: 'center' });
  }
  doc.moveDown(0.5);
});

doc.moveDown(0.5);

bodyText('RESULTADOS:\n• 10-20 puntos: Relación saludable con la tecnología\n• 21-30 puntos: Señales de alerta — hábitos que puedes mejorar\n• 31-40 puntos: Dependencia moderada — necesitas actuar\n• 41-50 puntos: Dependencia alta — este plan es urgente para ti');

// Page 9
newPage();
sectionTitle('Mapa de Distracciones Personal', 80);

bodyText('Completa este mapa para entender exactamente dónde se va tu tiempo y atención. Úsalo durante 2-3 días para tener datos reales.');

doc.moveDown(0.5);
subTitle('Paso 1: Registra tu tiempo en pantalla');
bodyText('Revisa las estadísticas de tu celular (iOS: Tiempo en Pantalla / Android: Bienestar Digital) y anota:');

doc.moveDown(0.3);
bulletPoint('Tiempo total de pantalla diario: _______ horas');
bulletPoint('App #1 más usada: _____________ (_____ min/día)');
bulletPoint('App #2 más usada: _____________ (_____ min/día)');
bulletPoint('App #3 más usada: _____________ (_____ min/día)');
bulletPoint('Número de desbloqueos diarios: _______');
bulletPoint('Notificaciones recibidas por día: _______');

doc.moveDown(0.5);
subTitle('Paso 2: Identifica tus disparadores');
bodyText('Un disparador es lo que te lleva a tomar el celular o distraerte. Los más comunes son:');

doc.moveDown(0.3);
bulletPoint('Aburrimiento: tomas el celular cuando no tienes estímulos.');
bulletPoint('Ansiedad: revisas notificaciones para sentir control.');
bulletPoint('Procrastinación: usas el celular para evitar tareas difíciles.');
bulletPoint('Hábito: lo haces sin pensar, de forma automática.');
bulletPoint('Social: ves que otros están en el celular y tú también.');

doc.moveDown(0.5);
subTitle('Paso 3: Calcula el costo');
bodyText('Si pierdes 4 horas diarias en distracciones digitales no productivas:');
bulletPoint('Son 28 horas por semana — básicamente un trabajo de medio tiempo.');
bulletPoint('Son 120 horas al mes — casi 2 semanas laborales completas.');
bulletPoint('Son 1,460 horas al año — el equivalente a 9 meses de trabajo.');

doc.moveDown(0.5);
tipBox('Reflexión', 'Si recuperaras aunque sea la MITAD de ese tiempo, ¿qué harías con 730 horas extra al año? ¿Qué proyecto empezarías? ¿Qué aprenderías?');

// Page 10 - Más diagnóstico
newPage();
sectionTitle('Tu Perfil de Distracción', 80);

bodyText('Basándote en tu diagnóstico, identifica cuál es tu perfil predominante:');

doc.moveDown(0.8);

numberedItem(1, 'El Scrolleador Compulsivo',
  'Tu debilidad son las redes sociales. Abres Instagram, TikTok o Twitter "un segundo" y pierdes 30+ minutos sin darte cuenta. Tu estrategia principal debe ser crear barreras de acceso a estas apps.');

numberedItem(2, 'El Notificador Ansioso',
  'Sientes urgencia cada vez que suena una notificación. No puedes ignorarlas. Tu estrategia debe enfocarse en desactivar el 90% de las notificaciones y establecer horarios de revisión.');

numberedItem(3, 'El Multitasker Caótico',
  'Intentas hacer 5 cosas a la vez: trabajar, chatear, ver videos, revisar email. Nunca terminas nada porque siempre saltas a otra cosa. Tu estrategia es trabajar en bloques monotarea.');

numberedItem(4, 'El Consumidor Infinito',
  'Tu problema es el contenido: artículos, videos, podcasts, newsletters. Siempre hay algo más para consumir. Tu estrategia es limitar las fuentes y crear horarios de consumo.');

doc.moveDown(0.5);
bodyText('La mayoría de las personas son una combinación de 2-3 perfiles. Identifica tus dos perfiles principales y tenlos en mente para el siguiente capítulo, donde aplicarás el método diseñado para tu situación.');


// ══════════════════════════════════════
// CAPÍTULO 3: EL MÉTODO REINICIA - 3 PASOS
// ══════════════════════════════════════
newPage();
chapterTitle(3, 'El Método Reinicia:\n3 Pasos', 'Un sistema simple y progresivo para recuperar tu capacidad de concentración sin desconectarte del mundo.');

// Page 12 - Paso 1
newPage();
sectionTitle('Paso 1: Auditoría de Atención', 80);

bodyText('El primer paso no es cambiar nada. Es observar. Durante 48 horas, vas a llevar un registro consciente de cada vez que te distraes.');

doc.moveDown(0.5);
subTitle('Cómo hacer tu Auditoría');

numberedItem(1, 'El Registro de Interrupciones',
  'Cada vez que te descubras revisando el celular o distrayéndote de una tarea, anota: la hora, qué estabas haciendo, qué te distrajo y cuánto tiempo perdiste.');

numberedItem(2, 'Los Momentos Críticos',
  'Identifica en qué momentos del día eres más vulnerable a las distracciones. Para la mayoría es: al despertar, después de comer y al final de la jornada laboral.');

numberedItem(3, 'Las Emociones Detrás',
  'Registra qué sentías justo antes de distraerte. ¿Aburrimiento? ¿Estrés? ¿Cansancio? Esto te revelará tus disparadores emocionales.');

doc.moveDown(0.5);
tipBox('Herramienta práctica', 'Usa una libreta pequeña o la app de notas de tu celular. Cada registro es una línea: "10:30 | Trabajando en informe | Abrí Instagram | Aburrimiento | 15min perdidos".');

doc.moveDown(0.5);
bodyText('Al final de las 48 horas tendrás datos reales sobre tus patrones. No te juzgues — la información es poder. Cuanto más honesto seas, mejor funcionará el método.');

// Page 13 - Paso 2
newPage();
sectionTitle('Paso 2: Desintoxicación Progresiva', 80);

bodyText('No vamos a pedirte que borres todas tus apps ni que pongas tu celular en un cajón. La clave es la reducción progresiva y la creación de barreras inteligentes.');

doc.moveDown(0.5);
subTitle('Nivel 1: Limpia tu entorno digital (Días 1-2)');
bulletPoint('Desactiva TODAS las notificaciones excepto llamadas y mensajes de personas importantes.');
bulletPoint('Elimina las apps de redes sociales de tu pantalla principal — muévelas a una carpeta en la última página.');
bulletPoint('Activa el modo "No Molestar" durante tus horas de trabajo o estudio.');
bulletPoint('Desuscríbete de newsletters que no lees (usa unroll.me).');

doc.moveDown(0.5);
subTitle('Nivel 2: Crea barreras de acceso (Días 3-4)');
bulletPoint('Establece límites de tiempo en apps adictivas (30 min/día máximo por app).');
bulletPoint('Configura la pantalla en escala de grises — los colores vibrantes son parte del diseño adictivo.');
bulletPoint('Usa bloqueadores de sitios web durante horas de trabajo (Freedom, Cold Turkey, Forest).');
bulletPoint('Apaga las previsualizaciones de notificaciones en la pantalla de bloqueo.');

doc.moveDown(0.5);
subTitle('Nivel 3: Sustituye hábitos (Días 5-7)');
bulletPoint('Reemplaza "revisar el celular al despertar" por 5 minutos de respiración o lectura.');
bulletPoint('Cuando sientas el impulso de scrollear, haz 10 respiraciones profundas primero.');
bulletPoint('Sustituye el consumo pasivo (ver videos) por actividades que te den energía.');
bulletPoint('Crea una "hora sagrada" diaria donde tu celular está en otra habitación.');

// Page 14 - Paso 3
newPage();
sectionTitle('Paso 3: Rutina de Enfoque', 80);

bodyText('El objetivo final no es usar menos tecnología — es proteger tu capacidad de hacer trabajo profundo. Esta rutina transforma tu día para que las distracciones no tengan espacio.');

doc.moveDown(0.5);
subTitle('La Técnica de Bloques de Enfoque');
bodyText('Divide tu día en bloques de 90 minutos de trabajo enfocado, seguidos de descansos de 15-20 minutos. Durante cada bloque:');

doc.moveDown(0.3);
bulletPoint('Elige UNA sola tarea para todo el bloque.', '1.');
bulletPoint('Pon tu celular fuera de tu alcance visual.', '2.');
bulletPoint('Cierra todas las pestañas del navegador que no sean necesarias.', '3.');
bulletPoint('Usa un temporizador visible (no tu celular).', '4.');
bulletPoint('Si te llega un pensamiento o tarea, anótalo en un papel y sigue.', '5.');

doc.moveDown(0.5);
subTitle('La Regla de los 2 Minutos');
bodyText('Cuando sientas el impulso de revisar tu celular, espera 2 minutos. Solo 2 minutos. La mayoría de los impulsos desaparecen en menos de 120 segundos. Este simple hábito te devuelve el control de tus decisiones.');

doc.moveDown(0.5);
subTitle('El Ritual de Cierre');
bodyText('Al terminar tu jornada de trabajo, realiza un ritual de cierre:\n• Revisa qué completaste hoy\n• Anota las 3 prioridades de mañana\n• Marca tu última revisión de email/mensajes\n• Cierra la laptop/apaga notificaciones de trabajo\n\nEsto le dice a tu cerebro: "Se acabó. Ya puedes descansar."');

doc.moveDown(0.5);
tipBox('Progreso, no perfección', 'No necesitas hacer todo perfecto desde el día 1. Empieza con un bloque de enfoque al día e incrementa gradualmente. La consistencia gana.');


// ══════════════════════════════════════
// CAPÍTULO 4: PLAN DE 7 DÍAS
// ══════════════════════════════════════
newPage();
chapterTitle(4, 'Plan de\n7 Días', 'Tu guía paso a paso para la primera semana. Cada día tiene objetivos claros, acciones específicas y una meta medible.');

// Días 1 y 2
newPage();
sectionTitle('Día 1: Conciencia', 80);
bodyText('Hoy no cambias nada. Solo observas.');
doc.moveDown(0.3);
subTitle('Objetivos del día');
bulletPoint('Revisar tu tiempo en pantalla actual y anotarlo.', '→');
bulletPoint('Hacer el Test de Dependencia Digital (capítulo 2).', '→');
bulletPoint('Empezar tu Registro de Interrupciones: cada vez que te distraigas, anótalo.', '→');
bulletPoint('Identificar tus 3 apps más adictivas y tu perfil de distracción.', '→');

doc.moveDown(0.5);
bodyText('Meta del día: Tener un número real de cuántas veces te distraes y cuánto tiempo pierdes. Sin juicio, solo datos.');

doc.moveDown(0.5);
drawSectionDivider(doc.y);
doc.moveDown(1);

sectionTitle('Día 2: Limpieza Digital');
bodyText('Hoy empiezas a limpiar tu entorno digital.');
doc.moveDown(0.3);
subTitle('Objetivos del día');
bulletPoint('Desactivar TODAS las notificaciones no esenciales.', '→');
bulletPoint('Mover apps de redes sociales fuera de la pantalla principal.', '→');
bulletPoint('Desuscribirte de 10+ newsletters que no lees.', '→');
bulletPoint('Configurar "No Molestar" automático en horas de trabajo.', '→');

doc.moveDown(0.5);
bodyText('Meta del día: Un entorno digital más limpio que no te bombardee con estímulos innecesarios.');

// Días 3 y 4
newPage();
sectionTitle('Día 3: Primera Barrera', 80);
bodyText('Hoy creas tu primera barrera contra las distracciones.');
doc.moveDown(0.3);
subTitle('Objetivos del día');
bulletPoint('Establecer límites de tiempo (30 min/día) para tus 3 apps más adictivas.', '→');
bulletPoint('Hacer tu primer bloque de enfoque de 45 minutos.', '→');
bulletPoint('Practicar la Regla de los 2 Minutos cuando sientas impulso de tomar el celular.', '→');
bulletPoint('Registrar cuántas veces aplicaste la regla y si funcionó.', '→');

doc.moveDown(0.5);
bodyText('Meta del día: Completar 1 bloque de enfoque sin interrupciones digitales.');

doc.moveDown(0.5);
drawSectionDivider(doc.y);
doc.moveDown(1);

sectionTitle('Día 4: Sustitución');
bodyText('Hoy empiezas a reemplazar hábitos digitales por alternativas beneficiosas.');
doc.moveDown(0.3);
subTitle('Objetivos del día');
bulletPoint('Reemplazar la primera actividad de la mañana (celular) por 5 min de respiración o lectura.', '→');
bulletPoint('Hacer 2 bloques de enfoque de 45 minutos.', '→');
bulletPoint('Practicar una actividad de descanso sin pantalla (caminar, estirar).', '→');
bulletPoint('Reducir el tiempo en pantalla un 20% respecto al Día 1.', '→');

doc.moveDown(0.5);
bodyText('Meta del día: Pasar tu primera mañana sin celular como primera actividad.');

// Días 5 y 6
newPage();
sectionTitle('Día 5: Profundización', 80);
bodyText('Hoy incrementas la intensidad de tus bloques de enfoque.');
doc.moveDown(0.3);
subTitle('Objetivos del día');
bulletPoint('Hacer 2 bloques de enfoque de 60 minutos.', '→');
bulletPoint('Crear tu "hora sagrada": 1 hora con el celular en otra habitación.', '→');
bulletPoint('Activar escala de grises en tu celular.', '→');
bulletPoint('Identificar y eliminar 3 fuentes de contenido que no aportan valor.', '→');

doc.moveDown(0.5);
bodyText('Meta del día: Experimentar 1 hora completa sin tu celular y notar cómo te sientes.');

doc.moveDown(0.5);
drawSectionDivider(doc.y);
doc.moveDown(1);

sectionTitle('Día 6: Consolidación');
bodyText('Hoy consolidas los nuevos hábitos y optimizas tu sistema.');
doc.moveDown(0.3);
subTitle('Objetivos del día');
bulletPoint('Hacer 3 bloques de enfoque (60-90 minutos cada uno).', '→');
bulletPoint('Implementar tu Ritual de Cierre al terminar la jornada.', '→');
bulletPoint('Revisar tu progreso: comparar tu tiempo en pantalla con el Día 1.', '→');
bulletPoint('Instalar un bloqueador de sitios web para tus horas de trabajo.', '→');

doc.moveDown(0.5);
bodyText('Meta del día: Completar 3 bloques de enfoque y cerrar el día con el ritual.');

// Día 7
newPage();
sectionTitle('Día 7: Celebración y Sistema', 80);
bodyText('¡Último día del plan! Hoy integras todo en un sistema sostenible.');
doc.moveDown(0.3);
subTitle('Objetivos del día');
bulletPoint('Hacer 3 bloques de enfoque de 90 minutos.', '→');
bulletPoint('Comparar tus métricas del Día 1 con las de hoy.', '→');
bulletPoint('Diseñar tu Rutina de Enfoque semanal usando las plantillas.', '→');
bulletPoint('Celebrar tu progreso — has dado un paso enorme.', '→');

doc.moveDown(0.5);
bodyText('Meta del día: Tener tu sistema personalizado listo para seguir usándolo más allá de esta semana.');

doc.moveDown(0.8);

subTitle('Tu progreso esperado después de 7 días');
doc.moveDown(0.3);
bulletPoint('Tiempo en pantalla reducido un 30-50%.');
bulletPoint('Capacidad de mantener enfoque durante 60-90 minutos seguidos.');
bulletPoint('Rutina matutina sin celular establecida.');
bulletPoint('Menos ansiedad por notificaciones y FOMO.');
bulletPoint('Mayor sensación de productividad y satisfacción al final del día.');
bulletPoint('Un sistema claro que puedes seguir usando indefinidamente.');

doc.moveDown(0.5);
tipBox('¿Y después del día 7?', 'Los hábitos tardan 21-66 días en consolidarse. Sigue con tu sistema durante al menos 3 semanas más. Usa las plantillas del capítulo 7 para mantener la consistencia.');


// ══════════════════════════════════════
// CAPÍTULO 5: EJERCICIOS PRÁCTICOS
// ══════════════════════════════════════
newPage();
chapterTitle(5, 'Ejercicios\nPrácticos', 'Actividades de 10-15 minutos diseñadas para reprogramar tu relación con la tecnología. Haz uno cada día.');

newPage();
sectionTitle('Ejercicio 1: La Pausa de 60 Segundos', 80);
bodyText('Antes de desbloquear tu celular, haz una pausa de 60 segundos. Durante esos 60 segundos:');
doc.moveDown(0.3);
bulletPoint('Pregúntate: "¿Para qué estoy abriendo el celular?"', '1.');
bulletPoint('Si no tienes una razón clara, guárdalo.', '2.');
bulletPoint('Si tienes una razón, establece un tiempo límite antes de empezar.', '3.');
doc.moveDown(0.3);
bodyText('Este ejercicio interrumpe el piloto automático. La mayoría de las veces que abres tu celular no hay una razón real.');

doc.moveDown(0.8);
sectionTitle('Ejercicio 2: El Inventario de Atención');
bodyText('Al final de cada día, dedica 5 minutos a responder:');
doc.moveDown(0.3);
bulletPoint('¿Cuáles fueron mis 3 logros más importantes hoy?');
bulletPoint('¿Cuántos bloques de enfoque completé?');
bulletPoint('¿En qué momento perdí más tiempo en distracciones?');
bulletPoint('¿Qué emoción estaba sintiendo cuando me distraje?');
bulletPoint('¿Qué haré diferente mañana?');

doc.moveDown(0.8);
sectionTitle('Ejercicio 3: La Caminata sin Pantalla');
bodyText('Sal a caminar 15-20 minutos SIN tu celular (o con él en modo avión). Observa tu entorno, escucha los sonidos, siente el clima. Este ejercicio recalibra tu sistema nervioso y entrena tu cerebro para disfrutar sin estímulos digitales.');

doc.moveDown(0.3);
bodyText('Si te parece imposible dejar tu celular: esa sensación confirma por qué necesitas este ejercicio.');

// Page 26
newPage();
sectionTitle('Ejercicio 4: Meditación de Enfoque (5 min)', 80);
bodyText('Esta meditación rápida entrena tu "músculo de la atención":');
doc.moveDown(0.3);
numberedItem(1, 'Siéntate cómodo y cierra los ojos',
  'Elige un lugar tranquilo. No necesitas una posición especial, solo estar cómodo.');
numberedItem(2, 'Enfócate en tu respiración',
  'Cuenta cada inhalación. 1... 2... 3... hasta 10. Luego vuelve a empezar.');
numberedItem(3, 'Cuando tu mente divague, vuelve',
  'No te frustres. Cada vez que notas que tu mente se fue y vuelves a la respiración, estás fortaleciendo tu enfoque. Es como hacer una repetición en el gimnasio.');
numberedItem(4, 'Incrementa gradualmente',
  'Empieza con 5 minutos y añade 1 minuto por semana hasta llegar a 15-20 minutos.');

doc.moveDown(0.5);

sectionTitle('Ejercicio 5: El Día de Bajo Estímulo');
bodyText('Una vez por semana (ideal: domingo), practica un día de bajo estímulo digital:');
doc.moveDown(0.3);
bulletPoint('Máximo 30 minutos de redes sociales en todo el día.');
bulletPoint('Nada de scroll pasivo — solo interacciones intencionales.');
bulletPoint('Reemplaza el tiempo de pantalla con: lectura, ejercicio, cocinar, socializar en persona, escribir.');
bulletPoint('Nota cómo te sientes al final del día comparado con uno "normal".');

doc.moveDown(0.5);
tipBox('Dato científico', 'Estudios muestran que un solo día de reducción digital a la semana puede reducir los niveles de cortisol (hormona del estrés) en un 23%.');


// ══════════════════════════════════════
// CAPÍTULO 6: CHECKLIST DE DESINTOXICACIÓN
// ══════════════════════════════════════
newPage();
chapterTitle(6, 'Checklist de\nDesintoxicación\nDigital', 'Tu lista paso a paso para limpiar tu entorno digital. Imprime esta página y ve marcando cada acción completada.');

newPage();
sectionTitle('Checklist del Celular', 80);
doc.moveDown(0.3);
checklistItem('Revisar y anotar mi tiempo en pantalla actual');
checklistItem('Desactivar notificaciones de redes sociales');
checklistItem('Desactivar notificaciones de email');
checklistItem('Desactivar previsualizaciones en pantalla de bloqueo');
checklistItem('Mover apps de redes sociales a última página o carpeta');
checklistItem('Eliminar apps que llevo meses sin usar');
checklistItem('Configurar límites de tiempo para apps adictivas');
checklistItem('Activar "No Molestar" automático en horario laboral');
checklistItem('Programar modo "No Molestar" nocturno (22:00 - 07:00)');
checklistItem('Activar escala de grises (al menos durante horas de trabajo)');
checklistItem('Desactivar autoplay de videos');
checklistItem('Configurar un fondo de pantalla minimalista y no estimulante');

doc.moveDown(0.8);
sectionTitle('Checklist del Computador');
doc.moveDown(0.3);
checklistItem('Cerrar todas las pestañas innecesarias del navegador');
checklistItem('Instalar un bloqueador de sitios web (Freedom, Cold Turkey)');
checklistItem('Desactivar notificaciones del navegador');
checklistItem('Cerrar apps de chat durante bloques de enfoque');
checklistItem('Desactivar el autoplay en YouTube y plataformas de streaming');
checklistItem('Limpiar el escritorio: máximo 5 archivos visibles');
checklistItem('Organizar marcadores: eliminar los que llevas meses sin usar');
checklistItem('Configurar bloques de enfoque en tu calendario');

doc.moveDown(0.8);
sectionTitle('Checklist de Hábitos');
doc.moveDown(0.3);
checklistItem('No revisar el celular durante los primeros 30 minutos del día');
checklistItem('No llevar el celular al baño');
checklistItem('No usar pantallas durante las comidas');
checklistItem('Establecer un horario fijo para revisar email (2-3 veces al día)');
checklistItem('Establecer un horario fijo para redes sociales (1 vez al día)');
checklistItem('Crear una rutina matutina de 10 min sin pantallas');
checklistItem('Implementar el Ritual de Cierre al final de cada jornada');
checklistItem('Practicar la Regla de los 2 Minutos ante cada impulso');


// ══════════════════════════════════════
// CAPÍTULO 7: PLANTILLAS DE RUTINA
// ══════════════════════════════════════
newPage();
chapterTitle(7, 'Plantillas de\nRutina de\nEnfoque', 'Templates listos para usar. Personaliza tu día alrededor de bloques de concentración profunda.');

newPage();
sectionTitle('Plantilla 1: Rutina Matutina sin Pantallas', 80);
bodyText('Las primeras acciones del día programan tu cerebro para el resto de la jornada. Usa esta plantilla para empezar con enfoque:');
doc.moveDown(0.5);

// Table header
const y = doc.y;
doc.rect(60, y, CONTENT_WIDTH, 26).fill(COLORS.chapterAccent);
doc.fontSize(10).fillColor(COLORS.white).font('Helvetica-Bold')
  .text('Hora', 70, y + 7, { width: 80 })
  .text('Actividad', 160, y + 7, { width: 200 })
  .text('Notas', 370, y + 7, { width: 140 });
doc.y = y + 26;

templateRow('6:00', 'Despertar (sin celular)', 'Alarma convencional');
templateRow('6:05', '5 min respiración / meditación', 'Sentado en la cama');
templateRow('6:10', 'Hidratación + movimiento', 'Vaso grande de agua');
templateRow('6:20', 'Ejercicio ligero (10 min)', 'Estiramientos o caminata');
templateRow('6:30', 'Desayuno SIN pantallas', 'Presente y consciente');
templateRow('6:50', 'Lectura (10 min)', 'Libro físico preferido');
templateRow('7:00', 'Planificar el día (5 min)', 'Libreta o planificador');
templateRow('7:05', 'Primera revisión de celular', 'Solo mensajes urgentes');
templateRow('7:15', 'Inicio del primer bloque de enfoque', '90 min de trabajo profundo');

doc.moveDown(1);

sectionTitle('Plantilla 2: Jornada con Bloques de Enfoque');
bodyText('Organiza tu día de trabajo/estudio en bloques que protejan tu concentración:');
doc.moveDown(0.5);

const y2 = doc.y;
doc.rect(60, y2, CONTENT_WIDTH, 26).fill(COLORS.chapterAccent);
doc.fontSize(10).fillColor(COLORS.white).font('Helvetica-Bold')
  .text('Hora', 70, y2 + 7, { width: 80 })
  .text('Actividad', 160, y2 + 7, { width: 200 })
  .text('Notas', 370, y2 + 7, { width: 140 });
doc.y = y2 + 26;

templateRow('7:15', 'BLOQUE 1 — Trabajo profundo', '90 min · Celular fuera');
templateRow('8:45', 'Descanso activo', '15 min · Sin pantallas');
templateRow('9:00', 'Revisión de mensajes/email', '15 min máximo');
templateRow('9:15', 'BLOQUE 2 — Trabajo profundo', '90 min · Tarea principal');
templateRow('10:45', 'Descanso + snack', '20 min · Caminar');
templateRow('11:05', 'BLOQUE 3 — Tareas secundarias', '60 min · Email, admin');
templateRow('12:05', 'Almuerzo SIN pantallas', '45 min · Desconexión total');
templateRow('12:50', 'BLOQUE 4 — Trabajo creativo', '90 min · Proyecto personal');
templateRow('14:20', 'Revisión final de mensajes', '15 min');
templateRow('14:35', 'Ritual de Cierre', '10 min · Preparar mañana');

// Page 31 - Plantilla semanal
newPage();
sectionTitle('Plantilla 3: Tracker Semanal de Enfoque', 80);
bodyText('Imprime esta planilla y llévala contigo durante la semana. Es tu herramienta de seguimiento.');
doc.moveDown(0.5);

// Weekly tracker
const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const metrics = [
  'Bloques de enfoque completados',
  'Tiempo en pantalla (horas)',
  'Veces que apliqué Regla de 2 min',
  'Mañana sin celular (Sí/No)',
  'Ritual de cierre (Sí/No)',
  'Nivel de energía (1-10)',
  'Satisfacción del día (1-10)',
];

// Table header
const y3 = doc.y;
doc.rect(60, y3, CONTENT_WIDTH, 24).fill(COLORS.chapterAccent);
doc.fontSize(8).fillColor(COLORS.white).font('Helvetica-Bold')
  .text('Métrica', 65, y3 + 7, { width: 180 });

days.forEach((day, i) => {
  doc.fontSize(8).fillColor(COLORS.white).font('Helvetica-Bold')
    .text(day, 250 + i * 36, y3 + 7, { width: 34, align: 'center' });
});
doc.y = y3 + 24;

metrics.forEach((metric, mi) => {
  const ry = doc.y;
  doc.rect(60, ry, CONTENT_WIDTH, 30).fill(mi % 2 === 0 ? '#f8f9fc' : '#ffffff');
  doc.rect(60, ry, CONTENT_WIDTH, 30).strokeColor('#e2e6ee').stroke();

  doc.fontSize(8.5).fillColor(COLORS.pageTextLight).font('Helvetica')
    .text(metric, 65, ry + 9, { width: 180 });

  days.forEach((_, i) => {
    doc.roundedRect(255 + i * 36, ry + 6, 24, 18, 3).strokeColor('#ddd').stroke();
  });
  doc.y = ry + 30;
});

doc.moveDown(1.5);

sectionTitle('Plantilla 4: Registro de Mejora Continua');
bodyText('Al final de cada semana, reflexiona sobre tu progreso respondiendo estas preguntas:');
doc.moveDown(0.5);

bulletPoint('¿Cuántos bloques de enfoque completé esta semana? ___/___');
bulletPoint('¿Mi tiempo en pantalla aumentó o disminuyó vs. la semana pasada? _______');
bulletPoint('¿Cuál fue mi mayor distracción esta semana? _______');
bulletPoint('¿Qué estrategia me funcionó mejor? _______');
bulletPoint('¿Qué ajustaré la próxima semana? _______');
bulletPoint('Del 1 al 10, ¿cómo califico mi nivel de enfoque general? ___');


// ══════════════════════════════════════
// PÁGINA DE CIERRE
// ══════════════════════════════════════
newPage();
doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.bg);

doc.rect(60, 200, 80, 5).fill(COLORS.accent);

doc.fontSize(32)
  .fillColor(COLORS.white)
  .font('Helvetica-Bold')
  .text('Tu concentración te\nestá esperando.', 60, 230, { width: CONTENT_WIDTH, lineGap: 6 });

doc.fontSize(14)
  .fillColor(COLORS.textSecondary)
  .font('Helvetica')
  .text('Cada día que aplicas estos principios, tu cerebro se reconfigura.\nLa concentración no es un talento — es un músculo que se entrena.\n\nYa tienes todas las herramientas. Ahora el siguiente paso es tuyo.', 60, 330, {
    width: CONTENT_WIDTH,
    lineGap: 8,
  });

doc.fontSize(20)
  .fillColor(COLORS.accent)
  .font('Helvetica-Bold')
  .text('Reinicia tu Foco.', 60, 460, { width: CONTENT_WIDTH });

doc.fontSize(11)
  .fillColor(COLORS.textSecondary)
  .font('Helvetica')
  .text('Si esta guía te ayudó, compártela con alguien que\ntambién esté luchando con las distracciones digitales.\nJuntos podemos recuperar nuestra atención.', 60, 510, {
    width: CONTENT_WIDTH,
    lineGap: 6,
  });

// Footer
doc.fontSize(9)
  .fillColor('#5a6480')
  .text('© 2026 Reinicia tu Foco. Todos los derechos reservados.', 60, PAGE_HEIGHT - 85, {
    width: CONTENT_WIDTH,
  });


// ── Finalizar ──
doc.end();

stream.on('finish', () => {
  console.log(`\n✅ PDF generado exitosamente: ${outputPath}`);
  console.log(`📄 Total de páginas: ${pageNumber + 1}`);
  console.log(`📦 Tamaño: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
});
