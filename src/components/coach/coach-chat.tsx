"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormMessage } from "@/components/ui/form-message";
import { startCoachConversation, sendCoachMessage } from "@/lib/coach/actions";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function CoachChat({
  activityId,
  prompt,
}: {
  activityId: string;
  prompt: string | null;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isFinal, setIsFinal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleStart() {
    setError(null);
    startTransition(async () => {
      const result = await startCoachConversation(activityId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setConversationId(result.conversationId);
      setMessages([{ role: "assistant", content: result.reply }]);
      setIsFinal(result.isFinal);
    });
  }

  function handleSend() {
    if (!conversationId || !draft.trim()) return;
    setError(null);
    const userMessage = draft;
    setDraft("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    startTransition(async () => {
      const result = await sendCoachMessage(activityId, conversationId, userMessage);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: result.reply }]);
      setIsFinal(result.isFinal);
    });
  }

  function handleReset() {
    setMessages([]);
    setConversationId(null);
    setDraft("");
    setIsFinal(false);
    setError(null);
  }

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <span className="text-xs font-medium uppercase tracking-wide text-primary">
          AI Coach
        </span>
        {prompt && <p className="mt-1 text-sm font-medium">{prompt}</p>}
      </div>

      {messages.length === 0 ? (
        <Button type="button" disabled={pending} onClick={handleStart}>
          {pending ? "Starting..." : "Start conversation"}
        </Button>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
            {pending && (
              <div className="flex justify-start">
                <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                  ...
                </p>
              </div>
            )}
          </div>

          {isFinal ? (
            <Button type="button" variant="secondary" onClick={handleReset}>
              Practice again
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                type="text"
                value={draft}
                disabled={pending}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your reply..."
              />
              <Button type="button" disabled={pending || !draft.trim()} onClick={handleSend}>
                Send
              </Button>
            </div>
          )}
        </>
      )}

      {error && <FormMessage variant="error">{error}</FormMessage>}
    </Card>
  );
}
