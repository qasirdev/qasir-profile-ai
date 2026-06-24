"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import AIChat from "@/components/ai-chat";
import { ChatbaseEmbed, type ChatbaseEmbedHandle } from "@/components/chatbase-embed";
import { DIGITAL_TWIN_OPEN_EVENT } from "@/lib/digital-twin-events";
import {
  fetchChatbaseMirror,
  getProviderConfig,
  readStoredProvider,
  resolveProvider,
  writeStoredProvider,
  type DigitalTwinProvider,
} from "@/lib/digital-twin-provider";

const DigitalTwinOrchestrator = () => {
  const config = useMemo(() => getProviderConfig(), []);
  const chatbaseRef = useRef<ChatbaseEmbedHandle>(null);
  const providerRef = useRef<DigitalTwinProvider | null>(null);
  const switchingRef = useRef(false);
  const [provider, setProvider] = useState<DigitalTwinProvider | null>(null);

  useEffect(() => {
    providerRef.current = provider;
  }, [provider]);

  const switchToOpenRouter = useCallback((options?: { notify?: boolean; open?: boolean }) => {
    if (switchingRef.current || providerRef.current === "openrouter") {
      return;
    }
    switchingRef.current = true;

    writeStoredProvider("openrouter");
    providerRef.current = "openrouter";
    setProvider("openrouter");
    document.body.dataset.dtProvider = "openrouter";
    chatbaseRef.current?.hide();

    if (options?.notify !== false) {
      toast.message("Switched to Qasir's portfolio Digital Twin");
    }

    if (options?.open !== false) {
      window.dispatchEvent(new CustomEvent(DIGITAL_TWIN_OPEN_EVENT));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      const stored = readStoredProvider();
      const status = await fetchChatbaseMirror();
      const mirrorExhausted = status?.shouldUseOpenRouter ?? false;
      const resolved = resolveProvider(config, stored, mirrorExhausted);

      if (!cancelled) {
        providerRef.current = resolved;
        setProvider(resolved);
        document.body.dataset.dtProvider = resolved;
      }
    };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [config]);

  useEffect(() => {
    const handleOpen = () => {
      if (providerRef.current === "chatbase") {
        chatbaseRef.current?.open();
      }
    };

    window.addEventListener(DIGITAL_TWIN_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(DIGITAL_TWIN_OPEN_EVENT, handleOpen);
  }, []);

  const handleChatbaseExhausted = useCallback(() => {
    switchToOpenRouter();
  }, [switchToOpenRouter]);

  if (!provider) {
    return null;
  }

  return (
    <>
      {provider === "chatbase" && config.chatbaseEmbedId ? (
        <ChatbaseEmbed
          ref={chatbaseRef}
          embedId={config.chatbaseEmbedId}
          autoOpen
          onExhausted={handleChatbaseExhausted}
        />
      ) : null}
      {provider === "openrouter" ? <AIChat /> : null}
    </>
  );
};

export default DigitalTwinOrchestrator;
