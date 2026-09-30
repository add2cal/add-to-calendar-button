import { expect } from '@open-wc/testing';

describe('Group Z - static asset import order', () => {
  it('Z-09: generated style and locale modules register assets without defining the custom element', async () => {
    const { elementRegisteredByAssets } = await import('../fixtures/import-order/assets-only.js');
    expect(elementRegisteredByAssets, 'asset-only imports do not execute the main custom-element entry').to.equal(false);
  });
});
