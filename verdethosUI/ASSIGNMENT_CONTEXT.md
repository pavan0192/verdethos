# Assignment Context & Implementation Plan

## Overview
This document outlines the take-home assignment for a Senior Fullstack Lead position, focusing on building a Producer Management module for a multi-tenant B2B SaaS platform.

## Assignment Requirements Summary

### Deliverables Required:
1. **Design Notes** (Markdown/PDF) - Architecture, decisions, RBAC, mobile strategy
2. **Angular Web Implementation** - Producer List page matching the provided UI screenshot
3. **Mobile Proof** - Single screen demonstration (Producer List or Detail)
4. **Backend Skeleton** - Minimal Node.js API with GET /producers
5. **AI Usage Note** - Documentation of AI-assisted development
6. **Sequence Diagram** - One flow visualization

## UI Requirements (From Screenshot)

### Global Layout:
- **Top Navigation Bar:**
  - VERDETHOS logo (green "V" + text)
  - Main menu: Supplier Management (active), Shipments, Publish, Inquiries
  - User controls: Language flag, Notifications, Calendar, User profile (Bob Smith)
  - Breadcrumbs: "Supplier Management > Producers"

- **Left Sidebar:**
  - Active section: "Producers" (highlighted in green)
  - Other sections: "Farms"

### Producer List Page:
- **Page Header:**
  - Title: "Producers"
  - Action button: "Add Producer" (with dropdown)

- **Status Tabs:**
  - "In-processing" (active, green)
  - "Approved"

- **Search & Filter Section:**
  - Search input: "Q Search" placeholder
  - Active filter chip: "EUDR: Yes X"
  - Filter button: "Filter 1"
  - Actions dropdown button
  - Info icon

- **Data Table Columns:**
  - Producer Name
  - Producer Type
  - # of Farms
  - Serasa
  - EUDR
  - Status (with color coding: Created, In Review, Rejected)
  - Kebab menu (vertical ellipsis) per row

- **Pagination:**
  - Previous/Next arrows
  - Current page indicator
  - Item count: "1-11 of 1200"
  - Items per page dropdown: "Show: 10 per page"

- **Kebab Menu Actions (Context-dependent):**
  - For "Created" status: View Details, Edit, Delete
  - For "In Review" status: Review (highlighted), View Details, Edit, Delete

## RBAC Requirements

### Three Levels:
1. **Main Menu** - Role-based visibility (Admin sees all, Compliance sees subset, Viewer sees read-only)
2. **Side Menu** - Route access control (guards prevent unauthorized navigation)
3. **Row Actions (Kebab)** - Role + Status driven (e.g., only Admin can delete, Compliance can review)

### Example Roles:
- **Admin** - Full access
- **Compliance** - Can review, edit, view (no delete)
- **Viewer** - Read-only access

## Technical Stack

### Web:
- Angular 20
- TypeScript 5.8+
- Standalone components
- Signals (Angular 20 features)

### Mobile:
- Ionic + Angular (recommended for code sharing)
- OR React Native / Flutter (if preferred)

### Backend:
- Node.js + Express
- In-memory data (mock)
- Tenant ID via header

## Implementation Plan

### Phase 1: Foundation
1. Project structure setup
2. Shared components, services, models
3. RBAC service and guards
4. Mock data service

### Phase 2: Layout Components
1. Top navigation bar component
2. Sidebar menu component
3. Main layout wrapper
4. Breadcrumb component

### Phase 3: Producer List Page
1. Page component structure
2. Status tabs component
3. Search/filter components
4. Data table component
5. Pagination component
6. Kebab menu component

### Phase 4: RBAC Integration
1. Main menu visibility logic
2. Side menu route guards
3. Kebab menu permission checks
4. Role-based UI rendering

### Phase 5: Backend & Mobile
1. Minimal Node.js API
2. Mobile proof (Ionic screen)
3. Shared data models

### Phase 6: Documentation
1. Design notes (architecture, decisions)
2. AI usage documentation
3. Sequence diagram

## Key Design Decisions

### Component Architecture:
- **Layout Components** - Reusable across pages (header, sidebar)
- **Page Components** - Feature-specific (producer-list)
- **Shared Components** - Common UI elements (table, pagination, kebab menu)
- **Services** - Business logic, data access, RBAC

### RBAC Strategy:
- Permission map (role → permissions)
- Route guards for navigation
- Directive/service for UI element visibility
- Status + Role combination for actions

### Mobile Strategy:
- Ionic + Angular for code sharing
- Shared services/models
- Mobile-specific UI components
- Simplified actions (no full kebab menu)

## Next Steps

1. Review and approve this plan
2. Start with foundation (structure, RBAC, mock data)
3. Build layout components
4. Implement Producer List page
5. Add RBAC integration
6. Create backend skeleton
7. Build mobile proof
8. Complete documentation

