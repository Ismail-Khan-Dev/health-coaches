export const BRAND = {
  name: "Halden",
  studio: "Halden Studio",
  coach: "Aria Halden",
  email: "studio@halden.practice",
  location: "Mill Valley, California — and remotely",
  tagline: "The quiet work of feeling well again.",
};

export const programs = [
  {
    slug: "foundation",
    name: "Foundation",
    duration: "12 weeks",
    cadence: "Weekly sessions · daily structure",
    price: "From $2,400",
    priceNote: "Paid in full, or three installments.",
    who: "For people who are successful everywhere except in the body that has to carry them.",
    promise:
      "Rebuild energy, sleep, and food rhythm so health stops being a project you keep restarting.",
    image: "/images/kitchen.jpg",
    includes: [
      "A 90-minute intake mapping your actual week, not an ideal one",
      "A living plan: meals, movement, sleep, and recovery — revised weekly",
      "12 private sessions (45 minutes, video or in studio)",
      "Async check-ins twice a week, read by Aria — not a chatbot",
      "The client portal: habits, messages, resources, appointments",
    ],
    weeks: [
      { title: "Weeks 1–2 · Observe", body: "We stop guessing. You track what actually happens on ordinary days: sleep, meals, energy, the 4pm crash. No overhaul yet." },
      { title: "Weeks 3–6 · Subtract", body: "Most plans fail because they add. We remove the three things that are quietly wrecking the rest — usually late eating, heroic mornings, and all-or-nothing weekends." },
      { title: "Weeks 7–10 · Anchor", body: "Two or three non-negotiables that survive travel, deadlines, and other people's needs. This is where it starts to feel like yours." },
      { title: "Weeks 11–12 · Hand-off", body: "You leave with a plan you can run without us — and a clear invitation into Continuum if you want the relationship to stay." },
    ],
  },
  {
    slug: "continuum",
    name: "Continuum",
    duration: "Month to month",
    cadence: "Two sessions · ongoing",
    price: "$890 / month",
    priceNote: "Cancel any time before the next billing date.",
    who: "For alumni of Foundation, or people who already know what to do and need someone who notices when they stop.",
    promise:
      "Keep the gains. Adjust for seasons, travel, and the months when life gets loud.",
    image: "/images/sleep.jpg",
    includes: [
      "Two 30-minute sessions each month",
      "A monthly plan reset against what's actually happening",
      "Open messaging, answered on studio days",
      "Priority booking for intensives",
      "Full portal access: progress, resources, check-ins",
    ],
    weeks: [
      { title: "The monthly arc", body: "Week 1 is a full review. Mid-month is a short correction. You are never more than two weeks from a human who knows the plot." },
      { title: "Seasonal work", body: "Winter sleep, summer travel, school terms, board meetings. Continuum exists so your health does not have to be reinvented every January." },
      { title: "No performance", body: "If a month is messy, we treat it as data. Continuum is a relationship, not a streak you can fail." },
    ],
  },
  {
    slug: "private-studio",
    name: "Private Studio",
    duration: "6 months",
    cadence: "High-touch · limited to 8 seats",
    price: "$7,200",
    priceNote: "Includes Foundation plus a dedicated half-year.",
    who: "For leaders, parents, and operators who need a private room — not a program they have to remember to attend.",
    promise:
      "A contained, high-accountability partnership. Your calendar, your travel, your actual constraints.",
    image: "/images/studio.jpg",
    includes: [
      "Bi-weekly 45-minute sessions for six months",
      "Same-week replies on studio days",
      "Travel and event protocols written into the plan",
      "Quarterly in-person intensives in Mill Valley (optional)",
      "Direct line for course-correction, not emergencies",
    ],
    weeks: [
      { title: "A closed studio", body: "Eight seats. That is the point. Aria's attention is the product, and it does not scale." },
      { title: "Built around the calendar", body: "We design to board meetings, school runs, and red-eyes — not to a sample day that never occurs." },
      { title: "What we will not do", body: "We will not promise a number on a scale, a lab result, or a diagnosis. We will stay with the work of energy, sleep, food, and follow-through." },
    ],
  },
] as const;

export type Program = (typeof programs)[number];

export function getProgram(slug: string) {
  return programs.find((p) => p.slug === slug);
}

