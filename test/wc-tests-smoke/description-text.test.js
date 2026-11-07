import { expect, fixture } from '@open-wc/testing';
import '../../dist/module/index.js';
import { atcb_generate_ssr_html } from '../../dist/ssr/index.js';
import { interceptWindowOpen } from '../helpers/capture.js';

const literal = '<hjhj> literal\\n &lt;hjhj&gt; &#60;hjhj&#62; &amp;';

describe('Literal descriptions', () => {
  for (const mode of ['attributes', 'json', 'ssr']) {
    it(`DESC-UI-${mode}: literal descriptions survive ingestion and provider HTML without becoming markup`, async () => {
      const config = { name: 'Description regression', startDate: '2050-06-15', options: ['google'], dates: [{ startDate: '2050-06-15', description: '%%text%%[br][b]bold[/b]' }], customVar: { text: literal } };
      const wrapper = await fixture('<div></div>');
      let host;
      if (mode === 'ssr') {
        wrapper.innerHTML = atcb_generate_ssr_html(config);
        host = wrapper.querySelector('add-to-calendar-button');
      } else {
        host = document.createElement('add-to-calendar-button');
        if (mode === 'json') host.textContent = JSON.stringify(config, null, 2);
        else for (const [key, value] of Object.entries(config)) host.setAttribute(key, typeof value === 'object' ? JSON.stringify(value) : value);
        wrapper.appendChild(host);
      }
      await host.whenInitialized();
      const open = interceptWindowOpen();
      try {
        host.shadowRoot.querySelector('.atcb-button').click();
        expect(open.calls).to.have.length(1);
        const details = new URL(open.calls[0].url).searchParams.get('details');
        const rendered = document.createElement('div');
        rendered.innerHTML = details;
        expect(rendered.querySelector('hjhj')).to.equal(null);
        expect(rendered.textContent).to.equal(literal + 'bold');
        expect(rendered.querySelector('b').textContent).to.equal('bold');
        expect(rendered.querySelectorAll('br')).to.have.length(1);
      } finally {
        open.restore();
      }
    });
  }
});
