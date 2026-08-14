export const identifyEnterpriseAvatar = (name?: string | null) => {
  if (!name?.trim()) {
    return '?';
  }

  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
  }

  const word = words[0];

  if (word.length >= 2) {
    return `${word.charAt(0)}${word.charAt(1)}`.toUpperCase();
  }

  return word.charAt(0).toUpperCase();
};
