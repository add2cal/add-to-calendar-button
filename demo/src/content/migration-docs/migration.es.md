# Migración de v2 a v3

La versión 3 conserva el mismo elemento `<add-to-calendar-button>`, la misma API imperativa
`atcb_action` y los alias en tiempo de ejecución para los atributos y nombres de calendarios
existentes en v2. La mayoría de las integraciones pueden actualizarse cambiando únicamente la
versión del paquete o script instalado.

Utiliza esta guía para comprobar los pocos cambios que pueden requerir acciones en tu proyecto.

## Lista de comprobación para la migración

1. Actualiza `add-to-calendar-button` a la versión 3 y sigue utilizando la entrada principal del paquete.
2. Si utilizas TypeScript, cambia el nombre de la propiedad de configuración tipada `proKey` a `prokey`.
3. Cambia el nombre de `created` y `updated` a `icsCreated` y `icsUpdated` en la configuración de
   JavaScript, o a `ics-created` y `ics-updated` en los atributos HTML.
4. Si proporcionas `customLabels`, actualiza las claves de traducción renombradas que se indican más abajo.
5. Si utilizas una entrada heredada `no-pro`, `unstyle` o `no-pro-unstyle`, cambia a la entrada principal.
   Los adaptadores de compatibilidad siguen funcionando, pero las compilaciones específicas ya no existen.
6. Si utilizas el paquete npm con un estilo no predeterminado o un idioma distinto del inglés, importa
   explícitamente su módulo de estilo o configuración regional.
7. Actualiza los atributos de datos HTML a su grafía oficial en kebab-case. Las grafías heredadas siguen
   siendo compatibles por ahora, pero podrían eliminarse en una futura versión principal.
8. Comprueba que todas las URL proporcionadas utilicen un esquema permitido que no pueda ejecutar scripts.
9. Haz pruebas en los navegadores compatibles. La experiencia completa de v3 está dirigida a Baseline 2023.
10. Si el código del servidor o worker importa utilidades de fecha desde la raíz del paquete o `/unstyle`,
    cambia esas importaciones a la entrada sin DOM `add-to-calendar-button/utils`.

Si ninguno de estos casos se aplica, tu integración con v2 debería seguir funcionando sin cambios.

## Actualiza el paquete o script del navegador

Los puntos de entrada principales no han cambiado:

| Integración          | v2                                  | v3          |
| -------------------- | ----------------------------------- | ----------- |
| ESM                  | `import 'add-to-calendar-button'`   | sin cambios |
| CommonJS             | `require('add-to-calendar-button')` | sin cambios |
| Script del navegador | `<script src=".../atcb.js">`        | sin cambios |
| API imperativa       | `atcb_action(config, button)`       | sin cambios |

El paquete minimizado para navegador `atcb.min.js` ahora también está incluido en el paquete npm.

Las antiguas entradas de paquete `add-to-calendar-button/no-pro`,
`add-to-calendar-button/unstyle` y `add-to-calendar-button/no-pro-unstyle` siguen disponibles como
adaptadores de obsolescencia. Del mismo modo, los antiguos nombres de archivo de CDN cargan el paquete
principal mediante un pequeño adaptador. Actualiza estas integraciones a la entrada principal cuando te
resulte conveniente:

```js
import 'add-to-calendar-button';
```

La entrada de compatibilidad `/unstyle` no es una compilación exclusiva para servidores: reexporta el
paquete principal y, por lo tanto, sigue cargando Lit y el componente web. Los entornos de ejecución de
servidor como Cloudflare Workers deben utilizar la entrada específica `/utils` cuando solo necesiten las
utilidades de fecha que se describen a continuación.

## Actualiza las configuraciones PRO de TypeScript

La clave PRO tipada ahora es `prokey`, para coincidir con el atributo HTML oficial:

```ts
// v2
atcb_action({ proKey: '...' });

// v3
atcb_action({ prokey: '...' });
```

Este es un cambio incompatible en tiempo de compilación para las configuraciones tipadas de `atcb_action`
y el uso de `AddToCalendarButtonType`. La antigua propiedad `proKey` se mantiene como alias en tiempo de
ejecución para objetos JavaScript simples. El HTML existente, como `<add-to-calendar-button proKey="...">`,
también sigue funcionando porque los nombres de atributos HTML no distinguen entre mayúsculas y minúsculas.

