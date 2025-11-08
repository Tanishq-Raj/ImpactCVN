import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, FileText } from 'lucide-react';
import { CVData } from '@/lib/types';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface ShareOptionsProps {
  cvData: CVData;
}

export function ShareOptions({ cvData }: ShareOptionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareLink, setShareLink] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateShareLink = async () => {
    try {
      setIsGenerating(true);
      
      // Generate a unique share ID
      const shareId = Math.random().toString(36).substring(2, 15);
      
      // Send the resume data to the server to create a public share
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/share-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shareId,
          resumeData: cvData,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create shareable link');
      }
      
      const data = await response.json();
      
      // Generate the full URL
      const shareUrl = `${window.location.origin}/share/${data.shareId}`;
      setShareLink(shareUrl);
      
      setIsGenerating(false);
      toast.success('Shareable link generated successfully');
      
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error('Failed to generate shareable link');
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        setCopied(true);
        toast.success('Link copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        toast.error('Failed to copy link');
      });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Public Sharing
        </h3>
        <p className="text-xs text-muted-foreground">
          Generate a shareable link to view your resume online
        </p>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 justify-center transition-all hover:bg-slate-100"
          onClick={generateShareLink}
          disabled={isGenerating}
        >
          <Share2 className="h-4 w-4" />
          <span>{isGenerating ? 'Generating link...' : 'Generate shareable link'}</span>
        </Button>

        {shareLink && (
          <div className="flex gap-2">
            <Input 
              value={shareLink} 
              readOnly 
              className="text-xs"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={copyToClipboard}
              className="flex-shrink-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}