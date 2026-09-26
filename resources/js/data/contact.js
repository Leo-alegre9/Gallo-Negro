export const contact = {
 phone: '1135879396',
 phoneLabel: '11 3587-9396',
 email: 'ventas@gallonegroba.com.ar',
 address: 'Villa Udaondo 4560, Ituzaingó, Provincia de Buenos Aires',
 street: 'Villa Udaondo 4560',
 city: 'Ituzaingó, Buenos Aires',
 hours: 'Lunes a viernes, de 8 a 16 h',
 instagram: 'https://www.instagram.com/gallonegroba/',
 // Horario de atención en hora de Buenos Aires (0 = domingo … 6 = sábado).
 schedule: { timeZone: 'America/Argentina/Buenos_Aires', days: [1, 2, 3, 4, 5], opens: 8, closes: 16 },
};

const weekdays = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

// Dice si el taller está atendiendo en este momento y, si no, cuándo vuelve a abrir.
export function openingStatus(date = new Date(), schedule = contact.schedule) {
 const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: schedule.timeZone, weekday: 'short', hour: 'numeric', hourCycle: 'h23' })
  .formatToParts(date).map(part => [part.type, part.value]));
 const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
 const hour = Number(parts.hour);
 const worksToday = schedule.days.includes(day);

 if (worksToday && hour >= schedule.opens && hour < schedule.closes) {
  return { open: true, label: 'Abierto ahora', detail: `Atendemos hasta las ${schedule.closes} h` };
 }
 if (worksToday && hour < schedule.opens) {
  return { open: false, label: 'Cerrado', detail: `Abrimos hoy a las ${schedule.opens} h` };
 }
 let next = 1;
 while (!schedule.days.includes((day + next) % 7)) next++;
 const when = next === 1 ? 'mañana' : `el ${weekdays[(day + next) % 7]}`;
 return { open: false, label: 'Cerrado', detail: `Abrimos ${when} a las ${schedule.opens} h` };
}
