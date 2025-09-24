# SuperSwift Design System

**Extending shadcn/ui for Strategic Intelligence Interfaces**

---

## Brand Identity

SuperSwift is an AI-powered "External Strategic Brain" for European MedTech companies, delivering BCG-quality strategic consulting through revolutionary voice-to-voice AI agents. Our design system reflects **humble excellence**, **radical transparency**, and **professional sophistication**.

---

## Color Palette

### Primary Colors
```css
--primary: 255 93 59;               /* Orange #FF5D3B - SuperSwift Brand */
--secondary: 10 10 10;              /* Near-black #0A0A0A - Professional depth */
```

### Supporting Colors
```css
--background: 255 255 255;          /* Clean white - Minimal chrome */
--muted: 248 248 248;               /* Light gray - Subtle backgrounds */
--border: 229 229 229;              /* Subtle border - Clean separation */
--text: 10 10 10;                   /* Near-black text - High readability */
--text-muted: 115 115 115;          /* Muted text - Secondary information */
```

### Semantic Colors
```css
--success: 34 197 94;               /* Green - Positive states */
--error: 239 68 68;                 /* Red - Error states */
--warning: 245 158 11;              /* Amber - Warning states */
```

### Gradients
```css
--gradient-primary: linear-gradient(135deg, rgb(var(--primary)) 0%, rgba(255, 93, 59, 0.8) 100%);
--gradient-subtle: linear-gradient(135deg, rgb(var(--muted)) 0%, rgb(245, 245, 245) 100%);
```

---

## Typography

### Font Stack
- **Primary**: Inter (300, 400, 500, 600, 700)
- **Monospace**: 'Inconsolata' for technical displays
- **Fallback**: system-ui, -apple-system, sans-serif

### Text Selection
```css
::selection {
    background-color: rgba(255, 93, 59, 0.2);
    color: rgb(var(--secondary));
}
```

---

## Design Principles

### 1. Minimal Chrome, Clean Interfaces
- Generous white space
- Subtle borders and shadows
- Focus on content over decoration
- Clean geometric forms

### 2. Strategic Intelligence Hierarchy
- Clear information architecture
- Progressive disclosure
- Scannable layouts
- Executive-friendly readability

### 3. Voice-First Consideration
- Large touch targets
- Voice state indicators
- Conversational flow design
- Accessibility for audio interaction

### 4. European Professional Standards
- GDPR compliance indicators
- Privacy-first design
- Professional color palette
- Enterprise-grade polish

---

## Component Extensions

### Buttons

#### Primary Button (CTA)
```css
.btn-primary {
    background: var(--gradient-primary);
    color: white;
    box-shadow: 0 4px 12px rgba(255, 93, 59, 0.15);
    border-radius: 0.5rem;
    font-weight: 500;
}

.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(255, 93, 59, 0.25);
}
```

#### Secondary Button
```css
.btn-secondary {
    background-color: rgb(var(--background));
    color: rgb(var(--text));
    border: 1px solid rgb(var(--border));
}

.btn-secondary:hover {
    background-color: rgb(var(--muted));
    border-color: rgb(var(--primary));
}
```

### Form Components

#### SuperSwift Input
```css
.form-input {
    border: 1px solid rgb(var(--border));
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    transition: all 0.2s ease;
}

.form-input:focus {
    border-color: rgb(var(--primary));
    box-shadow: 0 0 0 3px rgba(255, 93, 59, 0.1);
    outline: none;
}
```

### Voice Agent States

#### Active Voice State
```css
.voice-agent-active {
    background: rgba(255, 93, 59, 0.1);
    border: 2px solid rgb(var(--primary));
    animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 93, 59, 0.4); }
    50% { box-shadow: 0 0 0 10px rgba(255, 93, 59, 0); }
}
```

#### Listening State
```css
.voice-agent-listening {
    background: linear-gradient(45deg, rgba(255, 93, 59, 0.1) 25%, transparent 25%);
    background-size: 20px 20px;
    animation: listening-pattern 1s linear infinite;
}
```

