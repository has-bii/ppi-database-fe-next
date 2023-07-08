export default function AuthLayout({
  children, // will be a page or nested layout
}) {
  return (
    <main>
      <div className="flex items-center justify-center w-screen h-screen">
        {children}
      </div>
    </main>
  );
}
