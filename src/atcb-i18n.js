/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 1.17.0
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Apache-2.0 with “Commons Clause” License Condition v1.0
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { atcb_rewrite_html_elements } from './atcb-util.js';

// TRANSLATIONS
// the database object
const i18nStrings = {
  en: {
    'Add to Calendar': 'Add to Calendar',
    'iCal File': 'iCal File',
    Close: 'Close',
    'Close Selection': 'Close Selection',
    'Click me': 'Click me',
    'WebView iCal headline': 'Open your browser',
    'WebView iCal info':
      'Unfortunately, in-app browsers have problems with the way we generate the calendar file.',
    'WebView iCal solution 1': "We automatically put a magical URL into your phone's clipboard.",
    'WebView iCal solution 2':
      '<ol><li><strong>Open another browser</strong> on your phone, ...</li><li><strong>Paste</strong> the clipboard content and go.</li></ol>',
    'Crios iCal headline': 'Open Safari',
    'Crios iCal info':
      'Unfortunately, Chrome on iOS has problems with the way we generate the calendar file.',
    'Crios iCal solution 2':
      '<ol><li><strong>Open Safari</strong>, ...</li><li><strong>Paste</strong> the clipboard content and go.</li></ol>',
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual events one by one:',
    Event: 'Event',
    'Cancelled Date': 'This date got cancelled.',
    'Delete from Calendar': 'Please update your calendar!',
  },
  de: {
    'Add to Calendar': 'Im Kalender speichern',
    'iCal File': 'iCal-Datei',
    Close: 'Schließen',
    'Close Selection': 'Auswahl schließen',
    'Click me': 'Klick mich',
    'WebView iCal headline': 'Öffne deinen Browser',
    'WebView iCal info':
      'Leider haben In-App-Browser Probleme mit der Art, wie wir Kalender-Dateien erzeugen.',
    'WebView iCal solution 1':
      'Wir haben automatisch eine magische URL in die Zwischenablage deines Smartphones kopiert.',
    'WebView iCal solution 2':
      '<ol><li><strong>Öffne einen anderen Browser</strong> auf deinem Smartphone, ...</li><li>Nutze die <strong>Einfügen</strong>-Funktion, um fortzufahren.</li></ol>',
    'Crios iCal headline': 'Öffne Safari',
    'Crios iCal info': 'Leider Chrome unter iOS Probleme mit der Art, wie wir Kalender-Dateien erzeugen.',
    'Crios iCal solution 2':
      '<ol><li><strong>Öffne Safari</strong>, ...</li><li>Nutze die <strong>Einfügen</strong>-Funktion, um fortzufahren.</li></ol>',
    'MultiDate headline': 'Dies is eine Termin-Reihe',
    'MultiDate info': 'Füge die einzelnen Termine der Reihe nach deinem Kalender hinzu:',
    Event: 'Termin',
    'Cancelled Date': 'Dieser Termin wurde abgesagt.',
    'Delete from Calendar': 'Bitte aktualisiere deinen Kalender!',
  },
  es: {
    'Add to Calendar': 'Añadir al Calendario',
    'iCal File': 'iCal Ficha',
    Close: 'Ciérralo',
    'Close Selection': 'Cerrar Selección',
    'Click me': 'Haz clic mí',
    'WebView iCal headline': 'Abra su browser',
    'WebView iCal info':
      'Lamentablemente, los browsers in-app tienen problemas con la forma en que generamos el archivo del calendario.',
    'WebView iCal solution 1':
      'Hemos copiado automáticamente una URL mágica en el portapapeles de tu smartphone.',
    'WebView iCal solution 2':
      '<ol><li><strong>Abre otro browser</strong> en tu smartphone, ...</li><li>Utilice la función de <strong>pegar</strong> para continuar.</li></ol>',
    'Crios iCal headline': 'Abrir Safari',
    'Crios iCal info':
      'Lamentablemente, Chrome en iOS tiene problemas con la forma de generar el archivo de calendario.',
    'Crios iCal solution 2':
      '<ol><li><strong>Abrir Safari</strong>, ...</li><li>Utilice la función de <strong>pegar</strong> para continuar.</li></ol>',
    'MultiDate headline': 'Esta es una serie de fechas',
    'MultiDate info': 'Añada las fechas individuales a su calendario en orden:',
    Event: 'Término',
    'Cancelled Date': 'Esta fecha fue cancelada.',
    'Delete from Calendar': 'Actualice su calendario!',
  },
  pt: {
    'Add to Calendar': 'Incluir no Calendário',
    'iCal File': 'Ficheiro iCal',
    Close: 'Fechar',
    'Close Selection': 'Fechar selecção',
    'Click me': 'Clicar-me',
    'WebView iCal headline': 'Abra o seu browser',
    'WebView iCal info':
      'Infelizmente, os navegadores em tampas têm problemas com a forma como geramos o ficheiro de calendário.',
    'WebView iCal solution 1':
      'Copiámos automaticamente um URL mágico para a área de transferência do seu smartphone.',
    'WebView iCal solution 2':
      '<ol><li><strong>Abrir outro browser</strong> en tu smartphone, ...</li><li>Use a função <forte>colar</strong> para continuar.</li></ol>',
    'Crios iCal headline': 'Safari aberto',
    'Crios iCal info':
      'Infelizmente, o cromado no iOS tem problemas com a forma como geramos o ficheiro do calendário.',
    'Crios iCal solution 2':
      '<ol><li><strong>Safari aberto</strong>, ...</li><li>Use a função <forte>colar</strong> para continuar.</li></ol>',
    'MultiDate headline': 'Esta é uma série de datas',
    'MultiDate info': 'Adicione as datas individuais ao seu calendário, por ordem:',
    Event: 'Termo',
    'Cancelled Date': 'Esta data foi cancelada.',
    'Delete from Calendar': 'Actualize o seu calendário!',
  },
  fr: {
    'Add to Calendar': 'Ajout au Calendrier',
    'iCal File': 'iCal Fichier',
    Close: 'Fermez',
    'Close Selection': 'Fermez la sélection',
    'Click me': 'Cliquez-moi',
    'WebView iCal headline': 'Ouvrez votre navigateur',
    'WebView iCal info':
      'Malheureusement, les navigateurs in-app ont des problèmes avec la manière dont nous créons les fichiers de calendrier.',
    'WebView iCal solution 1':
      'Nous avons automatiquement copié une URL magique dans le presse-papiers de ton smartphone.',
    'WebView iCal solution 2':
      '<ol><li><strong>Ouvre un autre navigateur</strong> sur ton smartphone, ...</li><li>Utilise la fonction <strong>insérer</strong> pour continuer.</li></ol>',
    'Crios iCal headline': 'Ouvre Safari',
    'Crios iCal info':
      'Malheureusement, Chrome sur iOS a des problèmes avec la façon dont nous générons le fichier du calendrier.',
    'Crios iCal solution 2':
      '<ol><li><strong>Ouvre Safari</strong>, ...</li><li>Utilise la fonction <strong>insérer</strong> pour continuer.</li></ol>',
    'MultiDate headline': "Il s'agit d'une série d'événements",
    'MultiDate info': "Ajoute les différents rendez-vous dans l'ordre à ton calendrier:",
    Event: 'Terminaison',
    'Cancelled Date': 'Cette date est annulée.',
    'Delete from Calendar': 'Actualisez votre calendrier!',
  },
  nl: {
    'Add to Calendar': 'Opslaan in Kalender',
    'iCal File': 'iCal File',
    Close: 'Sluiten',
    'Close Selection': 'Sluit selectie',
    'Click me': 'Klik me',
    'WebView iCal headline': 'Open uw browser',
    'WebView iCal info':
      'Helaas hebben in-app browsers problemen met de manier waarop wij kalenderbestanden maken.',
    'WebView iCal solution 1':
      'We hebben automatisch een magische URL naar het klembord van uw smartphone gekopieerd.',
    'WebView iCal solution 2':
      '<ol><li><strong>Open een andere browser</strong> op uw smartphone, ...</li><li>Gebruik de <strong>insert</strong> functie om verder te gaan.</li></ol>',
    'Crios iCal headline': 'Open Safari',
    'Crios iCal info':
      'Helaas heeft Chrome op iOS problemen met de manier waarop we het kalenderbestand genereren.',
    'Crios iCal solution 2':
      '<ol><li><strong>Open Safari</strong>, ...</li><li>Gebruik de <strong>insert</strong> functie om verder te gaan.</li></ol>',
    'MultiDate headline': 'Dit is een reeks data',
    'MultiDate info': 'Voeg de afzonderlijke delen één voor één toe:',
    Event: 'Termin',
    'Cancelled Date': 'Deze datum is geannuleerd.',
    'Delete from Calendar': 'Uw kalender bijwerken!',
  },
  tr: {
    'Add to Calendar': 'Takvime Ekle',
    'iCal File': 'iCal Dosyası',
    Close: 'Kapat',
    'Close Selection': 'Seçimi kapat',
    'Click me': 'Beni tıklayın',
    'WebView iCal headline': 'Tarayıcınızı açın',
    'WebView iCal info':
      'Ne yazık ki, uygulama içi tarayıcılar takvim dosyalarını oluşturma şeklimizle ilgili sorunlar yaşıyor.',
    'WebView iCal solution 1': 'Akıllı telefonunuzun panosuna otomatik olarak sihirli bir URL kopyaladık.',
    'WebView iCal solution 2':
      '<ol><li><strong>Akıllı telefonunuzda başka bir tarayıcı açın</strong>, ...</li><li>Devam etmek için <strong>insert</strong> fonksiyonunu kullanın.</li></ol>',
    'Crios iCal headline': 'Açık Safari',
    'Crios iCal info':
      "Ne yazık ki iOS'ta Chrome'un takvim dosyası oluşturma yöntemiyle ilgili sorunları var.",
    'Crios iCal solution 2':
      '<ol><li><strong>Açık Safari</strong>, ...</li><li>Devam etmek için <strong>insert</strong> fonksiyonunu kullanın.</li></ol>',
    'MultiDate headline': 'Bu bir etkinlik serisidir',
    'MultiDate info': 'Parçaları teker teker ekleyin:',
    Event: 'Etkinlik',
    'Cancelled Date': 'Bu tarih iptal edildi.',
    'Delete from Calendar': 'Lütfen takviminizi güncelleyin!',
  },
  zh: {
    'Add to Calendar': '添加到日历',
    'iCal File': 'iCal 文件',
    Close: '关',
    'Close Selection': '关闭选择',
    'Click me': '点我',
    'WebView iCal headline': '打开浏览器',
    'WebView iCal info': '不幸的是，应用内浏览器在我们生成日历文件的方式上存在问题.',
    'WebView iCal solution 1': '我们会自动将一个神奇的 URL 放入您手机的剪贴板.',
    'WebView iCal solution 2':
      '<ol><li>打开手机上的任何其他浏览器, ...</li><li>粘贴剪贴板内容并开始.</li></ol>',
    'Crios iCal headline': '打开 Safari',
    'Crios iCal info': '不幸的是，iOS 上的 Chrome 在我们生成日历文件的方式上存在问题.',
    'Crios iCal solution 2':
      '<ol><li><strong>打开 Safari</strong>, ...</li><li>粘贴剪贴板内容并开始.</li></ol>',
    'MultiDate headline': '这是一个活动系列',
    'MultiDate info': '逐个添加各个部分:',
    Event: '事件',
    'Cancelled Date': '此日期已取消.',
    'Delete from Calendar': '请更新您的日历!',
  },
  ar: {
    'Add to Calendar': 'إضافة إلى التقويم',
    'iCal File': 'ملف iCal',
    Close: 'قريب',
    'Close Selection': 'إغلاق التحديد',
    'Click me': 'انقر فوق لي',
    'WebView iCal headline': 'افتح المستعرض الخاص بك',
    'WebView iCal info': 'لسوء الحظ ، تواجه المتصفحات داخل التطبيق مشاكل في طريقة إنشاء ملف التقويم.',
    'WebView iCal solution 1': 'نضع تلقائيًا عنوان ويب سحريًا في حافظة هاتفك.',
    'WebView iCal solution 2':
      '<ol><li>افتح أي متصفح آخر على هاتفك الذكي, ...</li><li>.الصق محتوى الحافظة واذهب</li></ol>',
    'Crios iCal headline': 'افتح Safari',
    'Crios iCal info': 'لسوء الحظ ، يواجه Chrome على iOS مشاكل في طريقة إنشاء ملف التقويم',
    'Crios iCal solution 2':
      '<ol><li><strong>افتح Safari</strong>, ...</li><li>الصق محتوى الحافظة واذهب.</li></ol>',
    'MultiDate headline': 'هذه سلسلة أحداث',
    'MultiDate info': 'أضف الأجزاء الفردية واحدة تلو الأخرى:',
    Event: 'حدث',
    'Cancelled Date': 'تم إلغاء هذا التاريخ.',
    'Delete from Calendar': 'الرجاء تحديث التقويم الخاص بك!',
  },
  hi: {
    'Add to Calendar': 'कैलेंडर में जोड़ें',
    'iCal File': 'iCal फ़ाइल',
    Close: 'बंद करना',
    'Close Selection': 'चयन बंद करें',
    'Click me': 'मुझे क्लिक करें',
    'WebView iCal headline': 'अपना ब्राउज़र खोलें',
    'WebView iCal info': 'दुर्भाग्य से, इन-ऐप ब्राउज़र में कैलेंडर फ़ाइल बनाने के तरीके में समस्याएँ हैं।',
    'WebView iCal solution 1': 'हम स्वचालित रूप से आपके फ़ोन के क्लिपबोर्ड में एक जादुई URL डालते हैं।',
    'WebView iCal solution 2':
      '<ol><li>अपने फ़ोन पर <strong>दूसरा ब्राउज़र खोलें</strong>, ...</li><li>क्लिपबोर्ड सामग्री <strong>चिपकाएं</strong> और जाएं।</li></ol>',
    'Crios iCal headline': 'सफारी खोलें',
    'Crios iCal info':
      'दुर्भाग्य से, iOS पर Chrome को कैलेंडर फ़ाइल जेनरेट करने के हमारे तरीके में समस्या है।',
    'Crios iCal solution 2':
      '<ol><li><strong>सफारी खोलें</strong>, ...</li><li>क्लिपबोर्ड सामग्री <strong>चिपकाएं</strong> और जाएं।</li></ol>',
    'MultiDate headline': 'यह एक इवेंट सीरीज़ है',
    'MultiDate info': 'अलग-अलग हिस्सों को एक-एक करके जोड़ें:',
    Event: 'आयोजन',
    'Cancelled Date': 'यह तिथि रद्द हो गई।',
    'Delete from Calendar': 'कृपया अपना कैलेंडर अपडेट करें!',
  },
  pl: {
    'Add to Calendar': 'Dodaj do kalendarza',
    'iCal File': 'Plik iCal',
    Close: 'Zamknij',
    'Close Selection': 'Zamknij wybór',
    'Click me': 'Kliknij mnie',
    'WebView iCal headline': 'Otwórz przeglądarkę',
    'WebView iCal info':
      'Niestety, przeglądarki in-app mają problemy ze sposobem, w jaki generujemy plik kalendarza.',
    'WebView iCal solution 1': 'Automatycznie umieszczamy magiczny adres URL w schowku telefonu.',
    'WebView iCal solution 2':
      '<ol><li><strong>Otwórz inną przeglądarkę</strong> w swoim telefonie, ...</li><li><strong>Wklej</strong> zawartość schowka i ruszaj.</li></ol>',
    'Crios iCal headline': 'Otwórz Safari',
    'Crios iCal info': 'Niestety, Chrome na iOS ma problemy ze sposobem generowania pliku kalendarza.',
    'Crios iCal solution 2':
      '<ol><li><strong>Otwórz Safari</strong>, ...</li><li><strong>Wklej</strong> zawartość schowka i ruszaj.</li></ol>',
    'MultiDate headline': 'To jest cykl imprez',
    'MultiDate info': 'Dodawać po kolei poszczególne części:',
    Event: 'Wydarzenie',
    'Cancelled Date': 'Ta data została odwołana.',
    'Delete from Calendar': 'Zaktualizuj swój kalendarz!',
  },
  id: {
    'Add to Calendar': 'Tambahkan ke Kalender',
    'iCal File': 'File iCal',
    Close: 'Tutup',
    'Close Selection': 'Seleksi Tutup',
    'Click me': 'Klik saya',
    'WebView iCal headline': 'Buka browser Anda',
    'WebView iCal info':
      'Sayangnya, browser dalam aplikasi memiliki masalah dengan cara kami menghasilkan file kalender.',
    'WebView iCal solution 1': 'Kami secara otomatis memasukkan URL ajaib ke clipboard ponsel Anda.',
    'WebView iCal solution 2':
      '<ol><li><strong>Buka peramban lain</strong> pada ponsel Anda, ...</li><li>Tempelkan konten clipboard dan pergi.</li></ol>',
    'Crios iCal headline': 'Buka Safari',
    'Crios iCal info':
      'Sayangnya, Chrome di iOS memiliki masalah dengan cara kami menghasilkan file kalender.',
    'Crios iCal solution 2':
      '<ol><li><strong>Buka Safari</strong>, ...</li><li>Tempelkan konten clipboard dan pergi.</li></ol>',
    'MultiDate headline': 'Ini adalah rangkaian acara',
    'MultiDate info': 'Tambahkan masing-masing bagian satu per satu:',
    Event: 'Acara',
    'Cancelled Date': 'Tanggal ini dibatalkan.',
    'Delete from Calendar': 'Perbarui kalender Anda!',
  },
  no: {
    'Add to Calendar': 'Legg til i kalenderen',
    'iCal File': 'iCal-fil',
    Close: 'Lukk',
    'Close Selection': 'Lukk utvalg',
    'Click me': 'Klikk på meg',
    'WebView iCal headline': 'Åpne nettleseren din',
    'WebView iCal info':
      'Dessverre har nettlesere i appen problemer med måten vi genererer kalenderfilen på.',
    'WebView iCal solution 1': 'Vi legger automatisk inn en magisk URL i telefonens utklippstavle.',
    'WebView iCal solution 2':
      '<ol><li><strong>Åpne en annen nettleser</strong> på telefonen, ...</li><li><strong>Lim inn</strong> innholdet på utklippstavlen og gå.</li></ol>',
    'Crios iCal headline': 'Åpne Safari',
    'Crios iCal info': 'Dessverre har Chrome på iOS problemer med måten vi genererer kalenderfilen på.',
    'Crios iCal solution 2':
      '<ol><li><strong>Åpne Safari</strong>, ...</li><li><strong>Lim inn</strong> innholdet på utklippstavlen og gå.</li></ol>',
    'MultiDate headline': 'Dette er en avtaleserie',
    'MultiDate info': 'Legg til de enkelte datoene i kalenderen din i rekkefølge:',
    Event: 'Møte',
    'Cancelled Date': 'Denne datoen ble avlyst.',
    'Delete from Calendar': 'Oppdater kalenderen din!',
  },
  fi: {
    'Add to Calendar': 'Lisää kalenteriin',
    'iCal File': 'iCal-tiedosto',
    Close: 'Sulje',
    'Close Selection': 'Sulje valinta',
    'Click me': 'Klikkaa minua',
    'WebView iCal headline': 'Avaa selain',
    'WebView iCal info':
      'Valitettavasti sovelluksen sisäisillä selaimilla on ongelmia kalenteritiedoston luomisessa.',
    'WebView iCal solution 1': 'Laitamme automaattisesti maagisen URL-osoitteen puhelimesi leikepöydälle.',
    'WebView iCal solution 2':
      '<ol><li><strong>Avaa toinen selain</strong> puhelimessasi., ...</li><li><strong>liitä</strong> leikepöydän sisältö ja lähde.</li></ol>',
    'Crios iCal headline': 'Avaa Safari',
    'Crios iCal info': 'Valitettavasti iOS:n Chromessa on ongelmia kalenteritiedoston luomisessa.',
    'Crios iCal solution 2':
      '<ol><li><strong>Avaa Safari</strong>, ...</li><li><strong>liitä</strong> leikepöydän sisältö ja lähde.</li></ol>',
    'MultiDate headline': 'Tämä on tapahtumasarja',
    'MultiDate info': 'Lisää yksittäiset osat yksi kerrallaan:',
    Event: 'Tapahtuma',
    'Cancelled Date': 'Tämä päivämäärä peruttiin.',
    'Delete from Calendar': 'Päivitä kalenterisi!',
  },
  sv: {
    'Add to Calendar': 'Lägg till i kalender',
    'iCal File': 'iCal-fil',
    Close: 'Stäng',
    'Close Selection': 'Stäng urvalet',
    'Click me': 'Klicka på mig',
    'WebView iCal headline': 'Öppna din webbläsare',
    'WebView iCal info': 'Tyvärr har webbläsare i appen problem med hur vi genererar kalenderfilen.',
    'WebView iCal solution 1': 'Vi lägger automatiskt in en magisk webbadress i telefonens klippbräda.',
    'WebView iCal solution 2':
      '<ol><li><strong>Öppna en annan webbläsare</strong> på telefonen, ...</li><li><strong>Insätt</strong> innehållet i klippbordet och kör.</li></ol>',
    'Crios iCal headline': 'Öppna Safari',
    'Crios iCal info': 'Tyvärr har Chrome på iOS problem med hur vi genererar kalenderfilen.',
    'Crios iCal solution 2':
      '<ol><li><strong>Öppna Safari</strong>, ...</li><li><strong>Insätt</strong> innehållet i klippbordet och kör.</li></ol>',
    'MultiDate headline': 'Detta är en evenemangsserie',
    'MultiDate info': 'Lägg till de enskilda delarna en efter en:',
    Event: 'Evenemang',
    'Cancelled Date': 'Detta datum har ställts in.',
    'Delete from Calendar': 'Uppdatera din kalender!',
  },
  cs: {
    'Add to Calendar': 'Přidat do kalendáře',
    'iCal File': 'Soubor iCal',
    Close: 'Zavřít',
    'Close Selection': 'Zavřít výběr',
    'Click me': 'Klikněte na mě',
    'WebView iCal headline': 'Otevřete prohlížeč',
    'WebView iCal info':
      'Prohlížeče v aplikacích mají bohužel problémy se způsobem generování souboru kalendáře.',
    'WebView iCal solution 1': 'Do schránky telefonu automaticky vložíme kouzelnou adresu URL.',
    'WebView iCal solution 2':
      '<ol><li><strong>Otevření jiného prohlížeče</strong> v telefonu, ...</li><li><strong>Vložte</strong> obsah schránky a přejděte.</li></ol>',
    'Crios iCal headline': 'Otevřít Safari',
    'Crios iCal info': 'Chrome v systému iOS má bohužel problémy se způsobem generování souboru kalendáře.',
    'Crios iCal solution 2':
      '<ol><li><strong>Otevřít Safari</strong>, ...</li><li><strong>Vložte</strong> obsah schránky a přejděte.</li></ol>',
    'MultiDate headline': 'Jedná se o sérii událostí',
    'MultiDate info': 'Přidávejte jednotlivé díly jeden po druhém:',
    Event: 'Událost',
    'Cancelled Date': 'Toto datum bylo zrušeno.',
    'Delete from Calendar': 'Aktualizujte svůj kalendář!',
  },
  ja: {
    'Add to Calendar': 'カレンダーに追加',
    'iCal File': 'iCalファイル',
    Close: '閉じる',
    'Close Selection': 'クローズ選択',
    'Click me': 'クリックしてください',
    'WebView iCal headline': 'ブラウザを起動する',
    'WebView iCal info': '残念ながら、アプリ内ブラウザは、カレンダーファイルの生成方法に問題があります。',
    'WebView iCal solution 1': 'あなたの携帯電話のクリップボードに、魔法のようなURLを自動的に入れます。',
    'WebView iCal solution 2':
      '<ol><li>スマートフォンで別のブラウザを起動する, ...</li><li>クリップボードの内容を貼り付けて行く。</li></ol>',
    'Crios iCal headline': 'オープンSafari',
    'Crios iCal info': '残念ながら、iOS版Chromeでは、カレンダーファイルの生成方法に問題があります。',
    'Crios iCal solution 2':
      '<ol><li><strong>オープンSafari</strong>, ...</li><li>クリップボードの内容を貼り付けて行く。</li></ol>',
    'MultiDate headline': 'イベントシリーズです',
    'MultiDate info': '個々のパーツを一つずつ追加していく:',
    Event: 'イベント',
    'Cancelled Date': 'この日はキャンセルになりました.',
    'Delete from Calendar': 'カレンダーを更新する!',
  },
  it: {
    'Add to Calendar': 'Aggiungi al calendario',
    'iCal File': 'File iCal',
    Close: 'Chiudere',
    'Close Selection': 'Chiudere la selezione',
    'Click me': 'Clicca su di me',
    'WebView iCal headline': 'Aprire il browser',
    'WebView iCal info':
      'Purtroppo i browser in-app hanno problemi con il modo in cui generiamo il file del calendario.',
    'WebView iCal solution 1': 'Inseriamo automaticamente un URL magico negli appunti del telefono.',
    'WebView iCal solution 2':
      '<ol><li><strong>Aprire un altro browser</strong> sul cellulare, ...</li><li><strong>Incollare</strong> il contenuto degli appunti e partire.</li></ol>',
    'Crios iCal headline': 'Aprire Safari',
    'Crios iCal info':
      'Purtroppo, Chrome su iOS ha problemi con il modo in cui generiamo il file del calendario.',
    'Crios iCal solution 2':
      '<ol><li><strong>Aprire Safari</strong>, ...</li><li><strong>Incollare</strong> il contenuto degli appunti e partire.</li></ol>',
    'MultiDate headline': 'Questa è una serie di eventi',
    'MultiDate info': 'Aggiungere le singole parti una per una:',
    Event: 'Evento',
    'Cancelled Date': 'La data è stata annullata.',
    'Delete from Calendar': 'Aggiornare il calendario!',
  },
  ko: {
    'Add to Calendar': '캘린더에 추가',
    'iCal File': 'iCal 파일',
    Close: '닫다',
    'Close Selection': '선택 닫기',
    'Click me': '클릭 해주세요',
    'WebView iCal headline': '브라우저 열기',
    'WebView iCal info': '불행히도 인앱 브라우저는 캘린더 파일을 생성하는 방식에 문제가 있습니다.',
    'WebView iCal solution 1': '자동으로 마법의 URL을 휴대전화의 클립보드에 넣습니다.',
    'WebView iCal solution 2':
      '<ol><li>휴대전화에서 다른 브라우저 열기, ...</li><li>클립보드 내용을 붙여넣고 이동합니다.</li></ol>',
    'Crios iCal headline': 'Safari 열기',
    'Crios iCal info': '불행히도 iOS의 Chrome은 캘린더 파일을 생성하는 방식에 문제가 있습니다.',
    'Crios iCal solution 2':
      '<ol><li><strong>Safari 열기</strong>, ...</li><li>클립보드 내용을 붙여넣고 이동합니다.</li></ol>',
    'MultiDate headline': '이벤트 시리즈입니다',
    'MultiDate info': '개별 부품을 하나씩 추가:',
    Event: '이벤트',
    'Cancelled Date': '이 날짜는 취소되었습니다.',
    'Delete from Calendar': '캘린더를 업데이트하세요!',
  },
  vi: {
    'Add to Calendar': 'Thêm vào Lịch',
    'iCal File': 'Tệp iCal',
    Close: 'Đóng',
    'Close Selection': 'Đóng lựa chọn',
    'Click me': 'Nhấp vào đây',
    'WebView iCal headline': 'Mở trình duyệt của bạn',
    'WebView iCal info':
      'Rất tiếc, các trình duyệt trong ứng dụng gặp sự cố với cách chúng tôi tạo tệp lịch.',
    'WebView iCal solution 1':
      'Chúng tôi tự động đặt một URL kỳ diệu vào khay nhớ tạm thời trên điện thoại của bạn.',
    'WebView iCal solution 2':
      '<ol><li><strong> Mở trình duyệt khác </strong> trên điện thoại của bạn, ...</li><li><strong> Dán </strong> nội dung khay nhớ tạm và bắt đầu.</li></ol>',
    'Crios iCal headline': 'Mở Safari',
    'Crios iCal info': 'Rất tiếc, Chrome trên iOS gặp sự cố với cách chúng tôi tạo tệp lịch.',
    'Crios iCal solution 2':
      '<ol><li><strong>Mở Safari</strong>, ...</li><li><strong> Dán </strong> nội dung khay nhớ tạm và bắt đầu.</li></ol>',
    'MultiDate headline': 'Đây là một chuỗi sự kiện',
    'MultiDate info': 'Thêm từng phần riêng lẻ một:',
    Event: 'Biến cố',
    'Cancelled Date': 'Ngày này đã bị hủy.',
    'Delete from Calendar': 'Cập nhật lịch của bạn!',
  },
};

// hook, which can be used to override all potential "hard" strings by setting customLabel_ + the key (without spaces) as option key and the intended string as value
function atcb_translate_hook(identifier, data) {
  const searchKey = identifier.replace(/\s+/g, '').toLowerCase();
  if (
    data.customLabels != null &&
    data.customLabels[`${searchKey}`] != null &&
    data.customLabels[`${searchKey}`] != ''
  ) {
    return atcb_rewrite_html_elements(data.customLabels[`${searchKey}`]);
  } else {
    return atcb_translate(identifier, data.language);
  }
}

function atcb_translate(identifier, language) {
  // set default language
  if (!language) {
    language = 'en';
  }
  // return string, if available
  if (i18nStrings[`${language}`][`${identifier}`]) {
    return i18nStrings[`${language}`][`${identifier}`];
  }
  // if nothing found, return the original identifier
  return identifier;
}

export { atcb_translate_hook };
