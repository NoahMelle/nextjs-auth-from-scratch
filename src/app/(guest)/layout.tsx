import React from "react";

export default function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-100 min-h-screen w-full flex justify-center items-center">
      <main className="bg-white shadow-xs p-4 rounded-lg w-full max-w-[400px]">
        {children}
      </main>
    </div>
  );
}