export const stories = [
  {
    slug: "priya-afternoon",
    name: "Priya R.",
    role: "Product lead · Foundation",
    image: "/images/water.jpg",
    challenge: "She was sharp until 2pm, then foggy, then guilty about the snack that followed. Three 'resets' in two years.",
    approach: "We moved her real lunch earlier, killed the 6am workout she was using as penance, and treated the 2pm crash as a fuel problem.",
    outcome: "By week eight she was running afternoon reviews without a second coffee. She still travels. The plan travels with her.",
    quote: "I did not become a different person. I stopped fighting Tuesdays.",
  },
  {
    slug: "eliot-sleep",
    name: "Eliot H.",
    role: "Counsel · Continuum",
    image: "/images/dusk.jpg",
    challenge: "Sleep had been 'fine' for a decade — four hours, then a second wind at 11. He called it discipline. His mornings disagreed.",
    approach: "We protected a wind-down that survived depositions, and stopped using wine as the only off-switch. No sleep-hygiene lecture. A sequence.",
    outcome: "He is not a monk. He is in bed most nights before midnight, and the 6am briefs no longer feel like a raid.",
    quote: "Someone finally treated my calendar as a health variable, not an excuse.",
  },
  {
    slug: "nadia-after",
    name: "Nadia O.",
    role: "Founder · Foundation",
    image: "/images/movement.jpg",
    challenge: "After a year of building a company on adrenaline, her body had filed a complaint. Starts-and-stops. A gym membership as furniture.",
    approach: "We rebuilt from walking and a kitchen she would actually use. Ambition was not the enemy. Ambition without recovery was.",
    outcome: "She still works long days. She no longer confuses depletion with virtue. Continuum followed.",
    quote: "The studio did not make me softer. It made me accurate.",
  },
] as const;

export function getStory(slug: string) {
  return stories.find((s) => s.slug === slug);
}

export const articles = [
  {
    slug: "tuesdays",
    title: "Most health plans die on a Tuesday",
    dek: "Sunday intention is cheap. The test is an ordinary afternoon with a full inbox.",
    category: "Method",
    read: "6 min",
    image: "/images/desk.jpg",
    date: "12 August 2026",
    body: [
      "If your plan only works when the week is empty, you do not have a plan. You have a weekend. The people who arrive at Halden are not lazy. They are competent, and they have already collected a graveyard of protocols that looked perfect in a notebook.",
      "The Tuesday problem is almost always the same shape: a morning that was too heroic, a lunch that was too late, and an afternoon that was treated as a moral failure instead of a fuel shortage. By evening the person is negotiating with themselves. By Thursday they have called it a wash. By Monday they are shopping for a new system.",
      "We start by watching an actual week. Not macros in the abstract — the 1:40pm meeting, the school pickup, the delayed flight. Then we subtract. A smaller breakfast does not fix a 3pm crash. A 5:30am workout that steals sleep will not make you disciplined. It will make you brittle.",
      "The work is unglamorous: move lunch, protect a wind-down, pick two walks that survive weather. If that sounds too modest for the money, it is because modest things, kept, are what change a year.",
    ],
  },
  {
    slug: "sleep-is-not-virtue",
    title: "Sleep is not a moral achievement",
    dek: "Going to bed is not proof of character. It is a scheduling problem with lighting, food, and a nervous system.",
    category: "Sleep",
    read: "5 min",
    image: "/images/sleep.jpg",
    date: "28 July 2026",
    body: [
      "People tell me they are 'bad at sleep' the way they might confess to being bad at French. As if the skill were missing. In a decade of this work I have met almost no one who cannot sleep. I have met hundreds of people whose evenings are a second job.",
      "Screens are part of it. So is the glass of wine that works, until it doesn't. So is the belief that the only productive hour left is the one after the children are down. The nervous system does not care that your ambition is noble.",
      "The Halden wind-down is not a ten-step ritual. It is a closing time. Kitchen lights down. Phone on a dresser in another room. A book that does not improve you. The same sequence, most nights, including the nights you resent it.",
      "You will not become a person who never stays up. You may become a person whose default is rest, and whose exceptions are chosen.",
    ],
  },
  {
    slug: "not-a-diagnosis",
    title: "What this studio will not do",
    dek: "Coaching is not medicine. Clarity about that is part of the care.",
    category: "Studio",
    read: "4 min",
    image: "/images/studio.jpg",
    date: "3 June 2026",
    body: [
      "Halden is a coaching studio. We work with energy, sleep, food, movement, and the habits that make those things hold. We do not diagnose. We do not treat disease. We do not prescribe. We do not promise a weight, a lab panel, or a personality transplant.",
      "If you need a physician, we will say so — plainly, early, and without making it a sales objection. Several clients arrive already under medical care. That is often the right order. Coaching sits beside medicine. It does not impersonate it.",
      "What we will own: the design of a week you can live, the attention to notice when it slips, and a relationship that does not disappear when you have a messy month.",
      "If that sounds smaller than the internet, good. Smaller, kept, is the job.",
    ],
  },
  {
    slug: "walks",
    title: "A walk is not a consolation prize",
    dek: "When people are too tired for the plan they bought, walking is usually the plan they needed.",
    category: "Movement",
    read: "5 min",
    image: "/images/forest.jpg",
    date: "19 May 2026",
    body: [
      "A surprising number of exhausted people are doing a workout designed for someone who slept. They skip it, feel like a failure, and wait for Monday. Meanwhile their joints, mood, and glucose would have been glad of forty minutes outside.",
      "In Foundation we often retire the punishing session first. Not forever. First. Walking after meals, a hill on Wednesdays, a longer outing on the weekend that is allowed to be pleasant. Intensity returns when sleep and food can support it.",
      "If your identity is wrapped around training, this can feel like a demotion. It is not. It is a sequencing decision. Strength work is easier to keep when you are not negotiating with a depleted nervous system.",
      "The forest path is not a metaphor. It is a location. Put it on the calendar like a meeting with someone you would not cancel on.",
    ],
  },
] as const;

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export const resources = [
  { slug: "evening-close", title: "The evening close", kind: "Guide", minutes: 8, blurb: "A twelve-minute sequence that does not require a perfect bathroom or a new identity.", image: "/images/dusk.jpg", category: "Sleep" },
  { slug: "lunch-protocol", title: "Lunch that survives a 1pm meeting", kind: "Guide", minutes: 6, blurb: "What to put on a plate when the day already ran over you.", image: "/images/kitchen.jpg", category: "Food" },
  { slug: "two-walks", title: "Two walks that count", kind: "Audio", minutes: 11, blurb: "Aria on why movement should be scheduled like a person, not a mood.", image: "/images/forest.jpg", category: "Movement" },
  { slug: "travel-week", title: "The travel week", kind: "Guide", minutes: 9, blurb: "Airports, time zones, and the art of not throwing the week away.", image: "/images/water.jpg", category: "Rhythm" },
  { slug: "check-in-letter", title: "How to write a useful check-in", kind: "Note", minutes: 4, blurb: "Skip the confession. Send the pattern.", image: "/images/desk.jpg", category: "Coaching" },
  { slug: "kitchen-reset", title: "A kitchen you will actually use", kind: "Guide", minutes: 7, blurb: "Five things to keep visible. Everything else can wait.", image: "/images/kitchen.jpg", category: "Food" },
] as const;

