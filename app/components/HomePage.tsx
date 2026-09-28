"use client";

import { useState, useCallback } from 'react';
import { Language, Product, Category, Project, SiteSettings, SiteContent } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Team from './Team';
import Products from './Products';
import Process from './Process';
import Certificates from './Certificates';
import Projects from './Projects';
import WhyUs from './WhyUs';
import Clients from './Clients';
import Contact from './Contact';
import Footer from './Footer';
import Modal from './Modal';
import FloatingContact from './FloatingContact';
import { DEFAULT_SETTINGS } from '../lib/settings-defaults';
import { defaultContent } from '../lib/content-defaults';

interface HomePageProps {
  locale: Language;
  initialProducts?: Product[];
  initialCategories?: Category[];
  projects?: Project[];
  settings?: SiteSettings;
  content?: SiteContent;
}

export default function HomePage({ locale, initialProducts, initialCategories, projects = [], settings = DEFAULT_SETTINGS, content = defaultContent() }: HomePageProps) {
  const { currentLang, setLanguage, t } = useLanguage(locale);
  const { products } = useProducts(initialProducts || []);
  const { categories } = useCategories(initialCategories || []);
  const [modalKey, setModalKey] = useState<string | null>(null);

  const openModal = useCallback((key: string) => {
    setModalKey(key);
  }, []);

  const closeModal = useCallback(() => {
    setModalKey(null);
  }, []);

  return (
    <>
      <Navbar currentLang={currentLang} setLanguage={setLanguage} t={t} />
      <Hero t={t} image={settings.heroImage} />
      <About t={t} image={settings.aboutImage} />
      <Team t={t} lang={currentLang} cards={content.team} />
      <Products t={t} currentLang={currentLang} openModal={openModal} products={products} categories={categories} />
      <Process t={t} lang={currentLang} steps={content.process} />
      <Certificates t={t} />
      <Projects t={t} currentLang={currentLang} projects={projects} products={products} />
      <WhyUs t={t} lang={currentLang} cards={content.why} />
      <Clients t={t} />
      <Contact t={t} locale={currentLang} settings={settings} />
      <Footer t={t} />
      <FloatingContact settings={settings} t={t} />
      <Modal modalKey={modalKey} currentLang={currentLang} onClose={closeModal} products={products} />
    </>
  );
}
