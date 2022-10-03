/**
 * ++++++++++++++++++++++++++++++++++++++
 * Add to Calendar TimeZones iCal Library
 * ++++++++++++++++++++++++++++++++++++++
 */
const tzlibVersion = '1.3.2';
/* Creator: Jens Kuerschner (https://jenskuerschner.de)
 * Project: https://github.com/add2cal/timezones-ical-library
 * License: Apache-2.0
 *
 */

// DEFINING THE DB DATA - WILL GET RE-WRITTEN WITH THE ACTUAL DATA ON BUILD
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


// SHARED FUNCTION TO GET THE TZ CONTENT FROM THE INTERNAL DATABASE
function tzlib_get_content(tzName) {
  // get timezone parts
  const nameParts = tzName.split('/');
  // validate timezone
  // TODO: Make this a little bit smarter (depending on the future db structure)
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
  // create the output
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

// LOADING THE RIGHT CODE BLOCK
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function tzlib_get_ical_block(tzName, jsonType = false) {
  const tzBlock = tzlib_get_content(tzName);
  if (tzBlock[1] == null || tzBlock[1] == '') {
    return '';
  }
  // create the output
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
  // return
  if (jsonType) {
    return JSON.stringify(output);
  }
  return output;
}

// PROVIDING THE OFFSET BASED ON A GIVEN DATE AND TIME (YYYY-MM-DD and hh:mm as per ISO-8601).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function tzlib_get_offset(tzName, isoDate, isoTime) {
  const tzBlock = tzlib_get_content(tzName);
  if (tzBlock[1] == null || tzBlock[1] == '') {
    return '';
  }
  // validate date
  if (!isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    console.error('offset calculation failed: date misspelled [-> YYYY-MM-DD]');
    return '';
  }
  // validate time
  if (!isoTime.match(/^\d{2}:\d{2}$/)) {
    console.error('offset calculation failed: time misspelled [-> hh:mm]');
    return '';
  }
  // return early if there are no daylight changes
  if (!tzBlock[1].match(/BEGIN:DAYLIGHT/i)) {
    return tzBlock[1].match(/TZOFFSETTO:([+|-]\d{4})/i)[1];
  }
  // otherwise, calculate offset
  // creating a JS date from the input
  const dateString = isoDate + 'T' + isoTime + ':00';
  const date = new Date(dateString);
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth() + 1;
  const dateDay = date.getDate();
  const dateHour = date.getHours();
  // preparing the tz data
  const timezoneData = tzBlock[1].replace(/[^\w_\-:,;=+/<br>]/g, '').split('<br>');
  // collect timezone breakpoints (exactly 2)
  const tzBreakpoints = { 1: {}, 2: {} };
  let breakpointCount = 0;
  for (let i = 0; i < timezoneData.length; i++) {
    // always first and therefore drives the counter
    if (timezoneData[`${i}`].startsWith('TZOFFSETTO')) {
      breakpointCount++;
      tzBreakpoints[`${breakpointCount}`].offset = timezoneData[`${i}`].split(':')[1];
    }
    // only required for the critical hour
    if (timezoneData[`${i}`].startsWith('DTSTART')) {
      tzBreakpoints[`${breakpointCount}`].hour = parseInt(timezoneData[`${i}`].substr(17, 2));
    }
    // the RRULE is deciding when the switch happens (excluding the hour information from DTSTART)
    if (timezoneData[`${i}`].startsWith('RRULE')) {
      let rruleParts = timezoneData[`${i}`].split(';');
      let rruleMonth = parseInt(rruleParts[1].split('=')[1]);
      tzBreakpoints[`${breakpointCount}`].month = parseInt(rruleMonth);
      tzBreakpoints[`${breakpointCount}`].day = rruleParts[2].split('=')[1];
    }
  }
  // swap objects, if larger one comes first
  if (tzBreakpoints[1].month > tzBreakpoints[2].month) {
    [tzBreakpoints[1], tzBreakpoints[2]] = [tzBreakpoints[2], tzBreakpoints[1]];
  }
  // check for easy cases where the month is cleary in between
  if (dateMonth != tzBreakpoints[1].month && dateMonth != tzBreakpoints[2].month) {
    if (dateMonth < tzBreakpoints[1].month || dateMonth > tzBreakpoints[2].month) {
      return tzBreakpoints[2].offset;
    } else {
      return tzBreakpoints[1].offset;
    }
  }
  // in other cases, validate where we are exactly and pick the right offset
  // defining the critical case, we need to evaluate (the breakpoint we are matching by month)
  const theCase = (function () {
    return Object.keys(tzBreakpoints).find((key) => tzBreakpoints[`${key}`].month == dateMonth);
  })();
  // determining the actual day
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
  // finally identifying the right offset
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

// PROVIDE ALL TIMEZONES
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
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Apache-2.0 with “Commons Clause” License Condition v1.0
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */
const atcbVersion = '1.17.0';



// CHECKING FOR SPECIFIC DEVICED AND SYSTEMS
// browser
const isBrowser = () => {
  if (typeof window === 'undefined') {
    return false;
  } else {
    return true;
  }
};
// iOS
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
// Android
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
// Chrome
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
// Mobile
const isMobile = () => {
  if (isAndroid() || isiOS()) {
    return true;
  } else {
    return false;
  }
};
// WebView (iOS and Android)
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
// checking for problematic apps
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

// DEFINE GLOBAL VARIABLES
let atcbConsoleInit = false;
const atcbDefaultTarget = isWebView() ? '_system' : '_blank';
const atcbOptions = ['apple', 'google', 'ical', 'ms365', 'outlookcom', 'msteams', 'yahoo'];
const atcbValidRecurrOptions = ['apple', 'google', 'ical'];
const atcbiOSInvalidOptions = ['ical'];

// DEFINING GLOBAL ICONS
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
  browser:
    '<span class="atcb-icon-browser"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 245.657"><path d="M117.011 163.676q-6.283 6.218-13.623 12.419l6.087-1.009a80.373 80.373 0 0 0 11.524-3.255l.7 1.042 1.628 2.067h0 0a26.693 26.693 0 0 0 3.467 3.255 89.992 89.992 0 0 1-15.837 4.753 95.592 95.592 0 0 1-37.159 0 87.046 87.046 0 0 1-17.253-5.322.423.423 0 0 1-.228-.114 101.077 101.077 0 0 1-15.625-8.415 88.56 88.56 0 0 1-13.672-11.214 85.761 85.761 0 0 1-11.214-13.64 97.317 97.317 0 0 1-8.545-15.658 90.806 90.806 0 0 1-5.436-17.546 95.592 95.592 0 0 1 0-37.159 86.037 86.037 0 0 1 5.339-17.253.537.537 0 0 1 .098-.228 98.212 98.212 0 0 1 8.545-15.707 87.893 87.893 0 0 1 11.214-13.656 84.947 84.947 0 0 1 13.672-11.231A97.17 97.17 0 0 1 56.43 7.259a88.739 88.739 0 0 1 17.448-5.436 95.592 95.592 0 0 1 37.159 0 87.714 87.714 0 0 1 17.253 5.322.456.456 0 0 1 .212.114 100.507 100.507 0 0 1 15.756 8.545 88.56 88.56 0 0 1 13.623 11.198 85.077 85.077 0 0 1 11.214 13.688 94.713 94.713 0 0 1 8.545 15.739 88.739 88.739 0 0 1 5.436 17.481l.195.977-8.822-2.49a76.499 76.499 0 0 0-4.232-12.744 88.251 88.251 0 0 0-4.671-9.375H138.48a106.562 106.562 0 0 1 6.836 13.819l-10.026-2.702a106.985 106.985 0 0 0-6.283-11.117H96.454v5.55l-.993.358a21.941 21.941 0 0 0-7.097 4.362V50.245H55.812q-12.484 19.385-14.03 38.152H83.4q1.628 4.02 3.402 8.138H41.7c.505 12.81 4.883 25.505 12.826 38.152h33.888v-34.49l8.138 17.904v16.553h7.748l3.727 8.138H96.503v28.5a201.567 201.567 0 0 0 17.139-15.707q1.709 4.053 3.369 8.138zm69.761-4.167a7.552 7.552 0 0 1-1.904 1.286h-.13a6.738 6.738 0 0 1-7.097-.977l-18.881-16.016-6.511 15.902a21.045 21.045 0 0 1-1.937 3.662 14.812 14.812 0 0 1-2.458 2.865 7.78 7.78 0 0 1-12.207-1.335 15.105 15.105 0 0 1-1.497-2.653c-11.231-28.467-26.465-56.805-37.859-85.289a5.062 5.062 0 0 1 5.68-6.966c27.296 5.046 62.664 16.586 90.416 23.943 8.627 2.279 10.026 9.88 3.662 15.772a19.874 19.874 0 0 1-3.255 2.474c-4.883 2.767-9.766 5.973-14.649 8.903l18.799 16.114a6.917 6.917 0 0 1 1.628 2.051v.13a6.966 6.966 0 0 1 .635 2.393h0a6.934 6.934 0 0 1-.26 2.507 7.145 7.145 0 0 1-1.172 2.262 153.894 153.894 0 0 1-11.003 12.972zm-4.883-6.25l9.099-10.677c-4.004-3.434-21.159-16.748-22.933-19.955a3.923 3.923 0 0 1 1.351-5.29c5.957-3.255 13.607-7.91 19.255-11.67a13.64 13.64 0 0 0 1.986-1.449 7.194 7.194 0 0 0 1.221-1.416l.26-.488-.505-.293a6.38 6.38 0 0 0-1.237-.423l-84.589-22.494 35.531 79.982a7.813 7.813 0 0 0 .619 1.139l.358.472.456-.326a7.341 7.341 0 0 0 1.188-1.449 12.224 12.224 0 0 0 1.107-2.165c2.653-6.511 5.68-15.414 8.789-21.436l.374-.521a3.906 3.906 0 0 1 5.485-.439l22.201 18.832zM81.594 176.095a171.814 171.814 0 0 1-31.348-33.334h-25.57A83.824 83.824 0 0 0 45.2 162.292a85.956 85.956 0 0 0 14.47 7.813.22.22 0 0 0 .179.114 79.966 79.966 0 0 0 15.69 4.883 106.008 106.008 0 0 0 6.104 1.009zm-62.241-41.44h25.733a82.359 82.359 0 0 1-11.394-38.152H8.138a90.741 90.741 0 0 0 1.628 12.923 78.566 78.566 0 0 0 4.883 15.902 88.153 88.153 0 0 0 4.655 9.375zM8.138 88.397h25.635A88.511 88.511 0 0 1 46.42 50.245H19.353a88.153 88.153 0 0 0-4.704 9.375s0 .114-.114.163A81.236 81.236 0 0 0 9.652 75.49a83.759 83.759 0 0 0-1.628 12.907zm16.488-46.241h27.003A191.606 191.606 0 0 1 82.131 8.708c-2.262.277-4.492.602-6.641 1.058a78.713 78.713 0 0 0-15.87 4.883 89.911 89.911 0 0 0-14.47 7.813 83.824 83.824 0 0 0-20.525 19.532h0zm78.127-33.448a186.577 186.577 0 0 1 30.518 33.448h27.019a79.152 79.152 0 0 0-8.138-9.375 81.073 81.073 0 0 0-12.419-10.205 86.705 86.705 0 0 0-14.405-7.829s-.098 0-.163-.098a79.999 79.999 0 0 0-15.69-4.883c-2.214-.439-4.443-.781-6.657-1.058h0zm-6.25 5.274v28.175h26.84a188.286 188.286 0 0 0-26.84-28.175zm-8.138 157.279v-28.5H60.223a171.993 171.993 0 0 0 28.24 28.5zm0-129.105V13.981a189.295 189.295 0 0 0-26.807 28.175z"/></svg></span>',
};

