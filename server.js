import express from 'express';
import { createDAVClient } from 'tsdav';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildICS, parseEvents, isoDate } from './ics.js';
import {
  CALENDAR_COLORS,
  CALENDAR_ICONS,
  loadCalendarStore,
  saveCalendarStore,
} from './calendar-store.js';
import { isValidPersonImage, loadPeopleStore, savePeopleStore } from './people-store.js';


const here = path.dirname(fileURLToPath(import.meta.url));
const {
  ICLOUD_EMAIL,
  ICLOUD_APP_PASSWORD,
  CALENDAR_NAME,
  REMINDERS_CALENDAR,
  DINNER_CALENDAR,
  COVEY_DATA_DIR,
  PORT = 3000,
} = process.env;
if (!ICLOUD_EMAIL || !ICLOUD_APP_PASSWORD) {
  console.error('Missing ICLOUD_EMAIL or ICLOUD_APP_PASSWORD. Copy .env_sample to .env and fill it in.');
  process.exit(1);
}

const dataDir = COVEY_DATA_DIR ? path.resolve(COVEY_DATA_DIR) : path.join(here, 'data');
const calendarStorePath = path.join(dataDir, 'calendars.json');
const peopleStorePath = path.join(dataDir, 'people.json');
let calendars;
let people;

console.log('A: env ok, loading calendars from', calendarStorePath);
try {
  calendars = loadCalendarStore(calendarStorePath, {
    CALENDAR_NAME,
    REMINDERS_CALENDAR,
    DINNER_CALENDAR,
  });
  console.log('B: calendars loaded');

} catch (error) {
  console.error(`Unable to load calendar configuration: ${error.message}`);
  process.exit(1);
}
try {
  people = loadPeopleStore(peopleStorePath);
  console.log('C: people loaded');
} catch (error) {
  console.error(`Unable to load people configuration: ${error.message}`);
  process.exit(1);
}
let KINDS = [...new Set(calendars.map((calendar) => calendar.type))];

let ctx = null; // cached iCloud connection
async function connect() {
  if (ctx) return ctx;
  const client = await createDAVClient({
    serverUrl: 'https://caldav.icloud.com',
    credentials: { username: ICLOUD_EMAIL, password: ICLOUD_APP_PASSWORD },
    authMethod: 'Basic',
    defaultAccountType: 'caldav',
  });
  const all = await client.fetchCalendars();
  const cals = Object.create(null);
  for (const configured of calendars) {
    const name = configured.name.toLowerCase();
    const calendar = all.find(c => String(c.displayName || '').toLowerCase() === name);
    if (!calendar) throw new Error(`No calendar named "${configured.name}". Found: ${all.map(c => c.displayName).join(', ')}`);
    cals[configured.id] = { ...configured, calendar };
  }
  return (ctx = { client, cals });
}

const wrap = fn => async (req, res) => {
  try { await fn(req, res); } catch (e) { ctx = null; console.error(e); res.status(500).json({ error: e.message }); }
};

// Live status line so a long-running server doesn't look hung in an
// interactive terminal - a static one-liner with no further output can look
// identical to a frozen process. Falls back to a single static log line when
// stdout isn't a TTY (piped to a file, process manager, etc.) so logs stay clean.
let reqCount = 0;
function startStatusLine(url) {
  if (!process.stdout.isTTY) {
    console.log(`Covey is running on ${url}`);
    return;
  }
  const frames = ['\u280b', '\u2819', '\u2839', '\u2838', '\u283c', '\u2834', '\u2826', '\u2827', '\u2807', '\u280f'];
  const started = Date.now();
  let frame = 0;
  const render = () => {
    const elapsed = Math.max(0, Math.floor((Date.now() - started) / 1000));
    const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const secs = String(elapsed % 60).padStart(2, '0');
    const spinner = frames[frame = (frame + 1) % frames.length];
    const requests = `${reqCount} request${reqCount === 1 ? '' : 's'} served`;
    process.stdout.write(`\r\x1b[2K\x1b[36m${spinner}\x1b[0m Covey is running on \x1b[1m${url}\x1b[0m  \u00b7  up ${mins}:${secs}  \u00b7  ${requests}`);
  };
  render();
  const timer = setInterval(render, 120);
  timer.unref();
  const cleanup = () => { process.stdout.write('\n'); process.exit(0); };
  process.once('SIGINT', cleanup);
  process.once('SIGTERM', cleanup);
}

const app = express();
app.use((_req, _res, next) => { reqCount++; next(); });
app.use(express.json({ limit: '1mb' }));
app.get('/', (_req, res) => {
  const page = fs.readFileSync(path.join(here, 'index.html'), 'utf8');
  res.type('html').send(page.replace('<!--SERVER-->', '<script>window.GAGGLE_SERVER = true</script>'));
});

app.use(express.static(here, { index: false }));

const publicCalendars = () => calendars.map(({ id, name, type, color, icon }) => ({
  id,
  name,
  type,
  ...(color ? { color } : {}),
  ...(icon ? { icon } : {}),
}));
const publicPeople = () => people;

