<script setup lang="ts">
import { ChevronUpIcon } from '@heroicons/vue/24/outline';
import { Disclosure, DisclosureButton, DisclosurePanel, provideUseId } from '@headlessui/vue';

const { locale } = useI18n();
const localePath = useLocalePath();
provideUseId(() => useId());

const wpUrl = (function () {
  if (locale.value == 'de') {
    return 'https://de.wordpress.org/plugins/add-to-calendar-button';
  }
  return 'https://wordpress.org/plugins/add-to-calendar-button';
})();
</script>

<template>
  <Disclosure v-slot="{ open }" class="mx-auto w-full max-w-3xl">
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <DisclosureButton as="h3" itemprop="name" class="faq-button flex w-full cursor-pointer justify-between">
        <span v-if="locale=='en'">What is a Add to Calendar Button?</span>
        <span v-else>Was ist ein Add to Calendar Button?</span>
        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-inherit transition-transform" />
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="px-4 pb-6 pt-4 text-left" :unmount="false" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <div v-if="locale=='en'" itemprop="text">
            Add to Calendar Buttons provide users with the opportunity to easily save events directly to the calendar app of their choice.<br />
            They only need to click, select their desired format and save.<br />
            A good Add to Calendar Button solution takes care of all the complexity (like different time zones, limitations by device or browser, and more) in the background - without either the user nor the website owner noticing.
          </div>
          <div v-else itemprop="text">
            Add to Calendar Buttons bieten Benutzern die Möglichkeit, Ereignisse direkt in der Kalender-App ihrer Wahl zu speichern.<br />
            Sie müssen nur noch klicken, das gewünschte Format auswählen und bestätigen.<br />
            Eine gute Add to Calendar Button Lösung kümmert sich im Hintergrund um die gesamte Komplexität (wie unterschiedliche Zeitzonen, Einschränkungen durch Gerät oder Browser und mehr) - ohne dass der Benutzer oder der Website-Besitzer etwas davon mitbekommt.
          </div>
        </DisclosurePanel>
      </transition>
    </div>
  </Disclosure>
  <Disclosure v-slot="{ open }" class="mx-auto mt-6 w-full max-w-3xl">
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <DisclosureButton as="h3" itemprop="name" class="faq-button flex w-full cursor-pointer justify-between">
        <span v-if="locale=='en'">How can I implement the Add to Calendar Button?</span>
        <span v-else>Wie kann ich den Add to Calendar Button installieren?</span>
        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-inherit transition-transform" />
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="px-4 pb-6 pt-4 text-left" :unmount="false" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <div v-if="locale=='en'" itemprop="text">
            Implementing the Add to Calendar Button is quite straightforward and can be done in <a href="https://www.youtube.com/watch?v=rGcDeYRN8uI" target="_blank" rel="noopener">under 1 minute</a> (not lying)!<br />
            It is designed as a web component to perfectly fit into any website. Therefore, it can be used in any development environment, including JavaScript frameworks, website builders and even WordPress.<br />
            Have a look at the <NuxtLink :to="{path: localePath('index'), hash: '#installation'}">installation section</NuxtLink> and find the right step-by-step guide for your project!
          </div>
          <div v-else itemprop="text">
            Die Implementierung des Add to Calendar Buttons ist sehr einfach und kann in <a href="https://www.youtube.com/watch?v=rGcDeYRN8uI" target="_blank" rel="noopener">unter 1 Minute</a> erledigt werden!<br />
            Er ist als Web Component entwickelt, um perfekt in jede Website zu passen. Daher kann er auch unkompliziert in allen möglichen Entwicklungsumgebungen eingesetzt werden; einschließlich JavaScript-Frameworks, Website-Baukästen und sogar WordPress.<br />
            Wirf einen Blick in den <NuxtLink :to="{path: localePath('index'), hash: '#installation'}">Installations-Bereich</NuxtLink> und finde die passende Schritt-für-Schritt-Anleitung für dein Projekt!
          </div>
        </DisclosurePanel>
      </transition>
    </div>
  </Disclosure>
  <Disclosure v-slot="{ open }" class="mx-auto mt-6 w-full max-w-3xl">
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <DisclosureButton as="h3" itemprop="name" class="faq-button flex w-full cursor-pointer justify-between">
        <span v-if="locale=='en'">How does the Add to Calendar Button work?</span>
        <span v-else>Wie funktioniert der Add to Calendar Button?</span>
        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-inherit transition-transform" />
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="px-4 pb-6 pt-4 text-left" :unmount="false" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <div v-if="locale=='en'" itemprop="text">
            The Add to Calendar Button is a JavaScript library, that allows you to easily integrate a customizable button into your website.<br />
            When a user clicks on the button, a calendar event is generated and opened in the user's calendar app of choice.<br />
            The user can then save the event to his calendar and edit it as he likes.<br />
            The Add to Calendar Button supports all modern calendar schemes, including iCalendar, Google Calendar, Outlook, Yahoo Calendar and many more.<br />
            It is also highly customizable and can be used in almost every development environment.<br />
            On top of that, it considers many different use cases and setups. We solve the problem, that unfortunately, there is not this one scheme, which works for every user on every device in every browser.<br />
            Check out the <NuxtLink :to="localePath('use')">examples page</NuxtLink> for more cases and live demos or try it out yourself in the <NuxtLink :to="localePath('index') + '#demo'">playground</NuxtLink>!
          </div>
          <div v-else itemprop="text">
            Der Add to Calendar Button ist eine JavaScript-Bibliothek, die es dir ermöglicht, einen anpassbaren Button einfach in deine Website zu integrieren.<br />
            Wenn ein Benutzer auf den Button klickt, wird ein Kalender-Ereignis generiert und in der Kalender-App des Benutzers seiner Wahl geöffnet.<br />
            Der Benutzer kann das Ereignis dann in seinem Kalender speichern und nach Belieben bearbeiten.<br />
            Der Add to Calendar Button unterstützt alle modernen Kalender-Schemata, einschließlich iCalendar, Google Calendar, Outlook, Yahoo Calendar und viele mehr.<br />
            Er ist zudem hochgradig anpassbar und kann in nahezu jeder Entwicklungsumgebung eingesetzt werden.<br />
            Darüber hinaus berücksichtigt er viele verschiedene Anwendungsfälle und Setups. Wir lösen das Problem, dass es leider nicht dieses eine Schema gibt, das für jeden Benutzer auf jedem Gerät in jedem Browser funktioniert.<br />
            Schau dir die <NuxtLink :to="localePath('use')">Beispiele-Seite</NuxtLink> für weitere Fälle und Live-Demos an oder probiere es selbst im <NuxtLink :to="localePath('index') + '#demo'">Playground</NuxtLink> aus!
          </div>
        </DisclosurePanel>
      </transition>
    </div>
  </Disclosure>
  <Disclosure v-slot="{ open }" class="mx-auto mt-6 w-full max-w-3xl">
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <DisclosureButton as="h3" itemprop="name" class="faq-button flex w-full cursor-pointer justify-between">
        <span v-if="locale=='en'">What are the differences with Add to Calendar Button solutions?</span>
        <span v-else>Welche Unterschiede gibt es bei Add to Calendar Buttons?</span>
        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-inherit transition-transform" />
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="px-4 pb-6 pt-4 text-left" :unmount="false" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <div v-if="locale=='en'" itemprop="text">
            Most Add to Calendar scripts are highly outdated and therefore dysfunctional. Others are more or less up-to-date, but do only support very basic schemes, which break in many cases.<br />
            Besides that, there is at least one solution, which forces you to sign up for their services and pay for it, when you hit some limitations.<br />
            Our solution is open source, free to use and supports all modern calendar schemes. It is also highly customizable and can be used in almost every development environment.<br />
            On top of that, it considers many different use cases and setups. We solve the problem, that unfortunately, there is not this one scheme, which works for every user on every device in every browser.<br />
            <b>This makes this solution trusted by so many people all around the world!</b>
          </div>
          <div v-else itemprop="text">
            Die meisten Add to Calendar Skripte sind veraltet und daher nicht funktionsfähig. Andere sind mehr oder weniger aktuell, unterstützen aber nur sehr einfache Schemata, die in vielen Fällen nicht funktionieren.<br />
            Darüber hinaus gibt es mindestens eine Lösung, die dich dazu nötigt, dich für ihre Dienste anzumelden und dafür zu bezahlen, wenn du auf Einschränkungen stößt.<br />
            Unsere Lösung ist Open Source, kostenfrei nutzbar und unterstützt alle modernen Kalender-Schemata. Sie ist zudem hochgradig anpassbar und kann in nahezu jeder Entwicklungsumgebung eingesetzt werden.<br />
            Darüber hinaus berücksichtigt sie viele verschiedene Anwendungsfälle und Setups. Wir lösen das Problem, dass es leider nicht dieses eine Schema gibt, das für jeden Benutzer auf jedem Gerät in jedem Browser funktioniert.<br />
            <b>Dies macht diese Lösung zur ersten Wahl für so viele Menschen auf der ganzen Welt!</b>
          </div>
        </DisclosurePanel>
      </transition>
    </div>
  </Disclosure>
  <Disclosure v-slot="{ open }" class="mx-auto mt-6 w-full max-w-3xl">
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <DisclosureButton as="h3" itemprop="name" class="faq-button flex w-full cursor-pointer justify-between">
        <span v-if="locale=='en'">Is the Add to Calendar Button free to use?</span>
        <span v-else>Ist der Add to Calendar Button kostenfrei nutzbar?</span>
        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-inherit transition-transform" />
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="px-4 pb-6 pt-4 text-left" :unmount="false" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <div v-if="locale=='en'" itemprop="text">
            Yes. The Add to Calendar Button in its Opens Source version is free to use for everyone. You can use it for your personal projects as well as for your business.<br />
            This is even guaranteed by the <a href="https://archiveprogram.github.com/" target="_blank" rel="noopener">GitHub Archive Program</a>!<br />
            Still, mind the license, which is available at the <a href="https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt" target="_blank" rel="license">code repository</a>.<br />
            Bottom line, it is free as long as you <u>do not remove the copyright information</u> and <u>do not build your own managed event sharing solution</u> on top of it!
          </div>
          <div v-else itemprop="text">
            Ja. Der Add to Calendar Button in seiner Open Source Version ist für jeden kostenfrei nutzbar. Du kannst ihn für deine persönlichen Projekte ebenso nutzen wie für dein Unternehmen.<br />
            Dies wird sogar durch das <a href="https://archiveprogram.github.com/" target="_blank" rel="noopener">GitHub Archive Program</a> garantiert!<br />
            Beachte jedoch die Lizenz, die im <a href="https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt" target="_blank" rel="license">Code-Repository</a> einsehbar ist.<br />
            Zusammengefasst ist der Button kostenfrei, solange du <u>nicht die Urheberrechts-Informationen entfernst</u> und <u>keine eigene Event-Sharing-Lösung auf Basis des Add to Calendar Buttons entwickelst</u>!
          </div>
        </DisclosurePanel>
      </transition>
    </div>
  </Disclosure>
  <Disclosure v-slot="{ open }" class="mx-auto mt-6 w-full max-w-3xl">
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <DisclosureButton as="h3" itemprop="name" class="faq-button flex w-full cursor-pointer justify-between">
        <span v-if="locale=='en'">How can I customize the Add to Calendar Button?</span>
        <span v-else>Wie kann ich den Add to Calendar Button anpassen?</span>
        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-inherit transition-transform" />
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="px-4 pb-6 pt-4 text-left" :unmount="false" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <div v-if="locale=='en'" itemprop="text">
            You can customize the Add to Calendar Button directly within its HTML element.<br />
            Have a look at the <NuxtLink :to="localePath('use')">examples page</NuxtLink> to learn how this looks like.<br />
            The <NuxtLink :to="localePath('use')">configuration page</NuxtLink> holds more information on all available options.
          </div>
          <div v-else itemprop="text">
            Du kannst den Add to Calendar Button direkt in seinem HTML-Element anpassen.<br />
            Wirf einen Blick auf die <NuxtLink :to="localePath('use')">Beispiele-Seite</NuxtLink>, um zu sehen wie das aussieht.<br />
            Die <NuxtLink :to="localePath('use')">Konfigurations-Seite</NuxtLink> beinhaltet weitere Informationen zu allen verfügbaren Optionen.
          </div>
        </DisclosurePanel>
      </transition>
    </div>
  </Disclosure>
  <Disclosure v-slot="{ open }" class="mx-auto mt-6 w-full max-w-3xl">
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <DisclosureButton as="h3" itemprop="name" class="faq-button flex w-full cursor-pointer justify-between">
        <span v-if="locale=='en'">Does the Add to Calendar Button consider time zones?</span>
        <span v-else>Berücksichtigt der Add to Calendar Button Zeitzonen?</span>
        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-inherit transition-transform" />
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="px-4 pb-6 pt-4 text-left" :unmount="false" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <div v-if="locale=='en'" itemprop="text">
            Absolutely! The Add to Calendar Button script makes use of its own strong <a href="https://github.com/add2cal/timezones-ical-library" target="_blank" rel="noopener">time zone management library</a>, that is tightly connected to the official IANA time zone database.<br />
            This way, we can ensure a stable time zone support - no matter where in the world your user is located.
          </div>
          <div v-else itemprop="text">
            100%. Der Add to Calendar Button nutzt seine eigene <a href="https://github.com/add2cal/timezones-ical-library" target="_blank" rel="noopener">Time Zone Management Library</a>, die eng mit der offiziellen IANA Time Zone Datenbank verbunden ist.<br />
            Dadurch können wir eine stabile Zeitzonen-Unterstützung garantieren - unabhängig davon wo auf der Welt sich der Nutzer befindet.
          </div>
        </DisclosurePanel>
      </transition>
    </div>
  </Disclosure>
  <Disclosure v-slot="{ open }" class="mx-auto mt-6 w-full max-w-3xl">
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <DisclosureButton as="h3" itemprop="name" class="faq-button flex w-full cursor-pointer justify-between">
        <span v-if="locale=='en'">Does the Add to Calendar Button work with JavaScript frameworks?</span>
        <span v-else>Funktioniert der Add to Calendar Button mit JavaScript-Frameworks?</span>
        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-inherit transition-transform" />
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="px-4 pb-6 pt-4 text-left" :unmount="false" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <div v-if="locale=='en'" itemprop="text">Yes. The Add to Calendar script can be used within almost every development environment. Have a look at the <NuxtLink :to="{path: localePath('index'), hash: '#installation'}">installation section</NuxtLink> for examples and guides.</div>
          <div v-else itemprop="text">Ja. Das Add to Calendar Skript kann in quasi jeder Entwicklungsumgebung eingesetzt werden. Wirf einen Blick in den <NuxtLink :to="{path: localePath('index'), hash: '#installation'}">Installations-Bereich</NuxtLink> für Beispiele und Anleitungen.</div>
        </DisclosurePanel>
      </transition>
    </div>
  </Disclosure>
  <Disclosure v-slot="{ open }" class="mx-auto mt-6 w-full max-w-3xl">
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <DisclosureButton as="h3" itemprop="name" class="faq-button flex w-full cursor-pointer justify-between">
        <span v-if="locale=='en'">Does the Add to Calendar Button work with website builders?</span>
        <span v-else>Funktioniert der Add to Calendar Button mit Website-Baukästen?</span>
        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-inherit transition-transform" />
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="px-4 pb-6 pt-4 text-left" :unmount="false" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <div v-if="locale=='en'" itemprop="text">Yes. The Add to Calendar script can be used within almost every development environment. Have a look at the <NuxtLink :to="localePath('use')">default JavaScript integration guide</NuxtLink>.</div>
          <div v-else itemprop="text">Ja. Das Add to Calendar Skript kann in quasi jeder Entwicklungsumgebung eingesetzt werden. Wirf einen Blick in die <NuxtLink :to="localePath('use')">Standard JavaScript-Integrations-Anleitung</NuxtLink>.</div>
        </DisclosurePanel>
      </transition>
    </div>
  </Disclosure>
  <Disclosure v-slot="{ open }" class="mx-auto mt-6 w-full max-w-3xl">
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <DisclosureButton as="h3" itemprop="name" class="faq-button flex w-full cursor-pointer justify-between">
        <span v-if="locale=='en'">Does the Add to Calendar Button work with WordPress?</span>
        <span v-else>Funktioniert der Add to Calendar Button mit WordPress?</span>
        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-inherit transition-transform" />
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="px-4 pb-6 pt-4 text-left" :unmount="false" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <div v-if="locale=='en'" itemprop="text">Yes. The Add to Calendar script can be used within almost every development environment. For WordPress, a dedicated <a :href="wpUrl" target="_blank" rel="noopener">Plugin</a> is available as well. Find more details and guides for it above.</div>
          <div v-else itemprop="text">
            Ja. Das Add to Calendar Skript kann in quasi jeder Entwicklungsumgebung eingesetzt werden. Für WordPress steht zudem ein dediziertes <a :href="wpUrl" target="_blank" rel="noopener">Plugin</a> zur Verfügung. Mehr Details und Anleitungen findest du weiter oben.
          </div>
        </DisclosurePanel>
      </transition>
    </div>
  </Disclosure>
  <Disclosure v-slot="{ open }" class="mx-auto mt-6 w-full max-w-3xl">
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <DisclosureButton as="h3" itemprop="name" class="faq-button flex w-full cursor-pointer justify-between">
        <span v-if="locale=='en'">Does the Add to Calendar Button support my language?</span>
        <span v-else>Unterstützt der Add to Calendar Button meine Sprache?</span>
        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-inherit transition-transform" />
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="px-4 pb-6 pt-4 text-left" :unmount="false" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <div v-if="locale=='en'" itemprop="text">Yes. The Add to Calendar Button comes with over 20 languages, including RTL settings for Arabic and Persian. In case your language is not already included, you can also customize every single text block.</div>
          <div v-else itemprop="text">Ja. Der Add to Calendar Button beinhaltet über 20 Sprachen, inkl. RTL-Ausrichtung für Arabisch und Persisch. Sofern deine Sprache nicht bereits enthalten ist, kannst du jeden Text-Block entsprechend anpassen.</div>
        </DisclosurePanel>
      </transition>
    </div>
  </Disclosure>
</template>
