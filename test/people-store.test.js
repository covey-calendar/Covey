import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { readPeopleStore, savePeopleStore } from '../people-store.js';

test('persists multiple calendar associations and normalizes older person records', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'covey-people-'));
  const filePath = path.join(directory, 'people.json');

  try {
    const people = savePeopleStore(filePath, [
      { id: 'sam', name: 'Sam', avatar: 'person', calendarIds: ['family', 'school'] },
      { id: 'alex', name: 'Alex', avatar: 'child' },
    ]);
    assert.deepEqual(people.map((person) => person.calendarIds), [
      ['family', 'school'],
      [],
    ]);
    assert.deepEqual(readPeopleStore(filePath), people);

    fs.writeFileSync(
      filePath,
      JSON.stringify({
        version: 1,
        people: [{ id: 'legacy', name: 'Legacy', avatar: 'person', calendarId: 'family' }],
      }),
    );
    assert.deepEqual(readPeopleStore(filePath)[0].calendarIds, ['family']);

    assert.throws(
      () => savePeopleStore(filePath, [
        { id: 'sam', name: 'Sam', calendarIds: ['family', 'family'] },
      ]),
      /duplicate calendar IDs/,
    );
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
