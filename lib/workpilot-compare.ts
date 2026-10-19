/**
 * WorkPilot comparison pages (/workpilot/vs/<slug>).
 * Every statement about another product must come from that vendor's own public information.
 * Keep wording factual and fair; leave a row out rather than guess. Update REVIEWED when you re-check.
 */
export const REVIEWED = "October 2026";

export type Mark = "yes" | "partly" | "no";
export type Row = { feature: string; wp: { mark: Mark; note: string }; them: { mark: Mark; note: string } };

export type Competitor = {
  slug: string;
  name: string;
  title: string;          // page <title>
  description: string;    // meta description
  h1: string;
  intro: string;
  theyAre: string;        // what the other product is
  rows: Row[];
  chooseThem: string[];
  chooseWp: string[];
  pricingNote: string;
};

const wp = {
  checklists: { mark: "yes" as Mark, note: "Daily routines appear on their own; skipped ones are flagged" },
  delegation: { mark: "yes" as Mark, note: "Assign to a person or team with a deadline, with reminders" },
  fms: { mark: "yes" as Mark, note: "Every step has an owner and a time limit" },
  attendance: { mark: "yes" as Mark, note: "Included, live every day" },
  score: { mark: "yes" as Mark, note: "A score from attendance, on-time tasks and activity" },
  phone: { mark: "yes" as Mark, note: "Opens in any phone browser, nothing to install" },
  setup: { mark: "yes" as Mark, note: "Setup help from our team is included in every plan" },
};

