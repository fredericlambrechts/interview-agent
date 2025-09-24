# SuperSwift UI Style Guide

**Version**: 2.0  
**Date**: January 2025  
**Scope**: Complete Application Design System  
**Target Audience**: European MedTech Executives, Strategic Consulting Professionals

---

## Design Philosophy

SuperSwift's UI embodies **Executive Intelligence** - sophisticated, trustworthy design that conveys strategic expertise while maintaining accessibility and efficiency. The aesthetic should feel like premium strategic consulting software used by Fortune 500 companies.

### Core Design Principles
- **Executive Professional**: Appropriate for C-level boardroom presentations
- **European Sophistication**: Clean, minimal aesthetic respecting European design sensibilities  
- **Strategic Credibility**: Visual design that conveys €200K+ consulting value
- **Accessible Intelligence**: Sophisticated without being complex or intimidating
- **Mobile Executive**: Touch-optimized for busy executives on all devices

---

## Color System

SuperSwift uses OKLCH color space for consistent, perceptually uniform color management across all platforms. The design system includes comprehensive dark mode support with executive-level sophistication.

### Brand Colors
```css
:root {
  /* Primary Brand Identity */
  --primary: oklch(0.2050 0 0);           /* #1a1a1a - Deep Professional Black */
  --primary-foreground: oklch(0.9850 0 0); /* #fafafa - Crisp White */
  
  /* Strategic Accent */
  --accent: oklch(0.6489 0.2370 26.9728); /* #cd9834 - Sophisticated Gold */
  --accent-foreground: oklch(1.0000 0 0);  /* #ffffff - Pure White */
  
  /* Trust & Intelligence */
  --trust: oklch(0.5800 0.1200 240.0000); /* #4a6fa5 - Professional Blue */
  --trust-foreground: oklch(1.0000 0 0);   /* #ffffff - Pure White */
}
```

### Neutral Palette
```css
:root {
  /* Background System */
  --background: oklch(1.0000 0 0);        /* #ffffff - Pure White */
  --background-muted: oklch(0.9700 0 0);  /* #f8f9fa - Sophisticated Light Gray */
  --background-accent: oklch(0.9850 0 0); /* #fafafa - Subtle Accent Background */
  
  /* Foreground System */
  --foreground: oklch(0.1450 0 0);        /* #1f2937 - Near Black */
  --foreground-muted: oklch(0.5560 0 0);  /* #6b7280 - Medium Gray */
  --foreground-subtle: oklch(0.7080 0 0); /* #9ca3af - Light Gray */
  
  /* Border System */
  --border: oklch(0.9220 0 0);            /* #e5e7eb - Light Border */
  --border-muted: oklch(0.9400 0 0);      /* #f3f4f6 - Subtle Border */
  --border-accent: oklch(0.8500 0 0);     /* #d1d5db - Emphasized Border */
}
```

### Semantic Colors
```css
:root {
  /* Status Indicators */
  --success: oklch(0.6800 0.1500 160.0000);  /* #7aa068 - Refined Green */
  --success-foreground: oklch(1.0000 0 0);   /* #ffffff - White */
  --success-background: oklch(0.9800 0.1000 142.4953); /* Light Green BG */
  
  --warning: oklch(0.8100 0.2500 85.0000);   /* #f59e0b - Executive Amber */
  --warning-foreground: oklch(0.1450 0 0);   /* #1f2937 - Dark */
  --warning-background: oklch(0.9800 0.1000 85.0000); /* Light Amber BG */
  
  --destructive: oklch(0.5770 0.2450 27.3250); /* #dc2626 - Professional Red */
  --destructive-foreground: oklch(1.0000 0 0); /* #ffffff - White */
  --destructive-background: oklch(0.9800 0.1000 27.3250); /* Light Red BG */
  
  --info: oklch(0.6200 0.1900 260.0000);     /* #3b82f6 - Intelligence Blue */
  --info-foreground: oklch(1.0000 0 0);      /* #ffffff - White */
  --info-background: oklch(0.9800 0.1000 260.0000); /* Light Blue BG */
}
```

### Assessment-Specific Colors
```css
:root {
  /* Assessment Phase Colors */
  --phase-input: oklch(0.6489 0.2370 26.9728);     /* Gold - Input Phase */
  --phase-validation: oklch(0.5635 0.2408 260.8178); /* Blue - Validation Phase */
  --phase-complete: oklch(0.7323 0.2492 142.4953);   /* Green - Complete Phase */
  --phase-pending: oklch(0.7080 0 0);               /* Gray - Pending Phase */
  
  /* Progress Gradients */
  --progress-gradient: linear-gradient(90deg, oklch(0.6489 0.2370 26.9728), oklch(0.5635 0.2408 260.8178));
  --validation-gradient: linear-gradient(135deg, oklch(0.9850 0.1000 260.0000) 0%, oklch(1.0000 0 0) 100%);
}
```

