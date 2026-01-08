# Design Document - Producer Management Module

## PART A — DESIGN

### 3. End-to-End Architecture (High Level Only)

#### 3.1 Web Frontend

**Architectural Approach**

The Angular web application follows a modern, component-based architecture leveraging Angular 20.3.0's latest features:

- **Standalone Components**: All components are standalone, eliminating the need for NgModules and reducing boilerplate
- **Angular Signals**: Reactive state management using signals for efficient change detection and UI updates
- **Functional Route Guards**: Type-safe functional guards for route protection
- **Service-Based Architecture**: Centralized business logic in injectable services
- **Custom CSS Styling**: No UI framework dependencies; custom CSS for full design control

**Technology Stack**

- **Angular**: 20.3.0
- **TypeScript**: 5.8.0
- **RxJS**: 7.8.0 (for reactive programming)
- **Zone.js**: 0.15.0 (for change detection)
- **Styling**: Custom CSS (no Material Design, Bootstrap, or other frameworks)

**Project Structure**

```
src/app/
├── models/              # Type definitions and interfaces
│   ├── user.model.ts
│   ├── producer.model.ts
│   ├── permission.model.ts
│   └── index.ts
├── services/            # Business logic and data management
│   ├── rbac.service.ts
│   ├── producer.service.ts
│   ├── tenant.service.ts
│   └── index.ts
├── guards/              # Route protection
│   └── rbac.guard.ts
├── layout/              # Layout components (header, sidebar, main wrapper)
│   ├── header/
│   ├── sidebar/
│   └── main-layout/
├── pages/               # Page-level components
│   ├── producer-list/
│   └── placeholder/
├── shared/              # Reusable components, directives, pipes
│   ├── components/
│   │   ├── breadcrumb/
│   │   ├── status-tabs/
│   │   ├── search-filter/
│   │   ├── pagination/
│   │   ├── kebab-menu/
│   │   └── data-table/
│   ├── directives/
│   │   └── has-permission.directive.ts
│   └── pipes/
│       └── has-permission.pipe.ts
└── data/                # Mock data
    └── mock-producers.ts
```

**Why This Structure?**

This file structure approach was chosen for several key reasons:

1. **Separation of Concerns**: Clear boundaries between models, services, components, and shared utilities
2. **Scalability**: Easy to add new features by extending existing modules without restructuring
3. **Reusability**: Shared components and directives can be used across multiple pages
4. **Maintainability**: Logical grouping makes it easy to locate and modify code
5. **Testability**: Isolated services and components simplify unit testing
6. **Type Safety**: Centralized models ensure consistent data structures across the application