export const COMPETITORS: Competitor[] = [
  {
    slug: "microsoft-365",
    name: "Microsoft 365",
    title: "WorkPilot vs Microsoft 365 (Planner, Lists, Teams) | LRBC",
    description: "How WorkPilot compares with Microsoft 365 for daily checklists, delegation, step-by-step flows and attendance in a growing factory or service business.",
    h1: "WorkPilot vs Microsoft 365",
    intro: "Microsoft 365 is a very capable suite, and many businesses already pay for it. The question is whether its task tools are enough to run your team's daily work, or whether you would be assembling a system from parts.",
    theyAre: "Microsoft 365 is a general productivity suite: email, documents, Teams chat and meetings. Task tools such as Planner, To Do and Lists, and automation through Power Automate, are part of it.",
    rows: [
      { feature: "Built for", wp: { mark: "yes", note: "Owners running a team on checklists, delegation and process flows" }, them: { mark: "partly", note: "General productivity; task tools are one part of a large suite" } },
      { feature: "Daily checklists that repeat", wp: wp.checklists, them: { mark: "partly", note: "Recurring tasks are available; a view of which routines were skipped usually has to be built" } },
      { feature: "Delegation with deadlines and reminders", wp: wp.delegation, them: { mark: "yes", note: "Planner, To Do and Teams can assign tasks with due dates" } },
      { feature: "Step-by-step flows with a time limit per step", wp: wp.fms, them: { mark: "partly", note: "Possible with Lists and Power Automate; someone has to design and maintain it" } },
      { feature: "Attendance and leave", wp: wp.attendance, them: { mark: "partly", note: "Teams Shifts covers scheduling and clock-in; leave and attendance reports usually come from another tool" } },
      { feature: "Score for every person", wp: wp.score, them: { mark: "no", note: "Not a built-in feature of the task tools" } },
      { feature: "On a phone", wp: wp.phone, them: { mark: "partly", note: "Uses the Teams or Planner mobile apps and a Microsoft account for each person" } },
      { feature: "Setup", wp: wp.setup, them: { mark: "partly", note: "You or your IT partner configure and maintain it" } },
    ],
    chooseThem: [
      "You already use Microsoft 365 across the company and want tasks in the same place as email and files.",
      "You have someone who can design and maintain flows in Power Automate and Lists.",
      "Your work is mostly office and document based, not shift and floor routines.",
    ],
    chooseWp: [
      "You want daily checklists, delegation, step-by-step flows and attendance ready to use, not assembled.",
      "Your team is on the floor, and the easiest tool is one that opens in a phone browser.",
      "You want one screen showing what's done, what's late and who to talk to.",
    ],
    pricingNote: "Microsoft 365 is priced per user per month for the whole suite, and the task tools are included in the business plans. Check Microsoft's site for current rates. WorkPilot is ₹399, ₹299 or ₹199 per user per month depending on plan, plus GST, with setup help included.",
  },
  {
    slug: "jira",
    name: "Jira",
    title: "WorkPilot vs Jira for running daily work | LRBC",
    description: "Jira is built for tracking issues in software and project teams. See how it compares with WorkPilot for daily checklists, delegation and attendance in a factory or service business.",
    h1: "WorkPilot vs Jira",
    intro: "Jira is excellent at what it was built for: tracking issues through a workflow. Running a floor team's daily routines is a different job, and that difference decides which tool fits.",
    theyAre: "Jira, from Atlassian, is a work-tracking tool made for software and IT teams, now used by other business teams too. Work is tracked as issues on boards, moving through a workflow of statuses.",
    rows: [
      { feature: "Built for", wp: { mark: "yes", note: "Factories and service businesses running a team on follow-ups" }, them: { mark: "partly", note: "Software, IT and project teams tracking issues" } },
      { feature: "Daily checklists that repeat", wp: wp.checklists, them: { mark: "partly", note: "Not a native routine tool; automation rules can create tasks on a schedule" } },
      { feature: "Delegation with deadlines and reminders", wp: wp.delegation, them: { mark: "yes", note: "Assign issues with due dates and notifications" } },
      { feature: "Step-by-step flows with a time limit per step", wp: wp.fms, them: { mark: "partly", note: "Workflows with statuses are a core strength; time limits per step need extra configuration or a service-desk product" } },
      { feature: "Attendance and leave", wp: wp.attendance, them: { mark: "no", note: "Not part of Jira" } },
      { feature: "Score for every person", wp: wp.score, them: { mark: "no", note: "Reports are about issues, not attendance and activity" } },
      { feature: "On a phone", wp: wp.phone, them: { mark: "partly", note: "Mobile apps and each person needs an account; the language of issues and sprints takes some learning" } },
      { feature: "Setup", wp: wp.setup, them: { mark: "partly", note: "Self-serve; fitting it to floor routines is up to you" } },
    ],
    chooseThem: [
      "Your team builds software or manages IT projects.",
      "You need deep issue tracking, sprints and developer integrations.",
      "Your people are comfortable with project-management tools.",
    ],
    chooseWp: [
      "Your team is on the floor or in the field and works from phones.",
      "You need routines, hand-outs and order flows tracked in plain language, with attendance included.",
      "You want to see who is delivering without teaching the team a new vocabulary.",
    ],
    pricingNote: "Jira is priced per user per month, billed by Atlassian, and has a free plan for small teams. Check Atlassian's site for current plans and limits. WorkPilot is ₹399, ₹299 or ₹199 per user per month depending on plan, plus GST, with setup help included.",
  },
  {
    slug: "zoho",
    name: "Zoho",
    title: "WorkPilot vs Zoho (Projects and People) | LRBC",
    description: "Compare WorkPilot with Zoho Projects and Zoho People for daily checklists, delegation, step-by-step flows and attendance in a growing business.",
    h1: "WorkPilot vs Zoho",
    intro: "Zoho offers a wide range of business apps, and several of them touch the same ground as WorkPilot. Here is how the pieces line up, and where the trade-offs are.",
    theyAre: "Zoho is a family of business apps. For this comparison, Zoho Projects covers tasks and project work, and Zoho People covers attendance, leave and HR. They are separate products.",
    rows: [
      { feature: "Built for", wp: { mark: "yes", note: "Owners running a team on checklists, delegation and flows" }, them: { mark: "partly", note: "Projects for project work; People for HR. Two products for two jobs" } },
      { feature: "Daily checklists that repeat", wp: wp.checklists, them: { mark: "partly", note: "Projects supports recurring tasks; a view of skipped routines may need reports set up" } },
      { feature: "Delegation with deadlines and reminders", wp: wp.delegation, them: { mark: "yes", note: "Tasks can be assigned with due dates and reminders" } },
      { feature: "Step-by-step flows with a time limit per step", wp: wp.fms, them: { mark: "partly", note: "Possible with task dependencies or by combining other Zoho apps; not a ready order-flow module in Projects" } },
      { feature: "Attendance and leave", wp: wp.attendance, them: { mark: "yes", note: "Zoho People covers attendance and leave, as a separate product" } },
      { feature: "Score for every person", wp: wp.score, them: { mark: "partly", note: "Performance features sit in HR tools; not the same as a score from daily task and attendance data" } },
      { feature: "On a phone", wp: wp.phone, them: { mark: "partly", note: "Mobile apps for each product; each person needs an account" } },
      { feature: "Setup", wp: wp.setup, them: { mark: "partly", note: "Self-serve or through a Zoho partner" } },
    ],
    chooseThem: [
      "You want a full HR system with deep leave, payroll and policy features.",
      "You already run on other Zoho apps and want everything connected.",
      "You have a partner or a team to configure several products.",
    ],
    chooseWp: [
      "You want checklists, delegation, step-by-step flows and attendance together in one tool.",
      "You want to see what got done, not only who came in.",
      "You want setup done with you by a team that builds ERPs for factories.",
    ],
    pricingNote: "Zoho prices each product separately, per user per month. Check Zoho's site for current rates. WorkPilot is ₹399, ₹299 or ₹199 per user per month depending on plan, plus GST, with attendance and setup help included.",
  },
];

export const bySlug = (slug: string) => COMPETITORS.find((c) => c.slug === slug);
