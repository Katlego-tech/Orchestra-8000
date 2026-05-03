# Dashboard Structure Documentation

## Overview
The Orchestra 8000 dashboard has been refactored into a modern tab-based interface with proper separation of concerns.

## Tab Structure

### 1. Dashboard Tab (Default)
- **Purpose**: Overview and quick stats
- **Components**:
  - Stats Cards: Active Tasks, Success Rate, Models Active, Avg Response Time
  - Recent Activity Panel: Shows recent system events and actions
- **Layout**: Grid-based responsive layout

### 2. Orchestration Tab
- **Purpose**: Real-time orchestration workflow visualization
- **Components**:
  - Plan Mode Panel (Left): Reasoning tree with task analysis
  - Orchestration Flow (Center): Visual flow diagram with nodes
  - Execution Trace (Bottom): BobShell terminal with logs
- **Layout**: 2-column grid (plan on left, flow and trace on right)

### 3. Models Tab
- **Purpose**: AI model management and comparison
- **Components**:
  - Model Cards: IBM Bob (watsonx.ai), Groq, Ollama
  - Metrics: Cost, Speed, Trust ratings with visual bars
  - Active Status: Shows currently active model
- **Layout**: Full-width panel with model cards

### 4. Analytics Tab
- **Purpose**: Performance metrics and insights
- **Components**:
  - Task Completion Rate Chart
  - Model Performance Chart
  - Cost Analysis Chart
  - Response Times Chart
- **Layout**: 2x2 grid of chart cards
- **Note**: Chart visualizations are placeholders for future implementation

### 5. Settings Tab
- **Purpose**: System configuration
- **Components**:
  - General Settings: Default AI provider, auto-approve tasks
  - Notifications: Enable notifications, email alerts
  - API Configuration: Backend URL, API key
- **Layout**: 3-column grid of settings sections

## Navigation
- **Sidebar Icons**: Click any icon to switch between tabs
- **Active State**: Current tab is highlighted in the sidebar
- **Page Title**: Updates dynamically based on selected tab
- **Tooltips**: Hover over sidebar icons to see tab names

## Key Features

### Tab Switching
- Smooth fade-in animations when switching tabs
- State preservation within each tab
- URL-independent navigation (can be enhanced with hash routing)

### Responsive Design
- Mobile-friendly breakpoints
- Grid layouts adapt to screen size
- Sidebar remains accessible on all devices

### Component Reusability
- Panel components are consistent across tabs
- Shared styling for cards, buttons, and forms
- Modular CSS structure

## Technical Implementation

### HTML Structure
```
main.main-content
  ├── header.top-bar (page title + status)
  └── div.tab-content-container
      ├── div#dashboardTab.tab-pane.active
      ├── div#orchestrationTab.tab-pane
      ├── div#modelsTab.tab-pane
      ├── div#analyticsTab.tab-pane
      └── div#settingsTab.tab-pane
```

### CSS Classes
- `.tab-pane`: Container for each tab's content
- `.tab-pane.active`: Currently visible tab
- `.full-width`: Panels that span full width
- `.stats-grid`, `.analytics-grid`, `.settings-grid`: Responsive grids

### JavaScript Functions
- `switchTab(tabName)`: Handles tab switching logic
- `initializeNavigation()`: Sets up sidebar click handlers
- Updates page title and logs tab switches

## Future Enhancements
1. Add URL hash routing for bookmarkable tabs
2. Implement actual chart visualizations in Analytics tab
3. Add keyboard shortcuts for tab navigation
4. Persist last viewed tab in localStorage
5. Add tab-specific loading states
6. Implement settings save functionality

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- ES6 JavaScript features used

## Performance
- Lazy loading can be added for heavy components
- Tab content is rendered but hidden (not destroyed)
- Smooth animations with CSS transitions
- Minimal JavaScript overhead for tab switching