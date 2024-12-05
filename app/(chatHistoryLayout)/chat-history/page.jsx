import HistoryPageContainer from "@/containers/history";

export default function HistoryPage() {
  return (
    <div className="flex flex-col w-full h-screen items-center bg-[url('/images/chat-history-bg.svg')] bg-no-repeat bg-cover">
      <HistoryPageContainer />
    </div>
  );
}
