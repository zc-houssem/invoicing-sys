import { useTheme } from 'next-themes';

export const ApplyPDFTemplateEditorStyles = () => {
  const { theme } = useTheme();

  if (theme === 'light') return null;
  return (
    <>
      <style>
        {`
        .pdfme-designer-root,
        .pdfme-designer-background,
        .pdfme-designer-left-sidebar {
          background: var(--background) !important;
          border-right: 1px solid var(--border) !important;
        }

        .pdfme-designer-list-view,
        .pdfme-designer-detail-view {
          background: var(--background) !important;
        }

        label,
        .ant-form-item-control-input-content span,
        .ant-typography {
          color: var(--foreground) !important;
        }

        .ant-input,
        .ant-input-number-input,
        .ant-select-selector {
          background: var(--background) !important;
          border-color: var(--border) !important;
          color: var(--foreground) !important;
        }

        .ant-input::placeholder,
        .ant-input-number-input::placeholder {
          color: var(--foreground) !important;
          opacity: 0.5;
        }


        .ant-btn .ant-btn-icon {
          color: var(--foreground) !important;
          border-color: var(--border) !important;
        }

        .ant-btn {
          background: var(--background) !important;
          img {
            filter: invert(100%) sepia(100%) grayscale(100%);
          }

          div {
            color: var(--foreground) !important;
          }
            
          u {
            color: var(--foreground) !important;
          }
          svg {
                color: var(--foreground) !important;
          }
        }


        .ant-btn[disabled] .ant-btn-icon {
          color: var(--foreground) !important;
          opacity: 0.5;
        }

        .ant-select-item-option-content, .ant-select-item-option-state {
          color: var(--foreground) !important;
        }

        .ant-select-dropdown {
          background: var(--background) !important;
          color: var(--foreground) !important;
        }


        .ant-select-item {
          color: var(--foreground) !important;
        }

        .ant-select-item[aria-selected="true"] {
          background: var(--background) !important;
          color: var(--foreground) !important;
        }


        .ant-input-number-handler-wrap {
          background: var(--background) !important;
          border-color: var(--border) !important;
        }

        div[title="Text"] {
          svg {
            filter: invert(100%) sepia(100%) grayscale(100%);
          }
        }

        .rc-color-picker-panel {
          background: var(--background) !important;
        }
  `}
      </style>
    </>
  );
};
