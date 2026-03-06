import Navbar from "@/components/Custom/Navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
          <body>
            <Navbar/>
        {children}

      </body>
    </html>
  );
}
