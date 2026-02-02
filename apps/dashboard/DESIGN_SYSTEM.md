# Design System Documentation

## 📋 Overview

This dashboard uses a **centralized design system** built with CSS variables and Tailwind CSS. All colors, spacing, typography, and effects are defined in `index.css` and can be changed globally by modifying a single file.

---

## 🎨 Current Theme: Electric Violet

The current theme uses **Electric Violet** as the primary color with a **Zinc** neutral base.

### Primary Color

- **HSL**: `262.1 83.3% 57.8%`
- **Hex**: `#7C3AED`
- **Usage**: Buttons, active states, focus rings, accents

### Neutral Base

- **Light Mode Background**: Zinc 50 (`0 0% 98%`)
- **Dark Mode Background**: Zinc 950 (`240 10% 3.9%`)

---

## 🔄 How to Change Themes

### Quick Theme Change (2 Steps)

1. **Open** `apps/dashboard/src/index.css`
2. **Replace** the `--primary` value in both `:root` and `.dark` sections

```css
:root {
  /* Change this line */
  --primary: 262.1 83.3% 57.8%; /* Electric Violet */
}

.dark {
  /* Change this line */
  --primary: 262.1 83.3% 57.8%; /* Electric Violet */
}
```

### Available Theme Presets

Copy and paste one of these values:

| Theme                         | HSL Value           | Hex       | Preview   |
| ----------------------------- | ------------------- | --------- | --------- |
| **Electric Violet** (Current) | `262.1 83.3% 57.8%` | `#7C3AED` | 🟣 Purple |
| **Deep Emerald**              | `160 84% 39%`       | `#10B981` | 🟢 Green  |
| **Modern Blue**               | `221.2 83.2% 53.3%` | `#3B82F6` | 🔵 Blue   |
| **Sunset Orange**             | `24 95% 53%`        | `#FF6B00` | 🟠 Orange |
| **Rose Pink**                 | `346 77% 50%`       | `#E11D48` | 🌹 Pink   |
| **Teal**                      | `173 80% 40%`       | `#14B8A6` | 🩵 Teal   |
| **Amber**                     | `38 92% 50%`        | `#F59E0B` | 🟡 Yellow |
| **Indigo**                    | `239 84% 67%`       | `#6366F1` | 💙 Indigo |

### Example: Changing to Deep Emerald

```css
:root {
  --primary: 160 84% 39%; /* Deep Emerald */
}

.dark {
  --primary: 160 84% 39%; /* Deep Emerald */
}
```

**That's it!** All components will automatically adapt to the new color.

---

## 🎯 Design System Architecture

### CSS Variables Structure

All design tokens are defined as CSS variables in `index.css`:

```css
:root {
  /* Primary Theme Color */
  --primary: 262.1 83.3% 57.8%;
  --primary-foreground: 0 0% 100%;

  /* Neutral Colors */
  --background: 0 0% 98%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;

  /* Semantic Colors */
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --destructive: 0 84.2% 60.2%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;

  /* UI Elements */
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 262.1 83.3% 57.8%;
  --radius: 0.75rem;
}
```

### Utility Classes

Pre-built utility classes for consistent styling:

#### Buttons

```tsx
<Button className="btn-primary">Primary Button</Button>
<Button className="btn-secondary">Secondary Button</Button>
<Button className="btn-ghost">Ghost Button</Button>
```

#### Inputs

```tsx
<input className="input-base" />
```

#### Badges

```tsx
<span className="badge-primary">Primary</span>
<span className="badge-success">Success</span>
<span className="badge-warning">Warning</span>
<span className="badge-destructive">Error</span>
```

#### Effects

```tsx
<div className="glass">Glass Effect</div>
<div className="glass-card">Glass Card</div>
<div className="hover-lift">Hover Lift</div>
<div className="card-hover">Card Hover</div>
```

#### Icons

```tsx
<div className="icon-container-primary">
  <Icon />
</div>
<div className="icon-container-muted">
  <Icon />
</div>
```

#### Animations

```tsx
<div className="animate-fade-in">Fade In</div>
<div className="animate-slide-in-right">Slide In</div>
<div className="animated-gradient">Animated Gradient</div>
```

#### Loading States

```tsx
<div className="spinner" />
<div className="skeleton h-4 w-full" />
```

---

## 📦 Component Refactoring

All presentation components have been refactored to use the centralized design system:

### Before (Hardcoded Colors)

```tsx
// ❌ Bad - Hardcoded colors
<div className="bg-zinc-950 text-white border-zinc-200">
  <p className="text-zinc-500">Muted text</p>
</div>
```

### After (Design System)

```tsx
// ✅ Good - Uses CSS variables
<div className="bg-foreground text-background border-border">
  <p className="text-muted-foreground">Muted text</p>
</div>
```

### Refactored Components

1. **LoginForm** (`features/auth/presentation/LoginForm.tsx`)
   - Replaced hardcoded `zinc-*` colors with `bg-foreground`, `text-muted-foreground`
   - Uses `input-base`, `btn-primary`, `spinner` utility classes
   - Uses `radial-blur` for decorative backgrounds

2. **UserList** (`features/users/presentation/UserList.tsx`)
   - Replaced hardcoded colors with `text-muted-foreground`, `text-destructive`
   - Uses `hover-lift`, `card-hover`, `icon-container-primary`, `badge-secondary`

3. **CreateProductForm** (`features/product/presentation/CreateProductForm.tsx`)
   - Replaced hardcoded `gray-*` colors with `text-foreground`, `text-muted-foreground`
   - Uses `input-base`, `btn-primary` utility classes

