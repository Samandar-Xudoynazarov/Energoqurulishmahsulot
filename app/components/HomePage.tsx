"use client";

import { useState, useCallback } from 'react';
import { Language, Product, Category } from '../types';
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

export default function HomePage({ locale, initialProducts, initialCategories }: { locale: Language; initialProducts?: Product[]; initialCategories?: Category[] }) {
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
      <Hero t={t} />
      <About t={t} />
      <Team t={t} openModal={openModal} />
      <Products t={t} currentLang={currentLang} openModal={openModal} products={products} categories={categories} />
      <Process t={t} />
      <Certificates t={t} />
      <Projects t={t} />
      <WhyUs t={t} />
      <Clients t={t} />
      <Contact t={t} />
      <Footer t={t} />
      <Modal modalKey={modalKey} currentLang={currentLang} onClose={closeModal} products={products} />
    </>
  );
}
