import type { ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

function findInlineStyle(styles: any, prefix: string): string | undefined {
  const matchedStyle = styles.find((style: string) => style.startsWith(prefix));

  return matchedStyle || undefined;
}

const htmlExportOptions = {
  inlineStyles: {
    SUPERSCRIPT: {
      element: 'sup',
    },
    SUBSCRIPT: {
      element: 'sub',
    },
  },
  inlineStyleFn: (styles: any) => {
    const style: Record<string, string | number> = {};
    const color = findInlineStyle(styles, 'color-');
    const backgroundColor = findInlineStyle(styles, 'bgcolor-');
    const fontSize = findInlineStyle(styles, 'fontsize-');
    const fontFamily = findInlineStyle(styles, 'fontfamily-');

    if (color) {
      style.color = color.replace('color-', '');
    }

    if (backgroundColor) {
      style.backgroundColor = backgroundColor.replace('bgcolor-', '');
    }

    if (fontSize) {
      const value = fontSize.replace('fontsize-', '');
      style.fontSize = Number(value) || value;
    }

    if (fontFamily) {
      style.fontFamily = fontFamily.replace('fontfamily-', '');
    }

    if (!Object.keys(style).length) {
      return undefined;
    }

    return {
      element: 'span',
      style,
    };
  },
} as any;

export function renderEmailTemplateHtml(contentState: ContentState) {
  return stateToHTML(contentState, htmlExportOptions);
}
