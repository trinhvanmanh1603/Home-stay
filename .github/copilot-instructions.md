<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# HomeStay Frontend - Vue.js Project Instructions

## Project Overview
This is a Vue.js 3 homestay booking website built with modern web technologies including:
- Vue 3 with Composition API and TypeScript
- Tailwind CSS for styling
- Vue Router for navigation
- Pinia for state management
- Axios for API calls
- Heroicons for icons
- Headless UI for accessible components
- VueUse for composables
- json-server for mock API data

## Code Style Guidelines
1. **TypeScript**: Use TypeScript for all new files with proper type definitions
2. **Composition API**: Always use Vue 3 Composition API with `<script setup>`
3. **Component Structure**: Follow this order in Vue components:
   - Template
   - Script setup with imports, then props/emits, then reactive state, then computed, then methods, then lifecycle hooks
   - Styles (if needed)

## File Organization
- `src/components/` - Reusable UI components
- `src/pages/` - Route-level page components
- `src/store/` - Pinia stores for state management
- `src/types/` - TypeScript type definitions
- `src/composables/` - Reusable composition functions
- `data/` - JSON server mock data

## Naming Conventions
- Components: PascalCase (e.g., `StayCard.vue`)
- Files: kebab-case for non-component files
- Variables: camelCase
- Types/Interfaces: PascalCase

## Styling Guidelines
- Use Tailwind CSS utility classes
- Implement dark mode support with `dark:` prefixes
- Use custom CSS classes defined in `src/assets/main.css` for common patterns
- Ensure responsive design for mobile, tablet, and desktop

## Component Guidelines
- Keep components focused and single-responsibility
- Use props with proper TypeScript types
- Emit events for parent communication
- Use slots for flexible content composition

## API Integration
- All API calls should go through the appropriate Pinia store
- Use proper error handling and loading states
- Mock data is served by json-server on port 3001

## Development Workflow
- Run `npm run dev` for development server
- Run `npm run server` for json-server
- Run `npm run dev:full` to start both servers
- Use TypeScript strict mode
- Implement proper error boundaries and loading states
