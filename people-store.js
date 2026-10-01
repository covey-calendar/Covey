import fs from 'node:fs';
import path from 'node:path';

const STORE_VERSION = 1;
const AVATARS = new Set(['person', 'child', 'baby', 'bird']);
const MAX_IMAGE_LENGTH = 800_000;
const IMAGE_DATA_URI = /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
const LOCAL_AVATAR_IMAGES = new Set([
  '/images/Nuthatch.png',
  '/images/blue-jay.png',
  '/images/cardinal.png',
  '/images/goldfinch.png',
  '/images/robin.png',
]);

export function isValidPersonImage(image) {
  return image == null || LOCAL_AVATAR_IMAGES.has(image) ||
    (typeof image === 'string' && image.length <= MAX_IMAGE_LENGTH && IMAGE_DATA_URI.test(image));
}

function normalizePeople(people) {
  if (!Array.isArray(people)) {
    throw new Error('People store must contain a people array.');
  }

  const ids = new Set();
  const names = new Set();
  return people.map((person) => {
    if (!person || typeof person !== 'object') {
      throw new Error('Each person must be an object.');
    }
    const id = typeof person.id === 'string' ? person.id.trim() : '';
    const name = typeof person.name === 'string' ? person.name.trim() : '';
    const avatar = typeof person.avatar === 'string' ? person.avatar : 'person';
    const image = person.image == null ? null : person.image;
    const calendarIds = person.calendarIds === undefined
      ? (typeof person.calendarId === 'string' && person.calendarId ? [person.calendarId] : [])
      : person.calendarIds;

    if (!Array.isArray(calendarIds)) {
      throw new Error(`Person "${id || '(empty)'}" must have a valid calendarIds array.`);
    }
    const normalizedCalendarIds = calendarIds.map((calendarId) =>
      typeof calendarId === 'string' ? calendarId.trim() : '',
    );
    if (normalizedCalendarIds.some((calendarId) => !/^[a-z0-9][a-z0-9-]{0,63}$/.test(calendarId))) {
      throw new Error(`Person "${id || '(empty)'}" has an invalid calendar ID.`);
    }
    if (new Set(normalizedCalendarIds).size !== normalizedCalendarIds.length) {
      throw new Error(`Person "${id || '(empty)'}" has duplicate calendar IDs.`);
    }

    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(id)) {
      throw new Error(`Invalid person id: ${id || '(empty)'}.`);
    }
    if (!name || name.length > 60) {
      throw new Error(`Person "${id}" must have a name of 1-60 characters.`);
    }
    if (!AVATARS.has(avatar)) {
      throw new Error(`Person "${id}" has an unsupported avatar.`);
    }
    if (!isValidPersonImage(image)) {
      throw new Error(`Person "${id}" has an invalid custom avatar image.`);
    }
    if (ids.has(id)) throw new Error(`Duplicate person id: ${id}.`);
    const foldedName = name.toLocaleLowerCase();
    if (names.has(foldedName)) throw new Error(`Duplicate person name: ${name}.`);

    ids.add(id);
    names.add(foldedName);
    return { id, name, avatar, image, calendarIds: normalizedCalendarIds };
  });
}

export function savePeopleStore(filePath, people) {
  const normalized = normalizePeople(people);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  const contents = `${JSON.stringify({ version: STORE_VERSION, people: normalized }, null, 2)}\n`;

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

export function readPeopleStore(filePath) {
  let stored;
  try {
    stored = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Could not read people store at ${filePath}: ${error.message}`);
  }
  if (!stored || stored.version !== STORE_VERSION) {
    throw new Error(`Unsupported people store version in ${filePath}.`);
  }
  return normalizePeople(stored.people);
}

export function loadPeopleStore(filePath) {
  if (fs.existsSync(filePath)) return readPeopleStore(filePath);
  return savePeopleStore(filePath, []);
}
