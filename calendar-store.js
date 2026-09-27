import fs from 'node:fs';
import path from 'node:path';

const STORE_VERSION = 1;
const CALENDAR_TYPES = new Set(['event', 'reminder', 'dinner']);
export const CALENDAR_COLORS = new Set([
  'coral', 'blue', 'green', 'amber', 'violet', 'teal', 'rose', 'slate',
]);
export const CALENDAR_ICONS = new Set([
  'calendar', 'briefcase', 'house', 'heart', 'book-open', 'music', 'dumbbell', 'shopping-bag', 'users', 'baby',
]);

function normalizeCalendars(calendars) {
  if (!Array.isArray(calendars)) {
    throw new Error('Calendar store must contain a calendars array.');
  }

  const ids = new Set();
  const names = new Set();
  const normalized = calendars.map((calendar) => {
    if (!calendar || typeof calendar !== 'object') {
      throw new Error('Each configured calendar must be an object.');
    }
    const id = typeof calendar.id === 'string' ? calendar.id.trim() : '';
    const name = typeof calendar.name === 'string' ? calendar.name.trim() : '';
    const type = typeof calendar.type === 'string' ? calendar.type.trim() : '';
    const color = calendar.color == null ? null : calendar.color;
    const icon = calendar.icon == null ? null : calendar.icon;

    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(id)) {
      throw new Error(`Invalid calendar id: ${id || '(empty)'}.`);
    }
    if (!name || name.length > 100) {
      throw new Error(`Calendar "${id}" must have a name of 1-100 characters.`);
    }
    if (!CALENDAR_TYPES.has(type)) {
      throw new Error(`Calendar "${id}" has an unsupported type: ${type || '(empty)'}.`);
    }
    if (color !== null && !CALENDAR_COLORS.has(color)) {
      throw new Error(`Calendar "${id}" has an unsupported color.`);
    }
    if (icon !== null && !CALENDAR_ICONS.has(icon)) {
      throw new Error(`Calendar "${id}" has an unsupported icon.`);
    }
    if (ids.has(id)) throw new Error(`Duplicate calendar id: ${id}.`);
    const foldedName = name.toLowerCase();
    if (names.has(foldedName)) throw new Error(`Duplicate calendar name: ${name}.`);

    ids.add(id);
    names.add(foldedName);
    return {
      id,
      name,
      type,
      ...(color ? { color } : {}),
      ...(icon ? { icon } : {}),
    };
  });

  if (!normalized.some((calendar) => calendar.type === 'event')) {
    throw new Error('At least one event calendar must be configured.');
  }
  return normalized;
}

export function saveCalendarStore(filePath, calendars) {
  const normalized = normalizeCalendars(calendars);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  const contents = `${JSON.stringify({ version: STORE_VERSION, calendars: normalized }, null, 2)}\n`;

  try {
    fs.writeFileSync(temporaryPath, contents, { mode: 0o600 });
    fs.renameSync(temporaryPath, filePath);
  } catch (error) {
    try {
      fs.rmSync(temporaryPath, { force: true });
    } catch {}
    throw error;
  }

  return normalized;
}

export function readCalendarStore(filePath) {
  let stored;
  try {
    stored = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Could not read calendar store at ${filePath}: ${error.message}`);
  }
  if (!stored || stored.version !== STORE_VERSION) {
    throw new Error(`Unsupported calendar store version in ${filePath}.`);
  }
  return normalizeCalendars(stored.calendars);
}

export function loadCalendarStore(filePath, legacyEnv = process.env) {
  if (fs.existsSync(filePath)) return readCalendarStore(filePath);

  const calendars = [
    {
      id: 'event',
      name: (legacyEnv.CALENDAR_NAME || '').trim() || 'Family',
      type: 'event',
    },
  ];
  for (const [id, name, type] of [
    ['reminder', legacyEnv.REMINDERS_CALENDAR, 'reminder'],
    ['dinner', legacyEnv.DINNER_CALENDAR, 'dinner'],
  ]) {
    if (typeof name === 'string' && name.trim()) {
      calendars.push({ id, name: name.trim(), type });
    }
  }

  return saveCalendarStore(filePath, calendars);
}
