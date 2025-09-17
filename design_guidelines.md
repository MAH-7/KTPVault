# Design Guidelines for IC Registration Application

## Design Approach
**System-Based Approach**: Using a clean, functional design system prioritizing usability and trust for this government/official document processing application. Drawing inspiration from modern form-heavy applications like Linear and Notion for clean, efficient interfaces.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light mode: 219 39% 11% (deep navy blue for trust/authority)
- Dark mode: 219 39% 89% (light blue-gray)

**Background Colors:**
- Light mode: 0 0% 98% (warm white)
- Dark mode: 219 39% 6% (deep dark blue)

**Accent Colors:**
- Success: 142 76% 36% (forest green for "Berjaya didaftar")
- Error: 0 84% 60% (red for "IC telah didaftar")
- Warning: 38 92% 50% (amber for validation prompts)

### B. Typography
**Font Family:** Inter (Google Fonts) for excellent readability
- Headers: 600-700 weight
- Body text: 400-500 weight
- Form labels: 500 weight
- Button text: 500 weight

**Sizes:**
- Page titles: text-3xl
- Section headers: text-xl
- Body text: text-base
- Form labels: text-sm
- Helper text: text-xs

### C. Layout System
**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12 for consistent rhythm
- Component padding: p-6 or p-8
- Section margins: mb-8 or mb-12
- Form element spacing: gap-4 or gap-6
- Button padding: px-6 py-3

### D. Component Library

**Forms & Inputs:**
- Large, accessible form fields with rounded-lg borders
- Clear validation states with colored borders and helper text
- Camera upload area with dashed border and prominent upload icon
- OCR results displayed in readonly fields with edit capabilities

**Buttons:**
- Primary: Solid background with primary color
- Secondary: Outline style with primary border
- Success/Error: Contextual colors for feedback
- Large touch targets (min-height: 44px) for mobile

**Cards & Containers:**
- Subtle shadows (shadow-sm) for form containers
- Clean borders with border-gray-200/300
- Generous padding for breathing room

**Navigation:**
- Simple header with app name and admin link
- Breadcrumb navigation for admin section
- Mobile-responsive hamburger menu if needed

**Data Display (Admin):**
- Clean table design with alternating row colors
- Search bar with clear styling
- Export button prominently placed
- Pagination for large datasets

**Feedback Elements:**
- Toast notifications for success/error messages
- Loading states with subtle spinners
- Clear validation messaging inline with forms
- Progress indicators for OCR processing

### E. Mobile-First Responsive Design
- Single-column layouts on mobile
- Large touch targets for camera/file upload
- Optimized OCR preview for small screens
- Collapsible admin table on mobile devices

### F. Trust & Security Visual Cues
- Lock icons for security messaging
- Clear privacy statements about data hashing
- Professional, government-appropriate aesthetic
- Minimal distractions to focus on the task

## Key Interaction Patterns
- Progressive disclosure: Show OCR results before manual input option
- Clear error recovery paths when OCR fails
- Immediate validation feedback without overwhelming the user
- One-click admin actions with confirmation dialogs for destructive operations

## Accessibility Considerations
- High contrast ratios for all text
- Proper focus management for form navigation
- Screen reader friendly labels and descriptions
- Keyboard navigation support throughout
- Consistent dark mode implementation across all components