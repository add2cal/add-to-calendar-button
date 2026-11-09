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
  await assert.rejects(readTo(reader, /Submit.*button/i), (error) => {
    assert.match(error.message, /within 20 screen-reader steps/);
    const diagnostics = JSON.parse(error.message.split('\nreadTo diagnostics: ')[1]);
    assert.deepEqual(diagnostics.checkpoint, { speech: 0, items: 0 });
    assert.equal(diagnostics.steps.length, 20);
    assert.equal(diagnostics.speechLength, 20);
    assert.match(diagnostics.steps[0].output, /Other content/);
    return true;
  });
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
