import React, { useState } from 'react';
import { Pin, PinOff } from 'lucide-react';
import { Cad3Viewer } from '../three/Cad3Viewer';
import { FileTree } from './FileTree.tsx';

const StorageLayout: React.FC = () => {
  const [leftPanelPinned, setLeftPanelPinned] = useState(true);
  const [rightPanelPinned, setRightPanelPinned] = useState(true);
  const [selectedFile, setSelectedFile] = useState<any>(null);

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

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Panel */}
      <div 
        className={`relative ${
          leftPanelPinned ? 'w-64' : 'w-0 hover:w-64'
        } transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg overflow-hidden`}
      >
        <button
          onClick={() => setLeftPanelPinned(!leftPanelPinned)}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {leftPanelPinned ? (
            <PinOff className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <Pin className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          )}
        </button>
        <div className="p-0 mt-10">
          <FileTree onFileSelect={handleFileSelect} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
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
        className={`relative ${
          rightPanelPinned ? 'w-64' : 'w-0 hover:w-64'
        } transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg overflow-hidden`}
      >
        <button
          onClick={() => setRightPanelPinned(!rightPanelPinned)}
          className="absolute top-2 left-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {rightPanelPinned ? (
            <PinOff className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <Pin className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          )}
        </button>
        <div className="p-0 mt-10">
          {/* Add file details or additional controls here */}
          {selectedFile && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <h3 className="font-semibold mb-2">File Details</h3>
              <p>Model: {selectedFile.model}</p>
              {/* Add more file details as needed */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorageLayout;