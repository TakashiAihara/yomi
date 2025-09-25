# TypeScript Configuration

Yomi uses `@tsconfig/strictest` to enforce the highest level of type safety possible in TypeScript.

## Features

### Strictest Type Checking
- **All strict flags enabled**: `strict: true` with all sub-flags
- **No implicit any**: `noImplicitAny: true`
- **Exact optional property types**: `exactOptionalPropertyTypes: true`
- **No unchecked indexed access**: `noUncheckedIndexedAccess: true`
- **No implicit returns**: `noImplicitReturns: true`
- **No implicit this**: `noImplicitThis: true`
- **Always strict**: `alwaysStrict: true`

### Type Safety Enhancements
- **Branded types**: Used for entity IDs and timestamps to prevent mixing different types
- **Readonly interfaces**: All entity interfaces use readonly properties
- **Custom error classes**: Structured error handling with detailed error information
- **Type guards**: Extensive runtime type checking

## Project Structure

```
tsconfig.base.json          # Base configuration extending @tsconfig/strictest
├── apps/
│   ├── web/tsconfig.json   # React app configuration
│   └── gateway/tsconfig.json # API Gateway configuration
├── services/
│   ├── user-service/tsconfig.json
│   ├── feed-service/tsconfig.json
│   ├── article-service/tsconfig.json
│   └── crawler-service/tsconfig.json
└── packages/
    ├── shared/tsconfig.json
    ├── grpc-contracts/tsconfig.json
    └── database/tsconfig.json
```

## Type Safety Examples

### Branded Types
```typescript
export type EntityId = string & { readonly __brand: 'EntityId' }
export type Timestamp = Date & { readonly __brand: 'Timestamp' }

// Prevents accidental mixing of different string types
function getUserById(id: EntityId): User { /* ... */ }
function getPostById(id: EntityId): Post { /* ... */ }

const userId = createEntityId("user-123")
const postId = createEntityId("post-456")

getUserById(postId) // ❌ Type error - prevents bugs
```

### Readonly Entities
```typescript
export interface BaseEntity {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

// Prevents accidental mutations
const user: BaseEntity = getUser()
user.id = "new-id" // ❌ Type error - property is readonly
```

### Structured Error Handling
```typescript
export class EnvironmentValidationError extends Error {
  public readonly errors: readonly EnvValidationError[]
  
  constructor(errors: readonly EnvValidationError[]) {
    // Detailed error information with field names and received values
  }
}
```

## Development Guidelines

### 1. Always Use Type Assertions Carefully
- Prefer type guards over type assertions
- Use branded types to prevent type confusion
- Add runtime validation for external data

### 2. Handle Undefined/Null Explicitly
```typescript
// ✅ Good
function processUser(user: User | undefined): void {
  if (user === undefined) {
    return
  }
  // user is now guaranteed to be defined
}

// ❌ Bad
function processUser(user: User | undefined): void {
  user.name // Error: Object is possibly 'undefined'
}
```

### 3. Use Exact Types
```typescript
// ✅ Good - exact object type
const config: { readonly host: string; readonly port: number } = {
  host: "localhost",
  port: 3000,
}

// ❌ Bad - allows excess properties
const config: Record<string, unknown> = {
  host: "localhost",
  port: 3000,
  extra: "not allowed", // Would be allowed but shouldn't be
}
```

## Benefits

1. **Catch More Bugs at Compile Time**: Strictest settings catch subtle bugs
2. **Better IDE Support**: More accurate autocomplete and error detection
3. **Self-Documenting Code**: Types serve as inline documentation
4. **Refactoring Safety**: Changes that break contracts are caught immediately
5. **Runtime Safety**: Combined with Zod validation for bulletproof type safety

## Migration Notes

When adding strictest TypeScript:
1. Fix all type errors before proceeding
2. Add proper type annotations for function parameters and returns
3. Handle all undefined/null cases explicitly
4. Use type guards for runtime type checking
5. Prefer readonly interfaces for immutable data

## Tools

- **Type Checking**: `pnpm typecheck`
- **Build**: `pnpm build` (includes type checking)
- **Testing**: All tests run with strict type checking enabled