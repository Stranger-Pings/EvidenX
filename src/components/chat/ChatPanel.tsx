import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare } from "lucide-react";
import { useSendQueryMutation } from "@/store/globalChat.api";

type ChatItem = {
  query: string;
  response: string;
  videoTimestamp?: number;
  audioTimestamps?: number[];
};

function Bubble({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "query" | "response";
}) {
  const base =
    "relative w-fit max-w-[220px] px-3 py-2 text-sm leading-5 rounded-2xl shadow-sm";
  const styles =
    variant === "query"
      ? "bg-blue-600 text-white shadow-md after:content-[''] after:absolute after:-right-2 after:top-3 after:border-y-8 after:border-y-transparent after:border-l-8 after:border-l-blue-600"
      : "bg-white text-foreground border border-blue-100 after:content-[''] after:absolute after:-left-2 after:top-3 after:border-y-8 after:border-y-transparent after:border-r-8 after:border-r-white";
  return <div className={`${base} ${styles}`}>{children}</div>;
}

export default function ChatPanel({
  caseId,
  setVideoTimestamp,
  setCurrentVideoTitle,
  setVideoPlayerOpen,
}: {
  caseId: string;
  setVideoTimestamp: (timestamp: number) => void;
  setCurrentVideoTitle: (title: string) => void;
  setVideoPlayerOpen: (open: boolean) => void;
}) {
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [chatQuery, setChatQuery] = useState("");
  const [sendQuery, { isLoading: isSending }] = useSendQueryMutation();
  const handleSubmit = async () => {
    if (chatQuery.trim()) {
      const response = await sendQuery({ caseId, query: chatQuery });
      setChatHistory([
        ...chatHistory,
        {
          query: chatQuery,
          response: response?.data?.message || "No response",
        },
      ]);
      setChatQuery("");
    }
  };
  return (
    <div className="w-80 bg-gradient-to-b from-blue-50 to-blue-100/40 border-r flex flex-col h-full">
      <div className="p-4 flex-shrink-0">
        <h3 className="font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-blue-600" />
          AI Assistant
        </h3>
        <p className="text-[11px] text-muted-foreground mt-1">
          Query across all case evidence
        </p>
      </div>

      <ScrollArea className="flex-1 px-3 pb-3 min-h-0">
        <div className="space-y-4">
          {chatHistory.map((chat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-end">
                <Bubble variant="query">{chat.query}</Bubble>
              </div>
              {chat.response && (
                <div className="flex justify-start">
                  <Bubble variant="response">
                    <div>{chat.response}</div>
                    {chat.videoTimestamp && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto text-blue-200 underline mt-2"
                        onClick={() => {
                          setVideoTimestamp(chat.videoTimestamp as number);
                          setCurrentVideoTitle("Evidence Video");
                          setVideoPlayerOpen(true);
                        }}
                      >
                        Jump to video (
                        {Math.floor((chat.videoTimestamp as number) / 60)}:
                        {((chat.videoTimestamp as number) % 60)
                          .toString()
                          .padStart(2, "0")}
                        )
                      </Button>
                    )}
                  </Bubble>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t flex-shrink-0 bg-gradient-to-t from-blue-50/60 to-transparent">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about evidence..."
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            className="flex-1 h-9 rounded-md bg-white"
          />
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSending}
            className="h-9 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
