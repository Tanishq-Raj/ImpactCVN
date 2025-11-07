import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Preview } from '@/components/Preview';
import { PreviewEnhanced } from '@/components/PreviewEnhanced';
import { StyleCustomizationPanel } from '@/components/StyleCustomizationPanel';
import { ResumeProvider, useResume } from '@/contexts/ResumeContext';
import { CVData } from '@/lib/types';
import { defaultCVData } from '@/lib/defaultData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster as ToasterProvider } from "@/components/ui/toaster";
import { Toaster } from 'sonner';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { Undo2, Redo2 } from 'lucide-react';
import DashboardPage from '@/pages/DashboardPage';

function App() {
  return (
    <Router>
      <TooltipProvider>
        <ToasterProvider />
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/editor/:id" element={<EditorView />} />
          <Route path="/preview/:id" element={<PreviewView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TooltipProvider>
    </Router>
  );
}

function EditorViewContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cvData, updateCVData, undo, redo, canUndo, canRedo } = useResume();
  const [activeTab, setActiveTab] = useState("edit");
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <TooltipProvider>
        <ToasterProvider />
        <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50">
          <Toaster position="top-center" richColors />
          <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            <div className="p-4 border-b bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">ImpactCV</h1>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => navigate('/')}
                    title="Back to Dashboard"
                  >
                    ←
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={undo} 
                    disabled={!canUndo}
                    title="Undo"
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={redo} 
                    disabled={!canRedo}
                    title="Redo"
                  >
                    <Redo2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="edit" className="transition-all">Edit</TabsTrigger>
                <TabsTrigger value="preview" className="transition-all">Preview</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="edit" className="mt-0 p-0 h-[calc(100vh-125px)] animate-fade-in">
              <Sidebar data={cvData} onChange={updateCVData} />
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0 p-4 h-[calc(100vh-125px)] overflow-auto animate-fade-in">
              <PreviewEnhanced />
            </TabsContent>
          </Tabs>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <ToasterProvider />
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 animate-fade-in">
        <Toaster position="top-right" richColors />
        <div className="container mx-auto py-6 px-4">
          <div className="bg-white/40 backdrop-blur-md rounded-xl border shadow-lg overflow-hidden transition-all hover:shadow-xl">
            <div className="flex justify-end gap-2 p-2 bg-white/50 border-b">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
                className="flex items-center gap-1 mr-auto"
                title="Back to Dashboard"
              >
                <span>← Dashboard</span>
              </Button>
              <StyleCustomizationPanel />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={undo} 
                disabled={!canUndo}
                className="flex items-center gap-1"
                title="Undo"
              >
                <Undo2 className="h-4 w-4" />
                <span>Undo</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={redo} 
                disabled={!canRedo}
                className="flex items-center gap-1"
                title="Redo"
              >
                <Redo2 className="h-4 w-4" />
                <span>Redo</span>
              </Button>
            </div>
            <ResizablePanelGroup direction="horizontal" className="min-h-[800px]">
              <ResizablePanel defaultSize={30} minSize={25} maxSize={40} className="transition-all">
                <Sidebar data={cvData} onChange={updateCVData} />
              </ResizablePanel>
              
              <ResizableHandle withHandle className="bg-gray-200 transition-colors hover:bg-gray-300" />
              
              <ResizablePanel defaultSize={70} className="transition-all">
                <div className="h-full bg-gray-50/80 backdrop-blur-sm flex items-center justify-center p-8 overflow-auto">
                  <PreviewEnhanced />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function EditorView() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<CVData>(defaultCVData);
  const [loading, setLoading] = useState(true);
  
  // Load resume data from backend API
  useEffect(() => {
    const loadResume = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/resumes/${id}`);
          if (response.ok) {
            const resume = await response.json();
            // Parse data if it's a string
            const data = typeof resume.data === 'string' 
              ? JSON.parse(resume.data) 
              : resume.data;
            setInitialData(data);
          } else {
            console.error('Failed to load resume from API');
            // Fallback to localStorage
            const savedResumes = localStorage.getItem('resumes');
            if (savedResumes) {
              const resumes = JSON.parse(savedResumes);
              const resume = resumes.find((r: any) => r.id === id);
              if (resume) {
                setInitialData(resume.data);
              }
            }
          }
        } catch (error) {
          console.error('Error loading resume:', error);
          // Fallback to localStorage
          const savedResumes = localStorage.getItem('resumes');
          if (savedResumes) {
            const resumes = JSON.parse(savedResumes);
            const resume = resumes.find((r: any) => r.id === id);
            if (resume) {
              setInitialData(resume.data);
            }
          }
        }
      }
      setLoading(false);
    };

    loadResume();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <ResumeProvider initialData={initialData} resumeId={id}>
      <EditorViewContent />
    </ResumeProvider>
  );
}

function PreviewView() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<CVData>(defaultCVData);
  const [loading, setLoading] = useState(true);
  
  // Load resume data from backend API
  useEffect(() => {
    const loadResume = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/resumes/${id}`);
          if (response.ok) {
            const resume = await response.json();
            const data = typeof resume.data === 'string' 
              ? JSON.parse(resume.data) 
              : resume.data;
            setInitialData(data);
          } else {
            // Fallback to localStorage
            const savedResumes = localStorage.getItem('resumes');
            if (savedResumes) {
              const resumes = JSON.parse(savedResumes);
              const resume = resumes.find((r: any) => r.id === id);
              if (resume) {
                setInitialData(resume.data);
              }
            }
          }
        } catch (error) {
          console.error('Error loading resume:', error);
          // Fallback to localStorage
          const savedResumes = localStorage.getItem('resumes');
          if (savedResumes) {
            const resumes = JSON.parse(savedResumes);
            const resume = resumes.find((r: any) => r.id === id);
            if (resume) {
              setInitialData(resume.data);
            }
          }
        }
      }
      setLoading(false);
    };

    loadResume();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }
  
  return (
    <ResumeProvider initialData={initialData} resumeId={id}>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 animate-fade-in">
        <div className="container mx-auto py-6 px-4">
          <div className="bg-white/40 backdrop-blur-md rounded-xl border shadow-lg overflow-hidden transition-all hover:shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="outline"
                onClick={() => window.history.back()}
              >
                Back to Dashboard
              </Button>
              <Button 
                variant="default"
                onClick={() => window.print()}
              >
                Download PDF
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <PreviewEnhanced />
            </div>
          </div>
        </div>
      </div>
    </ResumeProvider>
  );
}


export default App;