---

## 🎨 Typography

### Font Family

**Inter** - Premium sans-serif font with excellent readability

```css
font-family:
  "Inter",
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

### Font Features

```css
font-feature-settings:
  "cv11",
  "ss01",
  "rlig" 1,
  "calt" 1;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### Heading Styles

All headings use:

- **Font Weight**: 700 (Bold)
- **Letter Spacing**: `-0.02em` (Tight)
- **Responsive sizing** with Tailwind breakpoints

```tsx
<h1>text-4xl md:text-5xl</h1>
<h2>text-3xl md:text-4xl</h2>
<h3>text-2xl md:text-3xl</h3>
```

---

## 🌓 Dark Mode Support

The design system includes complete dark mode support:

### Light Mode

- Background: `0 0% 98%` (Zinc 50)
- Foreground: `240 10% 3.9%` (Zinc 950)
- Cards: `0 0% 100%` (White)

### Dark Mode

- Background: `240 10% 3.9%` (Zinc 950)
- Foreground: `0 0% 98%` (Zinc 50)
- Cards: `240 10% 3.9%` (Zinc 950)

### Usage

```tsx
<div className="bg-background text-foreground">{/* Automatically adapts to light/dark mode */}</div>
```

---

## 🎯 Best Practices

### ✅ DO

1. **Use CSS variables** for all colors

   ```tsx
   <div className="bg-primary text-primary-foreground">
   ```

2. **Use utility classes** for common patterns

   ```tsx
   <Button className="btn-primary">
   ```

3. **Use semantic color names**
   ```tsx
   <p className="text-muted-foreground">
   <p className="text-destructive">
   ```

### ❌ DON'T

1. **Don't hardcode colors**

   ```tsx
   {/* ❌ Bad */}
   <div className="bg-zinc-950 text-white">
   ```

2. **Don't use arbitrary values for theme colors**

   ```tsx
   {/* ❌ Bad */}
   <div className="bg-[#7C3AED]">
   ```

3. **Don't duplicate styles**

   ```tsx
   {/* ❌ Bad */}
   <button className="h-12 px-6 bg-primary text-primary-foreground rounded-lg">

   {/* ✅ Good */}
   <button className="btn-primary">
   ```

---

## 🔧 Advanced Customization

### Custom Color Scheme

To create a completely custom theme:

1. **Choose your primary color** (use HSL format)
2. **Update `index.css`**:

```css
:root {
  /* Your custom primary color */
  --primary: 280 90% 60%; /* Custom Purple */

  /* Optionally customize other colors */
  --success: 150 80% 45%; /* Custom Green */
  --warning: 40 95% 55%; /* Custom Orange */
}
```

### Custom Utility Classes

Add your own utility classes in `index.css`:

```css
@layer components {
  .btn-custom {
    @apply h-14 px-8 bg-gradient-to-r from-primary to-primary/80 
           text-primary-foreground rounded-xl shadow-2xl 
           hover:shadow-primary/50 transition-all;
  }
}
```

---

## 📊 Color Palette Reference

### Semantic Colors (All Themes)

| Variable             | Light Mode | Dark Mode | Usage             |
| -------------------- | ---------- | --------- | ----------------- |
| `--background`       | Zinc 50    | Zinc 950  | Page background   |
| `--foreground`       | Zinc 950   | Zinc 50   | Primary text      |
| `--card`             | White      | Zinc 950  | Card backgrounds  |
| `--muted`            | Zinc 100   | Zinc 800  | Muted backgrounds |
| `--muted-foreground` | Zinc 500   | Zinc 400  | Secondary text    |
| `--border`           | Zinc 200   | Zinc 800  | Borders           |
| `--destructive`      | Red 500    | Red 600   | Error states      |
| `--success`          | Green 600  | Green 500 | Success states    |
| `--warning`          | Amber 500  | Amber 500 | Warning states    |

---

## 🚀 Quick Start Guide

### For New Components

1. **Use semantic color classes**:

   ```tsx
   <div className="bg-card text-card-foreground border-border">
   ```

2. **Use utility classes for common patterns**:

   ```tsx
   <Button className="btn-primary">
   <input className="input-base" />
   <span className="badge-success">
   ```

3. **Add hover effects**:
   ```tsx
   <Card className="hover-lift card-hover">
   ```

### For Theme Changes

1. Open `apps/dashboard/src/index.css`
2. Find the `--primary` variable
3. Replace with your chosen HSL value
4. Save and refresh - done! ✨

---

## 📝 Summary

### Key Benefits

✅ **Centralized** - All design tokens in one file  
✅ **Theme-agnostic** - Change colors globally in seconds  
✅ **Consistent** - Reusable utility classes  
✅ **Accessible** - WCAG AA compliant contrast ratios  
✅ **Dark mode ready** - Complete dark mode support  
✅ **Type-safe** - Works seamlessly with TypeScript  
✅ **Maintainable** - Easy to update and extend

### Files Modified

- ✅ `apps/dashboard/src/index.css` - Design system
- ✅ `features/auth/presentation/LoginForm.tsx` - Refactored
- ✅ `features/users/presentation/UserList.tsx` - Refactored
- ✅ `features/product/presentation/CreateProductForm.tsx` - Refactored

---

## 🎓 Next Steps

1. **Explore utility classes** in `index.css`
2. **Try different themes** by changing `--primary`
3. **Create custom utility classes** for your specific needs
4. **Extend the design system** with new semantic colors
5. **Share the design system** across your monorepo

---

**Need help?** Check the comments in `index.css` for detailed guidance on theme customization!
