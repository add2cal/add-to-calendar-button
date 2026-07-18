/**
 * Style template store. Empty in the source; the build inlines the minified
 * css of all shipped styles here (see scripts/build.mjs) - unless building
 * the unstyle variants. Phase 5 of the refactor turns this into the runtime
 * style registry with origin-relative loading.
 */
const atcbCssTemplate: { [key: string]: string } = {};

export { atcbCssTemplate };
