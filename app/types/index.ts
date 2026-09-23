export type Language = 'uz' | 'ru' | 'en';

export interface TranslationDict {
  [key: string]: string;
}

export interface Translations {
  uz: TranslationDict;
  ru: TranslationDict;
  en: TranslationDict;
}

export interface LocalizedText {
  uz: string;
  ru: string;
  en: string;
}

export interface ProductSpec {
  id: string;
  label: LocalizedText;
  value: string;
}

export interface Category {
  id: string;
  name: LocalizedText;
  order: number;
}

export interface Product {
  code: string;
  category: string;
  name: LocalizedText;
  tag: LocalizedText;
  description: LocalizedText;
  image: string;
  certificatePdf?: string;
  passportPdf?: string;
  specs: ProductSpec[];
  order: number;
}

export interface ModalContent {
  title: string;
  tag: string;
  image: string;
  desc: string;
}

export interface ModalDataItem {
  uz: ModalContent;
  ru: ModalContent;
  en: ModalContent;
}

export interface ModalData {
  [key: string]: ModalDataItem;
}

export interface Project {
  id: string;
  title: LocalizedText;
  location: LocalizedText;
  description: LocalizedText;
  year: string;
  images: string[];
  productCodes: string[];
  order: number;
}

export interface SiteSettings {
  phone: string;
  email: string;
  telegramUsername: string;
  aboutImage: string;
}

export interface InquiryPayload {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  message?: string;
  productCode?: string;
  locale?: string;
  website?: string; // honeypot
}
