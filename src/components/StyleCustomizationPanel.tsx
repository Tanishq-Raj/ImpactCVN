import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Palette, Type, Layout } from 'lucide-react';

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
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Monaco', label: 'Monaco' }
];

export function StyleCustomizationPanel() {
  const { cvData, updateCustomStyles } = useResume();
  const [open, setOpen] = useState(false);

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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span>Customize Styles</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Style Customization</SheetTitle>
          <SheetDescription>
            Customize fonts, colors, and layout to match your personal brand
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="typography" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="typography">
              <Type className="h-4 w-4 mr-2" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="colors">
              <Palette className="h-4 w-4 mr-2" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="h-4 w-4 mr-2" />
              Layout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="typography" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font Family</Label>
              <Select
                value={customStyles.typography.fontFamily}
                onValueChange={(value) =>
                  updateCustomStyles({
                    typography: {
                      ...customStyles.typography,
                      fontFamily: value
                    }
                  })
                }
              >
                <SelectTrigger id="fontFamily">
                  <SelectValue placeholder="Select font" />
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

            <div className="space-y-2">
              <Label htmlFor="baseFontSize">Base Font Size: {customStyles.typography.fontSize.base}px</Label>
              <Slider
                id="baseFontSize"
                min={10}
                max={20}
                step={1}
                value={[customStyles.typography.fontSize.base]}
                onValueChange={([value]) =>
                  updateCustomStyles({
                    typography: {
                      ...customStyles.typography,
                      fontSize: {
                        ...customStyles.typography.fontSize,
                        base: value
                      }
                    }
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="headingFontSize">Heading Font Size: {customStyles.typography.fontSize.heading}px</Label>
              <Slider
                id="headingFontSize"
                min={18}
                max={36}
                step={1}
                value={[customStyles.typography.fontSize.heading]}
                onValueChange={([value]) =>
                  updateCustomStyles({
                    typography: {
                      ...customStyles.typography,
                      fontSize: {
                        ...customStyles.typography.fontSize,
                        heading: value
                      }
                    }
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subheadingFontSize">Subheading Font Size: {customStyles.typography.fontSize.subheading}px</Label>
              <Slider
                id="subheadingFontSize"
                min={14}
                max={28}
                step={1}
                value={[customStyles.typography.fontSize.subheading]}
                onValueChange={([value]) =>
                  updateCustomStyles({
                    typography: {
                      ...customStyles.typography,
                      fontSize: {
                        ...customStyles.typography.fontSize,
                        subheading: value
                      }
                    }
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="normalWeight">Normal Weight: {customStyles.typography.fontWeight.normal}</Label>
              <Slider
                id="normalWeight"
                min={300}
                max={500}
                step={100}
                value={[customStyles.typography.fontWeight.normal]}
                onValueChange={([value]) =>
                  updateCustomStyles({
                    typography: {
                      ...customStyles.typography,
                      fontWeight: {
                        ...customStyles.typography.fontWeight,
                        normal: value
                      }
                    }
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="boldWeight">Bold Weight: {customStyles.typography.fontWeight.bold}</Label>
              <Slider
                id="boldWeight"
                min={600}
                max={900}
                step={100}
                value={[customStyles.typography.fontWeight.bold]}
                onValueChange={([value]) =>
                  updateCustomStyles({
                    typography: {
                      ...customStyles.typography,
                      fontWeight: {
                        ...customStyles.typography.fontWeight,
                        bold: value
                      }
                    }
                  })
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={customStyles.colors.primary}
                  onChange={(e) =>
                    updateCustomStyles({
                      colors: {
                        ...customStyles.colors,
                        primary: e.target.value
                      }
                    })
                  }
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={customStyles.colors.primary}
                  onChange={(e) =>
                    updateCustomStyles({
                      colors: {
                        ...customStyles.colors,
                        primary: e.target.value
                      }
                    })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={customStyles.colors.secondary}
                  onChange={(e) =>
                    updateCustomStyles({
                      colors: {
                        ...customStyles.colors,
                        secondary: e.target.value
                      }
                    })
                  }
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={customStyles.colors.secondary}
                  onChange={(e) =>
                    updateCustomStyles({
                      colors: {
                        ...customStyles.colors,
                        secondary: e.target.value
                      }
                    })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={customStyles.colors.accent}
                  onChange={(e) =>
                    updateCustomStyles({
                      colors: {
                        ...customStyles.colors,
                        accent: e.target.value
                      }
                    })
                  }
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={customStyles.colors.accent}
                  onChange={(e) =>
                    updateCustomStyles({
                      colors: {
                        ...customStyles.colors,
                        accent: e.target.value
                      }
                    })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={customStyles.colors.background}
                  onChange={(e) =>
                    updateCustomStyles({
                      colors: {
                        ...customStyles.colors,
                        background: e.target.value
                      }
                    })
                  }
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={customStyles.colors.background}
                  onChange={(e) =>
                    updateCustomStyles({
                      colors: {
                        ...customStyles.colors,
                        background: e.target.value
                      }
                    })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={customStyles.colors.text}
                  onChange={(e) =>
                    updateCustomStyles({
                      colors: {
                        ...customStyles.colors,
                        text: e.target.value
                      }
                    })
                  }
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={customStyles.colors.text}
                  onChange={(e) =>
                    updateCustomStyles({
                      colors: {
                        ...customStyles.colors,
                        text: e.target.value
                      }
                    })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textSecondaryColor">Secondary Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textSecondaryColor"
                  type="color"
                  value={customStyles.colors.textSecondary}
                  onChange={(e) =>
                    updateCustomStyles({
                      colors: {
                        ...customStyles.colors,
                        textSecondary: e.target.value
                      }
                    })
                  }
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={customStyles.colors.textSecondary}
                  onChange={(e) =>
                    updateCustomStyles({
                      colors: {
                        ...customStyles.colors,
                        textSecondary: e.target.value
                      }
                    })
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="sectionSpacing">Section Spacing: {customStyles.layout.sectionSpacing}px</Label>
              <Slider
                id="sectionSpacing"
                min={8}
                max={48}
                step={4}
                value={[customStyles.layout.sectionSpacing]}
                onValueChange={([value]) =>
                  updateCustomStyles({
                    layout: {
                      ...customStyles.layout,
                      sectionSpacing: value
                    }
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="padding">Padding: {customStyles.layout.padding}px</Label>
              <Slider
                id="padding"
                min={16}
                max={64}
                step={4}
                value={[customStyles.layout.padding]}
                onValueChange={([value]) =>
                  updateCustomStyles({
                    layout: {
                      ...customStyles.layout,
                      padding: value
                    }
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="borderRadius">Border Radius: {customStyles.layout.borderRadius}px</Label>
              <Slider
                id="borderRadius"
                min={0}
                max={24}
                step={2}
                value={[customStyles.layout.borderRadius]}
                onValueChange={([value]) =>
                  updateCustomStyles({
                    layout: {
                      ...customStyles.layout,
                      borderRadius: value
                    }
                  })
                }
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
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
            }}
          >
            Reset to Defaults
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