Las declaraciones de tipos ahora se generan en un único `dist/index.d.ts` y son compatibles con la
resolución de módulos de bundlers, Node 16 y clásica. Los nombres de tipos públicos existentes siguen
estando disponibles.

## Cambia el nombre de las opciones de marca de tiempo de ICS

Las opciones de marca de tiempo de v2 con nombres genéricos ahora utilizan nombres ICS explícitos porque
solo afectan a la salida de Apple/iCal:

| v2        | Atributo HTML de v3 | Propiedad JavaScript de v3 |
| --------- | ------------------- | -------------------------- |
| `created` | `ics-created`       | `icsCreated`               |
| `updated` | `ics-updated`       | `icsUpdated`               |

A diferencia de la mayoría de los atributos renombrados en v3, los antiguos nombres `created` y `updated`
ya no se leen.

## Actualiza las claves de etiquetas personalizadas

Solo necesitan cambios las integraciones que sobrescriban exactamente estas claves de `customLabels`:

| Clave de v2                 | Clave de v3                 |
| --------------------------- | --------------------------- |
| `date.status.cancelled.cta` | `date.status.cancelled_cta` |
| `label.share.email.subject` | `label.share.email_subject` |
| `label.rsvp`                | `label.rsvp.title`          |
| `form.status`               | `form.status.title`         |
| `form.success`              | `form.success.title`        |

También hay una nueva clave `modal.clipboard.failed` para la alternativa de copia manual que se muestra
cuando falla el acceso automático al portapapeles.

## Prefiere los nuevos nombres oficiales de atributos y valores

Los nombres oficiales de atributos HTML ahora están en kebab-case, por ejemplo `start-date`, `button-style`,
`recurrence-interval` y `recurrence-by-day`. Las grafías camelCase, en minúsculas y con guiones bajos de v2
siguen admitiéndose como alias. Cuando están presentes tanto un nombre oficial como un alias heredado,
prevalece el nombre oficial.

Recomendamos encarecidamente actualizar todos los atributos HTML a la grafía oficial en kebab-case durante
la migración a v3. Actualmente, los alias ofrecen compatibilidad con versiones anteriores, pero podrían
eliminarse en una futura versión principal. Esta recomendación solo se aplica a los atributos HTML. Para
los objetos de configuración de JavaScript, incluidos los que se pasan a `atcb_action`, camelCase sigue
siendo la grafía preferida (por ejemplo, `startDate` y `buttonStyle`).

Los valores de las opciones de calendario ahora están en minúsculas:

- `apple`
- `google`
- `ical`
- `ms365`
- `msteams`
- `outlookcom`
- `yahoo`

Los valores de v2 como `Apple`, `Google`, `iCal`, `Microsoft365`, `MicrosoftTeams` y `Outlook.com` siguen
funcionando con cualquier combinación de mayúsculas y minúsculas. TypeScript expone los nuevos valores
mediante `ATCBOptionName` y los antiguos mediante `ATCBOptionNameLegacy`.

Del mismo modo, los valores de estado de eventos están en minúsculas: `tentative`, `confirmed` y `cancelled`.
Los valores de v2 en mayúsculas siguen funcionando, y los archivos ICS generados continúan utilizando los
valores en mayúsculas exigidos por la especificación.

## Comprueba las URL proporcionadas

La versión 3 rechaza esquemas de URL capaces de ejecutar scripts, como `javascript:`. Las URL proporcionadas
mediante la configuración de eventos, incluidos archivos ICS, CSS personalizado, imágenes y destinos de
proxy, deben utilizar un esquema permitido. Los esquemas compatibles incluyen `http`, `https`, `webcal`,
`webcals`, `mailto`, `intent` y `data:text/calendar` cuando corresponda.

Las descripciones que utilizan la sintaxis de enlace `[url]...[/url]` solo crean enlaces para URL HTTP(S),
Webcal(S) y mailto. Los valores no compatibles se representan como texto.

## Ten en cuenta el nivel mínimo de compatibilidad con navegadores

La versión 3 ofrece la experiencia completa en navegadores Baseline 2023, incluidos Safari 16.4 y los
navegadores evergreen actuales. Los paquetes tienen como objetivo ES2017. Declarative Shadow DOM es una
mejora progresiva, por lo que los navegadores que no lo admiten recurren al renderizado del lado del cliente.

