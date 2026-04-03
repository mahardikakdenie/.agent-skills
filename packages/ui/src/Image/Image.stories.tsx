import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Box } from '../Box';
import { Image } from './Image';
import { imageFitValues, imageRatioValues } from './Image.types';

function createSvgDataUri({
  fill,
  accent,
  secondary,
}: {
  fill: string;
  accent: string;
  secondary?: string;
}) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480" fill="none">
      <defs>
        <linearGradient id="panel" x1="80" y1="68" x2="560" y2="412" gradientUnits="userSpaceOnUse">
          <stop stop-color="${secondary ?? accent}" stop-opacity="0.24" />
          <stop offset="1" stop-color="${fill}" stop-opacity="0.12" />
        </linearGradient>
      </defs>
      <rect width="640" height="480" rx="36" fill="${fill}" />
      <rect x="52" y="52" width="536" height="376" rx="28" fill="url(#panel)" />
      <circle cx="178" cy="154" r="58" fill="${accent}" opacity="0.92" />
      <path d="M92 338L232 220L320 298L444 188L550 338H92Z" fill="${accent}" opacity="0.82" />
      <rect x="92" y="364" width="456" height="16" rx="8" fill="white" opacity="0.88" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const landscapeImage = createSvgDataUri({
  fill: '#0f766e',
  accent: '#14b8a6',
  secondary: '#99f6e4',
});

const wideLandscapeImage = createSvgDataUri({
  fill: '#0f766e',
  accent: '#2dd4bf',
  secondary: '#ccfbf1',
});

const meta = {
  title: 'Data Display/Image',
  component: Image,
  tags: ['autodocs'],
  args: {
    src: landscapeImage,
    alt: 'Shared media preview',
    ratio: 'auto',
    fit: 'cover',
    width: 320,
    height: 180,
    onClick: fn(),
  },
  argTypes: {
    src: {
      control: 'text',
    },
    alt: {
      control: 'text',
    },
    fallback: {
      control: 'text',
    },
    ratio: {
      control: 'select',
      options: imageRatioValues,
    },
    fit: {
      control: 'select',
      options: imageFitValues,
    },
    className: {
      control: 'text',
    },
    onClick: {
      action: 'clicked',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Generic shared image primitive with Box-authored wrapper markup, fallback handling, aspect-ratio presets, and object-fit normalization.',
      },
    },
  },
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Box className="w-80 rounded-2xl border border-border bg-card p-4">
      <Image
        {...args}
        ratio="video"
        width={undefined}
        height={undefined}
        className="w-full rounded-xl"
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Baseline loaded image shown in a clean card-like container with the shared video ratio.',
      },
    },
  },
};

export const Fallback: Story = {
  render: (args) => (
    <Box className="w-80 rounded-2xl border border-border bg-card p-4">
      <Image
        {...args}
        src=""
        alt="Partner logo unavailable"
        ratio="video"
        fit="contain"
        width={undefined}
        height={undefined}
        className="w-full rounded-xl"
        fallback="No image available"
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the shared fallback tile used when no image source is available.',
      },
    },
  },
};

export const AspectRatios: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-3">
      {(
        [
          {
            label: 'square',
            ratio: 'square',
            wrapperClassName: 'w-full',
            note: 'Balanced thumbnail and tile layouts.',
          },
          {
            label: 'landscape',
            ratio: 'video',
            wrapperClassName: 'w-full',
            note: 'Best for banners, cards, and article media.',
          },
          {
            label: 'portrait',
            ratio: 'portrait',
            wrapperClassName: 'mx-auto w-40',
            note: 'Narrower document and poster previews.',
          },
        ] as const
      ).map(({ ratio, wrapperClassName, note, label }) => (
        <Box
          key={label}
          className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-4"
        >
          <Box
            as="span"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            {label}
          </Box>
          <Box className={wrapperClassName}>
            <Image
              src={landscapeImage}
              alt={`${label} ratio preview`}
              ratio={ratio}
              className="w-full rounded-xl"
            />
          </Box>
          <Box as="span" className="text-sm text-muted-foreground">
            {note}
          </Box>
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Compares the shared square, video, and portrait ratio presets used to stabilize media frames.',
      },
    },
  },
};

export const FitModes: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-3">
      {imageFitValues.map((fit) => (
        <Box
          key={fit}
          className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-4"
        >
          <Box
            as="span"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            {fit}
          </Box>
          <Box className="flex min-h-56 items-center justify-center rounded-xl bg-muted p-4">
            <Image
              src={wideLandscapeImage}
              alt={`${fit} fit preview`}
              ratio="portrait"
              fit={fit}
              width={undefined}
              height={undefined}
              className="w-40 rounded-xl"
            />
          </Box>
          <Box as="span" className="text-sm text-muted-foreground">
            {fit === 'cover'
              ? 'Fills the frame and crops overflow.'
              : fit === 'contain'
                ? 'Keeps the full artwork visible inside the frame.'
                : 'Stretches to match the frame exactly.'}
          </Box>
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows how the shared fit prop normalizes cover, contain, and fill behavior across media frames.',
      },
    },
  },
};
