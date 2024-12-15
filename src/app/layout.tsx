import "./globals.css";
import ReduxProvider from "@/redux/storeProvider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
