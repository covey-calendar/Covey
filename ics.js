import ICAL from 'ical.js';

const pad = n => String(n).padStart(2, '0');
const iso = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
const ymd = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
const hms = d => `${pad(d.getHours())}${pad(d.getMinutes())}00`;
const esc = s => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

export const isoDate = d => iso(d.getFullYear(), d.getMonth() + 1, d.getDate());

// Build a single-event .ics. Times are "floating" (same wall-clock time on every device).
export function buildICS({ uid, title, date, time, endTime, member, members, personId, personIds, alarm }) {
  const [y, mo, da] = date.split('-').map(Number);
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  let when;
  if (time) {
    const [h, mi] = time.split(':').map(Number);
    const start = new Date(y, mo - 1, da, h, mi);
    const [eh, emi] = (endTime || "").split(":").map(Number);
    const end = endTime
      ? new Date(y, mo - 1, da, eh, emi)
      : new Date(y, mo - 1, da, h + 1, mi);
    when = [`DTSTART:${ymd(start)}T${hms(start)}`, `DTEND:${ymd(end)}T${hms(end)}`];
  } else {
    when = [`DTSTART;VALUE=DATE:${ymd(new Date(y, mo - 1, da))}`, `DTEND;VALUE=DATE:${ymd(new Date(y, mo - 1, da + 1))}`];
  }
  const assignedIds = Array.isArray(personIds) ? personIds : personId ? [personId] : [];
  const categoryNames = Array.isArray(members) ? members : member ? [member] : [];
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Gaggle//Family Calendar//EN', 'BEGIN:VEVENT',
    `UID:${uid}`, `DTSTAMP:${stamp}`, `SUMMARY:${esc(title)}`,
    ...(categoryNames.length ? [`CATEGORIES:${categoryNames.map(esc).join(',')}`] : []),
    ...(assignedIds.length ? [`X-COVEY-PERSON-ID:${esc(assignedIds[0])}`, `X-COVEY-PERSON-IDS:${assignedIds.join('|')}`] : []),
    ...when,
    ...(alarm ? ['BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Reminder', `TRIGGER:${time ? 'PT0S' : 'PT9H'}`, 'END:VALARM'] : []),
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n') + '\r\n';
}

function fields(t) {
  if (t.isDate) return { d: iso(t.year, t.month, t.day), tm: '' };
  if (t.zone && t.zone.tzid === 'floating') return { d: iso(t.year, t.month, t.day), tm: `${pad(t.hour)}:${pad(t.minute)}` };
  const j = t.toJSDate(); // TZID / UTC events -> server's local time (set TZ if needed)
  return { d: isoDate(j), tm: `${pad(j.getHours())}:${pad(j.getMinutes())}` };
}

const endOf = (endT, f) => { try { const e = fields(endT); return e.d === f.d ? e.tm : '23:59'; } catch { return ''; } };

// Turn one CalDAV object into events between two YYYY-MM-DD strings (inclusive).
export function parseEvents(obj, from, to) {
  const out = [];
  let comp;
  try {
    comp = new ICAL.Component(ICAL.parse(obj.data));
    for (const tz of comp.getAllSubcomponents('vtimezone')) {
      try { ICAL.TimezoneService.register(tz); } catch {}
    }
  } catch { return out; }
  for (const vevent of comp.getAllSubcomponents('vevent')) {
    try {
      const ev = new ICAL.Event(vevent);
      if (ev.isRecurrenceException()) continue;
      const categories = vevent
        .getFirstProperty('categories')
        ?.getValues()
        .map(String) || [];
      const legacyPersonId = String(vevent.getFirstPropertyValue('x-covey-person-id') || '');
      const storedPersonIds = String(vevent.getFirstPropertyValue('x-covey-person-ids') || '')
        .split('|')
        .filter(Boolean);
      const base = {
        id: obj.url,
        url: obj.url,
        etag: obj.etag,
        t: ev.summary || '(no title)',
        location: String(vevent.getFirstPropertyValue('location') || ''),
        notes: String(vevent.getFirstPropertyValue('description') || ''),
        m: categories[0] || '',
        members: categories,
        personId: legacyPersonId,
        personIds: storedPersonIds.length ? storedPersonIds : legacyPersonId ? [legacyPersonId] : [],
      };
      if (ev.isRecurring()) {
        const it = ev.iterator();
        for (let n, i = 0; (n = it.next()) && i < 1000; i++) {
          const f = fields(n);
          if (f.d > to) break;
          if (f.d >= from) {
            let te = '';
            if (f.tm) { try { const e = n.clone(); e.addDuration(ev.duration); te = endOf(e, f); } catch {} }
            out.push({ ...base, id: `${obj.url}#${f.d}`, rec: true, ...f, te });
          }
        }
      } else {
        const f = fields(ev.startDate);
        if (f.d >= from && f.d <= to) out.push({ ...base, ...f, te: f.tm ? endOf(ev.endDate, f) : '' });
      }
    } catch {}
  }
  return out;
}
