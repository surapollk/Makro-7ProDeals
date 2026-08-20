import './globals.css';

export const metadata = {
  title: '7Pro Deals | สินค้าราคาพิเศษ',
  description: 'รวบรวมสินค้าคุณภาพ โปรโมชั่นพิเศษจาก Makro',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