// INITIALIZE THE SCRIPT AND FUNCTIONALITY
function atcb_init() {
  atcb_init_log_msg();
  // abort early, if not in a browser
  if (!isBrowser()) {
    throw new Error('no further initialization due to wrong environment (no browser)');
  }
  // get all placeholders
  const atcButtons = document.querySelectorAll('.atcb');
  if (atcButtons.length > 0) {
    // get the amount of already initialized ones first
    const atcButtonsInitialized = document.querySelectorAll('.atcb-initialized');
    // generate the buttons one by one
    for (let i = 0; i < atcButtons.length; i++) {
      // skip already initialized ones
      if (atcButtons[parseInt(i)].classList.contains('atcb-initialized')) {
        continue;
      }
      // get JSON from HTML block, but remove real code line breaks before parsing.
      // use <br> or \n explicitely in the description to create a line break.
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
      // rewrite config for backwards compatibility
      const atcbJsonInputPatched = atcb_patch_config(atcbJsonInput);
      // check, if all required data is available
      if (atcb_check_required(atcbJsonInputPatched)) {
        // Rewrite dynamic dates, standardize line breaks and transform urls in the description
        const atcbConfig = atcb_decorate_data(atcbJsonInputPatched);
        // set identifier
        if (atcbConfig.identifier == null || atcbConfig.identifier == '') {
          atcbConfig.identifier = 'atcb-btn-' + (i + atcButtonsInitialized.length + 1);
        }
        // validate the config (JSON iput) ...
        if (atcb_validate(atcbConfig)) {
          // ... and generate the button on success
          atcb_generate(atcButtons[parseInt(i)], atcbConfig);
        }
      }
    }
  }
}

