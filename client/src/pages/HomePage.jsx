import React from 'react';
import { Hero } from '../components/home/Hero';
import { CategoryBrowse } from '../components/home/CategoryBrowse';
import { FeaturedDestinations } from '../components/home/FeaturedDestinations';
import { HiddenGemsSection } from '../components/home/HiddenGemsSection';
import { RecentlyAdded } from '../components/home/RecentlyAdded';

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <CategoryBrowse />
      <FeaturedDestinations />
      <HiddenGemsSection />
      <RecentlyAdded />
    </div>
  );
};
