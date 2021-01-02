export const toTitleCase = (text: string): string => {
  return text
    .split(/\s+/)
    .map(([firstLetter, ...remaining]) => firstLetter.toUpperCase() + remaining.join(''))
    .join(' ');
};
