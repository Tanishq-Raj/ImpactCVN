import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useResume } from '@/contexts/ResumeContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Palette, Type, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const fontFamilies = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
];

export function GlobalStylePanel() {
  const { cvData, updateCustomStyles } = useResume();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const customStyles = cvData.customStyles || {
    typography: {
      fontFamily: 'Inter',
      fontSize: { base: 14, heading: 24, subheading: 18 },
      fontWeight: { normal: 400, medium: 500, bold: 700 }
    },
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#8b5cf6',
      background: '#ffffff',
      text: '#1e293b',
      textSecondary: '#64748b'
    },
    layout: {
      sectionSpacing: 24,
      padding: 32,
      borderRadius: 8
    }
  };

  const handleColorChange = (color: string) => {
    updateCustomStyles({
      colors: {
        ...customStyles.colors,
        text: color
      }
    });
  };

  const handlePrimaryColorChange = (color: string) => {
    updateCustomStyles({
      colors: {
        ...customStyles.colors,
        primary: color
      }
    });
  };

  const handleBackgroundColorChange = (color: string) => {
    updateCustomStyles({
      colors: {
        ...customStyles.colors,
        background: color
      }
    });
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    updateCustomStyles({
      typography: {
        ...customStyles.typography,
        fontFamily
      }
    });
  };

  const handleFontSizeChange = (size: number) => {
    updateCustomStyles({
      typography: {
        ...customStyles.typography,
        fontSize: {
          ...customStyles.typography.fontSize,
          base: size
        }
      }
    });
  };

  const resetToDefaults = () => {
    updateCustomStyles({
      typography: {
        fontFamily: 'Inter',
        fontSize: { base: 14, heading: 24, subheading: 18 },
        fontWeight: { normal: 400, medium: 500, bold: 700 }
      },
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#8b5cf6',
        background: '#ffffff',
        text: '#1e293b',
        textSecondary: '#64748b'
      },
      layout: {
        sectionSpacing: 24,
        padding: 32,
        borderRadius: 8
      }
    });
  };

  return (
    <div className="space-y-6 p-4 bg-white/80 backdrop-blur-sm rounded-lg border shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <h3 className="text-sm font-medium">Global Styles</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetToDefaults}
          className="h-8 px-2"
          title="Reset to defaults"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Type className="h-3 w-3 text-muted-foreground" />
          <Label className="text-xs font-medium">Font Family</Label>
        </div>
        <Select
          value={customStyles.typography.fontFamily}
          onValueChange={handleFontFamilyChange}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                <span style={{ fontFamily: font.value }}>{font.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">
          Font Size: {customStyles.typography.fontSize.base}px
        </Label>
        <Slider
          min={10}
          max={20}
          step={1}
          value={[customStyles.typography.fontSize.base]}
          onValueChange={([value]) => handleFontSizeChange(value)}
          className="w-full"
        />
      </div>

      {/* Text Color */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Text Color</Label>
        <div className="flex gap-2">
          <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
            <PopoverTrigger asChild>
              <button
                className="w-10 h-10 rounded border-2 border-gray-200 shadow-sm hover:border-gray-300 transition-colors"
                style={{ backgroundColor: customStyles.colors.text }}
                title="Pick text color"
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <HexColorPicker
                color={customStyles.colors.text}
                onChange={handleColorChange}
              />
              <Input
                type="text"
                value={customStyles.colors.text}
                onChange={(e) => handleColorChange(e.target.value)}
                className="mt-2 h-8 text-xs"
                placeholder="#000000"
              />
            </PopoverContent>
          </Popover>
          <Input
            type="text"
            value={customStyles.colors.text}
            onChange={(e) => handleColorChange(e.target.value)}
            className="flex-1 h-10 text-xs"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Primary Color (Headings) */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Heading Color</Label>
        <div className="flex gap-2">
          <button
            className="w-10 h-10 rounded border-2 border-gray-200 shadow-sm hover:border-gray-300 transition-colors"
            style={{ backgroundColor: customStyles.colors.primary }}
            onClick={() => {
              const color = prompt('Enter heading color (hex):', customStyles.colors.primary);
              if (color) handlePrimaryColorChange(color);
            }}
            title="Pick heading color"
          />
          <Input
            type="text"
            value={customStyles.colors.primary}
            onChange={(e) => handlePrimaryColorChange(e.target.value)}
            className="flex-1 h-10 text-xs"
            placeholder="#3b82f6"
          />
        </div>
      </div>

      {/* Background Color */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Background Color</Label>
        <div className="flex gap-2">
          <button
            className="w-10 h-10 rounded border-2 border-gray-200 shadow-sm hover:border-gray-300 transition-colors"
            style={{ backgroundColor: customStyles.colors.background }}
            onClick={() => {
              const color = prompt('Enter background color (hex):', customStyles.colors.background);
              if (color) handleBackgroundColorChange(color);
            }}
            title="Pick background color"
          />
          <Input
            type="text"
            value={customStyles.colors.background}
            onChange={(e) => handleBackgroundColorChange(e.target.value)}
            className="flex-1 h-10 text-xs"
            placeholder="#ffffff"
          />
        </div>
      </div>

      <div className="pt-2 border-t text-xs text-muted-foreground">
        Changes apply instantly across all sections
      </div>
    </div>
  );
}
