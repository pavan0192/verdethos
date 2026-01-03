# Verdethos UI - Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Flow Diagram](#architecture-flow-diagram)
3. [Component Architecture](#component-architecture)
4. [Service Architecture](#service-architecture)
5. [RBAC Implementation](#rbac-implementation)
6. [Data Flow](#data-flow)
7. [Routing & Navigation](#routing--navigation)
8. [State Management](#state-management)

---

## System Overview

Verdethos UI is a multi-tenant B2B SaaS platform built with **Angular 20**, implementing a Producer Management module with comprehensive Role-Based Access Control (RBAC). The application follows a component-based architecture with reactive state management using Angular Signals.

### Key Technologies
- **Framework**: Angular 20 (Standalone Components)
- **State Management**: Angular Signals
- **Styling**: Custom CSS (Material Design inspired)
- **Type Safety**: TypeScript 5.8+
- **Architecture Pattern**: Component-Service-Data Model

---

## Architecture Flow Diagram

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ANGULAR APPLICATION                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              App Component (Root)                        │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │         Main Layout Component                      │  │  │
│  │  │  ┌──────────────┐  ┌──────────────────────────┐  │  │  │
│  │  │  │   Header     │  │    Sidebar               │  │  │  │
│  │  │  │  Component   │  │    Component             │  │  │  │
│  │  │  └──────────────┘  └──────────────────────────┘  │  │  │
│  │  │  ┌──────────────────────────────────────────────┐ │  │  │
│  │  │  │         Router Outlet                        │ │  │  │
│  │  │  │  ┌────────────────────────────────────────┐ │ │  │  │
│  │  │  │  │    Producer List Component             │ │ │  │  │
│  │  │  │  │  ┌──────────────────────────────────┐ │ │ │  │  │
│  │  │  │  │  │  Status Tabs Component          │ │ │ │  │  │
│  │  │  │  │  │  Search Filter Component        │ │ │ │  │  │
│  │  │  │  │  │  Kebab Menu Component           │ │ │ │  │  │
│  │  │  │  │  │  Pagination Component           │ │ │ │  │  │
│  │  │  │  │  └──────────────────────────────────┘ │ │ │  │  │
│  │  │  │  └────────────────────────────────────────┘ │ │  │  │
│  │  │  └──────────────────────────────────────────────┘ │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                              │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │  RBAC Service    │  │ Producer Service  │                   │
│  │  (Permissions)  │  │  (Data & CRUD)   │                   │
│  └──────────────────┘  └──────────────────┘                   │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │ Tenant Service   │  │  Mock Data       │                   │
│  │  (Multi-tenant)  │  │  (1200 records)  │                   │
│  └──────────────────┘  └──────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │  Models          │  │  Mock Producers  │                   │
│  │  - User          │  │  - 1200 items    │                   │
│  │  - Producer      │  │  - Filtered      │                   │
│  │  - Permission    │  │  - Paginated     │                   │
│  └──────────────────┘  └──────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

### RBAC Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER AUTHENTICATION                          │
│  (Currently Mocked - localStorage for demo)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RBAC SERVICE                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. Get Current User (Signal)                            │  │
│  │     - Reads from localStorage                            │  │
│  │     - Returns User object with Role                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  2. Role → Permission Mapping                            │  │
│  │     Admin → [VIEW_PRODUCERS, CREATE, EDIT, DELETE, ...]  │  │
│  │     Compliance → [VIEW_PRODUCERS, EDIT, REVIEW, ...]    │  │
│  │     Viewer → [VIEW_PRODUCERS, VIEW_DETAILS, ...]          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  3. Permission Checking Methods                          │  │
│  │     - hasPermission(permission)                          │  │
│  │     - hasAnyPermission([...])                            │  │
│  │     - canPerformProducerAction(action, status)           │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   ROUTE GUARDS           │  │   UI DIRECTIVES           │
│   (rbacGuard)            │  │   (*hasPermission)        │
│                          │  │                          │
│  - Check before route    │  │  - Conditional rendering  │
│  - Redirect if denied    │  │  - Reactive updates       │
│  - Functional guard      │  │  - Signal-based           │
└──────────────────────────┘  └──────────────────────────┘
                │                         │
                └────────────┬────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT LEVEL CHECKS                       │
│  - Header: Menu item visibility                                 │
│  - Sidebar: Menu item visibility                                │
│  - Producer List: "Add Producer" button                         │
│  - Kebab Menu: Action availability (role + status)              │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│              PRODUCER LIST PAGE - DATA FLOW                     │
└─────────────────────────────────────────────────────────────────┘

User Action (Tab Change)
         │
         ▼
┌────────────────────┐
│ ProducerList       │
│ Component          │
│ onTabChange()      │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Update Signals:    │
│ - activeStatusTab  │
│ - currentPage = 1  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ loadProducers()    │
│ Method             │
└─────────┬──────────┘
          │
          ├──────────────────┐
          │                  │
          ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│ ProducerService │  │ RBACService     │
│ setFilters()    │  │ (for actions)   │
│ setPagination() │  │                 │
│ getProducers()  │  │                 │
└─────────┬───────┘  └─────────────────┘
          │
          ▼
┌────────────────────┐
│ Filter & Paginate  │
│ Mock Data          │
│ (1200 producers)   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Return Response:   │
│ - data: Producer[] │
│ - total: number    │
│ - totalPages: num  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Update Signals:    │
│ - producers()      │
│ - totalItems()     │
│ - totalPages()     │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Template Updates   │
│ (Reactive)         │
│ - Table rows       │
│ - Pagination       │
│ - Status counts    │
└────────────────────┘
```

---

## Component Architecture

### Component Hierarchy

```
AppComponent (Root)
│
├── MainLayoutComponent
│   │
│   ├── HeaderComponent
│   │   ├── Logo & Brand
│   │   ├── Main Navigation (Supplier Management, Shipments, etc.)
│   │   └── User Controls (Language, Notifications, Profile)
│   │
│   ├── SidebarComponent
│   │   ├── BreadcrumbComponent (via MainLayout)
│   │   └── Navigation Items (Producers, Farms)
│   │
│   └── RouterOutlet
│       │
│       └── ProducerListComponent (Page Component)
│           ├── StatusTabsComponent
│           ├── SearchFilterComponent
│           ├── Data Table (Custom HTML Table)
│           ├── KebabMenuComponent (per row)
│           └── PaginationComponent
```

### Component Responsibilities

#### 1. **AppComponent** (`app.component.ts`)
- **Purpose**: Root component, bootstraps the application
- **Responsibilities**:
  - Provides router outlet
  - Wraps MainLayoutComponent
- **Dependencies**: RouterModule

#### 2. **MainLayoutComponent** (`layout/main-layout/`)
- **Purpose**: Main application shell
- **Responsibilities**:
  - Manages overall layout structure
  - Handles breadcrumb generation based on route
  - Contains header, sidebar, and content area
- **Dependencies**: 
  - HeaderComponent
  - SidebarComponent
  - BreadcrumbComponent
  - RoleSwitcherComponent (for testing)

#### 3. **HeaderComponent** (`layout/header/`)
- **Purpose**: Top navigation bar
- **Responsibilities**:
  - Display logo and brand
  - Main menu navigation (RBAC protected)
  - User controls (notifications, profile)
- **RBAC Integration**:
  - Uses `*hasPermission` directive on menu items
  - Menu items filtered based on user permissions
- **Key Methods**:
  - `currentUser` getter (computed from RBACService)

#### 4. **SidebarComponent** (`layout/sidebar/`)
- **Purpose**: Left navigation panel
- **Responsibilities**:
  - Display navigation items (Producers, Farms)
  - Show active route highlighting
- **RBAC Integration**:
  - Uses `*hasPermission` directive on menu items
- **Key Properties**:
  - `menuItems`: Array of sidebar items with permissions

#### 5. **ProducerListComponent** (`pages/producer-list/`)
- **Purpose**: Main producer listing page
- **Responsibilities**:
  - Display producer data in table
  - Handle filtering, pagination, search
  - Manage status tabs
  - Coordinate child components
- **RBAC Integration**:
  - `canCreateProducer()`: Checks CREATE_PRODUCER permission
  - `getKebabMenuItems()`: Filters actions based on role + status
- **Key Signals**:
  - `producers`: Array of current producers
  - `totalItems`: Total count for pagination
  - `currentPage`: Current page number
  - `activeStatusTab`: Current tab ('in-processing' | 'approved')
- **Key Methods**:
  - `loadProducers()`: Fetches and filters data
  - `onTabChange()`: Handles tab switching
  - `onSearchChange()`: Handles search input
  - `onPageChange()`: Handles pagination
  - `getKebabMenuItems()`: Returns available actions per producer
  - `onKebabAction()`: Handles action execution

#### 6. **StatusTabsComponent** (`shared/components/status-tabs/`)
- **Purpose**: Status filter tabs
- **Responsibilities**:
  - Display status tabs (In-processing, Approved)
  - Show counts per tab
  - Emit tab change events
- **Inputs**: `tabs`, `activeTab`
- **Outputs**: `tabChange`

#### 7. **SearchFilterComponent** (`shared/components/search-filter/`)
- **Purpose**: Search and filter controls
- **Responsibilities**:
  - Search input field
  - Active filter chips display
  - Filter and Actions buttons
- **Inputs**: `searchValue`, `activeFilters`
- **Outputs**: `searchChange`, `removeFilter`, `openFilters`, `openActions`

#### 8. **KebabMenuComponent** (`shared/components/kebab-menu/`)
- **Purpose**: Row-level action menu
- **Responsibilities**:
  - Display action menu (View, Edit, Delete, Review)
  - Handle menu open/close
  - Emit action selection
- **RBAC Integration**:
  - Receives filtered items from parent component
  - Items already filtered by `getKebabMenuItems()` in ProducerListComponent
- **Key Methods**:
  - `toggleMenu()`: Opens/closes menu
  - `onActionClick()`: Emits selected action

#### 9. **PaginationComponent** (`shared/components/pagination/`)
- **Purpose**: Pagination controls
- **Responsibilities**:
  - Display page numbers
  - Handle page navigation
  - Display item count
  - Page size selector
- **Inputs**: `currentPage`, `totalPages`, `pageSize`, `totalItems`
- **Outputs**: `pageChange`, `pageSizeChange`

---

## Service Architecture

### Service Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           RBACService (Core)                         │  │
│  │  - User management (Signal-based)                    │  │
│  │  - Role → Permission mapping                         │  │
│  │  - Permission checking methods                      │  │
│  │  - Action authorization (role + status)              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         ProducerService (Data)                       │  │
│  │  - Mock data management (1200 producers)             │  │
│  │  - Filtering (search, status, type, EUDR)            │  │
│  │  - Pagination                                        │  │
│  │  - CRUD operations                                   │  │
│  │  - Status counts computation                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         TenantService (Multi-tenant)                 │  │
│  │  - Current tenant management                          │  │
│  │  - Tenant ID retrieval                                │  │
│  │  (Placeholder for future multi-tenant features)     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1. RBACService (`services/rbac.service.ts`)

**Purpose**: Centralized Role-Based Access Control management

**Key Properties**:
```typescript
private currentUser = signal<User>(this.initializeUser());
private rolePermissions: Map<UserRole, Permission[]>
```

**Key Methods**:

1. **`getCurrentUser()`**
   - Returns readonly signal of current user
   - User role persisted in localStorage for demo

2. **`setCurrentUser(user: User)`**
   - Updates current user signal
   - Saves role to localStorage

3. **`hasPermission(permission: Permission): boolean`**
   - Checks if current user has specific permission
   - Used by directives and components

4. **`hasAnyPermission(permissions: Permission[]): boolean`**
   - Checks if user has at least one of the permissions
   - Used by `*hasPermission` directive

5. **`canPerformProducerAction(action, status): boolean`**
   - Complex authorization logic
   - Combines role permissions with producer status
   - Rules:
     - **View**: Requires VIEW_PRODUCER_DETAILS permission
     - **Edit**: Requires EDIT_PRODUCER + (Created or In Review status)
     - **Delete**: Requires DELETE_PRODUCER + Admin role + Created status
     - **Review**: Requires REVIEW_PRODUCER + In Review status

**Role-Permission Mapping**:
```typescript
Admin → [
  VIEW_SUPPLIER_MANAGEMENT, VIEW_SHIPMENTS, VIEW_PUBLISH, VIEW_INQUIRIES,
  VIEW_PRODUCERS, CREATE_PRODUCER, EDIT_PRODUCER, DELETE_PRODUCER,
  REVIEW_PRODUCER, VIEW_PRODUCER_DETAILS, VIEW_FARMS
]

Compliance → [
  VIEW_SUPPLIER_MANAGEMENT, VIEW_PRODUCERS, EDIT_PRODUCER,
  REVIEW_PRODUCER, VIEW_PRODUCER_DETAILS, VIEW_FARMS
]

Viewer → [
  VIEW_SUPPLIER_MANAGEMENT, VIEW_PRODUCERS,
  VIEW_PRODUCER_DETAILS, VIEW_FARMS
]
```

### 2. ProducerService (`services/producer.service.ts`)

**Purpose**: Producer data management and business logic

**Key Properties**:
```typescript
private producers = signal<Producer[]>(mockProducers); // 1200 items
private filters = signal<ProducerListFilters>({});
private pagination = signal<PaginationParams>({ page: 1, pageSize: 10 });
```

**Key Methods**:

1. **`getProducers(): PaginatedResponse<Producer>`**
   - Applies current filters and pagination
   - Returns filtered, paginated data
   - Computes total pages

2. **`setFilters(filters: ProducerListFilters)`**
   - Updates filter signal
   - Supports: search, status, type, EUDR

3. **`setPagination(params: PaginationParams)`**
   - Updates pagination signal
   - Page is 1-based

4. **`getStatusCounts()`**
   - Computes counts for each status
   - Returns: `{ inProcessing, approved, rejected, created }`

5. **`deleteProducer(id: string)`**
   - Removes producer from data

6. **`updateProducerStatus(id: string, status: ProducerStatus)`**
   - Updates producer status
   - Used for review action

**Filtering Logic**:
- **Search**: Case-insensitive name matching
- **Status**: Array of statuses to include
- **EUDR**: Boolean filter (Yes = not "0/4")
- **Type**: Array of producer types

**Pagination Logic**:
- Calculates start/end indices
- Returns subset of filtered data
- Computes total pages

---

## RBAC Implementation

### Three Levels of RBAC

#### Level 1: Main Menu (Header)

**Implementation**: `*hasPermission` directive on menu items

**Location**: `header.component.html`

```html
@for (item of menuItems; track item.label) {
  <a
    *hasPermission="item.permission"
    [routerLink]="item.route"
    class="nav-item"
  >
    {{ item.label }}
  </a>
}
```

**Flow**:
1. Menu items defined with required permissions
2. `*hasPermission` directive checks permission
3. Items without permission are not rendered
4. Reactive: Updates when user role changes

#### Level 2: Side Menu (Route Guards)

**Implementation**: Functional route guards (`rbacGuard`)

**Location**: `app.routes.ts`

```typescript
{
  path: 'producers',
  component: ProducerListComponent,
  canActivate: [rbacGuard(Permission.VIEW_PRODUCERS)]
}
```

**Flow**:
1. User navigates to route
2. Guard checks permission via RBACService
3. If denied: Redirects to home
4. If allowed: Route activates

**Guard Implementation** (`guards/rbac.guard.ts`):
```typescript
export const rbacGuard = (requiredPermission: Permission): CanActivateFn => {
  return (route, state) => {
    const rbacService = inject(RbacService);
    const router = inject(Router);
    
    if (rbacService.hasPermission(requiredPermission)) {
      return true;
    }
    
    router.navigate(['/']);
    return false;
  };
};
```

#### Level 3: Row Actions (Kebab Menu)

**Implementation**: Component-level logic with `canPerformProducerAction()`

**Location**: `producer-list.component.ts`

**Flow**:
1. Component calls `getKebabMenuItems(producer)`
2. For each action, checks `rbacService.canPerformProducerAction(action, status)`
3. Only returns allowed actions
4. KebabMenuComponent displays filtered items

**Example Logic**:
```typescript
getKebabMenuItems(producer: Producer): KebabMenuItem[] {
  const items: KebabMenuItem[] = [];
  const status = producer.status;
  
  // Review: Only for In Review status, requires REVIEW_PRODUCER
  if (this.rbacService.canPerformProducerAction('review', status)) {
    items.push({ label: 'Review', action: 'review', icon: 'review', highlighted: true });
  }
  
  // Edit: Requires EDIT_PRODUCER + (Created or In Review)
  if (this.rbacService.canPerformProducerAction('edit', status)) {
    items.push({ label: 'Edit', action: 'edit', icon: 'edit' });
  }
  
  // Delete: Only Admin + Created status
  if (this.rbacService.canPerformProducerAction('delete', status)) {
    items.push({ label: 'Delete', action: 'delete', icon: 'delete' });
  }
  
  return items;
}
```

### HasPermission Directive

**Location**: `shared/directives/has-permission.directive.ts`

**Purpose**: Structural directive for conditional rendering based on permissions

**Implementation**:
```typescript
@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  @Input() set hasPermission(permissions: Permission | Permission[]) {
    this.permissions = Array.isArray(permissions) ? permissions : [permissions];
    this.updateView();
  }
  
  constructor() {
    // Reactive: Updates when user role changes
    effect(() => {
      this.rbacService.getCurrentUser(); // Trigger effect
      this.updateView();
    });
  }
  
  private updateView() {
    const hasPermission = this.rbacService.hasAnyPermission(this.permissions);
    // Create or destroy view based on permission
  }
}
```

**Usage**:
```html
<div *hasPermission="Permission.VIEW_PRODUCERS">
  <!-- Content only visible if user has permission -->
</div>
```

---

## Data Flow

### Complete Request Flow

```
1. User Action (e.g., clicks "In-processing" tab)
   │
   ▼
2. ProducerListComponent.onTabChange('in-processing')
   │
   ▼
3. Update Signals:
   - activeStatusTab.set('in-processing')
   - currentPage.set(1)
   │
   ▼
4. ProducerListComponent.loadProducers()
   │
   ├─→ ProducerService.setFilters({
   │     status: [CREATED, IN_REVIEW]
   │   })
   │
   ├─→ ProducerService.setPagination({
   │     page: 1,
   │     pageSize: 10
   │   })
   │
   └─→ ProducerService.getProducers()
       │
       ├─→ Filter 1200 producers by status
       ├─→ Apply pagination (slice array)
       └─→ Return PaginatedResponse
       │
       ▼
5. Update Component Signals:
   - producers.set(response.data)
   - totalItems.set(response.total)
   - totalPages.set(response.totalPages)
   │
   ▼
6. Angular Change Detection
   │
   ▼
7. Template Re-renders:
   - Table rows update
   - Pagination updates
   - Status tabs update counts
```

### RBAC Check Flow

```
1. Component renders menu item
   │
   ▼
2. *hasPermission directive evaluates
   │
   ▼
3. Directive calls rbacService.hasAnyPermission([permission])
   │
   ▼
4. RBACService:
   - Gets current user from signal
   - Looks up user role
   - Retrieves permissions for role
   - Checks if permission exists in array
   │
   ▼
5. Returns boolean
   │
   ▼
6. Directive creates/destroys view accordingly
```

---

## Routing & Navigation

### Route Configuration (`app.routes.ts`)

```typescript
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'supplier-management',
        children: [
          {
            path: 'producers',
            component: ProducerListComponent,
            canActivate: [rbacGuard(Permission.VIEW_PRODUCERS)]
          },
          {
            path: 'farms',
            component: PlaceholderComponent,
            canActivate: [rbacGuard(Permission.VIEW_FARMS)]
          }
        ]
      },
      {
        path: 'shipments',
        component: PlaceholderComponent,
        canActivate: [rbacGuard(Permission.VIEW_SHIPMENTS)]
      },
      // ... other routes
    ]
  }
];
```

### Navigation Flow

1. **User clicks menu item** → RouterLink navigates
2. **Route guard activates** → Checks permission
3. **If allowed** → Component loads
4. **If denied** → Redirects to home

---

## State Management

### Signal-Based Architecture

The application uses **Angular Signals** for reactive state management:

**Service Signals**:
- `RBACService.currentUser`: Signal<User>
- `ProducerService.producers`: Signal<Producer[]>
- `ProducerService.filters`: Signal<ProducerListFilters>
- `ProducerService.pagination`: Signal<PaginationParams>

**Component Signals**:
- `ProducerListComponent.producers`: Signal<Producer[]>
- `ProducerListComponent.totalItems`: Signal<number>
- `ProducerListComponent.currentPage`: Signal<number>
- `ProducerListComponent.activeStatusTab`: Signal<string>

**Computed Signals**:
- `ProducerListComponent.statusTabs`: Computed<StatusTab[]>
- `ProducerListComponent.totalPages`: Computed<number>

### Signal Updates Trigger Reactive Updates

When a signal updates:
1. All dependent computed signals recalculate
2. Components using signals re-render affected parts
3. Directives re-evaluate (via `effect()`)

**Example**:
```typescript
// In ProducerListComponent
statusTabs = computed<StatusTab[]>(() => {
  const counts = this.producerService.getStatusCounts();
  return [
    { label: 'In-processing', value: 'in-processing', count: counts.inProcessing },
    { label: 'Approved', value: 'approved', count: counts.approved }
  ];
});
```

When `producerService.producers` changes → `getStatusCounts()` recalculates → `statusTabs` updates → Template re-renders.

---

## Key Design Patterns

### 1. **Dependency Injection**
- Services injected via constructor
- Guards use `inject()` function
- Standalone components import dependencies

### 2. **Reactive Programming**
- Signals for state management
- Computed signals for derived state
- Effects for side effects

### 3. **Component Composition**
- Small, focused components
- Shared components in `shared/`
- Page components in `pages/`
- Layout components in `layout/`

### 4. **Separation of Concerns**
- **Components**: UI and user interaction
- **Services**: Business logic and data
- **Guards**: Route protection
- **Directives**: Reusable UI behavior
- **Models**: Type definitions

### 5. **RBAC Pattern**
- Centralized permission checking
- Three levels: Menu, Route, Action
- Role-based with status-based rules

---

## File Structure

```
src/app/
├── models/              # TypeScript interfaces and enums
│   ├── user.model.ts
│   ├── producer.model.ts
│   └── permission.model.ts
│
├── services/            # Business logic and data
│   ├── rbac.service.ts
│   ├── producer.service.ts
│   └── tenant.service.ts
│
├── guards/             # Route protection
│   └── rbac.guard.ts
│
├── layout/             # Layout components
│   ├── header/
│   ├── sidebar/
│   └── main-layout/
│
├── pages/              # Page components
│   ├── producer-list/
│   └── placeholder/
│
├── shared/             # Reusable components
│   ├── components/
│   │   ├── status-tabs/
│   │   ├── search-filter/
│   │   ├── kebab-menu/
│   │   ├── pagination/
│   │   └── breadcrumb/
│   └── directives/
│       └── has-permission.directive.ts
│
├── data/               # Mock data
│   └── mock-producers.ts
│
├── app.component.ts
├── app.routes.ts
└── app.config.ts
```

---

## Summary

The Verdethos UI architecture follows a clean, component-based design with:

1. **Clear Separation**: Components, Services, Models, Guards
2. **Reactive State**: Angular Signals for efficient updates
3. **Comprehensive RBAC**: Three levels of access control
4. **Type Safety**: TypeScript throughout
5. **Scalability**: Standalone components, lazy loading ready
6. **Maintainability**: Small, focused components and services

The system is designed to be easily extensible for additional features, multi-tenant enhancements, and real backend integration.