### Color Usage Guidelines
- **Primary (Black)**: Main text, primary actions, professional emphasis, brand identity
- **Accent (Gold)**: Strategic highlights, premium features, success states, calls-to-action
- **Trust (Blue)**: AI-generated content, intelligence indicators, validation states
- **Success (Green)**: Completion states, positive outcomes, achievements
- **Warning (Amber)**: Caution states, important information, pending actions
- **Destructive (Red)**: Error states, deletion actions, critical warnings

---

## Dark Mode System

### Executive Dark Mode
SuperSwift's dark mode maintains the sophisticated, executive-level aesthetic while providing comfortable viewing in low-light environments. The dark theme preserves the professional branding while enhancing accessibility.

#### Dark Mode Principles
- **Executive Elegance**: Maintains professional sophistication in dark environments
- **Enhanced Contrast**: Improves readability and reduces eye strain
- **Preserved Branding**: Gold accent color remains prominent and recognizable
- **Strategic Intelligence**: Enhanced Trust and Success colors for better visibility

### Dark Mode Color Tokens
```css
.dark {
  /* Core Brand Colors - Dark Mode */
  --executive-primary: oklch(0.9850 0 0);       /* Clean White */
  --executive-primary-foreground: oklch(0.1450 0 0); /* Dark Text */
  --executive-secondary: oklch(0.2400 0 0);     /* Dark Secondary */
  --executive-secondary-foreground: oklch(0.9850 0 0); /* Light Text */
  
  /* Strategic Colors - Enhanced for Dark Mode */
  --executive-accent: oklch(0.6489 0.2370 26.9728);   /* Sophisticated Gold (unchanged) */
  --executive-accent-foreground: oklch(0.1450 0 0);   /* Dark text on gold */
  --executive-trust: oklch(0.6500 0.1400 240.0000);   /* Enhanced Professional Blue */
  --executive-trust-foreground: oklch(0.1450 0 0);    /* Dark text on blue */
  
  /* Background System - Dark Mode */
  --executive-background: oklch(0.1200 0 0);     /* Rich Dark Background */
  --executive-foreground: oklch(0.9850 0 0);     /* Clean White Text */
  --executive-muted: oklch(0.2200 0 0);          /* Dark Muted Background */
  --executive-muted-foreground: oklch(0.6500 0 0); /* Medium Gray Text */
  --executive-border: oklch(0.3000 0 0);         /* Dark Border */
  
  /* Semantic Colors - Dark Mode Enhanced */
  --executive-success: oklch(0.7200 0.1600 160.0000);  /* Enhanced Green */
  --executive-warning: oklch(0.8300 0.2600 85.0000);   /* Enhanced Amber */
  --executive-destructive: oklch(0.6200 0.2600 27.3250); /* Enhanced Red */
  --executive-info: oklch(0.6800 0.2000 260.0000);     /* Enhanced Info Blue */
}
```

### Dark Mode Implementation
```css
/* Automatic Dark Mode Detection */
@media (prefers-color-scheme: dark) {
  :root {
    /* Apply dark mode colors automatically */
  }
}

/* Manual Dark Mode Toggle */
.dark {
  /* Dark mode colors applied via class */
}
```

```javascript
// JavaScript 3-Mode Theme System
function applyTheme(theme) {
  document.documentElement.classList.remove('dark');
  
  if (theme === 'system') {
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemPreference) {
      document.documentElement.classList.add('dark');
    }
  } else if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
  
  localStorage.setItem('theme', theme);
}

// Initialize theme (system, light, dark)
const savedTheme = localStorage.getItem('theme') || 'system';
applyTheme(savedTheme);

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'system') {
    applyTheme('system');
  }
});
```

### 3-Mode Theme System
SuperSwift implements a comprehensive 3-mode theme system:

1. **System Mode (Default)**: Automatically follows user's OS preference
2. **Light Mode**: Manually selected light theme  
3. **Dark Mode**: Manually selected dark theme

### Theme Toggle Implementation
The theme toggle appears as three buttons in the header:
- 🖥️ **System**: Follows OS preference (default)
- ☀️ **Light**: Forces light mode
- 🌙 **Dark**: Forces dark mode