// BACKWARDS COMPATIBILITY REWRITE
function atcb_patch_config(configData) {
  // you can remove this, if you did not use this script before v1.10.0
  // adjusts any old schema.org structure
  if (configData.event != null) {
    Object.keys(configData.event).forEach((key) => {
      // move entries one level up, but skip schema types
      if (key.charAt(0) !== '@') {
        configData[`${key}`] = configData.event[`${key}`];
      }
    });
    delete configData.event;
  }
  // you can remove this, if you did not use this script before v1.4.0
  // adjust deprecated config options
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

// CLEAN DATA BEFORE FURTHER VALIDATION (CONSIDERING SPECIAL RULES AND SCHEMES)
function atcb_decorate_data(data) {
  const now = new Date();
  // format RRULE
  if (data.recurrence != null && data.recurrence != '') {
    // remove spaces and force upper case
    data.recurrence = data.recurrence.replace(/\s+/g, '').toUpperCase();
    // pre-validate
    if (!/^(RRULE:[\w=;,:+-/\\]+|daily|weekly|monthly|yearly)$/im.test(data.recurrence)) {
      data.recurrence = '!wrong rrule format!';
    } else {
      // check if RRULE already
      if (/^RRULE:/i.test(data.recurrence)) {
        // draw easy rules from RRULE if possible
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
        // set interval if not given
        if (data.recurrence_interval == null || data.recurrence_interval == '') {
          data.recurrence_interval = 1;
        }
        // set weekstart if not given
        if (
          data.recurrence_weekstart == null ||
          (data.recurrence_weekstart == '') | (data.recurrence_weekstart.length > 2)
        ) {
          data.recurrence_weekstart = 'MO';
        }
        // save frequency before overriding the main recurrence data
        data.recurrence_frequency = data.recurrence;
        // generate the RRULE from easy rules
        data.recurrence =
          'RRULE:FREQ=' +
          data.recurrence +
          ';WKST=' +
          data.recurrence_weekstart +
          ';INTERVAL=' +
          data.recurrence_interval;
        // TODO: If "until" is given, translate it into a "count" and remove the "until" (here and in the above block). This would be way more stable!
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
  // cleanup options, standardizing names and splitting off custom labels
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
  // remove unsupported options
  // for iOS, we remove iCal (further down) and force the Apple option (if it is not there, but iCal is)
  if (isiOS() && data.options.includes('ical') && !data.options.includes('apple')) {
    data.options.push('apple');
  }
  // next, iterrate over the options
  for (let i = 0; i < data.options.length; i++) {
    // remove iCal for iOS as mentioned above (and potentially others)
    if (isiOS() && atcbiOSInvalidOptions.includes(data.options[`${i}`])) {
      data.options.splice(i, 1);
      if (data.optionLabels[`${i}`] != null) {
        delete data.optionLabels[`${i}`];
      }
      continue;
    }
    // in the recurrence case, we strip out all options, which do not support it
    if (data.recurrence != null && data.recurrence != '') {
      if (!atcbValidRecurrOptions.includes(data.options[`${i}`])) {
        data.options.splice(i, 1);
        if (data.optionLabels[`${i}`] != null) {
          delete data.optionLabels[`${i}`];
        }
        continue;
      }
      // also skip Apple and iCal for rrules with "until"
      if (
        data.recurrence_until != null &&
        data.recurrence_until != '' &&
        (data.options[`${i}`] == 'apple' || data.options[`${i}`] == 'ical')
      ) {
        data.options.splice(i, 1);
        if (data.optionLabels[`${i}`] != null) {
          delete data.optionLabels[`${i}`];
        }
      }
    }
  }
  // optimize date and time information
  if (data.dates != null && data.dates.length > 0) {
    for (let i = 0; i < data.dates.length; i++) {
      // get global time zone, if not set within the date block, but globally
      if (data.dates[`${i}`].timeZone == null && data.timeZone != null) {
        data.dates[`${i}`].timeZone = data.timeZone;
      }
      // cleanup different date-time formats
      const cleanedUpDates = atcb_date_cleanup(data.dates[`${i}`]);
      data.dates[`${i}`].startTime = cleanedUpDates.startTime;
      data.dates[`${i}`].endTime = cleanedUpDates.endTime;
      data.dates[`${i}`].timeZone = cleanedUpDates.timeZone;
      // calculate the real date values in case that there are some special rules included (e.g. adding days dynamically)
      data.dates[`${i}`].startDate = atcb_date_calculation(cleanedUpDates.startDate);
      data.dates[`${i}`].endDate = atcb_date_calculation(cleanedUpDates.endDate);
    }
  } else {
    // in the single case, we do the same, but without the looping
    const cleanedUpDates = atcb_date_cleanup(data);
    // in addition, we directly move this information into the dates array block for better consistency at the next steps
    data.dates = [];
    data.dates[0] = new Object;
    data.startTime = data.dates[0].startTime = cleanedUpDates.startTime;
    data.endTime = data.dates[0].endTime = cleanedUpDates.endTime;
    data.timeZone = data.dates[0].timeZone = cleanedUpDates.timeZone;
    data.startDate = data.dates[0].startDate = atcb_date_calculation(cleanedUpDates.startDate);
    data.endDate = data.dates[0].endDate = atcb_date_calculation(cleanedUpDates.endDate);
  }
  // set default listStyle
  if (data.listStyle == null || data.listStyle == '') {
    data.listStyle = 'dropdown';
  }
  // force click trigger on modal style
  if (data.listStyle === 'modal') {
    data.trigger = 'click';
  }
  // set button style and force click on styles, where the dropdown is not attached to the button
  if (data.buttonStyle != null && data.buttonStyle != '' && data.buttonStyle != 'default') {
    if (data.buttonStyle == 'round' || data.buttonStyle == 'text') {
      data.trigger = 'click';
    }
  } else {
    data.buttonStyle = '';
  }
  // set size
  if (data.size != null && data.size != '' && data.size >= 0 && data.size < 11) {
    data.size = 10 + parseInt(data.size);
  } else {
    data.size = 16;
  }
  // set created date
  if (data.created == null || data.created == '') {
    data.created = atcb_format_datetime(now, 'clean', true);
  }
  // set updated date
  if (data.updated == null || data.updated == '') {
    data.updated = atcb_format_datetime(now, 'clean', true);
  }
  // determine dark mode
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
  // set language if not set
  if (data.language == null || data.language == '') {
    data.language = 'en';
  }
  // set right-to-left for relevant languages
  if (data.language == 'ar') {
    data.rtl = true;
  } else {
    data.rtl = false;
  }  
  // set default status on top level
  if (data.status == null || data.status == '') {
    data.status = 'CONFIRMED';
  }
  // set  default sequence on top level
  if (data.sequence == null || data.sequence == '') {
    data.sequence = 0;
  }
  // set UID of first event, if "wrongly" specified on top level
  if ((data.dates[0].uid == null || data.dates[0].uid == '') && data.dates.length == 1 && (data.uid != null && data.uid != '')) {
    data.dates[0].uid = data.uid;
  }
  // decorate description
  // in that step, we also copy global values to date objects, if not set nested - mind that above, we even moved a single date item into this array for better consistency
  for (let i = 0; i < data.dates.length; i++) {
    if (data.dates[`${i}`].description != null && data.dates[`${i}`].description != '') {
      // store a clean description copy without the URL magic for iCal
      data.dates[`${i}`].descriptionHtmlFree = atcb_rewrite_html_elements(data.dates[`${i}`].description, true);
      // ...and transform pseudo elements for the regular one
      data.dates[`${i}`].description = atcb_rewrite_html_elements(data.dates[`${i}`].description);
    } else {
      if (data.dates[`${i}`].description == null && data.description != null && data.description != '') {
        data.dates[`${i}`].descriptionHtmlFree = atcb_rewrite_html_elements(data.description, true);
        data.dates[`${i}`].description = atcb_rewrite_html_elements(data.description);
      }
    }
    // to save on loops, we also do the copying for name, status, uid, sequence, and location here as well
    // for name, we also check for empty, because it is required
    if (data.dates[`${i}`].name == null || data.dates[`${i}`].name == '') {
      data.dates[`${i}`].name = data.name;
    }
    if (data.dates[`${i}`].status == null && data.status != null) {
      data.dates[`${i}`].status = data.status;
    } else {
      data.dates[`${i}`].status = data.dates[`${i}`].status.toUpperCase();
    }
    if (data.dates[`${i}`].sequence == null && data.sequence != null) {
      data.dates[`${i}`].sequence = data.sequence;
    }
    if (data.dates[`${i}`].location == null && data.location != null) {
      data.dates[`${i}`].location = data.location;
    }
    if (data.dates[`${i}`].organizer == null && data.organizer != null) {
      data.dates[`${i}`].organizer = data.organizer;
    }
    // for the uid, we do not copy from the top level, but rather generate it per event
    if (data.dates[`${i}`].uid == null) {
      data.dates[`${i}`].uid = atcb_generate_uuid();
    }
  }
  // we also copy recurrence, but just for easier access and only for the first array element. Multi-date events cannot be recurrent
  if (data.recurrence != null && data.recurrence != '') {
    data.dates[0].recurrence = data.recurrence;
  }
  return data;
}

// CHECK FOR REQUIRED FIELDS
function atcb_check_required(data) {
  // in this first step, we only check for the bare minimum, so we can abort early on really broken setups. We will do further validation later.
  // check for at least 1 option
  if (data.options == null || data.options.length < 1) {
    console.error('Add to Calendar Button generation failed: no valid options set');
    return false;
  }
  // check for min required data (without "options")
  // name is always required on top level (in the multi-date setup this would be the name of the event series)
  if (data.name == null || data.name == '') {
    console.error('Add to Calendar Button generation failed: required name information missing');
    return false;
  }
  // regarding event specifics, we start by checking for multi-date setups
  if (data.dates != null && data.dates.length > 0) {
    const requiredMultiField = ['name', 'startDate'];
    const requiredMultiFieldFlex = ['name'];
    return requiredMultiField.every(function (field) {
      for (let i = 0; i < data.dates.length; i++) {
        // if a field is missing, for flexible fields, we also need to check, whether they might be present globally (fallback for them)
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

// CALCULATE AND CLEAN UP THE ACTUAL DATES
function atcb_date_cleanup(dateTimeData) {
  // set endDate = startDate, if not provided
  if (dateTimeData.endDate == null || dateTimeData.endDate == '') {
    dateTimeData.endDate = dateTimeData.startDate;
  }
  // parse date+time format (unofficial alternative to the main implementation)
  const endpoints = ['start', 'end'];
  endpoints.forEach(function (point) {
    if (dateTimeData[point + 'Date'] != null) {
      // remove any milliseconds information
      dateTimeData[point + 'Date'] = dateTimeData[point + 'Date'].replace(/\.\d{3}/, '').replace('Z', '');
      // identify a possible time information within the date string
      const tmpSplitStartDate = dateTimeData[point + 'Date'].split('T');
      if (tmpSplitStartDate[1] != null) {
        dateTimeData[point + 'Date'] = tmpSplitStartDate[0];
        dateTimeData[point + 'Time'] = tmpSplitStartDate[1];
      }
    }
    // remove any seconds from time information
    if (dateTimeData[point + 'Time'] != null && dateTimeData[point + 'Time'].length === 8) {
      const timeStr = dateTimeData[point + 'Time'];
      dateTimeData[point + 'Time'] = timeStr.substring(0, timeStr.length - 3);
    }
    // update time zone, if special case set to go for the user's browser
    if (dateTimeData.timeZone == 'currentBrowser') {
      dateTimeData.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  });
  return dateTimeData;
}

function atcb_date_calculation(dateString) {
  // replace "today" with the current date first
  const today = new Date();
  const todayString = today.getUTCFullYear() + '-' + (today.getUTCMonth() + 1) + '-' + today.getUTCDate();
  dateString = dateString.replace(/today/gi, todayString);
  // check for any dynamic additions and adjust
  const dateStringParts = dateString.split('+');
  const dateParts = dateStringParts[0].split('-');
  let newDate = (function () {
    // backwards compatibility for version <1.5.0
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

// VALIDATE THE INPUT DATA
function atcb_validate(data) {
  // validate prefix
  if (data.identifier != null && data.identifier != '') {
    if (!/^[\w-]+$/.test(data.identifier)) {
      data.identifier = '';
      console.warn('Add to Calendar Button generation: identifier invalid - using auto numbers instead');
    }
  }
  const msgPrefix = 'Add to Calendar Button generation (' + data.identifier + ')';
  // validate explicit ics file
  if (data.icsFile != null && data.icsFile != '') {
    if (
      !atcb_secure_url(data.icsFile, false) ||
      !/\.ics$/.test(data.icsFile) ||
      !data.icsFile.startsWith('https://')
    ) {
      console.error(msgPrefix + ' failed: explicit ics file path not valid');
      return false;
    }
  }
  // validate created and updated input
  if (!/^\d{8}T\d{6}Z$/.test(data.created)) {
    console.error(
      msgPrefix +
        ': created date format not valid. Needs to be a full ISO-8601 UTC date and time string, formatted YYYYMMDDTHHMMSSZ'
    );
    return false;
  }
  if (!/^\d{8}T\d{6}Z$/.test(data.updated)) {
    console.error(
      msgPrefix +
        ': updated date format not valid. Needs to be a full ISO-8601 UTC date and time string, formatted YYYYMMDDTHHMMSSZ'
    );
    return false;
  }
  // validate options
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
  // next goes for all date blocks
  for (let i = 0; i < data.dates.length; i++) {
    const datesBlock = (function () {
      if (data.dates.length == 1) {
        return '';
      } else {
        return ' [dates array object #' + (i + 1) + '/' + data.dates.length + '] ';
      }
    })();
    // validate status
    if (data.dates[`${i}`].status != 'TENTATIVE' && data.dates[`${i}`].status != 'CONFIRMED' && data.dates[`${i}`].status != 'CANCELLED') {
      console.error(msgPrefix + ': event status needs to be TENTATIVE, CONFIRMED, or CANCELLED' + datesBlock);
      return false;
    }
    // validate organizer
    if (data.dates[`${i}`].organizer != null && data.dates[`${i}`].organizer != '') {
      const organizerParts = data.dates[`${i}`].organizer.split('|');
      if (
        organizerParts.length != 2 ||
        organizerParts[0].length > 50 ||
        organizerParts[1].length > 80 ||
        !atcb_validEmail(organizerParts[1])
      ) {
        console.error(
          msgPrefix + ' failed: organizer needs to match the schema "NAME|EMAIL" with a valid email address' + datesBlock
        );
        return false;
      }
    }
    // validate UID (must have less then 255 characters and only allowes for ; see )
    if (!/^(\w|-){1,254}$/.test(data.dates[`${i}`].uid)) {
      console.error(
        msgPrefix +
          ': UID not valid. May only contain alpha, digits, and dashes; and be less than 255 characters' + datesBlock
      );
      return false;
    }
    // validate UID for the recommended form, which is not forced, but show throw a warning
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.dates[`${i}`].uid)) {
      console.warn(
        msgPrefix +
          ': UID is strictly recommended to be a hex-encoded random Universally Unique Identifier (UUID)!' + datesBlock
      );
    }
    // validate sequence number if given and set it 0 if not
    if (!/^\d+$/.test(data.dates[`${i}`].sequence)) {
      console.log(msgPrefix + ': sequence needs to be a number. Used the default 0 instead' + datesBlock);
      data.dates[`${i}`].sequence = 0;
    }
    // validate time zone
    if (data.dates[`${i}`].timeZone != null && data.dates[`${i}`].timeZone != '') {
      const validTimeZones = tzlib_get_timezones();
      if (!validTimeZones.includes(data.dates[`${i}`].timeZone)) {
        console.error(msgPrefix + ' failed: invalid time zone given' + datesBlock);
        return false;
      }
    }
    // validate date
    const dates = ['startDate', 'endDate'];
    const newDate = dates;
    if (
      !dates.every(function (date) {
        if (data.dates[`${i}`][`${date}`].length !== 10) {
          console.error(msgPrefix + ' failed: date misspelled [-> YYYY-MM-DD]' + datesBlock);
          return false;
        }
        const dateParts = data.dates[`${i}`][`${date}`].split('-');
        if (dateParts.length < 3 || dateParts.length > 3) {
          console.error(msgPrefix + ' failed: date misspelled [' + date + ': ' + data.dates[`${i}`][`${date}`] + ']' + datesBlock);
          return false;
        }
        newDate[`${date}`] = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        return true;
      })
    ) {
      return false;
    }
    // validate time
    const times = ['startTime', 'endTime'];
    if (
      !times.every(function (time) {
        if (data.dates[`${i}`][`${time}`] != null) {
          if (data.dates[`${i}`][`${time}`].length !== 5) {
            console.error(msgPrefix + ' failed: time misspelled [-> HH:MM]' + datesBlock);
            return false;
          }
          const timeParts = data.dates[`${i}`][`${time}`].split(':');
          // validate the time parts
          if (timeParts.length < 2 || timeParts.length > 2) {
            console.error(msgPrefix + ' failed: time misspelled [' + time + ': ' + data.dates[`${i}`][`${time}`] + ']' + datesBlock);
            return false;
          }
          if (timeParts[0] > 23) {
            console.error(
              msgPrefix +
                ' failed: time misspelled - hours number too high [' +
                time +
                ': ' +
                timeParts[0] +
                ']' + datesBlock
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
                ']' + datesBlock
            );
            return false;
          }
          // update the date with the time for further validation steps
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
    if ((data.dates[`${i}`].startTime != null && data.dates[`${i}`].endTime == null) || (data.dates[`${i}`].startTime == null && data.dates[`${i}`].endTime != null)) {
      console.error(msgPrefix + ' failed: if you set a starting time, you also need to define an end time' + datesBlock);
      return false;
    }
    // validate whether end is not before start
    if (newDate.endDate < newDate.startDate) {
      console.error(msgPrefix + ' failed: end date before start date' + datesBlock);
      return false;
    }
  }
  // validate RRULE with multi-date (which is not allowed)
  if (data.recurrence != null && data.recurrence != '' && data.dates.length > 1) {
    console.error(msgPrefix + ' failed: RRULE and multi-date set at the same time');
    return false;
  }
  // validate any given RRULE
  if (data.recurrence != null && data.recurrence != '' && !/^RRULE:[\w=;,:+-/\\]+$/i.test(data.recurrence)) {
    console.error(msgPrefix + ' failed: RRULE data misspelled');
    return false;
  }
  // also validate the more easy recurrence settings, since any error there would be also hidden in the RRULE
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
  // on passing the validation, return true
  return true;
}

// GENERATE THE ACTUAL BUTTON
// helper function to generate the labels for the button and list options
function atcb_generate_label(data, parent, type, icon = false, text = '', oneOption = false) {
  let defaultTriggerText = atcb_translate_hook('Add to Calendar', data.language, data);
  // if there is only 1 option, we use the trigger text on the option label. Therefore, forcing it here
  if (oneOption && text == '') {
    text = defaultTriggerText;
  }
  // adding event listeners
  switch (type) {
    case 'trigger':
    default:
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
      break;
    case 'apple':
    case 'google':
    case 'ical':
    case 'msteams':
    case 'ms365':
    case 'outlookcom':
    case 'yahoo':
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_toggle('close');
          atcb_generate_links(type, data);
        })
      );
      break;
    case 'close':
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_toggle('close');
        })
      );
      parent.addEventListener(
        'focus',
        atcb_debounce(() => atcb_close(false))
      );
      break;
  }
  // defining IDs and text
  switch (type) {
    case 'trigger':
    default:
      parent.id = data.identifier;
      text = text || defaultTriggerText;
      break;
    case 'apple':
      parent.id = data.identifier + '-apple';
      text = text || 'Apple';
      break;
    case 'google':
      parent.id = data.identifier + '-google';
      text = text || 'Google';
      break;
    case 'ical':
      parent.id = data.identifier + '-ical';
      text = text || atcb_translate_hook('iCal File', data.language, data);
      break;
    case 'msteams':
      parent.id = data.identifier + '-msteams';
      text = text || 'Microsoft Teams';
      break;
    case 'ms365':
      parent.id = data.identifier + '-ms365';
      text = text || 'Microsoft 365';
      break;
    case 'outlookcom':
      parent.id = data.identifier + '-outlook';
      text = text || 'Outlook.com';
      break;
    case 'yahoo':
      parent.id = data.identifier + '-yahoo';
      text = text || 'Yahoo';
      break;
    case 'close':
      parent.id = data.identifier + '-close';
      text = atcb_translate_hook('Close', data.language, data);
      break;
  }
  // override the id for the oneOption button, since the button always needs to have the button id
  if (oneOption) {
    parent.id = data.identifier;
  }
  // support keyboard input
  if (!oneOption && type === 'trigger') {
    parent.addEventListener(
      'keyup',
      atcb_debounce_leading((event) => {
        if (event.key == 'Enter') {
          event.preventDefault();
          atcb_toggle('auto', data, parent, true, true);
        }
      })
    );
  } else {
    parent.addEventListener(
      'keyup',
      atcb_debounce_leading((event) => {
        if (event.key == 'Enter') {
          event.preventDefault();
          parent.click();
        }
      })
    );
  }
  // add icon and text label
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

// generate the triggering button
function atcb_generate(button, data) {
  // clean the placeholder
  button.textContent = '';
  // create schema.org data, if possible (https://schema.org/Event)
  // see https://developers.google.com/search/docs/advanced/structured-data/event for more details on how this affects Google search results
  // multi-date events are not 100% compliant with schema.org, since this is still a little broken and not supported by Google
  if (data.name && data.dates[0].location && data.dates[0].startDate) {
    const schemaEl = document.createElement('script');
    schemaEl.type = 'application/ld+json';
    const schemaContentMulti = [];
    if (data.dates.length > 1) {
      const parts = [];
      parts.push('"@context":"https://schema.org"');
      parts.push('"@type":"EventSeries"');
      parts.push('"@id":"' + data.name.replace(/\s/g,'') + '"');
      parts.push('"name":"' + data.name + '",');
      schemaContentMulti.push('{\r\n' + parts.join(',\r\n') + '\r\n');
    }
    const schemaContentFull = [];
    for (let i = 0; i < data.dates.length; i++) {
      const schemaContent = [];
      schemaContent.push('"@context":"https://schema.org"');
      schemaContent.push('"@type":"Event"');
      if (data.dates.length > 1) {
        schemaContent.push('"@id":"' + data.name.replace(/\s/g,'') + '-' + (i + 1) + '"');
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
      schemaEl.textContent = schemaContentMulti.join(',\r\n') + '"subEvents":[\r\n' + schemaContentFull.join(',\r\n') + '\r\n]\r\n}';
    } else {
      schemaEl.textContent = schemaContentFull[0];
    }
    button.appendChild(schemaEl);
  }
  // generate the wrapper div
  const buttonTriggerWrapper = document.createElement('div');
  buttonTriggerWrapper.classList.add('atcb-button-wrapper');
  buttonTriggerWrapper.classList.add('atcb-' + data.lightMode);
  if (data.rtl) {
    buttonTriggerWrapper.classList.add('atcb-rtl');
  }
  buttonTriggerWrapper.style.fontSize = data.size + 'px';
  button.appendChild(buttonTriggerWrapper);
  // generate the button trigger div
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
  // generate the label incl. eventListeners
  // if there is only 1 calendar option, we directly show this at the button, but with the trigger's label text
  if (data.options.length === 1) {
    buttonTrigger.classList.add('atcb-single');
    atcb_generate_label(data, buttonTrigger, data.options[0], true, data.label, true);
  } else {
    atcb_generate_label(data, buttonTrigger, 'trigger', true, data.label);
    // create an empty anchor div to place the dropdown, while the position can be defined via CSS
    const buttonDropdownAnchor = document.createElement('div');
    buttonDropdownAnchor.classList.add('atcb-dropdown-anchor');
    buttonTrigger.appendChild(buttonDropdownAnchor);
  }
  // update the placeholder class to prevent multiple initializations
  button.classList.remove('atcb');
  button.classList.add('atcb-initialized');
  // show the placeholder div
  if (data.inline) {
    button.style.display = 'inline-block';
  } else {
    button.style.display = 'block';
  }
  // console log
  console.log('Add to Calendar Button "' + data.identifier + '" created');
}

// generate the dropdown list (can also appear wihtin a modal, if option is set)
function atcb_generate_dropdown_list(data) {
  const optionsList = document.createElement('div');
  optionsList.classList.add('atcb-list');
  optionsList.classList.add('atcb-' + data.lightMode);
  if (data.rtl) {
    optionsList.classList.add('atcb-rtl');
  }
  optionsList.style.fontSize = data.size + 'px';
  // generate the list items
  let listCount = 0;
  data.options.forEach(function (option) {
    const optionItem = document.createElement('div');
    optionItem.classList.add('atcb-list-item');
    optionItem.tabIndex = 0;
    listCount++;
    optionItem.dataset.optionNumber = listCount;
    optionsList.appendChild(optionItem);
    // generate the label incl. individual eventListener
    atcb_generate_label(data, optionItem, option, true, data.optionLabels[listCount - 1]);
  });
  // in the modal case, we also render a close option
  if (data.listStyle === 'modal') {
    const optionItem = document.createElement('div');
    optionItem.classList.add('atcb-list-item', 'atcb-list-item-close');
    optionItem.tabIndex = 0;
    optionsList.appendChild(optionItem);
    atcb_generate_label(data, optionItem, 'close', true);
  }
  return optionsList;
}

// create the background overlay, which also acts as trigger to close any dropdowns
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
    // if trigger is not set to 'click', we render a close icon, when hovering over the background
    bgOverlay.classList.add('atcb-click');
  }
  return bgOverlay;
}

// FUNCTIONS TO CONTROL THE INTERACTION
function atcb_toggle(action, data = '', button = '', keyboardTrigger = false, generatedButton = false) {
  // check for state and adjust accordingly
  // action can be 'open', 'close', or 'auto'
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

// show the dropdown list + background overlay
function atcb_open(data, button, keyboardTrigger = false, generatedButton = false) {
  // abort early if an add to calendar dropdown or modal already opened
  if (document.querySelector('.atcb-list') || document.querySelector('.atcb-modal')) return;
  // generate list and prepare wrapper
  const list = atcb_generate_dropdown_list(data);
  const listWrapper = document.createElement('div');
  listWrapper.classList.add('atcb-list-wrapper');
  // set list styles, set button to atcb-active and force modal listStyle if no button is set
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
      list.classList.add('atcb-generated-button'); // if the button has been generated by the script, we add some more specifics
    }
  } else {
    list.classList.add('atcb-modal');
  }
  // define background overlay
  const bgOverlay = atcb_generate_bg_overlay(data.listStyle, data.trigger, data.lightMode, data.background);
  // render the items depending on the liststyle
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
    //document.body.appendChild(atcbL);
    atcbL.style.position = 'fixed';
    atcbL.style.bottom = '15px';
    atcbL.style.right = '30px';
    document.body.classList.add('atcb-modal-no-scroll');
  } else {
    atcbL.style.position = 'absolute';
    document.body.appendChild(listWrapper);
    listWrapper.appendChild(list);
    listWrapper.classList.add('atcb-style-' + data.buttonStyle);
    //document.body.appendChild(atcbL);
    document.body.appendChild(bgOverlay);
    if (data.listStyle === 'dropdown-static') {
      // in the dropdown-static case, we do not dynamically adjust whether we show the dropdown upwards
      atcb_position_list(button, listWrapper, true);
    } else {
      atcb_position_list(button, listWrapper);
    }
  }
  // set overlay size just to be sure
  atcb_set_fullsize(bgOverlay);
  // give keyboard focus to first item in list, if not blocked, because there is definitely no keyboard trigger
  if (keyboardTrigger) {
    list.firstChild.focus();
  } else {
    list.firstChild.focus({ preventScroll: true });
  }
  list.firstChild.blur();
}

function atcb_close(keyboardTrigger = false) {
  // focus triggering button if available - especially relevant for keyboard navigation
  const newFocusEl = document.querySelector('.atcb-active, .atcb-active-modal');
  if (newFocusEl) {
    newFocusEl.focus({ preventScroll: true });
    if (!keyboardTrigger) {
      newFocusEl.blur();
    }
  }
  // inactivate all buttons
  Array.from(document.querySelectorAll('.atcb-active')).forEach((button) => {
    button.classList.remove('atcb-active');
  });
  Array.from(document.querySelectorAll('.atcb-active-modal')).forEach((button) => {
    button.classList.remove('atcb-active-modal');
  });
  // make body scrollable again
  document.body.classList.remove('atcb-modal-no-scroll');
  // remove dropdowns, modals, and bg overlays (should only be one of each at max)
  Array.from(document.querySelectorAll('.atcb-list-wrapper'))
    .concat(Array.from(document.querySelectorAll('.atcb-list')))
    .concat(Array.from(document.querySelectorAll('.atcb-info-modal')))
    .concat(Array.from(document.querySelectorAll('#add-to-calendar-button-reference')))
    .concat(Array.from(document.querySelectorAll('#atcb-bgoverlay')))
    .forEach((el) => el.remove());
}

// prepare data when not using the init function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function atcb_action(data, triggerElement, keyboardTrigger = true) {
  atcbConsoleInit();
  data = atcb_secure_content(data);
  // decorate & validate data
  if (!atcb_check_required(data)) {
    throw new Error('Add to Calendar Button generation failed: required data missing; see console logs');
  }
  data = atcb_decorate_data(data);
  if (triggerElement) {
    data.identifier = triggerElement.id;
    // if listStyle some dropdown one, force overlay
    if (data.listStyle != 'modal') {
      data.listStyle = 'overlay';
    }
  } else {
    data.identifier = 'atcb-btn-custom';
    // if no button is defined, fallback to listStyle "modal" and "click" trigger
    data.listStyle = 'modal';
    data.trigger = 'click';
  }
  if (!atcb_validate(data)) {
    throw new Error(
      'Add to Calendar Button generation (' + data.identifier + ') failed: invalid data; see console logs'
    );
  }
  // if all is fine, open the options list
  atcb_toggle('open', data, triggerElement, keyboardTrigger);
}

// MIDDLEWARE FUNCTION TO GENERATE THE CALENDAR LINKS
function atcb_generate_links(type, data, subEvent = 'all') {
  if (subEvent != 'all') {
    subEvent = parseInt(subEvent) - 1;
  } else if (data.dates.length == 1) {
    subEvent = 0;
  }
  // TMP WORKAROUND: redirect to iCal solution on mobile devices for msteams, ms365, and outlookcom, since the Microsoft web apps are buggy on mobile devices (see https://github.com/add2cal/add-to-calendar-button/discussions/113)
  if (isMobile() && (type == 'msteams' || type == 'ms365' || type == 'outlookcom')) {
    type = 'ical';
  }  
  // in the Apple case, we also always simply generate an iCal file
  if (type == 'apple') {
    type = 'ical';
  }
  // for single-date events or if a specific subEvent is given, we can simply call the respective endpoints
  if (subEvent != 'all') {
    console.log('single '+ subEvent);
    switch (type) {
      case 'ical':
        atcb_generate_ical(data, subEvent);
        return;
      case 'google':
        atcb_generate_google(data.dates[`${subEvent}`]);
        return;
      case 'msteams':
        atcb_generate_msteams(data.dates[`${subEvent}`]);
        return;
      case 'ms365':
        atcb_generate_microsoft(data.dates[`${subEvent}`]);
        return;
      case 'outlookcom':
        atcb_generate_microsoft(data.dates[`${subEvent}`], 'outlook');
        return;
      case 'yahoo':
        atcb_generate_yahoo(data.dates[`${subEvent}`]);
        return;
    }
  }
  // in the multi-date event case, when all sub-events have no organizer AND are not cancelled, we can also go the short way
  if (type == 'ical' && data.dates.every(function (theSubEvent) {
      if (theSubEvent.status == 'CANCELLED' || (theSubEvent.organizer != null && theSubEvent.organizer != '')) {
        return false;
      }
      return true;
    })
  ) {
    atcb_generate_ical(data);
    return;
  }
  // for multi-date events in all other cases, we show an intermediate layer (except for clean iCal cases)
  const individualButtons = [];
  for (let i = 0; i < data.dates.length; i++) {
    individualButtons.push({
      'type': type,
      'label': atcb_translate_hook('Event', data.language, data) + ' ' + (i + 1),
      'subEvent': (i + 1)
    });
  }
  atcb_create_modal(
    data,
    type,
    atcb_translate_hook('MultiDate headline', data.language, data),
    atcb_translate_hook('MultiDate info', data.language, data),
    individualButtons
  );
}

// FUNCTION TO GENERATE THE GOOGLE URL
// See specs at: TODO
function atcb_generate_google(data) {
  const urlParts = [];
  urlParts.push('https://calendar.google.com/calendar/render?action=TEMPLATE');
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'clean', 'google');
  urlParts.push(
    'dates=' + encodeURIComponent(formattedDate.start) + '%2F' + encodeURIComponent(formattedDate.end)
  );
  // setting time zone if given and not GMT +/- something, since this is not supported by Google Calendar
  if (data.timeZone != null && data.timeZone != '' && !/GMT[+|-]\d{1,2}/i.test(data.timeZone)) {
    urlParts.push('ctz=' + data.timeZone);
  }
  // add details (if set)
  if (data.name != null && data.name != '') {
    urlParts.push('text=' + encodeURIComponent(data.name));
  }
  const tmpDataDescription = [];
  if (data.description != null && data.description != '') {
    tmpDataDescription.push(data.description);
  }
  if (data.location != null && data.location != '') {
    urlParts.push('location=' + encodeURIComponent(data.location));
    // TODO: Find a better solution for the next temporary workaround.
    if (isiOS()) {
      // workaround to cover a bug, where, when using Google Calendar on an iPhone, the location is not recognized. So, for the moment, we simply add it to the description.
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
  // We also push the UID. It has no real effect, but at least becomes part of the url that way
  urlParts.push('uid=' + encodeURIComponent(data.uid));
  const url = urlParts.join('&');
  if (atcb_secure_url(url)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(url, atcbDefaultTarget).focus();
  }
}

// FUNCTION TO GENERATE THE YAHOO URL
// See specs at: TODO
function atcb_generate_yahoo(data) {
  const urlParts = [];
  urlParts.push('https://calendar.yahoo.com/?v=60');
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'clean');
  urlParts.push(
    'st=' + encodeURIComponent(formattedDate.start) + '&et=' + encodeURIComponent(formattedDate.end)
  );
  if (formattedDate.allday) {
    urlParts.push('dur=allday');
  }
  // add details (if set)
  if (data.name != null && data.name != '') {
    urlParts.push('title=' + encodeURIComponent(data.name));
  }
  if (data.location != null && data.location != '') {
    urlParts.push('in_loc=' + encodeURIComponent(data.location));
  }
  if (data.descriptionHtmlFree != null && data.descriptionHtmlFree != '') {
    // using descriptionHtmlFree instead of description, since Yahoo does not support html tags in a stable way
    urlParts.push('desc=' + encodeURIComponent(data.descriptionHtmlFree));
  }
  // We also push the UID. It has no real effect, but at least becomes part of the url that way
  urlParts.push('uid=' + encodeURIComponent(data.uid));
  const url = urlParts.join('&');
  if (atcb_secure_url(url)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(url, atcbDefaultTarget).focus();
  }
}

// FUNCTION TO GENERATE THE MICROSOFT 365 OR OUTLOOK WEB URL
// See specs at: TODO
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
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'delimiters', 'microsoft');
  urlParts.push('startdt=' + encodeURIComponent(formattedDate.start));
  urlParts.push('enddt=' + encodeURIComponent(formattedDate.end));
  if (formattedDate.allday) {
    urlParts.push('allday=true');
  }
  // add details (if set)
  if (data.name != null && data.name != '') {
    urlParts.push('subject=' + encodeURIComponent(data.name));
  }
  if (data.location != null && data.location != '') {
    urlParts.push('location=' + encodeURIComponent(data.location));
  }
  if (data.description != null && data.description != '') {
    urlParts.push('body=' + encodeURIComponent(data.description.replace(/\n/g, '<br>')));
  }
  // We also push the UID. It has no real effect, but at least becomes part of the url that way
  urlParts.push('uid=' + encodeURIComponent(data.uid));
  const url = urlParts.join('&');
  if (atcb_secure_url(url)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(url, atcbDefaultTarget).focus();
  }
}

// FUNCTION TO GENERATE THE MICROSOFT TEAMS URL
// See specs at: https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/deep-links#deep-linking-to-the-scheduling-dialog
// Mind that this is still in development mode by Microsoft! Location, html tags and linebreaks in the description are not supported yet.
function atcb_generate_msteams(data) {
  const urlParts = [];
  const baseUrl = 'https://teams.microsoft.com/l/meeting/new?';
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'delimiters', 'microsoft');
  urlParts.push('startTime=' + encodeURIComponent(formattedDate.start));
  urlParts.push('endTime=' + encodeURIComponent(formattedDate.end));
  // add details (if set)
  if (data.name != null && data.name != '') {
    urlParts.push('subject=' + encodeURIComponent(data.name));
  }
  let locationString = '';
  if (data.location != null && data.location != '') {
    locationString = encodeURIComponent(data.location);
    urlParts.push('location=' + locationString);
    locationString += ' // '; // preparing the workaround putting the location into the description, since the native field is not supported yet
  }
  if (data.descriptionHtmlFree != null && data.descriptionHtmlFree != '') {
    // using descriptionHtmlFree instead of description, since Teams does not support html tags
    urlParts.push('content=' + locationString + encodeURIComponent(data.descriptionHtmlFree));
  }
  // We also push the UID. It has no real effect, but at least becomes part of the url that way
  urlParts.push('uid=' + encodeURIComponent(data.uid));
  const url = baseUrl + urlParts.join('&');
  if (atcb_secure_url(url)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(url, atcbDefaultTarget).focus();
  }
}

// FUNCTION TO GENERATE THE iCAL FILE (also for the Apple option)
// See specs at: https://www.rfc-editor.org/rfc/rfc5545.html
function atcb_generate_ical(data, subEvent = 'all') {
  if (subEvent != 'all') {
    subEvent = parseInt(subEvent) - 1;
  }
  // define the right filename
  let filename = 'event-to-save-in-my-calendar';
  if (data.iCalFileName != null && data.iCalFileName != '') {
    filename = data.iCalFileName;
  } else if (data.icsFile != null && data.icsFile != '') {
    const filenamePart = data.icsFile.split('/').pop().split('.')[0];
    if (filenamePart != '') {
      filename = filenamePart;
    }
  }
  // check for a given explicit file (not if iOS and WebView - will be catched further down)
  if (data.icsFile != null && data.icsFile != '' && (!isiOS() || !isWebView())) {
    atcb_save_file(data.icsFile, filename);
    return;
  }
  // otherwise, generate one on the fly
  const now = new Date();
  const ics_lines = ['BEGIN:VCALENDAR', 'VERSION:2.0'];
  ics_lines.push('PRODID:-// https://add-to-calendar-pro.com // button v' + atcbVersion + ' //EN');
  ics_lines.push('CALSCALE:GREGORIAN');
  // we set CANCEL, whenever the status says so
  // mind that in the multi-date case (where we create 1 ics file), it will always be PUBLISH
  if (subEvent == 'all') {
    ics_lines.push('METHOD:PUBLISH');
  } else {
    if (data.dates[`${subEvent}`].status == 'CANCELLED') {
      ics_lines.push('METHOD:CANCEL');
    } else {
      // for all other cases, we use REQUEST for organized/hosted events, ...
      if (data.dates[`${subEvent}`].organizer != null && data.dates[`${subEvent}`].organizer != '') {
        ics_lines.push('METHOD:REQUEST');
      } else {
        // and PUBLISH for events without a host
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
    // get the timezone addon string for dates and include time zone information, if set and if not allday (not necessary in that case)
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
    ics_lines.push('SUMMARY:' + data.dates[`${i}`].name.replace(/.{65}/g, '$&' + '\r\n ')); // making sure it does not exceed 75 characters per line
    if (data.dates[`${i}`].descriptionHtmlFree != null && data.dates[`${i}`].descriptionHtmlFree != '') {
      ics_lines.push(
        'DESCRIPTION:' + data.dates[`${i}`].descriptionHtmlFree.replace(/\n/g, '\\n').replace(/.{60}/g, '$&' + '\r\n ') // adjusting for intended line breaks + making sure it does not exceed 75 characters per line
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
    ics_lines.push('SEQUENCE:' + data.dates[`${i}`].sequence);
    ics_lines.push('STATUS:' + data.dates[`${i}`].status);
    ics_lines.push('CREATED:' + data.created);
    ics_lines.push('LAST-MODIFIED:' + data.updated);
    ics_lines.push('END:VEVENT');
  }
  ics_lines.push('END:VCALENDAR');
  const dataUrl = (function () {
    // if we got to this point with an explicitely given iCal file, we are on an iOS device within an in-app browser (WebView). In this case, we use this as dataUrl
    if (data.icsFile != null && data.icsFile != '') {
      return data.icsFile;
    }
    // otherwise, we generate it from the array
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics_lines.join('\r\n'));
  })();
  // in in-app browser cases (WebView), we offer a copy option, since the on-the-fly client side generation is usually not supported
  // for Android, we are more specific and only go for specific apps at the moment
  // for Chrome on iOS we basically do the same
  if ((isiOS() && isChrome()) || (isWebView() && (isiOS() || (isAndroid() && isProblematicWebView())))) {
    // putting the download url to the clipboard
    const tmpInput = document.createElement('input');
    document.body.appendChild(tmpInput);
    const editable = tmpInput.contentEditable;
    const readOnly = tmpInput.readOnly;
    tmpInput.value = dataUrl;
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
      // the next 2 lines are basically doing the same in different ways (just to be sure)
      navigator.clipboard.writeText(dataUrl);
      tmpInput.select();
    }
    tmpInput.contentEditable = editable;
    tmpInput.readOnly = readOnly;
    document.execCommand('copy');
    tmpInput.remove();
    // creating the modal
    if (isiOS() && isChrome()) {
      atcb_create_modal(
        data,
        'browser',
        atcb_translate_hook('Crios iCal headline', data.language, data),
        atcb_translate_hook('Crios iCal info', data.language, data) +
          '<br>' +
          atcb_translate_hook('WebView iCal solution 1', data.language, data) +
          '<br>' +
          atcb_translate_hook('Crios iCal solution 2', data.language, data)
      );
    } else {
      atcb_create_modal(
        data,
        'browser',
        atcb_translate_hook('WebView iCal headline', data.language, data),
        atcb_translate_hook('WebView iCal info', data.language, data) +
          '<br>' +
          atcb_translate_hook('WebView iCal solution 1', data.language, data) +
          '<br>' +
          atcb_translate_hook('WebView iCal solution 2', data.language, data)
      );
    }
  } else {
    atcb_save_file(dataUrl, filename);
  }
}

// SHARED FUNCTION TO SAVE A FILE
function atcb_save_file(file, filename) {
  try {
    const save = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save.rel = 'noopener';
    save.href = file;
    // not using default target here, since this needs to happen _self on iOS (abstracted to mobile in general) and _blank at Firefox (abstracted to other setups) due to potential cross-origin restrictions
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

// SHARED FUNCTION TO GENERATE A TIME STRING
function atcb_generate_time(data, style = 'delimiters', targetCal = 'general', addTimeZoneOffset = false) {
  const startDate = data.startDate.split('-');
  const endDate = data.endDate.split('-');
  if ((data.startTime != null && data.startTime != '') && (data.endTime != null && data.endTime != '')) {
    // for the input, we assume UTC per default
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
    // if no time zone is given and we need to add the offset to the datetime string, do so directly and return
    if ((data.timeZone == null || (data.timeZone != null && data.timeZone == '')) && addTimeZoneOffset) {
      return {
        start: newStartDate.toISOString().replace('.000Z', '+00:00'),
        end: newEndDate.toISOString().replace('.000Z', '+00:00'),
        duration: durationString,
        allday: false,
      };
    }
    // if a time zone is given, we adjust the diverse cases
    // (see https://tz.add-to-calendar-technology.com/api/zones.json for available TZ names)
    if (data.timeZone != null && data.timeZone != '') {
      if (targetCal == 'ical' || (targetCal == 'google' && !/GMT[+|-]\d{1,2}/i.test(data.timeZone))) {
        // in the iCal case, we simply return and cut off the Z. Same applies to Google, except for GMT +/- time zones, which are not supported there.
        // everything else will be done by injecting the VTIMEZONE block at the iCal function
        return {
          start: atcb_format_datetime(newStartDate, 'clean', true, true),
          end: atcb_format_datetime(newEndDate, 'clean', true, true),
          duration: durationString,
          allday: false,
        };
      }
      // we get the correct offset via the timeZones iCal Library
      const offsetStart = tzlib_get_offset(data.timeZone, data.startDate, data.startTime);
      const offsetEnd = tzlib_get_offset(data.timeZone, data.endDate, data.endTime);
      // if we need to add the offset to the datetime string, do so respectively
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
      // in other cases, we substract the offset from the dates
      // (substraction to reflect the fact that the user assumed his timezone and to convert to UTC; since calendars assume UTC and add offsets again)
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
    // return formatted data
    return {
      start: atcb_format_datetime(newStartDate, style),
      end: atcb_format_datetime(newEndDate, style),
      duration: durationString,
      allday: false,
    };
  } else {
    // would be an allday event then
    const newStartDate = new Date(Date.UTC(startDate[0], startDate[1] - 1, startDate[2]));
    const newEndDate = new Date(Date.UTC(endDate[0], endDate[1] - 1, endDate[2]));
    // increment the end day by 1 for Google Calendar, iCal and Outlook
    if (targetCal == 'google' || targetCal == 'microsoft' || targetCal == 'ical') {
      newEndDate.setDate(newEndDate.getDate() + 1);
    }
    // return formatted data
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

// SHARED FUNCTION TO SECURE DATA
function atcb_secure_content(data, isJSON = true) {
  // strip HTML tags (especially since stupid Safari adds stuff) - except for <br>
  const toClean = isJSON ? JSON.stringify(data) : data;
  const cleanedUp = toClean.replace(/(<(?!br)([^>]+)>)/gi, '');
  if (isJSON) {
    return JSON.parse(cleanedUp);
  } else {
    return cleanedUp;
  }
}

// SHARED FUNCTION TO SECURE URLS
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

// SHARED FUNCTION TO VALIDATE EMAIL ADDRESSES
function atcb_validEmail(email, mx = false) {
  // rough format check first
  if (!/^.{0,70}@.{1,30}\.[\w.]{2,9}$/.test(email)) {
    return false;
  }
  // testing for mx records second, if activated
  if (mx) {
    // TODO: call external service to validate email address
  }
  return true;
}

// SHARED FUNCTION TO REPLACE HTML PSEUDO ELEMENTS
function atcb_rewrite_html_elements(content, clear = false) {
  // standardize any line breaks
  content = content.replace(/<br\s*\/?>/gi, '\n');
  // remove any pseudo elements, if necessary
  if (clear) {
    content = content.replace(/\[(|\/)(url|br|hr|p|b|strong|u|i|em|li|ul|ol|h\d)\]|((\|.*)\[\/url\])/gi, '');
    // and build html for the rest
    // supporting: br, hr, p, strong, u, i, em, li, ul, ol, h (like h1, h2, h3, ...), url (= a)
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

// SHARED FUNCTION TO CREATE INFO MODALS
function atcb_create_modal(data, icon = '', headline, content, buttons) {
  // setting the stage
  const bgOverlay = atcb_generate_bg_overlay('modal', 'click', data.lightMode);
  const infoModalWrapper = document.createElement('div');
  infoModalWrapper.classList.add('atcb-modal', 'atcb-info-modal');
  infoModalWrapper.tabIndex = 0;
  bgOverlay.appendChild(infoModalWrapper);
  document.body.appendChild(bgOverlay);
  document.body.classList.add('atcb-modal-no-scroll');
  const parentButton = document.getElementById(data.identifier);
  if (parentButton != null) {
    parentButton.classList.add('atcb-active-modal');
  }
  const infoModal = document.createElement('div');
  infoModal.classList.add('atcb-modal-box');
  infoModal.classList.add('atcb-' + data.lightMode);
  if (data.rtl) {
    infoModal.classList.add('atcb-rtl');
  }
  infoModal.style.fontSize = data.size + 'px';
  infoModalWrapper.appendChild(infoModal);
  // set overlay size just to be sure
  atcb_set_fullsize(bgOverlay);
  // adding closing button
  const infoModalClose = document.createElement('div');
  infoModalClose.classList.add('atcb-modal-close');
  infoModalClose.innerHTML = atcbIcon.close;
  infoModal.appendChild(infoModalClose);
  infoModalClose.addEventListener(
    'click',
    atcb_debounce(() => atcb_close())
  );
  infoModalClose.addEventListener(
    'keyup',
    atcb_debounce_leading((event) => {
      if (event.key == 'Enter') {
        event.preventDefault();
        atcb_toggle('close', '', '', true);
      }
    })
  );
  if (buttons == null || buttons.length == 0) {
    infoModalClose.tabIndex = 0;
    infoModalClose.focus();
  }
  // adding headline (incl. icon)
  const infoModalHeadline = document.createElement('div');
  infoModalHeadline.classList.add('atcb-modal-headline');
  infoModal.appendChild(infoModalHeadline);
  if (icon != '') {
    const infoModalHeadlineIcon = document.createElement('span');
    infoModalHeadlineIcon.classList.add('atcb-modal-headline-icon');
    infoModalHeadlineIcon.innerHTML = atcbIcon[`${icon}`];
    infoModalHeadline.appendChild(infoModalHeadlineIcon);
  }
  let infoModalHeadlineText = document.createTextNode(headline);
  infoModalHeadline.appendChild(infoModalHeadlineText);
  // and text content
  const infoModalContent = document.createElement('div');
  infoModalContent.classList.add('atcb-modal-content');
  infoModalContent.innerHTML = content;
  infoModal.appendChild(infoModalContent);
  // and buttons (array of objects; attributes: href, type, subEvent, label, primary(boolean))
  if (buttons != null && buttons.length > 0) {
    const infoModalButtons = document.createElement('div');
    infoModalButtons.classList.add('atcb-modal-buttons');
    infoModal.appendChild(infoModalButtons);
    buttons.forEach((button, index) => {
      let infoModalButton;
      if (button.href != null && button.href != '') {
        infoModalButton = document.createElement('a');
        infoModalButton.setAttribute('target', atcbDefaultTarget);
        infoModalButton.setAttribute('href', button.href);
        infoModalButton.setAttribute('rel', 'noopener');
      } else {
        infoModalButton = document.createElement('button');
        infoModalButton.type = 'button';
      }
      infoModalButton.classList.add('atcb-modal-btn');
      if (button.primary) {
        infoModalButton.classList.add('atcb-modal-btn-primary');
      }
      if (button.label == null || button.label == '') {
        button.label = atcb_translate_hook('Click me', data.language, data);
      }
      infoModalButton.textContent = button.label;
      infoModalButtons.appendChild(infoModalButton);
      if (index == 0) {
        infoModalButton.focus();
      }
      switch (button.type) {
        default:
        case 'close':
          infoModalButton.addEventListener(
            'click',
            atcb_debounce(() => atcb_close())
          );
          infoModalButton.addEventListener(
            'keyup',
            atcb_debounce((event) => {
              if (event.key == 'Enter') {
                atcb_toggle('close', '', '', true);
              }
            })
          );
          break;
        case 'apple':
        case 'google':
        case 'ical':
        case 'msteams':
        case 'ms365':
        case 'outlookcom':
        case 'yahoo':
          if (button.subEvent != null && button.subEvent != '') {
            infoModalButton.addEventListener(
              'click',
              atcb_debounce(() => {
                atcb_generate_links(button.type, data, button.subEvent);
              })
            );
          }
          break;
      }
    });
  }
}

// SHARED FUNCTION TO CALCULATE THE POSITION OF THE DROPDOWN LIST
function atcb_position_list(trigger, list, blockUpwards = false, resize = false) {
  // check for position anchor
  let anchorSet = false;
  const originalTrigger = trigger;
  if (trigger.querySelector('.atcb-dropdown-anchor') !== null) {
    trigger = trigger.querySelector('.atcb-dropdown-anchor');
    anchorSet = true;
  }
  // calculate position
  let triggerDim = trigger.getBoundingClientRect();
  let listDim = list.getBoundingClientRect();
  const btnDim = originalTrigger.getBoundingClientRect();
  if (anchorSet === true && !list.classList.contains('atcb-dropoverlay')) {
    // in the regular case, we also check for the ideal direction
    // not in the !updateDirection case and not if there is not enough space above
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
    // read trigger dimensions again, since after adjusting the top value of the list, something might have changed (e.g. re-adjustment due to missing scrollbars at this point in time)
    triggerDim = trigger.getBoundingClientRect();
    if (list.classList.contains('atcb-style-round') || list.classList.contains('atcb-style-text')) {
      list.style.minWidth = triggerDim.width + 'px';
    } else {
      list.style.width = triggerDim.width + 'px';
    }
    // read list dimensions again, since we altered the width in the step before
    listDim = list.getBoundingClientRect();
    list.style.left = triggerDim.left - (listDim.width - triggerDim.width) / 2 + 'px';
  } else {
    // when there is no anchor set (only the case with custom implementations) or the listStyle is set respectively (overlay), we render the modal centered above the trigger
    // make sure the trigger is not moved over it via CSS in this case!
    let listWidth = triggerDim.width + 20 + 'px';
    list.style.minWidth = listWidth;
    // read list dimensions again, since we altered the width in the step before
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

// SHARED FUNCTION TO DEFINE WIDTH AND HEIGHT FOR "FULLSCREEN" FULLSIZE ELEMENTS
function atcb_set_fullsize(el) {
  el.style.width = window.innerWidth + 'px';
  el.style.height = window.innerHeight + 100 + 'px';
}

// SHARED FUNCTION TO GENERATE UUIDs
function atcb_generate_uuid() {
  //return crypto.randomUUID(); // lacking support of Safari < 15.4 and Firefox < 95, which is to important for now
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

// SHARED FUNCTION TO GENERATE THE INIT LOG MESSAGE
function atcb_init_log_msg() {
  if (!atcbConsoleInit) {
    console.log('Add to Calendar Button Script initialized (version ' + atcbVersion + ')');
    console.log('See https://github.com/add2cal/add-to-calendar-button for details');
    atcbConsoleInit = true;
  }
}

// SHARED DEBOUNCE AND THROTTLE FUNCTIONS
// going for last call debounce
function atcb_debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
// dropping subsequent calls debounce
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
// throttle
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

// GLOBAL KEYBOARD AND DEVICE LISTENERS
if (isBrowser()) {
  // global listener to ESC key to close dropdown
  document.addEventListener(
    'keyup',
    atcb_debounce_leading((event) => {
      if (event.key === 'Escape') {
        atcb_toggle('close', '', '', true);
      }
    })
  );
  // global listener to arrow key optionlist navigation
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
        if (
          document.querySelector('.atcb-list-wrapper.atcb-dropup') &&
          (event.key === 'ArrowDown' || event.key === 'ArrowUp')
        ) {
          document.querySelector('.atcb-list-item[data-option-number="' + optionListCount + '"]').focus();
        } else {
          document.querySelector('.atcb-list-item[data-option-number="1"]').focus();
        }
      }
    }
  });
  // Global listener to any screen changes
  window.addEventListener(
    'resize',
    atcb_throttle(() => {
      const activeOverlay = document.getElementById('atcb-bgoverlay');
      if (activeOverlay != null) {
        atcb_set_fullsize(activeOverlay);
      }
      const activeButton = document.querySelector('.atcb-active');
      const activeList = document.querySelector('.atcb-dropdown');
      if (activeButton != null && activeList != null) {
        atcb_position_list(activeButton, activeList, false, true);
      }
    })
  );
}

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
    'MultiDate info': 'Add the individual events one by one.',
    'Event': 'Event',
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
    'MultiDate info': 'Füge die einzelnen Termine der Reihe nach deinem Kalender hinzu.',
    'Event': 'Termin',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
      '<ol><li>افتح أي متصفح آخر على هاتفك الذكي, ...</li><li>الصق محتوى الحافظة واذهب.</li></ol>',
    'Crios iCal headline': 'افتح Safari',
    'Crios iCal info': 'لسوء الحظ ، يواجه Chrome على iOS مشاكل في طريقة إنشاء ملف التقويم.',
    'Crios iCal solution 2':
      '<ol><li><strong>افتح Safari</strong>, ...</li><li>الصق محتوى الحافظة واذهب.</li></ol>',
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
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
    'MultiDate headline': 'This is an event series',
    'MultiDate info': 'Add the individual parts one by one.',
    'Event': 'Event',
  },
};

// hook, which can be used to override all potential "hard" strings by setting customLabel_ + the key (without spaces) as option key and the intended string as value
function atcb_translate_hook(identifier, language, data) {
  const searchKey = identifier.replace(/\s+/g, '').toLowerCase();
  if (
    data.customLabels != null &&
    data.customLabels[`${searchKey}`] != null &&
    data.customLabels[`${searchKey}`] != ''
  ) {
    return atcb_rewrite_html_elements(data.customLabels[`${searchKey}`]);
  } else {
    return atcb_translate(identifier, language);
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

// START INIT
if (isBrowser()) {
  if (document.readyState !== 'loading') {
    // if the script is loaded after the page has been loaded, run the initilization
    atcb_init();
  } else {
    // otherwise, init the magic as soon as the DOM has been loaded
    document.addEventListener('DOMContentLoaded', atcb_init, false);
  }
}
// END INIT
