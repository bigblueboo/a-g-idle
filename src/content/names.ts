/** Names for the staff list. Period-neutral; seeded pick, never repeated within a run. */
export const FIRST_NAMES = [
  "Ada", "Marvin", "Grace", "Seymour", "Joan", "Herbert", "Ruth", "Oliver", "Mira", "Tomás",
  "Hedy", "Claude", "Nadia", "Kenji", "Ingrid", "Amos", "Priya", "Lev", "Rosa", "Dmitri",
  "Yuki", "Bertram", "Simone", "Ravi", "Esther", "Hal", "Ines", "Walter", "Noor", "Felix",
  "Agnes", "Teodor", "Lina", "Otto", "Beatriz", "Gus", "Hana", "Lorne", "Zara", "Ezra",
] as const;

export const LAST_NAMES = [
  "Okafor", "Lindqvist", "Marsh", "Nakamura", "Oyelaran", "Petrova", "Halvorsen", "Bianchi", "Quon", "Adebayo",
  "Rask", "Ferreira", "Doyle", "Mehta", "Kowalski", "Haddad", "Sato", "Brennan", "Villanueva", "Ng",
  "Abara", "Steiner", "Moreau", "Iyer", "Castellanos", "Whitlock", "Szabo", "Achebe", "Duval", "Park",
] as const;

export const ROLES: Record<string, string> = {
  computer: "computer",
  grad: "graduate student",
  lab: "principal investigator",
  engineer: "knowledge engineer",
  featureeng: "feature engineer",
  resident: "research resident",
  evals: "evaluator",
};
