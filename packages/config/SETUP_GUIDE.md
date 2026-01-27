# Tailwind CSS v4 Setup Guide

This guide shows you how to use the `@repo/config` Tailwind configuration in your Next.js apps.

## Quick Start

### 1. Add dependencies to your app's `package.json`

```json
{
  "dependencies": {
    "@repo/config": "workspace:*"
  },
  "devDependencies": {
    "tailwindcss": "^4.0.0"
  }
}
```

### 2. Import the configuration in your `globals.css`

Replace your existing CSS imports with:

```css
@import '@repo/config/tailwind.css';
```

That's it! You can now use all the custom colors in your components.

## Example Usage

### In your components:

```tsx
// app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Welcome to Friendsure</h1>

      {/* Primary Button */}
      <button className="bg-primary hover:bg-primary-60 text-white px-6 py-3 rounded-lg transition-colors">
        Primary Action
      </button>

      {/* Danger Button */}
      <button className="bg-danger hover:bg-danger-60 text-white px-6 py-3 rounded-lg transition-colors ml-4">
        Delete
      </button>

      {/* Warning Alert */}
      <div className="bg-warning-10 border-l-4 border-warning text-warning-100 p-4 mt-8">
        <p className="font-bold">Warning</p>
        <p>This is a warning message.</p>
      </div>

      {/* Card with gradient */}
      <div className="bg-gradient-to-r from-primary to-primary-60 text-white p-8 rounded-xl mt-8">
        <h2 className="text-2xl font-bold">Beautiful Card</h2>
        <p className="mt-2">With gradient background using custom colors</p>
      </div>
    </div>
  );
}
```

## Available Color Classes

### Text Colors

- `text-primary`, `text-primary-10` through `text-primary-100`
- `text-danger`, `text-danger-10` through `text-danger-100`
- `text-warning`, `text-warning-10` through `text-warning-100`

### Background Colors

- `bg-primary`, `bg-primary-10` through `bg-primary-100`
- `bg-danger`, `bg-danger-10` through `bg-danger-100`
- `bg-warning`, `bg-warning-10` through `bg-warning-100`

### Border Colors

- `border-primary`, `border-primary-10` through `border-primary-100`
- `border-danger`, `border-danger-10` through `border-danger-100`
- `border-warning`, `border-warning-10` through `border-warning-100`

### With Opacity

All colors support opacity modifiers:

- `bg-primary/50` - 50% opacity
- `text-danger/75` - 75% opacity
- `border-warning/25` - 25% opacity

## Color Reference

| Color   | Shade | Hex Code | Usage               |
| ------- | ----- | -------- | ------------------- |
| Primary | 100   | #001620  | Darkest blue        |
| Primary | 80    | #013751  | Dark blue           |
| Primary | 60    | #015B86  | Medium-dark blue    |
| Primary | 50    | #016DA1  | **Default primary** |
| Primary | 40    | #569EC0  | Medium-light blue   |
| Primary | 20    | #AACEE0  | Light blue          |
| Primary | 10    | #CCE2EC  | Lightest blue       |
| Danger  | 100   | #330100  | Darkest red         |
| Danger  | 80    | #7F0200  | Dark red            |
| Danger  | 60    | #D30300  | Medium-dark red     |
| Danger  | 50    | #FD0300  | **Default danger**  |
| Danger  | 40    | #FE5755  | Medium-light red    |
| Danger  | 20    | #FEABAA  | Light red           |
| Danger  | 10    | #FFCDCC  | Lightest red        |
| Warning | 100   | #312500  | Darkest yellow      |
| Warning | 80    | #7B5D21  | Dark yellow         |
| Warning | 60    | #CC9B36  | Medium-dark yellow  |
| Warning | 50    | #F7C661  | **Default warning** |
| Warning | 40    | #F8D180  | Medium-light yellow |
| Warning | 20    | #FCE8C0  | Light yellow        |
| Warning | 10    | #FDF1D9  | Lightest yellow     |
