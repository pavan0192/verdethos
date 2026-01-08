# Angular Web Application Architecture

## High-Level Architecture Overview

This document provides a comprehensive high-level view of the Angular web application architecture, covering all layers from data management to UI components.

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Angular Application Architecture                     │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      DATA LAYER                                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │  │
│  │  │   Models     │  │   Services   │  │   State      │          │  │
│  │  │              │  │              │  │   Management │          │  │
│  │  │ - User       │  │ - RbacService│  │              │          │  │
│  │  │ - Producer   │  │ - Producer   │  │ - Signals    │          │  │
│  │  │ - Permission │  │   Service    │  │ - Reactive   │          │  │
│  │  │ - Enums      │  │ - Tenant     │  │   Updates    │          │  │
│  │  │              │  │   Service    │  │              │          │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │  │
│  │         │                 │                 │                    │  │
│  │         └─────────────────┴─────────────────┘                    │  │
│  │                           │                                       │  │
│  └───────────────────────────┼───────────────────────────────────────┘  │
│                               │                                          │
│                               ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    SECURITY LAYER                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │  │
│  │  │   Guards     │  │  Directives   │  │    Pipes     │          │  │
│  │  │              │  │              │  │              │          │  │
│  │  │ - rbacGuard  │  │ - *hasPermission│ - hasPermission│          │  │
│  │  │              │  │              │  │              │          │  │
│  │  │ Protects:    │  │ Used by:     │  │ Used by:     │          │  │
│  │  │ - Routes     │  │ - Components │  │ - Templates  │          │  │
│  │  │              │  │ - Templates  │  │              │          │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │  │
│  │         │                 │                 │                    │  │
│  │         └─────────────────┴─────────────────┘                    │  │
│  └───────────────────────────┼───────────────────────────────────────┘  │
│                               │                                          │
│                               ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      LAYOUT LAYER                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │  │
│  │  │   Header     │  │   Sidebar    │  │ Main Layout  │          │  │
│  │  │              │  │              │  │              │          │  │
│  │  │ - Main Menu  │  │ - Nav Items  │  │ - Wraps Pages│          │  │
│  │  │ - User Ctrl  │  │ - Active     │  │ - Router     │          │  │
│  │  │ - Role Switcher│ │   State      │  │   Outlet    │          │  │
│  │  │              │  │              │  │ - Breadcrumb │          │  │
│  │  │ Consumes:    │  │ Consumes:    │  │              │          │  │
│  │  │ - RbacService│  │ - RbacService│  │ Consumes:    │          │  │
│  │  │ - Router     │  │ - Router     │  │ - Router     │          │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │  │
│  │         │                 │                 │                    │  │
│  │         └─────────────────┴─────────────────┘                    │  │
│  └───────────────────────────┼───────────────────────────────────────┘  │
│                               │                                          │
│                               ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                       PAGE LAYER                                 │  │
│  │  ┌──────────────────────────────────────────────────────────┐   │  │
│  │  │              Feature Pages                                 │   │  │
│  │  │                                                           │   │  │
│  │  │  - Producer List Page                                     │   │  │
│  │  │  - Placeholder Pages (Farms, Shipments, etc.)            │   │  │
│  │  │                                                           │   │  │
│  │  │  Consumes:                                                │   │  │
│  │  │  ├── Services (ProducerService, RbacService)              │   │  │
│  │  │  ├── Shared Components                                    │   │  │
│  │  │  └── Directives (*hasPermission)                         │   │  │
│  │  │                                                           │   │  │
│  │  │  Protected by:                                           │   │  │
│  │  │  └── Route Guards (rbacGuard)                           │   │  │
│  │  └──────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────┼───────────────────────────────────────┘  │
│                               │                                          │
│                               ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                 SHARED COMPONENTS LAYER                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │
│  │  │ Status Tabs  │  │Search Filter │  │  Pagination  │         │  │
│  │  │              │  │              │  │              │         │  │
│  │  │ - Tab display│  │ - Search     │  │ - Page nav   │         │  │
│  │  │ - Counts     │  │ - Filters    │  │ - Page size  │         │  │
│  │  │ - Active     │  │ - Chips      │  │ - Info       │         │  │
│  │  │              │  │              │  │              │         │  │
│  │  │ Consumes:    │  │ Consumes:    │  │ Consumes:    │         │  │
│  │  │ - Producer   │  │ - Producer   │  │ - Producer   │         │  │
│  │  │   Service    │  │   Service    │  │   Service    │         │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │  │
│  │         │                 │                 │                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │
│  │  │Kebab Menu    │  │ Breadcrumb   │  │ Data Table   │         │  │
│  │  │              │  │              │  │              │         │  │
│  │  │ - Actions    │  │ - Navigation │  │ - Generic    │         │  │
│  │  │ - Permissions│ │   path       │  │   table      │         │  │
│  │  │              │  │              │  │              │         │  │
│  │  │ Consumes:    │  │ Consumes:    │  │ Consumes:    │         │  │
│  │  │ - RbacService│ │ - Router     │  │ - Data input │         │  │
│  │  │ - *hasPermission│              │  │              │         │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │  │
│  │         │                 │                 │                   │  │
│  │         └─────────────────┴─────────────────┘                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Dependency Flow:                                                        │
│                                                                          │
│  Models → Services → Guards/Directives → Layouts → Pages → Shared      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Data Layer

