export const getSpeciesPlaceholder = (species: string): string => {
  const s = (species || '').toLowerCase();
  if (s.includes('dog')) return '/images/animals/dog-placeholder.jpg';
  if (s.includes('cat')) return '/images/animals/cat-placeholder.jpg';
  if (s.includes('bird')) return '/images/animals/bird-placeholder.jpg';
  if (s.includes('rabbit')) return '/images/animals/rabbit-placeholder.jpg';
  if (s.includes('goat')) return '/images/animals/goat-placeholder.jpg';
  if (s.includes('pig')) return '/images/animals/pig-placeholder.jpg';
  if (s.includes('horse')) return '/images/animals/horse-placeholder.jpg';
  if (s.includes('cow')) return '/images/animals/cow-placeholder.jpg';
  return '/images/animals/default-placeholder.jpg';
};
