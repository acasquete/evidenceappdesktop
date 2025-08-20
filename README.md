# evidenceappdesktop

Cross-platform desktop application using Tauri 2, React + Vite (TypeScript) and Rust.

## Development

```bash
pnpm install
pnpm dev
```

## Build & Release

```bash
pnpm build        # build application
pnpm release      # build for CI/CD release
pnpm build:mac    # package macOS installer
pnpm build:win    # package Windows installer
pnpm updater:manifest # generate updater manifest
```

## Testing

```bash
pnpm test
cargo test --manifest-path src-tauri/Cargo.toml
```

## Environment Variables

Create a `.env` file:

```
API_BASE_URL=https://api.example.com
TAURI_ENV=production
```

## Auto-update

Tauri updater is enabled with a stable release channel. Adjust `tauri.conf.json` for signing identities and update server.

## Structure

```
/evidenceappdesktop
  /src          # React + Vite frontend
  /src-tauri    # Rust commands
  package.json
  tauri.conf.json
```
