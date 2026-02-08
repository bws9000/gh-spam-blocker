export const DEFAULT_SPAM_PHRASES = [
  "GIVE ME STARS TO MY REPOSITORIES"
];

export function isSpamBio(bio, phrases = DEFAULT_SPAM_PHRASES) {
  if (!bio) return false;

  const normalized = bio.toLowerCase();
  return phrases.some(phrase =>
    normalized.includes(phrase.toLowerCase())
  );
}