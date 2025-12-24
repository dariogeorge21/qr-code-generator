# QR Code Generator

A modern, responsive web application for generating QR codes from text, URLs, or numbers. Built with Next.js, TypeScript, and Tailwind CSS.

![QR Code Generator](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **Instant QR Code Generation**: Generate QR codes in real-time as you type
- **Multiple Input Types**: Supports text, URLs, and numbers
- **Multiple Download Formats**: Download QR codes as PNG or SVG
- **Modern UI/UX**: Beautiful, responsive design with gradient backgrounds
- **Error Handling**: Comprehensive validation and error messages
- **Mobile Responsive**: Works seamlessly on all device sizes
- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Visual Feedback**: Loading states, hover effects, and smooth transitions

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd qr-code-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📦 Build for Production

To create an optimized production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

To start the production server:

```bash
npm start
# or
yarn start
# or
pnpm start
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.1.1](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) - Utility-first CSS framework
- **QR Code Libraries**:
  - [react-qr-code](https://www.npmjs.com/package/react-qr-code) - React component for displaying QR codes
  - [qrcode](https://www.npmjs.com/package/qrcode) - QR code generation library for PNG downloads
- **Font**: [Inter](https://rsms.me/inter/) - Modern, clean sans-serif font

## 📖 Usage

1. **Enter Content**: Type any text, URL, or number in the input field
2. **Generate QR Code**: The QR code is generated automatically as you type, or click the "Generate" button
3. **Download**: Click "Download PNG" or "Download SVG" to save the QR code to your device

### Example Inputs

- URLs: `https://example.com`
- Text: `Hello, World!`
- Numbers: `1234567890`
- Email: `mailto:example@email.com`
- Phone: `tel:+1234567890`

## 🎨 Features in Detail

### Real-time Generation
QR codes are generated instantly as you type, providing immediate visual feedback.

### Download Options
- **PNG**: High-quality raster image (512x512px) perfect for printing and sharing
- **SVG**: Scalable vector format ideal for web use and high-resolution displays

### Error Handling
The application validates input and provides clear error messages for:
- Empty input fields
- Download attempts without generated QR codes
- Generation failures

### Responsive Design
The interface adapts seamlessly to:
- Desktop screens (1920px+)
- Tablets (768px - 1024px)
- Mobile devices (320px - 767px)

## 📁 Project Structure

```
qr-code-generator/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Main QR code generator component
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── README.md                 # This file
```

## 🔧 Configuration

### Customizing QR Code Appearance

You can modify the QR code appearance in `app/page.tsx`:

```typescript
// PNG generation options
await toCanvas(canvas, inputValue, {
  width: 512,        // Image size
  margin: 2,         // Border margin
  color: {
    dark: '#000000', // QR code color
    light: '#FFFFFF', // Background color
  },
});

// SVG display options
<QRCode
  value={inputValue}
  size={256}         // Display size
  fgColor="#000000"  // QR code color
  bgColor="#FFFFFF"  // Background color
/>
```

## 🐛 Troubleshooting

### Build Errors
If you encounter build errors, try:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Download Not Working
Ensure your browser allows downloads and pop-ups are not blocked.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [react-qr-code](https://www.npmjs.com/package/react-qr-code) for the React QR code component
- [qrcode](https://www.npmjs.com/package/qrcode) for QR code generation
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

Made with ❤️ using Next.js and TypeScript