app.get('/api/config', (_req, res) => res.json({
  kinds: KINDS,
  calendars: publicCalendars(),
  people: publicPeople(),
}));
app.get('/api/config/people', (_req, res) => res.json({ people: publicPeople() }));

app.post('/api/config/people', (req, res) => {
  const { name, avatar = 'person', image = null } = req.body || {};
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  if (!trimmedName || trimmedName.length > 60) {
    return res.status(400).json({ error: 'Person name must be 1-60 characters.' });
  }
  if (trimmedName.toLocaleLowerCase() === 'family') {
    return res.status(400).json({ error: '“Family” is reserved for shared family events.' });
  }
  if (people.some((person) => person.name.toLocaleLowerCase() === trimmedName.toLocaleLowerCase())) {
    return res.status(409).json({ error: `A person named “${trimmedName}” already exists.` });
  }
  if (!['person', 'child', 'baby', 'bird'].includes(avatar)) {
    return res.status(400).json({ error: 'Choose one of the available basic avatars.' });
  }
  if (!isValidPersonImage(image)) {
    return res.status(400).json({ error: 'Choose a valid PNG, JPEG, WebP, or built-in bird avatar image.' });
  }

  const baseId = trimmedName
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50) || 'person';
  let id = baseId;
  let suffix = 2;
  while (people.some((person) => person.id === id)) {
    id = `${baseId}-${suffix++}`;
  }
  try {
    people = savePeopleStore(peopleStorePath, [...people, { id, name: trimmedName, avatar, image }]);
    res.status(201).json({ people: publicPeople(), person: people.find((person) => person.id === id) });
  } catch (error) {
    console.error('Unable to save person:', error);
    res.status(500).json({ error: `Could not save person: ${error.message}` });
  }
});

app.delete('/api/config/people/:id', (req, res) => {
  const { id } = req.params;
  if (!people.some((person) => person.id === id)) {
    return res.status(404).json({ error: 'Person not found.' });
  }
  try {
    people = savePeopleStore(peopleStorePath, people.filter((person) => person.id !== id));
    res.json({ people: publicPeople() });
  } catch (error) {
    res.status(500).json({ error: `Could not remove person: ${error.message}` });
  }
});

app.post('/api/config/calendars', async (req, res) => {
  const { name, color, icon, confirmedExisting } = req.body || {};
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  if (confirmedExisting !== true) {
    return res.status(400).json({ error: 'Confirm that this calendar already exists in iCloud.' });
  }
  if (!trimmedName || trimmedName.length > 100) {
    return res.status(400).json({ error: 'Calendar name must be 1-100 characters.' });
  }
  if (!CALENDAR_COLORS.has(color)) {
    return res.status(400).json({ error: 'Choose one of the available calendar colors.' });
  }
  if (!CALENDAR_ICONS.has(icon)) {
    return res.status(400).json({ error: 'Choose one of the available calendar icons.' });
  }
  if (calendars.some((calendar) => calendar.name.toLowerCase() === trimmedName.toLowerCase())) {
    return res.status(409).json({ error: `A calendar named "${trimmedName}" is already configured.` });
  }

  try {
    const client = ctx?.client || await createDAVClient({
      serverUrl: 'https://caldav.icloud.com',
      credentials: { username: ICLOUD_EMAIL, password: ICLOUD_APP_PASSWORD },
      authMethod: 'Basic',
      defaultAccountType: 'caldav',
    });
    const available = await client.fetchCalendars();
    const remote = available.find((calendar) =>
      String(calendar.displayName || '').toLowerCase() === trimmedName.toLowerCase(),
    );
    if (!remote) {
      return res.status(400).json({
        error: `No iCloud calendar named "${trimmedName}" was found. Add it to iCloud first, then try again.`,
      });
    }

    const baseId = trimmedName
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50) || 'calendar';
    let id = baseId;
    let suffix = 2;
    while (calendars.some((calendar) => calendar.id === id)) {
      id = `${baseId}-${suffix++}`;
    }
    const created = { id, name: remote.displayName, type: 'event', color, icon };
    calendars = saveCalendarStore(calendarStorePath, [...calendars, created]);
    KINDS = [...new Set(calendars.map((calendar) => calendar.type))];
    ctx = null;
    res.status(201).json({ kinds: KINDS, calendars: publicCalendars(), calendar: created });
  } catch (error) {
    console.error('Unable to add iCloud calendar:', error);
    res.status(502).json({ error: `Could not verify this calendar with iCloud: ${error.message}` });
  }
});

app.delete('/api/config/calendars/:id', (req, res) => {
  const { id } = req.params;
  if (['event', 'reminder', 'dinner'].includes(id)) {
    return res.status(400).json({ error: 'Built-in calendars cannot be removed here.' });
  }
  if (!calendars.some((calendar) => calendar.id === id)) {
    return res.status(404).json({ error: 'Calendar not found.' });
  }

  try {
    calendars = saveCalendarStore(
      calendarStorePath,
      calendars.filter((calendar) => calendar.id !== id),
    );
    KINDS = [...new Set(calendars.map((calendar) => calendar.type))];
    ctx = null;
    res.json({ kinds: KINDS, calendars: publicCalendars() });
  } catch (error) {
    console.error('Unable to remove calendar:', error);
    res.status(500).json({ error: `Could not remove calendar: ${error.message}` });
  }
});

