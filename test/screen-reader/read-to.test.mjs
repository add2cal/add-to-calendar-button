import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readTo } from './helpers.ts';

// Model output arriving between the initial item read and the old checkpoint.
test('readTo keeps an announcement arriving during the initial output read', async () => {
  const log = [];
  let nextCalls = 0;
  const reader = {
    async spokenPhraseLog() {
      return log;
    },
    async itemTextLog() {
      return log;
    },
    async lastSpokenPhrase() {
      return 'Subscribe to news, check box';
    },
    async itemText() {
      log.push('Submit, button');
      return 'Subscribe to news, check box';
    },
    async next() {
      nextCalls++;
      log.push('After calendar, button');
    },
  };
  await readTo(reader, /Submit.*button|button.*Submit/i);
  assert.equal(nextCalls, 0, 'do not navigate past a target already announced');
});

test('readTo still rejects a missing target after bounded navigation', async () => {
  const log = [];
  let nextCalls = 0;
  const reader = {
    async spokenPhraseLog() {
      return log;
    },
    async itemTextLog() {
      return log;
    },
    async lastSpokenPhrase() {
      return 'blank';
    },
    async itemText() {
      return 'blank';
    },
    async next() {
      nextCalls++;
      log.push('Other content');
    },
  };
  await assert.rejects(readTo(reader, /Submit.*button/i), /within 20 screen-reader steps/);
  assert.equal(nextCalls, 20);
});

test('readTo rejects forbidden background speech even when the target is announced', async () => {
  const log = [];
  const reader = {
    async spokenPhraseLog() {
      return log;
    },
    async itemTextLog() {
      return log;
    },
    async lastSpokenPhrase() {
      return 'blank';
    },
    async itemText() {
      log.push('Submit, button. After calendar');
      return 'blank';
    },
    async next() {
      assert.fail('must reject before navigating');
    },
  };
  await assert.rejects(readTo(reader, /Submit.*button/i, /After calendar/i));
});
