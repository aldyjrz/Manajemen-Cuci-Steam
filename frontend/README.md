# Learning React Starter Template
 
### 1. Clone atau ekstrak project

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Jalankan development server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173`

### 4. Build untuk production

```bash
npm run build
```

Output akan berada di folder `dist/`

## Project

```
src/
├── components/          # Reusable components
│   ├── AppLayout.tsx   # Layout wrapper (Navbar + Sidebar)
│   ├── Navbar.tsx      # Top navigation bar
│   └── Sidebar.tsx     # Side navigation menu
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Dashboard.tsx   # Dashboard page
│   └── Attendance.tsx  # Attendance page with geolocation & camera
├── routes/
│   └── index.tsx       # Route configuration
├── types/              # TypeScript types
├── services/           # API services (optional)
├── App.tsx             # Root component
├── main.tsx            # Entry point
├── index.css           # Global styles
└── App.css             # App specific styles
```
 

- **React 18** - UI library
- **React Router v6** - Routing
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **ESLint** - Code linting
 
"# React-starter-router" 
