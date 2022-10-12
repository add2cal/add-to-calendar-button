const tzlibVersion = '1.3.2';
/* Creator: Jens Kuerschner (https://jenskuerschner.de)
 * Project: https://github.com/add2cal/timezones-ical-library
 * License: Apache-2.0
 *
 */
const tzlibZonesDB = {
  Africa: {
    Abidjan: ['', 0],
    Accra: ['Africa/Abidjan', 0],
    Addis_Ababa: ['Africa/Nairobi', 1],
    Algiers: ['', 2],
    Asmara: ['Africa/Nairobi', 1],
    Asmera: ['Africa/Nairobi', 1],
    Bamako: ['Africa/Abidjan', 0],
    Bangui: ['Africa/Lagos', 3],
    Banjul: ['Africa/Abidjan', 0],
    Bissau: ['', 0],
    Blantyre: ['Africa/Maputo', 4],
    Brazzaville: ['Africa/Lagos', 3],
    Bujumbura: ['Africa/Maputo', 4],
    Cairo: ['', 5],
    Casablanca: ['', 6],
    Ceuta: ['', 7],
    Conakry: ['Africa/Abidjan', 0],
    Dakar: ['Africa/Abidjan', 0],
    Dar_es_Salaam: ['Africa/Nairobi', 1],
    Djibouti: ['Africa/Nairobi', 1],
    Douala: ['Africa/Lagos', 3],
    El_Aaiun: ['', 6],
    Freetown: ['Africa/Abidjan', 0],
    Gaborone: ['Africa/Maputo', 4],
    Harare: ['Africa/Maputo', 4],
    Johannesburg: ['', 8],
    Juba: ['', 4],
    Kampala: ['Africa/Nairobi', 1],
    Khartoum: ['', 4],
    Kigali: ['Africa/Maputo', 4],
    Kinshasa: ['Africa/Lagos', 3],
    Lagos: ['', 3],
    Libreville: ['Africa/Lagos', 3],
    Lome: ['Africa/Abidjan', 0],
    Luanda: ['Africa/Lagos', 3],
    Lubumbashi: ['Africa/Maputo', 4],
    Lusaka: ['Africa/Maputo', 4],
    Malabo: ['Africa/Lagos', 3],
    Maputo: ['', 4],
    Maseru: ['Africa/Johannesburg', 8],
    Mbabane: ['Africa/Johannesburg', 8],
    Mogadishu: ['Africa/Nairobi', 1],
    Monrovia: ['', 0],
    Nairobi: ['', 1],
    Ndjamena: ['', 3],
    Niamey: ['Africa/Lagos', 3],
    Nouakchott: ['Africa/Abidjan', 0],
    Ouagadougou: ['Africa/Abidjan', 0],
    'Porto-Novo': ['Africa/Lagos', 3],
    Sao_Tome: ['', 0],
    Timbuktu: ['Africa/Abidjan', 0],
    Tripoli: ['', 5],
    Tunis: ['', 2],
    Windhoek: ['', 4],
  },
  America: {
    Adak: ['', 9],
    Anchorage: ['', 10],
    Anguilla: ['America/Puerto_Rico', 11],
    Antigua: ['America/Puerto_Rico', 11],
    Araguaina: ['', 12],
    Argentina: {
      Buenos_Aires: ['', 12],
      Catamarca: ['', 12],
      ComodRivadavia: ['America/Argentina/Catamarca', 12],
      Cordoba: ['', 12],
      Jujuy: ['', 12],
      La_Rioja: ['', 12],
      Mendoza: ['', 12],
      Rio_Gallegos: ['', 12],
      Salta: ['', 12],
      San_Juan: ['', 12],
      San_Luis: ['', 12],
      Tucuman: ['', 12],
      Ushuaia: ['', 12],
    },
    Aruba: ['America/Puerto_Rico', 11],
    Asuncion: ['', 13],
    Atikokan: ['America/Panama', 14],
    Atka: ['America/Adak', 9],
    Bahia_Banderas: ['', 15],
    Bahia: ['', 12],
    Barbados: ['', 11],
    Belem: ['', 12],
    Belize: ['', 16],
    'Blanc-Sablon': ['America/Puerto_Rico', 11],
    Boa_Vista: ['', 17],
    Bogota: ['', 18],
    Boise: ['', 19],
    Buenos_Aires: ['America/Argentina/Buenos_Aires', 12],
    Cambridge_Bay: ['', 19],
    Campo_Grande: ['', 17],
    Cancun: ['', 14],
    Caracas: ['', 17],
    Catamarca: ['America/Argentina/Catamarca', 12],
    Cayenne: ['', 12],
    Cayman: ['America/Panama', 14],
    Chicago: ['', 20],
    Chihuahua: ['', 21],
    Coral_Harbour: ['America/Panama', 14],
    Cordoba: ['America/Argentina/Cordoba', 12],
    Costa_Rica: ['', 16],
    Creston: ['America/Phoenix', 22],
    Cuiaba: ['', 17],
    Curacao: ['America/Puerto_Rico', 11],
    Danmarkshavn: ['', 0],
    Dawson_Creek: ['', 22],
    Dawson: ['', 22],
    Denver: ['', 19],
    Detroit: ['', 23],
    Dominica: ['America/Puerto_Rico', 11],
    Edmonton: ['', 19],
    Eirunepe: ['', 18],
    El_Salvador: ['', 16],
    Ensenada: ['America/Tijuana', 24],
    Fort_Nelson: ['', 22],
    Fort_Wayne: ['America/Indiana/Indianapolis', 23],
    Fortaleza: ['', 12],
    Glace_Bay: ['', 25],
    Godthab: ['America/Nuuk', 26],
    Goose_Bay: ['', 27],
    Grand_Turk: ['', 28],
    Grenada: ['America/Puerto_Rico', 11],
    Guadeloupe: ['America/Puerto_Rico', 11],
    Guatemala: ['', 16],
    Guayaquil: ['', 18],
    Guyana: ['', 17],
    Halifax: ['', 25],
    Havana: ['', 29],
    Hermosillo: ['', 22],
    Indiana: {
      Indianapolis: ['', 23],
      Knox: ['', 20],
      Marengo: ['', 23],
      Petersburg: ['', 23],
      Tell_City: ['', 20],
      Vevay: ['', 23],
      Vincennes: ['', 23],
      Winamac: ['', 28],
    },
    Indianapolis: ['America/Indiana/Indianapolis', 23],
    Inuvik: ['', 19],
    Iqaluit: ['', 23],
    Jamaica: ['', 14],
    Jujuy: ['America/Argentina/Jujuy', 12],
    Juneau: ['', 10],
    Kentucky: { Louisville: ['', 23], Monticello: ['', 23] },
    Knox_IN: ['America/Indiana/Knox', 20],
    Kralendijk: ['America/Puerto_Rico', 11],
    La_Paz: ['', 17],
    Lima: ['', 18],
    Los_Angeles: ['', 24],
    Louisville: ['America/Kentucky/Louisville', 23],
    Lower_Princes: ['America/Puerto_Rico', 11],
    Maceio: ['', 12],
    Managua: ['', 16],
    Manaus: ['', 17],
    Marigot: ['America/Puerto_Rico', 11],
    Martinique: ['', 11],
    Matamoros: ['', 20],
    Mazatlan: ['', 21],
    Mendoza: ['America/Argentina/Mendoza', 12],
    Menominee: ['', 20],
    Merida: ['', 30],
    Metlakatla: ['', 10],
    Mexico_City: ['', 30],
    Miquelon: ['', 31],
    Moncton: ['', 25],
    Monterrey: ['', 30],
    Montevideo: ['', 12],
    Montreal: ['America/Toronto', 23],
    Montserrat: ['America/Puerto_Rico', 11],
    Nassau: ['America/Toronto', 23],
    New_York: ['', 23],
    Nipigon: ['', 23],
    Nome: ['', 10],
    Noronha: ['', 32],
    North_Dakota: { Beulah: ['', 20], Center: ['', 20], New_Salem: ['', 20] },
    Nuuk: ['', 26],
    Ojinaga: ['', 19],
    Panama: ['', 14],
    Pangnirtung: ['', 23],
    Paramaribo: ['', 12],
    Phoenix: ['', 22],
    Port_of_Spain: ['America/Puerto_Rico', 11],
    'Port-au-Prince': ['', 23],
    Porto_Acre: ['America/Rio_Branco', 18],
    Porto_Velho: ['', 17],
    Puerto_Rico: ['', 11],
    Punta_Arenas: ['', 12],
    Rainy_River: ['', 20],
    Rankin_Inlet: ['', 20],
    Recife: ['', 12],
    Regina: ['', 16],
    Resolute: ['', 33],
    Rio_Branco: ['', 18],
    Rosario: ['America/Argentina/Cordoba', 12],
    Santa_Isabel: ['America/Tijuana', 24],
    Santarem: ['', 12],
    Santiago: ['', 34],
    Santo_Domingo: ['', 11],
    Sao_Paulo: ['', 12],
    Scoresbysund: ['', 35],
    Shiprock: ['America/Denver', 19],
    Sitka: ['', 10],
    St_Barthelemy: ['America/Puerto_Rico', 11],
    St_Johns: ['', 36],
    St_Kitts: ['America/Puerto_Rico', 11],
    St_Lucia: ['America/Puerto_Rico', 11],
    St_Thomas: ['America/Puerto_Rico', 11],
    St_Vincent: ['America/Puerto_Rico', 11],
    Swift_Current: ['', 16],
    Tegucigalpa: ['', 16],
    Thule: ['', 25],
    Thunder_Bay: ['', 23],
    Tijuana: ['', 24],
    Toronto: ['', 23],
    Tortola: ['America/Puerto_Rico', 11],
    Vancouver: ['', 24],
    Virgin: ['America/Puerto_Rico', 11],
    Whitehorse: ['', 22],
    Winnipeg: ['', 20],
    Yakutat: ['', 10],
    Yellowknife: ['', 19],
  },
  Antarctica: {
    Casey: ['', 37],
    Davis: ['', 38],
    DumontDUrville: ['Pacific/Port_Moresby', 39],
    Macquarie: ['', 40],
    Mawson: ['', 41],
    McMurdo: ['Pacific/Auckland', 42],
    Palmer: ['', 12],
    Rothera: ['', 12],
    South_Pole: ['Pacific/Auckland', 42],
    Syowa: ['Asia/Riyadh', 43],
    Troll: ['', 44],
    Vostok: ['Asia/Urumqi', 45],
  },
  Arctic: { Longyearbyen: ['Europe/Berlin', 7] },
  Asia: {
    Aden: ['Asia/Riyadh', 43],
    Almaty: ['', 45],
    Amman: ['', 46],
    Anadyr: ['', 47],
    Aqtau: ['', 41],
    Aqtobe: ['', 41],
    Ashgabat: ['', 41],
    Ashkhabad: ['Asia/Ashgabat', 41],
    Atyrau: ['', 41],
    Baghdad: ['', 43],
    Bahrain: ['Asia/Qatar', 43],
    Baku: ['', 48],
    Bangkok: ['', 38],
    Barnaul: ['', 38],
    Beirut: ['', 49],
    Bishkek: ['', 45],
    Brunei: ['Asia/Kuching', 50],
    Calcutta: ['Asia/Kolkata', 51],
    Chita: ['', 52],
    Choibalsan: ['', 50],
    Chongqing: ['Asia/Shanghai', 53],
    Chungking: ['Asia/Shanghai', 53],
    Colombo: ['', 54],
    Dacca: ['Asia/Dhaka', 45],
    Damascus: ['', 55],
    Dhaka: ['', 45],
    Dili: ['', 52],
    Dubai: ['', 48],
    Dushanbe: ['', 41],
    Famagusta: ['', 56],
    Gaza: ['', 57],
    Harbin: ['Asia/Shanghai', 53],
    Hebron: ['', 57],
    Ho_Chi_Minh: ['', 38],
    Hong_Kong: ['', 58],
    Hovd: ['', 38],
    Irkutsk: ['', 50],
    Istanbul: ['Europe/Istanbul', 43],
    Jakarta: ['', 59],
    Jayapura: ['', 60],
    Jerusalem: ['', 61],
    Kabul: ['', 62],
    Kamchatka: ['', 47],
    Karachi: ['', 63],
    Kashgar: ['Asia/Urumqi', 45],
    Kathmandu: ['', 64],
    Katmandu: ['Asia/Kathmandu', 64],
    Khandyga: ['', 52],
    Kolkata: ['', 51],
    Krasnoyarsk: ['', 38],
    Kuala_Lumpur: ['Asia/Singapore', 50],
    Kuching: ['', 50],
    Kuwait: ['Asia/Riyadh', 43],
    Macao: ['Asia/Macau', 53],
    Macau: ['', 53],
    Magadan: ['', 37],
    Makassar: ['', 65],
    Manila: ['', 66],
    Muscat: ['Asia/Dubai', 48],
    Nicosia: ['', 67],
    Novokuznetsk: ['', 38],
    Novosibirsk: ['', 38],
    Omsk: ['', 45],
    Oral: ['', 41],
    Phnom_Penh: ['Asia/Bangkok', 38],
    Pontianak: ['', 59],
    Pyongyang: ['', 68],
    Qatar: ['', 43],
    Qostanay: ['', 45],
    Qyzylorda: ['', 41],
    Rangoon: ['Asia/Yangon', 69],
    Riyadh: ['', 43],
    Saigon: ['Asia/Ho_Chi_Minh', 38],
    Sakhalin: ['', 37],
    Samarkand: ['', 41],
    Seoul: ['', 68],
    Shanghai: ['', 53],
    Singapore: ['', 50],
    Srednekolymsk: ['', 37],
    Taipei: ['', 53],
    Tashkent: ['', 41],
    Tbilisi: ['', 48],
    Tehran: ['', 70],
    Tel_Aviv: ['Asia/Jerusalem', 61],
    Thimbu: ['Asia/Thimphu', 45],
    Thimphu: ['', 45],
    Tokyo: ['', 71],
    Tomsk: ['', 38],
    Ujung_Pandang: ['Asia/Makassar', 65],
    Ulaanbaatar: ['', 50],
    Ulan_Bator: ['Asia/Ulaanbaatar', 50],
    Urumqi: ['', 45],
    'Ust-Nera': ['', 39],
    Vientiane: ['Asia/Bangkok', 38],
    Vladivostok: ['', 39],
    Yakutsk: ['', 52],
    Yangon: ['', 69],
    Yekaterinburg: ['', 41],
    Yerevan: ['', 48],
  },
  Atlantic: {
    Azores: ['', 35],
    Bermuda: ['', 25],
    Canary: ['', 72],
    Cape_Verde: ['', 73],
    Faeroe: ['Atlantic/Faroe', 72],
    Faroe: ['', 72],
    Jan_Mayen: ['Europe/Berlin', 7],
    Madeira: ['', 72],
    Reykjavik: ['Africa/Abidjan', 0],
    South_Georgia: ['', 32],
    St_Helena: ['Africa/Abidjan', 0],
    Stanley: ['', 12],
  },
  Australia: {
    ACT: ['Australia/Sydney', 40],
    Adelaide: ['', 74],
    Brisbane: ['', 75],
    Broken_Hill: ['', 74],
    Canberra: ['Australia/Sydney', 40],
    Currie: ['Australia/Hobart', 76],
    Darwin: ['', 77],
    Eucla: ['', 78],
    Hobart: ['', 76],
    LHI: ['Australia/Lord_Howe', 79],
    Lindeman: ['', 75],
    Lord_Howe: ['', 79],
    Melbourne: ['', 40],
    North: ['Australia/Darwin', 77],
    NSW: ['Australia/Sydney', 40],
    Perth: ['', 80],
    Queensland: ['Australia/Brisbane', 75],
    South: ['Australia/Adelaide', 74],
    Sydney: ['', 40],
    Tasmania: ['Australia/Hobart', 76],
    Victoria: ['Australia/Melbourne', 40],
    West: ['Australia/Perth', 80],
    Yancowinna: ['Australia/Broken_Hill', 74],
  },
  Brazil: {
    Acre: ['America/Rio_Branco', 18],
    DeNoronha: ['America/Noronha', 32],
    East: ['America/Sao_Paulo', 12],
    West: ['America/Manaus', 17],
  },
  Canada: {
    Atlantic: ['America/Halifax', 25],
    Central: ['America/Winnipeg', 20],
    Eastern: ['America/Toronto', 23],
    Mountain: ['America/Edmonton', 19],
    Newfoundland: ['America/St_Johns', 36],
    Pacific: ['America/Vancouver', 24],
    Saskatchewan: ['America/Regina', 16],
    Yukon: ['America/Whitehorse', 22],
  },
  CET: ['', 7],
  Chile: { Continental: ['America/Santiago', 34], EasterIsland: ['Pacific/Easter', 81] },
  CST6CDT: ['', 20],
  Cuba: ['America/Havana', 29],
  EET: ['', 56],
  Egypt: ['Africa/Cairo', 5],
  Eire: ['Europe/Dublin', 82],
  EST: ['', 14],
  EST5EDT: ['', 23],
  Etc: {
    'GMT-0': ['Etc/GMT', 0],
    'GMT-1': ['', 6],
    'GMT-10': ['', 39],
    'GMT-11': ['', 37],
    'GMT-12': ['', 47],
    'GMT-13': ['', 83],
    'GMT-14': ['', 84],
    'GMT-2': ['', 85],
    'GMT-3': ['', 43],
    'GMT-4': ['', 48],
    'GMT-5': ['', 41],
    'GMT-6': ['', 45],
    'GMT-7': ['', 38],
    'GMT-8': ['', 50],
    'GMT-9': ['', 52],
    GMT: ['', 0],
    'GMT+0': ['Etc/GMT', 0],
    'GMT+1': ['', 73],
    'GMT+10': ['', 86],
    'GMT+11': ['', 87],
    'GMT+12': ['', 88],
    'GMT+2': ['', 32],
    'GMT+3': ['', 12],
    'GMT+4': ['', 17],
    'GMT+5': ['', 18],
    'GMT+6': ['', 89],
    'GMT+7': ['', 90],
    'GMT+8': ['', 91],
    'GMT+9': ['', 92],
    GMT0: ['Etc/GMT', 0],
    Greenwich: ['Etc/GMT', 0],
    UCT: ['Etc/UTC', 93],
    Universal: ['Etc/UTC', 93],
    UTC: ['', 93],
    Zulu: ['Etc/UTC', 93],
  },
  Europe: {
    Amsterdam: ['Europe/Brussels', 7],
    Andorra: ['', 7],
    Astrakhan: ['', 48],
    Athens: ['', 56],
    Belfast: ['Europe/London', 94],
    Belgrade: ['', 7],
    Berlin: ['', 7],
    Bratislava: ['Europe/Prague', 7],
    Brussels: ['', 7],
    Bucharest: ['', 56],
    Budapest: ['', 7],
    Busingen: ['Europe/Zurich', 7],
    Chisinau: ['', 95],
    Copenhagen: ['Europe/Berlin', 7],
    Dublin: ['', 82],
    Gibraltar: ['', 7],
    Guernsey: ['Europe/London', 94],
    Helsinki: ['', 56],
    Isle_of_Man: ['Europe/London', 94],
    Istanbul: ['', 43],
    Jersey: ['Europe/London', 94],
    Kaliningrad: ['', 5],
    Kiev: ['Europe/Kyiv', 67],
    Kirov: ['', 43],
    Kyiv: ['', 67],
    Lisbon: ['', 96],
    Ljubljana: ['Europe/Belgrade', 7],
    London: ['', 94],
    Luxembourg: ['Europe/Brussels', 7],
    Madrid: ['', 7],
    Malta: ['', 7],
    Mariehamn: ['Europe/Helsinki', 56],
    Minsk: ['', 43],
    Monaco: ['Europe/Paris', 7],
    Moscow: ['', 97],
    Nicosia: ['Asia/Nicosia', 67],
    Oslo: ['Europe/Berlin', 7],
    Paris: ['', 7],
    Podgorica: ['Europe/Belgrade', 7],
    Prague: ['', 7],
    Riga: ['', 56],
    Rome: ['', 7],
    Samara: ['', 48],
    San_Marino: ['Europe/Rome', 7],
    Sarajevo: ['Europe/Belgrade', 7],
    Saratov: ['', 48],
    Simferopol: ['', 97],
    Skopje: ['Europe/Belgrade', 7],
    Sofia: ['', 56],
    Stockholm: ['Europe/Berlin', 7],
    Tallinn: ['', 56],
    Tirane: ['', 7],
    Tiraspol: ['Europe/Chisinau', 95],
    Ulyanovsk: ['', 48],
    Uzhgorod: ['Europe/Kyiv', 67],
    Vaduz: ['Europe/Zurich', 7],
    Vatican: ['Europe/Rome', 7],
    Vienna: ['', 7],
    Vilnius: ['', 56],
    Volgograd: ['', 43],
    Warsaw: ['', 7],
    Zagreb: ['Europe/Belgrade', 7],
    Zaporozhye: ['Europe/Kyiv', 67],
    Zurich: ['', 7],
  },
  'GB-Eire': ['Europe/London', 94],
  GB: ['Europe/London', 94],
  'GMT-0': ['Etc/GMT', 0],
  GMT: ['Etc/GMT', 0],
  'GMT+0': ['Etc/GMT', 0],
  GMT0: ['Etc/GMT', 0],
  Greenwich: ['Etc/GMT', 0],
  Hongkong: ['Asia/Hong_Kong', 58],
  HST: ['', 98],
  Iceland: ['Africa/Abidjan', 0],
  Indian: {
    Antananarivo: ['Africa/Nairobi', 1],
    Chagos: ['', 45],
    Christmas: ['Asia/Bangkok', 38],
    Cocos: ['Asia/Yangon', 69],
    Comoro: ['Africa/Nairobi', 1],
    Kerguelen: ['Indian/Maldives', 41],
    Mahe: ['Asia/Dubai', 48],
    Maldives: ['', 41],
    Mauritius: ['', 48],
    Mayotte: ['Africa/Nairobi', 1],
    Reunion: ['Asia/Dubai', 48],
  },
  Iran: ['Asia/Tehran', 70],
  Israel: ['Asia/Jerusalem', 61],
  Jamaica: ['America/Jamaica', 14],
  Japan: ['Asia/Tokyo', 71],
  Kwajalein: ['Pacific/Kwajalein', 47],
  Libya: ['Africa/Tripoli', 5],
  MET: ['', 99],
  Mexico: {
    BajaNorte: ['America/Tijuana', 24],
    BajaSur: ['America/Mazatlan', 21],
    General: ['America/Mexico_City', 30],
  },
  MST: ['', 22],
  MST7MDT: ['', 19],
  Navajo: ['America/Denver', 19],
  'NZ-CHAT': ['Pacific/Chatham', 100],
  NZ: ['Pacific/Auckland', 42],
  Pacific: {
    Apia: ['', 83],
    Auckland: ['', 42],
    Bougainville: ['', 37],
    Chatham: ['', 100],
    Chuuk: ['Pacific/Port_Moresby', 39],
    Easter: ['', 81],
    Efate: ['', 37],
    Enderbury: ['Pacific/Kanton', 83],
    Fakaofo: ['', 83],
    Fiji: ['', 101],
    Funafuti: ['Pacific/Tarawa', 47],
    Galapagos: ['', 89],
    Gambier: ['', 92],
    Guadalcanal: ['', 37],
    Guam: ['', 102],
    Honolulu: ['', 98],
    Johnston: ['Pacific/Honolulu', 98],
    Kanton: ['', 83],
    Kiritimati: ['', 84],
    Kosrae: ['', 37],
    Kwajalein: ['', 47],
    Majuro: ['Pacific/Tarawa', 47],
    Marquesas: ['', 103],
    Midway: ['Pacific/Pago_Pago', 104],
    Nauru: ['', 47],
    Niue: ['', 87],
    Norfolk: ['', 105],
    Noumea: ['', 37],
    Pago_Pago: ['', 104],
    Palau: ['', 52],
    Pitcairn: ['', 91],
    Pohnpei: ['Pacific/Guadalcanal', 37],
    Ponape: ['Pacific/Guadalcanal', 37],
    Port_Moresby: ['', 39],
    Rarotonga: ['', 86],
    Saipan: ['Pacific/Guam', 102],
    Samoa: ['Pacific/Pago_Pago', 104],
    Tahiti: ['', 86],
    Tarawa: ['', 47],
    Tongatapu: ['', 83],
    Truk: ['Pacific/Port_Moresby', 39],
    Wake: ['Pacific/Tarawa', 47],
    Wallis: ['Pacific/Tarawa', 47],
    Yap: ['Pacific/Port_Moresby', 39],
  },
  Poland: ['Europe/Warsaw', 7],
  Portugal: ['Europe/Lisbon', 96],
  PRC: ['Asia/Shanghai', 53],
  PST8PDT: ['', 24],
  ROC: ['Asia/Taipei', 53],
  ROK: ['Asia/Seoul', 68],
  Singapore: ['Asia/Singapore', 50],
  Turkey: ['Europe/Istanbul', 43],
  UCT: ['Etc/UTC', 93],
  Universal: ['Etc/UTC', 93],
  US: {
    Alaska: ['America/Anchorage', 10],
    Aleutian: ['America/Adak', 9],
    Arizona: ['America/Phoenix', 22],
    Central: ['America/Chicago', 20],
    'East-Indiana': ['America/Indiana/Indianapolis', 23],
    Eastern: ['America/New_York', 23],
    Hawaii: ['Pacific/Honolulu', 98],
    'Indiana-Starke': ['America/Indiana/Knox', 20],
    Michigan: ['America/Detroit', 23],
    Mountain: ['America/Denver', 19],
    Pacific: ['America/Los_Angeles', 24],
    Samoa: ['Pacific/Pago_Pago', 104],
  },
  UTC: ['Etc/UTC', 93],
  'W-SU': ['Europe/Moscow', 97],
  WET: ['', 72],
  Zulu: ['Etc/UTC', 93],
};
const tzlibZonesDetailsDB = [
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:GMT<br>TZOFFSETFROM:+0000<br>TZOFFSETTO:+0000<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:EAT<br>TZOFFSETFROM:+0300<br>TZOFFSETTO:+0300<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:CET<br>TZOFFSETFROM:+0100<br>TZOFFSETTO:+0100<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:WAT<br>TZOFFSETFROM:+0100<br>TZOFFSETTO:+0100<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:CAT<br>TZOFFSETFROM:+0200<br>TZOFFSETTO:+0200<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:EET<br>TZOFFSETFROM:+0200<br>TZOFFSETTO:+0200<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+01<br>TZOFFSETFROM:+0100<br>TZOFFSETTO:+0100<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:CEST<br>TZOFFSETFROM:+0100<br>TZOFFSETTO:+0200<br>DTSTART:19700329T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:CET<br>TZOFFSETFROM:+0200<br>TZOFFSETTO:+0100<br>DTSTART:19701025T030000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:SAST<br>TZOFFSETFROM:+0200<br>TZOFFSETTO:+0200<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:HDT<br>TZOFFSETFROM:-1000<br>TZOFFSETTO:-0900<br>DTSTART:19700308T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:HST<br>TZOFFSETFROM:-0900<br>TZOFFSETTO:-1000<br>DTSTART:19701101T020000<br>RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:AKDT<br>TZOFFSETFROM:-0900<br>TZOFFSETTO:-0800<br>DTSTART:19700308T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:AKST<br>TZOFFSETFROM:-0800<br>TZOFFSETTO:-0900<br>DTSTART:19701101T020000<br>RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:AST<br>TZOFFSETFROM:-0400<br>TZOFFSETTO:-0400<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:-03<br>TZOFFSETFROM:-0300<br>TZOFFSETTO:-0300<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:-03<br>TZOFFSETFROM:-0400<br>TZOFFSETTO:-0300<br>DTSTART:19701004T000000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:-04<br>TZOFFSETFROM:-0300<br>TZOFFSETTO:-0400<br>DTSTART:19700322T000000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=4SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:EST<br>TZOFFSETFROM:-0500<br>TZOFFSETTO:-0500<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:CST<br>TZOFFSETFROM:-0500<br>TZOFFSETTO:-0600<br>DTSTART:19701025T020000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:CDT<br>TZOFFSETFROM:-0600<br>TZOFFSETTO:-0500<br>DTSTART:19700405T020000<br>RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:CST<br>TZOFFSETFROM:-0600<br>TZOFFSETTO:-0600<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:-04<br>TZOFFSETFROM:-0400<br>TZOFFSETTO:-0400<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:-05<br>TZOFFSETFROM:-0500<br>TZOFFSETTO:-0500<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:MDT<br>TZOFFSETFROM:-0700<br>TZOFFSETTO:-0600<br>DTSTART:19700308T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:MST<br>TZOFFSETFROM:-0600<br>TZOFFSETTO:-0700<br>DTSTART:19701101T020000<br>RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:CDT<br>TZOFFSETFROM:-0600<br>TZOFFSETTO:-0500<br>DTSTART:19700308T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:CST<br>TZOFFSETFROM:-0500<br>TZOFFSETTO:-0600<br>DTSTART:19701101T020000<br>RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:MDT<br>TZOFFSETFROM:-0700<br>TZOFFSETTO:-0600<br>DTSTART:19700405T020000<br>RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:MST<br>TZOFFSETFROM:-0600<br>TZOFFSETTO:-0700<br>DTSTART:19701025T020000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:MST<br>TZOFFSETFROM:-0700<br>TZOFFSETTO:-0700<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:EDT<br>TZOFFSETFROM:-0500<br>TZOFFSETTO:-0400<br>DTSTART:19700308T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:EST<br>TZOFFSETFROM:-0400<br>TZOFFSETTO:-0500<br>DTSTART:19701101T020000<br>RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:PDT<br>TZOFFSETFROM:-0800<br>TZOFFSETTO:-0700<br>DTSTART:19700308T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:PST<br>TZOFFSETFROM:-0700<br>TZOFFSETTO:-0800<br>DTSTART:19701101T020000<br>RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:ADT<br>TZOFFSETFROM:-0400<br>TZOFFSETTO:-0300<br>DTSTART:19700308T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:AST<br>TZOFFSETFROM:-0300<br>TZOFFSETTO:-0400<br>DTSTART:19701101T020000<br>RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:-02<br>TZOFFSETFROM:-0300<br>TZOFFSETTO:-0200<br>DTSTART:19700328T220000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SA<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:-03<br>TZOFFSETFROM:-0200<br>TZOFFSETTO:-0300<br>DTSTART:19701024T230000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SA<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:AST<br>TZOFFSETFROM:-0300<br>TZOFFSETTO:-0400<br>DTSTART:19701101T020000<br>RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:ADT<br>TZOFFSETFROM:-0400<br>TZOFFSETTO:-0300<br>DTSTART:19700308T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:EST<br>TZOFFSETFROM:-0400<br>TZOFFSETTO:-0500<br>DTSTART:19701101T020000<br>RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:EDT<br>TZOFFSETFROM:-0500<br>TZOFFSETTO:-0400<br>DTSTART:19700308T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:CST<br>TZOFFSETFROM:-0400<br>TZOFFSETTO:-0500<br>DTSTART:19701101T010000<br>RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:CDT<br>TZOFFSETFROM:-0500<br>TZOFFSETTO:-0400<br>DTSTART:19700308T000000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:CDT<br>TZOFFSETFROM:-0600<br>TZOFFSETTO:-0500<br>DTSTART:19700405T020000<br>RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:CST<br>TZOFFSETFROM:-0500<br>TZOFFSETTO:-0600<br>DTSTART:19701025T020000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:-02<br>TZOFFSETFROM:-0300<br>TZOFFSETTO:-0200<br>DTSTART:19700308T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:-03<br>TZOFFSETFROM:-0200<br>TZOFFSETTO:-0300<br>DTSTART:19701101T020000<br>RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:-02<br>TZOFFSETFROM:-0200<br>TZOFFSETTO:-0200<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:CST<br>TZOFFSETFROM:-0500<br>TZOFFSETTO:-0600<br>DTSTART:19701101T020000<br>RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:CDT<br>TZOFFSETFROM:-0600<br>TZOFFSETTO:-0500<br>DTSTART:19700308T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:-04<br>TZOFFSETFROM:-0300<br>TZOFFSETTO:-0400<br>DTSTART:19700405T000000<br>RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:-03<br>TZOFFSETFROM:-0400<br>TZOFFSETTO:-0300<br>DTSTART:19700906T000000<br>RRULE:FREQ=YEARLY;BYMONTH=9;BYDAY=1SU<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:+00<br>TZOFFSETFROM:-0100<br>TZOFFSETTO:+0000<br>DTSTART:19700329T000000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:-01<br>TZOFFSETFROM:+0000<br>TZOFFSETTO:-0100<br>DTSTART:19701025T010000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:NST<br>TZOFFSETFROM:-0230<br>TZOFFSETTO:-0330<br>DTSTART:19701101T020000<br>RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:NDT<br>TZOFFSETFROM:-0330<br>TZOFFSETTO:-0230<br>DTSTART:19700308T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+11<br>TZOFFSETFROM:+1100<br>TZOFFSETTO:+1100<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+07<br>TZOFFSETFROM:+0700<br>TZOFFSETTO:+0700<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+10<br>TZOFFSETFROM:+1000<br>TZOFFSETTO:+1000<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:AEST<br>TZOFFSETFROM:+1100<br>TZOFFSETTO:+1000<br>DTSTART:19700405T030000<br>RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:AEDT<br>TZOFFSETFROM:+1000<br>TZOFFSETTO:+1100<br>DTSTART:19701004T020000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+05<br>TZOFFSETFROM:+0500<br>TZOFFSETTO:+0500<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:NZDT<br>TZOFFSETFROM:+1200<br>TZOFFSETTO:+1300<br>DTSTART:19700927T020000<br>RRULE:FREQ=YEARLY;BYMONTH=9;BYDAY=-1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:NZST<br>TZOFFSETFROM:+1300<br>TZOFFSETTO:+1200<br>DTSTART:19700405T030000<br>RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+03<br>TZOFFSETFROM:+0300<br>TZOFFSETTO:+0300<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:+02<br>TZOFFSETFROM:+0000<br>TZOFFSETTO:+0200<br>DTSTART:19700329T010000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:+00<br>TZOFFSETFROM:+0200<br>TZOFFSETTO:+0000<br>DTSTART:19701025T030000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+06<br>TZOFFSETFROM:+0600<br>TZOFFSETTO:+0600<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:EET<br>TZOFFSETFROM:+0300<br>TZOFFSETTO:+0200<br>DTSTART:19701030T010000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1FR<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:EEST<br>TZOFFSETFROM:+0200<br>TZOFFSETTO:+0300<br>DTSTART:19700227T000000<br>RRULE:FREQ=YEARLY;BYMONTH=2;BYDAY=-1FR<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+12<br>TZOFFSETFROM:+1200<br>TZOFFSETTO:+1200<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+04<br>TZOFFSETFROM:+0400<br>TZOFFSETTO:+0400<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:EEST<br>TZOFFSETFROM:+0200<br>TZOFFSETTO:+0300<br>DTSTART:19700329T000000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:EET<br>TZOFFSETFROM:+0300<br>TZOFFSETTO:+0200<br>DTSTART:19701025T000000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+08<br>TZOFFSETFROM:+0800<br>TZOFFSETTO:+0800<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:IST<br>TZOFFSETFROM:+0530<br>TZOFFSETTO:+0530<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+09<br>TZOFFSETFROM:+0900<br>TZOFFSETTO:+0900<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:CST<br>TZOFFSETFROM:+0800<br>TZOFFSETTO:+0800<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+0530<br>TZOFFSETFROM:+0530<br>TZOFFSETTO:+0530<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:EET<br>TZOFFSETFROM:+0300<br>TZOFFSETTO:+0200<br>DTSTART:19701030T000000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1FR<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:EEST<br>TZOFFSETFROM:+0200<br>TZOFFSETTO:+0300<br>DTSTART:19700327T000000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1FR<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:EEST<br>TZOFFSETFROM:+0200<br>TZOFFSETTO:+0300<br>DTSTART:19700329T030000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:EET<br>TZOFFSETFROM:+0300<br>TZOFFSETTO:+0200<br>DTSTART:19701025T040000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:EET<br>TZOFFSETFROM:+0300<br>TZOFFSETTO:+0200<br>DTSTART:19701024T020000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SA<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:EEST<br>TZOFFSETFROM:+0200<br>TZOFFSETTO:+0300<br>DTSTART:19700328T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SA<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:HKT<br>TZOFFSETFROM:+0800<br>TZOFFSETTO:+0800<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:WIB<br>TZOFFSETFROM:+0700<br>TZOFFSETTO:+0700<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:WIT<br>TZOFFSETFROM:+0900<br>TZOFFSETTO:+0900<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:IDT<br>TZOFFSETFROM:+0200<br>TZOFFSETTO:+0300<br>DTSTART:19700327T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1FR<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:IST<br>TZOFFSETFROM:+0300<br>TZOFFSETTO:+0200<br>DTSTART:19701025T020000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+0430<br>TZOFFSETFROM:+0430<br>TZOFFSETTO:+0430<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:PKT<br>TZOFFSETFROM:+0500<br>TZOFFSETTO:+0500<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+0545<br>TZOFFSETFROM:+0545<br>TZOFFSETTO:+0545<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:WITA<br>TZOFFSETFROM:+0800<br>TZOFFSETTO:+0800<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:PST<br>TZOFFSETFROM:+0800<br>TZOFFSETTO:+0800<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:EET<br>TZOFFSETFROM:+0300<br>TZOFFSETTO:+0200<br>DTSTART:19701025T040000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:EEST<br>TZOFFSETFROM:+0200<br>TZOFFSETTO:+0300<br>DTSTART:19700329T030000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:KST<br>TZOFFSETFROM:+0900<br>TZOFFSETTO:+0900<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+0630<br>TZOFFSETFROM:+0630<br>TZOFFSETTO:+0630<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+0330<br>TZOFFSETFROM:+0330<br>TZOFFSETTO:+0330<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:JST<br>TZOFFSETFROM:+0900<br>TZOFFSETTO:+0900<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:WEST<br>TZOFFSETFROM:+0000<br>TZOFFSETTO:+0100<br>DTSTART:19700329T010000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:WET<br>TZOFFSETFROM:+0100<br>TZOFFSETTO:+0000<br>DTSTART:19701025T020000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:-01<br>TZOFFSETFROM:-0100<br>TZOFFSETTO:-0100<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:ACST<br>TZOFFSETFROM:+1030<br>TZOFFSETTO:+0930<br>DTSTART:19700405T030000<br>RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:ACDT<br>TZOFFSETFROM:+0930<br>TZOFFSETTO:+1030<br>DTSTART:19701004T020000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:AEST<br>TZOFFSETFROM:+1000<br>TZOFFSETTO:+1000<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:AEDT<br>TZOFFSETFROM:+1000<br>TZOFFSETTO:+1100<br>DTSTART:19701004T020000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:AEST<br>TZOFFSETFROM:+1100<br>TZOFFSETTO:+1000<br>DTSTART:19700405T030000<br>RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:ACST<br>TZOFFSETFROM:+0930<br>TZOFFSETTO:+0930<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+0845<br>TZOFFSETFROM:+0845<br>TZOFFSETTO:+0845<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+1030<br>TZOFFSETFROM:+1100<br>TZOFFSETTO:+1030<br>DTSTART:19700405T020000<br>RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:+11<br>TZOFFSETFROM:+1030<br>TZOFFSETTO:+1100<br>DTSTART:19701004T020000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:AWST<br>TZOFFSETFROM:+0800<br>TZOFFSETTO:+0800<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:-06<br>TZOFFSETFROM:-0500<br>TZOFFSETTO:-0600<br>DTSTART:19700404T220000<br>RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SA<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:-05<br>TZOFFSETFROM:-0600<br>TZOFFSETTO:-0500<br>DTSTART:19700905T220000<br>RRULE:FREQ=YEARLY;BYMONTH=9;BYDAY=1SA<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:IST<br>TZOFFSETFROM:+0000<br>TZOFFSETTO:+0100<br>DTSTART:19700329T010000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:GMT<br>TZOFFSETFROM:+0100<br>TZOFFSETTO:+0000<br>DTSTART:19701025T020000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+13<br>TZOFFSETFROM:+1300<br>TZOFFSETTO:+1300<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+14<br>TZOFFSETFROM:+1400<br>TZOFFSETTO:+1400<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:+02<br>TZOFFSETFROM:+0200<br>TZOFFSETTO:+0200<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:-10<br>TZOFFSETFROM:-1000<br>TZOFFSETTO:-1000<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:-11<br>TZOFFSETFROM:-1100<br>TZOFFSETTO:-1100<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:-12<br>TZOFFSETFROM:-1200<br>TZOFFSETTO:-1200<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:-06<br>TZOFFSETFROM:-0600<br>TZOFFSETTO:-0600<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:-07<br>TZOFFSETFROM:-0700<br>TZOFFSETTO:-0700<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:-08<br>TZOFFSETFROM:-0800<br>TZOFFSETTO:-0800<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:-09<br>TZOFFSETFROM:-0900<br>TZOFFSETTO:-0900<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:UTC<br>TZOFFSETFROM:+0000<br>TZOFFSETTO:+0000<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:BST<br>TZOFFSETFROM:+0000<br>TZOFFSETTO:+0100<br>DTSTART:19700329T010000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:GMT<br>TZOFFSETFROM:+0100<br>TZOFFSETTO:+0000<br>DTSTART:19701025T020000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:EEST<br>TZOFFSETFROM:+0200<br>TZOFFSETTO:+0300<br>DTSTART:19700329T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:EET<br>TZOFFSETFROM:+0300<br>TZOFFSETTO:+0200<br>DTSTART:19701025T030000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:WET<br>TZOFFSETFROM:+0100<br>TZOFFSETTO:+0000<br>DTSTART:19701025T020000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:STANDARD<br>BEGIN:DAYLIGHT<br>TZNAME:WEST<br>TZOFFSETFROM:+0000<br>TZOFFSETTO:+0100<br>DTSTART:19700329T010000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU<br>END:DAYLIGHT<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:MSK<br>TZOFFSETFROM:+0300<br>TZOFFSETTO:+0300<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:HST<br>TZOFFSETFROM:-1000<br>TZOFFSETTO:-1000<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:MEST<br>TZOFFSETFROM:+0100<br>TZOFFSETTO:+0200<br>DTSTART:19700329T020000<br>RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:MET<br>TZOFFSETFROM:+0200<br>TZOFFSETTO:+0100<br>DTSTART:19701025T030000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:+1345<br>TZOFFSETFROM:+1245<br>TZOFFSETTO:+1345<br>DTSTART:19700927T024500<br>RRULE:FREQ=YEARLY;BYMONTH=9;BYDAY=-1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:+1245<br>TZOFFSETFROM:+1345<br>TZOFFSETTO:+1245<br>DTSTART:19700405T034500<br>RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:+13<br>TZOFFSETFROM:+1200<br>TZOFFSETTO:+1300<br>DTSTART:19701108T020000<br>RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=2SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:+12<br>TZOFFSETFROM:+1300<br>TZOFFSETTO:+1200<br>DTSTART:19700118T030000<br>RRULE:FREQ=YEARLY;BYMONTH=1;BYDAY=-2SU<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:ChST<br>TZOFFSETFROM:+1000<br>TZOFFSETTO:+1000<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:-0930<br>TZOFFSETFROM:-0930<br>TZOFFSETTO:-0930<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:STANDARD<br>TZNAME:SST<br>TZOFFSETFROM:-1100<br>TZOFFSETTO:-1100<br>DTSTART:19700101T000000<br>END:STANDARD<br>',
  '20220929T150625Z<br>BEGIN:DAYLIGHT<br>TZNAME:+12<br>TZOFFSETFROM:+1100<br>TZOFFSETTO:+1200<br>DTSTART:19701004T020000<br>RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU<br>END:DAYLIGHT<br>BEGIN:STANDARD<br>TZNAME:+11<br>TZOFFSETFROM:+1200<br>TZOFFSETTO:+1100<br>DTSTART:19700405T030000<br>RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU<br>END:STANDARD<br>',
];
function tzlib_get_content(tzName) {
  const nameParts = tzName.split('/');
  if (
    (nameParts.length === 3 &&
      (!tzlibZonesDB[`${nameParts[0]}`] ||
        !tzlibZonesDB[`${nameParts[0]}`][`${nameParts[1]}`] ||
        !tzlibZonesDB[`${nameParts[0]}`][`${nameParts[1]}`][`${nameParts[2]}`])) ||
    (nameParts.length === 2 &&
      (!tzlibZonesDB[`${nameParts[0]}`] || !tzlibZonesDB[`${nameParts[0]}`][`${nameParts[1]}`])) ||
    (nameParts.length === 1 && !tzlibZonesDB[`${nameParts[0]}`])
  ) {
    console.error('Given timezone not valid.');
    return '';
  }
  if (nameParts.length === 3) {
    return [
      tzlibZonesDB[`${nameParts[0]}`][`${nameParts[1]}`][`${nameParts[2]}`][0],
      tzlibZonesDetailsDB[tzlibZonesDB[`${nameParts[0]}`][`${nameParts[1]}`][`${nameParts[2]}`][1]],
    ];
  }
  if (nameParts.length === 2) {
    return [
      tzlibZonesDB[`${nameParts[0]}`][`${nameParts[1]}`][0],
      tzlibZonesDetailsDB[tzlibZonesDB[`${nameParts[0]}`][`${nameParts[1]}`][1]],
    ];
  }
  return [tzlibZonesDB[`${nameParts[0]}`][0], tzlibZonesDetailsDB[tzlibZonesDB[`${nameParts[0]}`][1]]];
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function tzlib_get_ical_block(tzName, jsonType = false) {
  const tzBlock = tzlib_get_content(tzName);
  if (tzBlock[1] == null || tzBlock[1] == '') {
    return '';
  }
  const location = (function () {
    if (tzBlock[0] == '') {
      return tzName;
    } else {
      return tzBlock[0];
    }
  })();
  const tzidLine = 'TZID=' + location;
  const output = [
    'BEGIN:VTIMEZONE\r\nTZID:' +
      location +
      '\r\nX-LIC-LOCATION:' +
      location +
      '\r\nLAST-MODIFIED:' +
      tzBlock[1].replace(/[^\w_\-:,;=+/<br>]/g, '').replace(/<br>/g, '\r\n') +
      'END:VTIMEZONE',
    tzidLine,
  ];
  if (jsonType) {
    return JSON.stringify(output);
  }
  return output;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function tzlib_get_offset(tzName, isoDate, isoTime) {
  const tzBlock = tzlib_get_content(tzName);
  if (tzBlock[1] == null || tzBlock[1] == '') {
    return '';
  }
  if (!isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    console.error('offset calculation failed: date misspelled [-> YYYY-MM-DD]');
    return '';
  }
  if (!isoTime.match(/^\d{2}:\d{2}$/)) {
    console.error('offset calculation failed: time misspelled [-> hh:mm]');
    return '';
  }
  if (!tzBlock[1].match(/BEGIN:DAYLIGHT/i)) {
    return tzBlock[1].match(/TZOFFSETTO:([+|-]\d{4})/i)[1];
  }
  const dateString = isoDate + 'T' + isoTime + ':00';
  const date = new Date(dateString);
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth() + 1;
  const dateDay = date.getDate();
  const dateHour = date.getHours();
  const timezoneData = tzBlock[1].replace(/[^\w_\-:,;=+/<br>]/g, '').split('<br>');
  const tzBreakpoints = { 1: {}, 2: {} };
  let breakpointCount = 0;
  for (let i = 0; i < timezoneData.length; i++) {
    if (timezoneData[`${i}`].startsWith('TZOFFSETTO')) {
      breakpointCount++;
      tzBreakpoints[`${breakpointCount}`].offset = timezoneData[`${i}`].split(':')[1];
    }
    if (timezoneData[`${i}`].startsWith('DTSTART')) {
      tzBreakpoints[`${breakpointCount}`].hour = parseInt(timezoneData[`${i}`].substr(17, 2));
    }
    if (timezoneData[`${i}`].startsWith('RRULE')) {
      let rruleParts = timezoneData[`${i}`].split(';');
      let rruleMonth = parseInt(rruleParts[1].split('=')[1]);
      tzBreakpoints[`${breakpointCount}`].month = parseInt(rruleMonth);
      tzBreakpoints[`${breakpointCount}`].day = rruleParts[2].split('=')[1];
    }
  }
  if (tzBreakpoints[1].month > tzBreakpoints[2].month) {
    [tzBreakpoints[1], tzBreakpoints[2]] = [tzBreakpoints[2], tzBreakpoints[1]];
  }
  if (dateMonth != tzBreakpoints[1].month && dateMonth != tzBreakpoints[2].month) {
    if (dateMonth < tzBreakpoints[1].month || dateMonth > tzBreakpoints[2].month) {
      return tzBreakpoints[2].offset;
    } else {
      return tzBreakpoints[1].offset;
    }
  }
  const theCase = (function () {
    return Object.keys(tzBreakpoints).find((key) => tzBreakpoints[`${key}`].month == dateMonth);
  })();
  const helperArrayWeekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const numberDays = new Date(dateYear, dateMonth, 0).getDate();
  let weekdayCount = new Date(dateYear, dateMonth - 1, 1).getDay();
  const weekdays = { SU: {}, MO: {}, TU: {}, WE: {}, TH: {}, FR: {}, SA: {} };
  for (let d = 1; d <= numberDays; d++) {
    const occurence = Object.keys(weekdays[helperArrayWeekdays[`${weekdayCount}`]]).length + 1;
    weekdays[helperArrayWeekdays[`${weekdayCount}`]][`${occurence}`] = d;
    weekdayCount++;
    if (weekdayCount == 7) {
      weekdayCount = 0;
    }
  }
  const actualDay = (function () {
    if (tzBreakpoints[`${theCase}`].day[0] == '-') {
      const breakpointWeekday = tzBreakpoints[`${theCase}`].day.substr(2, 2);
      const dayIndex =
        Object.keys(weekdays[`${breakpointWeekday}`]).length +
        1 -
        parseInt(tzBreakpoints[`${theCase}`].day[1]);
      return weekdays[`${breakpointWeekday}`][`${dayIndex}`];
    } else {
      const breakpointWeekday = tzBreakpoints[`${theCase}`].day.substr(1, 2);
      return weekdays[`${breakpointWeekday}`][tzBreakpoints[`${theCase}`].day[0]];
    }
  })();
  if (dateDay > actualDay || (dateDay == actualDay && dateHour >= tzBreakpoints[`${theCase}`].hour)) {
    return tzBreakpoints[`${theCase}`].offset;
  }
  const fallbackCase = (function () {
    if (theCase == 1) {
      return 2;
    } else {
      return 1;
    }
  })();
  return tzBreakpoints[`${fallbackCase}`].offset;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function tzlib_get_timezones(jsonType = false) {
  const tzlibZoneNames = [
  "Africa/Abidjan",
  "Africa/Accra",
  "Africa/Addis_Ababa",
  "Africa/Algiers",
  "Africa/Asmara",
  "Africa/Asmera",
  "Africa/Bamako",
  "Africa/Bangui",
  "Africa/Banjul",
  "Africa/Bissau",
  "Africa/Blantyre",
  "Africa/Brazzaville",
  "Africa/Bujumbura",
  "Africa/Cairo",
  "Africa/Casablanca",
  "Africa/Ceuta",
  "Africa/Conakry",
  "Africa/Dakar",
  "Africa/Dar_es_Salaam",
  "Africa/Djibouti",
  "Africa/Douala",
  "Africa/El_Aaiun",
  "Africa/Freetown",
  "Africa/Gaborone",
  "Africa/Harare",
  "Africa/Johannesburg",
  "Africa/Juba",
  "Africa/Kampala",
  "Africa/Khartoum",
  "Africa/Kigali",
  "Africa/Kinshasa",
  "Africa/Lagos",
  "Africa/Libreville",
  "Africa/Lome",
  "Africa/Luanda",
  "Africa/Lubumbashi",
  "Africa/Lusaka",
  "Africa/Malabo",
  "Africa/Maputo",
  "Africa/Maseru",
  "Africa/Mbabane",
  "Africa/Mogadishu",
  "Africa/Monrovia",
  "Africa/Nairobi",
  "Africa/Ndjamena",
  "Africa/Niamey",
  "Africa/Nouakchott",
  "Africa/Ouagadougou",
  "Africa/Porto-Novo",
  "Africa/Sao_Tome",
  "Africa/Timbuktu",
  "Africa/Tripoli",
  "Africa/Tunis",
  "Africa/Windhoek",
  "America/Adak",
  "America/Anchorage",
  "America/Anguilla",
  "America/Antigua",
  "America/Araguaina",
  "America/Argentina/Buenos_Aires",
  "America/Argentina/Catamarca",
  "America/Argentina/ComodRivadavia",
  "America/Argentina/Cordoba",
  "America/Argentina/Jujuy",
  "America/Argentina/La_Rioja",
  "America/Argentina/Mendoza",
  "America/Argentina/Rio_Gallegos",
  "America/Argentina/Salta",
  "America/Argentina/San_Juan",
  "America/Argentina/San_Luis",
  "America/Argentina/Tucuman",
  "America/Argentina/Ushuaia",
  "America/Aruba",
  "America/Asuncion",
  "America/Atikokan",
  "America/Atka",
  "America/Bahia_Banderas",
  "America/Bahia",
  "America/Barbados",
  "America/Belem",
  "America/Belize",
  "America/Blanc-Sablon",
  "America/Boa_Vista",
  "America/Bogota",
  "America/Boise",
  "America/Buenos_Aires",
  "America/Cambridge_Bay",
  "America/Campo_Grande",
  "America/Cancun",
  "America/Caracas",
  "America/Catamarca",
  "America/Cayenne",
  "America/Cayman",
  "America/Chicago",
  "America/Chihuahua",
  "America/Coral_Harbour",
  "America/Cordoba",
  "America/Costa_Rica",
  "America/Creston",
  "America/Cuiaba",
  "America/Curacao",
  "America/Danmarkshavn",
  "America/Dawson_Creek",
  "America/Dawson",
  "America/Denver",
  "America/Detroit",
  "America/Dominica",
  "America/Edmonton",
  "America/Eirunepe",
  "America/El_Salvador",
  "America/Ensenada",
  "America/Fort_Nelson",
  "America/Fort_Wayne",
  "America/Fortaleza",
  "America/Glace_Bay",
  "America/Godthab",
  "America/Goose_Bay",
  "America/Grand_Turk",
  "America/Grenada",
  "America/Guadeloupe",
  "America/Guatemala",
  "America/Guayaquil",
  "America/Guyana",
  "America/Halifax",
  "America/Havana",
  "America/Hermosillo",
  "America/Indiana/Indianapolis",
  "America/Indiana/Knox",
  "America/Indiana/Marengo",
  "America/Indiana/Petersburg",
  "America/Indiana/Tell_City",
  "America/Indiana/Vevay",
  "America/Indiana/Vincennes",
  "America/Indiana/Winamac",
  "America/Indianapolis",
  "America/Inuvik",
  "America/Iqaluit",
  "America/Jamaica",
  "America/Jujuy",
  "America/Juneau",
  "America/Kentucky/Louisville",
  "America/Kentucky/Monticello",
  "America/Knox_IN",
  "America/Kralendijk",
  "America/La_Paz",
  "America/Lima",
  "America/Los_Angeles",
  "America/Louisville",
  "America/Lower_Princes",
  "America/Maceio",
  "America/Managua",
  "America/Manaus",
  "America/Marigot",
  "America/Martinique",
  "America/Matamoros",
  "America/Mazatlan",
  "America/Mendoza",
  "America/Menominee",
  "America/Merida",
  "America/Metlakatla",
  "America/Mexico_City",
  "America/Miquelon",
  "America/Moncton",
  "America/Monterrey",
  "America/Montevideo",
  "America/Montreal",
  "America/Montserrat",
  "America/Nassau",
  "America/New_York",
  "America/Nipigon",
  "America/Nome",
  "America/Noronha",
  "America/North_Dakota/Beulah",
  "America/North_Dakota/Center",
  "America/North_Dakota/New_Salem",
  "America/Nuuk",
  "America/Ojinaga",
  "America/Panama",
  "America/Pangnirtung",
  "America/Paramaribo",
  "America/Phoenix",
  "America/Port_of_Spain",
  "America/Port-au-Prince",
  "America/Porto_Acre",
  "America/Porto_Velho",
  "America/Puerto_Rico",
  "America/Punta_Arenas",
  "America/Rainy_River",
  "America/Rankin_Inlet",
  "America/Recife",
  "America/Regina",
  "America/Resolute",
  "America/Rio_Branco",
  "America/Rosario",
  "America/Santa_Isabel",
  "America/Santarem",
  "America/Santiago",
  "America/Santo_Domingo",
  "America/Sao_Paulo",
  "America/Scoresbysund",
  "America/Shiprock",
  "America/Sitka",
  "America/St_Barthelemy",
  "America/St_Johns",
  "America/St_Kitts",
  "America/St_Lucia",
  "America/St_Thomas",
  "America/St_Vincent",
  "America/Swift_Current",
  "America/Tegucigalpa",
  "America/Thule",
  "America/Thunder_Bay",
  "America/Tijuana",
  "America/Toronto",
  "America/Tortola",
  "America/Vancouver",
  "America/Virgin",
  "America/Whitehorse",
  "America/Winnipeg",
  "America/Yakutat",
  "America/Yellowknife",
  "Antarctica/Casey",
  "Antarctica/Davis",
  "Antarctica/DumontDUrville",
  "Antarctica/Macquarie",
  "Antarctica/Mawson",
  "Antarctica/McMurdo",
  "Antarctica/Palmer",
  "Antarctica/Rothera",
  "Antarctica/South_Pole",
  "Antarctica/Syowa",
  "Antarctica/Troll",
  "Antarctica/Vostok",
  "Arctic/Longyearbyen",
  "Asia/Aden",
  "Asia/Almaty",
  "Asia/Amman",
  "Asia/Anadyr",
  "Asia/Aqtau",
  "Asia/Aqtobe",
  "Asia/Ashgabat",
  "Asia/Ashkhabad",
  "Asia/Atyrau",
  "Asia/Baghdad",
  "Asia/Bahrain",
  "Asia/Baku",
  "Asia/Bangkok",
  "Asia/Barnaul",
  "Asia/Beirut",
  "Asia/Bishkek",
  "Asia/Brunei",
  "Asia/Calcutta",
  "Asia/Chita",
  "Asia/Choibalsan",
  "Asia/Chongqing",
  "Asia/Chungking",
  "Asia/Colombo",
  "Asia/Dacca",
  "Asia/Damascus",
  "Asia/Dhaka",
  "Asia/Dili",
  "Asia/Dubai",
  "Asia/Dushanbe",
  "Asia/Famagusta",
  "Asia/Gaza",
  "Asia/Harbin",
  "Asia/Hebron",
  "Asia/Ho_Chi_Minh",
  "Asia/Hong_Kong",
  "Asia/Hovd",
  "Asia/Irkutsk",
  "Asia/Istanbul",
  "Asia/Jakarta",
  "Asia/Jayapura",
  "Asia/Jerusalem",
  "Asia/Kabul",
  "Asia/Kamchatka",
  "Asia/Karachi",
  "Asia/Kashgar",
  "Asia/Kathmandu",
  "Asia/Katmandu",
  "Asia/Khandyga",
  "Asia/Kolkata",
  "Asia/Krasnoyarsk",
  "Asia/Kuala_Lumpur",
  "Asia/Kuching",
  "Asia/Kuwait",
  "Asia/Macao",
  "Asia/Macau",
  "Asia/Magadan",
  "Asia/Makassar",
  "Asia/Manila",
  "Asia/Muscat",
  "Asia/Nicosia",
  "Asia/Novokuznetsk",
  "Asia/Novosibirsk",
  "Asia/Omsk",
  "Asia/Oral",
  "Asia/Phnom_Penh",
  "Asia/Pontianak",
  "Asia/Pyongyang",
  "Asia/Qatar",
  "Asia/Qostanay",
  "Asia/Qyzylorda",
  "Asia/Rangoon",
  "Asia/Riyadh",
  "Asia/Saigon",
  "Asia/Sakhalin",
  "Asia/Samarkand",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Srednekolymsk",
  "Asia/Taipei",
  "Asia/Tashkent",
  "Asia/Tbilisi",
  "Asia/Tehran",
  "Asia/Tel_Aviv",
  "Asia/Thimbu",
  "Asia/Thimphu",
  "Asia/Tokyo",
  "Asia/Tomsk",
  "Asia/Ujung_Pandang",
  "Asia/Ulaanbaatar",
  "Asia/Ulan_Bator",
  "Asia/Urumqi",
  "Asia/Ust-Nera",
  "Asia/Vientiane",
  "Asia/Vladivostok",
  "Asia/Yakutsk",
  "Asia/Yangon",
  "Asia/Yekaterinburg",
  "Asia/Yerevan",
  "Atlantic/Azores",
  "Atlantic/Bermuda",
  "Atlantic/Canary",
  "Atlantic/Cape_Verde",
  "Atlantic/Faeroe",
  "Atlantic/Faroe",
  "Atlantic/Jan_Mayen",
  "Atlantic/Madeira",
  "Atlantic/Reykjavik",
  "Atlantic/South_Georgia",
  "Atlantic/St_Helena",
  "Atlantic/Stanley",
  "Australia/ACT",
  "Australia/Adelaide",
  "Australia/Brisbane",
  "Australia/Broken_Hill",
  "Australia/Canberra",
  "Australia/Currie",
  "Australia/Darwin",
  "Australia/Eucla",
  "Australia/Hobart",
  "Australia/LHI",
  "Australia/Lindeman",
  "Australia/Lord_Howe",
  "Australia/Melbourne",
  "Australia/North",
  "Australia/NSW",
  "Australia/Perth",
  "Australia/Queensland",
  "Australia/South",
  "Australia/Sydney",
  "Australia/Tasmania",
  "Australia/Victoria",
  "Australia/West",
  "Australia/Yancowinna",
  "Brazil/Acre",
  "Brazil/DeNoronha",
  "Brazil/East",
  "Brazil/West",
  "Canada/Atlantic",
  "Canada/Central",
  "Canada/Eastern",
  "Canada/Mountain",
  "Canada/Newfoundland",
  "Canada/Pacific",
  "Canada/Saskatchewan",
  "Canada/Yukon",
  "CET",
  "Chile/Continental",
  "Chile/EasterIsland",
  "CST6CDT",
  "Cuba",
  "EET",
  "Egypt",
  "Eire",
  "EST",
  "EST5EDT",
  "Etc/GMT-0",
  "Etc/GMT-1",
  "Etc/GMT-10",
  "Etc/GMT-11",
  "Etc/GMT-12",
  "Etc/GMT-13",
  "Etc/GMT-14",
  "Etc/GMT-2",
  "Etc/GMT-3",
  "Etc/GMT-4",
  "Etc/GMT-5",
  "Etc/GMT-6",
  "Etc/GMT-7",
  "Etc/GMT-8",
  "Etc/GMT-9",
  "Etc/GMT",
  "Etc/GMT+0",
  "Etc/GMT+1",
  "Etc/GMT+10",
  "Etc/GMT+11",
  "Etc/GMT+12",
  "Etc/GMT+2",
  "Etc/GMT+3",
  "Etc/GMT+4",
  "Etc/GMT+5",
  "Etc/GMT+6",
  "Etc/GMT+7",
  "Etc/GMT+8",
  "Etc/GMT+9",
  "Etc/GMT0",
  "Etc/Greenwich",
  "Etc/UCT",
  "Etc/Universal",
  "Etc/UTC",
  "Etc/Zulu",
  "Europe/Amsterdam",
  "Europe/Andorra",
  "Europe/Astrakhan",
  "Europe/Athens",
  "Europe/Belfast",
  "Europe/Belgrade",
  "Europe/Berlin",
  "Europe/Bratislava",
  "Europe/Brussels",
  "Europe/Bucharest",
  "Europe/Budapest",
  "Europe/Busingen",
  "Europe/Chisinau",
  "Europe/Copenhagen",
  "Europe/Dublin",
  "Europe/Gibraltar",
  "Europe/Guernsey",
  "Europe/Helsinki",
  "Europe/Isle_of_Man",
  "Europe/Istanbul",
  "Europe/Jersey",
  "Europe/Kaliningrad",
  "Europe/Kiev",
  "Europe/Kirov",
  "Europe/Kyiv",
  "Europe/Lisbon",
  "Europe/Ljubljana",
  "Europe/London",
  "Europe/Luxembourg",
  "Europe/Madrid",
  "Europe/Malta",
  "Europe/Mariehamn",
  "Europe/Minsk",
  "Europe/Monaco",
  "Europe/Moscow",
  "Europe/Nicosia",
  "Europe/Oslo",
  "Europe/Paris",
  "Europe/Podgorica",
  "Europe/Prague",
  "Europe/Riga",
  "Europe/Rome",
  "Europe/Samara",
  "Europe/San_Marino",
  "Europe/Sarajevo",
  "Europe/Saratov",
  "Europe/Simferopol",
  "Europe/Skopje",
  "Europe/Sofia",
  "Europe/Stockholm",
  "Europe/Tallinn",
  "Europe/Tirane",
  "Europe/Tiraspol",
  "Europe/Ulyanovsk",
  "Europe/Uzhgorod",
  "Europe/Vaduz",
  "Europe/Vatican",
  "Europe/Vienna",
  "Europe/Vilnius",
  "Europe/Volgograd",
  "Europe/Warsaw",
  "Europe/Zagreb",
  "Europe/Zaporozhye",
  "Europe/Zurich",
  "GB-Eire",
  "GB",
  "GMT-0",
  "GMT",
  "GMT+0",
  "GMT0",
  "Greenwich",
  "Hongkong",
  "HST",
  "Iceland",
  "Indian/Antananarivo",
  "Indian/Chagos",
  "Indian/Christmas",
  "Indian/Cocos",
  "Indian/Comoro",
  "Indian/Kerguelen",
  "Indian/Mahe",
  "Indian/Maldives",
  "Indian/Mauritius",
  "Indian/Mayotte",
  "Indian/Reunion",
  "Iran",
  "Israel",
  "Jamaica",
  "Japan",
  "Kwajalein",
  "Libya",
  "MET",
  "Mexico/BajaNorte",
  "Mexico/BajaSur",
  "Mexico/General",
  "MST",
  "MST7MDT",
  "Navajo",
  "NZ-CHAT",
  "NZ",
  "Pacific/Apia",
  "Pacific/Auckland",
  "Pacific/Bougainville",
  "Pacific/Chatham",
  "Pacific/Chuuk",
  "Pacific/Easter",
  "Pacific/Efate",
  "Pacific/Enderbury",
  "Pacific/Fakaofo",
  "Pacific/Fiji",
  "Pacific/Funafuti",
  "Pacific/Galapagos",
  "Pacific/Gambier",
  "Pacific/Guadalcanal",
  "Pacific/Guam",
  "Pacific/Honolulu",
  "Pacific/Johnston",
  "Pacific/Kanton",
  "Pacific/Kiritimati",
  "Pacific/Kosrae",
  "Pacific/Kwajalein",
  "Pacific/Majuro",
  "Pacific/Marquesas",
  "Pacific/Midway",
  "Pacific/Nauru",
  "Pacific/Niue",
  "Pacific/Norfolk",
  "Pacific/Noumea",
  "Pacific/Pago_Pago",
  "Pacific/Palau",
  "Pacific/Pitcairn",
  "Pacific/Pohnpei",
  "Pacific/Ponape",
  "Pacific/Port_Moresby",
  "Pacific/Rarotonga",
  "Pacific/Saipan",
  "Pacific/Samoa",
  "Pacific/Tahiti",
  "Pacific/Tarawa",
  "Pacific/Tongatapu",
  "Pacific/Truk",
  "Pacific/Wake",
  "Pacific/Wallis",
  "Pacific/Yap",
  "Poland",
  "Portugal",
  "PRC",
  "PST8PDT",
  "ROC",
  "ROK",
  "Singapore",
  "Turkey",
  "UCT",
  "Universal",
  "US/Alaska",
  "US/Aleutian",
  "US/Arizona",
  "US/Central",
  "US/East-Indiana",
  "US/Eastern",
  "US/Hawaii",
  "US/Indiana-Starke",
  "US/Michigan",
  "US/Mountain",
  "US/Pacific",
  "US/Samoa",
  "UTC",
  "W-SU",
  "WET",
  "Zulu"
]
;
  if (jsonType) {
    return JSON.stringify(tzlibZoneNames);
  }
  return tzlibZoneNames;
}

/*!
 *  @preserve
 *
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
const atcbVersion = '1.17.0';
const isBrowser = () => {
  if (typeof window === 'undefined') {
    return false;
  } else {
    return true;
  }
};
const isiOS = isBrowser()
  ? () => {
      if (
        (/iPad|iPhone|iPod/i.test(navigator.userAgent || navigator.vendor || window.opera) &&
          !window.MSStream) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      ) {
        return true;
      } else {
        return false;
      }
    }
  : () => {
      return false;
    };
const isAndroid = isBrowser()
  ? () => {
      if (/android/i.test(navigator.userAgent || navigator.vendor || window.opera) && !window.MSStream) {
        return true;
      } else {
        return false;
      }
    }
  : () => {
      return false;
    };
const isChrome = isBrowser()
  ? () => {
      if (/chrome|chromium|crios/i.test(navigator.userAgent)) {
        return true;
      } else {
        return false;
      }
    }
  : () => {
      return false;
    };
const isMobile = () => {
  if (isAndroid() || isiOS()) {
    return true;
  } else {
    return false;
  }
};
const isWebView = isBrowser()
  ? () => {
      if (
        /(; ?wv|(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari))/i.test(navigator.userAgent || navigator.vendor)
      ) {
        return true;
      } else {
        return false;
      }
    }
  : () => {
      return false;
    };
const isProblematicWebView = isBrowser()
  ? () => {
      if (/(Instagram)/i.test(navigator.userAgent || navigator.vendor || window.opera)) {
        return true;
      } else {
        return false;
      }
    }
  : () => {
      return false;
    };
const atcbDefaultTarget = isWebView() ? '_system' : '_blank';
const atcbOptions = ['apple', 'google', 'ical', 'ms365', 'outlookcom', 'msteams', 'yahoo'];
const atcbValidRecurrOptions = ['apple', 'google', 'ical'];
const atcbiOSInvalidOptions = ['ical'];
const atcbStates = [];
const atcbIcon = {
  trigger:
    '<span class="atcb-icon-trigger"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200.016"><path d="M132.829 7.699c0-4.248 4.199-7.699 9.391-7.699s9.391 3.451 9.391 7.699v33.724c0 4.248-4.199 7.699-9.391 7.699s-9.391-3.451-9.391-7.699zm-5.941 123.747c2.979 0 5.404 2.425 5.404 5.404s-2.425 5.404-5.404 5.404l-21.077-.065-.065 21.045c0 2.979-2.425 5.404-5.404 5.404s-5.404-2.425-5.404-5.404l.065-21.061-21.045-.081c-2.979 0-5.404-2.425-5.404-5.404s2.425-5.404 5.404-5.404l21.061.065.065-21.045c0-2.979 2.425-5.404 5.404-5.404s5.404 2.425 5.404 5.404l-.065 21.077 21.061.065zM48.193 7.699C48.193 3.451 52.393 0 57.585 0s9.391 3.451 9.391 7.699v33.724c0 4.248-4.199 7.699-9.391 7.699s-9.391-3.451-9.391-7.699zM10.417 73.763h179.167V34.945c0-1.302-.537-2.49-1.4-3.369-.863-.863-2.051-1.4-3.369-1.4h-17.171c-2.881 0-5.208-2.327-5.208-5.208s2.327-5.208 5.208-5.208h17.171c4.183 0 7.975 1.709 10.726 4.46S200 30.762 200 34.945v44.043 105.843c0 4.183-1.709 7.975-4.46 10.726s-6.543 4.46-10.726 4.46H15.186c-4.183 0-7.975-1.709-10.726-4.46C1.709 192.79 0 188.997 0 184.814V78.988 34.945c0-4.183 1.709-7.975 4.46-10.726s6.543-4.46 10.726-4.46h18.343c2.881 0 5.208 2.327 5.208 5.208s-2.327 5.208-5.208 5.208H15.186c-1.302 0-2.49.537-3.369 1.4-.863.863-1.4 2.051-1.4 3.369zm179.167 10.433H10.417v100.618c0 1.302.537 2.49 1.4 3.369.863.863 2.051 1.4 3.369 1.4h169.629c1.302 0 2.49-.537 3.369-1.4.863-.863 1.4-2.051 1.4-3.369zM82.08 30.176c-2.881 0-5.208-2.327-5.208-5.208s2.327-5.208 5.208-5.208h34.977c2.881 0 5.208 2.327 5.208 5.208s-2.327 5.208-5.208 5.208z"/></svg></span>',
  apple:
    '<span class="atcb-icon-apple"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 245.657"><path d="M167.084 130.514c-.308-31.099 25.364-46.022 26.511-46.761-14.429-21.107-36.91-24.008-44.921-24.335-19.13-1.931-37.323 11.27-47.042 11.27-9.692 0-24.67-10.98-40.532-10.689-20.849.308-40.07 12.126-50.818 30.799-21.661 37.581-5.54 93.281 15.572 123.754 10.313 14.923 22.612 31.688 38.764 31.089 15.549-.612 21.433-10.073 40.242-10.073s24.086 10.073 40.546 9.751c16.737-.308 27.34-15.214 37.585-30.187 11.855-17.318 16.714-34.064 17.009-34.925-.372-.168-32.635-12.525-32.962-49.68l.045-.013zm-30.917-91.287C144.735 28.832 150.524 14.402 148.942 0c-12.344.503-27.313 8.228-36.176 18.609-7.956 9.216-14.906 23.904-13.047 38.011 13.786 1.075 27.862-7.004 36.434-17.376z"/></svg></span>',
  google:
    '<span class="atcb-icon-google"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M152.637 47.363H47.363v105.273h105.273z" fill="#fff"/><path d="M152.637 200L200 152.637h-47.363z" fill="#f72a25"/><path d="M200 47.363h-47.363v105.273H200z" fill="#fbbc04"/><path d="M152.637 152.637H47.363V200h105.273z" fill="#34a853"/><path d="M0 152.637v31.576A15.788 15.788 0 0 0 15.788 200h31.576v-47.363z" fill="#188038"/><path d="M200 47.363V15.788A15.79 15.79 0 0 0 184.212 0h-31.575v47.363z" fill="#1967d2"/><path d="M15.788 0A15.79 15.79 0 0 0 0 15.788v136.849h47.363V47.363h105.274V0z" fill="#4285f4"/><path d="M68.962 129.02c-3.939-2.653-6.657-6.543-8.138-11.67l9.131-3.76c.83 3.158 2.279 5.599 4.346 7.341 2.051 1.742 4.557 2.588 7.471 2.588 2.995 0 5.55-.911 7.699-2.718 2.148-1.823 3.223-4.134 3.223-6.934 0-2.865-1.139-5.208-3.402-7.031s-5.111-2.718-8.496-2.718h-5.273v-9.033h4.736c2.913 0 5.387-.781 7.389-2.376 2.002-1.579 2.995-3.743 2.995-6.494 0-2.441-.895-4.395-2.686-5.859s-4.053-2.197-6.803-2.197c-2.686 0-4.818.716-6.396 2.148s-2.767 3.255-3.451 5.273l-9.033-3.76c1.204-3.402 3.402-6.396 6.624-8.984s7.34-3.89 12.337-3.89c3.695 0 7.031.716 9.977 2.148s5.257 3.418 6.934 5.941c1.676 2.539 2.507 5.387 2.507 8.545 0 3.223-.781 5.941-2.327 8.187-1.546 2.23-3.467 3.955-5.729 5.143v.537a17.39 17.39 0 0 1 7.34 5.729c1.904 2.572 2.865 5.632 2.865 9.212s-.911 6.771-2.718 9.57c-1.823 2.799-4.329 5.013-7.52 6.624s-6.787 2.425-10.775 2.425c-4.622 0-8.887-1.318-12.826-3.988zm56.087-45.312l-10.026 7.243-5.013-7.601 17.985-12.972h6.901v61.198h-9.847z" fill="#1a73e8"/></svg></span>',
  ical: '<span class="atcb-icon-ical"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200.016"><path d="M132.829 7.699c0-4.248 4.199-7.699 9.391-7.699s9.391 3.451 9.391 7.699v33.724c0 4.248-4.199 7.699-9.391 7.699s-9.391-3.451-9.391-7.699zm-25.228 161.263c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm-81.803-59.766c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.902 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.902 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.918 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zM25.798 139.079c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.902 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.902 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.918 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zM25.798 168.962c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.902 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zM48.193 7.699C48.193 3.451 52.393 0 57.585 0s9.391 3.451 9.391 7.699v33.724c0 4.248-4.199 7.699-9.391 7.699s-9.391-3.451-9.391-7.699zM10.417 73.763h179.15V34.945c0-1.302-.537-2.49-1.4-3.369-.863-.863-2.051-1.4-3.369-1.4h-17.155c-2.881 0-5.208-2.327-5.208-5.208s2.327-5.208 5.208-5.208h17.171c4.183 0 7.975 1.709 10.726 4.46S200 30.762 200 34.945v44.043 105.843c0 4.183-1.709 7.975-4.46 10.726s-6.543 4.46-10.726 4.46H15.186c-4.183 0-7.975-1.709-10.726-4.46C1.709 192.79 0 188.997 0 184.814V78.971 34.945c0-4.183 1.709-7.975 4.46-10.726s6.543-4.46 10.726-4.46h18.343c2.881 0 5.208 2.327 5.208 5.208s-2.327 5.208-5.208 5.208H15.186c-1.302 0-2.49.537-3.369 1.4-.863.863-1.4 2.051-1.4 3.369zm179.167 10.433H10.417v100.618c0 1.302.537 2.49 1.4 3.369.863.863 2.051 1.4 3.369 1.4h169.629c1.302 0 2.49-.537 3.369-1.4.863-.863 1.4-2.051 1.4-3.369zM82.08 30.176c-2.881 0-5.208-2.327-5.208-5.208s2.327-5.208 5.208-5.208h34.977c2.881 0 5.208 2.327 5.208 5.208s-2.327 5.208-5.208 5.208z"/></svg></span>',
  msteams:
    '<span class="atcb-icon-msteams"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 186.047"><path d="M195.349 39.535a20.93 20.93 0 1 1-41.86 0 20.93 20.93 0 1 1 41.86 0zm-55.847 30.233h51.66A8.84 8.84 0 0 1 200 78.605v47.056c0 17.938-14.541 32.479-32.479 32.479h0-.154c-17.938.003-32.481-14.537-32.484-32.474v-.005-51.274a4.62 4.62 0 0 1 4.619-4.619z" fill="#5059c9"/><path d="M149.614 69.767H64.34c-4.823.119-8.637 4.122-8.526 8.944v53.67c-.673 28.941 22.223 52.957 51.163 53.665 28.94-.708 51.836-24.725 51.163-53.665v-53.67c.112-4.823-3.703-8.825-8.526-8.944zm-10.079-39.535a30.233 30.233 0 0 1-60.465 0 30.233 30.233 0 0 1 60.465 0z" fill="#7b83eb"/><path opacity=".1" d="M111.628 69.767v75.209c-.023 3.449-2.113 6.547-5.302 7.86-1.015.43-2.107.651-3.209.651H59.907l-1.628-4.651c-1.628-5.337-2.459-10.885-2.465-16.465V78.698c-.112-4.815 3.697-8.811 8.512-8.93z"/><path opacity=".2" d="M106.977 69.767v79.86a8.241 8.241 0 0 1-.651 3.209c-1.313 3.189-4.412 5.279-7.86 5.302H62.093l-2.186-4.651a46.13 46.13 0 0 1-1.628-4.651 56.647 56.647 0 0 1-2.465-16.465V78.698c-.112-4.815 3.697-8.811 8.512-8.93z"/><path opacity=".2" d="M102.326 69.767v70.558a8.58 8.58 0 0 1-8.512 8.512H58.279a56.647 56.647 0 0 1-2.465-16.465V78.698c-.112-4.815 3.697-8.811 8.512-8.93z"/><path opacity=".1" d="M111.628 45.721v14.651l-2.326.093c-.791 0-1.535-.046-2.326-.093-1.57-.104-3.127-.353-4.651-.744a30.233 30.233 0 0 1-20.93-17.767 25.845 25.845 0 0 1-1.488-4.651h23.209c4.693.018 8.494 3.818 8.512 8.512z"/><use xlink:href="#B" opacity=".2" transform="scale(.08973306)"/><path d="M106.977 50.372v10c-1.57-.104-3.127-.353-4.651-.744a30.233 30.233 0 0 1-20.93-17.767h17.07c4.693.018 8.494 3.818 8.512 8.512zm0 19.395v70.558a8.58 8.58 0 0 1-8.512 8.512H58.279a56.647 56.647 0 0 1-2.465-16.465V78.698c-.112-4.815 3.697-8.811 8.512-8.93z" opacity=".2"/><path opacity=".2" d="M102.326 50.372v9.256a30.233 30.233 0 0 1-20.93-17.767h12.419c4.693.018 8.494 3.818 8.512 8.512z"/><linearGradient id="A" gradientUnits="userSpaceOnUse" x1="17.776" y1="35.199" x2="84.55" y2="150.848"><stop offset="0" stop-color="#5a62c3"/><stop offset=".5" stop-color="#4d55bd"/><stop offset="1" stop-color="#3940ab"/></linearGradient><path fill="url(#A)" d="M8.526 41.86H93.8a8.53 8.53 0 0 1 8.526 8.526v85.274a8.53 8.53 0 0 1-8.526 8.526H8.526A8.53 8.53 0 0 1 0 135.66V50.386a8.53 8.53 0 0 1 8.526-8.526z"/><path fill="#fff" d="M73.6 74.316H56.553v46.419h-10.86V74.316H28.726v-9.005H73.6z"/><defs><path id="B" d="M1192.167 561.355v111.442c-17.496-1.161-34.848-3.937-51.833-8.293a336.92 336.92 0 0 1-233.25-198.003h190.228c52.304.198 94.656 42.55 94.855 94.854z"/></defs></svg></span>',
  ms365:
    '<span class="atcb-icon-ms365"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 239.766"><path d="M200 219.785l-.021-.012V20.591L128.615 0 .322 48.172 0 48.234.016 192.257l43.78-17.134V57.943l84.819-20.279-.012 172.285L.088 192.257l128.515 47.456v.053l71.376-19.753v-.227z"/></svg></span>',
  outlookcom:
    '<span class="atcb-icon-outlookcom"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 175"><path d="M178.725 0H71.275A8.775 8.775 0 0 0 62.5 8.775v9.975l60.563 18.75L187.5 18.75V8.775A8.775 8.775 0 0 0 178.725 0z" fill="#0364b8"/><path d="M197.813 96.281c.915-2.878 2.187-5.855 2.187-8.781-.002-1.485-.795-2.857-1.491-3.26l-68.434-38.99a9.37 9.37 0 0 0-9.244-.519c-.312.154-.614.325-.906.512l-67.737 38.6-.025.013-.075.044a4.16 4.16 0 0 0-2.088 3.6c.541 2.971 1.272 5.904 2.188 8.781l71.825 52.532z" fill="#0a2767"/><path d="M150 18.75h-43.75L93.619 37.5l12.631 18.75L150 93.75h37.5v-37.5z" fill="#28a8ea"/><path d="M150 18.75h37.5v37.5H150z" fill="#50d9ff"/><path d="M150 93.75l-43.75-37.5H62.5v37.5l43.75 37.5 67.7 11.05z" fill="#0364b8"/><path d="M106.25 56.25v37.5H150v-37.5zM150 93.75v37.5h37.5v-37.5zm-87.5-75h43.75v37.5H62.5z" fill="#0078d4"/><path d="M62.5 93.75h43.75v37.5H62.5z" fill="#064a8c"/><path d="M126.188 145.113l-73.706-53.75 3.094-5.438 68.181 38.825a3.3 3.3 0 0 0 2.625-.075l68.331-38.937 3.1 5.431z" fill="#0a2767" opacity=".5"/><path d="M197.919 91.106l-.088.05-.019.013-67.738 38.588c-2.736 1.764-6.192 1.979-9.125.569l23.588 31.631 51.588 11.257v-.001c2.434-1.761 3.876-4.583 3.875-7.587V87.5c.001 1.488-.793 2.862-2.081 3.606z" fill="#1490df"/><path d="M200 165.625v-4.613l-62.394-35.55-7.531 4.294a9.356 9.356 0 0 1-9.125.569l23.588 31.631 51.588 11.231v.025a9.362 9.362 0 0 0 3.875-7.588z" opacity=".05"/><path d="M199.688 168.019l-68.394-38.956-1.219.688c-2.734 1.766-6.19 1.984-9.125.575l23.588 31.631 51.587 11.256v.001a9.38 9.38 0 0 0 3.562-5.187z" opacity=".1"/><path d="M51.455 90.721c-.733-.467-1.468-1.795-1.455-3.221v78.125c-.007 5.181 4.194 9.382 9.375 9.375h131.25c1.395-.015 2.614-.366 3.813-.813.638-.258 1.252-.652 1.687-.974z" fill="#28a8ea"/><path d="M112.5 141.669V39.581a8.356 8.356 0 0 0-8.331-8.331H62.687v46.6l-10.5 5.987-.031.012-.075.044A4.162 4.162 0 0 0 50 87.5v.031-.031V150h54.169a8.356 8.356 0 0 0 8.331-8.331z" opacity=".1"/><path d="M106.25 147.919V45.831a8.356 8.356 0 0 0-8.331-8.331H62.687v40.35l-10.5 5.987-.031.012-.075.044A4.162 4.162 0 0 0 50 87.5v.031-.031 68.75h47.919a8.356 8.356 0 0 0 8.331-8.331z" opacity=".2"/><path d="M106.25 135.419V45.831a8.356 8.356 0 0 0-8.331-8.331H62.687v40.35l-10.5 5.987-.031.012-.075.044A4.162 4.162 0 0 0 50 87.5v.031-.031 56.25h47.919a8.356 8.356 0 0 0 8.331-8.331z" opacity=".2"/><path d="M100 135.419V45.831a8.356 8.356 0 0 0-8.331-8.331H62.687v40.35l-10.5 5.987-.031.012-.075.044A4.162 4.162 0 0 0 50 87.5v.031-.031 56.25h41.669a8.356 8.356 0 0 0 8.331-8.331z" opacity=".2"/><path d="M8.331 37.5h83.337A8.331 8.331 0 0 1 100 45.831v83.338a8.331 8.331 0 0 1-8.331 8.331H8.331A8.331 8.331 0 0 1 0 129.169V45.831A8.331 8.331 0 0 1 8.331 37.5z" fill="#0078d4"/><path d="M24.169 71.675a26.131 26.131 0 0 1 10.263-11.337 31.031 31.031 0 0 1 16.313-4.087 28.856 28.856 0 0 1 15.081 3.875 25.875 25.875 0 0 1 9.988 10.831 34.981 34.981 0 0 1 3.5 15.938 36.881 36.881 0 0 1-3.606 16.662 26.494 26.494 0 0 1-10.281 11.213 30 30 0 0 1-15.656 3.981 29.556 29.556 0 0 1-15.425-3.919 26.275 26.275 0 0 1-10.112-10.85 34.119 34.119 0 0 1-3.544-15.744 37.844 37.844 0 0 1 3.481-16.563zm10.938 26.613a16.975 16.975 0 0 0 5.769 7.463 15.069 15.069 0 0 0 9.019 2.719 15.831 15.831 0 0 0 9.631-2.806 16.269 16.269 0 0 0 5.606-7.481 28.913 28.913 0 0 0 1.787-10.406 31.644 31.644 0 0 0-1.687-10.538 16.681 16.681 0 0 0-5.413-7.75 14.919 14.919 0 0 0-9.544-2.956 15.581 15.581 0 0 0-9.231 2.744 17.131 17.131 0 0 0-5.9 7.519 29.85 29.85 0 0 0-.044 21.5z" fill="#fff"/></svg></span>',
  yahoo:
    '<span class="atcb-icon-yahoo"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 177.803"><path d="M0 43.284h38.144l22.211 56.822 22.5-56.822h37.135L64.071 177.803H26.694l15.308-35.645L.001 43.284zm163.235 45.403H121.64L158.558 0 200 .002zm-30.699 8.488c12.762 0 23.108 10.346 23.108 23.106s-10.345 23.106-23.108 23.106a23.11 23.11 0 0 1-23.104-23.106 23.11 23.11 0 0 1 23.104-23.106z"/></svg></span>',
  atcb: '<svg version="1.1" viewBox="0 0 150 8.5002" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g transform="matrix(1.3333 0 0 -1.3333 -2427.5 1757.9)"><g transform="matrix(.22189 0 0 -.22189 1822.6 1374.6)" fill="#9a9a9a" style="paint-order:stroke markers fill;shape-inside:url(#rect2441);white-space:pre" aria-label="Add-to-Calendar-PRO.com"><path d="m-1.2773 253.99h12.148l7.9688 27.5h-9.4141l-1.0547-5.2734h-7.1094l-1.1328 5.2734h-9.0234zm8.7109 17.305-2.6172-12.031-2.6953 12.031z" style="paint-order:stroke markers fill"/><path d="m29.66 261.16q2.2656 0 3.9062 0.9375t2.6562 3.1055v-10.078l8.4375-1.25v27.617h-8.4375v-3.7109q-0.9375 2.0117-2.5586 3.0273-1.6211 0.9961-4.043 0.9961-2.0898 0-3.8672-0.83985-1.7773-0.85937-3.0859-2.2852-1.2891-1.4258-2.0312-3.2812-0.74219-1.875-0.74219-3.9062 0-2.1875 0.78125-4.082 0.80078-1.8945 2.1484-3.2812 1.3477-1.3867 3.1055-2.168 1.7773-0.80078 3.7305-0.80078zm6.5625 10.176q-0.03906-0.78125-0.37109-1.4844-0.33203-0.70312-0.87891-1.2109-0.52734-0.52735-1.2305-0.82032-0.70312-0.3125-1.4648-0.3125-0.85938 0-1.6016 0.33203-0.72266 0.3125-1.25 0.85938-0.52734 0.54687-0.83984 1.2695-0.29297 0.72266-0.29297 1.5234 0 0.85937 0.3125 1.582 0.33203 0.72266 0.87891 1.2695 0.54688 0.52734 1.2695 0.83984 0.72266 0.29297 1.5234 0.29297 0.83984 0 1.5625-0.33203 0.72266-0.33203 1.25-0.8789 0.52734-0.54688 0.82031-1.2695 0.3125-0.72265 0.3125-1.5039z" style="paint-order:stroke markers fill"/><path d="m57.551 261.16q2.2656 0 3.9062 0.9375t2.6562 3.1055v-10.078l8.4375-1.25v27.617h-8.4375v-3.7109q-0.9375 2.0117-2.5586 3.0273-1.6211 0.9961-4.043 0.9961-2.0898 0-3.8672-0.83985-1.7773-0.85937-3.0859-2.2852-1.2891-1.4258-2.0312-3.2812-0.74219-1.875-0.74219-3.9062 0-2.1875 0.78125-4.082 0.80078-1.8945 2.1484-3.2812 1.3477-1.3867 3.1055-2.168 1.7773-0.80078 3.7305-0.80078zm6.5625 10.176q-0.03906-0.78125-0.37109-1.4844-0.33203-0.70312-0.87891-1.2109-0.52734-0.52735-1.2305-0.82032-0.70312-0.3125-1.4648-0.3125-0.85938 0-1.6016 0.33203-0.72266 0.3125-1.25 0.85938-0.52734 0.54687-0.83984 1.2695-0.29297 0.72266-0.29297 1.5234 0 0.85937 0.3125 1.582 0.33203 0.72266 0.87891 1.2695 0.54688 0.52734 1.2695 0.83984 0.72266 0.29297 1.5234 0.29297 0.83984 0 1.5625-0.33203 0.72266-0.33203 1.25-0.8789 0.52734-0.54688 0.82031-1.2695 0.3125-0.72265 0.3125-1.5039z" style="paint-order:stroke markers fill"/><path d="m76.496 268.8h10.742v4.7266h-10.742z" style="paint-order:stroke markers fill"/><path d="m104.8 280.44q-2.7148 1.3672-6.0156 1.3672-1.6992 0-3.0273-0.54688-1.3281-0.5664-2.2461-1.6016-0.89844-1.0547-1.3672-2.5195-0.46875-1.4844-0.46875-3.3398l0.03906-7.3828h-2.5391v-4.9609h3.1641l3.7109-7.5781h4.0625v7.5781h4.6094v4.9609h-4.6094v6.7969q0 1.0547 0.68359 1.582t1.8555 0.52734q0.91797 0 1.8359-0.46875z" style="paint-order:stroke markers fill"/><path d="m114.62 271.45q0 1.0938 0.3125 1.9141 0.33204 0.82031 0.85938 1.3672 0.52734 0.54687 1.2109 0.82031 0.68359 0.27344 1.3867 0.27344 0.70312 0 1.3672-0.27344 0.6836-0.27344 1.2109-0.82031 0.54688-0.54688 0.85938-1.3672 0.33203-0.82031 0.33203-1.9141t-0.33203-1.9141q-0.3125-0.82031-0.85938-1.3476-0.52734-0.54688-1.2109-0.82032-0.66406-0.27343-1.3672-0.27343-0.70313 0-1.3867 0.27343-0.6836 0.27344-1.2109 0.82032-0.52734 0.52734-0.85938 1.3476-0.3125 0.82032-0.3125 1.9141zm-7.8125 0q0.0977-2.5195 1.0352-4.4336 0.95703-1.9141 2.5195-3.2226 1.5625-1.3086 3.6133-1.9727 2.0703-0.66406 4.3945-0.66406 2.5391 0 4.6484 0.76172 2.1094 0.76171 3.6328 2.1289 1.5234 1.3477 2.3633 3.2422 0.83985 1.8945 0.83985 4.1602 0 1.8359-0.48828 3.3203-0.46875 1.4844-1.2891 2.6367-0.82031 1.1328-1.9336 1.9726-1.1133 0.83985-2.4023 1.3867-1.2891 0.52735-2.6758 0.78125-1.3672 0.25391-2.7344 0.25391-2.5781 0-4.707-0.74219-2.1094-0.76172-3.6328-2.1289-1.5234-1.3672-2.3633-3.2617-0.82032-1.9141-0.82032-4.2188z" style="paint-order:stroke markers fill"/><path d="m132.73 268.8h10.742v4.7266h-10.742z" style="paint-order:stroke markers fill"/><path d="m162.41 274.89q0.6836 0 1.2695-0.0586 0.58594-0.0781 1.1524-0.21484 0.58593-0.13672 1.1914-0.35156 0.60547-0.21485 1.3477-0.50782l1.0938 6.3477q-3.4766 2.0117-7.5781 2.0117-5.8008 0-9.9414-3.9062-4.3359-4.0625-4.3945-10.488 0-3.125 1.0742-5.7617 1.0742-2.6367 2.9688-4.5312 1.8945-1.9141 4.4726-2.9688 2.5781-1.0742 5.5859-1.0742 4.2773 0 7.7734 1.9922l-1.0547 6.2109q-2.8711-1.0938-5.1953-1.0938-3.2617 0-4.9609 1.8945-1.6797 1.875-1.6797 5.293 0 1.6992 0.44922 3.0469 0.46875 1.3281 1.3477 2.2656 0.8789 0.91797 2.1484 1.4062 1.2891 0.48829 2.9297 0.48829z" style="paint-order:stroke markers fill"/><path d="m186.52 277.78q-0.9375 1.9531-2.5391 2.9883-1.6016 1.0352-4.0234 1.0352-1.9531 0-3.7305-0.78125-1.7774-0.80078-3.125-2.1875-1.3477-1.4062-2.1484-3.3203-0.80078-1.9141-0.80078-4.1602 0-2.2266 0.80078-4.1016 0.82031-1.875 2.168-3.2227 1.3672-1.3672 3.125-2.1094 1.7773-0.76172 3.7109-0.76172 0.9961 0 1.9531 0.27343 0.97656 0.25391 1.8359 0.83985 0.8789 0.5664 1.582 1.4453 0.72265 0.87891 1.1914 2.1094v-4.668h8.3984v20.332h-8.3984zm0-6.4453q-0.0391-0.78125-0.37109-1.4844-0.33203-0.70312-0.87891-1.2109-0.52734-0.52735-1.2305-0.82032-0.70313-0.3125-1.4648-0.3125-0.85937 0-1.6016 0.33203-0.72266 0.3125-1.2695 0.85938-0.52735 0.52734-0.83985 1.25t-0.3125 1.543q0 0.85937 0.33204 1.6016 0.33203 0.72266 0.8789 1.25 0.56641 0.52734 1.2891 0.83984 0.72266 0.29297 1.5234 0.29297 0.82031 0 1.5234-0.3125 0.70312-0.3125 1.2305-0.83984 0.52734-0.52734 0.83984-1.2109 0.3125-0.70312 0.35156-1.4648z" style="paint-order:stroke markers fill"/><path d="m212.02 280.44q-2.7148 1.3672-6.0156 1.3672-1.6992 0-3.0273-0.54688-1.3281-0.5664-2.2461-1.6016-0.89843-1.0547-1.3672-2.5195-0.46875-1.4844-0.46875-3.3398v-18.672l8.4375-1.25v19.336q0 1.0742 0.68359 1.6016 0.68359 0.50781 1.8555 0.50781 0.89844 0 1.8359-0.46875z" style="paint-order:stroke markers fill"/><path d="m225.71 276.2q2.7344 0 5.8984-1.4062l0.97656 5.3711q-3.6328 1.6406-8.1641 1.6406-2.5195 0-4.6094-0.76172-2.0703-0.78125-3.5742-2.1484-1.4844-1.3867-2.3242-3.2812-0.82031-1.8945-0.82031-4.1211 0-2.3438 0.85937-4.2383 0.87891-1.9141 2.3828-3.2617 1.5039-1.3672 3.5156-2.0898 2.0117-0.74218 4.2969-0.74218 2.3047 0 4.043 0.78125 1.7383 0.76172 2.8906 2.1094 1.1719 1.3281 1.7383 3.125 0.58594 1.7774 0.58594 3.8086 0 0.27343-0.0195 0.52734t-0.0586 0.48828l-11.992 1.5625q0.46875 1.4062 1.5625 2.0312 1.0938 0.60547 2.8125 0.60547zm1.4844-7.6758q-0.6836-2.5-3.0469-2.5-0.74218 0-1.3281 0.29297t-0.9961 0.82031q-0.39062 0.50781-0.60546 1.2305-0.21485 0.70312-0.23438 1.5234z" style="paint-order:stroke markers fill"/><path d="m236.3 261.75h8.0469v4.082q1.1719-2.3633 3.0078-3.5156 1.8555-1.1523 4.3359-1.1523 1.9922 0 3.5156 0.74218 1.5234 0.74219 2.5586 2.1094 1.0547 1.3477 1.582 3.2617 0.54687 1.8945 0.54687 4.2188v10h-8.3984v-10.82q0-0.78125-0.15625-1.4453-0.13672-0.66406-0.46875-1.1328-0.3125-0.48828-0.80078-0.74219-0.48828-0.27343-1.1914-0.27343-0.85938 0-1.582 0.42968-0.72265 0.41016-1.2695 1.0156-0.52734 0.60547-0.85937 1.2695-0.33203 0.64453-0.42969 1.1133v10.586h-8.4375z" style="paint-order:stroke markers fill"/><path d="m272.59 261.16q2.2656 0 3.9062 0.9375 1.6406 0.9375 2.6562 3.1055v-10.078l8.4375-1.25v27.617h-8.4375v-3.7109q-0.9375 2.0117-2.5586 3.0273-1.6211 0.9961-4.043 0.9961-2.0898 0-3.8672-0.83985-1.7773-0.85937-3.0859-2.2852-1.2891-1.4258-2.0312-3.2812-0.74219-1.875-0.74219-3.9062 0-2.1875 0.78125-4.082 0.80078-1.8945 2.1484-3.2812 1.3476-1.3867 3.1055-2.168 1.7774-0.80078 3.7305-0.80078zm6.5625 10.176q-0.0391-0.78125-0.37109-1.4844-0.33203-0.70312-0.87891-1.2109-0.52734-0.52735-1.2305-0.82032-0.70312-0.3125-1.4648-0.3125-0.85937 0-1.6016 0.33203-0.72266 0.3125-1.25 0.85938-0.52735 0.54687-0.83985 1.2695-0.29296 0.72266-0.29296 1.5234 0 0.85937 0.3125 1.582 0.33203 0.72266 0.8789 1.2695 0.54688 0.52734 1.2695 0.83984 0.72266 0.29297 1.5234 0.29297 0.83984 0 1.5625-0.33203t1.25-0.8789q0.52734-0.54688 0.82031-1.2695 0.3125-0.72265 0.3125-1.5039z" style="paint-order:stroke markers fill"/><path d="m307.06 277.78q-0.9375 1.9531-2.5391 2.9883-1.6016 1.0352-4.0234 1.0352-1.9531 0-3.7305-0.78125-1.7773-0.80078-3.125-2.1875-1.3477-1.4062-2.1484-3.3203-0.80078-1.9141-0.80078-4.1602 0-2.2266 0.80078-4.1016 0.82032-1.875 2.168-3.2227 1.3672-1.3672 3.125-2.1094 1.7774-0.76172 3.7109-0.76172 0.99609 0 1.9531 0.27343 0.97657 0.25391 1.8359 0.83985 0.87891 0.5664 1.582 1.4453 0.72266 0.87891 1.1914 2.1094v-4.668h8.3984v20.332h-8.3984zm0-6.4453q-0.0391-0.78125-0.37109-1.4844-0.33204-0.70312-0.87891-1.2109-0.52734-0.52735-1.2305-0.82032-0.70312-0.3125-1.4648-0.3125-0.85938 0-1.6016 0.33203-0.72265 0.3125-1.2695 0.85938-0.52734 0.52734-0.83984 1.25t-0.3125 1.543q0 0.85937 0.33203 1.6016 0.33203 0.72266 0.87891 1.25 0.5664 0.52734 1.2891 0.83984 0.72266 0.29297 1.5234 0.29297 0.82031 0 1.5234-0.3125 0.70313-0.3125 1.2305-0.83984 0.52735-0.52734 0.83985-1.2109 0.3125-0.70312 0.35156-1.4648z" style="paint-order:stroke markers fill"/><path d="m319.5 261.75h8.4375v4.082q0.95703-2.4219 2.5391-3.5352 1.6016-1.1328 3.6719-1.1328l1.1719 6.543q-3.8086 0-5.6055 0.82031-1.7773 0.80078-1.7773 2.5781v10.391h-8.4375z" style="paint-order:stroke markers fill"/><path d="m337.22 268.8h10.742v4.7266h-10.742z" style="paint-order:stroke markers fill"/><path d="m352.43 253.99h9.9219q3.0859 0 5.4883 0.60547t4.043 1.7773q1.6406 1.1719 2.5 2.8711 0.85937 1.6797 0.85937 3.8477 0 2.1094-0.97656 3.7695-0.97656 1.6602-2.6758 2.832-1.6992 1.1524-3.9844 1.7774-2.2656 0.60547-4.8633 0.60547h-1.6797v9.4141h-8.6328zm10.352 12.539q2.0703 0 3.2422-0.85937 1.1719-0.85938 1.1719-2.5781 0-0.83984-0.35156-1.4648-0.33204-0.625-0.9375-1.0352-0.58594-0.42969-1.3867-0.64453t-1.7383-0.21484h-1.7188v6.7188q0.27343 0.0391 0.70312 0.0586t1.0156 0.0195z" style="paint-order:stroke markers fill"/><path d="m402.92 281.41q-2.5586 0.70313-3.6914 0.70313-7.2461 0-9.1016-6.6016l-1.0938-4.4531h-1.875v10.43h-8.75v-27.5h12.227q2.3828 0 4.4726 0.54687 2.0898 0.52735 3.6328 1.5625 1.5625 1.0156 2.4414 2.5195 0.89844 1.5039 0.89844 3.457 0 1.4453-0.37109 2.5976-0.35157 1.1328-1.0352 2.0508-0.68359 0.89844-1.6797 1.6016-0.97656 0.70312-2.2266 1.25l0.17578 0.95703q0.0586 0.33203 0.11719 0.5664 0.0586 0.23438 0.0977 0.39063l0.21484 0.83984q0.23437 0.74219 0.52734 1.2695 0.3125 0.50782 0.78125 0.83985 0.46875 0.3125 1.1524 0.46875 0.70312 0.13672 1.6992 0.13672 0.15625 0 0.48828-0.0391 0.35156-0.0391 0.89843-0.11718zm-8.8476-18.945q0-0.76172-0.33203-1.25-0.3125-0.50781-0.87891-0.78125-0.56641-0.29297-1.3281-0.39062-0.76172-0.11719-1.6406-0.11719h-2.7344v5.5078h1.5234l1.2891-0.0586q0.76171-0.0586 1.4844-0.19532 0.74219-0.15625 1.3281-0.46875 0.58593-0.33203 0.9375-0.85937 0.35156-0.54688 0.35156-1.3867z" style="paint-order:stroke markers fill"/><path d="m404.76 267.78q0-5.957 3.7891-10.039 4.043-4.3555 10.938-4.3555 3.3594 0 6.0742 1.0938 2.7148 1.0742 4.6289 2.9883t2.9492 4.5703q1.0352 2.6367 1.0352 5.7422 0 1.875-0.42968 3.6719-0.42969 1.7969-1.2891 3.3984-0.83984 1.582-2.0898 2.9297-1.25 1.3281-2.8906 2.3047-1.6211 0.95703-3.6328 1.4844-1.9922 0.54688-4.3555 0.54688-2.4219 0-4.4531-0.54688-2.0117-0.54687-3.6523-1.5234-1.6406-0.97657-2.8906-2.3242-1.2305-1.3477-2.0703-2.9297-0.82031-1.6016-1.25-3.3789-0.41016-1.7773-0.41016-3.6328zm14.727 7.0703q1.543 0 2.6172-0.64453 1.0938-0.66406 1.7774-1.6797 0.70312-1.0352 1.0156-2.3047 0.33203-1.2695 0.33203-2.4805 0-1.582-0.41015-2.8906-0.39063-1.3281-1.1524-2.2852-0.74219-0.97657-1.8164-1.543-1.0547-0.56641-2.3633-0.625-1.5625 0.0391-2.6562 0.70312-1.0938 0.66407-1.7969 1.7188-0.68359 1.0352-1.0156 2.3438-0.3125 1.2891-0.3125 2.5781 0 1.5234 0.39063 2.832 0.41016 1.2891 1.1523 2.2461 0.76172 0.9375 1.8359 1.4844 1.0742 0.54687 2.4023 0.54687z" style="paint-order:stroke markers fill"/><path d="m436.18 279.2q0-0.58594 0.2474-1.0807 0.26042-0.49479 0.67708-0.84636 0.41667-0.35156 0.95053-0.54687 0.54687-0.20834 1.1198-0.20834 0.59896 0 1.1458 0.22136 0.54688 0.20833 0.95053 0.58594 0.41666 0.36458 0.65104 0.84635 0.2474 0.48177 0.2474 1.0286 0 0.61198-0.26042 1.1068-0.2474 0.49479-0.66407 0.85938-0.41666 0.35156-0.96354 0.54687-0.53385 0.19531-1.1068 0.19531-0.625 0-1.1719-0.20833-0.54687-0.20833-0.95052-0.57292-0.40365-0.36458-0.63802-0.85937-0.23438-0.49479-0.23438-1.0677z" style="paint-order:stroke markers fill"/><path d="m454.38 272.56q-1.4062-0.4427-2.6042-0.4427-0.61198 0-1.1068 0.19531-0.48177 0.19531-0.83333 0.54687-0.33855 0.35157-0.53386 0.85938-0.18229 0.49479-0.18229 1.1068t0.18229 1.1198q0.19531 0.49479 0.54688 0.85937 0.35156 0.36459 0.84635 0.5599 0.50782 0.19531 1.1328 0.19531 1.1849 0 2.5-0.44271l0.52083 3.724q-1.0026 0.52083-1.9661 0.6901-0.95053 0.16927-2.0703 0.16927-1.5755 0-2.9036-0.49479t-2.2917-1.3932-1.5104-2.1615q-0.53385-1.276-0.53385-2.8255t0.58594-2.8125q0.58593-1.276 1.5755-2.1745 1.0026-0.91146 2.3177-1.4062 1.3151-0.4948 2.7604-0.4948 0.63802 0 1.1458 0.0521 0.52084 0.0391 0.98959 0.16927 0.46875 0.11718 0.9375 0.32552 0.46875 0.20833 1.0156 0.53385z" style="paint-order:stroke markers fill"/><path d="m461.18 274.8q0 0.72917 0.20833 1.276 0.22136 0.54688 0.57292 0.91146 0.35157 0.36459 0.80729 0.54688 0.45573 0.18229 0.92449 0.18229 0.46875 0 0.91145-0.18229 0.45573-0.18229 0.8073-0.54688 0.36458-0.36458 0.57291-0.91146 0.22136-0.54687 0.22136-1.276t-0.22136-1.276q-0.20833-0.54688-0.57291-0.89844-0.35157-0.36458-0.8073-0.54688-0.4427-0.18229-0.91145-0.18229-0.46876 0-0.92449 0.18229-0.45572 0.1823-0.80729 0.54688-0.35156 0.35156-0.57292 0.89844-0.20833 0.54687-0.20833 1.276zm-5.2083 0q0.0651-1.6797 0.69011-2.9557 0.63802-1.276 1.6797-2.1484 1.0417-0.8724 2.4088-1.3151 1.3802-0.44271 2.9297-0.44271 1.6927 0 3.099 0.50782 1.4062 0.50781 2.4219 1.4193 1.0156 0.89844 1.5755 2.1615 0.55989 1.263 0.55989 2.7734 0 1.224-0.32552 2.2136-0.3125 0.98958-0.85937 1.7578-0.54688 0.75521-1.2891 1.3151-0.74219 0.55989-1.6016 0.92448-0.85938 0.35156-1.7839 0.52083-0.91146 0.16927-1.8229 0.16927-1.7188 0-3.138-0.49479-1.4062-0.50781-2.4219-1.4193t-1.5755-2.1745q-0.54688-1.276-0.54688-2.8125z" style="paint-order:stroke markers fill"/><path d="m488.16 271.26q0.54688-1.6536 1.7578-2.487 1.2109-0.83334 3.138-0.83334 1.0938 0 2.0182 0.50782 0.92448 0.50781 1.6016 1.4193 0.67708 0.91146 1.0547 2.1745 0.3776 1.263 0.3776 2.7865v6.6667h-5.625v-6.6667q0-0.55989-0.13021-1.0286-0.11718-0.48178-0.35156-0.83334-0.23437-0.35156-0.57292-0.54687-0.33854-0.19532-0.76823-0.19532-0.55989 0-0.96354 0.26042-0.40364 0.2474-0.66406 0.63802-0.26042 0.37761-0.39063 0.84636-0.11718 0.45573-0.11718 0.85937v6.6667h-5.5729v-6.6667q0-0.54687-0.13021-1.0156-0.11718-0.48178-0.36458-0.83334-0.23438-0.35156-0.58594-0.54687-0.35156-0.20834-0.79427-0.20834-0.48177 0-0.8724 0.19532-0.3776 0.19531-0.65104 0.54687-0.27344 0.33854-0.42969 0.79427-0.14323 0.45573-0.15625 0.96355v6.7708h-5.625v-13.164h5.625v2.7214q0.74219-1.6536 1.875-2.3828 1.1458-0.72917 2.6823-0.72917 0.74219 0 1.4323 0.19532 0.69011 0.18229 1.2891 0.58593 0.61198 0.40365 1.0938 1.0417 0.49479 0.625 0.82031 1.4974z" style="paint-order:stroke markers fill"/></g></g></svg>',
  close:
    '<span class="atcb-icon-close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M2.321 13.529a7.927 7.927 0 0 1 0-11.208 7.927 7.927 0 0 1 11.208 0l86.471 86.471L186.47 2.321a7.927 7.927 0 0 1 11.209 0 7.927 7.927 0 0 1 0 11.208l-86.474 86.469 86.472 86.473a7.927 7.927 0 0 1-11.209 11.208l-86.471-86.471-86.469 86.471a7.927 7.927 0 0 1-11.208-11.208l86.471-86.473z"/></svg></span>',
  location:
    '<span class="atcb-icon-location"><svg viewBox="0 0 200 266.42" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="m148.54 230.43c-12.12 13.291-26.234 25.193-42.083 34.82-1.9513 1.431-4.5964 1.6044-6.7645 0.21681-23.416-14.895-43.08-32.782-58.539-52.23-21.334-26.755-34.755-56.414-39.351-84.99-4.6831-28.966-0.30354-56.848 14.114-79.505 5.6805-8.9543 12.944-17.106 21.79-24.153 20.337-16.196 43.557-24.76 66.713-24.586 22.288 0.17345 44.295 8.4773 63.309 25.844 6.6778 6.0707 12.293 13.03 16.89 20.575 15.502 25.54 18.841 58.105 12.033 91.104-6.7212 32.608-23.416 65.737-48.11 92.839zm-48.544-178.91c27.492 0 49.758 22.288 49.758 49.758 0 27.492-22.288 49.758-49.758 49.758-27.492 0-49.758-22.267-49.758-49.758-0.02168-27.492 22.267-49.758 49.758-49.758z" stroke-width="2.1681"/></svg></span>',
  warning:
    '<span class="atcb-icon-warning"><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="m100 0c27.613 0 52.613 11.195 70.711 29.293 18.094 18.094 29.289 43.098 29.289 70.707 0 27.613-11.195 52.613-29.289 70.711-18.098 18.094-43.098 29.289-70.711 29.289-27.609 0-52.613-11.195-70.707-29.289-18.098-18.098-29.293-43.098-29.293-70.711 0-27.609 11.195-52.613 29.293-70.707 18.094-18.098 43.098-29.293 70.707-29.293zm57.66 42.34c-14.758-14.754-35.145-23.883-57.66-23.883-22.516 0-42.902 9.1289-57.66 23.883-14.754 14.758-23.883 35.145-23.883 57.66 0 22.516 9.1289 42.902 23.883 57.66 14.758 14.754 35.145 23.883 57.66 23.883 22.516 0 42.902-9.1289 57.66-23.883 14.754-14.758 23.883-35.145 23.883-57.66 0-22.516-9.1289-42.902-23.883-57.66z" fill="#f44336" fill-rule="nonzero" stroke-width=".39062"/><g transform="matrix(3.8384 0 0 3.8384 2277.8 -576.85)" style="shape-inside:url(#rect7396);white-space:pre" aria-label="!"><path d="m-563.8 161.59-0.65341 20.185h-5.8381l-0.65341-20.185zm-3.5796 29.503q-1.5199 0-2.6136-1.0795-1.0796-1.0796-1.0796-2.6136 0-1.5057 1.0796-2.571 1.0938-1.0796 2.6136-1.0796 1.4631 0 2.571 1.0796 1.1222 1.0653 1.1222 2.571 0 1.0227-0.52557 1.8608-0.51137 0.83807-1.3494 1.3352-0.82387 0.49715-1.8182 0.49715z"/></g></svg></span>',
  checkmark:
    '<span class="atcb-icon-checkmark"><svg viewBox="0 0 122.88 122.87" xmlns="http://www.w3.org/2000/svg"><path fill:#39B54A; d="m33.666 50.046s6.0748-0.59297 17.413 4.2983c9.3883 4.5751 11.891 8.3955 11.891 8.3955 5.38-8.65 11.11-16.6 17.16-23.9 10.412-12.578 24.613-22.448 24.613-22.448l14.257-0.012228s-19.308 19.294-32.483 38.51c-13.175 19.216-22.877 41.21-22.877 41.21s-9.3948-18.164-14.53-24.53-10.77-11.59-17.52-16.22z" fill="#45b555"/><path fill:#3C3C3C; d="m61.44 0c9.53 0 18.55 2.17 26.61 6.04-3.3 2.61-6.36 5.11-9.21 7.53-5.43-1.97-11.28-3.05-17.39-3.05-14.06 0-26.79 5.7-36 14.92s-14.92 21.94-14.92 36 5.7 26.78 14.92 36 21.94 14.92 36 14.92 26.79-5.7 36-14.92c9.22-9.22 14.91-21.94 14.91-36 0-3.34-0.32-6.62-0.94-9.78 2.64-3.44 5.35-6.88 8.11-10.28 2.17 6.28 3.35 13.04 3.35 20.06 0 16.96-6.88 32.33-17.99 43.44-11.12 11.12-26.48 18-43.44 18s-32.32-6.88-43.44-18c-11.13-11.12-18.01-26.48-18.01-43.44 0-16.97 6.88-32.33 17.99-43.44 11.12-11.12 26.48-18 43.45-18z"/></svg></span>',
};


function atcb_patch_config(configData) {
  if (configData.event != null) {
    Object.keys(configData.event).forEach((key) => {
      if (key.charAt(0) !== '@') {
        configData[`${key}`] = configData.event[`${key}`];
      }
    });
    delete configData.event;
  }
  const keyChanges = {
    title: 'name',
    dateStart: 'startDate',
    dateEnd: 'endDate',
    timeStart: 'startTime',
    timeEnd: 'endTime',
  };
  Object.keys(keyChanges).forEach((key) => {
    if (configData[keyChanges[`${key}`]] == null && configData[`${key}`] != null) {
      configData[keyChanges[`${key}`]] = configData[`${key}`];
    }
  });
  return configData;
}
function atcb_decorate_data(data) {
  data = atcb_decorate_data_rrule(data);
  data = atcb_decorate_data_options(data);
  data.richData = atcb_decorate_data_rich_data(data);
  data = atcb_decorate_data_style(data);
  data = atcb_decorate_data_i18n(data);
  data = atcb_decorate_data_dates(data);
  data = atcb_decorate_data_meta(data);
  data = atcb_decorate_data_extend(data);
  return data;
}
function atcb_decorate_data_rrule(data) {
  if (data.recurrence != null && data.recurrence != '') {
    data.recurrence = data.recurrence.replace(/\s+/g, '').toUpperCase();
    if (!/^(RRULE:[\w=;,:+-/\\]+|daily|weekly|monthly|yearly)$/im.test(data.recurrence)) {
      data.recurrence = '!wrong rrule format!';
    } else {
      if (/^RRULE:/i.test(data.recurrence)) {
        const rruleParts = data.recurrence.substr(6).split(';');
        const rruleObj = new Object();
        rruleParts.forEach(function (rule) {
          rruleObj[rule.split('=')[0]] = rule.split('=')[1];
        });
        data.recurrence_until = rruleObj.UNTIL ? rruleObj.UNTIL : '';
        data.recurrence_count = rruleObj.COUNT ? rruleObj.COUNT : '';
        data.recurrence_byDay = rruleObj.BYDAY ? rruleObj.BYDAY : '';
        data.recurrence_byMonth = rruleObj.BYMONTH ? rruleObj.BYMONTH : '';
        data.recurrence_byMonthDay = rruleObj.BYMONTHDAY ? rruleObj.BYMONTHDAY : '';
        data.recurrence_interval = rruleObj.INTERVAL ? rruleObj.INTERVAL : 1;
        data.recurrence_frequency = rruleObj.FREQ ? rruleObj.FREQ : '';
      } else {
        if (data.recurrence_interval == null || data.recurrence_interval == '') {
          data.recurrence_interval = 1;
        }
        if (
          data.recurrence_weekstart == null ||
          (data.recurrence_weekstart == '') | (data.recurrence_weekstart.length > 2)
        ) {
          data.recurrence_weekstart = 'MO';
        }
        data.recurrence_frequency = data.recurrence;
        data.recurrence =
          'RRULE:FREQ=' +
          data.recurrence +
          ';WKST=' +
          data.recurrence_weekstart +
          ';INTERVAL=' +
          data.recurrence_interval;
        if (data.recurrence_until != null && data.recurrence_until != '') {
          if (data.endTime != null && data.endTime != '') {
            data.recurrence =
              data.recurrence +
              ';UNTIL=' +
              data.recurrence_until.replace(/-/g, '').slice(0, 8) +
              'T' +
              data.endTime.replace(':', '') +
              '00';
          } else {
            data.recurrence =
              data.recurrence + ';UNTIL=' + data.recurrence_until.replace(/-/g, '').slice(0, 8);
          }
        }
        if (data.recurrence_count != null && data.recurrence_count != '') {
          data.recurrence = data.recurrence + ';COUNT=' + data.recurrence_count;
        }
        if (data.recurrence_byDay != null && data.recurrence_byDay != '') {
          data.recurrence = data.recurrence + ';BYDAY=' + data.recurrence_byDay;
        }
        if (data.recurrence_byMonth != null && data.recurrence_byMonth != '') {
          data.recurrence = data.recurrence + ';BYMONTH=' + data.recurrence_byMonth;
        }
        if (data.recurrence_byMonthDay != null && data.recurrence_byMonthDay != '') {
          data.recurrence = data.recurrence + ';BYMONTHDAY=' + data.recurrence_byMonthDay;
        }
      }
    }
  }
  return data;
}
function atcb_decorate_data_options(data) {
  data.optionLabels = [];
  for (let i = 0; i < data.options.length; i++) {
    let cleanOption = data.options[`${i}`].split('|');
    data.options[`${i}`] = cleanOption[0].toLowerCase().replace('microsoft', 'ms').replace('.', '');
    if (cleanOption[1] != null) {
      data.optionLabels[`${i}`] = cleanOption[1];
    } else {
      data.optionLabels[`${i}`] = '';
    }
  }
  if (isiOS() && data.options.includes('ical') && !data.options.includes('apple')) {
    data.options.push('apple');
  }
  for (let i = 0; i < data.options.length; i++) {
    if (
      (isiOS() && atcbiOSInvalidOptions.includes(data.options[`${i}`])) ||
      (data.recurrence != null &&
        data.recurrence != '' &&
        (!atcbValidRecurrOptions.includes(data.options[`${i}`]) ||
          (data.recurrence_until != null &&
            data.recurrence_until != '' &&
            (data.options[`${i}`] == 'apple' || data.options[`${i}`] == 'ical'))))
    ) {
      data.options.splice(i, 1);
      if (data.optionLabels[`${i}`] != null) {
        delete data.optionLabels[`${i}`];
      }
      continue;
    }
  }
  return data;
}
function atcb_decorate_data_rich_data(data) {
  if (data.richData != null && data.richData == false) {
    return false;
  }
  return true;
}
function atcb_decorate_data_style(data) {
  if (data.listStyle == null || data.listStyle == '') {
    data.listStyle = 'dropdown';
  }
  if (data.listStyle === 'modal') {
    data.trigger = 'click';
  }
  if (data.buttonStyle != null && data.buttonStyle != '' && data.buttonStyle != 'default') {
    if (data.buttonStyle == 'bubble' || data.buttonStyle == 'text' || data.buttonStyle == 'date') {
      data.trigger = 'click';
    }
    if (data.buttonStyle == 'date' && data.listStyle == 'dropdown') {
      data.listStyle = 'overlay';
    }
  } else {
    data.buttonStyle = '';
  }
  data.sizes = [];
  data.sizes['l'] = data.sizes['m'] = data.sizes['s'] = 16;
  if (data.size != null && data.size != '') {
    const sizeParts = data.size.split('|');
    for (let i = 0; i < sizeParts.length; i++) {
      sizeParts[`${i}`] = parseInt(sizeParts[`${i}`]);
    }
    if (sizeParts[0] >= 0 && sizeParts[0] < 11) {
      data.sizes['l'] = 10 + sizeParts[0];
    }
    if (sizeParts.length > 2) {
      if (sizeParts[1] >= 0 && sizeParts[1] < 11) {
        data.sizes['m'] = 10 + sizeParts[1];
      }
      if (sizeParts[2] >= 0 && sizeParts[2] < 11) {
        data.sizes['s'] = 10 + sizeParts[2];
      }
    } else if (sizeParts.length == 2) {
      if (sizeParts[1] >= 0 && sizeParts[1] < 11) {
        data.sizes['m'] = data.sizes['s'] = 10 + sizeParts[1];
      }
    }
  }
  if (data.lightMode == null || data.lightMode == '') {
    data.lightMode = 'light';
  } else if (data.lightMode != null && data.lightMode != '') {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    switch (data.lightMode) {
      case 'system':
        if (prefersDarkScheme.matches) {
          data.lightMode = 'dark';
        } else {
          data.lightMode = 'light';
        }
        break;
      case 'bodyScheme':
      case 'dark':
        break;
      default:
        data.lightMode = 'light';
        break;
    }
  }
  return data;
}
function atcb_decorate_data_i18n(data) {
  if (data.language == null || data.language == '') {
    data.language = 'en';
  }
  if (data.language == 'ar') {
    data.rtl = true;
  } else {
    data.rtl = false;
  }
  return data;
}
function atcb_decorate_data_dates(data) {
  if (data.dates != null && data.dates.length > 0) {
    for (let i = 0; i < data.dates.length; i++) {
      if (data.dates[`${i}`].timeZone == null && data.timeZone != null) {
        data.dates[`${i}`].timeZone = data.timeZone;
      }
      const cleanedUpDates = atcb_date_cleanup(data.dates[`${i}`]);
      data.dates[`${i}`].startTime = cleanedUpDates.startTime;
      data.dates[`${i}`].endTime = cleanedUpDates.endTime;
      data.dates[`${i}`].timeZone = cleanedUpDates.timeZone;
      data.dates[`${i}`].timestamp = cleanedUpDates.startTimestamp;
      data.dates[`${i}`].startDate = atcb_date_calculation(cleanedUpDates.startDate);
      data.dates[`${i}`].endDate = atcb_date_calculation(cleanedUpDates.endDate);
    }
  } else {
    const cleanedUpDates = atcb_date_cleanup(data);
    data.dates = [];
    data.dates[0] = new Object();
    data.startTime = data.dates[0].startTime = cleanedUpDates.startTime;
    data.endTime = data.dates[0].endTime = cleanedUpDates.endTime;
    data.timeZone = data.dates[0].timeZone = cleanedUpDates.timeZone;
    data.startDate = data.dates[0].startDate = atcb_date_calculation(cleanedUpDates.startDate);
    data.endDate = data.dates[0].endDate = atcb_date_calculation(cleanedUpDates.endDate);
  }
  const now = new Date();
  if (data.created == null || data.created == '') {
    data.created = atcb_format_datetime(now, 'clean', true);
  }
  if (data.updated == null || data.updated == '') {
    data.updated = atcb_format_datetime(now, 'clean', true);
  }
  return data;
}
function atcb_decorate_data_meta(data) {
  if (data.status == null || data.status == '') {
    data.status = 'CONFIRMED';
  }
  if (data.sequence == null || data.sequence == '') {
    data.sequence = 0;
  }
  if (
    (data.dates[0].uid == null || data.dates[0].uid == '') &&
    data.dates.length == 1 &&
    data.uid != null &&
    data.uid != ''
  ) {
    data.dates[0].uid = data.uid;
  }
  return data;
}
function atcb_decorate_data_description(data, i) {
  if (data.dates[`${i}`].description != null && data.dates[`${i}`].description != '') {
    data.dates[`${i}`].descriptionHtmlFree = atcb_rewrite_html_elements(data.dates[`${i}`].description, true);
    data.dates[`${i}`].description = atcb_rewrite_html_elements(data.dates[`${i}`].description);
  } else {
    if (data.dates[`${i}`].description == null && data.description != null && data.description != '') {
      data.dates[`${i}`].descriptionHtmlFree = atcb_rewrite_html_elements(data.description, true);
      data.dates[`${i}`].description = atcb_rewrite_html_elements(data.description);
    } else {
      data.dates[`${i}`].descriptionHtmlFree = data.dates[`${i}`].description = '';
    }
  }
  return data;
}
function atcb_decorate_data_extend(data) {
  for (let i = 0; i < data.dates.length; i++) {
    data = atcb_decorate_data_description(data, i);
    if (data.dates[`${i}`].name == null || data.dates[`${i}`].name == '') {
      data.dates[`${i}`].name = data.name;
    }
    if (data.dates[`${i}`].status == null) {
      data.dates[`${i}`].status = data.status.toUpperCase();
    } else {
      data.dates[`${i}`].status = data.dates[`${i}`].status.toUpperCase();
    }
    if (data.dates[`${i}`].sequence == null) {
      data.dates[`${i}`].sequence = data.sequence;
    }
    if (data.dates[`${i}`].location == null && data.location != null) {
      data.dates[`${i}`].location = data.location;
    }
    if (data.dates[`${i}`].organizer == null && data.organizer != null) {
      data.dates[`${i}`].organizer = data.organizer;
    }
    if (data.dates[`${i}`].availability == null && data.availability != null) {
      data.dates[`${i}`].availability = data.availability.toLowerCase();
    } else if (data.dates[`${i}`].availability != null) {
      data.dates[`${i}`].availability = data.dates[`${i}`].availability.toLowerCase();
    }
    if (data.dates[`${i}`].uid == null) {
      data.dates[`${i}`].uid = atcb_generate_uuid();
    }
  }
  if (data.recurrence != null && data.recurrence != '') {
    data.dates[0].recurrence = data.recurrence;
  }
  if (data.dates.length > 1) {
    data.dates.sort((a, b) => a.timestamp - b.timestamp);
  }
  return data;
}
function atcb_date_cleanup(dateTimeData) {
  if (dateTimeData.endDate == null || dateTimeData.endDate == '') {
    dateTimeData.endDate = dateTimeData.startDate;
  }
  const endpoints = ['start', 'end'];
  endpoints.forEach(function (point) {
    if (dateTimeData[point + 'Date'] != null) {
      dateTimeData[point + 'Date'] = dateTimeData[point + 'Date'].replace(/\.\d{3}/, '').replace('Z', '');
      const tmpSplitStartDate = dateTimeData[point + 'Date'].split('T');
      if (tmpSplitStartDate[1] != null) {
        dateTimeData[point + 'Date'] = tmpSplitStartDate[0];
        dateTimeData[point + 'Time'] = tmpSplitStartDate[1];
      }
    }
    if (dateTimeData[point + 'Time'] != null && dateTimeData[point + 'Time'].length === 8) {
      const timeStr = dateTimeData[point + 'Time'];
      dateTimeData[point + 'Time'] = timeStr.substring(0, timeStr.length - 3);
    }
    if (dateTimeData.timeZone == 'currentBrowser') {
      dateTimeData.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    let tmpDate;
    if (dateTimeData[point + 'Time'] != null) {
      tmpDate = new Date(dateTimeData[point + 'Date'] + ' ' + dateTimeData[point + 'Time']);
    } else {
      tmpDate = new Date(dateTimeData[point + 'Date']);
    }
    dateTimeData[point + 'Timestamp'] = tmpDate.getTime();
  });
  return dateTimeData;
}
function atcb_date_calculation(dateString) {
  const today = new Date();
  const todayString = today.getUTCFullYear() + '-' + (today.getUTCMonth() + 1) + '-' + today.getUTCDate();
  dateString = dateString.replace(/today/gi, todayString);
  const dateStringParts = dateString.split('+');
  const dateParts = dateStringParts[0].split('-');
  let newDate = (function () {
    if (dateParts[0].length < 4) {
      return new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
    }
    return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  })();
  if (dateStringParts[1] != null && dateStringParts[1] > 0) {
    newDate.setDate(newDate.getDate() + parseInt(dateStringParts[1]));
  }
  return (
    newDate.getFullYear() +
    '-' +
    ((newDate.getMonth() + 1 < 10 ? '0' : '') + (newDate.getMonth() + 1)) +
    '-' +
    (newDate.getDate() < 10 ? '0' : '') +
    newDate.getDate()
  );
}


function atcb_check_required(data) {
  if (data.options == null || data.options.length < 1) {
    console.error('Add to Calendar Button generation failed: no valid options set');
    return false;
  }
  if (data.name == null || data.name == '') {
    console.error('Add to Calendar Button generation failed: required name information missing');
    return false;
  }
  if (data.dates != null && data.dates.length > 0) {
    const requiredMultiField = ['name', 'startDate'];
    const requiredMultiFieldFlex = ['name'];
    return requiredMultiField.every(function (field) {
      for (let i = 0; i < data.dates.length; i++) {
        if (
          (!requiredMultiFieldFlex.includes(`${field}`) &&
            (data.dates[`${i}`][`${field}`] == null || data.dates[`${i}`][`${field}`] == '')) ||
          (requiredMultiFieldFlex.includes(`${field}`) &&
            (data.dates[`${i}`][`${field}`] == null || data.dates[`${i}`][`${field}`] == '') &&
            (data[`${field}`] == null || data[`${field}`] == ''))
        ) {
          console.error(
            'Add to Calendar Button generation failed: required setting missing [dates array object #' +
              (i + 1) +
              '/' +
              data.dates.length +
              '] => [' +
              field +
              ']'
          );
          return false;
        }
      }
      return true;
    });
  } else {
    const requiredSingleField = ['startDate'];
    return requiredSingleField.every(function (field) {
      if (data[`${field}`] == null || data[`${field}`] == '') {
        console.error('Add to Calendar Button generation failed: required setting missing [' + field + ']');
        return false;
      }
      return true;
    });
  }
}
function atcb_validate(data) {
  const msgPrefix = 'Add to Calendar Button generation (' + data.identifier + ')';
  if (!atcb_validate_prefix(data)) return false;
  if (!atcb_validate_icsFile(data, msgPrefix)) return false;
  if (!atcb_validate_created(data, msgPrefix)) return false;
  if (!atcb_validate_updated(data, msgPrefix)) return false;
  if (!atcb_validate_options(data, msgPrefix)) return false;
  if (!atcb_validate_date_blocks(data, msgPrefix)) return false;
  if (!atcb_validate_rrule(data, msgPrefix)) return false;
  return true;
}
function atcb_validate_prefix(data) {
  if (data.identifier != null && data.identifier != '') {
    if (!/^[\w-]+$/.test(data.identifier)) {
      data.identifier = '';
      console.warn('Add to Calendar Button generation: identifier invalid - using auto numbers instead');
    }
  }
  return true;
}
function atcb_validate_icsFile(data, msgPrefix, i = '', msgSuffix = '') {
  const icsFileStr = (function () {
    if (i != '' && data.dates[`${i}`].icsFile != null) {
      return data.dates[`${i}`].icsFile;
    }
    if (i == '' && data.icsFile != null) {
      return data.icsFile;
    }
    return '';
  })();
  if (icsFileStr != '') {
    if (
      !atcb_secure_url(icsFileStr, false) ||
      !/\.ics$/.test(data.icsFile) ||
      !icsFileStr.startsWith('https://')
    ) {
      console.error(msgPrefix + ' failed: explicit ics file path not valid' + msgSuffix);
      return false;
    }
  }
  return true;
}
function atcb_validate_created(data, msgPrefix) {
  if (!/^\d{8}T\d{6}Z$/.test(data.created)) {
    console.error(
      msgPrefix +
        ' failed: created date format not valid. Needs to be a full ISO-8601 UTC date and time string, formatted YYYYMMDDTHHMMSSZ'
    );
    return false;
  }
  return true;
}
function atcb_validate_updated(data, msgPrefix) {
  if (!/^\d{8}T\d{6}Z$/.test(data.updated)) {
    console.error(
      msgPrefix +
        ' failed: updated date format not valid. Needs to be a full ISO-8601 UTC date and time string, formatted YYYYMMDDTHHMMSSZ'
    );
    return false;
  }
  return true;
}
function atcb_validate_options(data, msgPrefix) {
  if (
    !data.options.every(function (option) {
      if (!atcbOptions.includes(option)) {
        console.error(msgPrefix + ' failed: invalid option [' + option + ']');
        return false;
      }
      return true;
    })
  ) {
    return false;
  }
  return true;
}
function atcb_validate_date_blocks(data, msgPrefix) {
  for (let i = 0; i < data.dates.length; i++) {
    const msgSuffix = (function () {
      if (data.dates.length == 1) {
        return '';
      } else {
        return ' [dates array object #' + (i + 1) + '/' + data.dates.length + '] ';
      }
    })();
    if (!atcb_validate_icsFile(data, msgPrefix, i, msgSuffix)) return false;
    if (!atcb_validate_status(data, msgPrefix, i, msgSuffix)) return false;
    if (!atcb_validate_availability(data, msgPrefix, i, msgSuffix)) return false;
    if (!atcb_validate_organizer(data, msgPrefix, i, msgSuffix)) return false;
    if (!atcb_validate_uid(data, msgPrefix, i, msgSuffix)) return false;
    if (!atcb_validate_sequence(data, msgPrefix, i, msgSuffix)) return false;
    if (!atcb_validate_timezone(data, msgPrefix, i, msgSuffix)) return false;
    if (!atcb_validate_datetime(data, msgPrefix, i, msgSuffix)) return false;
  }
  return true;
}
function atcb_validate_status(data, msgPrefix, i, msgSuffix) {
  if (
    data.dates[`${i}`].status != 'TENTATIVE' &&
    data.dates[`${i}`].status != 'CONFIRMED' &&
    data.dates[`${i}`].status != 'CANCELLED'
  ) {
    console.error(
      msgPrefix + ' failed: event status needs to be TENTATIVE, CONFIRMED, or CANCELLED' + msgSuffix
    );
    return false;
  }
  return true;
}
function atcb_validate_availability(data, msgPrefix, i, msgSuffix) {
  if (
    data.dates[`${i}`].availability != null &&
    data.dates[`${i}`].availability != '' &&
    data.dates[`${i}`].availability != 'free' &&
    data.dates[`${i}`].availability != 'busy'
  ) {
    console.error(msgPrefix + ' failed: event availability needs to be "free" or "busy"' + msgSuffix);
    return false;
  }
  return true;
}
function atcb_validate_organizer(data, msgPrefix, i, msgSuffix) {
  if (data.dates[`${i}`].organizer != null && data.dates[`${i}`].organizer != '') {
    const organizerParts = data.dates[`${i}`].organizer.split('|');
    if (
      organizerParts.length != 2 ||
      organizerParts[0].length > 50 ||
      organizerParts[1].length > 80 ||
      !atcb_validEmail(organizerParts[1])
    ) {
      console.error(
        msgPrefix +
          ' failed: organizer needs to match the schema "NAME|EMAIL" with a valid email address' +
          msgSuffix
      );
      return false;
    }
  }
  return true;
}
function atcb_validate_uid(data, msgPrefix, i, msgSuffix) {
  if (!/^(\w|-){1,254}$/.test(data.dates[`${i}`].uid)) {
    console.error(
      msgPrefix +
        ' failed: UID not valid. May only contain alpha, digits, and dashes; and be less than 255 characters' +
        msgSuffix
    );
    return false;
  }
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      data.dates[`${i}`].uid
    )
  ) {
    console.warn(
      msgPrefix +
        ' failed: UID is strictly recommended to be a hex-encoded random Universally Unique Identifier (UUID)!' +
        msgSuffix
    );
  }
  return true;
}
function atcb_validate_sequence(data, msgPrefix, i, msgSuffix) {
  if (!/^\d+$/.test(data.dates[`${i}`].sequence)) {
    console.log(msgPrefix + ': sequence needs to be a number. Used the default 0 instead' + msgSuffix);
    data.dates[`${i}`].sequence = 0;
  }
  return true;
}
function atcb_validate_timezone(data, msgPrefix, i, msgSuffix) {
  if (data.dates[`${i}`].timeZone != null && data.dates[`${i}`].timeZone != '') {
    const validTimeZones = tzlib_get_timezones();
    if (!validTimeZones.includes(data.dates[`${i}`].timeZone)) {
      console.error(msgPrefix + ' failed: invalid time zone given' + msgSuffix);
      return false;
    }
  }
  return true;
}
function atcb_validate_datetime(data, msgPrefix, i, msgSuffix) {
  const dates = ['startDate', 'endDate'];
  const newDate = dates;
  if (
    !dates.every(function (date) {
      if (data.dates[`${i}`][`${date}`].length !== 10) {
        console.error(msgPrefix + ' failed: date misspelled [-> YYYY-MM-DD]' + msgSuffix);
        return false;
      }
      const dateParts = data.dates[`${i}`][`${date}`].split('-');
      if (dateParts.length < 3 || dateParts.length > 3) {
        console.error(
          msgPrefix +
            ' failed: date misspelled [' +
            date +
            ': ' +
            data.dates[`${i}`][`${date}`] +
            ']' +
            msgSuffix
        );
        return false;
      }
      newDate[`${date}`] = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      return true;
    })
  ) {
    return false;
  }
  const times = ['startTime', 'endTime'];
  if (
    !times.every(function (time) {
      if (data.dates[`${i}`][`${time}`] != null) {
        if (data.dates[`${i}`][`${time}`].length !== 5) {
          console.error(msgPrefix + ' failed: time misspelled [-> HH:MM]' + msgSuffix);
          return false;
        }
        const timeParts = data.dates[`${i}`][`${time}`].split(':');
        if (timeParts.length < 2 || timeParts.length > 2) {
          console.error(
            msgPrefix +
              ' failed: time misspelled [' +
              time +
              ': ' +
              data.dates[`${i}`][`${time}`] +
              ']' +
              msgSuffix
          );
          return false;
        }
        if (timeParts[0] > 23) {
          console.error(
            msgPrefix +
              ' failed: time misspelled - hours number too high [' +
              time +
              ': ' +
              timeParts[0] +
              ']' +
              msgSuffix
          );
          return false;
        }
        if (timeParts[1] > 59) {
          console.error(
            msgPrefix +
              ' failed: time misspelled - minutes number too high [' +
              time +
              ': ' +
              timeParts[1] +
              ']' +
              msgSuffix
          );
          return false;
        }
        if (time == 'startTime') {
          newDate.startDate = new Date(
            newDate.startDate.getTime() + timeParts[0] * 3600000 + timeParts[1] * 60000
          );
        }
        if (time == 'endTime') {
          newDate.endDate = new Date(
            newDate.endDate.getTime() + timeParts[0] * 3600000 + timeParts[1] * 60000
          );
        }
      }
      return true;
    })
  ) {
    return false;
  }
  if (
    (data.dates[`${i}`].startTime != null && data.dates[`${i}`].endTime == null) ||
    (data.dates[`${i}`].startTime == null && data.dates[`${i}`].endTime != null)
  ) {
    console.error(
      msgPrefix + ' failed: if you set a starting time, you also need to define an end time' + msgSuffix
    );
    return false;
  }
  if (newDate.endDate < newDate.startDate) {
    console.error(msgPrefix + ' failed: end date before start date' + msgSuffix);
    return false;
  }
  return true;
}
function atcb_validate_rrule(data, msgPrefix) {
  if (data.recurrence != null && data.recurrence != '' && data.dates.length > 1) {
    console.error(msgPrefix + ' failed: RRULE and multi-date set at the same time');
    return false;
  }
  if (data.recurrence != null && data.recurrence != '' && !/^RRULE:[\w=;,:+-/\\]+$/i.test(data.recurrence)) {
    console.error(msgPrefix + ' failed: RRULE data misspelled');
    return false;
  }
  if (
    data.recurrence_interval != null &&
    data.recurrence_interval != '' &&
    !/^\d+$/.test(data.recurrence_interval)
  ) {
    console.error(msgPrefix + ' failed: recurrence data (interval) misspelled');
    return false;
  }
  if (
    data.recurrence_until != null &&
    data.recurrence_until != '' &&
    !/^(\d|-|:)+$/i.test(data.recurrence_until)
  ) {
    console.error(msgPrefix + ' failed: recurrence data (until) misspelled');
    return false;
  }
  if (data.recurrence_count != null && data.recurrence_count != '' && !/^\d+$/.test(data.recurrence_count)) {
    console.error(msgPrefix + ' failed: recurrence data (interval) misspelled');
    return false;
  }
  if (
    data.recurrence_byMonth != null &&
    data.recurrence_byMonth != '' &&
    !/^(\d|,)+$/.test(data.recurrence_byMonth)
  ) {
    console.error(msgPrefix + ' failed: recurrence data (byMonth) misspelled');
    return false;
  }
  if (
    data.recurrence_byMonthDay != null &&
    data.recurrence_byMonthDay != '' &&
    !/^(\d|,)+$/.test(data.recurrence_byMonthDay)
  ) {
    console.error(msgPrefix + ' failed: recurrence data (byMonthDay) misspelled');
    return false;
  }
  if (
    data.recurrence_byDay != null &&
    data.recurrence_byDay != '' &&
    !/^(\d|-|MO|TU|WE|TH|FR|SA|SU|,)+$/im.test(data.recurrence_byDay)
  ) {
    console.error(msgPrefix + ' failed: recurrence data (byDay) misspelled');
    return false;
  }
  if (
    data.recurrence_weekstart != null &&
    data.recurrence_weekstart != '' &&
    !/^(MO|TU|WE|TH|FR|SA|SU)$/im.test(data.recurrence_weekstart)
  ) {
    console.error(msgPrefix + ' failed: recurrence data (weekstart) misspelled');
    return false;
  }
  return true;
}


function atcb_toggle(action, data = '', button = '', keyboardTrigger = false, generatedButton = false) {
  if (action == 'open') {
    atcb_open(data, button, keyboardTrigger, generatedButton);
  } else if (
    action == 'close' ||
    button.classList.contains('atcb-active') ||
    document.querySelector('.atcb-active-modal')
  ) {
    atcb_close(keyboardTrigger);
  } else {
    atcb_open(data, button, keyboardTrigger, generatedButton);
  }
}
function atcb_open(data, button, keyboardTrigger = false, generatedButton = false) {
  if (document.querySelector('.atcb-list') || document.querySelector('.atcb-modal')) return;
  const list = atcb_generate_dropdown_list(data);
  const listWrapper = document.createElement('div');
  listWrapper.classList.add('atcb-list-wrapper');
  if (button) {
    button.classList.add('atcb-active');
    if (data.listStyle === 'modal') {
      button.classList.add('atcb-modal-style');
      list.classList.add('atcb-modal');
    } else {
      listWrapper.appendChild(list);
      listWrapper.classList.add('atcb-dropdown');
      if (data.listStyle === 'overlay') {
        listWrapper.classList.add('atcb-dropoverlay');
      }
    }
    if (generatedButton) {
      list.classList.add('atcb-generated-button'); 
    }
  } else {
    list.classList.add('atcb-modal');
  }
  const bgOverlay = atcb_generate_bg_overlay(data.listStyle, data.trigger, data.lightMode, data.background);
  const atcbL = document.createElement('div');
  atcbL.id = 'add-to-calendar-button-reference';
  atcbL.style.width = '150px';
  atcbL.style.padding = '10px 0';
  atcbL.style.height = 'auto';
  atcbL.style.transform = 'translate3d(0, 0, 0)';
  atcbL.style.zIndex = '15000000';
  setTimeout(() => {
    atcbL.innerHTML =
      '<a href="https://add-to-calendar-button.com" target="_blank" rel="noopener">' +
      atcbIcon['atcb'] +
      '</a>';
  }, 500);
  if (data.listStyle === 'modal') {
    document.body.appendChild(bgOverlay);
    bgOverlay.appendChild(list);
    atcbL.style.position = 'fixed';
    atcbL.style.bottom = '15px';
    atcbL.style.right = '30px';
    atcb_manage_body_scroll();
  } else {
    atcbL.style.position = 'absolute';
    document.body.appendChild(listWrapper);
    listWrapper.appendChild(list);
    if (data.buttonStyle != '') {
      listWrapper.classList.add('atcb-style-' + data.buttonStyle);
    }
    document.body.appendChild(bgOverlay);
    if (data.listStyle === 'dropdown-static') {
      atcb_position_list(button, listWrapper, true);
    } else {
      atcb_position_list(button, listWrapper);
    }
  }
  atcb_set_sizes(list, data.sizes);
  atcb_set_fullsize(bgOverlay);
  if (keyboardTrigger) {
    list.firstChild.focus();
  } else {
    list.firstChild.focus({ preventScroll: true });
  }
  list.firstChild.blur();
}
function atcb_close(keyboardTrigger = false) {
  const allModals = document.querySelectorAll('.atcb-modal[data-modal-nr]');
  if (allModals.length > 1) {
    document.querySelectorAll('.atcb-modal[data-modal-nr="' + allModals.length + '"]')[0].remove();
    const nextModal = document.querySelectorAll(
      '.atcb-modal[data-modal-nr="' + (allModals.length - 1) + '"]'
    )[0];
    nextModal.style.display = 'block';
    let focusEl = nextModal;
    const availableButtons = nextModal.getElementsByTagName('button');
    if (availableButtons.length > 0) {
      focusEl = availableButtons[0];
    }
    focusEl.focus();
    if (!keyboardTrigger) {
      focusEl.blur();
    }
  } else {
    const newFocusEl = document.querySelector('.atcb-active, .atcb-active-modal');
    if (newFocusEl) {
      newFocusEl.focus({ preventScroll: true });
      if (!keyboardTrigger) {
        newFocusEl.blur();
      }
    }
    Array.from(document.querySelectorAll('.atcb-active')).forEach((button) => {
      button.classList.remove('atcb-active');
    });
    Array.from(document.querySelectorAll('.atcb-active-modal')).forEach((button) => {
      button.classList.remove('atcb-active-modal');
    });
    document.body.classList.remove('atcb-modal-no-scroll');
    Array.from(document.querySelectorAll('.atcb-list-wrapper'))
      .concat(Array.from(document.querySelectorAll('.atcb-list')))
      .concat(Array.from(document.querySelectorAll('.atcb-modal[data-modal-nr]')))
      .concat(Array.from(document.querySelectorAll('#add-to-calendar-button-reference')))
      .concat(Array.from(document.querySelectorAll('#atcb-bgoverlay')))
      .forEach((el) => el.remove());
  }
}


function atcb_generate_label(data, parent, type, icon = false, text = '', oneOption = false) {
  switch (type) {
    case 'trigger':
    default:
      parent.id = data.identifier;
      if (data.trigger === 'click') {
        parent.addEventListener('click', (event) => {
          event.preventDefault();
          atcb_toggle('auto', data, parent, false, true);
        });
      } else {
        parent.addEventListener('touchend', (event) => {
          event.preventDefault();
          atcb_toggle('auto', data, parent, false, true);
        });
        parent.addEventListener(
          'mouseenter',
          atcb_debounce_leading((event) => {
            event.preventDefault();
            atcb_toggle('open', data, parent, false, true);
          })
        );
      }
      parent.addEventListener('keyup', function (event) {
        if (event.key == 'Enter') {
          event.preventDefault();
          atcb_toggle('auto', data, parent, true, true);
        }
      });
      break;
    case 'apple':
    case 'google':
    case 'ical':
    case 'msteams':
    case 'ms365':
    case 'outlookcom':
    case 'yahoo':
      parent.id = data.identifier + '-' + type;
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_toggle('close');
          atcb_generate_links(type, data);
        })
      );
      parent.addEventListener('keyup', function (event) {
        if (event.key == 'Enter') {
          event.preventDefault();
          oneOption ? parent.blur() : atcb_toggle('close');
          atcb_generate_links(type, data, 'all', true);
        }
      });
      break;
    case 'close':
      parent.id = data.identifier + '-close';
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          atcb_toggle('close');
        })
      );
      parent.addEventListener('keyup', function (event) {
        if (event.key == 'Enter') {
          event.preventDefault();
          atcb_toggle('close', data, 'all', true);
        }
      });
      break;
  }
  if (oneOption) {
    parent.id = data.identifier;
  }
  atcb_generate_label_text(data, parent, type, icon, text, oneOption);
}
function atcb_generate_label_text(data, parent, type, icon, text, oneOption) {
  const defaultTriggerText = atcb_translate_hook('Add to Calendar', data);
  if (oneOption && text == '') {
    text = defaultTriggerText;
  }
  switch (type) {
    case 'trigger':
    default:
      text = text || defaultTriggerText;
      break;
    case 'apple':
      text = text || 'Apple';
      break;
    case 'google':
      text = text || 'Google';
      break;
    case 'ical':
      text = text || atcb_translate_hook('iCal File', data);
      break;
    case 'msteams':
      text = text || 'Microsoft Teams';
      break;
    case 'ms365':
      text = text || 'Microsoft 365';
      break;
    case 'outlookcom':
      text = text || 'Outlook.com';
      break;
    case 'yahoo':
      text = text || 'Yahoo';
      break;
    case 'close':
      text = atcb_translate_hook('Close', data);
      break;
  }
  if (data.buttonStyle == 'date' && (type == 'trigger' || oneOption)) {
    return;
  }
  if (icon) {
    const iconEl = document.createElement('span');
    iconEl.classList.add('atcb-icon');
    iconEl.innerHTML = atcbIcon[`${type}`];
    parent.appendChild(iconEl);
  }
  const textEl = document.createElement('span');
  textEl.classList.add('atcb-text');
  textEl.textContent = text;
  parent.appendChild(textEl);
}
function atcb_generate_button(button, data) {
  button.textContent = '';
  if (data.richData && data.name && data.dates[0].location && data.dates[0].startDate) {
    atcb_generate_rich_data(data, button);
  }
  const buttonTriggerWrapper = document.createElement('div');
  buttonTriggerWrapper.classList.add('atcb-button-wrapper');
  buttonTriggerWrapper.classList.add('atcb-' + data.lightMode);
  if (data.rtl) {
    buttonTriggerWrapper.classList.add('atcb-rtl');
  }
  button.appendChild(buttonTriggerWrapper);
  atcb_set_sizes(buttonTriggerWrapper, data.sizes);
  const buttonTrigger = document.createElement('button');
  buttonTrigger.classList.add('atcb-button');
  if (data.trigger === 'click') {
    buttonTrigger.classList.add('atcb-click');
  }
  if (data.listStyle === 'overlay') {
    buttonTrigger.classList.add('atcb-dropoverlay');
  }
  buttonTrigger.type = 'button';
  buttonTriggerWrapper.appendChild(buttonTrigger);
  if (data.buttonStyle == 'date') {
    atcb_generate_date_button(data, buttonTrigger);
  }
  if (data.options.length === 1) {
    buttonTrigger.classList.add('atcb-single');
    atcb_generate_label(data, buttonTrigger, data.options[0], true, data.label, true);
  } else {
    atcb_generate_label(data, buttonTrigger, 'trigger', true, data.label);
    const buttonDropdownAnchor = document.createElement('div');
    buttonDropdownAnchor.classList.add('atcb-dropdown-anchor');
    buttonTrigger.appendChild(buttonDropdownAnchor);
  }
  const btnCheck = document.createElement('div');
  btnCheck.classList.add('atcb-checkmark');
  btnCheck.innerHTML = atcbIcon['checkmark'];
  buttonTrigger.appendChild(btnCheck);
  button.classList.remove('atcb');
  button.classList.add('atcb-initialized');
  if (data.inline) {
    button.style.display = 'inline-block';
  } else {
    button.style.display = 'block';
  }
  console.log('Add to Calendar Button "' + data.identifier + '" created');
}
function atcb_generate_rich_data(data, button) {
  const schemaEl = document.createElement('script');
  schemaEl.type = 'application/ld+json';
  const schemaContentMulti = [];
  if (data.dates.length > 1) {
    const parts = [];
    parts.push('"@context":"https://schema.org"');
    parts.push('"@type":"EventSeries"');
    parts.push('"@id":"' + data.name.replace(/\s/g, '') + '"');
    parts.push('"name":"' + data.name + '",');
    schemaContentMulti.push('{\r\n' + parts.join(',\r\n') + '\r\n');
  }
  const schemaContentFull = [];
  for (let i = 0; i < data.dates.length; i++) {
    const schemaContent = [];
    schemaContent.push('"@context":"https://schema.org"');
    schemaContent.push('"@type":"Event"');
    if (data.dates.length > 1) {
      schemaContent.push('"@id":"' + data.name.replace(/\s/g, '') + '-' + (i + 1) + '"');
    }
    if (data.dates[`${i}`].status == 'CANCELLED') {
      schemaContent.push('"eventStatus":"https://schema.org/EventCancelled"');
    }
    schemaContent.push('"name":"' + data.dates[`${i}`].name + '"');
    if (data.dates[`${i}`].descriptionHtmlFree) {
      schemaContent.push('"description":"' + data.dates[`${i}`].descriptionHtmlFree + '"');
    }
    const formattedDate = atcb_generate_time(data.dates[`${i}`], 'delimiters', 'general', true);
    schemaContent.push('"startDate":"' + formattedDate.start + '"');
    if (formattedDate.duration != null) {
      schemaContent.push('"duration":"' + formattedDate.duration + '"');
    }
    schemaContent.push(
      data.dates[`${i}`].location.startsWith('http')
        ? '"eventAttendanceMode":"https://schema.org/OnlineEventAttendanceMode",\r\n"location": {\r\n"@type":"VirtualLocation",\r\n"url":"' +
            data.dates[`${i}`].location +
            '"\r\n}'
        : '"location":"' + data.dates[`${i}`].location + '"'
    );
    if (data.recurrence != null && data.recurrence != '') {
      schemaContent.push('"eventSchedule": { "@type": "Schedule"');
      if (data.dates[0].timeZone != null && data.dates[0].timeZone != '') {
        schemaContent.push('"scheduleTimezone":"' + data.dates[0].timeZone + '"');
      }
      const repeatFrequency = 'P' + data.recurrence_interval + data.recurrence_frequency.substr(0, 1);
      schemaContent.push('"repeatFrequency":"' + repeatFrequency + '"');
      if (data.recurrence_byDay != null && data.recurrence_byDay != '') {
        const byDayString = (function () {
          if (/\d/.test(data.recurrence_byDay)) {
            return '"' + data.recurrence_byDay + '"';
          } else {
            const byDays = data.recurrence_byDay.split(',');
            const helperMap = {
              MO: 'https://schema.org/Monday',
              TU: 'https://schema.org/Tuesday',
              WE: 'https://schema.org/Wednesday',
              TH: 'https://schema.org/Thursday',
              FR: 'https://schema.org/Friday',
              SA: 'https://schema.org/Saturday',
              SU: 'https://schema.org/Sunday',
            };
            const output = [];
            for (let i = 0; i < byDays.length; i++) {
              output.push('"' + helperMap[byDays[`${i}`]] + '"');
            }
            return '[' + output.join(',') + ']';
          }
        })();
        schemaContent.push('"byDay":' + byDayString);
      }
      if (data.recurrence_byMonth != null && data.recurrence_byMonth != '') {
        const byMonthString = data.recurrence_byMonth.includes(',')
          ? '[' + data.recurrence_byMonth + ']'
          : data.recurrence_byMonth;
        schemaContent.push('"byMonth":"' + byMonthString + '"');
      }
      if (data.recurrence_byMonthDay != null && data.recurrence_byMonthDay != '') {
        const byMonthDayString = data.recurrence_byMonthDay.includes(',')
          ? '[' + data.recurrence_byMonthDay + ']'
          : data.recurrence_byMonthDay;
        schemaContent.push('"byMonthDay":"' + byMonthDayString + '"');
      }
      if (data.recurrence_count != null && data.recurrence_count != '') {
        schemaContent.push('"repeatCount":"' + data.recurrence_count + '"');
      }
      if (data.recurrence_until != null && data.recurrence_until != '') {
        schemaContent.push('"endDate":"' + data.recurrence_until + '"');
      }
      if (data.startTime != null && data.startTime != '' && data.endTime != null && data.endTime != '') {
        schemaContent.push('"startTime":"' + data.startTime + ':00"');
        schemaContent.push('"endTime":"' + data.endTime + ':00"');
        schemaContent.push('"duration":"' + formattedDate.duration + '"');
      }
      schemaContent.push('"startDate":"' + data.startDate + '" }');
    } else {
      schemaContent.push('"endDate":"' + formattedDate.end + '"');
    }
    if (data.dates[`${i}`].organizer != null && data.dates[`${i}`].organizer != '') {
      const organizerParts = data.dates[`${i}`].organizer.split('|');
      schemaContent.push(
        '"organizer":{\r\n"@type":"Person",\r\n"name":"' +
          organizerParts[0] +
          '",\r\n"email":"' +
          organizerParts[1] +
          '"\r\n}'
      );
    }
    const imageData = [];
    if (data.images != null) {
      if (Array.isArray(data.images)) {
        for (let i = 0; i < data.images.length; i++) {
          if (atcb_secure_url(data.images[`${i}`]) && data.images[`${i}`].startsWith('http')) {
            imageData.push('"' + data.images[`${i}`] + '"');
          }
        }
      }
    } else {
      imageData.push('"https://add-to-calendar-button.com/demo_assets/img/1x1.png"');
      imageData.push('"https://add-to-calendar-button.com/demo_assets/img/4x3.png"');
      imageData.push('"https://add-to-calendar-button.com/demo_assets/img/16x9.png"');
    }
    if (imageData.length > 0) {
      schemaContent.push('"image":[\r\n' + imageData.join(',\r\n') + ']');
    }
    schemaContentFull.push('{\r\n' + schemaContent.join(',\r\n') + '\r\n}');
  }
  if (data.dates.length > 1) {
    schemaEl.textContent =
      schemaContentMulti.join(',\r\n') + '"subEvents":[\r\n' + schemaContentFull.join(',\r\n') + '\r\n]\r\n}';
  } else {
    schemaEl.textContent = schemaContentFull[0];
  }
  button.appendChild(schemaEl);
}
function atcb_generate_dropdown_list(data) {
  const optionsList = document.createElement('div');
  optionsList.classList.add('atcb-list');
  optionsList.classList.add('atcb-' + data.lightMode);
  if (data.rtl) {
    optionsList.classList.add('atcb-rtl');
  }
  let listCount = 0;
  data.options.forEach(function (option) {
    const optionItem = document.createElement('div');
    optionItem.classList.add('atcb-list-item');
    optionItem.tabIndex = 0;
    listCount++;
    optionItem.dataset.optionNumber = listCount;
    optionsList.appendChild(optionItem);
    atcb_generate_label(data, optionItem, option, true, data.optionLabels[listCount - 1]);
  });
  if (data.listStyle === 'modal') {
    const optionItem = document.createElement('div');
    optionItem.classList.add('atcb-list-item', 'atcb-list-item-close');
    optionItem.tabIndex = 0;
    optionsList.appendChild(optionItem);
    atcb_generate_label(data, optionItem, 'close', true);
  }
  return optionsList;
}
function atcb_generate_bg_overlay(listStyle = 'dropdown', trigger = '', lightMode = 'light', darken = true) {
  const bgOverlay = document.createElement('div');
  bgOverlay.id = 'atcb-bgoverlay';
  if (listStyle !== 'modal' && darken) {
    bgOverlay.classList.add('atcb-animate-bg');
  }
  if (!darken) {
    bgOverlay.classList.add('atcb-no-bg');
  }
  bgOverlay.classList.add('atcb-' + lightMode);
  bgOverlay.tabIndex = 0;
  bgOverlay.addEventListener(
    'click',
    atcb_debounce((e) => {
      if (e.target !== e.currentTarget) return;
      atcb_toggle('close');
    })
  );
  let fingerMoved = false;
  bgOverlay.addEventListener(
    'touchstart',
    atcb_debounce_leading(() => (fingerMoved = false)),
    { passive: true }
  );
  bgOverlay.addEventListener(
    'touchmove',
    atcb_debounce_leading(() => (fingerMoved = true)),
    { passive: true }
  );
  bgOverlay.addEventListener(
    'touchend',
    atcb_debounce((e) => {
      if (fingerMoved !== false || e.target !== e.currentTarget) return;
      atcb_toggle('close');
    }),
    { passive: true }
  );
  bgOverlay.addEventListener(
    'focus',
    atcb_debounce_leading((e) => {
      if (e.target !== e.currentTarget) return;
      atcb_toggle('close');
    })
  );
  if (trigger !== 'click') {
    bgOverlay.addEventListener(
      'mousemove',
      atcb_debounce_leading((e) => {
        if (e.target !== e.currentTarget) return;
        atcb_toggle('close');
      })
    );
  } else {
    bgOverlay.classList.add('atcb-click');
  }
  return bgOverlay;
}
function atcb_create_modal(
  data,
  icon = '',
  headline,
  content = '',
  buttons = [],
  subEvents = [],
  keyboardTrigger = false
) {
  const bgOverlay = (function () {
    const el = document.getElementById('atcb-bgoverlay');
    if (!el) {
      return atcb_generate_bg_overlay('modal', 'click', data.lightMode);
    } else {
      return el;
    }
  })();
  document.body.appendChild(bgOverlay);
  const modalWrapper = document.createElement('div');
  modalWrapper.classList.add('atcb-modal');
  bgOverlay.appendChild(modalWrapper);
  const modalCount = document.querySelectorAll('.atcb-modal').length;
  modalWrapper.dataset.modalNr = modalCount;
  modalWrapper.tabIndex = 0;
  modalWrapper.focus({ preventScroll: true });
  modalWrapper.blur();
  const parentButton = document.getElementById(data.identifier);
  if (parentButton != null) {
    parentButton.classList.add('atcb-active-modal');
  }
  const modal = document.createElement('div');
  modal.classList.add('atcb-modal-box');
  modal.classList.add('atcb-' + data.lightMode);
  if (data.rtl) {
    modal.classList.add('atcb-rtl');
  }
  modalWrapper.appendChild(modal);
  atcb_set_sizes(modal, data.sizes);
  atcb_set_fullsize(bgOverlay);
  if (icon != '') {
    const modalIcon = document.createElement('div');
    modalIcon.classList.add('atcb-modal-icon');
    modalIcon.innerHTML = atcbIcon[`${icon}`];
    modal.appendChild(modalIcon);
  }
  const modalHeadline = document.createElement('div');
  modalHeadline.classList.add('atcb-modal-headline');
  modalHeadline.textContent = headline;
  modal.appendChild(modalHeadline);
  if (content != '') {
    const modalContent = document.createElement('div');
    modalContent.classList.add('atcb-modal-content');
    modalContent.innerHTML = content;
    modal.appendChild(modalContent);
  }
  if (subEvents.length > 1) {
    const modalsubEventsContent = document.createElement('div');
    modalsubEventsContent.classList.add('atcb-modal-content');
    modal.appendChild(modalsubEventsContent);
    for (let i = 1; i < subEvents.length; i++) {
      const modalSubEventButton = document.createElement('button');
      modalSubEventButton.type = 'button';
      modalSubEventButton.id = data.identifier + '-' + subEvents[0] + '-' + i;
      if (atcbStates[`${data.identifier}`][`${subEvents[0]}`][i - 1] > 0) {
        modalSubEventButton.classList.add('atcb-saved');
      }
      modalSubEventButton.classList.add('atcb-subevent-btn');
      modalsubEventsContent.appendChild(modalSubEventButton);
      atcb_generate_date_button(data, modalSubEventButton, i);
      if (i == 1 && keyboardTrigger) {
        modalSubEventButton.focus();
      }
      switch (subEvents[0]) {
        case 'apple':
        case 'google':
        case 'ical':
        case 'msteams':
        case 'ms365':
        case 'outlookcom':
        case 'yahoo':
          modalSubEventButton.addEventListener(
            'click',
            atcb_debounce(() => {
              atcb_generate_links(subEvents[0], data, subEvents[`${i}`], keyboardTrigger, true);
            })
          );
          break;
      }
    }
  }
  if (buttons.length == 0) {
    buttons.push({ type: 'close', label: atcb_translate_hook('Close', data) });
  }
  const modalButtons = document.createElement('div');
  modalButtons.classList.add('atcb-modal-buttons');
  modal.appendChild(modalButtons);
  buttons.forEach((button, index) => {
    let modalButton;
    if (button.href != null && button.href != '') {
      modalButton = document.createElement('a');
      modalButton.setAttribute('target', atcbDefaultTarget);
      modalButton.setAttribute('href', button.href);
      modalButton.setAttribute('rel', 'noopener');
    } else {
      modalButton = document.createElement('button');
      modalButton.type = 'button';
    }
    modalButton.classList.add('atcb-modal-btn');
    if (button.primary) {
      modalButton.classList.add('atcb-modal-btn-primary');
    }
    if (button.label == null || button.label == '') {
      button.label = atcb_translate_hook('Click me', data);
    }
    modalButton.textContent = button.label;
    modalButtons.appendChild(modalButton);
    if (index == 0 && subEvents.length < 2 && keyboardTrigger) {
      modalButton.focus();
    }
    switch (button.type) {
      default:
      case 'close':
        modalButton.addEventListener(
          'click',
          atcb_debounce(() => atcb_close())
        );
        modalButton.addEventListener('keyup', function (event) {
          if (event.key == 'Enter') {
            atcb_toggle('close', '', '', true);
          }
        });
        break;
    }
  });
  if (modalCount > 1) {
    const prevModal = document.querySelectorAll('.atcb-modal[data-modal-nr="' + (modalCount - 1) + '"]')[0];
    prevModal.style.display = 'none';
  }
  atcb_manage_body_scroll(modalWrapper);
}
function atcb_generate_date_button(data, parent, subEvent = 'all') {
  if (subEvent != 'all') {
    subEvent = parseInt(subEvent) - 1;
  } else if (data.dates.length == 1) {
    subEvent = 0;
  }
  const fullTimeInfo = (function () {
    let startDateInfo, endDateInfo, timeZoneInfo;
    if (subEvent == 'all') {
      startDateInfo = new Date(atcb_generate_time(data.dates[0])['start']);
      endDateInfo = new Date(atcb_generate_time(data.dates[data.dates.length - 1])['end']);
      timeZoneInfo = data.dates[0].timeZone;
    } else {
      const formattedTime = atcb_generate_time(data.dates[`${subEvent}`]);
      startDateInfo = new Date(formattedTime['start']);
      endDateInfo = new Date(formattedTime['end']);
      timeZoneInfo = data.dates[`${subEvent}`].timeZone;
    }
    let timeString = '';
    const optionsDateTimeShort = {
      timeZone: timeZoneInfo,
      hour12: false,
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    const optionsDateTimeLong = {
      timeZone: timeZoneInfo,
      hour12: false,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    const optionsTime = {
      timeZone: timeZoneInfo,
      hour12: false,
      hour: 'numeric',
      minute: '2-digit',
    };
    if (
      startDateInfo.getFullYear() === endDateInfo.getFullYear() &&
      startDateInfo.getMonth() === endDateInfo.getMonth() &&
      startDateInfo.getDate() === endDateInfo.getDate()
    ) {
      timeString =
        startDateInfo.toLocaleString(data.language, optionsDateTimeShort) +
        ' - ' +
        endDateInfo.toLocaleTimeString(data.language, optionsTime);
    } else {
      timeString =
        startDateInfo.toLocaleString(data.language, optionsDateTimeShort) +
        ' - ' +
        endDateInfo.toLocaleString(data.language, optionsDateTimeLong);
    }
    if (timeZoneInfo != null) {
      if (Intl.DateTimeFormat().resolvedOptions().timeZone != timeZoneInfo) {
        timeString += '; ' + timeZoneInfo;
      }
    } else {
      timeString += '; UTC';
    }
    return timeString;
  })();
  const hoverText = (function () {
    if (subEvent != 'all' && data.dates[`${subEvent}`].status == 'CANCELLED') {
      return (
        atcb_translate_hook('Cancelled Date', data) +
        '<br>' +
        atcb_translate_hook('Delete from Calendar', data)
      );
    }
    return '+ ' + atcb_translate_hook('Add to Calendar', data);
  })();
  const cancelledInfo = (function () {
    if (subEvent != 'all' && data.dates[`${subEvent}`].status == 'CANCELLED') {
      return atcb_translate_hook('Cancelled Date', data);
    }
    return '';
  })();
  if (subEvent == 'all') {
    subEvent = 0;
  }
  const startDate = new Date(data.dates[`${subEvent}`].startDate);
  const btnLeft = document.createElement('div');
  btnLeft.classList.add('atcb-date-btn-left');
  parent.appendChild(btnLeft);
  const btnDay = document.createElement('div');
  btnDay.classList.add('atcb-date-btn-day');
  btnLeft.appendChild(btnDay);
  const btnMonth = document.createElement('div');
  btnMonth.classList.add('atcb-date-btn-month');
  btnDay.textContent = String(startDate.getDate()).padStart(2, '0');
  btnMonth.textContent = startDate.toLocaleString(data.language, {
    month: 'short',
  });
  btnLeft.appendChild(btnMonth);
  const btnRight = document.createElement('div');
  btnRight.classList.add('atcb-date-btn-right');
  parent.appendChild(btnRight);
  const btnDetails = document.createElement('div');
  btnDetails.classList.add('atcb-date-btn-details');
  btnRight.appendChild(btnDetails);
  const btnHeadline = document.createElement('div');
  btnHeadline.classList.add('atcb-date-btn-headline');
  btnHeadline.textContent = data.dates[`${subEvent}`].name;
  btnDetails.appendChild(btnHeadline);
  if ((data.location != null && data.location != '') || cancelledInfo == '') {
    const btnLocation = document.createElement('div');
    btnLocation.classList.add('atcb-date-btn-content');
    btnDetails.appendChild(btnLocation);
    if (cancelledInfo != '') {
      btnLocation.textContent = cancelledInfo;
      btnLocation.style.fontWeight = '600';
      btnLocation.style.color = '#9c1a23';
    } else {
      btnLocation.classList.add('atcb-date-btn-content-location');
      const btnLocationIcon = document.createElement('span');
      btnLocationIcon.classList.add('atcb-date-btn-content-icon');
      btnLocationIcon.innerHTML = atcbIcon['location'];
      btnLocation.appendChild(btnLocationIcon);
      const btnLocationText = document.createElement('span');
      btnLocationText.textContent = data.location;
      btnLocation.appendChild(btnLocationText);
    }
  }
  const btnDateTime = document.createElement('div');
  btnDateTime.classList.add('atcb-date-btn-content');
  btnDetails.appendChild(btnDateTime);
  const btnDateTimeIcon = document.createElement('span');
  btnDateTimeIcon.classList.add('atcb-date-btn-content-icon');
  btnDateTimeIcon.innerHTML = atcbIcon['ical'];
  btnDateTime.appendChild(btnDateTimeIcon);
  const btnDateTimeText = document.createElement('span');
  btnDateTimeText.textContent = fullTimeInfo;
  btnDateTime.appendChild(btnDateTimeText);
  if (data.recurrence != null && data.recurrence != '') {
    const recurSign = document.createElement('span');
    recurSign.classList.add('atcb-date-btn-content-recurr-icon');
    btnDateTime.appendChild(recurSign);
    recurSign.innerHTML = '&#x27F3;';
  }
  const btnHover = document.createElement('div');
  btnHover.classList.add('atcb-date-btn-hover');
  btnHover.innerHTML = hoverText;
  btnRight.appendChild(btnHover);
  const btnCheck = document.createElement('div');
  btnCheck.classList.add('atcb-checkmark');
  btnCheck.innerHTML = atcbIcon['checkmark'];
  parent.appendChild(btnCheck);
}


function atcb_generate_links(type, data, subEvent = 'all', keyboardTrigger = false, multiDateModal = false) {
  if (subEvent != 'all') {
    subEvent = parseInt(subEvent) - 1;
  } else if (data.dates.length == 1) {
    subEvent = 0;
  }
  if (isMobile() && (type == 'msteams' || type == 'ms365' || type == 'outlookcom')) {
    type = 'ical';
  }
  if (subEvent != 'all') {
    if (data.dates[`${subEvent}`].status == 'CANCELLED' && type != 'apple' && type != 'ical') {
      atcb_create_modal(
        data,
        'warning',
        atcb_translate_hook('Cancelled Date', data),
        atcb_translate_hook('Delete from Calendar', data),
        [],
        [],
        keyboardTrigger
      );
    } else {
      switch (type) {
        case 'apple':
        case 'ical':
          atcb_generate_ical(data, subEvent, keyboardTrigger);
          break;
        case 'google':
          atcb_generate_google(data.dates[`${subEvent}`]);
          break;
        case 'msteams':
          atcb_generate_msteams(data.dates[`${subEvent}`]);
          break;
        case 'ms365':
          atcb_generate_microsoft(data.dates[`${subEvent}`]);
          break;
        case 'outlookcom':
          atcb_generate_microsoft(data.dates[`${subEvent}`], 'outlook');
          break;
        case 'yahoo':
          atcb_generate_yahoo(data.dates[`${subEvent}`]);
          break;
      }
    }
    const subEventButton = document.getElementById(data.identifier + '-' + type + '-' + (subEvent + 1));
    if (subEventButton) {
      subEventButton.classList.add('atcb-saved');
    }
    atcbStates[`${data.identifier}`][`${type}`][`${subEvent}`]++;
    const filteredStates = atcbStates[`${data.identifier}`][`${type}`].filter(function (value) {
      return value < 1;
    });
    if (filteredStates.length == 0) {
      document.getElementById(data.identifier).classList.add('atcb-saved');
      atcb_set_fully_successful(multiDateModal);
    }
    return;
  }
  atcb_generate_multidate_links(type, data, keyboardTrigger, multiDateModal);
}
function atcb_generate_multidate_links(type, data, keyboardTrigger, multiDateModal) {
  if (
    (type == 'ical' || type == 'apple') &&
    data.dates.every(function (theSubEvent) {
      if (
        theSubEvent.status == 'CANCELLED' ||
        (theSubEvent.organizer != null && theSubEvent.organizer != '')
      ) {
        return false;
      }
      return true;
    })
  ) {
    atcb_generate_ical(data, 'all', keyboardTrigger);
    for (let i = 0; i < atcbStates[`${data.identifier}`][`${type}`].length; i++) {
      atcbStates[`${data.identifier}`][`${type}`][`${i}`]++;
    }
    document.getElementById(data.identifier).classList.add('atcb-saved');
    atcb_set_fully_successful(multiDateModal);
    return;
  }
  if (!multiDateModal) {
    const individualButtons = [type];
    for (let i = 0; i < data.dates.length; i++) {
      individualButtons.push(i + 1);
    }
    atcb_create_modal(
      data,
      type,
      atcb_translate_hook('MultiDate headline', data),
      atcb_translate_hook('MultiDate info', data),
      [],
      individualButtons,
      keyboardTrigger
    );
  }
}
function atcb_set_fully_successful(multiDateModal) {
  atcb_saved_hook();
  if (multiDateModal && document.querySelectorAll('.atcb-modal[data-modal-nr]').length < 2) {
    atcb_toggle('close');
  }
}
function atcb_generate_google(data) {
  const urlParts = [];
  urlParts.push('https://calendar.google.com/calendar/render?action=TEMPLATE');
  const formattedDate = atcb_generate_time(data, 'clean', 'google');
  urlParts.push(
    'dates=' + encodeURIComponent(formattedDate.start) + '%2F' + encodeURIComponent(formattedDate.end)
  );
  if (data.timeZone != null && data.timeZone != '' && !/GMT[+|-]\d{1,2}/i.test(data.timeZone)) {
    urlParts.push('ctz=' + data.timeZone);
  }
  if (data.name != null && data.name != '') {
    urlParts.push('text=' + encodeURIComponent(data.name));
  }
  const tmpDataDescription = [];
  if (data.description != null && data.description != '') {
    tmpDataDescription.push(data.description);
  }
  if (data.location != null && data.location != '') {
    urlParts.push('location=' + encodeURIComponent(data.location));
    if (isiOS()) {
      if (tmpDataDescription.length > 0) {
        tmpDataDescription.push('<br><br>');
      }
      tmpDataDescription.push('&#128205;: ' + data.location);
    }
  }
  if (tmpDataDescription.length > 0) {
    urlParts.push('details=' + encodeURIComponent(tmpDataDescription.join()));
  }
  if (data.recurrence != null && data.recurrence != '') {
    urlParts.push('recur=' + encodeURIComponent(data.recurrence));
  }
  if (data.availability != null && data.availability != '') {
    const availabilityPart = (function () {
      if (data.availability == 'free') {
        return 'crm=AVAILABLE&trp=false';
      }
      return 'crm=BUSY&trp=true';
    })();
    urlParts.push(availabilityPart);
  }
  urlParts.push('uid=' + encodeURIComponent(data.uid));
  atcb_open_cal_url(urlParts.join('&'));
}
function atcb_generate_yahoo(data) {
  const urlParts = [];
  urlParts.push('https://calendar.yahoo.com/?v=60');
  const formattedDate = atcb_generate_time(data, 'clean');
  urlParts.push(
    'st=' + encodeURIComponent(formattedDate.start) + '&et=' + encodeURIComponent(formattedDate.end)
  );
  if (formattedDate.allday) {
    urlParts.push('dur=allday');
  }
  if (data.name != null && data.name != '') {
    urlParts.push('title=' + encodeURIComponent(data.name));
  }
  if (data.location != null && data.location != '') {
    urlParts.push('in_loc=' + encodeURIComponent(data.location));
  }
  if (data.descriptionHtmlFree != null && data.descriptionHtmlFree != '') {
    urlParts.push('desc=' + encodeURIComponent(data.descriptionHtmlFree));
  }
  urlParts.push('uid=' + encodeURIComponent(data.uid));
  atcb_open_cal_url(urlParts.join('&'));
}
function atcb_generate_microsoft(data, type = '365') {
  const urlParts = [];
  const basePath = '/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent';
  const baseUrl = (function () {
    if (type == 'outlook') {
      return 'https://outlook.live.com' + basePath;
    } else {
      return 'https://outlook.office.com' + basePath;
    }
  })();
  urlParts.push(baseUrl);
  const formattedDate = atcb_generate_time(data, 'delimiters', 'microsoft');
  urlParts.push('startdt=' + encodeURIComponent(formattedDate.start));
  urlParts.push('enddt=' + encodeURIComponent(formattedDate.end));
  if (formattedDate.allday) {
    urlParts.push('allday=true');
  }
  if (data.name != null && data.name != '') {
    urlParts.push('subject=' + encodeURIComponent(data.name));
  }
  if (data.location != null && data.location != '') {
    urlParts.push('location=' + encodeURIComponent(data.location));
  }
  if (data.description != null && data.description != '') {
    urlParts.push('body=' + encodeURIComponent(data.description.replace(/\n/g, '<br>')));
  }
  urlParts.push('uid=' + encodeURIComponent(data.uid));
  atcb_open_cal_url(urlParts.join('&'));
}
function atcb_generate_msteams(data) {
  const urlParts = [];
  const baseUrl = 'https://teams.microsoft.com/l/meeting/new?';
  const formattedDate = atcb_generate_time(data, 'delimiters', 'microsoft');
  urlParts.push('startTime=' + encodeURIComponent(formattedDate.start));
  urlParts.push('endTime=' + encodeURIComponent(formattedDate.end));
  if (data.name != null && data.name != '') {
    urlParts.push('subject=' + encodeURIComponent(data.name));
  }
  let locationString = '';
  if (data.location != null && data.location != '') {
    locationString = encodeURIComponent(data.location);
    urlParts.push('location=' + locationString);
    locationString += ' // '; 
  }
  if (data.descriptionHtmlFree != null && data.descriptionHtmlFree != '') {
    urlParts.push('content=' + locationString + encodeURIComponent(data.descriptionHtmlFree));
  }
  urlParts.push('uid=' + encodeURIComponent(data.uid));
  atcb_open_cal_url(baseUrl + urlParts.join('&'));
}
function atcb_open_cal_url(url) {
  if (atcb_secure_url(url)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(url, atcbDefaultTarget).focus();
  }
}
function atcb_generate_ical(data, subEvent = 'all', keyboardTrigger = false) {
  if (subEvent != 'all') {
    subEvent = parseInt(subEvent);
  }
  const filename = atcb_determine_ical_filename(data, subEvent);
  if (!isiOS() || !isWebView()) {
    if (
      subEvent != 'all' &&
      data.dates[`${subEvent}`].icsFile != null &&
      data.dates[`${subEvent}`].icsFile != ''
    ) {
      atcb_save_file(data.dates[`${subEvent}`].icsFile, filename);
      return;
    }
    if (data.icsFile != null && data.icsFile != '') {
      atcb_save_file(data.icsFile, filename);
      return;
    }
  }
  const now = new Date();
  const ics_lines = ['BEGIN:VCALENDAR', 'VERSION:2.0'];
  ics_lines.push('PRODID:-// https://add-to-calendar-pro.com // button v' + atcbVersion + ' //EN');
  ics_lines.push('CALSCALE:GREGORIAN');
  if (subEvent == 'all') {
    ics_lines.push('METHOD:PUBLISH');
  } else {
    if (data.dates[`${subEvent}`].status != null && data.dates[`${subEvent}`].status == 'CANCELLED') {
      ics_lines.push('METHOD:CANCEL');
    } else {
      if (data.dates[`${subEvent}`].organizer != null && data.dates[`${subEvent}`].organizer != '') {
        ics_lines.push('METHOD:REQUEST');
      } else {
        ics_lines.push('METHOD:PUBLISH');
      }
    }
  }
  const usedTimeZones = [];
  const loopStart = (function () {
    if (subEvent != 'all') {
      return subEvent;
    }
    return 0;
  })();
  const loopEnd = (function () {
    if (subEvent != 'all') {
      return subEvent;
    }
    return data.dates.length - 1;
  })();
  for (let i = loopStart; i <= loopEnd; i++) {
    const formattedDate = atcb_generate_time(data.dates[`${i}`], 'clean', 'ical');
    const timeAddon = (function () {
      if (formattedDate.allday) {
        return ';VALUE=DATE';
      }
      if (data.dates[`${i}`].timeZone != null && data.dates[`${i}`].timeZone != '') {
        const timeZoneBlock = tzlib_get_ical_block(data.dates[`${i}`].timeZone);
        if (!usedTimeZones.includes(data.dates[`${i}`].timeZone)) {
          ics_lines.push(timeZoneBlock[0]);
        }
        usedTimeZones.push(data.dates[`${i}`].timeZone);
        return ';' + timeZoneBlock[1];
      }
    })();
    ics_lines.push('BEGIN:VEVENT');
    ics_lines.push('UID:' + data.dates[`${i}`].uid);
    ics_lines.push('DTSTAMP:' + atcb_format_datetime(now, 'clean', true));
    ics_lines.push('DTSTART' + timeAddon + ':' + formattedDate.start);
    ics_lines.push('DTEND' + timeAddon + ':' + formattedDate.end);
    ics_lines.push('SUMMARY:' + data.dates[`${i}`].name.replace(/.{65}/g, '$&' + '\r\n ')); 
    if (data.dates[`${i}`].descriptionHtmlFree != null && data.dates[`${i}`].descriptionHtmlFree != '') {
      ics_lines.push(
        'DESCRIPTION:' +
          data.dates[`${i}`].descriptionHtmlFree.replace(/\n/g, '\\n').replace(/.{60}/g, '$&' + '\r\n ') // adjusting for intended line breaks + making sure it does not exceed 75 characters per line
      );
    }
    if (data.dates[`${i}`].description != null && data.dates[`${i}`].description != '') {
      ics_lines.push(
        'X-ALT-DESC;FMTTYPE=text/html:\r\n <!DOCTYPE HTML PUBLIC ""-//W3C//DTD HTML 3.2//EN"">\r\n <HTML><BODY>\r\n ' +
          data.dates[`${i}`].description.replace(/\n/g, '<br>').replace(/.{60}/g, '$&' + '\r\n ') +
          '\r\n </BODY></HTML>'
      );
    }
    if (data.dates[`${i}`].location != null && data.dates[`${i}`].location != '') {
      ics_lines.push('LOCATION:' + data.dates[`${i}`].location);
    }
    if (data.dates[`${i}`].organizer != null && data.dates[`${i}`].organizer != '') {
      const organizerParts = data.dates[`${i}`].organizer.split('|');
      ics_lines.push('ORGANIZER;CN=' + organizerParts[0] + ':MAILTO:' + organizerParts[1]);
    }
    if (data.recurrence != null && data.recurrence != '') {
      ics_lines.push(data.recurrence);
    }
    if (data.dates[`${i}`].availability != null && data.dates[`${i}`].availability != '') {
      const transpVal = (function () {
        if (data.dates[`${i}`].availability == 'free') {
          return 'TRANSPARENT';
        }
        return 'OPAQUE';
      })();
      ics_lines.push('TRANSP:' + transpVal);
    }
    ics_lines.push('SEQUENCE:' + data.dates[`${i}`].sequence);
    ics_lines.push('STATUS:' + data.dates[`${i}`].status);
    ics_lines.push('CREATED:' + data.created);
    ics_lines.push('LAST-MODIFIED:' + data.updated);
    ics_lines.push('END:VEVENT');
  }
  ics_lines.push('END:VCALENDAR');
  const dataUrl = (function (i) {
    if (data.dates[`${i}`].icsFile != null && data.dates[`${i}`].icsFile != '') {
      return data.dates[`${i}`].icsFile;
    }
    if (data.icsFile != null && data.icsFile != '') {
      return data.icsFile;
    }
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics_lines.join('\r\n'));
  })();
  if ((isiOS() && isChrome()) || (isWebView() && (isiOS() || (isAndroid() && isProblematicWebView())))) {
    atcb_ical_copy_note(dataUrl, data, keyboardTrigger);
    return;
  }
  atcb_save_file(dataUrl, filename);
}
function atcb_determine_ical_filename(data, subEvent) {
  const filenameSuffix = (function () {
    if (subEvent != 'all' && subEvent != 0) {
      return '-' + parseInt(subEvent) + 1;
    }
    return '';
  })();
  if (data.iCalFileName != null && data.iCalFileName != '') {
    return data.iCalFileName + filenameSuffix;
  }
  if (data.icsFile != null && data.icsFile != '') {
    const filenamePart = data.icsFile.split('/').pop().split('.')[0];
    if (filenamePart != '') {
      return filenamePart + filenameSuffix;
    }
  }
  return 'event-to-save-in-my-calendar' + filenameSuffix;
}
function atcb_ical_copy_note(dataUrl, data, keyboardTrigger) {
  atcb_copy_to_clipboard(dataUrl);
  if (isiOS() && isChrome()) {
    atcb_create_modal(
      data,
      'warning',
      atcb_translate_hook('Crios iCal headline', data),
      atcb_translate_hook('Crios iCal info', data) +
        '<br>' +
        atcb_translate_hook('WebView iCal solution 1', data) +
        '<br>' +
        atcb_translate_hook('Crios iCal solution 2', data),
      [],
      [],
      keyboardTrigger
    );
    return;
  }
  atcb_create_modal(
    data,
    'warning',
    atcb_translate_hook('WebView iCal headline', data),
    atcb_translate_hook('WebView iCal info', data) +
      '<br>' +
      atcb_translate_hook('WebView iCal solution 1', data) +
      '<br>' +
      atcb_translate_hook('WebView iCal solution 2', data),
    [],
    [],
    keyboardTrigger
  );
}


function atcb_saved_hook() {
  console.log('Event saved. Looking forward to it!');
}
function atcb_save_file(file, filename) {
  try {
    const save = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save.rel = 'noopener';
    save.href = file;
    if (isMobile()) {
      save.target = '_self';
    } else {
      save.target = '_blank';
    }
    save.download = filename + '.ics';
    const evt = new MouseEvent('click', {
      view: window,
      button: 0,
      bubbles: true,
      cancelable: false,
    });
    save.dispatchEvent(evt);
    (window.URL || window.webkitURL).revokeObjectURL(save.href);
  } catch (e) {
    console.error(e);
  }
}
function atcb_generate_time(data, style = 'delimiters', targetCal = 'general', addTimeZoneOffset = false) {
  const startDate = data.startDate.split('-');
  const endDate = data.endDate.split('-');
  if (data.startTime != null && data.startTime != '' && data.endTime != null && data.endTime != '') {
    const newStartDate = new Date(
      startDate[0] + '-' + startDate[1] + '-' + startDate[2] + 'T' + data.startTime + ':00.000+00:00'
    );
    const newEndDate = new Date(
      endDate[0] + '-' + endDate[1] + '-' + endDate[2] + 'T' + data.endTime + ':00.000+00:00'
    );
    const durationMS = newEndDate - newStartDate;
    const durationHours = Math.floor(durationMS / 1000 / 60 / 60);
    const durationMinutes = Math.floor(((durationMS - durationHours * 60 * 60 * 1000) / 1000 / 60) % 60);
    const durationString = (function () {
      if (durationHours < 10) {
        return '0' + durationHours + ':' + ('0' + durationMinutes).slice(-2);
      }
      return durationHours + ':' + ('0' + durationMinutes).slice(-2);
    })();
    if ((data.timeZone == null || (data.timeZone != null && data.timeZone == '')) && addTimeZoneOffset) {
      return {
        start: newStartDate.toISOString().replace('.000Z', '+00:00'),
        end: newEndDate.toISOString().replace('.000Z', '+00:00'),
        duration: durationString,
        allday: false,
      };
    }
    if (data.timeZone != null && data.timeZone != '') {
      if (targetCal == 'ical' || (targetCal == 'google' && !/GMT[+|-]\d{1,2}/i.test(data.timeZone))) {
        return {
          start: atcb_format_datetime(newStartDate, 'clean', true, true),
          end: atcb_format_datetime(newEndDate, 'clean', true, true),
          duration: durationString,
          allday: false,
        };
      }
      const offsetStart = tzlib_get_offset(data.timeZone, data.startDate, data.startTime);
      const offsetEnd = tzlib_get_offset(data.timeZone, data.endDate, data.endTime);
      if (addTimeZoneOffset) {
        const formattedOffsetStart = offsetStart.slice(0, 3) + ':' + offsetStart.slice(3);
        const formattedOffsetEnd = offsetEnd.slice(0, 3) + ':' + offsetEnd.slice(3);
        return {
          start: newStartDate.toISOString().replace('.000Z', formattedOffsetStart),
          end: newEndDate.toISOString().replace('.000Z', formattedOffsetEnd),
          duration: durationString,
          allday: false,
        };
      }
      const calcOffsetStart =
        parseInt(offsetStart[0] + 1) *
        -1 *
        ((parseInt(offsetStart.substr(1, 2)) * 60 + parseInt(offsetStart.substr(3, 2))) * 60 * 1000);
      const calcOffsetEnd =
        parseInt(offsetEnd[0] + 1) *
        -1 *
        ((parseInt(offsetEnd.substr(1, 2)) * 60 + parseInt(offsetEnd.substr(3, 2))) * 60 * 1000);
      newStartDate.setTime(newStartDate.getTime() + calcOffsetStart);
      newEndDate.setTime(newEndDate.getTime() + calcOffsetEnd);
    }
    return {
      start: atcb_format_datetime(newStartDate, style),
      end: atcb_format_datetime(newEndDate, style),
      duration: durationString,
      allday: false,
    };
  } else {
    const newStartDate = new Date(Date.UTC(startDate[0], startDate[1] - 1, startDate[2]));
    const newEndDate = new Date(Date.UTC(endDate[0], endDate[1] - 1, endDate[2]));
    if (targetCal == 'google' || targetCal == 'microsoft' || targetCal == 'ical') {
      newEndDate.setDate(newEndDate.getDate() + 1);
    }
    return {
      start: atcb_format_datetime(newStartDate, style, false),
      end: atcb_format_datetime(newEndDate, style, false),
      allday: true,
    };
  }
}
function atcb_format_datetime(datetime, style = 'delimiters', includeTime = true, removeZ = false) {
  const regex = (function () {
    if (includeTime) {
      if (style == 'clean') {
        return /(-|:|(\.\d{3}))/g;
      }
      return /(\.\d{3})/g;
    }
    if (style == 'clean') {
      return /(-|T(\d{2}:\d{2}:\d{2}\.\d{3})Z)/g;
    }
    return /T(\d{2}:\d{2}:\d{2}\.\d{3})Z/g;
  })();
  const output = removeZ
    ? datetime.toISOString().replace(regex, '').replace('Z', '')
    : datetime.toISOString().replace(regex, '');
  return output;
}
function atcb_secure_content(data, isJSON = true) {
  const toClean = isJSON ? JSON.stringify(data) : data;
  const cleanedUp = toClean.replace(/(<(?!br)([^>]+)>)/gi, '');
  if (isJSON) {
    return JSON.parse(cleanedUp);
  } else {
    return cleanedUp;
  }
}
function atcb_secure_url(url, throwError = true) {
  if (
    url.match(
      /((\.\.\/)|(\.\.\\)|(%2e%2e%2f)|(%252e%252e%252f)|(%2e%2e\/)|(%252e%252e\/)|(\.\.%2f)|(\.\.%252f)|(%2e%2e%5c)|(%252e%252e%255c)|(%2e%2e\\)|(%252e%252e\\)|(\.\.%5c)|(\.\.%255c)|(\.\.%c0%af)|(\.\.%25c0%25af)|(\.\.%c1%9c)|(\.\.%25c1%259c))/gi
    )
  ) {
    if (throwError) {
      console.error(
        'Seems like the generated URL includes at least one security issue and got blocked. Please check the calendar button parameters!'
      );
    }
    return false;
  } else {
    return true;
  }
}
function atcb_validEmail(email, mx = false) {
  if (!/^.{0,70}@.{1,30}\.[\w.]{2,9}$/.test(email)) {
    return false;
  }
  if (mx) {
    console.log('Testing for MX records not yet available');
  }
  return true;
}
function atcb_rewrite_html_elements(content, clear = false) {
  content = content.replace(/<br\s*\/?>/gi, '\n');
  if (clear) {
    content = content.replace(/\[(|\/)(url|br|hr|p|b|strong|u|i|em|li|ul|ol|h\d)\]|((\|.*)\[\/url\])/gi, '');
  } else {
    content = content.replace(/\[(\/|)(br|hr|p|b|strong|u|i|em|li|ul|ol|h\d)\]/gi, '<$1$2>');
    content = content.replace(/\[url\]([\w&$+.,:;=~!*'?@^%#|\s\-()/]*)\[\/url\]/gi, function (match, p1) {
      const urlText = p1.split('|');
      const text = (function () {
        if (urlText.length > 1 && urlText[1] != '') {
          return urlText[1];
        } else {
          return urlText[0];
        }
      })();
      return (
        '<a href="' + urlText[0] + '" target="' + atcbDefaultTarget + '" rel="noopener">' + text + '</a>'
      );
    });
  }
  return content;
}
function atcb_position_list(trigger, list, blockUpwards = false, resize = false) {
  let anchorSet = false;
  const originalTrigger = trigger;
  if (trigger.querySelector('.atcb-dropdown-anchor') !== null) {
    trigger = trigger.querySelector('.atcb-dropdown-anchor');
    anchorSet = true;
  }
  let triggerDim = trigger.getBoundingClientRect();
  let listDim = list.getBoundingClientRect();
  const btnDim = originalTrigger.getBoundingClientRect();
  if (anchorSet === true && !list.classList.contains('atcb-dropoverlay')) {
    const viewportHeight = document.documentElement.clientHeight;
    if (
      (list.classList.contains('atcb-dropup') && resize) ||
      (!blockUpwards &&
        triggerDim.top + listDim.height > viewportHeight - 20 &&
        2 * btnDim.top + btnDim.height - triggerDim.top - listDim.height > 20)
    ) {
      originalTrigger.classList.add('atcb-dropup');
      list.classList.add('atcb-dropup');
      list.style.bottom =
        2 * viewportHeight -
        (viewportHeight + (btnDim.top + (btnDim.top + btnDim.height - triggerDim.top))) -
        window.scrollY +
        'px';
    } else {
      list.style.top = window.scrollY + triggerDim.top + 'px';
      if (originalTrigger.classList.contains('atcb-dropup')) {
        originalTrigger.classList.remove('atcb-dropup');
      }
    }
    triggerDim = trigger.getBoundingClientRect();
    if (list.classList.contains('atcb-style-bubble') || list.classList.contains('atcb-style-text')) {
      list.style.minWidth = triggerDim.width + 'px';
    } else {
      list.style.width = triggerDim.width + 'px';
    }
    listDim = list.getBoundingClientRect();
    list.style.left = triggerDim.left - (listDim.width - triggerDim.width) / 2 + 'px';
  } else {
    let listWidth = triggerDim.width + 20 + 'px';
    list.style.minWidth = listWidth;
    listDim = list.getBoundingClientRect();
    list.style.top = window.scrollY + btnDim.top + btnDim.height / 2 - listDim.height / 2 + 'px';
    list.style.left = triggerDim.left - (listDim.width - triggerDim.width) / 2 + 'px';
  }
  const atcbL = document.getElementById('add-to-calendar-button-reference');
  if (atcbL) {
    if (originalTrigger.classList.contains('atcb-dropup')) {
      atcbL.style.top = window.scrollY + btnDim.top + btnDim.height + 'px';
      atcbL.style.left = btnDim.left + (btnDim.width - 150) / 2 + 'px';
    } else {
      listDim = list.getBoundingClientRect();
      if (originalTrigger.classList.contains('atcb-dropoverlay') || !anchorSet) {
        atcbL.style.top = window.scrollY + listDim.top + listDim.height + 'px';
      } else {
        atcbL.style.top = window.scrollY + triggerDim.top + listDim.height + 'px';
      }
      atcbL.style.left = listDim.left + (listDim.width - 150) / 2 + 'px';
    }
  }
}
function atcb_manage_body_scroll(modalObj = null) {
  const modal = (function () {
    if (modalObj != null) {
      return modalObj;
    } else {
      const allModals = document.querySelectorAll('.atcb-modal');
      return allModals[allModals.length - 1];
    }
  })();
  const modalDim = modal.getBoundingClientRect();
  if (modalDim.height + 100 > window.innerHeight) {
    document.body.classList.add('atcb-modal-no-scroll');
  } else {
    document.body.classList.remove('atcb-modal-no-scroll');
  }
}
function atcb_set_fullsize(el) {
  el.style.width = window.innerWidth + 'px';
  el.style.height = window.innerHeight + 100 + 'px';
}
function atcb_set_sizes(el, size) {
  el.style.setProperty('--base-font-size-l', size.l + 'px');
  el.style.setProperty('--base-font-size-m', size.m + 'px');
  el.style.setProperty('--base-font-size-s', size.s + 'px');
}
function atcb_generate_uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}
function atcb_copy_to_clipboard(dataString) {
  const tmpInput = document.createElement('input');
  document.body.appendChild(tmpInput);
  const editable = tmpInput.contentEditable;
  const readOnly = tmpInput.readOnly;
  tmpInput.value = dataString;
  tmpInput.contentEditable = true;
  tmpInput.readOnly = false;
  if (isiOS()) {
    var range = document.createRange();
    range.selectNodeContents(tmpInput);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    tmpInput.setSelectionRange(0, 999999);
  } else {
    navigator.clipboard.writeText(dataString);
    tmpInput.select();
  }
  tmpInput.contentEditable = editable;
  tmpInput.readOnly = readOnly;
  document.execCommand('copy');
  tmpInput.remove();
}
function atcb_debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
function atcb_debounce_leading(func, timeout = 300) {
  let timer;
  return (...args) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}
function atcb_throttle(func, delay = 10) {
  let result;
  let timeout = null;
  let previous = 0;
  let later = (...args) => {
    previous = Date.now();
    timeout = null;
    result = func.apply(this, args);
  };
  return (...args) => {
    let now = Date.now();
    let remaining = delay - (now - previous);
    if (remaining <= 0 || remaining > delay) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}


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
  if (!language) {
    language = 'en';
  }
  if (i18nStrings[`${language}`][`${identifier}`]) {
    return i18nStrings[`${language}`][`${identifier}`];
  }
  return identifier;
}


let atcbInitialInit = false;
function atcb_init() {
  if (!atcbInitialInit) {
    atcb_set_global_event_listener();
  }
  atcb_init_log_msg();
  if (!isBrowser()) {
    console.error('no further initialization due to wrong environment (no browser)');
    return;
  }
  const atcButtons = document.querySelectorAll('.atcb');
  if (atcButtons.length > 0) {
    const atcButtonsInitialized = document.querySelectorAll('.atcb-initialized');
    for (let i = 0; i < atcButtons.length; i++) {
      if (atcButtons[parseInt(i)].classList.contains('atcb-initialized')) {
        continue;
      }
      const atcbJsonInput = (function () {
        try {
          return JSON.parse(
            atcb_secure_content(atcButtons[parseInt(i)].innerHTML.replace(/(\r\n|\n|\r)/g, ''), false)
          );
        } catch (e) {
          console.error(
            'Add to Calendar Button generation failed: JSON content provided, but badly formatted (in doubt, try some tool like https://jsonformatter.org/ to validate).\r\nError message: ' +
              e
          );
          return '';
        }
      })();
      if (atcbJsonInput === '') {
        continue;
      }
      const atcbJsonInputPatched = atcb_patch_config(atcbJsonInput);
      if (atcb_check_required(atcbJsonInputPatched)) {
        const data = atcb_decorate_data(atcbJsonInputPatched);
        if (data.identifier == null || data.identifier == '') {
          data.identifier = 'atcb-btn-' + (i + atcButtonsInitialized.length + 1);
        }
        if (atcb_validate(data)) {
          atcb_generate_button(atcButtons[parseInt(i)], data);
          atcb_update_state_management(data);
        }
      }
    }
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function atcb_action(data, triggerElement, keyboardTrigger = true) {
  if (!atcbInitialInit) {
    atcb_set_global_event_listener();
  }
  atcb_init_log_msg();
  data = atcb_secure_content(data);
  if (!atcb_check_required(data)) {
    throw new Error('Add to Calendar Button generation failed: required data missing; see console logs');
  }
  data = atcb_decorate_data(data);
  if (triggerElement) {
    data.identifier = triggerElement.id;
    if (data.listStyle == 'dropdown') {
      data.listStyle = 'overlay';
    }
  } else {
    data.identifier = 'atcb-btn-custom';
    data.listStyle = 'modal';
    data.trigger = 'click';
  }
  if (!atcb_validate(data)) {
    throw new Error(
      'Add to Calendar Button generation (' + data.identifier + ') failed: invalid data; see console logs'
    );
  }
  atcb_update_state_management(data);
  atcb_toggle('open', data, triggerElement, keyboardTrigger);
}
function atcb_update_state_management(data) {
  const singleDates = [];
  for (let i = 0; i < data.options.length; i++) {
    singleDates[data.options[`${i}`]] = [];
    for (let id = 1; id <= data.dates.length; id++) {
      singleDates[data.options[`${i}`]].push(0);
    }
  }
  atcbStates[data.identifier] = singleDates;
}
function atcb_init_log_msg() {
  if (!atcbInitialInit) {
    console.log('Add to Calendar Button Script initialized (version ' + atcbVersion + ')');
    console.log('See https://github.com/add2cal/add-to-calendar-button for details');
    atcbInitialInit = true;
  }
}
function atcb_set_global_event_listener() {
  if (!isBrowser()) {
    return;
  }
  document.addEventListener('keyup', function (event) {
    if (event.key === 'Escape') {
      atcb_toggle('close', '', '', true);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (
      document.querySelector('.atcb-list') &&
      (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Tab')
    ) {
      let targetFocus = 0;
      let currFocusOption = document.activeElement;
      const optionListCount = document.querySelectorAll('.atcb-list-item').length;
      if (currFocusOption.classList.contains('atcb-list-item')) {
        if (event.key === 'ArrowDown' && currFocusOption.dataset.optionNumber < optionListCount) {
          event.preventDefault();
          targetFocus = parseInt(currFocusOption.dataset.optionNumber) + 1;
        } else if (event.key === 'ArrowUp' && currFocusOption.dataset.optionNumber >= 1) {
          event.preventDefault();
          targetFocus = parseInt(currFocusOption.dataset.optionNumber) - 1;
        }
        if (targetFocus > 0) {
          document.querySelector('.atcb-list-item[data-option-number="' + targetFocus + '"]').focus();
        }
      } else {
        event.preventDefault();
        switch (event.key) {
          case 'ArrowDown':
            document.querySelector('.atcb-list-item[data-option-number="1"]').focus();
            break;
          case 'ArrowUp':
            document.querySelector('.atcb-list-item[data-option-number="' + optionListCount + '"]').focus();
            break;
          default:
            document.querySelector('.atcb-list-item[data-option-number="1"]').focus();
            break;
        }
      }
    }
  });
  window.addEventListener(
    'resize',
    atcb_throttle(() => {
      const activeOverlay = document.getElementById('atcb-bgoverlay');
      if (activeOverlay != null) {
        atcb_set_fullsize(activeOverlay);
        atcb_manage_body_scroll();
      }
      const activeButton = document.querySelector('.atcb-active');
      const activeList = document.querySelector('.atcb-dropdown');
      if (activeButton != null && activeList != null) {
        atcb_position_list(activeButton, activeList, false, true);
      }
    })
  );
}


/*! START INIT */
if (isBrowser()) {
  if (document.readyState !== 'loading') {
    atcb_init();
  } else {
    document.addEventListener('DOMContentLoaded', atcb_init, false);
  }
}
/*! END INIT */
