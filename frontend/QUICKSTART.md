# Orchestra 8000 - Quick Start Guide

## 🚀 Getting Started in 30 Seconds

### Option 1: Direct Browser Access (Recommended)

1. Navigate to the `frontend` folder
2. Double-click `index.html`
3. The dashboard will open in your default browser

### Option 2: Local Web Server

**Using Python:**
```bash
cd frontend
python -m http.server 8000
```
Then open: http://localhost:8000

**Using Node.js (npx):**
```bash
cd frontend
npx serve
```

**Using PHP:**
```bash
cd frontend
php -S localhost:8000
```

## 📸 What You'll See

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [Sidebar]  │  [Top Bar - Status & User]                    │
├─────────────┼───────────────────────────────────────────────┤
│             │                                                │
│   [Plan     │         [Orchestration Flow]                  │
│    Mode]    │    Task → Plan → Route → Execute → Validate   │
│             │                                                │
│   Reasoning │         [Traceability Panel]                  │
│   Tree      │         Terminal Logs (BobShell)              │
│             │                                                │
├─────────────┴───────────────────────────────────────────────┤
│                    [Model Routing Panel]                     │
│              IBM Bob | Groq | Ollama                         │
└──────────────────────────────────────────────────────────────┘
                                    [Harmonic Assistant] →
```

## 🎮 Interactive Features

### Try These Actions:

1. **Click Sidebar Icons** - Switch between different views
2. **Hover Flow Nodes** - See animated effects and details
3. **Click Model Cards** - Switch active AI model
4. **Click "Approve" Button** - Approve workflow execution
5. **Type in Harmonic Chat** - Interact with the assistant
6. **Watch Terminal Logs** - Real-time execution feedback

## 🎨 Visual Highlights

- **IBM Blue (#0F62FE)** - Primary actions and active states
- **Yellow (#FFD600)** - Accent highlights and active processing
- **Glowing Effects** - On active nodes and Harmonic avatar
- **Smooth Animations** - 250ms transitions throughout
- **Glassmorphism** - Frosted glass effect on panels

## 🔧 Customization Quick Tips

### Change Primary Color
Edit `frontend/css/styles.css` line 7:
```css
--ibm-blue: #0F62FE; /* Change to your color */
```

### Add Your Logo
Replace the SVG in `frontend/index.html` around line 18

### Modify Flow Steps
Edit flow nodes in `frontend/index.html` starting at line 180

## 📊 System Status Indicators

- **Green Dot** - All systems operational
- **Yellow Highlight** - Active processing
- **Blue Glow** - Selected/Active state
- **Checkmark** - Completed step

## 🤖 Harmonic Assistant

The intelligent assistant on the right provides:
- Real-time system insights
- Performance recommendations
- Cost optimization suggestions
- Interactive chat interface

## 🐛 Troubleshooting

**Dashboard not loading?**
- Ensure all files are in the `frontend` folder
- Check browser console (F12) for errors
- Try a different browser (Chrome/Edge recommended)

**Animations not working?**
- Clear browser cache (Ctrl+Shift+Delete)
- Ensure JavaScript is enabled
- Check if `js/app.js` loaded correctly

**Styling looks broken?**
- Verify `css/styles.css` is in the correct location
- Check if IBM Plex Sans font loaded from Google Fonts
- Try hard refresh (Ctrl+F5)

## 📱 Browser Compatibility

✅ Chrome 90+
✅ Edge 90+
✅ Firefox 88+
✅ Safari 14+

## 🎯 Next Steps

1. Explore all interactive elements
2. Check browser console for Orchestra object
3. Review `README.md` for detailed documentation
4. Customize colors and branding
5. Integrate with backend API (see backend folder)

## 💡 Pro Tips

- Open browser DevTools (F12) to see console logs
- Type `Orchestra.state` in console to see current state
- Use `Orchestra.addLogEntry('info', 'message')` to add custom logs
- Resize window to see responsive behavior

---

**Enjoy Orchestra 8000!** 🎼

For detailed documentation, see `README.md`