export const faqs = [
  { q: "Is this medical care?", a: "No. Halden is health coaching — food, sleep, movement, and the structure of a week. We do not diagnose, treat, or prescribe. If something belongs with a physician, we will say so." },
  { q: "Who is this for?", a: "Adults whose lives already work on paper and whose bodies have been last in line. People who have tried the obvious things. We are not a beginner fitness challenge and we are not a clinic." },
  { q: "Do I have to be in California?", a: "No. Most of the studio is remote, by design. In-person intensives in Mill Valley are optional for Private Studio." },
  { q: "What happens in a consultation?", a: "Forty-five minutes. Aria will want to understand your week, what you have already tried, and whether the studio is the right room. It is a fit conversation, not a pitch deck. Complimentary." },
  { q: "Can I start without Foundation?", a: "Continuum is for people who already have a working method. Private Studio includes Foundation. If you are unsure, take the assessment or book a consultation — we will not sell you the longer engagement to be polite." },
  { q: "What if a month goes badly?", a: "You tell us. We treat it as data. You are not expelled from the studio for being human. If the work is not the right work, we will end it cleanly." },
];

export const services = [
  { slug: "consult", name: "Discovery consultation", duration: 45, price: "Complimentary", blurb: "A fit conversation. Bring the truth of your week." },
  { slug: "foundation-session", name: "Foundation session", duration: 45, price: "Included in program", blurb: "Weekly private session for Foundation clients." },
  { slug: "continuum-session", name: "Continuum session", duration: 30, price: "Included in retainer", blurb: "A focused correction against the current month." },
] as const;

