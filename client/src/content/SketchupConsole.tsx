import React from 'react';
// import './SketchupConsole/css/bootstrap.css';
// import './SketchupConsole/css/console.css';
import editorIcon from './SketchupConsole/images/editor.svg';
import clearIcon from './SketchupConsole/images/clear.svg';
import consoleIcon from './SketchupConsole/images/console.svg';
import helpIcon from './SketchupConsole/images/help.svg';
import selectIcon from './SketchupConsole/images/select.svg';
import saveIcon from './SketchupConsole/images/save.svg';
import menuIcon from './SketchupConsole/images/menu.svg';

interface ToolbarProps {
  side: 'console' | 'editor';
  onSwitchView?: () => void;
  onClear?: () => void;
  onHelp?: () => void;
  onSelect?: () => void;
  onSave?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  side, 
  onSwitchView, 
  onClear,
  onHelp,
  onSelect,
  onSave
}) => {
  const isConsole = side === 'console';

  return (
    <div id={`${side}Toolbar`} className="toolbar unselectable">
      <span className="toolbar-left">
        {isConsole ? (
          <>
            <button 
              id="buttonConsoleSwitchToEditor"
              onClick={onSwitchView}
              title="Switch to Editor"
              aria-label="Switch to Editor"
            >
              <img src={editorIcon} alt="Editor" />
            </button>
            <button 
              id="buttonConsoleClear"
              onClick={onClear}
              title="Clear Console"
              aria-label="Clear Console"
            >
              <img src={clearIcon} alt="Clear" />
            </button>
          </>
        ) : (
          <button 
            id="buttonEditorSwitchToConsole"
            onClick={onSwitchView}
            title="Switch to Console"
            aria-label="Switch to Console"
          >
            <img src={consoleIcon} alt="Console" />
          </button>
        )}
      </span>
      <span className="toolbar-center toolbar-center-expandable-outer">
        <div className="toolbar-center-expandable-inner">
          <div className="toolbar-center-centering">
            {isConsole ? (
              <h1>Console</h1>
            ) : (
              <>
                <h1 id="labelEditorFilename">Unsaved document</h1>
                <h2 id="labelEditorFilepath"></h2>
              </>
            )}
          </div>
        </div>
      </span>
      <span className="toolbar-right">
        <button 
          id={`button${isConsole ? 'Console' : 'Editor'}Help`}
          onClick={onHelp}
          title="Help"
          aria-label="Help"
        >
          <img src={helpIcon} alt="Help" />
        </button>
        {isConsole ? (
          <button 
            id="buttonConsoleSelect"
            onClick={onSelect}
            title="Select"
            aria-label="Select"
          >
            <img src={selectIcon} alt="Select" />
          </button>
        ) : (
          <button 
            id="buttonEditorSave"
            onClick={onSave}
            title="Save"
            aria-label="Save"
          >
            <img src={saveIcon} alt="Save" />
          </button>
        )}
        <span className="dropdown">
          <button
            id={`button${isConsole ? 'Console' : 'Editor'}Menu`}
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img src={menuIcon} alt="Menu" />
          </button>
          <ul
            id={`menu${isConsole ? 'Console' : 'Editor'}`}
            className="dropdown-menu menu right"
            aria-labelledby={`button${isConsole ? 'Console' : 'Editor'}Menu`}
          />
        </span>
      </span>
    </div>
  );
};

export default function SketchupConsoleContent() {
  return (
    <div>
      <Toolbar side="console" />

      <div id="consoleContentWrapper">
        <div id="consoleContent">
          <div id="consoleOutputFakeGutter" />
          <div id="consoleOutput" />
          <div id="consoleInput" />
        </div>
      </div>

      <Toolbar side="editor" />

      <div id="editorContentWrapper">
        <div id="editorInput" />
      </div>
    </div>
  );
}