app.put('/api/config/calendars', (req, res) => {
  try {
    calendars = saveCalendarStore(calendarStorePath, req.body?.calendars);
    KINDS = [...new Set(calendars.map((calendar) => calendar.type))];
    ctx = null;
    res.json({ kinds: KINDS, calendars: publicCalendars() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/events', wrap(async (req, res) => {
  const m = /^(\d{4})-(\d{2})$/.exec(req.query.month || '');
  if (!m) return res.status(400).json({ error: 'month=YYYY-MM required' });
  const y = +m[1], mo = +m[2];
  const from = isoDate(new Date(y, mo - 1, 1)), to = isoDate(new Date(y, mo, 0));
  const timeRange = { start: new Date(y, mo - 1, -1).toISOString(), end: new Date(y, mo, 2).toISOString() }; // padded for timezone edges
  const { client, cals } = await connect();
  const lists = await Promise.all(Object.values(cals).map(async ({ id, name, type, calendar }) => {
    const objs = await client.fetchCalendarObjects({ calendar, timeRange });
    return objs.flatMap(o => parseEvents(o, from, to)).map(e => ({
      ...e,
      kind: type,
      calendarId: id,
      calendarName: name,
      calendarColor: cals[id].color || null,
      calendarIcon: cals[id].icon || null,
    }));
  }));
  res.json(lists.flat());
}));

app.post('/api/events', wrap(async (req, res) => {
  const { t, d, tm = '', te = '', m = 'Family', kind = 'event', calendarId, personId, personIds } = req.body || {};
  const validTime = value => /^(\d{2}:\d{2})?$/.test(value);
  if (typeof t !== 'string' || !t.trim() || t.length > 80 || !/^\d{4}-\d{2}-\d{2}$/.test(d) ||
      !validTime(tm) || !validTime(te) || (te && (!tm || te <= tm)) ||
      typeof m !== 'string' || m.length > 60 || typeof kind !== 'string' ||
      (calendarId !== undefined && typeof calendarId !== 'string') ||
      (personId !== undefined && typeof personId !== 'string') ||
      (personIds !== undefined && (!Array.isArray(personIds) || personIds.length > 100 || personIds.some((id) => typeof id !== 'string')))) {
    return res.status(400).json({ error: 'Invalid event' });
  }
  const requestedPersonIds = personIds ?? (personId ? [personId] : []);
  if (new Set(requestedPersonIds).size !== requestedPersonIds.length) {
    return res.status(400).json({ error: 'Choose each person only once.' });
  }
  const assignedPeople = requestedPersonIds.map((id) => people.find((candidate) => candidate.id === id));
  if (assignedPeople.some((person) => !person) || (assignedPeople.length && kind !== 'event')) {
    return res.status(400).json({ error: 'Choose valid people for this event.' });
  }
  const { client, cals } = await connect();
  const target = calendarId
    ? cals[calendarId]
    : Object.values(cals).find((configured) => configured.type === kind);
  if (!target || target.type !== kind) return res.status(400).json({ error: `No ${kind} calendar is configured` });
  const uid = crypto.randomUUID();
  const r = await client.createCalendarObject({
    calendar: target.calendar,
    filename: `${uid}.ics`,
    iCalString: buildICS({
      uid, title: t.trim(), date: d,
      time: kind === 'event' ? tm : '',        // reminders and dinner are all-day entries
      endTime: kind === 'event' ? te : '',     // optional; defaults to one hour after start
      member: kind === 'event' ? (assignedPeople[0]?.name || m) : '',
      members: kind === 'event'
        ? (assignedPeople.length ? assignedPeople.map((person) => person.name) : [m])
        : [],
      personId: kind === 'event' ? assignedPeople[0]?.id : '',
      personIds: kind === 'event' ? assignedPeople.map((person) => person.id) : [],
      alarm: kind === 'reminder',               // reminders alert on the phone
    }),
  });
  if (!r.ok) throw new Error(`iCloud rejected the event (HTTP ${r.status})`);
  res.status(201).json({ ok: true });
}));

app.delete('/api/events', wrap(async (req, res) => {
  const { url, etag } = req.query;
  const { client, cals } = await connect();
  if (typeof url !== 'string' || !Object.values(cals).some(c => url.startsWith(c.calendar.url))) return res.status(400).json({ error: 'Bad event url' });
  const r = await client.deleteCalendarObject({ calendarObject: { url, etag: etag || undefined } });
  if (!r.ok) throw new Error(`iCloud could not delete the event (HTTP ${r.status})`);
  res.json({ ok: true });
}));

app.listen(PORT, () => startStatusLine(`http://localhost:${PORT}`));
