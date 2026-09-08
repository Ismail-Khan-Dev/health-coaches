import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { ensureWorkspace } from "./workspace";
import { todayISO } from "@/lib/format";

async function seed(userId: string, email?: string | null) {
  await ensureWorkspace(userId, email);
}

export const getClientHome = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seed(context.userId);
    const sql = await getSql();
    const today = todayISO();
    const [profile] = await sql<{
      display_name: string | null;
      program_slug: string;
      week_number: number;
    }>`select display_name, program_slug, week_number from profiles where user_id = ${context.userId}`;
    const habits = await sql<{
      id: string;
      name: string;
      cue: string | null;
      target_days: number;
    }>`select id, name, cue, target_days from habits where user_id = ${context.userId} order by sort_order`;
    const doneToday = await sql<{ habit_id: string }>`
      select habit_id from habit_logs where user_id = ${context.userId} and day = ${today}::date
    `;
    const doneSet = new Set(doneToday.map((r) => r.habit_id));
    const goals = await sql<{
      id: string;
      title: string;
      detail: string | null;
      progress: number;
    }>`select id, title, detail, progress from goals where user_id = ${context.userId} order by sort_order`;
    const [nextAppt] = await sql<{
      id: string;
      service_name: string;
      starts_at: string;
      duration_min: number;
    }>`
      select id, service_name, starts_at::text as starts_at, duration_min
      from appointments
      where user_id = ${context.userId} and status = 'scheduled' and starts_at >= now()
      order by starts_at asc
      limit 1
    `;
    const [latestMsg] = await sql<{ author: string; body: string; created_at: string }>`
      select author, body, created_at::text as created_at from messages
      where user_id = ${context.userId} order by created_at desc limit 1
    `;
    const [openCheck] = await sql<{ id: string; week_label: string; status: string }>`
      select id, week_label, status from checkins
      where user_id = ${context.userId} order by created_at desc limit 1
    `;
    const weekLogs = await sql<{ c: number }>`
      select count(*)::int as c from habit_logs
      where user_id = ${context.userId} and day >= (current_date - 6)
    `;
    const notes = await sql<{ id: string; title: string; body: string | null; href: string | null }>`
      select id, title, body, href from notifications
      where user_id = ${context.userId} and read = false
      order by created_at desc
    `;
    return {
      profile: profile ?? { display_name: "there", program_slug: "foundation", week_number: 1 },
      habits: habits.map((h) => ({ ...h, done: doneSet.has(h.id) })),
      goals,
      nextAppt: nextAppt ?? null,
      latestMsg: latestMsg ?? null,
      openCheck: openCheck ?? null,
      weekHabitCount: weekLogs[0]?.c ?? 0,
      notifications: notes,
      today,
    };
  });

export const toggleHabitToday = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { habitId: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const today = todayISO();
    const owned = await sql<{ id: string }>`
      select id from habits where id = ${data.habitId} and user_id = ${context.userId}
    `;
    if (!owned[0]) return { ok: false as const };
    const existing = await sql<{ id: string }>`
      select id from habit_logs where habit_id = ${data.habitId} and user_id = ${context.userId} and day = ${today}::date
    `;
    if (existing[0]) {
      await sql`delete from habit_logs where id = ${existing[0].id} and user_id = ${context.userId}`;
      return { ok: true as const, done: false };
    }
    const logId = `${context.userId}:log:${data.habitId}:${today}:${Date.now()}`;
    await sql`
      insert into habit_logs (id, user_id, habit_id, day)
      values (${logId}, ${context.userId}, ${data.habitId}, ${today}::date)
    `;
    return { ok: true as const, done: true };
  });

export const getHabits = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seed(context.userId);
    const sql = await getSql();
    const habits = await sql<{
      id: string;
      name: string;
      cue: string | null;
      target_days: number;
    }>`select id, name, cue, target_days from habits where user_id = ${context.userId} order by sort_order`;
    const logs = await sql<{ habit_id: string; day: string }>`
      select habit_id, day::text as day from habit_logs
      where user_id = ${context.userId} and day >= (current_date - 27)
    `;
    return { habits, logs, today: todayISO() };
  });

export const getPlan = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seed(context.userId);
    const sql = await getSql();
    const items = await sql<{
      id: string;
      weekday: string;
      title: string;
      detail: string | null;
      done: boolean;
    }>`select id, weekday, title, detail, done from plan_items where user_id = ${context.userId} order by sort_order`;
    const [profile] = await sql<{ program_slug: string; week_number: number }>`
      select program_slug, week_number from profiles where user_id = ${context.userId}
    `;
    return { items, profile };
  });

