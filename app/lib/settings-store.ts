import { SiteSettings } from '../types';
import { createJsonStore } from './json-store';
import { DEFAULT_SETTINGS } from './settings-defaults';

export { DEFAULT_SETTINGS };

const store = createJsonStore<SiteSettings>('settings', () => ({ ...DEFAULT_SETTINGS }));

export async function getSettings(): Promise<SiteSettings> {
  const data = await store.get();
  return { ...DEFAULT_SETTINGS, ...data };
}

export async function getSettingsFresh(): Promise<SiteSettings> {
  const data = await store.getFresh();
  return { ...DEFAULT_SETTINGS, ...data };
}

export async function saveSettings(settings: SiteSettings): Promise<SiteSettings> {
  const clean: SiteSettings = {
    phone: String(settings.phone || '').trim().slice(0, 40),
    email: String(settings.email || '').trim().slice(0, 120),
    telegramUsername: String(settings.telegramUsername || '').trim().replace(/^@/, '').replace(/^https?:\/\/t\.me\//, '').slice(0, 64),
    aboutImage: String(settings.aboutImage || '').trim(),
  };
  await store.save(clean);
  return clean;
}
