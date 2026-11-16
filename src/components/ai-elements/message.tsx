/**
 * Message, do shadcn/ui AI Elements (registry.ai-sdk.dev), reduzido ao que o
 * Radar IA usa: o contêiner da mensagem e o conteúdo.
 *
 * O original importa o SDK `ai` (tipos de mensagem de LLM), o `streamdown`
 * (markdown em streaming), anexos e ramificações de resposta. O Radar não usa
 * modelo de linguagem (v1.6 proíbe simular), então isso saiu. O `from` aceita
 * os dois papéis da conversa guiada.
 */
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type MessageRole = "user" | "assistant";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: MessageRole;
};

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      "group flex w-full max-w-[95%] flex-col gap-2",
      from === "user" ? "is-user ml-auto items-end justify-end" : "is-assistant",
      className
    )}
    {...props}
  />
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent = ({ children, className, ...props }: MessageContentProps) => (
  <div
    className={cn(
      "flex w-fit max-w-full min-w-0 flex-col gap-2 overflow-hidden text-sm",
      "group-[.is-user]:ml-auto group-[.is-user]:rounded-3xl group-[.is-user]:rounded-br-md group-[.is-user]:bg-ink group-[.is-user]:px-4 group-[.is-user]:py-2.5 group-[.is-user]:text-paper",
      "group-[.is-assistant]:text-foreground",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
