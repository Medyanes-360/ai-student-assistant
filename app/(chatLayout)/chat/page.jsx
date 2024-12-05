import ChatContainer from "@/containers/chat";

export default function Dashboard() {
  return (
    <div className="flex flex-col w-full h-screen  items-center py-10 bg-[url('/images/chat-bg.svg')] bg-no-repeat bg-cover">
      <ChatContainer />
    </div>
  );
}
