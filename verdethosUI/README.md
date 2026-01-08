# VerdethosUI

Angular web application for Producer Management with RBAC (Role-Based Access Control) implementation.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Angular CLI** (optional, but recommended) - Install globally with:
  ```bash
  npm install -g @angular/cli
  ```

## 📁 Project Structure

```
verdethosUI/
├── src/
│   ├── app/
│   │   ├── app.component.ts          # Root component
│   │   ├── app.component.html        # Root template
│   │   ├── app.component.css         # Root styles
│   │   ├── app.config.ts             # Application configuration
│   │   ├── app.routes.ts             # Route definitions
│   │   ├── data/
│   │   │   └── mock-producers.ts     # Mock producer data
│   │   ├── guards/
│   │   │   └── rbac.guard.ts         # RBAC route guard
│   │   ├── layout/                    # Layout components
│   │   │   ├── header/               # Header component
│   │   │   ├── sidebar/              # Sidebar component
│   │   │   └── main-layout/          # Main layout wrapper
│   │   ├── models/                   # Type definitions
│   │   │   ├── user.model.ts
│   │   │   ├── producer.model.ts
│   │   │   ├── permission.model.ts
│   │   │   └── index.ts
│   │   ├── pages/                    # Page components
│   │   │   ├── producer-list/       # Producer List page
│   │   │   └── placeholder/         # Placeholder page
│   │   ├── services/                 # Business logic services
│   │   │   ├── rbac.service.ts       # RBAC service
│   │   │   ├── producer.service.ts   # Producer service
│   │   │   ├── tenant.service.ts     # Tenant service
│   │   │   └── index.ts
│   │   └── shared/                   # Shared components
│   │       ├── components/          # Reusable components
│   │       │   ├── breadcrumb/
│   │       │   ├── status-tabs/
│   │       │   ├── search-filter/
│   │       │   ├── kebab-menu/
│   │       │   ├── pagination/
│   │       │   ├── data-table/
│   │       │   └── role-switcher/
│   │       ├── directives/
│   │       │   └── has-permission.directive.ts
│   │       └── pipes/
│   │           └── has-permission.pipe.ts
│   ├── index.html                    # Main HTML file
│   ├── main.ts                       # Application entry point
│   └── styles.css                    # Global styles
├── angular.json                      # Angular CLI configuration
├── package.json                      # Project dependencies
├── tsconfig.json                     # TypeScript configuration
├── tsconfig.app.json                  # TypeScript app configuration
└── README.md                          # This file
```

## 🚀 Installation

Follow these steps to install all required dependencies:

1. **Navigate to the project directory:**
   ```bash
   cd verdethosUI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   Or if you prefer using yarn:
   ```bash
   yarn install
   ```

3. **Wait for installation to complete:**
   This will install all the dependencies listed in `package.json`, including:
   - Angular 20.3.0
   - RxJS 7.8.0
   - TypeScript 5.8.0
   - Other required packages

## ▶️ Running the Project

Once dependencies are installed, run the project using Angular CLI:

```bash
ng serve
```

Or using npm:

```bash
npm start
```

This will:
- Start the development server
- Open the application in your default browser at `http://localhost:4200`
- Enable live reload for automatic updates when you make changes

## 🌐 Viewing in Browser

After running the project:

1. The development server will start and display the local URL at `http://localhost:4200`
2. Open your web browser
3. Navigate to the displayed URL
4. You should see the **Producer List** page with:
   - A header with the Verdethos theme color (#2a524e)
   - Sidebar navigation with Producers and Farms
   - Producer list table with search, filtering, and pagination
   - Status tabs (In-processing, Approved)
   - Kebab menu for row-level actions

## 🔧 Technology Stack

- **Framework**: Angular 20.3.0
- **Language**: TypeScript 5.8.0
- **Reactive Programming**: RxJS 7.8.0
- **State Management**: Angular Signals
- **Build Tool**: Angular CLI
- **Styling**: Custom CSS (no UI framework)

## 📝 Additional Commands

### Building for Production

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory.

### Running Unit Tests

```bash
ng test
```

### Code Scaffolding

To generate a new component:

```bash
ng generate component component-name
```

## Implementation Details

### 7. Web UI — Producer List Page (Angular)

The Producer List Page is a fully functional Angular component that displays producer data in a table format with features including search, filtering, pagination, and status-based actions. The implementation includes a responsive layout with header navigation, sidebar menu, status tabs, search functionality, and a kebab menu for row-level actions. All code for this implementation is available in the GitHub repository at [https://github.com/pavan0192/verdethos/tree/main/verdethosUI](https://github.com/pavan0192/verdethos/tree/main/verdethosUI).

### 8. RBAC — Minimal but Real

The Role-Based Access Control (RBAC) implementation provides a minimal but functional permission system with three levels of access control: main menu visibility, route guards, and row-level action permissions. The system supports multiple roles (Admin, Compliance, Viewer) with granular permission checks using directives, pipes, and service methods. All RBAC implementation code is available in the GitHub repository at [https://github.com/pavan0192/verdethos/tree/main/verdethosUI](https://github.com/pavan0192/verdethos/tree/main/verdethosUI).

### 9. Mobile — One Small Proof (Not a Full App)

A minimal mobile proof-of-concept implementation using Ionic and Angular, demonstrating a single Producer Details page with responsive design. The implementation includes a centered card layout, theme integration matching the web application, and basic producer information display. This serves as a proof of concept rather than a full mobile application. All mobile implementation code is available in the GitHub repository at [https://github.com/pavan0192/verdethos/tree/main/verdethosIonic](https://github.com/pavan0192/verdethos/tree/main/verdethosIonic).

### 10. Backend — Skeleton Only (Optional but Preferred)

A minimal Node.js backend API skeleton providing a GET endpoint for producers with tenant isolation middleware. The implementation includes in-memory mock data, basic error handling, and pagination support. This serves as a foundation for future backend development. All backend implementation code is available in the GitHub repository at [https://github.com/pavan0192/verdethos/tree/main/verdethosBE](https://github.com/pavan0192/verdethos/tree/main/verdethosBE).

## 📄 License

This project is private and proprietary.
