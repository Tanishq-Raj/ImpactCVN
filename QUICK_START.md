# Quick Start Guide - Customizable Resume Builder

## 🚀 Getting Started

### Installation

The required dependencies have already been installed. If you need to reinstall:

```bash
npm install
```

### Running the Application

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🎨 Using the New Features

### 1. Inline Text Editing

**Try it now:**
1. Open any resume in the editor
2. Click on the name in the preview
3. Type to edit
4. Press Enter or click ✓ to save
5. Press Escape or click ✗ to cancel

**Works on:**
- Name, role, contact info
- Section titles
- Summaries and descriptions
- All text content

### 2. Style Customization

**Try it now:**
1. Click "Customize Styles" button in the toolbar
2. Switch between Typography, Colors, and Layout tabs
3. Adjust any slider or color picker
4. Watch the preview update in real-time
5. Click "Reset to Defaults" to restore

**Available Controls:**
- **Typography**: 12 fonts, 3 size controls, 2 weight controls
- **Colors**: 6 color pickers (primary, secondary, accent, background, text, text-secondary)
- **Layout**: Section spacing, padding, border radius

### 3. Section Reordering

**Try it now:**
1. Hover over any section in the preview
2. Look for the grip handle (⋮⋮) on the left
3. Click and drag to reorder
4. Drop in the new position
5. Order saves automatically

### 4. Undo/Redo

**Try it now:**
1. Make any change (edit text, change color, etc.)
2. Click the Undo button (or Ctrl+Z)
3. Click the Redo button (or Ctrl+Y)
4. All changes are tracked in history

## 🔧 For Developers

### Key Components

#### ResumeContext
Global state management for resume data:

```tsx
import { useResume } from '@/contexts/ResumeContext';

function MyComponent() {
  const { 
    cvData,           // Current resume data
    updateCVData,     // Update entire data
    updateField,      // Update specific field
    updateCustomStyles, // Update styles
    undo,             // Undo last change
    redo,             // Redo change
    canUndo,          // Can undo?
    canRedo           // Can redo?
  } = useResume();
}
```

#### InlineEditableText
Reusable inline editing component:

```tsx
import { InlineEditableText } from '@/components/InlineEditableText';

<InlineEditableText
  value="Click to edit"
  onChange={(newValue) => console.log(newValue)}
  as="h1"                    // HTML element type
  multiline={false}          // Single or multi-line
  placeholder="Enter text"   // Placeholder text
  className="text-2xl"       // Custom classes
/>
```

#### StyleCustomizationPanel
Style controls panel:

```tsx
import { StyleCustomizationPanel } from '@/components/StyleCustomizationPanel';

// Just render it - it handles everything internally
<StyleCustomizationPanel />
```

#### PreviewEnhanced
Enhanced preview with inline editing and drag-drop:

```tsx
import { PreviewEnhanced } from '@/components/PreviewEnhanced';

// Wrap in ResumeProvider
<ResumeProvider initialData={data} resumeId={id}>
  <PreviewEnhanced />
</ResumeProvider>
```

### Adding Custom Editable Fields

```tsx
// 1. Add field to types.ts
interface BasicInfo {
  // ... existing fields
  customField: string;  // Add your field
}

// 2. Use InlineEditableText in Preview
<InlineEditableText
  value={data.basicInfo.customField}
  onChange={(value) => updateField('basicInfo.customField', value)}
/>

// 3. That's it! Auto-save and persistence work automatically
```

### Adding Custom Style Controls

```tsx
// 1. Add to CustomStyles interface in types.ts
interface CustomStyles {
  // ... existing
  myCustomStyle: {
    property: string;
  };
}

// 2. Add control in StyleCustomizationPanel.tsx
<Input
  value={customStyles.myCustomStyle.property}
  onChange={(e) => updateCustomStyles({
    myCustomStyle: { property: e.target.value }
  })}
/>

// 3. Use in PreviewEnhanced.tsx via CSS variables
const cssVars = {
  '--my-custom-property': customStyles.myCustomStyle.property
};
```

### Drag-and-Drop Integration

```tsx
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

<DndContext 
  sensors={sensors} 
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext 
    items={itemIds} 
    strategy={verticalListSortingStrategy}
  >
    {items.map(item => (
      <SortableItem key={item.id} id={item.id}>
        {item.content}
      </SortableItem>
    ))}
  </SortableContext>
</DndContext>
```

## 📁 Project Structure

```
src/
├── contexts/
│   └── ResumeContext.tsx          # Global state
├── components/
│   ├── InlineEditableText.tsx     # Inline editing
│   ├── PreviewEnhanced.tsx        # Enhanced preview
│   ├── StyleCustomizationPanel.tsx # Style controls
│   ├── Preview.tsx                # Original preview (kept for compatibility)
│   └── Sidebar.tsx                # Left sidebar
├── lib/
│   ├── types.ts                   # Type definitions
│   ├── defaultData.ts             # Default resume data
│   └── themes.ts                  # Theme configurations
└── App.tsx                        # Main app with routing
```

## 🎯 Common Tasks

### Task: Add a new editable field

1. Update `types.ts` with the new field
2. Add to `defaultData.ts`
3. Use `InlineEditableText` in `PreviewEnhanced.tsx`
4. Done! Auto-save handles the rest

### Task: Add a new style control

1. Update `CustomStyles` in `types.ts`
2. Add control in `StyleCustomizationPanel.tsx`
3. Apply via CSS variable in `PreviewEnhanced.tsx`
4. Update default in `defaultData.ts`

### Task: Add a new section type

1. Add to section types in `types.ts`
2. Add to `sectionConfig.order` array
3. Create render function in `PreviewEnhanced.tsx`
4. Add to `sectionComponents` mapping

### Task: Customize auto-save timing

Edit `ResumeContext.tsx`:
```tsx
useEffect(() => {
  const timeoutId = setTimeout(() => {
    // Save logic
  }, 500); // Change this value (milliseconds)
  
  return () => clearTimeout(timeoutId);
}, [cvData]);
```

## 🐛 Troubleshooting

### Changes not saving?
- Check browser console for errors
- Verify localStorage is enabled
- Check ResumeProvider is wrapping components

### Styles not applying?
- Verify CSS variables are defined
- Check customStyles object structure
- Inspect element to see computed styles

### Drag-and-drop not working?
- Ensure items have unique IDs
- Check sensors are properly configured
- Verify SortableContext wraps items

### Inline editing not appearing?
- Check updateField is passed correctly
- Verify field path matches data structure
- Look for console errors

## 📚 Additional Resources

- **Full Documentation**: See `CUSTOMIZATION_GUIDE.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Component API**: Check TypeScript definitions in source files
- **dnd-kit Docs**: https://docs.dndkit.com/
- **Radix UI Docs**: https://www.radix-ui.com/

## 💡 Tips & Best Practices

1. **Always use ResumeContext**: Don't manage resume state locally
2. **Use InlineEditableText**: Don't create custom inline editors
3. **CSS Variables**: Use them for all dynamic styles
4. **Type Safety**: Leverage TypeScript for safety
5. **Test Auto-save**: Make changes and refresh to verify
6. **Mobile First**: Test on mobile devices
7. **Accessibility**: Maintain keyboard navigation
8. **Performance**: Debounce expensive operations

## 🎉 You're Ready!

Start customizing resumes with:
- ✅ Inline text editing
- ✅ Style customization
- ✅ Drag-and-drop reordering
- ✅ Auto-save persistence
- ✅ Undo/redo support

Happy coding! 🚀
