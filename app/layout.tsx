export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <div className="container">
          <h1>Leave Management System</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
