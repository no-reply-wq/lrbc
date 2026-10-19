/**
 * Real WorkPilot screenshots (refined). Put the file in public/images/workpilot/ and set its path here.
 * While a slot is empty, the page shows a clearly illustrative placeholder screen instead.
 */
export const WP_SHOTS = {
  hero: "",        // owner's home screen on a phone (portrait)
  checklist: "",   // a staff member's checklist
  delegation: "",  // assigning a task
  fms: "",         // an order moving step by step
  owner: "",       // owner dashboard / scores
  reports: "",     // reports screen
} as const;

export type WpShot = keyof typeof WP_SHOTS;
