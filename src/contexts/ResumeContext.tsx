import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CVData, CustomStyles } from '@/lib/types';
import { defaultCVData } from '@/lib/defaultData';

interface ResumeContextType {
  cvData: CVData;
  updateCVData: (data: CVData) => void;
  updateField: (path: string, value: any) => void;
  updateCustomStyles: (styles: Partial<CustomStyles>) => void;
  history: CVData[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

interface ResumeProviderProps {
  children: React.ReactNode;
  initialData?: CVData;
  resumeId?: string;
  onSave?: (data: CVData) => void;
}

export const ResumeProvider: React.FC<ResumeProviderProps> = ({
  children,
  initialData,
  resumeId,
  onSave
}) => {
  const [cvData, setCVData] = useState<CVData>(initialData || defaultCVData);
  const [history, setHistory] = useState<CVData[]>([initialData || defaultCVData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Debounced save function to backend API
  useEffect(() => {
    // Skip initial render
    if (history.length <= 1) return;

    const timeoutId = setTimeout(async () => {
      if (onSave) {
        onSave(cvData);
      }
      
      // Save to backend API
      if (resumeId) {
        try {
          const response = await fetch(`/api/resumes/${resumeId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: cvData,
              lastModified: new Date().toISOString()
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save resume');
          }

          console.log('Resume auto-saved successfully');
        } catch (error) {
          console.error('Error saving resume:', error);
          // Fallback to localStorage
          const savedResumes = localStorage.getItem('resumes');
          if (savedResumes) {
            const resumes = JSON.parse(savedResumes);
            const updatedResumes = resumes.map((resume: any) =>
              resume.id === resumeId
                ? { ...resume, data: cvData, lastModified: new Date() }
                : resume
            );
            localStorage.setItem('resumes', JSON.stringify(updatedResumes));
          }
        }
      } else {
        // No resumeId, save to localStorage only
        localStorage.setItem('cv-data', JSON.stringify(cvData));
      }
    }, 800); // 800ms debounce for better UX

    return () => clearTimeout(timeoutId);
  }, [cvData, resumeId, onSave, history.length]);

  const updateCVData = useCallback((newData: CVData) => {
    setCVData(newData);
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newData]);
    setHistoryIndex(historyIndex + 1);
  }, [history, historyIndex]);

  const updateField = useCallback((path: string, value: any) => {
    const pathParts = path.split('.');
    const newData = JSON.parse(JSON.stringify(cvData));
    
    let current = newData;
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    current[pathParts[pathParts.length - 1]] = value;
    
    updateCVData(newData);
  }, [cvData, updateCVData]);

  const updateCustomStyles = useCallback((styles: Partial<CustomStyles>) => {
    const newData = {
      ...cvData,
      customStyles: {
        ...cvData.customStyles,
        typography: {
          ...(cvData.customStyles?.typography || {
            fontFamily: 'Inter',
            fontSize: { base: 14, heading: 24, subheading: 18 },
            fontWeight: { normal: 400, medium: 500, bold: 700 }
          }),
          ...(styles.typography || {})
        },
        colors: {
          ...(cvData.customStyles?.colors || {
            primary: '#3b82f6',
            secondary: '#64748b',
            accent: '#8b5cf6',
            background: '#ffffff',
            text: '#1e293b',
            textSecondary: '#64748b'
          }),
          ...(styles.colors || {})
        },
        layout: {
          ...(cvData.customStyles?.layout || {
            sectionSpacing: 24,
            padding: 32,
            borderRadius: 8
          }),
          ...(styles.layout || {})
        }
      }
    };
    updateCVData(newData);
  }, [cvData, updateCVData]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setCVData(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setCVData(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const value: ResumeContextType = {
    cvData,
    updateCVData,
    updateField,
    updateCustomStyles,
    history,
    historyIndex,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};