**Architecture Diagram (Web Frontend)**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Angular Application Structure                        │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        CORE LAYER                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │  │
│  │  │   Models     │  │   Services   │  │   Guards     │          │  │
│  │  │              │  │              │  │              │          │  │
│  │  │ - User       │  │ - RbacService│  │ - rbacGuard  │          │  │
│  │  │ - Producer   │  │ - Producer   │  │              │          │  │
│  │  │ - Permission │  │   Service    │  │              │          │  │
│  │  │              │  │ - Tenant     │  │              │          │  │
│  │  │              │  │   Service    │  │              │          │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │  │
│  │         │                 │                 │                    │  │
│  │         └─────────────────┴─────────────────┘                    │  │
│  │                           │                                       │  │
│  └───────────────────────────┼───────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      LAYOUT LAYER                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │  │
│  │  │   Header     │  │   Sidebar    │  │ Main Layout  │          │  │
│  │  │              │  │              │  │              │          │  │
│  │  │ - Main Menu  │  │ - Nav Items  │  │ - Wraps all  │          │  │
│  │  │ - User Ctrl  │  │ - Active     │  │   pages      │          │  │
│  │  │              │  │   State      │  │ - Router     │          │  │
│  │  │ Uses:        │  │              │  │   Outlet     │          │  │
│  │  │ *hasPermission│ │ Uses:        │  │              │          │  │
│  │  │ RbacService  │  │ *hasPermission│ │              │          │  │
│  │  └──────────────┘  │ Router       │  └──────┬───────┘          │  │
│  │                    └──────────────┘         │                    │  │
│  └─────────────────────────────────────────────┼────────────────────┘  │
│                                                 │                        │
│                                                 ▼                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                       PAGE LAYER                                 │  │
│  │  ┌──────────────────────────────────────────────────────────┐   │  │
│  │  │              Producer List Page                          │   │  │
│  │  │                                                           │   │  │
│  │  │  Consumes:                                                │   │  │
│  │  │  ├── ProducerService (data, filters, pagination)          │   │  │
│  │  │  ├── RbacService (permission checks)                      │   │  │
│  │  │  └── Router (navigation)                                  │   │  │
│  │  │                                                           │   │  │
│  │  │  Protected by:                                           │   │  │
│  │  │  └── rbacGuard (route-level RBAC)                        │   │  │
│  │  └──────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │                                           │
│                              ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    SHARED COMPONENTS LAYER                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │
│  │  │ Status Tabs  │  │Search Filter │  │  Pagination  │         │  │
│  │  │              │  │              │  │              │         │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │  │
│  │         │                 │                 │                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │
│  │  │Kebab Menu    │  │ Breadcrumb   │  │ Data Table   │         │  │
│  │  │              │  │              │  │              │         │  │
│  │  │ Uses:        │  │              │  │              │         │  │
│  │  │ *hasPermission│ │              │  │              │         │  │
│  │  │ RbacService  │  │              │  │              │         │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │  │
│  │         │                 │                 │                   │  │
│  │         └─────────────────┴─────────────────┘                   │  │
│  │                           │                                      │  │
│  │                           ▼                                      │  │
│  │  ┌──────────────────────────────────────────────────────────┐   │  │
│  │  │              Shared Directives & Pipes                  │   │  │
│  │  │  ┌──────────────────┐  ┌──────────────────┐             │   │  │
│  │  │  │ *hasPermission   │  │ hasPermission    │             │   │  │
│  │  │  │ (Directive)      │  │ (Pipe)          │             │   │  │
│  │  │  │                  │  │                  │             │   │  │
│  │  │  │ Used by:         │  │ Used by:         │             │   │  │
│  │  │  │ - Header         │  │ - Templates      │             │   │  │
│  │  │  │ - Sidebar        │  │                  │             │   │  │
│  │  │  │ - Kebab Menu    │  │                  │             │   │  │
│  │  │  └──────────────────┘  └──────────────────┘             │   │  │
│  │  └──────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Dependency Flow:                                                        │
│  ┌─────────────┐                                                        │
│  │   Models    │ ────┐                                                  │
│  └─────────────┘     │                                                  │
│                      │                                                  │
│  ┌─────────────┐     │      ┌─────────────┐                            │
│  │  Services   │ ◀───┘      │   Guards    │                            │
│  └──────┬──────┘            └──────┬──────┘                            │
│         │                           │                                   │
│         │                           │                                   │
│         ├───────────┬───────────────┘                                   │
│         │           │                                                   │
│         ▼           ▼                                                   │
│  ┌─────────────┐  ┌─────────────┐                                     │
│  │   Layouts   │  │    Pages    │                                     │
│  └──────┬──────┘  └──────┬───────┘                                     │
│         │                │                                              │
│         └────────┬───────┘                                              │
│                  │                                                      │
│                  ▼                                                      │
│         ┌─────────────┐                                                │
│         │   Shared    │                                                │
│         │ Components  │                                                │
│         └─────────────┘                                                │
└─────────────────────────────────────────────────────────────────────────┘
```

**Structure Description:**

The diagram illustrates the high-level application structure and dependencies:

1. **Core Layer**: Foundation of the application
   - **Models**: Type definitions used throughout the app
   - **Services**: Business logic and data management (consumed by layouts, pages, and shared components)
   - **Guards**: Route protection (applied to pages via router)

2. **Layout Layer**: Application shell
   - **Header**: Top navigation with main menu (uses RBAC directive and service)
   - **Sidebar**: Left navigation (uses RBAC directive and router)
   - **Main Layout**: Wraps all pages and provides consistent structure

3. **Page Layer**: Feature-specific pages
   - **Producer List Page**: Consumes services, protected by guards
   - Pages are the primary consumers of services and shared components

4. **Shared Components Layer**: Reusable UI elements
   - **Status Tabs, Search Filter, Pagination, Kebab Menu, Breadcrumb, Data Table**
   - All shared components can be used by any page
   - Some components (like Kebab Menu) use RBAC directives

5. **Shared Directives & Pipes**: Reusable utilities
   - **`*hasPermission` directive**: Used by layouts and components for conditional rendering
   - **`hasPermission` pipe**: Used in templates for permission checks

**Key Relationships:**
- **Services → Pages**: Pages consume services for data and business logic
- **Services → Layouts**: Layouts use services (especially RbacService) for menu visibility
- **Guards → Pages**: Guards protect page routes
- **Shared Components → Pages**: Pages compose shared components in their templates
- **Directives → Layouts & Components**: RBAC directives used throughout for conditional rendering

#### 3.2 Mobile App

*To be documented in future iterations*

#### 3.3 Backend API

**Architectural Approach**

The backend API is built using Node.js and Express with TypeScript, following a clean, modular architecture:

- **Modular Structure**: Feature-based organization with clear separation of concerns
- **Middleware Chain**: Request processing through middleware pipeline
- **Service Layer Pattern**: Business logic separated from HTTP handling
- **Type Safety**: Strict TypeScript typing throughout
- **In-Memory Storage**: Minimal backend using arrays (no database)

**Technology Stack**

- **Node.js**: Runtime environment
- **Express**: 4.18.2 (Web framework)
- **TypeScript**: 5.3.3
- **ts-node-dev**: Development server with hot reload
- **CORS**: Cross-origin resource sharing enabled

**Project Structure**

```
src/
├── middleware/          # Request processing middleware
│   ├── tenant.middleware.ts
│   └── error.middleware.ts
├── modules/             # Feature modules
│   └── producers/
│       ├── producer.controller.ts
│       ├── producer.service.ts
│       ├── producer.routes.ts
│       └── producer.types.ts
├── types/               # Shared type definitions
│   └── index.ts
├── data/                # Mock data
│   └── mock-producers.ts
└── server.ts            # Application bootstrap
```

**Architectural Approach**

The backend follows a layered architecture:

1. **Middleware Layer**: Handles cross-cutting concerns (tenant isolation, error handling)
2. **Route Layer**: Defines API endpoints and applies middleware
3. **Controller Layer**: Handles HTTP requests/responses and delegates to services
4. **Service Layer**: Contains business logic and data operations
5. **Data Layer**: In-memory data storage (mock data)

All requests flow through the middleware chain before reaching route handlers, ensuring tenant isolation and proper error handling at every step.

#### 3.4 Tenant Isolation (Conceptual)

**Tenant Middleware Architecture**

Tenant isolation is enforced at the middleware level, ensuring that all API requests are associated with a tenant before any business logic executes.

**How It Works:**

1. **Request Interception**: Every API request first passes through the tenant middleware
2. **Header Extraction**: The middleware extracts the `x-tenant-id` header from the incoming request
3. **Validation**: If the header is missing, the request is immediately rejected with a 400 Bad Request response
4. **Request Enrichment**: If valid, the tenant ID is attached to the request object for downstream use
5. **Data Isolation**: All subsequent service layer operations use this tenant ID to filter data

**Middleware Chain Flow:**

```
Incoming Request
    │
    ▼
