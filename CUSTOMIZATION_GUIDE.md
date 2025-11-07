# ImpactCV - Complete Customization Guide

## Overview

ImpactCV has been transformed into a **fully customizable resume builder** where every text, color, font, and layout element can be edited on-canvas with persistent state and live preview updates.

## 🎨 New Features

### 1. **Inline Text Editing**

Click on any text element in the preview to edit it directly:

- **Name & Role**: Click to edit your header information
- **Contact Details**: Edit email, phone, location, and social links inline
- **Section Titles**: Rename any section (e.g., "Experience" → "Work History")
- **Content**: Edit summaries, job descriptions, education details, and more
- **All changes auto-save** with a 500ms debounce

**How it works:**
- Hover over any text to see the edit indicator (✎)
- Click to enter edit mode
- Press Enter (for single-line) or click the checkmark to save
- Press Escape or click X to cancel

### 2. **Style Customization Panel**

Access via the "Customize Styles" button in the toolbar. Three tabs of controls:

#### **Typography Tab**
- **Font Family**: Choose from 12 professional fonts
  - Sans-serif: Inter, Roboto, Open Sans, Lato, Montserrat, Poppins
  - Serif: Playfair Display, Merriweather, Georgia, Times New Roman
  - Monospace: Courier New, Monaco
- **Font Sizes**: Adjust base (10-20px), heading (18-36px), and subheading (14-28px)
- **Font Weights**: Control normal (300-500) and bold (600-900) weights

#### **Colors Tab**
- **Primary Color**: Main accent color for headings and highlights
- **Secondary Color**: Supporting color for secondary text
- **Accent Color**: Additional accent for emphasis
- **Background Color**: Resume background
- **Text Color**: Main body text
- **Secondary Text Color**: Dates, locations, and metadata

Each color has:
- Color picker for visual selection
- Hex input for precise values
- Live preview updates

#### **Layout Tab**
- **Section Spacing**: Gap between sections (8-48px)
- **Padding**: Overall document padding (16-64px)
- **Border Radius**: Corner rounding (0-24px)

**Reset Button**: Restore all styles to defaults

### 3. **Drag-and-Drop Section Reordering**

Reorder resume sections by dragging:

1. Hover over any section to reveal the grip handle (⋮⋮) on the left
2. Click and drag to reorder
3. Drop in the desired position
4. Order persists automatically

**Supported sections:**
- Summary
- Experience
- Education
- Skills
- Projects
- Custom sections

### 4. **Dynamic Link Editing**

All contact links are editable inline:

- **Auto-icon detection**: Icons automatically match the field type
  - 📧 Email → Mail icon
  - 📱 Phone → Phone icon
  - 🌐 Website → Globe icon
  - 💼 LinkedIn → LinkedIn icon
  - 🔧 GitHub → GitHub icon
  - 📍 Location → Map Pin icon

Simply click and edit the URL/text directly in the preview.

### 5. **Live Theme Updates with CSS Variables**

All customizations use CSS custom properties for instant updates:

```css
--font-family: 'Inter'
--font-size-base: 14px
--font-size-heading: 24px
--color-primary: #3b82f6
--color-background: #ffffff
--section-spacing: 24px
--padding: 32px
```

Changes apply immediately without page refresh.

### 6. **Persistent State Management**

All customizations are saved automatically:

- **Auto-save**: 500ms debounce on all changes
- **LocalStorage**: Persists across browser sessions
- **Per-resume**: Each resume maintains its own customizations
- **Undo/Redo**: Full history tracking (Ctrl+Z / Ctrl+Y)

### 7. **Context-Based State Management**

The new `ResumeContext` provides:

```typescript
{
  cvData: CVData;                    // Current resume data
  updateCVData: (data) => void;      // Update entire data
  updateField: (path, value) => void; // Update specific field
  updateCustomStyles: (styles) => void; // Update styling
  undo: () => void;                   // Undo last change
  redo: () => void;                   // Redo change
  canUndo: boolean;                   // Can undo?
  canRedo: boolean;                   // Can redo?
}
```

## 📁 New File Structure

```
src/
├── contexts/
│   └── ResumeContext.tsx          # Global state management
├── components/
│   ├── InlineEditableText.tsx     # Inline editing component
│   ├── PreviewEnhanced.tsx        # Enhanced preview with editing
│   └── StyleCustomizationPanel.tsx # Style controls
└── lib/
    └── types.ts                    # Extended with CustomStyles
```

## 🎯 Usage Examples

### Editing Text Inline

```tsx
<InlineEditableText
  value={data.basicInfo.name}
  onChange={(value) => updateField('basicInfo.name', value)}
  as="h1"
  className="text-2xl font-bold"
/>
```

### Updating Custom Styles

```tsx
const { updateCustomStyles } = useResume();

updateCustomStyles({
  colors: {
    primary: '#ff6b6b',
    background: '#f8f9fa'
  }
});
```

### Accessing Resume Context

```tsx
import { useResume } from '@/contexts/ResumeContext';

function MyComponent() {
  const { cvData, updateField, undo, redo } = useResume();
  
  // Use context methods...
}
```

## 🔧 Technical Implementation

### Type Definitions

```typescript
interface CustomStyles {
  typography: {
    fontFamily: string;
    fontSize: {
      base: number;
      heading: number;
      subheading: number;
    };
    fontWeight: {
      normal: number;
      medium: number;
      bold: number;
    };
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
  };
  layout: {
    sectionSpacing: number;
    padding: number;
    borderRadius: number;
  };
}
```

### Drag-and-Drop Integration

Uses `@dnd-kit` for smooth, accessible drag-and-drop:

```tsx
<DndContext onDragEnd={handleDragEnd}>
  <SortableContext items={order}>
    {sections.map(section => (
      <SortableSection key={section.id}>
        {renderSection(section)}
      </SortableSection>
    ))}
  </SortableContext>
</DndContext>
```

## 🚀 Getting Started

1. **Open a resume** in the editor
2. **Click any text** to edit inline
3. **Click "Customize Styles"** to open the style panel
4. **Drag sections** to reorder them
5. **All changes auto-save** to localStorage

## 📊 Acceptance Criteria Status

✅ **Clicking any text enables inline editing**
✅ **Users can change fonts, colors, and layout spacing live**
✅ **All customizations persist across reloads (autosaved in DB/localStorage)**
✅ **Reordering and adding/removing sections reflect instantly**
✅ **Exporting to PDF maintains all styles** (via existing PDF export)

## 🎨 Best Practices

1. **Font Pairing**: Combine serif headings with sans-serif body text for contrast
2. **Color Harmony**: Use color picker to maintain consistent color schemes
3. **Spacing**: Increase section spacing for a more open, modern look
4. **Typography Scale**: Maintain hierarchy with heading > subheading > base sizes
5. **Accessibility**: Ensure sufficient contrast between text and background colors

## 🔮 Future Enhancements

Potential additions:
- Custom section templates
- Color scheme presets (Material, Tailwind, etc.)
- Font pairing suggestions
- Export custom themes
- Import themes from JSON
- Real-time collaboration
- Version history with timestamps

## 📝 Notes

- All changes are debounced (500ms) to prevent excessive saves
- Undo/Redo maintains full history of changes
- CSS variables enable instant visual updates
- Drag handles appear on hover for clean UI
- Mobile-responsive editing experience
