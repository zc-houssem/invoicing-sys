export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const isValidUrl = (url: string): boolean => {
  const regex =
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g;
  return regex.test(url);
};