┌─────────────────────┐
│ Tenant Middleware   │ ← First middleware in chain
│ - Extract header    │
│ - Validate          │
│ - Attach to request │
└──────────┬──────────┘
           │
           ▼
    ┌──────────────┐
    │ Route Handler│
    │ (Controller) │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │   Service    │
    │ (Uses tenant │
    │   ID to      │
    │   filter)    │
    └──────────────┘
```

**Key Principles:**

- **Mandatory**: All API routes must pass through tenant middleware (applied at router level)
- **Early Rejection**: Invalid or missing tenant ID results in immediate request rejection
- **Transparent**: Services receive tenant ID through request object, no need to manually pass it
- **Consistent**: Same isolation mechanism applies to all endpoints

This approach ensures that tenant isolation is never bypassed, as it's enforced at the infrastructure level before any business logic can execute.

#### 3.5 Where RBAC is Enforced

RBAC (Role-Based Access Control) is enforced at two distinct levels in the Angular application: **routing level** and **UI component level**. This dual-layer approach ensures both navigation security and UI element visibility are controlled by user permissions.

**3.5.1 Routing Level Enforcement**

**Implementation:** Functional Route Guards

Route-level RBAC is enforced using Angular's functional route guards (`rbacGuard`), which are applied to every route definition.

**Flow Diagram:**

```
User Navigation Request
    │
    ▼
