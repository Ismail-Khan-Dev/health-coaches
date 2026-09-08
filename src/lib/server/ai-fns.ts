import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { templateSummary, recommendProgram, type Answers } from "@/lib/content";

async function grok(prompt: string, maxTokens = 280): Promise<string | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      max_tokens: maxTokens,
      messages: [
        {
          role: "system",
          content:
            "You are Aria Halden, a private health coach. You do not diagnose, treat, or prescribe. You write in calm, specific, human sentences. No hype, no emoji, no medical claims. Short paragraphs.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return body.choices?.[0]?.message?.content ?? null;
}

export const personalizeAssessment = createServerFn({ method: "POST" })
  .validator((d: { answers: Answers }) => d)
  .handler(async ({ data }) => {
    const program = recommendProgram(data.answers);
    const fallback = templateSummary(data.answers, program);
    const text = await grok(
      `A prospective client answered a lifestyle assessment (not medical). Answers JSON: ${JSON.stringify(data.answers)}. Write 90-120 words: reflect what they described, recommend the "${program.name}" coaching program as a possible fit, invite a consultation. Do not diagnose.`,
      220,
    );
    return {
      programSlug: program.slug,
      summary: text ?? fallback,
    };
  });

export const draftCheckinReply = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const [row] = await sql<{
      name: string;
      body: string | null;
      energy: number | null;
      sleep: number | null;
    }>`
      select c.name, sc.body, sc.energy, sc.sleep
      from studio_checkins sc
      join studio_clients c on c.id = sc.client_id
      where sc.id = ${data.id} and sc.coach_user_id = ${context.userId}
    `;
    if (!row) return { ok: false as const, error: "Not found" };
    const fallback = `${row.name.split(" ")[0]}, I read this. Energy ${row.energy}/10, sleep ${row.sleep}/10. Let's treat the pattern, not the self-verdict — reply with the one thing you will actually keep this week, and we'll build from there.`;
    const text = await grok(
      `Draft a 70-100 word coach reply to this client check-in. Client: ${row.name}. Energy ${row.energy}/10, sleep ${row.sleep}/10. They wrote: "${row.body}". Be specific, warm, not clinical. Ask one question. Do not diagnose.`,
      200,
    );
    return { ok: true as const, draft: text ?? fallback };
  });