The data layer is the foundation of the application, providing type definitions, business logic, and state management.

### 1.1 Models

**Location**: `src/app/models/`

**Purpose**: Type definitions and interfaces used throughout the application

**Components**:
- **`user.model.ts`**: User interface and UserRole enum
- **`producer.model.ts`**: Producer interface, ProducerStatus enum, ProducerType enum, filtering and pagination interfaces
- **`permission.model.ts`**: Permission enum and RolePermissions interface
- **`index.ts`**: Barrel file for easy imports

**Characteristics**:
- Pure TypeScript interfaces (no classes)
- Enums for type safety
- Shared across all layers

### 1.2 Services

**Location**: `src/app/services/`

**Purpose**: Business logic, data management, and state management using Angular Signals

**Components**:

#### RbacService
- **Purpose**: Role-Based Access Control management
- **Responsibilities**:
  - Current user management (signal-based)
  - Permission checking (hasPermission, hasAnyPermission, hasAllPermissions)
  - Role-to-permission mapping
  - Action authorization (canPerformProducerAction)
  - Route access validation
- **State**: Uses Angular Signals for reactive user state

#### ProducerService
- **Purpose**: Producer data management
- **Responsibilities**:
  - Producer CRUD operations
  - Filtering (search, status, type, EUDR)
  - Pagination management
  - Status counts calculation
  - Data signals for reactive updates
- **State**: Uses Angular Signals for reactive data state

#### TenantService
- **Purpose**: Multi-tenant support
- **Responsibilities**:
  - Current tenant management
  - Tenant ID validation
  - Resource ownership verification

**Characteristics**:
- Injectable services (providedIn: 'root')
- Signal-based reactive state
- Centralized business logic
- Consumed by components, guards, and directives

### 1.3 State Management

**Approach**: Angular Signals (reactive primitives)

**Implementation**:
- Services expose signals for reactive data
- Components subscribe to signals for automatic updates
- Directives react to signal changes for permission updates

**Benefits**:
- Fine-grained reactivity
- Automatic change detection
- No manual subscription management
- Type-safe state

---

## 2. Security Layer

The security layer enforces RBAC at multiple levels to ensure comprehensive access control.

### 2.1 Route Guards

**Location**: `src/app/guards/`

**Component**: `rbac.guard.ts`

**Purpose**: Protect routes based on user permissions

**How It Works**:
- Functional guard factory that takes a required permission
- Executes before route component loads
- Checks permission via RbacService
- Allows or denies route activation
- Redirects unauthorized users

**Usage**: Applied to all routes via `canActivate` in route configuration

**Protection Level**: Route-level (prevents unauthorized navigation)

### 2.2 Directives

**Location**: `src/app/shared/directives/`

**Component**: `has-permission.directive.ts`

**Purpose**: Conditionally render DOM elements based on permissions

**How It Works**:
- Structural directive (`*hasPermission`)
- Checks permissions via RbacService
- Reactively updates when user role changes (via signals)
- Creates or removes DOM elements (not just hides)

