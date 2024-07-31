# Hookie - Custom Context Menu Actions for Chrome

Hookie is a Chrome extension that allows users to create custom context menu actions for various web interactions. Built with [Plasmo](https://docs.plasmo.com/), it provides a flexible way to enhance your browsing experience by adding personalized actions to your right-click menu.

## Features

- Create custom context menu actions for different contexts (page, selection, link, image, video, audio)
- Choose between redirect or background actions
- Support for both GET and POST HTTP methods
- Easy-to-use options page for managing actions
- Import and export functionality for backing up and sharing actions

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```
4. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build/chrome-mv3-dev` directory

## Building for Production

To create a production bundle:

```bash
pnpm build
# or
npm run build
```

This will generate a production-ready bundle in the `build` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
