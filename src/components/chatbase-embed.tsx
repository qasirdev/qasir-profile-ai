"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import Script from "next/script";
import {
  markDigitalTwinDismissed,
  shouldAutoOpenDigitalTwin,
} from "@/lib/digital-twin-events";
import { isChatbaseExhaustionMessage, recordChatbaseUserMessage } from "@/lib/digital-twin-provider";

type ChatbaseEvent = {
  data?: { content?: string };
  type?: string;
};

type ChatbaseWidget = {
  open: () => void;
  close: () => void;
  resetChat: () => void;
  addEventListener: (eventName: string, callback: (event: ChatbaseEvent) => void) => void;
  removeEventListener: (eventName: string, callback: (event: ChatbaseEvent) => void) => void;
};

declare global {
  interface Window {
    chatbase?: ChatbaseWidget;
  }
}

export type ChatbaseEmbedHandle = {
  open: () => void;
  close: () => void;
  hide: () => void;
};

type ChatbaseEmbedProps = {
  embedId: string;
  onExhausted: () => void;
  onUserMessage?: () => void;
  autoOpen?: boolean;
};

const CHATBASE_HIDE_STYLE_ID = "dt-chatbase-hide-style";

function hideChatbaseBubble(): void {
  if (!document.getElementById(CHATBASE_HIDE_STYLE_ID)) {
    const style = document.createElement("style");
    style.id = CHATBASE_HIDE_STYLE_ID;
    style.textContent = `
      #chatbase-bubble-button,
      #chatbase-bubble-window,
      [id*="chatbase-bubble"],
      iframe[src*="chatbase"] {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
  }
}

function showChatbaseBubble(): void {
  document.getElementById(CHATBASE_HIDE_STYLE_ID)?.remove();
}

export const ChatbaseEmbed = forwardRef<ChatbaseEmbedHandle, ChatbaseEmbedProps>(
  function ChatbaseEmbed({ embedId, onExhausted, onUserMessage, autoOpen = true }, ref) {
    const readyRef = useRef(false);
    const autoOpenedRef = useRef(false);
    const autoOpenRef = useRef(autoOpen);
    const onExhaustedRef = useRef(onExhausted);
    const onUserMessageRef = useRef(onUserMessage);

    useEffect(() => {
      autoOpenRef.current = autoOpen;
    }, [autoOpen]);

    useEffect(() => {
      onExhaustedRef.current = onExhausted;
      onUserMessageRef.current = onUserMessage;
    }, [onExhausted, onUserMessage]);

    const openWidget = useCallback(() => {
      window.chatbase?.open();
    }, []);

    const closeWidget = useCallback(() => {
      window.chatbase?.close();
    }, []);

    const hideWidget = useCallback(() => {
      closeWidget();
      hideChatbaseBubble();
    }, [closeWidget]);

    useImperativeHandle(
      ref,
      () => ({
        open: openWidget,
        close: closeWidget,
        hide: hideWidget,
      }),
      [closeWidget, hideWidget, openWidget],
    );

    const tryAutoOpen = useCallback(() => {
      if (autoOpenedRef.current || !autoOpenRef.current || !shouldAutoOpenDigitalTwin()) {
        return;
      }

      autoOpenedRef.current = true;
      openWidget();
    }, [openWidget]);

    const attachListeners = useCallback(() => {
      const chatbase = window.chatbase;
      if (!chatbase?.addEventListener || readyRef.current) {
        return false;
      }

      const handleUserMessage = async () => {
        onUserMessageRef.current?.();
        const result = await recordChatbaseUserMessage();
        if (result?.shouldUseOpenRouter) {
          onExhaustedRef.current();
        }
      };

      const handleAssistantMessage = (event: ChatbaseEvent) => {
        const content = event.data?.content ?? "";
        if (isChatbaseExhaustionMessage(content)) {
          onExhaustedRef.current();
        }
      };

      const handleClose = () => {
        markDigitalTwinDismissed();
      };

      chatbase.addEventListener("user-message", handleUserMessage);
      chatbase.addEventListener("assistant-message", handleAssistantMessage);
      chatbase.addEventListener("close", handleClose);
      readyRef.current = true;
      showChatbaseBubble();
      tryAutoOpen();
      return true;
    }, [tryAutoOpen]);

    useEffect(() => {
      if (attachListeners()) {
        return;
      }

      let attempts = 0;
      const timer = window.setInterval(() => {
        attempts += 1;
        if (attachListeners() || attempts >= 20) {
          window.clearInterval(timer);
        }
      }, 250);

      return () => window.clearInterval(timer);
    }, [attachListeners]);

    const handleScriptReady = useCallback(() => {
      attachListeners();
    }, [attachListeners]);

    return (
      <Script
        id={embedId}
        src="https://www.chatbase.co/embed.min.js"
        strategy="lazyOnload"
        onReady={handleScriptReady}
        onLoad={handleScriptReady}
      />
    );
  },
);