export const togglePlanItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update plan_items set done = not done
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const getProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seed(context.userId);
    const sql = await getSql();
    const goals = await sql<{
      id: string;
      title: string;
      detail: string | null;
      progress: number;
    }>`select id, title, detail, progress from goals where user_id = ${context.userId} order by sort_order`;
    const checkins = await sql<{
      week_label: string;
      energy: number | null;
      sleep: number | null;
      mood: number | null;
      created_at: string;
    }>`
      select week_label, energy, sleep, mood, created_at::text as created_at
      from checkins where user_id = ${context.userId}
      order by created_at asc
    `;
    const logs = await sql<{ day: string; c: number }>`
      select day::text as day, count(*)::int as c
      from habit_logs
      where user_id = ${context.userId} and day >= (current_date - 27)
      group by day order by day
    `;
    return { goals, checkins, logs };
  });

export const getCheckins = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seed(context.userId);
    const sql = await getSql();
    return sql<{
      id: string;
      week_label: string;
      energy: number | null;
      sleep: number | null;
      mood: number | null;
      wins: string | null;
      challenges: string | null;
      questions: string | null;
      coach_reply: string | null;
      status: string;
      created_at: string;
    }>`
      select id, week_label, energy, sleep, mood, wins, challenges, questions, coach_reply, status, created_at::text as created_at
      from checkins where user_id = ${context.userId}
      order by created_at desc
    `;
  });

export const submitCheckin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    energy: number;
    sleep: number;
    mood: number;
    wins: string;
    challenges: string;
    questions: string;
  }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = `${context.userId}:check:${Date.now()}`;
    await sql`
      insert into checkins (id, user_id, week_label, energy, sleep, mood, wins, challenges, questions, status)
      values (${id}, ${context.userId}, ${"This week"}, ${data.energy}, ${data.sleep}, ${data.mood}, ${data.wins}, ${data.challenges}, ${data.questions}, ${"submitted"})
    `;
    return { ok: true as const, id };
  });

export const getMessages = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seed(context.userId);
    const sql = await getSql();
    return sql<{ id: string; author: string; body: string; created_at: string }>`
      select id, author, body, created_at::text as created_at
      from messages where user_id = ${context.userId}
      order by created_at asc
    `;
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { body: string }) => ({ body: d.body.trim() }))
  .handler(async ({ context, data }) => {
    if (!data.body) return { ok: false as const };
    const sql = await getSql();
    const id = `${context.userId}:msg:${Date.now()}`;
    await sql`
      insert into messages (id, user_id, author, body)
      values (${id}, ${context.userId}, ${"client"}, ${data.body})
    `;
    return { ok: true as const };
  });

export const getAppointments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seed(context.userId);
    const sql = await getSql();
    return sql<{
      id: string;
      service_name: string;
      starts_at: string;
      duration_min: number;
      status: string;
      notes: string | null;
    }>`
      select id, service_name, starts_at::text as starts_at, duration_min, status, notes
      from appointments where user_id = ${context.userId}
      order by starts_at desc
    `;
  });

export const cancelAppointment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update appointments set status = 'cancelled'
      where id = ${data.id} and user_id = ${context.userId} and status = 'scheduled'
    `;
    return { ok: true as const };
  });

export const getFavorites = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seed(context.userId);
    const sql = await getSql();
    const rows = await sql<{ slug: string }>`
      select slug from resource_favs where user_id = ${context.userId}
    `;
    return rows.map((r) => r.slug);
  });

export const toggleFavorite = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { slug: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql<{ slug: string }>`
      select slug from resource_favs where user_id = ${context.userId} and slug = ${data.slug}
    `;
    if (existing[0]) {
      await sql`delete from resource_favs where user_id = ${context.userId} and slug = ${data.slug}`;
      return { on: false };
    }
    await sql`insert into resource_favs (user_id, slug) values (${context.userId}, ${data.slug})`;
    return { on: true };
  });

export const saveAssessment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { answers: Record<string, string>; recommendedSlug: string; summary: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = `${context.userId}:assess:${Date.now()}`;
    await sql`
      insert into assessments (id, user_id, answers, recommended_slug, summary)
      values (${id}, ${context.userId}, ${JSON.stringify(data.answers)}, ${data.recommendedSlug}, ${data.summary})
    `;
    await sql`
      update profiles set program_slug = ${data.recommendedSlug} where user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const createBooking = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { serviceSlug: string; serviceName: string; startsAt: string; notes: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = `${context.userId}:appt:${Date.now()}`;
    await sql`
      insert into appointments (id, user_id, service_slug, service_name, starts_at, duration_min, status, notes)
      values (${id}, ${context.userId}, ${data.serviceSlug}, ${data.serviceName}, ${data.startsAt}::timestamptz, ${45}, ${"scheduled"}, ${data.notes})
    `;
    return { ok: true as const, id };
  });

export const getProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seed(context.userId);
    const sql = await getSql();
    const [row] = await sql<{
      display_name: string | null;
      email: string | null;
      timezone: string;
      program_slug: string;
    }>`select display_name, email, timezone, program_slug from profiles where user_id = ${context.userId}`;
    return row ?? null;
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { displayName: string; timezone: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update profiles set display_name = ${data.displayName}, timezone = ${data.timezone}
      where user_id = ${context.userId}
    `;
    return { ok: true as const };
  });
