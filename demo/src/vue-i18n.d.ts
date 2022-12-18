/**
 * global type definitions
 */

//import { DefineLocaleMessage } from 'vue-i18n';
import en from '@/i18n/locales/en.json';
import enDatetimeFormats from '@/i18n/datetimeFormats/en.json';
import enNumberFormats from '@/i18n/numberFormats/en.json';

type MessageSchema = typeof en;
type DateTimeSchema = typeof enDatetimeFormats;
type NumberSchema = typeof enNumberFormats;

declare module 'vue-i18n' {
  // define the locale messages and datetime formats schemas
  export interface DefineLocaleMessage extends MessageSchema {}
  export interface DefineDateTimeFormat extends DateTimeSchema {}
  export interface NumberFormats extends NumberSchema {}
}
