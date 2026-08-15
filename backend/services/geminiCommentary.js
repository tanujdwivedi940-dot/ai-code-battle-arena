let lastSpokenPublic = '';
let lastSpokenSpectator = '';

function cleanCode(code) {
  if (!code) return '';
  return code.replace(/\/\/.*$/gm, '').replace(/#.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
}

function getPlayerTag(player) {
  if (!player) return 'Player';
  const label = player.slot === 'player1' ? 'Player 1' : 'Player 2';
  const shortAddr = player.walletAddress ? ` (${player.walletAddress.substring(0, 6)})` : '';
  return `${label}${shortAddr}`;
}

// 🔍 Deep Code Flaw & Strategy Analyzer (Spectator-Only Channel)
export function analyzeStrategicFlaws(code, starterCode = '', lang = 'c') {
  const currentClean = cleanCode(code);
  const starterClean = cleanCode(starterCode);

  if (!code || currentClean === starterClean) return null;

  // 1. Off-By-One Indexing Bug (e.g. i <= length / strlen / size)
  if (/(?:for|while)\s*\(.*?[a-zA-Z0-9_]+\s*<=\s*(?:[a-zA-Z0-9_]+\.(?:length|size\(\))|strlen\()/i.test(currentClean)) {
    return 'off_by_one_error';
  }

  // 2. Infinite Loop Danger (while(true) or loop without counter increment)
  if (/while\s*\(\s*(?:true|1)\s*\)/i.test(currentClean) && !/break;/i.test(currentClean)) {
    return 'infinite_loop';
  }

  // 3. Recursion Missing Base Case (recursive call without an if return before it)
  const fnMatch = currentClean.match(/(?:function|def|int|void)\s+([a-zA-Z0-9_$]+)\s*\(/i);
  if (fnMatch && fnMatch[1]) {
    const fn = fnMatch[1];
    const regex = new RegExp(`\\b${fn}\\s*\\(`, 'g');
    const matches = currentClean.match(regex);
    if (matches && matches.length >= 2 && !/if\s*\([^)]*\)\s*return/i.test(currentClean)) {
      return 'missing_base_case';
    }
  }

  // 4. Hidden O(N^2) (Calling indexOf / includes / find inside a loop)
  if (/(?:for|while)[\s\S]*?\.(?:indexOf|includes|find)\s*\(/i.test(currentClean)) {
    return 'hidden_quadratic';
  }

  // 5. C Unallocated Memory / Missing Free
  if (lang === 'c' && /malloc\s*\(/.test(currentClean) && !/free\s*\(/.test(currentClean) && currentClean.length > 200) {
    return 'c_memory_leak';
  }

  return null;
}

// Basic Action Detector for Public Player Channel
export function detectCodeAction(currentCode, previousCode = '', starterCode = '', lang = 'c') {
  const currentClean = cleanCode(currentCode);
  const prevClean = cleanCode(previousCode);
  const starterClean = cleanCode(starterCode);

  if (currentClean.length < prevClean.length - 20) return 'code_deleted';
  const diff = currentClean.replace(prevClean, '');

  if (/malloc\s*\(|calloc\s*\(/.test(diff)) return 'c_memory';
  if (/(?:for|while)[\s\S]*?(?:for|while)/i.test(currentClean)) return 'nested_loops';
  if (/new\s+(Map|Set|HashMap)|unordered_map|\bdict\(\)/i.test(diff)) return 'hashmap';
  if (/\b(left|right|start|end|ptr1|ptr2|low|high)\b/i.test(diff)) return 'two_pointers';
  if (/\.(sort|sorted)\s*\(|qsort\s*\(/i.test(diff)) return 'sorting';
  if (/\b(for|while)\b/i.test(diff)) return 'single_loop';
  if (/\breturn\b/i.test(diff)) return 'return_statement';

  if (currentClean !== starterClean && currentClean.length > starterClean.length + 10) {
    return 'active_progress';
  }

  return 'idle';
}

// 🎙️ Public Stadium Commentary (Heard by PLAYERS & SPECTATORS)
export async function generatePublicCommentary({ player, action, problemTitle, eventType }) {
  const pName = getPlayerTag(player);
  const lang = (player?.language || 'Code').toUpperCase();

  if (eventType === 'match_start') return `🔥 The battle for "${problemTitle}" is LIVE! Both warriors are locked in!`;
  if (eventType === 'code_submitted') return `🎯 ${pName} submitted their solution! Referee evaluation in progress!`;

  const lines = {
    nested_loops: [`⚠️ ${pName} deployed a nested loop in ${lang} — entering O(N squared) territory!`],
    hashmap: [`🎯 ${pName} created a Hash Map in ${lang} — targeting instant O(1) lookups!`],
    two_pointers: [`📐 ${pName} is running Two Pointers — sliding window technique on screen!`],
    c_memory: [`💾 ${pName} allocated dynamic memory with malloc() in C!`],
    sorting: [`📊 ${pName} just sorted the dataset — shifting into O(N log N) space!`],
    single_loop: [`🚀 ${pName} is running a clean linear scan — chasing optimal O(N) runtime!`],
    return_statement: [`🏁 ${pName} is drafting the return statement — wrapping up logic!`],
    code_deleted: [`🔄 ${pName} just deleted lines of code — pivoting strategy on the fly!`],
    active_progress: [`⚡ ${pName} is typing rapidly — algorithms taking shape in the arena!`],
    idle: [`⏳ ${pName} is reviewing the problem statement constraints.`],
  };

  const pool = lines[action] || lines.active_progress;
  return pool[Math.floor(Math.random() * pool.length)];
}

// 🎙️ Confidential Grandmaster Booth (Heard ONLY by SPECTATORS)
export async function generateSpectatorStrategicCommentary({ player, flaw, problemTitle }) {
  const pName = getPlayerTag(player);

  const tacticalLines = {
    off_by_one_error: [
      `👀 Spectators, look closely at ${pName}'s loop condition — using <= on array length is an off-by-one trap that will throw an index out of bounds error!`,
      `⚠️ Tactical blunder alert for the booth: ${pName} wrote an off-by-one boundary condition. That could cost them the entire match!`,
    ],
    missing_base_case: [
      `🚨 Critical strategy leak: ${pName} just initiated a recursive call without an exit base case! That's an instant stack overflow waiting to happen!`,
      `🧠 The booth notices ${pName}'s recursion has no return guard — the call stack is going to blow up on test execution!`,
    ],
    infinite_loop: [
      `⏱️ Danger zone! ${pName}'s while loop has no break or increment logic — we're looking at a potential infinite loop freeze!`,
    ],
    hidden_quadratic: [
      `📉 Sneaky inefficiency! ${pName} is calling a search method inside their for-loop — secretly degrading runtime from O(N) to O(N squared)!`,
    ],
    c_memory_leak: [
      `💾 Low-level flaw: ${pName} allocated memory on the heap in C but hasn't planned the free() cleanup — the AI judge will penalize that memory score!`,
    ],
  };

  if (!flaw || !tacticalLines[flaw]) return null;
  const pool = tacticalLines[flaw];
  return pool[Math.floor(Math.random() * pool.length)];
}