┌─────────────────────┐
│  Angular Router     │
│  (Route Activation) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   rbacGuard         │
│  (Permission Check) │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌────────┐   ┌──────────┐
│  Allow │   │  Deny    │
│  Route │   │  Redirect│
│ Access │   │  to Home  │
└────────┘   └──────────┘
```

**How It Works:**

1. **Route Activation**: When a user attempts to navigate to a route, Angular's router intercepts the request
2. **Guard Execution**: The `rbacGuard` functional guard is executed before the route component loads
3. **Permission Check**: The guard injects the RBAC service and checks if the current user has the required permission
4. **Decision**: 
   - If permission exists: Route activation proceeds, component loads
   - If permission missing: User is redirected to home page, route component never loads
5. **Protection**: This happens before any component code executes, ensuring unauthorized users cannot access protected routes

**Benefits:**

- **Security**: Prevents unauthorized route access at the framework level
- **Performance**: Unauthorized routes are blocked before component initialization
- **User Experience**: Automatic redirection prevents users from seeing error states

**3.5.2 UI Component Level Enforcement**

**Implementation:** Structural Directive (`*hasPermission`)

UI-level RBAC is enforced using a custom structural directive that conditionally renders DOM elements based on user permissions.

**Flow Diagram:**

```
Component Template Render
    │
    ▼
