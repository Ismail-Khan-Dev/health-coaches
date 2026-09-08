import { getSql } from "@/lib/db";
import { addDays, formatISO, startOfWeek } from "date-fns";

function id(userId: string, key: string) {
  return `${userId}:${key}`;
}

function hash01(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

function dayISO(d: Date) {
  return formatISO(d, { representation: "date" });
}

export async function ensureWorkspace(userId: string, email?: string | null) {
  const sql = await getSql();
  const existing = await sql<{ user_id: string; seeded: boolean }>`
    select user_id, seeded from profiles where user_id = ${userId}
  `;
  if (existing[0]?.seeded) return;

  const display = email?.split("@")[0]?.replace(/[._]/g, " ") ?? "there";
  const nice = display.charAt(0).toUpperCase() + display.slice(1);

  if (!existing[0]) {
    await sql`
      insert into profiles (user_id, display_name, email, program_slug, week_number, seeded)
      values (${userId}, ${nice}, ${email ?? null}, ${"foundation"}, ${4}, ${false})
    `;
  }

  const habits = [
    { key: "light", name: "Morning light, 8 minutes", cue: "Before the inbox" },
    { key: "lunch", name: "Sit down for lunch", cue: "Before 1pm" },
    { key: "walk", name: "Walk after a meal", cue: "Ten minutes is enough" },
    { key: "close", name: "Evening close", cue: "Kitchen lights down" },
    { key: "water", name: "Water before coffee", cue: "On the counter" },
  ];

  for (let i = 0; i < habits.length; i += 1) {
    const h = habits[i];
    await sql`
      insert into habits (id, user_id, name, cue, target_days, sort_order)
      values (${id(userId, `habit:${h.key}`)}, ${userId}, ${h.name}, ${h.cue}, ${6}, ${i})
      on conflict (id) do nothing
    `;
  }

  const today = new Date();
  for (let d = 27; d >= 0; d -= 1) {
    const day = addDays(today, -d);
    const iso = dayISO(day);
    for (const h of habits) {
      const hid = id(userId, `habit:${h.key}`);
      const p = hash01(`${userId}:${h.key}:${iso}`);
      const weekend = day.getDay() === 0 || day.getDay() === 6;
      if (p < (weekend ? 0.62 : 0.78)) {
        await sql`
          insert into habit_logs (id, user_id, habit_id, day)
          values (${id(userId, `log:${h.key}:${iso}`)}, ${userId}, ${hid}, ${iso}::date)
          on conflict do nothing
        `;
      }
    }
  }

  const goals = [
    { key: "energy", title: "Afternoons I can think through", detail: "No second coffee as a personality.", progress: 62 },
    { key: "sleep", title: "In bed before midnight, most nights", detail: "Exceptions chosen, not accidental.", progress: 48 },
    { key: "kept", title: "A week I do not have to restart", detail: "Two anchors that survive travel.", progress: 55 },
  ];
  for (let i = 0; i < goals.length; i += 1) {
    const g = goals[i];
    await sql`
      insert into goals (id, user_id, title, detail, progress, sort_order)
      values (${id(userId, `goal:${g.key}`)}, ${userId}, ${g.title}, ${g.detail}, ${g.progress}, ${i})
      on conflict (id) do nothing
    `;
  }

  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const plan = [
    { day: "Mon", title: "Lunch assembled before standup", detail: "Protein, colour, olive oil. Sit down." },
    { day: "Tue", title: "Walk the long way after the 2pm", detail: "Ten minutes. Phone in a pocket." },
    { day: "Wed", title: "Strength — twenty-five minutes", detail: "The short session. Not the penance session." },
    { day: "Thu", title: "Wind-down starts at 9:30", detail: "Kitchen closed. Book, not a briefing." },
    { day: "Fri", title: "Protect a real lunch", detail: "Calendar block named 'lunch', not 'focus'." },
    { day: "Sat", title: "Longer outing, pleasant on purpose", detail: "Walk or market. No metrics." },
    { day: "Sun", title: "Kitchen reset, twenty minutes", detail: "The five things stay visible." },
  ];
  for (let i = 0; i < plan.length; i += 1) {
    const p = plan[i];
    const done = i < 2;
    await sql`
      insert into plan_items (id, user_id, weekday, title, detail, done, sort_order)
      values (${id(userId, `plan:${weekStart.toISOString()}:${p.day}`)}, ${userId}, ${p.day}, ${p.title}, ${p.detail}, ${done}, ${i})
      on conflict (id) do nothing
    `;
  }

  const checkins = [
    {
      key: "w1",
      week: "Week 1",
      energy: 5,
      sleep: 5,
      mood: 6,
      wins: "I ate lunch sitting down four days. That is new.",
      challenges: "Thursday I worked until 10 and called it inevitable.",
      questions: "Is the 6am session actually helping, or just proving something?",
      reply:
        "The 6am is proving something. Let's retire it for two weeks and spend the sleep. Thursday is a scheduling problem, not a character one — we'll put a hard close on the calendar.",
      status: "reviewed",
      daysAgo: 21,
    },
    {
      key: "w2",
      week: "Week 2",
      energy: 6,
      sleep: 6,
      mood: 6,
      wins: "Evening close happened. I resented it and did it anyway.",
      challenges: "Travel day wrecked the meals.",
      questions: "What does a decent airport plate look like?",
      reply:
        "Protein and fruit before the security line, not after. I'll put the travel week note in your resources. You did not fail the week by travelling.",
      status: "reviewed",
      daysAgo: 14,
    },
    {
      key: "w3",
      week: "Week 3",
      energy: 7,
      sleep: 6,
      mood: 7,
      wins: "Afternoon reviews without a second coffee. Twice.",
      challenges: "Weekend still feels like a different person.",
      questions: "Do I keep the Saturday long outing if the week was heavy?",
      reply: null,
      status: "submitted",
      daysAgo: 6,
    },
  ];
  for (const c of checkins) {
    const created = addDays(today, -c.daysAgo).toISOString();
    await sql`
      insert into checkins (id, user_id, week_label, energy, sleep, mood, wins, challenges, questions, coach_reply, status, created_at)
      values (${id(userId, `check:${c.key}`)}, ${userId}, ${c.week}, ${c.energy}, ${c.sleep}, ${c.mood}, ${c.wins}, ${c.challenges}, ${c.questions}, ${c.reply}, ${c.status}, ${created}::timestamptz)
      on conflict (id) do nothing
    `;
  }

  const upcoming = addDays(today, 3);
  upcoming.setHours(14, 0, 0, 0);
  const past = addDays(today, -4);
  past.setHours(11, 0, 0, 0);
  await sql`
    insert into appointments (id, user_id, service_slug, service_name, starts_at, duration_min, status)
    values (${id(userId, "appt:next")}, ${userId}, ${"foundation-session"}, ${"Foundation session"}, ${upcoming.toISOString()}::timestamptz, ${45}, ${"scheduled"})
    on conflict (id) do nothing
  `;
  await sql`
    insert into appointments (id, user_id, service_slug, service_name, starts_at, duration_min, status)
    values (${id(userId, "appt:past")}, ${userId}, ${"foundation-session"}, ${"Foundation session"}, ${past.toISOString()}::timestamptz, ${45}, ${"completed"})
    on conflict (id) do nothing
  `;

  const thread: { key: string; author: "coach" | "client"; body: string; hours: number }[] = [
    { key: "m1", author: "coach", body: "Welcome in. I read your intake. The 2pm crash is the plot, not a side character — we'll treat it that way.", hours: 80 },
    { key: "m2", author: "client", body: "That tracks. I keep thinking I just need more discipline after lunch.", hours: 70 },
    { key: "m3", author: "coach", body: "Discipline is a crowded word. Let's move lunch earlier this week and leave the story alone. Send me what you actually ate on Tuesday.", hours: 68 },
    { key: "m4", author: "client", body: "Tuesday: leftover roast and greens at 12:40. I was hungry again at 4, but it was quieter.", hours: 40 },
    { key: "m5", author: "coach", body: "Quieter is the win. Keep the 12:40. Add fruit or yogurt at 4 so you're not negotiating with the cupboard. See you Thursday.", hours: 30 },
  ];
  for (const m of thread) {
    const created = addDays(today, 0);
    created.setHours(created.getHours() - m.hours);
    await sql`
      insert into messages (id, user_id, author, body, created_at)
      values (${id(userId, `msg:${m.key}`)}, ${userId}, ${m.author}, ${m.body}, ${created.toISOString()}::timestamptz)
      on conflict (id) do nothing
    `;
  }

  await sql`
    insert into notifications (id, user_id, title, body, href, read)
    values (${id(userId, "n1")}, ${userId}, ${"Thursday session"}, ${"Foundation session · 2:00pm"}, ${"/app/appointments"}, ${false})
    on conflict (id) do nothing
  `;
  await sql`
    insert into notifications (id, user_id, title, body, href, read)
    values (${id(userId, "n2")}, ${userId}, ${"Aria replied"}, ${"On your Week 2 check-in."}, ${"/app/check-ins"}, ${false})
    on conflict (id) do nothing
  `;

  const clients = [
    { key: "priya", name: "Priya Raman", role: "Product lead", program: "foundation", status: "active", week: 7, energy: 7, sleep: 6, consistency: 8, last: "2 days ago", focus: "Afternoon fuel", note: "Lunch moved earlier. Still skipping the evening close on late standup days.", risk: false },
    { key: "eliot", name: "Eliot Hart", role: "Counsel", program: "continuum", status: "active", week: 22, energy: 6, sleep: 8, consistency: 7, last: "Yesterday", focus: "Wind-down under depositions", note: "Sleep is holding. Weeknights still borrow from the next morning when a filing lands.", risk: false },
    { key: "nadia", name: "Nadia Okonkwo", role: "Founder", program: "foundation", status: "active", week: 3, energy: 5, sleep: 5, consistency: 6, last: "8 days ago", focus: "Recovery without guilt", note: "Check-in overdue. Ambition is still being used as a stimulant.", risk: true },
    { key: "thomas", name: "Thomas Berg", role: "Operator", program: "private-studio", status: "active", week: 11, energy: 8, sleep: 7, consistency: 9, last: "4 days ago", focus: "Travel protocol", note: "Red-eye next Tuesday. Plan already written; confirm the airport plate.", risk: false },
    { key: "camille", name: "Camille Renard", role: "Design director", program: "foundation", status: "active", week: 10, energy: 7, sleep: 8, consistency: 8, last: "3 days ago", focus: "Weekend continuity", note: "Weekdays look like hers. Saturdays still belong to a different person.", risk: false },
    { key: "jordan", name: "Jordan Hale", role: "Consult", program: "foundation", status: "lead", week: 0, energy: 5, sleep: 5, consistency: 4, last: "Consultation booked", focus: "Fit", note: "Arrives having tried four programs. Watch for all-or-nothing language.", risk: false },
  ];
  for (const c of clients) {
    await sql`
      insert into studio_clients (id, coach_user_id, name, role_label, program_slug, status, week_number, energy, sleep, consistency, last_checkin, focus, note, at_risk)
      values (${id(userId, `sc:${c.key}`)}, ${userId}, ${c.name}, ${c.role}, ${c.program}, ${c.status}, ${c.week}, ${c.energy}, ${c.sleep}, ${c.consistency}, ${c.last}, ${c.focus}, ${c.note}, ${c.risk})
      on conflict (id) do nothing
    `;
  }

  const pending = [
    { key: "p1", client: "nadia", week: "Week 3", energy: 5, sleep: 4, body: "I cancelled the walks because the week felt like an emergency. It was not an emergency. I am angry at myself and that is not helping.", status: "pending", days: 1 },
    { key: "p2", client: "eliot", week: "April", energy: 6, sleep: 8, body: "Two late filings. Wind-down survived one of them. The other I treated like a siege. Wine returned on Thursday.", status: "pending", days: 0 },
    { key: "p3", client: "priya", week: "Week 7", energy: 7, sleep: 6, body: "Afternoon reviews are cleaner. I still reach for a snack as punctuation. Not starving — punctuating.", status: "reviewed", days: 2 },
  ];
  for (const p of pending) {
    const created = addDays(today, -p.days).toISOString();
    await sql`
      insert into studio_checkins (id, coach_user_id, client_id, week_label, energy, sleep, body, status, created_at)
      values (${id(userId, `sck:${p.key}`)}, ${userId}, ${id(userId, `sc:${p.client}`)}, ${p.week}, ${p.energy}, ${p.sleep}, ${p.body}, ${p.status}, ${created}::timestamptz)
      on conflict (id) do nothing
    `;
  }

  await sql`update profiles set seeded = true where user_id = ${userId}`;
}
