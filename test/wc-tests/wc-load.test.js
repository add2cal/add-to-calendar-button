/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

import { fixture, html, expect } from '@open-wc/testing';
import '../../dist/module/index.js';

describe('add-to-calendar-button renders', () => {
  it('has a generated button id and shadowDom element', async () => {
    const el = await fixture(html` <add-to-calendar-button name="test" options='Google' startDate="2050-02-14"></add-to-calendar-button> `);
    expect(el.getAttribute('atcb-button-id')).to.exist;
    expect(el.getAttribute('atcb-button-id')).not.equal('');
    expect(el.shadowRoot.querySelector('.atcb-initialized')).to.exist;
  });
});
