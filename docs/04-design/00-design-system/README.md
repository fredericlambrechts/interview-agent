# Design System

This directory contains the design system files for SuperSwift project.

## File Structure

- **design-system.md** - Agent collaboration version (markdown documentation)
- **design-system.html** - Visual reference version (interactive HTML)

## Maintenance Responsibilities

### UX-Expert Agent (Sally)
- Maintain both HTML and MD versions of design system files
- Ensure dual format maintenance (HTML for visual reference, MD for agent collaboration)
- Propagate design changes to all HTML files in `.superdesign/design_iterations/`
- Verify logo paths use relative paths from each file's location
- Ensure all components follow established design system guidelines
- Validate touch targets meet 44px minimum requirement

### Developer Agent (James)
- Reference design system files for UI implementation guidance
- Ensure all UI components follow the established design system
- Verify touch targets meet 44px minimum requirement
- Use relative paths for logos and ensure correct paths from each file's location

### QA Agent (Quinn)
- Verify design system compliance in UAT testing
- Validate that UI components follow /docs/design-system/ guidelines
- Check touch target requirements (44px minimum)
- Verify logo paths are correctly implemented across all UI files
- Ensure HTML and MD design system files remain synchronized

## Design System Change Procedure

When making style guide changes, ensure:

1. **Dual Format Maintenance:**
   - Always create both HTML and MD versions of style guides
   - HTML Version: For visual review, developer reference, and interactive testing
   - MD Version: For agent collaboration and documentation

2. **Automatic Propagation:**
   - Update all HTML files in .superdesign/design_iterations/ when style changes are made
   - Ensure logo paths are correctly updated across all UI files
   - Maintain consistency between generic and assessment-specific components

3. **File Location Standard:**
   - Store both versions in /docs/design-system/ directory
   - Keep content synchronized between formats

4. **Quality Assurance:**
   - Verify logo paths use relative paths from each file's location
   - Ensure all components follow the established design system
   - Check that touch targets meet 44px minimum requirement