**Usage**: Applied to templates for conditional rendering
- Main menu items
- Sidebar navigation items
- Kebab menu actions
- Action buttons

**Protection Level**: UI-level (hides unauthorized elements)

### 2.3 Pipes

**Location**: `src/app/shared/pipes/`

**Component**: `has-permission.pipe.ts`

**Purpose**: Permission checking in template expressions

**Usage**: Used in template bindings for conditional logic

---

## 3. Layout Layer

The layout layer provides the application shell and consistent structure across all pages.

### 3.1 Header Component

**Location**: `src/app/layout/header/`

**Purpose**: Top navigation bar

**Features**:
- Logo display
- Main menu items (Supplier Management, Shipments, Publish, Inquiries)
- User controls (Language, Notifications, Checklist, User Profile)
- Role switcher (for testing/demo)

**RBAC Integration**:
- Uses `*hasPermission` directive to show/hide menu items
- Consumes RbacService for permission checks

**Consumes**:
- RbacService (for permission checks)
- Router (for navigation)

### 3.2 Sidebar Component

**Location**: `src/app/layout/sidebar/`

**Purpose**: Left navigation menu

**Features**:
- Navigation items (Producers, Farms)
- Active state highlighting
- Route-based navigation

**RBAC Integration**:
- Uses `*hasPermission` directive to show/hide navigation items
- Consumes RbacService for permission checks

**Consumes**:
- RbacService (for permission checks)
- Router (for navigation and active state)

### 3.3 Main Layout Component

**Location**: `src/app/layout/main-layout/`

**Purpose**: Application wrapper that combines all layout elements

**Structure**:
- Header (top)
- Breadcrumb (below header)
- Sidebar (left)
- Main content area with router outlet (center)
- Responsive layout

**Responsibilities**:
- Provides consistent layout structure
- Manages breadcrumb generation
- Hosts router outlet for page components

**Consumes**:
- Router (for breadcrumb generation and navigation)

---

## 4. Page Layer

The page layer contains feature-specific page components.

### 4.1 Producer List Page

**Location**: `src/app/pages/producer-list/`

**Purpose**: Main producer management page

**Features**:
- Page header with title
- Status tabs (In-processing, Approved)
- Search and filter functionality
- Data table with producer information
- Kebab menu for row actions
- Pagination controls

**Component Structure**:
- Page component orchestrates all sub-components
- Uses shared components for reusable UI elements
- Manages page-level state and interactions

**Consumes**:
- ProducerService (for data, filtering, pagination)
- RbacService (for permission checks)
- Shared components (status-tabs, search-filter, kebab-menu, pagination)
- Directives (`*hasPermission`)

**Protected by**:
- Route guard (`rbacGuard(Permission.VIEW_PRODUCERS)`)

### 4.2 Placeholder Pages

**Location**: `src/app/pages/placeholder/`

**Purpose**: Placeholder components for unimplemented features

**Usage**: Used for routes like Farms, Shipments, Publish, Inquiries

**Protected by**: Route guards with appropriate permissions

---

## 5. Shared Components Layer

The shared components layer provides reusable UI components used across multiple pages.

### 5.1 Status Tabs Component

**Location**: `src/app/shared/components/status-tabs/`

**Purpose**: Reusable status tab navigation

**Features**:
- Multiple tabs with labels
- Active tab highlighting
- Tab click handling
- Status count display (optional)

**Consumes**:
- ProducerService (for status counts)

**Used by**:
- Producer List Page

**Reusability**: Can be used on any page requiring status-based navigation

### 5.2 Search Filter Component

**Location**: `src/app/shared/components/search-filter/`

**Purpose**: Search and filter input with active filter display

**Features**:
- Search input field
- Active filter chips display
- Filter removal
- Filter button
- Actions dropdown

**Emits**:
- Filter change events to parent component

**Used by**:
- Producer List Page

**Reusability**: Can be used on any page requiring search/filter functionality

### 5.3 Pagination Component

**Location**: `src/app/shared/components/pagination/`

**Purpose**: Page navigation and pagination controls

**Features**:
- Previous/Next navigation
- Current page display
- Items per page selector
- Total items count
- Page range display

