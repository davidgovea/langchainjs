import { afterEach, expect, it, vi } from "vitest";
import { AIMessage } from "@langchain/core/messages";
import { z } from "zod/v3";
import { ChatOpenAI } from "../index.js";

afterEach(() => vi.restoreAllMocks());

it("parses JSON from content blocks without provider-parsed output", async () => {
  const model = new ChatOpenAI({ model: "gpt-4o-mini", apiKey: "unused" });
  vi.spyOn(ChatOpenAI.prototype, "invoke").mockResolvedValue(
    new AIMessage({ content: [{ type: "text", text: '{"answer":"ok"}' }] })
  );
  await expect(
    model
      .withStructuredOutput(z.object({ answer: z.string() }), {
        method: "jsonSchema",
      })
      .invoke("Return JSON")
  ).resolves.toEqual({ answer: "ok" });
});
