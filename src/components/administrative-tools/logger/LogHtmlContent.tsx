interface LogHtmlContentProps {
  html: string;
  className?: string;
}

export const LogHtmlContent = ({ html, className }: LogHtmlContentProps) => {
  if (!html) {
    return null;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