┌─────────────────────┐
│  *hasPermission     │
│  Directive          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  RBAC Service       │
│  (Permission Check) │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌────────┐   ┌──────────┐
│  Show  │   │  Hide    │
│ Element│   │  Element │
│ (Render)│   │ (Remove) │
└────────┘   └──────────┘
```

**How It Works:**

1. **Template Evaluation**: When Angular renders a component template, it encounters the `*hasPermission` directive
2. **Permission Check**: The directive injects the RBAC service and checks if the current user has the required permission(s)
3. **Reactive Updates**: The directive uses Angular signals to reactively update when user role changes
4. **DOM Manipulation**: 
   - If permission exists: Element is rendered in the DOM
   - If permission missing: Element is removed from the DOM (not just hidden)
5. **Dynamic Behavior**: Changes to user role automatically trigger re-evaluation and DOM updates

**Usage Examples:**

- **Main Menu Items**: Only show menu items the user has permission to access
- **Sidebar Navigation**: Hide sidebar links for unauthorized sections
- **Kebab Menu Actions**: Show/hide action buttons based on role and status combinations
- **Action Buttons**: Conditionally render "Add Producer", "Edit", "Delete" buttons

**Benefits:**

- **Granular Control**: Fine-grained permission checks at the element level
- **Reactive**: Automatically updates UI when user role changes
- **Performance**: Elements are removed from DOM, not just hidden with CSS
- **User Experience**: Users only see actions they can perform

**3.5.3 Combined Enforcement Strategy**

The combination of routing-level and UI-level enforcement provides comprehensive security:

- **Routing Level**: Prevents unauthorized navigation (security)
- **UI Level**: Hides unauthorized actions (user experience)

This dual approach ensures that even if a user somehow bypasses UI restrictions, route guards prevent access to protected pages, and vice versa - if routing allows access, UI elements still respect permissions.

---

### 4. Page Architecture (Based on Provided UI)

This section explains how the Producer List page is structured, breaking down the layout components, page components, and shared components to clarify their roles and reusability.

#### 4.1 Layout Structure

The application uses a three-part layout structure that provides consistent navigation and structure across all pages.

**4.1.1 Top Main Menu (Header Component)**

**Location**: `src/app/layout/header/`

**Purpose**: Provides global navigation and user controls at the top of the application

**Components**:
- **Logo Section**: Displays the Verdethos logo
- **Main Navigation**: Horizontal menu items (Supplier Management, Shipments, Publish, Inquiries)
- **Role Switcher**: Testing utility for switching user roles (demo purposes)
- **User Controls**: Language selector, Notifications, Checklist, User profile dropdown

**RBAC Integration**:
- Main menu items use `*hasPermission` directive to show/hide based on user permissions
- Only menu items the user has permission to access are displayed

**Reusability**: Used across all pages as part of the main layout wrapper

**4.1.2 Left Side Menu (Sidebar Component)**

**Location**: `src/app/layout/sidebar/`

**Purpose**: Provides section-specific navigation within the current module

**Components**:
- **Navigation Items**: Vertical list of sub-sections (Producers, Farms)
- **Active State**: Highlights the currently active navigation item
- **Route-based Navigation**: Uses Angular Router for navigation

**RBAC Integration**:
- Sidebar items use `*hasPermission` directive to show/hide based on user permissions
- Only navigation items the user can access are displayed

**Reusability**: Used across all pages within the same module, changes based on current route context

**4.1.3 Content Area (Router Outlet)**

**Location**: `src/app/layout/main-layout/`

**Purpose**: Dynamic content area where page components are rendered

**Structure**:
- **Main Layout Component**: Wraps header, breadcrumb, sidebar, and content area
- **Router Outlet**: Angular's dynamic component insertion point
- **Breadcrumb**: Displays navigation path (automatically generated from routes)
- **Content Wrapper**: Provides consistent spacing and styling

**How It Works**:
- Main Layout component hosts the `<router-outlet>`
- When a route is activated, Angular renders the corresponding page component into the router outlet
- The page component appears in the content area, surrounded by the header and sidebar

**Reusability**: The layout structure is reused for all pages; only the content within the router outlet changes

#### 4.2 Page Components (Producer List Page)

The Producer List page is composed of multiple components, each handling a specific aspect of the page functionality.

**4.2.1 Page Header**

**Location**: Within `producer-list.component.html`

**Purpose**: Displays the page title and primary action button

**Components**:
- **Title Section**: 
  - Green vertical bar (visual design element)
  - Page title ("Producers")
- **Add Producer Button**: 
  - Conditionally displayed based on `CREATE_PRODUCER` permission
  - Triggers add producer action

**RBAC Integration**: Add button visibility controlled by permission check

**Reusability**: Page-specific (not shared), but the pattern (title + action button) can be reused on other pages

**4.2.2 Status Tabs**

**Component**: `app-status-tabs` (Shared Component)

**Location**: `src/app/shared/components/status-tabs/`

**Purpose**: Provides tab-based navigation for filtering by status

**Features**:
- Multiple tabs (In-processing, Approved)
- Active tab highlighting
- Tab click handling
- Status count display (optional)

**Data Source**: Consumes `ProducerService.getStatusCounts()` for tab counts

**Reusability**: **Shared component** - Can be used on any page requiring status-based filtering

**4.2.3 Search / Filter**

**Component**: `app-search-filter` (Shared Component)

**Location**: `src/app/shared/components/search-filter/`

**Purpose**: Provides search input and active filter display

**Features**:
- Search input field
- Active filter chips (e.g., "EUDR: Yes")
- Filter removal functionality
- Filter button (opens filter panel)
- Actions dropdown button

**Data Flow**:
- Emits search/filter changes to parent component (Producer List)
- Parent component updates `ProducerService` filters
- Service applies filters and updates data signals

**Reusability**: **Shared component** - Can be used on any page requiring search and filter functionality

**4.2.4 Table**

**Location**: Within `producer-list.component.html`

**Purpose**: Displays producer data in tabular format

**Structure**:
- **Table Headers**: Producer Name, Producer Type, # of Farms, Serasa, EUDR, Status, Actions
- **Table Rows**: Iterates over producers signal
- **Status Badges**: Color-coded status indicators
- **Empty State**: Message when no producers found

**Data Source**: Consumes `producers()` signal from component (which comes from `ProducerService`)

**Reusability**: Page-specific table implementation (custom HTML/CSS). A generic `DataTableComponent` exists but is not used here for custom styling requirements.

**4.2.5 Pagination**

**Component**: `app-pagination` (Shared Component)

**Location**: `src/app/shared/components/pagination/`

**Purpose**: Provides page navigation and items per page controls

**Features**:
- Previous/Next navigation buttons
- Current page display
- Total pages indicator
- Items per page selector
- Total items count display

**Data Source**: Consumes pagination data from `ProducerService` signals

**Reusability**: **Shared component** - Can be used on any page requiring pagination

**4.2.6 Kebab Menu**

**Component**: `app-kebab-menu` (Shared Component)

**Location**: `src/app/shared/components/kebab-menu/`

**Purpose**: Provides row-level action menu (three-dot menu)

**Features**:
- Toggle menu visibility
- Dynamic action items list
- Permission-based action visibility
- Action click handling

**RBAC Integration**:
- Uses `*hasPermission` directive for action visibility
- Consumes `RbacService.canPerformProducerAction()` for role + status based actions
- Actions shown/hidden based on user role and producer status

**Usage**: One kebab menu per table row, with actions specific to that producer

**Reusability**: **Shared component** - Can be used on any page requiring row-level actions

#### 4.3 Component Classification: Layout vs Page vs Shared

**4.3.1 Layout Components**

**Definition**: Components that provide the application shell and structure, used across all pages

**Characteristics**:
- Part of the main application structure
- Present on every page
- Provide navigation and consistent UI elements
- Defined in `src/app/layout/`

**Components**:
- **Header Component**: Top navigation bar (always visible)
- **Sidebar Component**: Left navigation menu (always visible)
- **Main Layout Component**: Wraps everything, provides structure

**Why They're Not Shared**: Layout components are structural elements, not reusable UI widgets. They're part of the application architecture, not individual features.

**4.3.2 Page Components**

**Definition**: Feature-specific components that represent complete pages or views

**Characteristics**:
- Represent a full page/screen
- Feature-specific business logic
- Composed of multiple shared components
- Defined in `src/app/pages/`

**Components**:
- **Producer List Component**: The main producer management page
- **Placeholder Components**: For unimplemented features

**Why They're Not Shared**: Page components are feature-specific and contain business logic unique to that feature. They orchestrate shared components but are not reusable themselves.

**4.3.3 Shared Components**

**Definition**: Reusable UI components that can be used across multiple pages

**Characteristics**:
- Generic, reusable functionality
- No feature-specific business logic
- Configurable via inputs/outputs
- Defined in `src/app/shared/components/`

**Components**:
- **Status Tabs**: Reusable tab navigation
- **Search Filter**: Reusable search/filter UI
- **Pagination**: Reusable pagination controls
- **Kebab Menu**: Reusable action menu
- **Breadcrumb**: Reusable navigation breadcrumb
- **Data Table**: Generic table component (available but not used)

**Why They're Shared**: These components provide common UI patterns that are needed across multiple pages. Sharing them:
- Reduces code duplication
- Ensures consistent UI/UX
- Simplifies maintenance (fix once, works everywhere)
- Speeds up development of new pages

#### 4.4 Reusability Rationale

**What is Reusable and Why:**

1. **Status Tabs Component**
   - **Reusable**: Yes
   - **Why**: Tab-based navigation is a common pattern. Can be used for any status-based filtering (e.g., Orders: Pending, Completed, Cancelled)

2. **Search Filter Component**
   - **Reusable**: Yes
   - **Why**: Search and filter functionality is needed on most list pages. The component is generic enough to work with any data type

3. **Pagination Component**
   - **Reusable**: Yes
   - **Why**: Pagination is a universal requirement for any data table. The component is completely generic

4. **Kebab Menu Component**
   - **Reusable**: Yes
   - **Why**: Row-level actions are common across data tables. The component accepts dynamic action items, making it flexible

5. **Breadcrumb Component**
   - **Reusable**: Yes
   - **Why**: Navigation breadcrumbs are standard across all pages. The component automatically generates from route data

6. **Data Table Component**
   - **Reusable**: Yes (available but not used)
   - **Why**: Generic table component exists but Producer List uses custom table for specific styling requirements

7. **Header Component**
   - **Reusable**: No (Layout component)
   - **Why**: Part of application structure, not a reusable widget

8. **Sidebar Component**
   - **Reusable**: No (Layout component)
   - **Why**: Part of application structure, provides consistent navigation

9. **Producer List Component**
   - **Reusable**: No (Page component)
   - **Why**: Feature-specific, contains producer management business logic

**Reusability Benefits:**

- **Consistency**: Shared components ensure consistent UI/UX across the application
- **Maintainability**: Bug fixes and improvements in shared components benefit all pages using them
- **Development Speed**: New pages can be built faster by composing existing shared components
- **Testing**: Shared components can be tested once and trusted everywhere
- **Design System**: Shared components form the foundation of a design system

---

### 5. RBAC Design (Conceptual)

RBAC is enforced at three distinct levels in the application, each serving a specific security and user experience purpose.

#### 5.1 Main Menu - Who Can See What

**Implementation**: `*hasPermission` directive on header menu items

**How It Works**:
- Each menu item (Supplier Management, Shipments, Publish, Inquiries) has an associated permission
- The directive checks if the current user's role includes that permission
- Menu items without permission are not rendered in the DOM

**Role-Based Visibility**:

- **Admin**: Sees all menu items (Supplier Management, Shipments, Publish, Inquiries)
- **Compliance**: Sees Supplier Management only
- **Viewer**: Sees Supplier Management only

**Why This Level**: Prevents users from seeing navigation options they cannot access, improving UX and reducing confusion.

#### 5.2 Side Menu - Route Access

**Implementation**: Route guards (`rbacGuard`) on route definitions

**How It Works**:
- Each route has a required permission specified in the guard
- When navigation is attempted, the guard checks permissions before allowing route activation
- Unauthorized users are redirected to home page

**Role-Based Route Access**:

- **Admin**: Can access all routes (Producers, Farms, Shipments, Publish, Inquiries)
- **Compliance**: Can access Producers and Farms only
- **Viewer**: Can access Producers and Farms only (read-only)

**Why This Level**: Security layer that prevents unauthorized route access, even if UI restrictions are bypassed.

#### 5.3 Row Actions (Kebab Menu) - Role + Status Driven

**Implementation**: `RbacService.canPerformProducerAction()` method with role and status checks

**How It Works**:
- Each action (View, Edit, Delete, Review) requires both:
  1. **Role Permission**: User must have the required permission for the action
  2. **Status Constraint**: Producer status must allow the action

**Action Rules by Role + Status**:

**View Action**:
- **Admin**: Always available
- **Compliance**: Always available
- **Viewer**: Always available

**Edit Action**:
- **Admin**: Available when status is "Created" or "In Review"
- **Compliance**: Available when status is "Created" or "In Review"
- **Viewer**: Never available

**Review Action**:
- **Admin**: Available when status is "In Review"
- **Compliance**: Available when status is "In Review"
- **Viewer**: Never available

**Delete Action**:
- **Admin**: Available when status is "Created" only
- **Compliance**: Never available
- **Viewer**: Never available

**Why This Level**: Provides fine-grained control over actions based on both user role and data state, ensuring business rules are enforced at the UI level.

---

### 6. Mobile Strategy (Conceptual)

#### 6.1 Chosen Approach: Ionic + Angular

**Rationale**: Since the web application is built with Angular, Ionic provides the best fit for code sharing and developer efficiency.

**Why It Fits**:
- **Shared Codebase**: Ionic uses Angular, allowing maximum code reuse between web and mobile
- **Shared Services**: Business logic services (RBAC, Producer, Tenant) can be used directly
- **Shared Models**: TypeScript interfaces and enums work identically
- **Single Team**: Same Angular developers can work on both platforms
- **Consistent Architecture**: Same component structure, dependency injection, and patterns

#### 6.2 Shared vs Separate Logic

**Shared (Reuse from Web)**:
- **Services**: RbacService, ProducerService, TenantService (100% reusable)
- **Models**: All TypeScript interfaces and enums
- **Guards**: Route guards can be adapted for mobile navigation
- **Business Logic**: All permission checks, data filtering, pagination logic

**Separate (Mobile-Specific)**:
- **UI Components**: Mobile-optimized components (Ionic components instead of custom HTML)
- **Navigation**: Ionic's navigation stack instead of Angular Router
- **Layout**: Mobile-specific layouts (no header/sidebar, use Ionic tabs or menu)
- **Styling**: Ionic's mobile-first CSS framework

#### 6.3 Intentional UX Difference

**Mobile UX Change**: Simplified Kebab Menu → Direct Action Buttons

**Web**: Three-dot kebab menu with dropdown actions per row

**Mobile**: Direct action buttons (swipe actions or inline buttons) for primary actions

**Rationale**: 
- Touch interfaces benefit from larger tap targets
- Reduces interaction steps (no menu open/close)
- Swipe actions are native mobile pattern
- Only show 1-2 primary actions per row to avoid clutter

