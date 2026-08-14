
# Invoicing System Frontend

This is the frontend application for the Invoicing System, built with Next.js and TypeScript. It provides a modern, responsive, and feature-rich user interface for managing invoices, clients, payments, and more.

---

## Technologies & Libraries

- **Next.js**: React framework for server-side rendering and static site generation.
- **TypeScript**: Strongly typed JavaScript for safer and more maintainable code.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Shadcn**:High customizable UI components with Tailwind CSS.
- **Jest/Testing Library**: For unit and integration testing.

---

## Deep Description

### Core Features

- **Authentication**: Login, registration, and session management using React Context and API integration.
- **Dashboard**: Overview of invoices, payments, and key business metrics.
- **Invoice Management**: Create, edit, view, and send invoices with support for multiple currencies and tax rules.
- **Client & Contact Management**: Manage clients, contacts, and related data.
- **Quotations**: Generate and manage quotations for potential sales.
- **Payments**: Track payments, payment conditions, and bank accounts.
- **Internationalization (i18n)**: Multi-language support (English, French, etc.) using next-i18next.
- **Responsive UI**: Mobile-friendly design using Tailwind CSS.
- **Role-based Access**: UI adapts to user roles and permissions.
- **Notifications**: In-app and email notifications for key events.

### Architecture

- **API Layer**: All data fetching and mutations are handled via the `src/api/` modules, which wrap Axios and provide typed interfaces.
- **Component-driven**: UI is built from reusable, modular React components organized by feature and domain.
- **State Management**: Uses React Context for global state (auth, theme, breadcrumbs, etc.), and hooks for local state.
- **Routing**: Next.js file-based routing in `src/pages/`.
- **Styling**: Tailwind CSS for rapid, consistent, and responsive design.

### Development

- **Run in dev mode:** `yarn dev`
- **Build for production:** `yarn build`
- **Start production server:** `yarn start`
- **Run tests:** `yarn test`

---

## License

This project is UNLICENSED and for internal use only.
