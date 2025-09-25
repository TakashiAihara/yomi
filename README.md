# Yomi - RSS Reader

A modern RSS reader application built with microservice architecture.

## Architecture

- **Frontend**: React with TypeScript, Vite, TanStack Router, Zustand, and Tailwind CSS
- **API Gateway**: Hono framework
- **Microservices**: User, Feed, Article, and Crawler services with gRPC
- **Database**: PostgreSQL with Drizzle ORM
- **Cache**: Valkey (Redis-compatible)
- **Message Queue**: Apache Pulsar
- **Monorepo**: Turborepo

## Project Structure

```
yomi/
├── apps/
│   ├── web/          # React frontend application
│   └── gateway/      # API Gateway with Hono
├── services/
│   ├── user-service/    # User authentication and management
│   ├── feed-service/    # RSS feed subscription management
│   ├── article-service/ # Article content and read status
│   └── crawler-service/ # RSS feed crawling and parsing
├── packages/
│   ├── shared/          # Shared utilities and types
│   ├── grpc-contracts/  # gRPC protocol definitions
│   └── database/        # Database schemas and migrations
└── turbo.json          # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0 (installed via asdf)
- PostgreSQL
- Redis/Valkey (optional for development)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

This will start all services in development mode with hot reload.

### Build

```bash
pnpm build
```

### Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e
```

### Linting and Formatting

```bash
# Check and fix issues
pnpm lint

# Format code
pnpm format

# Type checking
pnpm typecheck
```

## Services

### User Service (Port 50051)
Handles user authentication, registration, and profile management.

### Feed Service (Port 50052)
Manages RSS feed subscriptions and metadata.

### Article Service (Port 50053)
Handles article content, read/unread status, and filtering.

### Crawler Service (Port 50054)
Responsible for RSS feed crawling and content extraction.

### API Gateway (Port 8080)
Routes HTTP requests to appropriate microservices via gRPC.

### Web Application (Port 3000)
React-based frontend for the RSS reader.

## License

ISC