# Demo Examples

This directory contains various examples demonstrating how to use the SHEIN Open SDK for Node.js.

## Available Demos

### Node.js Examples

1. **Node.js Demo** (`node-example.js`)
   - Comprehensive demonstration of all SDK features
   - HTTP requests (GET/POST)
   - Configuration management
   - Data decryption
   - Error handling
   ```bash
   npm run demo:node
   ```

2. **TypeScript Demo** (`typescript-example.ts`)
   - TypeScript-specific examples
   - Type-safe requests
   - Error handling with types
   ```bash
   npm run demo:typescript
   ```

3. **OpenRequest Demo** (`open-request-example.ts`)
   - Focus on HTTP request functionality
   - Configuration examples
   - Advanced request options
   ```bash
   npm run demo:open-request
   ```

## Running All Demos

To run all available demos in sequence:

```bash
npm run demo:node
npm run demo:typescript
npm run demo:open-request
```

## Notes

- All demos create temporary configuration files that are automatically cleaned up
- TypeScript demos require `ts-node` to be available
- Make sure to build the project first: `npm run build`
- This SDK is designed specifically for Node.js environments