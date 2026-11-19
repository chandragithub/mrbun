import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StoreSettings, StoreOffer, Outlet, Product } from '../types';
import { dbService, DEFAULT_STORE_SETTINGS } from '../services/db';

interface SettingsContextType {
  settings: StoreSettings;
  updateSettings: (partial: Partial<StoreSettings>) => Promise<StoreSettings>;
  products: Product[];
  saveProduct: (product: Product) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  offers: StoreOffer[];
  saveOffer: (offer: StoreOffer) => StoreOffer;
  deleteOffer: (id: string) => boolean;
  outlets: Outlet[];
  saveOutlet: (outlet: Outlet) => Promise<Outlet>;
  deleteOutlet: (id: string) => Promise<boolean>;
  refreshAll: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      return dbService.getSettings();
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<StoreOffer[]>([]);
  const [outlets, setOutlets] = useState<Outlet[]>([]);

  const loadData = useCallback(async () => {
    try {
      const s = dbService.getSettings();
      setSettings(s);

      const prods = await dbService.getProducts();
      setProducts(prods);

      const offs = dbService.getOffers();
      setOffers(offs);

      const outs = await dbService.getOutlets();
      setOutlets(outs);
    } catch (err) {
      console.error('Error loading store settings and data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Listen to custom reactive events for real-time cross-tab & in-app synchronization
    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent<StoreSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      }
    };

    const handleProductsChange = (e: Event) => {
      const customEvent = e as CustomEvent<Product[]>;
      if (customEvent.detail) {
        setProducts(customEvent.detail);
      }
    };

    const handleOffersChange = (e: Event) => {
      const customEvent = e as CustomEvent<StoreOffer[]>;
      if (customEvent.detail) {
        setOffers(customEvent.detail);
      }
    };

    const handleOutletsChange = (e: Event) => {
      const customEvent = e as CustomEvent<Outlet[]>;
      if (customEvent.detail) {
        setOutlets(customEvent.detail);
      }
    };

    window.addEventListener('mrbun-settings-changed', handleSettingsChange);
    window.addEventListener('mrbun-products-changed', handleProductsChange);
    window.addEventListener('mrbun-offers-changed', handleOffersChange);
    window.addEventListener('mrbun-outlets-changed', handleOutletsChange);

    return () => {
      window.removeEventListener('mrbun-settings-changed', handleSettingsChange);
      window.removeEventListener('mrbun-products-changed', handleProductsChange);
      window.removeEventListener('mrbun-offers-changed', handleOffersChange);
      window.removeEventListener('mrbun-outlets-changed', handleOutletsChange);
    };
  }, [loadData]);

  const updateSettings = async (partial: Partial<StoreSettings>): Promise<StoreSettings> => {
    const updated = dbService.updateSettings(partial);
    setSettings(updated);
    return updated;
  };

  const saveProduct = async (product: Product): Promise<Product> => {
    const saved = await dbService.saveProduct(product);
    const updatedProds = await dbService.getProducts();
    setProducts(updatedProds);
    return saved;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    const res = await dbService.deleteProduct(id);
    const updatedProds = await dbService.getProducts();
    setProducts(updatedProds);
    return res;
  };

  const saveOffer = (offer: StoreOffer): StoreOffer => {
    const saved = dbService.saveOffer(offer);
    setOffers(dbService.getOffers());
    return saved;
  };

  const deleteOffer = (id: string): boolean => {
    const res = dbService.deleteOffer(id);
    setOffers(dbService.getOffers());
    return res;
  };

  const saveOutlet = async (outlet: Outlet): Promise<Outlet> => {
    const saved = await dbService.saveOutlet(outlet);
    const updatedOutlets = await dbService.getOutlets();
    setOutlets(updatedOutlets);
    return saved;
  };

  const deleteOutlet = async (id: string): Promise<boolean> => {
    const res = await dbService.deleteOutlet(id);
    const updatedOutlets = await dbService.getOutlets();
    setOutlets(updatedOutlets);
    return res;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        products,
        saveProduct,
        deleteProduct,
        offers,
        saveOffer,
        deleteOffer,
        outlets,
        saveOutlet,
        deleteOutlet,
        refreshAll: loadData
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
