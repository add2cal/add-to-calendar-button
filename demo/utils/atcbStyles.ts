// Register every built-in button style for the demo.
//
// From v3 on, the package bundles only the core plus the default style; other styles
// load on demand relative to the script origin. A bundled app like this demo has no
// such fetchable origin, so we import the self-registering style modules explicitly.
// This makes every style available synchronously - the playground can switch to any of
// them and the example pages render their chosen style without a runtime fetch.
import 'add-to-calendar-button/styles/simple';
import 'add-to-calendar-button/styles/3d';
import 'add-to-calendar-button/styles/flat';
import 'add-to-calendar-button/styles/round';
import 'add-to-calendar-button/styles/neumorphism';
import 'add-to-calendar-button/styles/text';
import 'add-to-calendar-button/styles/date';
