# Design System & UI/UX Guidelines

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Typography](#2-typography)
3. [Color System](#3-color-system)
4. [Spacing & Layout](#4-spacing--layout)
5. [Components](#5-components)
6. [Animation Guidelines](#6-animation-guidelines)
7. [Forms & Feedback](#7-forms--feedback)
8. [Responsive Design](#8-responsive-design)
9. [Accessibility Checklist](#9-accessibility-checklist)

---

## 1. Design Principles

### Product Type
- **Category**: Academic Publishing Platform / SaaS
- **Style**: Professional, clean, content-focused
- **Tone**: Formal, trustworthy, accessible

### Style Selection

| Do | Don't |
|----|-------|
| Clean, minimal design | Cluttered, busy layouts |
| Professional academic aesthetic | Playful, casual styles |
| Clear content hierarchy | Low contrast, hard-to-read text |
| Consistent spacing (8pt grid) | Random spacing values |
| Semantic color tokens | Hardcoded hex values per-component |

### Visual Hierarchy

```
Primary Text:    --foreground (slate-900)
Secondary Text:  --muted-foreground (slate-500)
Interactive:      --primary (brand color)
Surface:         --card, --background
```

---

## 2. Typography

### Font Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Display | 48px / 3rem | 700 | 1.2 |
| H1 | 36px / 2.25rem | 700 | 1.25 |
| H2 | 30px / 1.875rem | 600 | 1.3 |
| H3 | 24px / 1.5rem | 600 | 1.35 |
| H4 | 20px / 1.25rem | 600 | 1.4 |
| Body | 16px / 1rem | 400 | 1.5 |
| Small | 14px / 0.875rem | 400 | 1.5 |
| Caption | 12px / 0.75rem | 400 | 1.4 |

### Line Length
- **Mobile**: 35-60 characters per line
- **Desktop**: 60-75 characters per line
- **Max container width**: `max-w-screen-xl` (1280px)

### Font Selection

```css
/* Google Fonts - Inter for body, Merriweather for headings */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap');

body {
  font-family: 'Inter', system-ui, sans-serif;
}

h1, h2, h3 {
  font-family: 'Merriweather', serif;
}
```

---

## 3. Color System

### Semantic Color Tokens

```css
/* Light mode */
--background: oklch(100% 0 0);
--foreground: oklch(14.5% 0.025 264);

--primary: oklch(14.5% 0.025 264);
--primary-foreground: oklch(98% 0.01 264);

--secondary: oklch(96% 0.01 264);
--secondary-foreground: oklch(14.5% 0.025 264);

--muted: oklch(96% 0.01 264);
--muted-foreground: oklch(46% 0.02 264);

--accent: oklch(96% 0.01 264);
--accent-foreground: oklch(14.5% 0.025 264);

--destructive: oklch(53% 0.22 27);
--destructive-foreground: oklch(98% 0.01 264);

--card: oklch(100% 0 0);
--card-foreground: oklch(14.5% 0.025 264);

--border: oklch(91% 0.01 264);
--input: oklch(91% 0.01 264);
--ring: oklch(14.5% 0.025 264);
```

### Status Colors

| Status | Color | Usage |
|--------|-------|-------|
| Success | `emerald-500` | Published, accepted |
| Warning | `amber-500` | Revision requested |
| Error | `destructive` | Rejected, errors |
| Info | `blue-500` | Under review, pending |

### Contrast Requirements

- **Normal text**: 4.5:1 minimum (WCAG AA)
- **Large text (18pt+)**: 3:1 minimum
- **UI components**: 3:1 minimum
- **Enhanced (AAA)**: 7:1 for critical text

---

## 4. Spacing & Layout

### 8pt Grid System

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight gaps |
| `space-2` | 8px | Icon padding, compact elements |
| `space-3` | 12px | Form field gaps |
| `space-4` | 16px | Standard padding |
| `space-6` | 24px | Section gaps |
| `space-8` | 32px | Card padding |
| `space-12` | 48px | Large section spacing |

### Breakpoints

| Name | Min Width | Usage |
|------|----------|-------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Container Widths

```css
/* Use Tailwind max-w utilities */
--container-sm: max-w-screen-sm;   /* 640px - narrow content */
--container-md: max-w-screen-md;   /* 768px */
--container-lg: max-w-screen-lg;   /* 1024px - standard */
--container-xl: max-w-screen-xl;   /* 1280px - article pages */
--container-2xl: max-w-screen-2xl;  /* 1536px - dashboard */
```

---

## 5. Components

### Button Variants

```tsx
// Button with CVA (Class Variance Authority)
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
  }
)
```

### Card Component

```tsx
export function Card({ className, ref, ...props }) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  )
}
```

### Touch Targets

| Platform | Minimum Size | Our Implementation |
|---------|--------------|---------------------|
| iOS | 44x44pt | `min-h-[44px] min-w-[44px]` |
| Android | 48x48dp | `min-h-[48px] min-w-[48px]` |
| WCAG | 24x24px | `min-h-[24px]` |

---

## 6. Animation Guidelines

### Duration Scale

| Type | Duration | Usage |
|------|----------|-------|
| Micro-interactions | 150ms | Hover, focus, button press |
| State transitions | 200-300ms | Expand/collapse, toggle |
| Component entrance | 300-400ms | Modals, dropdowns |
| Page transitions | 400-500ms | Navigation, route changes |

### Easing

```css
/* Enter - ease out for natural deceleration */
transition-timing-function: cubic-bezier(0, 0, 0.2, 1);

/* Exit - ease in for natural acceleration */
transition-timing-function: cubic-bezier(0.4, 0, 1, 1);

/* Spring-like for interactive elements */
transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Animation Checklist

- [ ] Respect `prefers-reduced-motion`
- [ ] Exit animations faster than enter (60-70%)
- [ ] Stagger list items by 30-50ms
- [ ] Animate transform/opacity only (no layout changes)
- [ ] Never block user input during animation

---

## 7. Forms & Feedback

### Form Patterns

```tsx
// Accessible form field pattern
<div className="space-y-2">
  <label htmlFor="title" className="block text-sm font-medium">
    Paper Title
    <span className="text-destructive ml-1" aria-hidden="true">*</span>
    <span className="sr-only">(required)</span>
  </label>
  <input
    id="title"
    type="text"
    required
    aria-required="true"
    aria-invalid={!!errors.title}
    aria-describedby={errors.title ? "title-error" : undefined}
    className="w-full"
  />
  {errors.title && (
    <p id="title-error" className="text-sm text-destructive" role="alert">
      {errors.title}
    </p>
  )}
</div>
```

### Validation Strategy

| Timing | Method | User Experience |
|--------|--------|------------------|
| On submit | Show error summary + focus first field | Clear recovery path |
| On blur | Show field-level error | Progressive disclosure |
| On input | Optional helper text | Less intrusive |

### Feedback Patterns

| Feedback Type | Implementation | Duration |
|---------------|----------------|----------|
| Success toast | Green badge + checkmark | 3-5s auto-dismiss |
| Error toast | Red badge + alert icon | Until dismissed |
| Loading state | Skeleton or spinner | During async ops |
| Empty state | Illustration + message + CTA | Persistent |

---

## 8. Responsive Design

### Mobile-First Approach

```tsx
// Mobile-first: base styles are for smallest screens
// Then add progressively larger styles

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards that stack on mobile, 2-col on tablet, 3-col on desktop */}
</div>
```

### Content Hierarchy on Mobile

| Priority | Content | Strategy |
|----------|---------|----------|
| 1 | Navigation, main CTA | Fixed/sticky |
| 2 | Primary content | Above fold |
| 3 | Secondary info | Expandable/collapsible |
| 4 | Tertiary details | Hidden or footer |

### Viewport Configuration

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

**Never** disable zoom: `maximum-scale=1` is an anti-pattern.

---

## 9. Accessibility Checklist

### Visual Quality

- [ ] No emojis used as icons (use SVG from Lucide/Heroicons)
- [ ] All icons from consistent icon family
- [ ] Press states visible without layout shift
- [ ] Semantic color tokens used consistently

### Interaction

- [ ] All tappable elements provide pressed feedback
- [ ] Touch targets >= 44x44px
- [ ] Micro-interactions 150-300ms
- [ ] Disabled states visually clear
- [ ] Focus order matches visual order
- [ ] Keyboard navigation works throughout

### Color & Contrast

- [ ] Primary text >= 4.5:1 contrast
- [ ] Secondary text >= 3:1 contrast
- [ ] Both light and dark modes tested
- [ ] Color not only indicator of meaning

### Content

- [ ] Skip navigation link present
- [ ] All images have alt text
- [ ] Form fields have labels
- [ ] Error messages are descriptive
- [ ] Heading hierarchy maintained (h1 → h6)

### Motion

- [ ] `prefers-reduced-motion` respected
- [ ] No flashing content
- [ ] Animations optional for users

---

## Quick Reference

### Common Tailwind Patterns

| Pattern | Tailwind Class |
|---------|---------------|
| Card | `rounded-lg border bg-card shadow-sm p-6` |
| Input | `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm` |
| Button | `inline-flex items-center justify-center rounded-md text-sm font-medium` |
| Focus ring | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` |
| Skip link | `sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4` |

### Z-Index Scale

| Layer | Value | Usage |
|-------|-------|-------|
| Base | 0 | Normal content |
| Dropdown | 50 | Dropdown menus |
| Sticky | 100 | Sticky headers |
| Modal | 200 | Modals, dialogs |
| Toast | 300 | Notifications |
| Tooltip | 400 | Tooltips |

---

## Related Documentation

- [COMPONENT.md](./COMPONENT.md) - Component library
- [SPEC.md](./SPEC.md) - Technical specification
- [AGENTS.md](./AGENTS.md) - Development guidelines