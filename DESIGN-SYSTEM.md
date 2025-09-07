# HAPI FHIR Patient Manager - Design System Documentation

## Overview
This document outlines the design principles, components, and guidelines for the HAPI FHIR Patient Manager modern UI, following the design review workflow principles from Claude Code.

## Design Principles

### 1. Users First
- **Prioritize patient data clarity** - Information is presented in a clear, scannable format
- **Minimize cognitive load** - Forms are simple with clear labels and helpful hints
- **Efficient workflows** - Common tasks are accessible within 2 clicks

### 2. Visual Hierarchy
- **Clear typography scale** - Headers decrease in size systematically (3xl → 2xl → xl)
- **Strategic use of color** - Primary actions use blue gradient, status indicators use semantic colors
- **Consistent spacing** - 8-point grid system ensures visual rhythm

### 3. Performance & Speed
- **Fast transitions** - All animations complete within 300ms
- **Optimized loading states** - Skeleton screens and spinners provide immediate feedback
- **Debounced search** - Live search with 500ms delay to reduce server calls

## Color Palette

### Primary Colors
```css
--primary-500: #0ea5e9  /* Main brand color */
--primary-600: #0284c7  /* Hover states */
--primary-700: #0369a1  /* Active states */
```

### Semantic Colors
```css
--success-500: #22c55e  /* Success messages, connected status */
--warning-500: #f59e0b  /* Warnings */
--error-500: #ef4444    /* Errors, disconnected status */
```

### Neutral Colors
```css
--gray-50 to --gray-900  /* Text, backgrounds, borders */
```

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
```

### Type Scale
- **4xl (2.25rem)**: Page titles only
- **3xl (1.875rem)**: Main headings
- **2xl (1.5rem)**: Section headings
- **xl (1.25rem)**: Card headings
- **lg (1.125rem)**: Subheadings
- **base (1rem)**: Body text
- **sm (0.875rem)**: Helper text, labels
- **xs (0.75rem)**: Tiny text, badges

## Spacing System

8-point grid with consistent scale:
```css
--space-1: 0.25rem  /* 4px */
--space-2: 0.5rem   /* 8px */
--space-3: 0.75rem  /* 12px */
--space-4: 1rem     /* 16px */
--space-5: 1.25rem  /* 20px */
--space-6: 1.5rem   /* 24px */
--space-8: 2rem     /* 32px */
--space-10: 2.5rem  /* 40px */
--space-12: 3rem    /* 48px */
--space-16: 4rem    /* 64px */
```

## Components

### Cards
- White background with subtle shadow
- Rounded corners (radius-lg: 0.75rem)
- Hover effect: lift with increased shadow
- Border accent on hover for interactivity

### Forms
- **Input fields**: 2px border, focus ring with primary color
- **Labels**: Above inputs, smaller font size
- **Validation**: Real-time with clear error messages
- **Buttons**: Gradient background, ripple effect on click

### Status Indicators
- Connected/Disconnected badge with animated dot
- Success/Error/Warning messages with icons
- Auto-hide after 5 seconds

## Animations & Interactions

### Micro-interactions
- **Button hover**: Slight lift (translateY(-2px))
- **Card hover**: Shadow expansion
- **Form focus**: Blue ring appears
- **Loading states**: Spinning indicator

### Transition Timing
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

## Accessibility Features

### WCAG 2.1 AA Compliance
- **Color contrast**: All text meets minimum 4.5:1 ratio
- **Focus indicators**: Visible focus rings on all interactive elements
- **Screen reader support**: ARIA labels and live regions
- **Keyboard navigation**: Full keyboard support, '/' for quick search

### Semantic HTML
- Proper heading hierarchy (h1 → h2 → h3)
- Form labels associated with inputs
- ARIA roles for regions and status updates
- Skip-to-content link for keyboard users

## Responsive Design

### Breakpoints
- **Mobile**: < 480px (single column, compact spacing)
- **Tablet**: 480px - 768px (flexible grid)
- **Desktop**: > 768px (multi-column grid)

### Grid System
```css
grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
```

## Performance Optimizations

### CSS
- CSS variables for theming
- Minimal specificity
- GPU-accelerated animations (transform, opacity)

### JavaScript
- Debounced search input
- LocalStorage for recent patients
- Event delegation for dynamic content
- Lazy loading for patient lists

## Implementation Checklist

### Phase 1: Visual Design ✅
- [x] Color system implementation
- [x] Typography scale
- [x] Spacing system
- [x] Component styling

### Phase 2: Interactions ✅
- [x] Hover states
- [x] Focus states
- [x] Loading states
- [x] Animations

### Phase 3: Accessibility ✅
- [x] ARIA labels
- [x] Keyboard navigation
- [x] Screen reader testing
- [x] Focus management

### Phase 4: Responsiveness ✅
- [x] Mobile layout
- [x] Tablet layout
- [x] Desktop layout
- [x] Viewport testing

### Phase 5: Polish ✅
- [x] Error handling
- [x] Success feedback
- [x] Empty states
- [x] Loading indicators

## Usage Guidelines

### When to use this design system:
- Building healthcare-related interfaces
- Creating forms for patient data
- Designing dashboards with cards
- Implementing search functionality

### Best Practices:
1. Always use semantic HTML
2. Test on multiple devices
3. Ensure keyboard accessibility
4. Provide clear feedback for all actions
5. Keep animations subtle and purposeful

## Testing with Playwright MCP

The design has been tested using Playwright MCP across different viewports:
- Mobile (375x812)
- Tablet (768x1024)
- Desktop (1280x800)

Screenshots are available in `.playwright-mcp/` directory.

## Files Structure

```
hapi-fhir-app/public/
├── modern-index.html    # Enhanced HTML with accessibility
├── modern-styles.css    # Complete design system CSS
├── modern-app.js        # Enhanced JavaScript with interactions
├── index.html          # Original HTML
├── styles.css          # Original CSS
└── app.js             # Original JavaScript
```

## Future Enhancements

1. **Dark Mode**: CSS variables are prepared for dark theme
2. **Component Library**: Extract reusable components
3. **Animation Library**: Create consistent animation classes
4. **Form Validation**: Enhanced client-side validation
5. **PWA Features**: Offline support and installability

## Credits

Design principles inspired by:
- Stripe's design system
- Linear's interface patterns
- WCAG 2.1 accessibility guidelines
- Claude Code's design review workflow

---

*Last Updated: January 2025*