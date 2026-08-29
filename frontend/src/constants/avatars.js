// --- GENDER-BASED DEFAULT VECTOR AVATARS ---
export const MALE_AVATAR_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2YxZjVmOSIvPjxwYXRoIGQ9Ik01MCAyMiBhIDE2IDE2IDAgMSAwIDAuMSAwIFoiIGZpbGw9IiM2NDc0OGIiLz48cGF0aCBkPSJNMjAgODQgYyAwIC0yNCAxNSAtMzQgMzAgLTM0IHMgMzAgMTAgMzAgMzQgWiIgZmlsbD0iIzY0NzQ4YiIvPjwvc3ZnPg==";
export const FEMALE_AVATAR_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2ZjZTdmMyIvPjxwYXRoIGQ9Ik01MCAyMiBhIDE2IDE2IDAgMSAwIDAuMSAwIFoiIGZpbGw9IiNlYzQ4OTkiLz48cGF0aCBkPSJNMjAgODQgYyAwIC0yNCAxNSAtMzQgMzAgLTM0IHMgMzAgMTAgMzAgMzQgWiIgZmlsbD0iI2VjNDg5OSIvPjwvc3ZnPg==";
export const NEUTRAL_AVATAR_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2UyZThmMCIvPjxwYXRoIGQ9Ik01MCAyMiBhIDE2IDE2IDAgMSAwIDAuMSAwIFoiIGZpbGw9IiM0NzU1NjkiLz48cGF0aCBkPSJNMjAgODQgYyAwIC0yNCAxNSAtMzQgMzAgLTM0IHMgMzAgMTAgMzAgMzQgWiIgZmlsbD0iIzQ3NTU2OSIvPjwvc3ZnPg==";

export function getDefaultAvatarByGender(gender = 'male', avatarUrl = '') {
  if (avatarUrl && avatarUrl.trim().length > 0 && !avatarUrl.includes('dicebear') && avatarUrl !== 'null' && avatarUrl !== 'undefined') {
    return avatarUrl;
  }
  const normalizedGender = (gender || 'male').toLowerCase();
  if (normalizedGender === 'female') return FEMALE_AVATAR_SVG;
  if (normalizedGender === 'other') return NEUTRAL_AVATAR_SVG;
  return MALE_AVATAR_SVG;
}
