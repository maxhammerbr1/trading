# AI Development Rules for TradingAI Pro

This document outlines the core technologies and best practices to be followed for all new development and modifications within the TradingAI Pro application. Adhering to these rules ensures consistency, maintainability, and leverages the full power of our chosen tech stack.

## Tech Stack Overview

The TradingAI Pro application will be built using the following modern web technologies:

*   **Frontend Framework**: React.js for building dynamic and interactive user interfaces.
*   **Language**: TypeScript for enhanced code quality, type safety, and better developer experience.
*   **Styling**: Tailwind CSS for a utility-first approach to styling, enabling rapid and consistent UI development.
*   **UI Component Library**: shadcn/ui for accessible, customizable, and pre-built UI components.
*   **Routing**: React Router for managing application navigation and defining clear page structures.
*   **Icons**: Lucide React for a comprehensive and easily integrated icon set.
*   **Component Architecture**: A modular component-based architecture, organizing code into reusable and focused units.

## Library Usage Rules

To maintain a clean and efficient codebase, please follow these guidelines for library usage:

*   **React**: All new UI features, pages, and components must be developed using React.
*   **TypeScript**: All new JavaScript files must be written in TypeScript (`.tsx` for React components, `.ts` for utility files). Existing `.js` files will be migrated as needed.
*   **Tailwind CSS**: Styling should exclusively use Tailwind CSS utility classes. Avoid creating or modifying custom `.css` files for component-specific styling. The `style.css` file is for global styles and variables only.
*   **shadcn/ui**: Prioritize using components from the `shadcn/ui` library for common UI elements (e.g., Button, Card, Select, RadioGroup). If a specific component is not available or requires significant custom logic, create a new, dedicated React component.
*   **Lucide React**: Use icons from the `lucide-react` library for all icon needs.
*   **React Router**: Application routes should be defined and managed within `src/App.tsx`. Page-level components should reside in `src/pages/`.
*   **File Structure**: Adhere to the `src/pages/` directory for page components and `src/components/` for reusable UI components. All source code should be within the `src` folder.