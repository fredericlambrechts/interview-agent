# Interview System Design Extensions

**Version**: 1.0  
**Date**: August 2025  
**Extends**: SuperSwift UI Style Guide v2.0  
**Scope**: Real-time voice interview system components

---

## Overview

This document extends the SuperSwift Design System with components specifically designed for the real-time voice interview experience. All extensions build upon the existing OKLCH color system, typography, and spacing scale.

---

## Interview-Specific Color Extensions

### Real-time State Colors
```css
:root {
  /* Real-time Field States - extends existing semantic colors */
  --field-idle: transparent;
  --field-highlighting: oklch(0.9400 0.1500 85.0000);     /* Light amber background */
  --field-highlighting-border: var(--warning);             /* Amber border */
  --field-reflecting: oklch(0.9400 0.1500 85.0000);       /* Same as highlighting */
  --field-updated: oklch(0.9800 0.1000 142.4953);         /* Light green background */
  --field-updated-border: var(--success);                  /* Green border */
  
  /* Source Attribution Colors */
  --source-web: oklch(0.6200 0.1900 260.0000);           /* Blue for web sources */
  --source-proprietary: var(--trust);                     /* Trust blue for SuperSwift */
  --source-document: oklch(0.6000 0.1500 40.0000);       /* Orange for docs */
  --source-interview: var(--accent);                      /* Gold for interview */
  
  /* Freshness Score Colors */
  --freshness-excellent: var(--success);                  /* 85%+ */
  --freshness-good: oklch(0.7500 0.1800 120.0000);      /* 70-84% */
  --freshness-fair: var(--warning);                       /* 50-69% */
  --freshness-poor: var(--destructive);                   /* <50% */
}
```

### Animation Variables
```css
:root {
  /* Interview Animation Timing */
  --anim-highlight: 150ms ease-out;
  --anim-reflection: 1.5s ease-in-out infinite;
  --anim-update: 300ms ease-out;
  --anim-celebration: 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

---

## Interview Layout Components

### Voice Interview Container
```css
.interview-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr auto;
  gap: var(--space-6);
  height: 100vh;
  padding: var(--space-6);
  background: var(--background);
}

.interview-container__voice {
  grid-column: 1;
  grid-row: 1;
  background: var(--background-muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.interview-container__artifact {
  grid-column: 2;
  grid-row: 1;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  overflow-y: auto;
}

.interview-container__metadata {
  grid-column: 1 / -1;
  grid-row: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  height: 200px;
}
```

### Voice Agent Component
```css
.voice-agent {
  text-align: center;
}

.voice-agent__status {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--foreground);
  margin-bottom: var(--space-6);
}

.voice-agent__waveform {
  width: 200px;
  height: 60px;
  margin: var(--space-6) auto;
  display: flex;
  align-items: end;
  justify-content: center;
  gap: var(--space-1);
}

.voice-agent__bar {
  width: 4px;
  background: var(--accent);
  border-radius: var(--radius-sm);
  animation: voice-wave 1.5s ease-in-out infinite;
}

.voice-agent__bar:nth-child(1) { height: 20px; animation-delay: 0ms; }
.voice-agent__bar:nth-child(2) { height: 40px; animation-delay: 150ms; }
.voice-agent__bar:nth-child(3) { height: 60px; animation-delay: 300ms; }
.voice-agent__bar:nth-child(4) { height: 30px; animation-delay: 450ms; }
.voice-agent__bar:nth-child(5) { height: 50px; animation-delay: 600ms; }

@keyframes voice-wave {
  0%, 100% { transform: scaleY(0.3); opacity: 0.3; }
  50% { transform: scaleY(1); opacity: 1; }
}

.voice-agent__transcript {
  font-style: italic;
  color: var(--foreground-muted);
  font-size: var(--text-lg);
  max-width: 300px;
  line-height: 1.6;
}
```

---

## Real-time Field Components

### Field State System
```css
.artifact-field {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  border: 2px solid transparent;
  transition: all var(--anim-highlight);
  margin-bottom: var(--space-3);
  position: relative;
}

.artifact-field--idle {
  background: var(--field-idle);
  border-color: transparent;
}

.artifact-field--highlighting {
  background: var(--field-highlighting);
  border-color: var(--field-highlighting-border);
  box-shadow: 0 0 0 4px oklch(0.8100 0.2500 85.0000 / 0.2);
}

.artifact-field--reflecting {
  background: var(--field-highlighting);
  border-color: var(--field-highlighting-border);
  box-shadow: 0 0 0 4px oklch(0.8100 0.2500 85.0000 / 0.2);
}

.artifact-field--reflecting::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid var(--field-highlighting-border);
  border-radius: var(--radius);
  animation: subtle-pulse var(--anim-reflection);
}

.artifact-field--updated {
  background: var(--field-updated);
  border-color: var(--field-updated-border);
  box-shadow: 0 0 0 4px oklch(0.6800 0.1500 160.0000 / 0.2);
  transition: all var(--anim-update);
}

@keyframes subtle-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.02); }
}
```

### Field Label System
```css
.artifact-field__label {
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  color: var(--foreground-muted);
  margin-bottom: var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.artifact-field__content {
  font-size: var(--text-base);
  color: var(--foreground);
  line-height: 1.6;
}

.artifact-field__content--empty {
  color: var(--foreground-muted);
  font-style: italic;
}

.artifact-field__status {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--border);
  transition: all var(--anim-highlight);
}

.artifact-field__status--updated {
  background: var(--success);
}
```

---

## Source Attribution Components

### Sources Panel
```css
.sources-panel {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  height: 100%;
}

