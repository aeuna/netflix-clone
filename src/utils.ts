const NEXFLIX_LOGO_URL = 'https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4';

export function makeImagePath(id?: string, format?: string) {
  return id ? `https://image.tmdb.org/t/p/${format ? format : 'original'}/${id}` : NEXFLIX_LOGO_URL;
}