### Dark Mode Usage Guidelines
- **Backgrounds**: Use rich dark tones (oklch 0.12) for main backgrounds
- **Text**: Ensure high contrast with clean white (oklch 0.985) for primary text
- **Borders**: Use subtle dark borders (oklch 0.30) for element definition
- **Accent Colors**: Gold accent remains unchanged to preserve brand recognition
- **Interactive Elements**: Enhanced Trust and Success colors improve visibility
- **System Integration**: Automatically adapts when user changes OS preference
- **Persistence**: Theme choice saved in localStorage across sessions
- **Testing**: Verify all text meets WCAG AA contrast requirements in both modes

---

## Typography System

### Font Families
```css
:root {
  /* Primary: Executive Sans-Serif */
  --font-sans: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 
               'Segoe UI', Roboto, sans-serif;
  
  /* Secondary: Professional Serif */
  --font-serif: 'Merriweather', Georgia, 'Times New Roman', serif;
  
  /* Code/Data: Executive Monospace */
  --font-mono: 'JetBrains Mono', 'SF Mono', Consolas, 'Liberation Mono', monospace;
  
  /* Strategic Accent: Sophisticated Display */
  --font-display: 'Outfit', 'Inter', sans-serif;
}
```

### Type Scale
```css
:root {
  /* Executive Typography Scale */
  --text-xs: 0.75rem;    /* 12px - Fine Print, Captions */
  --text-sm: 0.875rem;   /* 14px - Secondary Text, Labels */
  --text-base: 1rem;     /* 16px - Body Text, Default */
  --text-lg: 1.125rem;   /* 18px - Emphasized Text */
  --text-xl: 1.25rem;    /* 20px - Small Headings */
  --text-2xl: 1.5rem;    /* 24px - Section Headings */
  --text-3xl: 1.875rem;  /* 30px - Page Headings */
  --text-4xl: 2.25rem;   /* 36px - Strategic Titles */
  --text-5xl: 3rem;      /* 48px - Hero Titles */
}
```

### Font Weights
```css
:root {
  --font-thin: 300;      /* Elegant, Sophisticated */
  --font-normal: 400;    /* Standard Body Text */
  --font-medium: 500;    /* Emphasized Content */
  --font-semibold: 600;  /* Section Headers */
  --font-bold: 700;      /* Strategic Emphasis */
}
```

### Typography Usage Guidelines
- **Display Font (Outfit)**: Strategic titles, hero sections, brand emphasis
- **Sans-Serif (Inter)**: Body text, UI elements, assessment content, navigation
- **Serif (Merriweather)**: Executive communications, formal documents, quotes
- **Monospace (JetBrains Mono)**: Data, metrics, technical information, code

---

## Spacing & Layout System

### Spacing Scale
```css
:root {
  /* Executive Spacing Scale */
  --space-0: 0;           /* 0px - No spacing */
  --space-1: 0.25rem;     /* 4px - Micro spacing */
  --space-2: 0.5rem;      /* 8px - Small spacing */
  --space-3: 0.75rem;     /* 12px - Compact spacing */
  --space-4: 1rem;        /* 16px - Standard spacing */
  --space-5: 1.25rem;     /* 20px - Comfortable spacing */
  --space-6: 1.5rem;      /* 24px - Section spacing */
  --space-8: 2rem;        /* 32px - Component spacing */
  --space-10: 2.5rem;     /* 40px - Layout spacing */
  --space-12: 3rem;       /* 48px - Major spacing */
  --space-16: 4rem;       /* 64px - Hero spacing */
  --space-20: 5rem;       /* 80px - Strategic spacing */
}
```

### Container System
```css
.container-sm { max-width: 640px; margin: 0 auto; }   /* Small content */
.container-md { max-width: 768px; margin: 0 auto; }   /* Medium content */
.container-lg { max-width: 1024px; margin: 0 auto; }  /* Large content */
.container-xl { max-width: 1280px; margin: 0 auto; }  /* Extra large */
.container-executive { max-width: 1200px; margin: 0 auto; } /* Executive standard */
```

---

## Border Radius & Shadows

### Border Radius System
```css
:root {
  --radius-none: 0;
  --radius-sm: 0.375rem;  /* 6px - Small elements */
  --radius: 0.5rem;       /* 8px - Standard elements */
  --radius-md: 0.75rem;   /* 12px - Cards, containers */
  --radius-lg: 1rem;      /* 16px - Major components */
  --radius-xl: 1.5rem;    /* 24px - Hero elements */
  --radius-full: 9999px;  /* Full radius for pills */
}
```

