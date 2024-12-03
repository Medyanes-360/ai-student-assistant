import Header from "@/components/layout/header";

export default function ChatHistoryLayout({ children }) {
  return (
    <main className="flex flex-col w-full h-screen">
      <Header />
      {children}
    </main>
  );
}
