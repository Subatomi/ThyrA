import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserProfileCache = {
  firstName: string;
  lastName: string;
  email: string;
};

const PROFILE_CACHE_KEY = 'ThyrA:profile:v1';

function isValidProfile(value: any): value is UserProfileCache {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.firstName === 'string' &&
    typeof value.lastName === 'string' &&
    typeof value.email === 'string'
  );
}

export async function getProfileCache(): Promise<UserProfileCache | null> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidProfile(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function setProfileCache(profile: UserProfileCache): Promise<void> {
  // if (__DEV__) console.log('[profileCache] set', profile);
  await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
}

export async function updateProfileCache(partial: Partial<UserProfileCache>): Promise<UserProfileCache | null> {
  const existing = await getProfileCache();
  const next = { ...(existing ?? { firstName: '', lastName: '', email: '' }), ...partial };
  // if (__DEV__) console.log('[profileCache] update', partial, '->', next);
  await setProfileCache(next);
  return next;
}

export async function clearProfileCache(): Promise<void> {
  await AsyncStorage.removeItem(PROFILE_CACHE_KEY);
}

// Utility: build a clean full name from parts, with optional fallback
export function formatFullName(firstName: string, lastName: string, fallbackEmail?: string): string {
  const f = (firstName || '').trim();
  const l = (lastName || '').trim();
  const name = `${f} ${l}`.trim().replace(/\s+/g, ' ');
  return name.length > 0 ? name : (fallbackEmail || '');
}

// Convenience: get a display name from cache (full name or email)
export async function getProfileDisplayName(): Promise<string | null> {
  const cached = await getProfileCache();
  if (!cached) return null;
  return formatFullName(cached.firstName, cached.lastName) || null;
}

// Selectors: get individual fields from cache
export async function getFirstName(): Promise<string> {
  const cached = await getProfileCache();
  return cached?.firstName ?? '';
}

export async function getLastName(): Promise<string> {
  const cached = await getProfileCache();
  return cached?.lastName ?? '';
}

export async function getEmail(): Promise<string> {
  const cached = await getProfileCache();
  return cached?.email ?? '';
}

// Field updaters: update a single field
export async function setFirstName(firstName: string): Promise<void> {
  await updateProfileCache({ firstName });
}

export async function setLastName(lastName: string): Promise<void> {
  await updateProfileCache({ lastName });
}

export async function setEmail(email: string): Promise<void> {
  await updateProfileCache({ email });
}
