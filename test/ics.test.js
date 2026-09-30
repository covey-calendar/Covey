import assert from 'node:assert/strict';
import test from 'node:test';
import { buildICS, parseEvents } from '../ics.js';

const parseOne = (data) => {
  const [event] = parseEvents(
    { data, url: 'event.ics', etag: 'test' },
    '2026-09-30',
    '2026-09-30',
  );
  return event;
};

test('round-trips multiple people and escaped category names', () => {
  const data = buildICS({
    uid: 'multi-person',
    title: 'Stan and Pat event',
    date: '2026-09-30',
    time: '18:00',
    members: ['Stan', 'Pat, Jr.'],
    personIds: ['stan', 'pat-jr'],
  });

  const event = parseOne(data);
  assert.deepEqual(event.personIds, ['stan', 'pat-jr']);
  assert.deepEqual(event.members, ['Stan', 'Pat, Jr.']);
  assert.equal(event.m, 'Stan');
});

test('continues to parse existing single-person iCalendar events', () => {
  const data = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'UID:legacy',
    'DTSTAMP:20260930T120000Z',
    'SUMMARY:Stan swim',
    'CATEGORIES:Stan',
    'X-COVEY-PERSON-ID:stan',
    'DTSTART;VALUE=DATE:20260930',
    'DTEND;VALUE=DATE:20261001',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');

  const event = parseOne(data);
  assert.deepEqual(event.personIds, ['stan']);
  assert.deepEqual(event.members, ['Stan']);
});

test('exposes event descriptions as notes for person matching', () => {
  const data = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'UID:notes',
    'DTSTAMP:20260930T120000Z',
    'SUMMARY:School pickup',
    "DESCRIPTION:Ask Stan's sister about pickup",
    'DTSTART;VALUE=DATE:20260930',
    'DTEND;VALUE=DATE:20261001',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');

  const event = parseOne(data);
  assert.equal(event.notes, "Ask Stan's sister about pickup");
});
