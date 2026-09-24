export type Match = {
  id: string;
  league: string;
  flag: string;
  home: string;
  away: string;
  kickoff: string; // ISO
  odds: { "1": number; X: number; "2": number; O: number; U: number };
};

const LEAGUES: { name: string; flag: string; teams: string[] }[] = [
  {
    name: "Ethiopian Premier League",
    flag: "🇪🇹",
    teams: ["Saint George", "Fasil Kenema", "Ethiopia Bunna", "Mekelle 70 Enderta", "Hawassa City", "Bahir Dar Kenema", "Adama City", "Sidama Bunna", "Wolkite City", "Dire Dawa City", "Ethio Electric", "Hadiya Hossana"],
  },
  {
    name: "England · Premier League",
    flag: "🏴",
    teams: ["Arsenal", "Manchester City", "Liverpool", "Chelsea", "Manchester United", "Tottenham", "Newcastle", "Aston Villa", "Brighton", "West Ham"],
  },
  {
    name: "Spain · La Liga",
    flag: "🇪🇸",
    teams: ["Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla", "Real Sociedad", "Villarreal", "Real Betis", "Athletic Club"],
  },
  {
    name: "Italy · Serie A",
    flag: "🇮🇹",
    teams: ["Inter", "AC Milan", "Juventus", "Napoli", "Roma", "Lazio", "Atalanta", "Fiorentina"],
  },
  {
    name: "UEFA Champions League",
    flag: "🇪🇺",
    teams: ["Bayern Munich", "PSG", "Real Madrid", "Manchester City", "Barcelona", "Inter", "Arsenal", "Dortmund"],
  },
];

export function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

const DAY = 86400000;
const r2 = (n: number) => Math.round(n * 100) / 100;

function buildOdds(seed: string) {
  const strength = hash(seed + "s") * 1.6 - 0.8; // -0.8..0.8 home advantage
  let pH = 0.42 + strength * 0.3;
  let pA = 0.3 - strength * 0.25;
  pH = Math.min(0.78, Math.max(0.12, pH));
  pA = Math.min(0.7, Math.max(0.1, pA));
  const pD = Math.max(0.12, 1 - pH - pA);
  const sum = pH + pA + pD;
  const margin = 1.07;
  const pOver = 0.42 + hash(seed + "o") * 0.2;
  return {
    probs: { h: pH / sum, d: pD / sum, a: pA / sum, over: pOver },
    odds: {
      "1": r2(Math.max(1.05, 1 / ((pH / sum) * margin))),
      X: r2(Math.max(1.05, 1 / ((pD / sum) * margin))),
      "2": r2(Math.max(1.05, 1 / ((pA / sum) * margin))),
      O: r2(1 / (pOver * margin)),
      U: r2(1 / ((1 - pOver) * margin)),
    },
  };
}

/** Fixtures for yesterday..+3 days, deterministic per day. */
export function getFixtures(now = Date.now()): Match[] {
  const today = Math.floor(now / DAY);
  const out: Match[] = [];
  for (let d = today - 1; d <= today + 3; d++) {
    LEAGUES.forEach((lg, li) => {
      const teams = [...lg.teams].sort((a, b) => hash(`${d}${a}`) - hash(`${d}${b}`));
      const count = Math.min(4, Math.floor(teams.length / 2));
      for (let i = 0; i < count; i++) {
        const id = `${d}-${li}-${i}`;
        const hourSlot = 9 + ((li * 3 + i * 2 + (d % 3)) % 13); // 09:00..21:00 UTC
        const kickoff = new Date(d * DAY + hourSlot * 3600000 + (i % 2) * 1800000).toISOString();
        out.push({ id, league: lg.name, flag: lg.flag, home: teams[i * 2], away: teams[i * 2 + 1], kickoff, odds: buildOdds(id).odds });
      }
    });
  }
  return out.sort((a, b) => a.kickoff.localeCompare(b.kickoff));
}

export const MATCH_DURATION = 2 * 3600000;

/** Deterministic final result for a match id. */
export function matchResult(id: string) {
  const { probs } = buildOdds(id);
  const r = hash(id + "result");
  const outcome = r < probs.h ? "1" : r < probs.h + probs.d ? "X" : "2";
  const over = hash(id + "goals") < probs.over;
  let hg = 0, ag = 0;
  const base = over ? 3 + Math.floor(hash(id + "g2") * 3) : Math.floor(hash(id + "g2") * 3);
  if (outcome === "X") {
    const each = Math.floor(base / 2);
    hg = each; ag = each;
    if (over && hg + ag < 3) { hg = 2; ag = 2; }
    if (!over && hg + ag > 2) { hg = 1; ag = 1; }
  } else {
    const total = Math.max(1, base);
    const loser = Math.floor((total - 1) / 2);
    const winner = total - loser;
    if (outcome === "1") { hg = winner; ag = loser; } else { hg = loser; ag = winner; }
    if (hg === ag) { if (outcome === "1") hg++; else ag++; }
  }
  const goalsOver = hg + ag > 2.5;
  return { outcome, over: goalsOver, score: `${hg} - ${ag}` };
}

export function selectionWins(market: "1X2" | "OU", pick: string, matchId: string) {
  const res = matchResult(matchId);
  if (market === "1X2") return res.outcome === pick;
  return pick === "O" ? res.over : !res.over;
}