### Shadow System
```css
:root {
  /* Professional Shadow Scale */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  /* Interactive Shadows */
  --shadow-focus: 0 0 0 3px oklch(0.6489 0.2370 26.9728 / 0.3);
  --shadow-glow: 0 0 20px oklch(0.5635 0.2408 260.8178 / 0.15);
}
```

---

## Generic Components

### Navigation Components

#### Header Navigation
```css
.header-nav {
  background: var(--background);
  border-bottom: 1px solid var(--border);
  padding: var(--space-4) var(--space-6);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-nav__brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-display);
  font-weight: var(--font-semibold);
  font-size: var(--text-xl);
  color: var(--foreground);
}

.header-nav__logo {
  width: 2rem;
  height: 2rem;
  background: var(--accent);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### Sidebar Navigation
```css
.sidebar-nav {
  width: 16rem;
  background: var(--background-muted);
  border-right: 1px solid var(--border);
  padding: var(--space-6);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 40;
}

.sidebar-nav__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  color: var(--foreground-muted);
  text-decoration: none;
  transition: all 150ms ease-in-out;
  min-height: 44px;
}

.sidebar-nav__item:hover {
  background: var(--background);
  color: var(--foreground);
}

.sidebar-nav__item--active {
  background: var(--accent);
  color: var(--accent-foreground);
}
```

### Button Components

#### Primary Button (Strategic Actions)
```css
.btn-primary {
  background: var(--primary);
  color: var(--primary-foreground);
  font-weight: var(--font-semibold);
  padding: 0.75rem 2rem;
  border-radius: var(--radius);
  border: none;
  font-size: var(--text-base);
  line-height: 1.5;
  cursor: pointer;
  transition: all 150ms ease-in-out;
  min-height: 44px;
  min-width: 120px;
}

