import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { ensureWorkspace } from "./workspace";

export const getStudioHome = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    const clients = await sql<{
      id: string;
      name: string;
      role_label: string | null;
      program_slug: string | null;
      status: string;
      week_number: number;
      energy: number;
      sleep: number;
      consistency: number;
      last_checkin: string | null;
      focus: string | null;
      note: string | null;
      at_risk: boolean;
    }>`
      select id, name, role_label, program_slug, status, week_number, energy, sleep, consistency, last_checkin, focus, note, at_risk
      from studio_clients where coach_user_id = ${context.userId}
      order by at_risk desc, name
    `;
    const pending = await sql<{ c: number }>`
      select count(*)::int as c from studio_checkins
      where coach_user_id = ${context.userId} and status = 'pending'
    `;
    const active = clients.filter((c) => c.status === "active").length;
    const leads = clients.filter((c) => c.status === "lead").length;
    const risk = clients.filter((c) => c.at_risk).length;
    return { clients, pending: pending[0]?.c ?? 0, active, leads, risk };
  });

export const getStudioClient = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    const [client] = await sql<{
      id: string;
      name: string;
      role_label: string | null;
      program_slug: string | null;
      status: string;
      week_number: number;
      energy: number;
      sleep: number;
      consistency: number;
      last_checkin: string | null;
      focus: string | null;
      note: string | null;
      at_risk: boolean;
    }>`
      select id, name, role_label, program_slug, status, week_number, energy, sleep, consistency, last_checkin, focus, note, at_risk
      from studio_clients where id = ${data.id} and coach_user_id = ${context.userId}
    `;
    if (!client) return null;
    const checkins = await sql<{
      id: string;
      week_label: string | null;
      energy: number | null;
      sleep: number | null;
      body: string | null;
      status: string;
      created_at: string;
    }>`
      select id, week_label, energy, sleep, body, status, created_at::text as created_at
      from studio_checkins
      where coach_user_id = ${context.userId} and client_id = ${data.id}
      order by created_at desc
    `;
    return { client, checkins };
  });

export const getStudioCheckins = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    return sql<{
      id: string;
      client_id: string;
      name: string;
      week_label: string | null;
      energy: number | null;
      sleep: number | null;
      body: string | null;
      status: string;
      created_at: string;
    }>`
      select sc.id, sc.client_id, c.name, sc.week_label, sc.energy, sc.sleep, sc.body, sc.status, sc.created_at::text as created_at
      from studio_checkins sc
      join studio_clients c on c.id = sc.client_id
      where sc.coach_user_id = ${context.userId}
      order by sc.status = 'pending' desc, sc.created_at desc
    `;
  });

export const saveCoachNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; note: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update studio_clients set note = ${data.note}
      where id = ${data.id} and coach_user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const markCheckinReviewed = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update studio_checkins set status = 'reviewed'
      where id = ${data.id} and coach_user_id = ${context.userId}
    `;
    return { ok: true as const };
  });