El menú desplegable ahora sigue el patrón de menú WAI-ARIA (roles `menu` y `menuitem`), y los modales utilizan
elementos `<dialog>` nativos. Si las pruebas o el CSS de tu aplicación apuntan a los antiguos roles
`list`/`link` o a la antigua estructura de los modales, actualiza esos selectores.

## Importa estilos no predeterminados y configuraciones regionales distintas del inglés con npm

El estilo predeterminado y el inglés siguen incluidos. Para los usuarios del paquete npm, los demás estilos
e idiomas ya no se incluyen automáticamente: debes importar explícitamente cada estilo no predeterminado y
cada configuración regional distinta del inglés que utilice tu aplicación. Este es un cambio incompatible
respecto a v2.

Por ejemplo:

```js
import 'add-to-calendar-button';
import 'add-to-calendar-button/styles/3d';
import 'add-to-calendar-button/i18n/de';
```

Las integraciones normales mediante script de navegador/CDN siguen cargando los estilos e idiomas solicitados
bajo demanda como recursos pequeños y no requieren estas importaciones.

También puedes utilizar `style-source` para sobrescribir la URL base de los recursos de carga diferida,
`load-all-styles` para precargar todos los estilos y poder cambiarlos en tiempo de ejecución,
`atcb_register_style(name, css)` para registrar un estilo o `atcb_register_locale(lang, strings)` para
registrar una configuración regional.

Se admiten configuraciones regionales completas. Por ejemplo, `language="en_GB"` o `language="en-GB"` utiliza
traducciones regionales cuando están disponibles y conserva la región para el formato de fecha. El ucraniano
(`uk`) ahora forma parte del tipo público de idioma.

## Opcional: utiliza el renderizado del lado del servidor

La versión 3 incluye una entrada exclusiva para SSR que crea una estructura de Declarative Shadow DOM:

```js
import { atcb_generate_ssr_html } from 'add-to-calendar-button/ssr';

const html = atcb_generate_ssr_html({
  name: 'Launch Party',
  startDate: '2050-06-15',
  buttonStyle: '3d',
  language: 'de',
});
```

La estructura refleja el estilo, tamaño, modo de color, dirección del texto y etiqueta del botón. El paquete
normal para navegador la adopta e hidrata sin reemplazar el shadow root ya dibujado.

## Utiliza las utilidades de fecha en entornos de ejecución de servidor y worker

La versión 3 proporciona una entrada sin DOM para Cloudflare Workers, Node y entornos de ejecución similares:

```js
import { atcb_decorate_data_dates, atcb_generate_timestring } from 'add-to-calendar-button/utils';

const event = atcb_decorate_data_dates({
  dates: [
    {
      name: 'Launch Party',
      startDate: '2050-06-15',
      startTime: '10:00',
      endTime: '11:00',
      timeZone: 'Europe/Berlin',
    },
  ],
});

const label = atcb_generate_timestring(event.dates, 'en').join(' ');
```

La exportación `/utils` es compatible con ESM, CommonJS y TypeScript sin importar Lit, el componente web,
estilos ni objetos globales del navegador. Importar estas funciones desde el paquete principal o la entrada
heredada `/unstyle` no ofrece esa garantía.

## Nuevas opciones exclusivas de ICS

La versión 3 añade opciones que afectan únicamente a los archivos Apple/iCal generados. Los demás servicios
de calendario las ignoran:

- `ics-reminder` / `icsReminder`
- `ics-url` / `icsUrl`
- `ics-categories` / `icsCategories`
- `ics-class` / `icsClass`
- `ics-priority` / `icsPriority`
- `ics-geo` / `icsGeo`
- `ics-attach` / `icsAttach`
- `ics-exdate` / `icsExdate`

La primera forma es el atributo HTML; la segunda es la propiedad de configuración de JavaScript.
`ics-exdate` solo se puede usar en la raíz. Las demás opciones pueden aplicarse a entradas individuales de un
evento con múltiples fechas, y los valores de la raíz tienen prioridad.

## Mejoras de comportamiento que no requieren migración

- Los eventos recurrentes con fechas de inicio antiguas avanzan de forma eficiente mientras conservan el
  comportamiento de `COUNT` y `UNTIL`.
- Los fallos del portapapeles muestran un campo de copia manual en lugar de indicar un éxito falso.
- El análisis de entradas elimina las claves de contaminación del prototipo y escapa de forma segura la salida
  de datos enriquecidos.
- El icono de Google Calendar utiliza el logotipo actual.
