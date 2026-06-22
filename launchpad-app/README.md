# 🚀 LaunchPad Frontend

LaunchPad Frontend is the **user interface of the LaunchPad Startup Collaboration Platform**, built with **React + TypeScript**.  
It connects with the backend API to manage startups, tasks, todos, file uploads, and email-based collaboration.

---

## 📌 Features

### 🔐 Authentication System
- JWT login & registration flow
- Protected routes (route guards)
- Auto token persistence (localStorage)
- Secure session handling

---

### 🏢 Startup Profile Module
- Create and manage startup profile (one per email)
- Company details:
  - Company name
  - Member count
  - Industry
  - Stage
- Prevent duplicate profile creation
- Profile dashboard view

---

### ✅ Task Management UI
- Create tasks with form validation
- Assign tasks to users via email
- Update task status (pending / completed)
- View task list in dashboard
- Multi-user task assignment support

---

### 📎 File Upload System
- Upload single or multiple files per task
- Cloudinary integrated media preview
- File attachments shown in task details
- Drag & drop support (if enabled)

---

### 📝 Todo Module
- Full CRUD todo system
- Mark as completed / pending toggle
- User-specific todo filtering
- Real-time UI updates

---

### 📧 Email-Driven Collaboration
- Task assignment notifications
- Status update alerts
- Backend-triggered email system integration

---

### 🎨 UI & UX
- Responsive design (mobile + desktop)
- Clean dashboard layout
- Sidebar navigation
- Reusable UI components
- Loading states & error handling

---

## 🛠 Tech Stack

- **Frontend:** React.js
- **Language:** TypeScript
- **State Management:** React Hooks / Context API
- **Routing:** React Router DOM
- **API Calls:** Axios / Fetch
- **Styling:** CSS / Tailwind CSS (if used)
- **Auth:** JWT (stored in localStorage)

---

## 📁 Project Structure




# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