**Consumes**:
- Pagination data from services

**Used by**:
- Producer List Page

**Reusability**: Can be used on any page requiring pagination

### 5.4 Kebab Menu Component

**Location**: `src/app/shared/components/kebab-menu/`

**Purpose**: Row-level action menu (three-dot menu)

**Features**:
- Toggle menu visibility
- Action items list
- Permission-based action visibility
- Action click handling

**RBAC Integration**:
- Uses `*hasPermission` directive for action visibility
- Consumes RbacService for permission checks
- Supports role + status based action visibility

**Consumes**:
- RbacService (for permission checks)

**Used by**:
- Producer List Page (in data table rows)

**Reusability**: Can be used on any page requiring row-level actions

### 5.5 Breadcrumb Component

**Location**: `src/app/shared/components/breadcrumb/`

**Purpose**: Navigation breadcrumb display

**Features**:
- Dynamic breadcrumb generation
- Navigation path display
- Clickable breadcrumb items

**Consumes**:
- Router (for route information)

**Used by**:
- Main Layout Component

**Reusability**: Used automatically by main layout for all pages

### 5.6 Data Table Component

**Location**: `src/app/shared/components/data-table/`

**Purpose**: Generic data table component

**Features**:
- Configurable columns
- Data binding
- Sorting (if implemented)
- Styling

**Note**: Currently defined but not actively used in Producer List (custom table implementation)

**Reusability**: Available for future use as a generic table component

---

## Data Flow Architecture

### Request Flow (User Action → Data Update)

```
User Action (Click, Input, Navigation)
    │
    ▼
Component Event Handler
    │
    ▼
Service Method Call
    │
    ▼
Service Updates Signal
    │
    ▼
Angular Change Detection
    │
    ▼
Component Template Updates
    │
    ▼
UI Reflects Changes
```

### Security Flow (Navigation → Permission Check)

```
User Navigation Request
    │
    ▼
Router Intercepts
    │
    ▼
Route Guard Executes
    │
    ▼
RbacService Permission Check
    │
    ├─── ALLOWED ───→ Component Loads
    │
    └─── DENIED ───→ Redirect to Home
```

### Reactive Update Flow (Signal Change → UI Update)

```
Service Signal Changes
    │
    ▼
Components Subscribed to Signal
    │
    ▼
Angular Change Detection Triggered
    │
    ▼
Directives Re-evaluate (if using signals)
    │
    ▼
Template Re-renders
    │
    ▼
UI Updates Automatically
```

---

## Component Communication Patterns

### 1. Service-Based Communication
- **Pattern**: Components communicate through shared services
- **Use Case**: Data sharing, state management
- **Example**: ProducerService shared between Producer List page and Status Tabs component

### 2. Input/Output Properties
- **Pattern**: Parent-child component communication
- **Use Case**: Passing data down, emitting events up
- **Example**: Search Filter emits filter changes to Producer List page

### 3. Router-Based Communication
- **Pattern**: Route parameters and query strings
- **Use Case**: Navigation state, deep linking
- **Example**: Pagination updates reflected in URL

### 4. Signal-Based Reactive Communication
- **Pattern**: Services expose signals, components subscribe
- **Use Case**: Reactive state updates
- **Example**: ProducerService signals update all consuming components automatically

---

## Key Architectural Principles

1. **Separation of Concerns**: Clear boundaries between data, business logic, and presentation
2. **Reusability**: Shared components and services used across the application
3. **Reactivity**: Signal-based state management for automatic UI updates
4. **Type Safety**: TypeScript interfaces and enums throughout
5. **Security First**: RBAC enforced at multiple levels (routes and UI)
6. **Modularity**: Feature-based organization with clear dependencies
7. **Maintainability**: Logical structure makes code easy to locate and modify

---

## Technology Stack Summary

- **Framework**: Angular 20.3.0
- **Language**: TypeScript 5.8.0
- **State Management**: Angular Signals
- **Routing**: Angular Router with functional guards
- **Styling**: Custom CSS (no UI framework)
- **Reactive Programming**: RxJS 7.8.0
- **Architecture Pattern**: Component-based with service layer