.sources-panel__header {
  font-family: var(--font-display);
  font-weight: var(--font-semibold);
  font-size: var(--text-lg);
  color: var(--foreground);
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sources-panel__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.source-group {
  border-bottom: 1px solid var(--border-muted);
  padding-bottom: var(--space-3);
}

.source-group:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.source-group__title {
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  color: var(--foreground);
  margin-bottom: var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.source-group__icon {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
}

.source-group__icon--web { background: var(--source-web); }
.source-group__icon--proprietary { background: var(--source-proprietary); }
.source-group__icon--document { background: var(--source-document); }
.source-group__icon--interview { background: var(--source-interview); }
```

### Individual Source Items
```css
.source-item {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius);
  cursor: pointer;
  transition: background var(--anim-highlight);
  position: relative;
}

.source-item:hover {
  background: var(--background-muted);
}

.source-item__name {
  font-size: var(--text-sm);
  color: var(--foreground);
  margin-bottom: var(--space-1);
}

.source-item__meta {
  font-size: var(--text-xs);
  color: var(--foreground-muted);
}

.source-item__favicon {
  width: 12px;
  height: 12px;
  margin-right: var(--space-1);
  border-radius: var(--radius-sm);
}

/* Tooltip for web sources */
.source-item--web:hover::after {
  content: attr(data-full-url);
  position: absolute;
  bottom: 100%;
  left: 0;
  background: var(--primary);
  color: var(--primary-foreground);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius);
  font-size: var(--text-xs);
  white-space: nowrap;
  z-index: 10;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

## Freshness & Completion Components

### Freshness Score
```css
.freshness-score {
  background: var(--background-muted);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-3);
  text-align: center;
}

.freshness-score__label {
  font-size: var(--text-xs);
  color: var(--foreground-muted);
  margin-bottom: var(--space-1);
}

.freshness-score__value {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-1);
}

.freshness-score__value--excellent { color: var(--freshness-excellent); }
.freshness-score__value--good { color: var(--freshness-good); }
.freshness-score__value--fair { color: var(--freshness-fair); }
.freshness-score__value--poor { color: var(--freshness-poor); }

.freshness-score__change {
  font-size: var(--text-xs);
  color: var(--foreground-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
}

.freshness-score__change--improved {
  color: var(--success);
}

.freshness-score__arrow {
  font-size: 10px;
}
```

### Completion State
```css
.completion-state {
  background: var(--success-background);
  border: 1px solid var(--success);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  text-align: center;
  animation: slideUp var(--anim-celebration);
}

.completion-state__icon {
  width: 48px;
  height: 48px;
  background: var(--success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-4);
  color: var(--success-foreground);
  font-size: var(--text-xl);
}

.completion-state__title {
  font-family: var(--font-display);
  font-weight: var(--font-semibold);
  font-size: var(--text-xl);
  color: var(--foreground);
  margin-bottom: var(--space-2);
}

.completion-state__score {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--success);
  margin-bottom: var(--space-4);
}

.completion-state__details {
  font-size: var(--text-sm);
  color: var(--foreground-muted);
  margin-bottom: var(--space-6);
}

.completion-state__missing {
  text-align: left;
  margin-bottom: var(--space-4);
}

.completion-state__missing-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
}

.completion-state__missing-icon {
  color: var(--warning);
}
```

---

## Celebration & Feedback Components

### Marcus Update Celebration
```css
.update-celebration {
  position: fixed;
  top: var(--space-8);
  right: var(--space-8);
  background: var(--background);
  border: 1px solid var(--success);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-xl);
  z-index: 100;
  animation: celebrationSlide var(--anim-celebration);
  max-width: 300px;
}

.update-celebration__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.update-celebration__icon {
  font-size: var(--text-xl);
}

.update-celebration__title {
  font-weight: var(--font-semibold);
  color: var(--foreground);
}

.update-celebration__freshness {
  background: var(--success-background);
  border-radius: var(--radius);
  padding: var(--space-2) var(--space-3);
  margin-bottom: var(--space-3);
  text-align: center;
}

.update-celebration__freshness-value {
  font-weight: var(--font-bold);
  color: var(--success);
  font-size: var(--text-lg);
}

.update-celebration__changes {
  font-size: var(--text-sm);
  color: var(--foreground-muted);
  margin-bottom: var(--space-4);
}

.update-celebration__actions {
  display: flex;
  gap: var(--space-2);
}

@keyframes celebrationSlide {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

---

## Responsive Considerations

### Mobile Adaptations
```css
@media (max-width: 768px) {
  .interview-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: var(--space-4);
    padding: var(--space-4);
  }
  
  .interview-container__voice,
  .interview-container__artifact {
    grid-column: 1;
  }
  
  .interview-container__metadata {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .voice-agent__waveform {
    width: 150px;
    height: 40px;
  }
  
  .update-celebration {
    top: var(--space-4);
    right: var(--space-4);
    left: var(--space-4);
    max-width: none;
  }
}
```

---

## Implementation Notes

### Integration with Existing System
1. **Extends existing colors**: All new colors build upon OKLCH system
2. **Maintains spacing scale**: Uses existing --space-* variables
3. **Consistent typography**: Uses --font-* and --text-* variables
4. **Accessibility compliance**: Maintains WCAG AA contrast ratios

### Animation Performance
1. **GPU acceleration**: Uses transform and opacity for animations
2. **Reduced motion respect**: Include prefers-reduced-motion queries
3. **Smooth transitions**: Consistent timing functions across components

### Component Usage Guidelines
1. **Real-time fields**: Only for artifact building during interview
2. **Source panel**: Always visible during interview sessions
3. **Freshness score**: Subtle placement, updates on validation
4. **Celebrations**: Temporary overlays for positive feedback

---

**Document Status**: Ready for Implementation  
**Next Review**: After first prototype testing  
**Integration**: Import after existing design-system.css