# Task Flow - Technical Assessment Project
![TF1](https://github.com/user-attachments/assets/04df0cae-3b2d-4d79-bd6a-dc41974bbb9a)

## Overview
Task Flow is a real-time task management application developed as part of a technical assessment. The project demonstrates modern web development practices and implementation of features using some of the latest technologies.

## Local Setup

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn
- Git

### Installation Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd prueba-tecnica-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.local
```
Edit `.env.local` with the [ReqRes API](https://reqres.in/) configurations.

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                  # Routes and pages
├── components/           # Reusable components
├── hooks/                # Custom hooks
├── redux/                # Global state and slices
├── types/                # Type definitions
└── utils/                # Utilities and helpers
```

## Design & Development

### Technology Stack & Dependencies

#### Core Technologies
- **[Next.js](https://nextjs.org/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Redux Toolkit](https://redux-toolkit.js.org/)**

#### UI Components & Styling
- **[Tailwind CSS](https://tailwindcss.com/)**: For rapid development and consistent design
- **[@dnd-kit/core](https://dndkit.com/)**: Implementing smooth drag and drop functionality
- **[React Hot Toast](https://react-hot-toast.com/)**: For elegant notifications
- **[Flowbite](https://flowbite.com/)**: For pre-built accessible components

#### Development Tools
- **[Jest](https://jestjs.io/)**: For comprehensive testing
- **[Testing Library](https://testing-library.com/)**: For React component testing
- **[ESLint](https://eslint.org/)**: For code quality

### Technology Selection

The technology stack was selected to meet modern development requirements:

1. **Modern Development**: Next.js provides the foundation for modern web development with React Server Components and streaming capabilities.

2. **Performance Optimization**: The combination of Next.js and Tailwind CSS delivers optimal performance in both development and production environments.

3. **Code Quality**: TypeScript and ESLint implementation ensures robust type safety and maintainable code structure.

4. **Enhanced User Experience**: Integration of @dnd-kit, React Hot Toast and Flowbite components delivers modern styles and interactions.

## Technical Implementation Details

### Data Persistence Strategy
The implementation of efficient data persistence was a technical challenge that was addressed through this mechanisms:

- **Custom Cache Hook**: `useTaskCache` custom React hook to manage local task state while maintaining server synchronization
- **Secure Storage**: Implementation of cryptographic functions for sensitive data encryption in localStorage
- **Real-time Sync**: A synchronization system ensuring data consistency across all clients

### Unique ID Generation System
The project implements a Task ID generation system designed for distributed environments:

- **Hybrid Approach**: Combines timestamp, user identifier, and cryptographic random values
- **Collision Prevention**: Implements client-side validation before synchronization
- **Conflict Resolution**: Uses logical timestamps for handling concurrent modifications

## Data Structures

### Task Management
As requested in the assessment, a tree node data structure was used for task management.

```typescript
interface BaseNode {
  id: Id;
  parentId: Id | null;
}

export interface Task extends BaseNode {
  type: "task";
  content: string;
  columnId: Id;
  isFavorite: boolean;
  status: TaskStatus;
  version: number;
  lastModified: number; 
}

export interface Column extends BaseNode {
  type: "column";
  title: string;
  taskIds: Id[];
}

export interface TreeNode {
  columns: {
    [id: string]: Column;
  };
  tasks: {
    [id: string]: Task;
  };
}

export interface TasksState {
  [userId: string]: TreeNode;
}
```

### Technical Requirements
The assessment specified key requirements for data structure implementation:

- **Tree-based Architecture**: Mandatory requirement for handling nested relationships
- **Normalized Data Model**: Required for efficient state updates and preventing data redundancy
- **Version Control**: Implementation of version tracking for conflict resolution
- **Performance Considerations**: Structure optimized for frequent updates and real-time operations

## Features and Implementation

### Core Functionality
- **ReqRes API for Authentication**: Manage main authentication with ReqRes API
- **2FA Method**: Implemented two-step verification for enhanced security
- **Real-time Task Management**: Full CRUD operations with immediate updates
- **Advanced Task Organization**: 
  - Intuitive drag-and-drop interface using @dnd-kit
  - Dynamic column management
  - Smart filtering and search capabilities
  - Favorites system for quick access
  - Customizable task states with visual indicators


## Testing Strategy

The goal was to maintain high code quality through extensive testing:

### Test Coverage and Types
- **Unit Tests**: Using Jest and React Testing Library
- **Integration Tests**: For critical user flows

### Key Test Areas
- Authentication flows
- State management
- UI component interactions

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## Future Development Opportunities

The current implementation establishes a strong foundation, with several identified areas for potential enhancement:

1. **Performance Optimization**
   - Implementation of virtual scrolling for large task lists
   - Further optimization of real-time synchronization

2. **Feature Enhancements**
   - Task attachment functionality
   - Rich text editing capabilities
   - Enhanced team collaboration features

## License

This project was developed as part of a technical assessment. The implementation utilizes various open-source libraries, each under their respective licenses as detailed in the Technology Stack section.
