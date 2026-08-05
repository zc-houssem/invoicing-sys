export const loadFonts = async () => {
  try {
    const [regular, bold, italic] = await Promise.all([
      fetch('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf').then((res) => res.arrayBuffer()),
      fetch('https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf').then((res) => res.arrayBuffer()),
      fetch('https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu52xP.ttf').then((res) => res.arrayBuffer()),
    ]);

    return {
      Roboto: {
        data: regular,
        fallback: true,
      },
      'Roboto-Bold': {
        data: bold,
      },
      'Roboto-Italic': {
        data: italic,
      }
    };
  } catch (err) {
    console.error('Failed to load fonts for PDFME', err);
    return undefined;
  }
};
