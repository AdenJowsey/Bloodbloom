/**
 * keywords.js
 * -----------
 * Single source of truth for all keyword tooltips.
 *
 * USAGE IN HTML:
 *   <span class="kw" data-term="Command Test">Command Test</span>
 *
 * The visible text and the data-term can differ — useful for plurals,
 * mid-sentence capitalisation, or shorthand:
 *   <span class="kw" data-term="Order Points">OP</span>
 *
 * On DOMContentLoaded, every .kw[data-term] is resolved against KEYWORDS
 * and a tooltip span is injected inside it. If no matching term is found,
 * a console warning is emitted so broken references are caught early.
 */

const KEYWORDS = {
  Agenda: {
    body: "A secret objective that can be scored for Victory Points.",
    link: "#agendas",
  },
  "Battlefield Objective": {
    body: "A public objective that can be scored for Victory Points; may have requirements.",
    link: "#battlefield-objectives",
  },
  Action: {
    body: "A task assigned to an activated squad; all models in the squad perform the same action.",
    link: "#activations",
  },
  "Activation Token": {
    body: "Marker showing a squad has acted this phase; prevents further activation until removed.",
  },
  Aim: {
    body: "Threshold used to hit with ranged attacks; lower is better (e.g. 3+).",
  },
  "Armour Rating": {
    body: "Defensive value compared against a weapon’s Pierce Rating to determine if hits penetrate.",
  },
  "Close-Combat Range": {
    body: "Within 1″ horizontally and ≤5″ vertical difference between bases.",
    link: "#close-combat-range",
  },
  Cohesion: {
    body: "All models must form a continuous chain within 1″ of another model; no isolated groups.",
    link: "#cohesion",
  },
  "Command Test": {
    body: "Roll 3d6 ≥ Leadership to pass; modified by effects.",
    link: "#command-test",
  },
  Commander: {
    body: "Leader of the army; A hero squad nominated during army assembly",
  },
  Cover: {
    body: "≥50% of a squad has ≥25% obscuration → attackers suffer −1 to hit (ranged).",
    link: "#cover",
  },
  "Deployment Zone": {
    body: "Area extending 6″ from a player’s chosen edge of the battlefield.",
    link: "#setting-up",
  },
  Endurance: {
    body: "Maximum Wound Markers a model can take before being destroyed.",
  },
  "Hit Marker": {
    body: "Represents a successful attack; stores Stopping Power for later wound resolution.",
    link: "#rolling-against-armour",
  },
  "Initiative Token": {
    body: "Determines which player activates first and resolves alternating effects.",
  },
  Leadership: { body: "Value used for Command Tests and morale checks." },
  "Line of Sight": {
    body: "At least 25% of a model (or base) must be visible to target it.",
    link: "#line-of-sight",
  },
  "Locked-in-Combat": {
    body: "A squad with any model in Close-Combat Range of an opposing squad.",
    link: "#locked-in-combat",
  },
  Movement: {
    body: "Distance a model may travel, measured in straight-line segments.",
    link: "#movement",
  },
  "Opportunity Attack": {
    body: "Reactive attack made with −2 to hit, resolved at the most favourable moment.",
    link: "#opportunity-attacks",
  },
  Obstacle: {
    body: "Terrain <2″ tall; can be crossed at −2″ Movement cost.",
    link: "#obstacles",
  },
  link: "#obstacles",
  "Order Points": {
    body: "Resource spent to issue Orders; gained each round, max 5.",
    link: "#order-points",
  },
  "Pierce Rating": {
    body: "Determines weapon's ability to bypass targets Armour Rating.",
  },
  Prowess: { body: "Threshold used to hit with melee attacks." },
  Routing: {
    body: "Failing morale; squad must use Rout action and cannot perform others.",
    link: "#morale-step",
  },
  "Stopping Power": {
    body: "Determines how likely a hit converts into wounds.",
  },
  Toughness: { body: "Resistance against damage; compared to Stopping Power." },
  Tag: {
    body: "Classification (e.g. Infantry); only relevant when referenced by rules.",
    link: "#tags",
  },
  Trait: {
    body: "Special rule or ability attached to a model, squad, or weapon.",
  },
  "Victory Points": {
    body: "Score used to win; gained from Objectives.",
    link: "#objectives",
  },
  "Wound Marker": {
    body: "Tracks damage; applies penalties and destroys models at Endurance limit.",
    link: "#combat-sequence-resolution-step",
  },
  Reinforcements: {
    body: "Off-board squads that can be deployed during the Reinforcing Step.",
    link: "#reinforcements",
  },
  Attribute: { body: "A model’s base, unmodified stat.", link: "#models" },
  Value: {
    body: "A model’s stat after modifiers are applied.",
    link: "#models",
  },
  Hero: {
    body: "A single-model squad that can join and lead other squads.",
    link: "#heroes",
  },
  Order: {
    body: "A special player ability activated by spending Order Points.",
    link: "#orders",
  },
  "Prepare Action": {
    body: "An action that sets up a delayed effect, often interruptible.",
    link: "#prepare-action",
  },
  Reaction: {
    body: "An action triggered by an event, usable during an opponent’s turn.",
    link: "#reaction",
  },
  "Resolution Step": {
    body: "Phase step where unresolved effects like Hit Markers are applied.",
  },
  "Ranged Attack": {
    body: "Attack using Aim against a visible target within weapon range.",
    link: "#ranged-combat",
  },
  "Melee Attack": {
    body: "Attack using Prowess against targets in Close-Combat Range.",
    link: "#melee-combat",
  },
  Rout: {
    body: "Forced movement action taken by Routing squads toward their deployment edge.",
    link: "#morale-step",
  },
  Terrain: {
    body: "Physical features on the battlefield that can affect movement and combat.",
    link: "#terrain",
  },
  Supply: {
    body: "Resource used to deploy and maintain squads; limits the number of squads a player can field.",
    link: "#squads",
  },
  "Supply Limit": {
    body: "Maximum amount of Supply a player can use in their army.",
  },
  Requisitions: {
    body: "Destroyed squads can be added to your reinforcements, up to a limit.",
    link: "#requisitions",
  },
  Size: {
    body: "A models effective bulk, used for transport capacity.",
  },
};

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("span.kw[data-term]").forEach((el) => {
    const term = el.dataset.term;
    const kw = KEYWORDS[term];

    if (!kw) {
      console.warn(`[keywords.js] No definition found for data-term="${term}"`);
      return;
    }

    if (kw.link) {
      const a = document.createElement("a");
      a.href = kw.link;
      el.parentNode.insertBefore(a, el);
      a.appendChild(el);

      el.classList.add("clickable");
    }

    const tooltip = document.createElement("span");
    tooltip.className = "tooltip";
    tooltip.innerHTML = `<strong>${term}</strong><br>${kw.body}`;
    el.appendChild(tooltip);
  });
});