.btn-primary:hover {
  background: oklch(0.1500 0 0);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:focus {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

#### Secondary Button (Supporting Actions)
```css
.btn-secondary {
  background: var(--background);
  color: var(--foreground);
  font-weight: var(--font-medium);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all 150ms ease-in-out;
  min-height: 44px;
  min-width: 100px;
}

.btn-secondary:hover {
  background: var(--background-muted);
  border-color: var(--primary);
}
```

#### Accent Button (Strategic CTAs)
```css
.btn-accent {
  background: var(--accent);
  color: var(--accent-foreground);
  font-weight: var(--font-semibold);
  padding: 0.75rem 2rem;
  border-radius: var(--radius);
  border: none;
  font-size: var(--text-base);
  cursor: pointer;
  transition: all 150ms ease-in-out;
  min-height: 44px;
  min-width: 140px;
}

.btn-accent:hover {
  background: oklch(0.6000 0.2370 26.9728);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
```

### Form Components

#### Input Fields
```css
.input-field {
  font-size: 16px;
  line-height: 1.5;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--background);
  color: var(--foreground);
  transition: all 150ms ease-in-out;
  min-height: 44px;
  width: 100%;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: var(--shadow-focus);
  transform: scale(1.01);
}

.input-field::placeholder {
  color: var(--foreground-muted);
  font-style: italic;
}
```

#### Select Fields
```css
.select-field {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5rem 1.5rem;
  padding-right: 2.5rem;
}
```

#### Textarea Fields
```css
.textarea-field {
  resize: vertical;
  min-height: 80px;
  font-family: var(--font-sans);
}
```

### Card Components

#### Standard Card
```css
.card {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 150ms ease-in-out;
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.card__header {
  margin-bottom: var(--space-4);
}

.card__title {
  font-family: var(--font-display);
  font-weight: var(--font-semibold);
  font-size: var(--text-lg);
  color: var(--foreground);
  margin-bottom: var(--space-2);
}

.card__description {
  color: var(--foreground-muted);
  font-size: var(--text-sm);
}
```

### Authentication Components

#### Login Form
```css
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: var(--space-8);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.auth-title {
  font-family: var(--font-display);
  font-weight: var(--font-semibold);
  font-size: var(--text-3xl);
  color: var(--foreground);
  margin-bottom: var(--space-2);
}

.auth-subtitle {
  color: var(--foreground-muted);
  font-size: var(--text-base);
}
```

---

## Assessment-Specific Components

### Progress Components

#### Progress Bar
```css
.progress-container {
  background: var(--background-muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.progress-title {
  font-weight: var(--font-medium);
  color: var(--foreground);
  font-size: var(--text-sm);
}

.progress-percentage {
  font-weight: var(--font-bold);
  color: var(--accent);
  font-size: var(--text-lg);
}

.progress-bar {
  height: 8px;
  background: var(--border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--progress-gradient);
  border-radius: var(--radius-full);
  transition: width 300ms ease-out;
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-2);
  font-size: var(--text-xs);
  color: var(--foreground-muted);
}
```

#### Phase Indicators
```css
.phase-indicators {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.phase-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: var(--background);
  transition: all 150ms ease-in-out;
}

.phase-dot--completed {
  background: var(--phase-complete);
  border-color: var(--phase-complete);
}

.phase-dot--current {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 0 4px oklch(0.6489 0.2370 26.9728 / 0.2);
  transform: scale(1.1);
}

.phase-dot--validation {
  background: var(--phase-validation);
  border-color: var(--phase-validation);
  box-shadow: 0 0 0 4px oklch(0.5635 0.2408 260.8178 / 0.2);
}
```

### Validation Components

#### Validation Container
```css
.validation-container {
  background: var(--validation-gradient);
  border: 1px solid oklch(0.5635 0.2408 260.8178 / 0.2);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-glow);
}

.validation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.validation-title {
  font-family: var(--font-display);
  font-weight: var(--font-semibold);
  font-size: var(--text-2xl);
  color: var(--foreground);
}

.validation-badge {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--trust);
  color: var(--trust-foreground);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}
```

#### AI Insight Cards
```css
.insight-card {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-4);
  animation: slideUp 500ms ease-out forwards;
  opacity: 0;
}

.insight-card:nth-child(1) { animation-delay: 200ms; }
.insight-card:nth-child(2) { animation-delay: 400ms; }
.insight-card:nth-child(3) { animation-delay: 600ms; }

.insight-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-4);
}

.insight-icon {
  width: 24px;
  height: 24px;
  background: var(--trust);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--space-3);
}

.insight-title {
  font-weight: var(--font-semibold);
  font-size: var(--text-lg);
  color: var(--foreground);
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
```

### Input Method Components

#### Multi-Modal Input Selector
```css
.input-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.input-method-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-4);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--background);
  color: var(--foreground-muted);
  cursor: pointer;
  transition: all 150ms ease-in-out;
  min-height: 80px;
}

.input-method-btn:hover {
  border-color: var(--accent);
  color: var(--foreground);
}

.input-method-btn--active {
  border-color: var(--accent);
  background: oklch(0.6489 0.2370 26.9728 / 0.05);
  color: var(--accent);
}

.input-method-icon {
  width: 24px;
  height: 24px;
  margin-bottom: var(--space-2);
}

.input-method-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}
```

---

## Application System

### CSS Custom Properties Implementation

Create a central CSS file that all components import:

```css
/* /src/styles/design-system.css */
@import './tokens/colors.css';
@import './tokens/typography.css';
@import './tokens/spacing.css';
@import './tokens/shadows.css';
@import './components/generic.css';
@import './components/assessment.css';
```

### Component Usage Guidelines

#### Generic Components Usage
- **Navigation**: Use for all app navigation (header, sidebar, breadcrumbs)
- **Buttons**: Use for all user actions (primary, secondary, accent based on importance)
- **Forms**: Use for all data input (auth, settings, user preferences)
- **Cards**: Use for content containers (dashboards, lists, previews)

#### Assessment-Specific Components Usage
- **Progress**: Use only in assessment flows to show completion
- **Phase Indicators**: Use to show assessment phase progression
- **Validation**: Use for AI analysis and confirmation screens
- **Input Methods**: Use for multi-modal assessment inputs

### Style Guide Application Strategy

1. **CSS Custom Properties**: All values defined as CSS variables
2. **Component Classes**: Consistent naming with BEM methodology
3. **Utility Classes**: For spacing, typography, and common patterns
4. **Theme Switching**: Easy color theme changes via CSS variable updates
5. **Design Tokens**: JSON format for design tool integration

### Implementation Checklist

- [ ] Replace all hardcoded colors with CSS custom properties
- [ ] Apply consistent component classes across all HTML files
- [ ] Ensure all touch targets meet 44px minimum requirement
- [ ] Validate color contrast ratios meet WCAG AA standards
- [ ] Test responsive behavior on mobile and desktop
- [ ] Verify style consistency across all application screens

---

This style guide serves as the single source of truth for SuperSwift's complete visual design system. All new components should reference these patterns and existing components should be updated to match these specifications.