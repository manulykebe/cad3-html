import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileJson,
  FolderOpen,
  FolderClosed,
} from 'lucide-react';

interface FileTreeProps {
  onFileSelect: (path: string) => void;
}

interface TreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: TreeNode[];
  loaded?: boolean;
}

export const FileTree: React.FC<FileTreeProps> = ({ onFileSelect }) => {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const fetchFiles = async (path: string = '') => {
    try {
      const response = await fetch('/api/files/list', {
        headers: {
          Authorization: `Bearer ${document.cookie.split('token=')[1]}`,
        },
      });
      const files = await response.json();

      // Build tree structure
      const root: TreeNode[] = [];
      files.forEach((file: string) => {
        const parts = file.split('/');
        let currentLevel = root;

        parts.forEach((part, index) => {
          const isLast = index === parts.length - 1;
          const currentPath = parts.slice(0, index + 1).join('/');
          let node = currentLevel.find((n) => n.name === part);

          if (!node) {
            node = {
              name: part,
              path: currentPath,
              isDirectory: !isLast,
              children: !isLast ? [] : undefined,
            };
            currentLevel.push(node);
          }

          if (!isLast) {
            currentLevel = node.children!;
          }
        });
      });

      setTree(root);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const toggleNode = (path: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.path);

    return (
      <div key={node.path} style={{ marginLeft: `16px` }}>
        <div
          className={`flex items-center py-0 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer ${
            node.isDirectory ? '' : 'text-gray-600 dark:text-gray-300'
          }`}
          onClick={() => {
            if (node.isDirectory) {
              toggleNode(node.path);
            } else {
              onFileSelect(node.path);
            }
          }}
        >
          {node.isDirectory ? (
            <>
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0 dark:text-blue-800 " />
              ) : (
                <FolderClosed className="w-4 h-4 mr-2 text-blue-800 flex-shrink-0 dark:text-blue-500 " />
              )}
            </>
          ) : (
            <>
              <FileJson className="w-4 h-4 mr-2 text-blue-700 flex-shrink-0 dark:text-blue-300 " />
            </>
          )}
          <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{node.name}</span>
        </div>
        {node.isDirectory && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-hidden">{tree.map((node) => renderNode(node))}</div>
  );
};
