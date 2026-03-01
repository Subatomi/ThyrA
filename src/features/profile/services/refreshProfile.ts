import { getProfile } from 'api/auth';
import { updateProfileCache, UserProfileCache } from './profileCache';

export async function refreshProfileFromServer(): Promise<UserProfileCache | null> {
  try {
    const profile: any = await getProfile();
    const email: string = profile?.email ?? '';
    let firstName: string = profile?.firstName ?? profile?.first_name ?? '';
    let lastName: string = profile?.lastName ?? profile?.last_name ?? '';

    if (!firstName && !lastName) {
      const full: string = profile?.name ?? profile?.full_name ?? '';
      if (typeof full === 'string' && full.trim()) {
        const parts = full.trim().split(/\s+/);
        firstName = parts[0] ?? '';
        lastName = parts.slice(1).join(' ') ?? '';
      }
    }

    const data: UserProfileCache = { firstName, lastName, email };
    await updateProfileCache(data);
    return data;
  } catch (e) {
    return null;
  }
}