#### Processing State
```css
.voice-agent-processing {
    background: rgba(255, 93, 59, 0.05);
    position: relative;
}

.voice-agent-processing::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 93, 59, 0.2), transparent);
    animation: processing-sweep 2s infinite;
}
```

---

## Strategic Intelligence Components

### Progress Indicators
```css
.progress-strategic {
    height: 0.5rem;
    background: rgb(var(--muted));
    border-radius: 0.25rem;
    overflow: hidden;
}

.progress-strategic-bar {
    height: 100%;
    background: var(--gradient-primary);
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Intelligence Cards
```css
.intelligence-card {
    border: 1px solid rgb(var(--border));
    border-radius: 1rem;
    padding: 1.5rem;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;
}

.intelligence-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: rgba(255, 93, 59, 0.3);
}
```

### GDPR Compliance Badge
```css
.gdpr-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 0.375rem;
    font-size: 0.75rem;
    color: rgb(var(--success));
    font-weight: 500;
}
```

---

## Animation System

### Micro-Interactions
```css
/* Fade-in for content loading */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(1rem); }
    to { opacity: 1; transform: translateY(0); }
}

/* Subtle float for decorative elements */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

/* Processing animation */
@keyframes processing-sweep {
    0% { left: -100%; }
    100% { left: 100%; }
}
```

### Timing Functions
- **Standard**: `ease-out` (0.2s) - Most interactions
- **Content**: `cubic-bezier(0.4, 0, 0.2, 1)` (0.3s) - Content loading
- **Voice**: `ease-in-out` (0.4s) - Voice state changes

---

## Spacing System

### Strategic Grid
```css
:root {
    --spacing-xs: 0.25rem;    /* 4px */
    --spacing-sm: 0.5rem;     /* 8px */
    --spacing-md: 1rem;       /* 16px */
    --spacing-lg: 1.5rem;     /* 24px */
    --spacing-xl: 2rem;       /* 32px */
    --spacing-2xl: 3rem;      /* 48px */
    --spacing-3xl: 4rem;      /* 64px */
}
```

---

## Logo Implementation

### Primary Logo
- **Location**: `/Users/fredericlambrechts/Library/CloudStorage/GoogleDrive-fred@beswift.ai/Shared drives/Marketing & Sales/Branding/logo/`
- **Files**: `SuperSwift-logo-only-black.svg`
- **Usage**: Headers, navigation, branding areas
- **Minimum size**: 32px height
- **Clear space**: 0.5x logo height on all sides

### SVG Integration
```html
<!-- Embedded SVG for optimal performance -->
<svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- SuperSwift logo paths -->
</svg>
```

---

## Implementation Guidelines

### 1. shadcn/ui Extension
- Extend existing shadcn components with SuperSwift classes
- Maintain shadcn prop interfaces
- Add SuperSwift-specific variants

### 2. CSS Custom Properties
- Use CSS custom properties for all colors
- Enable theme switching capability
- Maintain consistent naming convention

### 3. Component Composition
- Compose shadcn primitives with SuperSwift styling
- Use className overrides sparingly
- Prefer CSS custom properties over inline styles

### 4. Voice Interface Considerations
- Design for large touch targets (min 44px)
- Include audio state indicators
- Plan for hands-free interaction patterns

---

## File Structure

```
.superdesign/
├── design_iterations/          # Design prototypes
├── superswift-design-system.md # This document
└── themes/
    ├── superswift-light.css   # Light theme
    └── superswift-dark.css    # Dark theme (future)
```

---

## Accessibility

### Voice Interface
- Clear voice state indicators
- Audio feedback for interactions
- Keyboard navigation support

### GDPR Compliance
- Privacy indicators
- Data processing transparency
- Consent management UI

### Professional Standards
- WCAG 2.1 AA compliance
- High contrast ratios
- Responsive design patterns

---

*This design system ensures SuperSwift maintains its identity as a sophisticated, European-standard strategic intelligence platform while extending the robust foundation provided by shadcn/ui.*