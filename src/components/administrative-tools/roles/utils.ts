export const formatPermissionLabel = (label?: string) => {
  if (!label) return '';
  return label
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