export const methodSteps = [
  { n: "01", title: "Observe", body: "A real week, written down. Meals, sleep, energy, the places you already know you disappear." },
  { n: "02", title: "Subtract", body: "We remove the few things doing disproportionate damage. Adding comes later, if at all." },
  { n: "03", title: "Anchor", body: "Two or three practices that survive other people's needs. Held long enough to become default." },
  { n: "04", title: "Adjust", body: "Travel, seasons, a hard quarter. The plan is revised in conversation — not abandoned in private." },
];

export const assessmentQuestions = [
  {
    id: "aim",
    prompt: "What is the main thing you want help with?",
    note: "Choose the one that would change the year, not the one that sounds most impressive.",
    options: [
      { id: "energy", label: "Energy that lasts a whole workday" },
      { id: "sleep", label: "Sleep that actually restores me" },
      { id: "food", label: "A way of eating I can keep" },
      { id: "consistency", label: "Stopping the start-over cycle" },
      { id: "stress", label: "A body that is not always braced" },
    ],
  },
  {
    id: "tried",
    prompt: "How many times have you started a new health plan in the last three years?",
    options: [
      { id: "one", label: "Once, maybe twice" },
      { id: "few", label: "Three or four serious attempts" },
      { id: "many", label: "I have lost count" },
    ],
  },
  {
    id: "week",
    prompt: "Which of these is most true of a typical weekday?",
    options: [
      { id: "heroic", label: "I start ambitious and unravel by afternoon" },
      { id: "flat", label: "I am steady, but tired in a way coffee cannot reach" },
      { id: "chaotic", label: "There is no typical weekday" },
      { id: "late", label: "My day really begins after everyone else is asleep" },
    ],
  },
  {
    id: "sleep",
    prompt: "Sleep, lately.",
    options: [
      { id: "short", label: "I get enough hours. They do not feel like enough." },
      { id: "late", label: "I go to bed later than I mean to, most nights" },
      { id: "broken", label: "I wake and cannot return" },
      { id: "fine", label: "Sleep is not the main problem" },
    ],
  },
  {
    id: "food",
    prompt: "Food, honestly.",
    options: [
      { id: "skip", label: "I skip meals, then overcorrect" },
      { id: "rules", label: "I have a lot of rules, and they make me tired" },
      { id: "chaos", label: "I eat whatever the day throws" },
      { id: "steady", label: "I eat reasonably; I want it to feel less effortful" },
    ],
  },
  {
    id: "time",
    prompt: "How much time can you honestly protect, most days?",
    options: [
      { id: "minimal", label: "Fifteen minutes, if that" },
      { id: "some", label: "Thirty to forty-five minutes" },
      { id: "more", label: "An hour is realistic if it earns its place" },
    ],
  },
  {
    id: "block",
    prompt: "What usually gets in the way?",
    options: [
      { id: "work", label: "Work that expands to fill the evening" },
      { id: "family", label: "Other people who need me" },
      { id: "mood", label: "I wait to feel like it" },
      { id: "all", label: "All of it, in rotation" },
    ],
  },
  {
    id: "better",
    prompt: "Twelve weeks from now, what would 'better' actually look like?",
    options: [
      { id: "afternoons", label: "Afternoons I can think through" },
      { id: "mornings", label: "Mornings that do not feel like a raid" },
      { id: "quiet", label: "Less noise in my head about food and worth" },
      { id: "kept", label: "A way of living I do not have to restart" },
    ],
  },
] as const;

export type Answers = Record<string, string>;

export function recommendProgram(answers: Answers): Program {
  if (answers.tried === "many" || answers.time === "minimal") return programs[0];
  if (answers.aim === "sleep" && answers.tried !== "one") return programs[1];
  if (answers.week === "chaotic" || answers.block === "work") return programs[2];
  return programs[0];
}

export function templateSummary(answers: Answers, program: Program) {
  const aim =
    assessmentQuestions[0].options.find((o) => o.id === answers.aim)?.label ??
    "feeling better in ordinary weeks";
  return `Based on what you described, the work is less about information and more about a week that can hold ${aim.toLowerCase()}. ${program.name} is the closest fit: ${program.promise} This is not a diagnosis, and it is not a guarantee — it is a recommendation for a coaching approach. A consultation is where we decide if the room is right.`;
}

export const values = [
  { title: "Small, kept", body: "We would rather you keep two things than perform twelve." },
  { title: "The week is the truth", body: "If it does not survive a Tuesday, it is not the method." },
  { title: "Attention is the product", body: "Aria reads your check-ins. The studio is capped so that remains true." },
  { title: "No theatre", body: "No before-and-after spectacle. No medical cosplay. Language stays honest." },
];
