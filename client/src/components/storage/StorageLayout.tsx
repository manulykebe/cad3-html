import React, { useState, useRef, useEffect } from 'react';
import { Pin, PinOff } from 'lucide-react';
import { Cad3Viewer } from '../three/Cad3Viewer';
import { FileTree } from './FileTree.tsx';

const StorageLayout: React.FC = () => {
  // Panel state
  const [leftPanelPinned, setLeftPanelPinned] = useState(true);
  const [rightPanelPinned, setRightPanelPinned] = useState(true);
  const [leftPanelWidth, setLeftPanelWidth] = useState(256);
  const [rightPanelWidth, setRightPanelWidth] = useState(256);
  const [leftPanelPrevWidth, setLeftPanelPrevWidth] = useState(256);
  const [rightPanelPrevWidth, setRightPanelPrevWidth] = useState(256);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [leftPanelHovered, setLeftPanelHovered] = useState(false);
  const [rightPanelHovered, setRightPanelHovered] = useState(false);

  // Refs for resize handling
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // File handling
  const handleFileSelect = async (path: string) => {
    try {
      const response = await fetch(`/api/files/download/${encodeURIComponent(path)}`, {
        headers: {
          'Authorization': `Bearer ${document.cookie.split('token=')[1]}`
        }
      });
      const data = await response.json();
      setSelectedFile(JSON.parse(data.content));
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  // Resize handlers
  const handleMouseMove = (e: MouseEvent) => {
    if (isResizingLeft) {
      const newWidth = Math.max(100, Math.min(window.innerWidth * 0.5, e.clientX));
      setLeftPanelWidth(newWidth);
      setLeftPanelPrevWidth(newWidth);
    } else if (isResizingRight) {
      const newWidth = Math.max(100, Math.min(window.innerWidth * 0.5, window.innerWidth - e.clientX));
      setRightPanelWidth(newWidth);
      setRightPanelPrevWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
  };

  useEffect(() => {
    if (isResizingLeft || isResizingRight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizingLeft, isResizingRight]);

  // Panel hover handlers
  useEffect(() => {
    if (!leftPanelPinned) {
      setLeftPanelWidth(leftPanelHovered ? leftPanelPrevWidth : 20);
    }
  }, [leftPanelHovered, leftPanelPinned]);

  useEffect(() => {
    if (!rightPanelPinned) {
      setRightPanelWidth(rightPanelHovered ? rightPanelPrevWidth : 20);
    }
  }, [rightPanelHovered, rightPanelPinned]);

  // Determine if transitions should be active
  const shouldAnimate = !isResizingLeft && !isResizingRight;
  const transitionStyle = shouldAnimate ? 'width 300ms ease-in-out' : 'none';
  const marginTransitionStyle = shouldAnimate ? 'margin 300ms ease-in-out' : 'none';

  return (
    <div className="relative h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Left Panel */}
      <div 
        ref={leftPanelRef}
        className="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-10 overflow-x-hidden overflow-y-auto"
        style={{
          width: `${leftPanelWidth}px`,
          transition: transitionStyle
        }}
        onMouseEnter={() => setLeftPanelHovered(true)}
        onMouseLeave={() => setLeftPanelHovered(false)}
      >
        <div className="absolute top-2 right-2 z-20">
          <button
            onClick={() => {
              setLeftPanelPinned(!leftPanelPinned);
              if (!leftPanelPinned) {
                setLeftPanelWidth(leftPanelPrevWidth);
              }
            }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {leftPanelPinned ? (
              <PinOff className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <Pin className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
        <div className="p-0 mt-10">
          <FileTree onFileSelect={handleFileSelect} />
        </div>
        {leftPanelPinned && (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500"
            onMouseDown={() => setIsResizingLeft(true)}
          />
        )}
      </div>

      {/* Detection zone for left panel */}
      {!leftPanelPinned && (
        <div
          className="fixed top-0 left-0 w-5 h-full z-5"
          onMouseEnter={() => setLeftPanelHovered(true)}
        />
      )}

      {/* Main Content */}
      <div 
        className="h-full overflow-auto"
        style={{
          marginLeft: leftPanelPinned ? `${leftPanelWidth}px` : '20px',
          marginRight: rightPanelPinned ? `${rightPanelWidth}px` : '20px',
          transition: marginTransitionStyle
        }}
      >
        {selectedFile ? (
          <Cad3Viewer data={selectedFile} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Select a file to view
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div
        ref={rightPanelRef}
        className="fixed top-0 right-0 h-full bg-white dark:bg-gray-800 shadow-lg z-10 overflow-x-hidden overflow-y-auto"
        style={{
          width: `${rightPanelWidth}px`,
          transition: transitionStyle
        }}
        onMouseEnter={() => setRightPanelHovered(true)}
        onMouseLeave={() => setRightPanelHovered(false)}
      >
        <div className="absolute top-2 left-2 z-20">
          <button
            onClick={() => {
              setRightPanelPinned(!rightPanelPinned);
              if (!rightPanelPinned) {
                setRightPanelWidth(rightPanelPrevWidth);
              }
            }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {rightPanelPinned ? (
              <PinOff className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <Pin className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
        <div className="p-0 mt-10">
          {selectedFile && (
            <div className="text-sm text-gray-600 dark:text-gray-300 p-4">
              <h3 className="font-semibold mb-2">File Details</h3>
              <p>Model: {selectedFile.model}</p>
            </div>
          )}
        </div>
        {rightPanelPinned && (
          <div
            className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-blue-500"
            onMouseDown={() => setIsResizingRight(true)}
          />
        )}
      </div>

      {/* Detection zone for right panel */}
      {!rightPanelPinned && (
        <div
          className="fixed top-0 right-0 w-5 h-full z-5"
          onMouseEnter={() => setRightPanelHovered(true)}
        />
      )}
    </div>
  );
};

export default StorageLayout;