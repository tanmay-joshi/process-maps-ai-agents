# Process Maps - Interactive Whiteboarding Tool

A Next.js application for creating and sharing process diagrams with an interactive whiteboarding interface. Built with React, TypeScript, and Konva.js.

## Features

- User authentication with GitHub
- Create and manage multiple process diagrams
- Interactive canvas with drag-and-drop shapes
- Connect shapes with arrows
- Real-time updates
- Modern and responsive UI

## Prerequisites

- Node.js 18+ and npm
- GitHub OAuth application credentials

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd agentic-process-maps
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## GitHub OAuth Setup

1. Go to GitHub Developer Settings
2. Create a new OAuth application
3. Set the homepage URL to `http://localhost:3000`
4. Set the callback URL to `http://localhost:3000/api/auth/callback/github`
5. Copy the Client ID and Client Secret to your `.env` file

## Usage

1. Sign in with your GitHub account
2. Create a new board from the dashboard
3. Add shapes by clicking the buttons in the toolbar
4. Drag shapes to position them
5. Click a shape and drag to another shape to create a connection
6. Edit shape text by double-clicking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
