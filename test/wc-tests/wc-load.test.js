import { fixture, html, expect } from '@open-wc/testing';
import '../../dist/module/index.js';

describe('add-to-calendar-button renders', () => {
  it('has a generated button id and shadowDom element', async () => {
    const el = await fixture(html` <add-to-calendar-button name="test" options='Google' startDate="2050-02-14"></add-to-calendar-button> `);
    await el.whenInitialized(); // Wait for initialization to complete
    expect(el.getAttribute('atcb-button-id')).to.exist;
    expect(el.getAttribute('atcb-button-id')).to.not.equal('');
    expect(el.shadowRoot.querySelector('.atcb-initialized')).to.exist;
  });
});
