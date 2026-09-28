"use client";

import AIBody from "../component/ai_component/AI_body";
import AIFooter from "../component/ai_component/AI_footer";
import AIHeader from "../component/ai_component/AI_header";
import { useState } from "react";

export default function DiscoveryPage() {
  const [isChatting, setIsChatting] = useState(false);

  return (
    // h-dvh instead of h-screen: dvh accounts for mobile browser chrome
    // (address bar showing/hiding), so the layout doesn't jump around
    // on phones the way 100vh-based heights do. h-screen (not min-h-screen)
    // is the key fix either way — it caps the height instead of letting it grow.
    <div className="h-dvh ai_hide discovery_bg relative flex flex-col overflow-hidden">
      <div className="flex justify-center items-center shrink-0">
        <AIHeader />
      </div>

      {/* items-center removed (was vertically centering AIBody instead of
          stretching it), min-h-0 added so the scroll constraint actually
          reaches AIBody's internal chat container */}
      <div className="flex flex-1 min-h-0 justify-center">
        <AIBody onChatStart={() => setIsChatting(true)} />
      </div>

      {!isChatting && (
        <div className="py-4 flex shrink-0">
          <AIFooter />
        </div>
      )}
    </div>
  );
}