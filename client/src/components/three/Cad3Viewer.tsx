import React, { useRef, useEffect, useState } from 'react';
import { useThreeScene } from './hooks/useThreeScene';
import { Maximize2, Minimize2 } from 'lucide-react';
import { createPortal } from 'react-dom';

interface Cad3ViewerProps {
  data: any;
  className?: string;
}

export const Cad3Viewer: React.FC<Cad3ViewerProps> = ({ data, className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ViewerContent = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Initialize Three.js scene
    useThreeScene(containerRef, data);

    // Handle container resize
    useEffect(() => {
      if (!containerRef.current) return;
      
      const resizeObserver = new ResizeObserver(() => {
        // Trigger window resize to update renderer
        window.dispatchEvent(new Event('resize'));
      });
      
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }, []);

    return (
      <div className="relative w-full h-full">
        <div 
          ref={containerRef}
          className={`bg-gray-100 w-full h-full ${className || ''}`}
        />
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-lg shadow-md transition-colors"
          aria-label={isModalOpen ? 'Close viewer' : 'Open viewer'}
        >
          {isModalOpen ? (
            <Minimize2 className="w-5 h-5 text-gray-700" />
          ) : (
            <Maximize2 className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>
    );
  };

  return (
    <>
      {!isModalOpen ? (
        <div className="w-full h-[400px]">
          <ViewerContent />
        </div>
      ) : (
        createPortal(
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white w-[90vw] h-[90vh] rounded-lg p-4">
              <ViewerContent />
            </div>
          </div>,
          document.body
        )
      )}
    </>
  );
};