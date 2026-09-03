/**
 * Translation oracle for i18n tests.
 *
 * The source i18n module ships English only; every other language loads on demand.
 * Tests use the SOURCE module instance as the oracle (independent from the registry
 * inside the built dist bundle that the component populates), so the locale packs
 * the oracle needs are registered here explicitly from the JSON sources.
 */
import { translate_hook, translate, register_locale, rtlLanguages, availableLanguages } from '../../src/i18n/index.ts';
import de from '../../src/i18n/locales/de.json';
import fr from '../../src/i18n/locales/fr.json';
import es from '../../src/i18n/locales/es.json';
import pt from '../../src/i18n/locales/pt.json';
import ar from '../../src/i18n/locales/ar.json';
import he from '../../src/i18n/locales/he.json';
import fa from '../../src/i18n/locales/fa.json';

register_locale('de', de);
register_locale('fr', fr);
register_locale('es', es);
register_locale('pt', pt);
register_locale('ar', ar);
register_locale('he', he);
register_locale('fa', fa);

export { translate_hook, translate, register_locale, rtlLanguages, availableLanguages };
