import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PreviewEnhanced } from '@/components/PreviewEnhanced';
import { ResumeProvider } from '@/contexts/ResumeContext';
import { CVData } from '@/lib/types';
import { defaultCVData } from '@/lib/defaultData';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export default function SharedResumePage() {
  const { shareId } = useParams();
  const [resumeData, setResumeData] = useState<CVData>(defaultCVData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedResume = async () => {
      if (!shareId) {
        setError('Invalid share link');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/share-resume/${shareId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('This resume link is invalid or has expired');
          } else {
            setError('Failed to load resume');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setResumeData(data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading shared resume:', err);
        setError('Failed to load resume');
        setLoading(false);
      }
    };

    loadSharedResume();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-100">
        <div className="text-center max-w-md">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ResumeProvider initialData={resumeData}>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 animate-fade-in">
        <div className="container mx-auto py-6 px-4">
          <div className="bg-white/40 backdrop-blur-md rounded-xl border shadow-lg overflow-hidden transition-all hover:shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {resumeData.basicInfo.name}'s Resume
                </h1>
                <p className="text-sm text-gray-600">Shared via ImpactCV</p>
              </div>
              <Button 
                variant="default"
                onClick={() => window.print()}
              >
                Download PDF
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <PreviewEnhanced readOnly={true} />
            </div>
          </div>
        </div>
      </div>
    </ResumeProvider>
  );
}
