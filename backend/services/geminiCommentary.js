let lastSpokenPublic = '';
let lastSpokenSpectator = '';

function cleanCode(code) {
  if (!code) return '';
  return code.replace(/\/\/.*$/gm, '').replace(/#.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
}

function getPlayerTag(player) {
  if (!player) return 'Player';
  const label = player.slot === 'player1' ? 'Player 1' : player.isBot ? '🤖 Cyber-Bot' : 'Player 2';
  const shortAddr = player.walletAddress ? ` (${player.walletAddress.substring(0, 6)})` : '';
  return `${label}${shortAddr}`;
}

export function analyzeStrategicFlaws(code, starterCode = '', lang = 'c') {
  const currentClean = cleanCode(code);
  const starterClean = cleanCode(starterCode);
  if (!code || currentClean === starterClean) return null;

  if (/(?:for|while)\s*\(.*?[a-zA-Z0-9_]+\s*<=\s*(?:[a-zA-Z0-9_]+\.(?:length|size\(\))|strlen\()/i.test(currentClean)) {
    return 'off_by_one_error';
  }
  if (/while\s*\(\s*(?:true|1)\s*\)/i.test(currentClean) && !/break;/i.test(currentClean)) {
    return 'infinite_loop';
  }
  return null;
}

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

// 🎙️ Multi-Persona Commentary Generator
export async function generatePublicCommentary({ player, action, problemTitle, eventType, persona = 'esports' }) {
  const pName = getPlayerTag(player);
  const lang = (player?.language || 'Code').toUpperCase();

  // 1. 🔥 GORDON RAMSAY MODE (Brutal Roaster)
  if (persona === 'gordon_ramsay') {
    const lines = {
      match_start: [`Wake up, ${pName}! The clock is ticking on "${problemTitle}" — let's see if you can write real code!`],
      nested_loops: [`WHAT ARE YOU DOING, ${pName}?! A nested loop in ${lang}?! It's so raw it's running in O(N⁴)!`],
      hashmap: [`Finally! ${pName} found some seasoning! A Hash Map for O(1) lookups!`],
      two_pointers: [`${pName} is setting up two pointers — don't overcook it!`],
      c_memory: [`${pName} called malloc()! If you leak memory, you're off the line!`],
      code_deleted: [`Good! Throw that code in the bin, ${pName}! Start from scratch!`],
      return_statement: [`${pName} is serving the final dish — let's hope it's not a disaster!`],
      code_submitted: [`Hands off the keyboard! ${pName} has locked in their submission!`],
      active_progress: [`Hurry up, ${pName}! Move your fingers!`],
      idle: [`${pName} is staring at the screen like an idiot sandwich! Start typing!`],
    };
    const pool = lines[action] || lines[eventType] || lines.active_progress;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // 2. ⚡ SHONEN ANIME ANNOUNCER (Over-the-Top Power Levels)
  if (persona === 'anime') {
    const lines = {
      match_start: [`IKUZO! The tournament battle for "${problemTitle}" begins! Release your algorithmic chakra!`],
      nested_loops: [`N-NANI?! ${pName} unleashed the Forbidden Double Loop Technique in ${lang}! Incredible power level!`],
      hashmap: [`SUGOI! ${pName} summoned the Legendary O(1) Hash Map Spirit!`],
      two_pointers: [`Look at that speed! ${pName} is using the Twin-Blade Two Pointer Stance!`],
      c_memory: [`${pName} is tapping into the ancient power of Raw Memory Manipulation!`],
      code_deleted: [`${pName} discarded their previous form — a true awakening is underway!`],
      return_statement: [`FINAL BLOW! ${pName} is preparing the ultimate Return Statement!`],
      code_submitted: [`SUBMISSION LOCKED! ${pName} stands victorious and awaits the Grandmaster verdict!`],
      active_progress: [`Their typing power level is over 9000!`],
      idle: [`${pName} is gathering spiritual algorithmic energy before striking!`],
    };
    const pool = lines[action] || lines[eventType] || lines.active_progress;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // 3. 🪖 DRILL SERGEANT (Military Boot Camp)
  if (persona === 'drill_sergeant') {
    const lines = {
      match_start: [`LISTEN UP! The operation on "${problemTitle}" is GO! Move, move, move!`],
      nested_loops: [`Drop and give me O(1) space complexity, ${pName}! Nested loops are not allowed on my watch!`],
      hashmap: [`Good tactical deployment of a Hash Map, soldier! Carry on!`],
      two_pointers: [`Two pointers deployed from both flanks! Excellent tactical execution, ${pName}!`],
      c_memory: [`Heap memory allocated! Zero memory leaks tolerated in this platoon!`],
      code_deleted: [`Scrapping the plan and re-engaging the target! Stay sharp!`],
      return_statement: [`Securing the objective with a return statement!`],
      code_submitted: [`Weapon safe! ${pName} has submitted! Prepare for inspection!`],
      active_progress: [`Maintain standard typing velocity, recruit!`],
      idle: [`What are you waiting for, soldier?! Put your boots on the keyboard!`],
    };
    const pool = lines[action] || lines[eventType] || lines.active_progress;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // 4. 🎙️ PRO ESPORTS CASTER (Default)
  const lines = {
    match_start: [`🔥 The battle for "${problemTitle}" is LIVE! Both fighters are locked in!`],
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
    code_submitted: [`🎯 ${pName} submitted their solution! Referee evaluation in progress!`],
  };
  const pool = lines[action] || lines[eventType] || lines.active_progress;
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function generateSpectatorStrategicCommentary({ player, flaw, problemTitle }) {
  const pName = getPlayerTag(player);
  const tacticalLines = {
    off_by_one_error: [
      `👀 Spectators, look closely at ${pName}'s loop condition — using <= on array length is an off-by-one trap!`,
    ],
    infinite_loop: [
      `⏱️ Danger zone! ${pName}'s while loop has no break or increment logic — potential infinite loop freeze!`,
    ],
  };
  if (!flaw || !tacticalLines[flaw]) return null;
  const pool = tacticalLines[flaw];
  return pool[Math.floor(Math.random() * pool.length)];
}