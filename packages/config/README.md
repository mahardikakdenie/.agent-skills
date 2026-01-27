# @repo/config

Shared Tailwind CSS v4 configuration for the monorepo.

## Installation

This package is already set up in your monorepo. To use it in your apps or packages:

### 1. Install Tailwind CSS in your app

```bash
npm install -D tailwindcss@next
```

### 2. Import the shared configuration

In your app's main CSS file (e.g., `app/globals.css` or `styles/globals.css`):

```css
@import "@repo/config/tailwind.css";
```

## Available Colors

### Primary (Blue)

- `primary-10` - #CCE2EC
- `primary-20` - #AACEE0
- `primary-40` - #569EC0
- `primary-50` - #016DA1 (default)
- `primary-60` - #015B86
- `primary-80` - #013751
- `primary-100` - #001620

### Danger (Red)

- `danger-10` - #FFCDCC
- `danger-20` - #FEABAA
- `danger-40` - #FE5755
- `danger-50` - #FD0300 (default)
- `danger-60` - #D30300
- `danger-80` - #7F0200
- `danger-100` - #330100

### Warning (Yellow)

- `warning-10` - #FDF1D9
- `warning-20` - #FCE8C0
- `warning-40` - #F8D180
- `warning-50` - #F7C661 (default)
- `warning-60` - #CC9B36
- `warning-80` - #7B5D21
- `warning-100` - #312500

## Usage Examples

```tsx
// Using in components
<button className="bg-primary text-white">Primary Button</button>
<button className="bg-danger-50 text-white">Danger Button</button>
<div className="text-warning-80 border-warning">Warning Message</div>

// Using with hover states
<button className="bg-primary hover:bg-primary-60">Hover Effect</button>

// Using with opacity
<div className="bg-primary/50">Semi-transparent</div>
```

## Tailwind v4 Features

This configuration uses Tailwind CSS v4, which:

- Uses CSS-based configuration instead of JavaScript
- Leverages CSS variables with the `@theme` directive
- Provides better performance and smaller bundle sizes
- No need for `tailwind.config.js` or `tailwind.config.ts`
