import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper to extract function name and argument names from any starter code
function parseStarterSignature(starterCode = '') {
  // JS/TS: function name(a, b)
  const jsMatch = starterCode.match(/function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/);
  if (jsMatch) {
    return { name: jsMatch[1], params: jsMatch[2].split(',').map(s => s.trim()).filter(Boolean) };
  }

  // Python: def name(a, b):
  const pyMatch = starterCode.match(/def\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/);
  if (pyMatch) {
    return { name: pyMatch[1], params: pyMatch[2].split(',').map(s => s.trim()).filter(Boolean) };
  }

  // C / Java: type name(type a, type b)
  const cMatch = starterCode.match(/(?:int\*?|void|bool|char\*?|public\s+[a-zA-Z0-9_$]+)\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/);
  if (cMatch) {
    return { name: cMatch[1], params: cMatch[2].split(',').map(s => s.trim()).filter(Boolean) };
  }

  return { name: 'solution', params: ['input', 'target'] };
}

// 🧠 Comprehensive Semantic Algorithm Engine for All 15 Domains
export function generateSemanticSolution(problem, difficulty = 'intermediate', language = 'javascript') {
  const title = (problem.title || '').toLowerCase();
  const cat = (problem.category || '').toLowerCase();
  const sub = (problem.subtopic || '').toLowerCase();
  const desc = (problem.description || '').toLowerCase();
  const { name, params } = parseStarterSignature(problem.starterCode);
  const p1 = params[0] || 'nums';
  const p2 = params[1] || 'target';

  // 1. LINKED LISTS (Reverse, Detect Cycle, Merge Lists, Remove Nth)
  if (title.includes('list') || sub.includes('linked') || desc.includes('linked list') || desc.includes('node.val')) {
    if (difficulty === 'noob') {
      return `// Noob Bot: O(N) Array Extraction and Reconstruction\nfunction ${name}(head) {\n  if (!head) return null;\n  const values = [];\n  let curr = head;\n  while (curr) {\n    values.push(curr.val);\n    curr = curr.next;\n  }\n  curr = head;\n  while (curr) {\n    curr.val = values.pop();\n    curr = curr.next;\n  }\n  return head;\n}`;
    }
    if (difficulty === 'intermediate') {
      return `// Cyber-Gemini: O(N) Recursive List Traversal\nfunction ${name}(head) {\n  if (!head || !head.next) return head;\n  const rest = ${name}(head.next);\n  head.next.next = head;\n  head.next = null;\n  return rest;\n}`;
    }
    return `// ⚡ Grandmaster AI: Optimal In-Place Pointer Manipulation (O(1) Space)\nfunction ${name}(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const nextNode = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextNode;\n  }\n  return prev;\n}`;
  }

  // 2. BINARY SEARCH & SEARCHING
  if (title.includes('search') || sub.includes('searching') || title.includes('binary') || desc.includes('sorted array')) {
    if (difficulty === 'noob') {
      return `// Noob Bot: O(N) Linear Search Loop\nfunction ${name}(${p1}, ${p2}) {\n  for (let i = 0; i < ${p1}.length; i++) {\n    if (${p1}[i] === ${p2}) return i;\n  }\n  return -1;\n}`;
    }
    if (difficulty === 'intermediate') {
      return `// Cyber-Gemini: O(log N) Recursive Binary Search\nfunction ${name}(${p1}, ${p2}) {\n  function bSearch(left, right) {\n    if (left > right) return -1;\n    const mid = Math.floor((left + right) / 2);\n    if (${p1}[mid] === ${p2}) return mid;\n    if (${p1}[mid] > ${p2}) return bSearch(left, mid - 1);\n    return bSearch(mid + 1, right);\n  }\n  return bSearch(0, ${p1}.length - 1);\n}`;
    }
    return `// ⚡ Grandmaster AI: Optimal O(log N) Iterative Binary Search (O(1) Space)\nfunction ${name}(${p1}, ${p2}) {\n  let left = 0, right = ${p1}.length - 1;\n  while (left <= right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (${p1}[mid] === ${p2}) return mid;\n    if (${p1}[mid] < ${p2}) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`;
  }

  // 3. TWO SUM & TARGET PAIRS
  if (title.includes('two sum') || title.includes('pair') || (desc.includes('target') && desc.includes('indices'))) {
    if (difficulty === 'noob') {
      return `// Noob Bot: O(N^2) Brute Force Nested Loop\nfunction ${name}(${p1}, ${p2}) {\n  for (let i = 0; i < ${p1}.length; i++) {\n    for (let j = i + 1; j < ${p1}.length; j++) {\n      if (${p1}[i] + ${p1}[j] === ${p2}) return [i, j];\n    }\n  }\n  return [];\n}`;
    }
    if (difficulty === 'intermediate') {
      return `// Cyber-Gemini: O(N) Two-Pass Hash Map\nfunction ${name}(${p1}, ${p2}) {\n  const lookup = {};\n  for (let i = 0; i < ${p1}.length; i++) lookup[${p1}[i]] = i;\n  for (let i = 0; i < ${p1}.length; i++) {\n    const diff = ${p2} - ${p1}[i];\n    if (lookup[diff] !== undefined && lookup[diff] !== i) return [i, lookup[diff]];\n  }\n  return [];\n}`;
    }
    return `// ⚡ Grandmaster AI: Optimal O(N) Single-Pass Hash Map with O(1) Lookups\nfunction ${name}(${p1}, ${p2}) {\n  const seen = new Map();\n  for (let i = 0; i < ${p1}.length; i++) {\n    const complement = ${p2} - ${p1}[i];\n    if (seen.has(complement)) return [seen.get(complement), i];\n    seen.set(${p1}[i], i);\n  }\n  return [];\n}`;
  }

  // 4. VALID PARENTHESES & STACKS
  if (title.includes('parentheses') || sub.includes('stack') || desc.includes('brackets')) {
    if (difficulty === 'noob') {
      return `// Noob Bot: O(N^2) String Replacement Loop\nfunction ${name}(s) {\n  let prev = '';\n  while (s.length !== prev.length) {\n    prev = s;\n    s = s.replace('()', '').replace('[]', '').replace('{}', '');\n  }\n  return s.length === 0;\n}`;
    }
    if (difficulty === 'intermediate') {
      return `// Cyber-Gemini: O(N) Array Stack with Branching\nfunction ${name}(s) {\n  const stack = [];\n  for (let i = 0; i < s.length; i++) {\n    const c = s[i];\n    if (c === '(' || c === '[' || c === '{') stack.push(c);\n    else {\n      const top = stack.pop();\n      if (c === ')' && top !== '(') return false;\n      if (c === ']' && top !== '[') return false;\n      if (c === '}' && top !== '{') return false;\n    }\n  }\n  return stack.length === 0;\n}`;
    }
    return `// ⚡ Grandmaster AI: Optimal O(N) Lookup Stack with Parity Guard\nfunction ${name}(s) {\n  if (s.length % 2 !== 0) return false;\n  const map = { ')': '(', ']': '[', '}': '{' };\n  const stack = [];\n  for (let i = 0; i < s.length; i++) {\n    const ch = s[i];\n    if (map[ch]) {\n      if (stack.pop() !== map[ch]) return false;\n    } else {\n      stack.push(ch);\n    }\n  }\n  return stack.length === 0;\n}`;
  }

  // 5. MAXIMUM SUBARRAY & DYNAMIC PROGRAMMING
  if (title.includes('subarray') || sub.includes('dynamic') || desc.includes('largest sum')) {
    if (difficulty === 'noob') {
      return `// Noob Bot: O(N^2) Brute Force Double Loop\nfunction ${name}(${p1}) {\n  let max = -Infinity;\n  for (let i = 0; i < ${p1}.length; i++) {\n    let sum = 0;\n    for (let j = i; j < ${p1}.length; j++) {\n      sum += ${p1}[j];\n      if (sum > max) max = sum;\n    }\n  }\n  return max;\n}`;
    }
    if (difficulty === 'intermediate') {
      return `// Cyber-Gemini: O(N) Dynamic Programming Table (O(N) Space)\nfunction ${name}(${p1}) {\n  const dp = new Array(${p1}.length);\n  dp[0] = ${p1}[0];\n  let max = dp[0];\n  for (let i = 1; i < ${p1}.length; i++) {\n    dp[i] = Math.max(${p1}[i], dp[i - 1] + ${p1}[i]);\n    max = Math.max(max, dp[i]);\n  }\n  return max;\n}`;
    }
    return `// ⚡ Grandmaster AI: Optimal O(N) Kadane's Algorithm (O(1) In-Place Space)\nfunction ${name}(${p1}) {\n  let currentMax = ${p1}[0], globalMax = ${p1}[0];\n  for (let i = 1; i < ${p1}.length; i++) {\n    currentMax = Math.max(${p1}[i], currentMax + ${p1}[i]);\n    if (currentMax > globalMax) globalMax = currentMax;\n  }\n  return globalMax;\n}`;
  }

  // 6. TWO POINTERS & WATER CONTAINER / SLIDING WINDOW
  if (title.includes('water') || sub.includes('two pointers') || sub.includes('sliding window')) {
    if (difficulty === 'noob') {
      return `// Noob Bot: O(N^2) Pairwise Calculation\nfunction ${name}(height) {\n  let max = 0;\n  for (let i = 0; i < height.length; i++) {\n    for (let j = i + 1; j < height.length; j++) {\n      const area = Math.min(height[i], height[j]) * (j - i);\n      if (area > max) max = area;\n    }\n  }\n  return max;\n}`;
    }
    if (difficulty === 'intermediate') {
      return `// Cyber-Gemini: Inward Two-Pointer Traversal\nfunction ${name}(height) {\n  let left = 0, right = height.length - 1, maxArea = 0;\n  while (left < right) {\n    const w = right - left;\n    const h = Math.min(height[left], height[right]);\n    maxArea = Math.max(maxArea, w * h);\n    if (height[left] < height[right]) left++;\n    else right--;\n  }\n  return maxArea;\n}`;
    }
    return `// ⚡ Grandmaster AI: Optimal O(N) Two-Pointer Sweep with Skip Optimizations\nfunction ${name}(height) {\n  let left = 0, right = height.length - 1, max = 0;\n  while (left < right) {\n    const minH = height[left] < height[right] ? height[left] : height[right];\n    const currentArea = minH * (right - left);\n    if (currentArea > max) max = currentArea;\n    while (left < right && height[left] <= minH) left++;\n    while (left < right && height[right] <= minH) right--;\n  }\n  return max;\n}`;
  }

  // 7. STRINGS & ANAGRAMS
  if (title.includes('anagram') || sub.includes('string') || cat.includes('strings')) {
    if (difficulty === 'noob') {
      return `// Noob Bot: O(N log N) Sorting and String Compare\nfunction ${name}(s, t) {\n  if (s.length !== t.length) return false;\n  return s.split('').sort().join('') === t.split('').sort().join('');\n}`;
    }
    if (difficulty === 'intermediate') {
      return `// Cyber-Gemini: Hash Map Character Counter\nfunction ${name}(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (const c of s) count[c] = (count[c] || 0) + 1;\n  for (const c of t) {\n    if (!count[c]) return false;\n    count[c]--;\n  }\n  return true;\n}`;
    }
    return `// ⚡ Grandmaster AI: Optimal Fixed 26-Element Byte Array Counter (O(1) Memory)\nfunction ${name}(s, t) {\n  if (s.length !== t.length) return false;\n  const freq = new Int32Array(26);\n  for (let i = 0; i < s.length; i++) {\n    freq[s.charCodeAt(i) - 97]++;\n    freq[t.charCodeAt(i) - 97]--;\n  }\n  for (let i = 0; i < 26; i++) {\n    if (freq[i] !== 0) return false;\n  }\n  return true;\n}`;
  }

  // 8. MATHEMATICS & PALINDROMES
  if (title.includes('palindrome') || cat.includes('mathematics') || sub.includes('number')) {
    if (difficulty === 'noob') {
      return `// Noob Bot: String Conversion Check\nfunction ${name}(x) {\n  if (x < 0) return false;\n  return String(x) === String(x).split('').reverse().join('');\n}`;
    }
    if (difficulty === 'intermediate') {
      return `// Cyber-Gemini: Full Integer Reversal Math\nfunction ${name}(x) {\n  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;\n  let rev = 0, temp = x;\n  while (temp > 0) {\n    rev = rev * 10 + (temp % 10);\n    temp = Math.floor(temp / 10);\n  }\n  return rev === x;\n}`;
    }
    return `// ⚡ Grandmaster AI: Half-Number Math Reversal (Early Overflow Safe)\nfunction ${name}(x) {\n  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;\n  let revHalf = 0;\n  while (x > revHalf) {\n    revHalf = revHalf * 10 + (x % 10);\n    x = Math.floor(x / 10);\n  }\n  return x === revHalf || x === Math.floor(revHalf / 10);\n}`;
  }

  // 9. PYTHON SPECIFIC
  if (language === 'python' || cat.includes('python')) {
    if (difficulty === 'noob') {
      return `# Noob Bot: Standard Iterative Loop\ndef ${name}(${p1}):\n    result = []\n    for item in ${p1}:\n        result.append(item)\n    return result`;
    }
    if (difficulty === 'intermediate') {
      return `# Cyber-Gemini: Standard Generator / Slicing\ndef ${name}(${p1}):\n    return [x for x in ${p1} if x is not None]`;
    }
    return `# ⚡ Grandmaster AI: Optimal Pythonic One-Liner Comprehension\ndef ${name}(${p1}):\n    return [${p1}[r][c] for c in range(len(${p1}[0])) for r in range(len(${p1}))] if isinstance(${p1}, list) and ${p1} else ${p1}`;
  }

  // 10. C LANGUAGE SPECIFIC
  if (language === 'c' || cat.includes('c')) {
    if (difficulty === 'noob') {
      return `// Noob Bot: Standard Index Traversal in C\nint ${name}(int* ${p1}, int ${p1}Size) {\n    int sum = 0;\n    for (int i = 0; i < ${p1}Size; i++) {\n        sum += ${p1}[i];\n    }\n    return sum;\n}`;
    }
    if (difficulty === 'intermediate') {
      return `// Cyber-Gemini: Pointer Traversal with Bounds in C\nint ${name}(int* ${p1}, int ${p1}Size, int target) {\n    int* ptr = ${p1};\n    for (int i = 0; i < ${p1}Size; i++) {\n        if (*(ptr + i) == target) return i;\n    }\n    return -1;\n}`;
    }
    return `// ⚡ Grandmaster AI: Optimal Two-Pointer In-Place Memory Swap in C\nvoid ${name}(int* ${p1}, int ${p1}Size) {\n    int *left = ${p1}, *right = ${p1} + ${p1}Size - 1;\n    while (left < right) {\n        int tmp = *left;\n        *left = *right;\n        *right = tmp;\n        left++;\n        right--;\n    }\n}`;
  }

  // 11. SQL & DATABASES
  if (cat.includes('sql') || cat.includes('database')) {
    if (difficulty === 'noob') {
      return `-- Noob Bot: Basic Subquery\nSELECT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;`;
    }
    if (difficulty === 'intermediate') {
      return `-- Cyber-Gemini: DISTINCT Subquery\nSELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;`;
    }
    return `-- ⚡ Grandmaster AI: Optimal Window Function DENSE_RANK\nSELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rk FROM Employee) as t WHERE rk = 2 LIMIT 1;`;
  }

  // 12. REACT & HOOKS
  if (cat.includes('react')) {
    return `// React Custom Hook Implementation\nimport { useState, useEffect } from 'react';\n\nexport function ${name}(value, delay) {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n  return debounced;\n}`;
  }

  // Universal Adaptive Default
  if (difficulty === 'noob') {
    return `// Noob Bot: Iterative Solution\nfunction ${name}(${params.join(', ') || 'input'}) {\n  let result = ${p1};\n  return result;\n}`;
  }
  if (difficulty === 'intermediate') {
    return `// Cyber-Gemini: Optimized Solution\nfunction ${name}(${params.join(', ') || 'input'}) {\n  return ${p1};\n}`;
  }
  return `// ⚡ Grandmaster AI: Optimal Algorithm\nfunction ${name}(${params.join(', ') || 'input'}) {\n  return ${p1};\n}`;
}

// 🚀 FAST HYBRID CODE GENERATOR: Tries Gemini with 2s timeout race, falls back to semantic solver
export async function getUniversalBotCode(problem, difficulty = 'intermediate', language = 'javascript') {
  if (ai) {
    try {
      const prompt = `
You are an automated coding bot in a battle on the problem "${problem.title}".
Description: ${problem.description}
Starter Code Signature:
${problem.starterCode}
Target Language: ${language}
Bot Difficulty: ${difficulty.toUpperCase()}

INSTRUCTIONS:
- "NOOB": Write a WORKING, CORRECT solution using a simple brute-force / nested loop approach.
- "INTERMEDIATE": Write a WORKING, CORRECT solution using a standard / moderately optimized approach.
- "GRANDMASTER": Write the GOLD-STANDARD, 100% OPTIMAL solution matching the exact function signature.

Return ONLY raw runnable code matching the starter function name. No markdown fences, no explanations.
`;
      // 2-Second Race Timeout so the bot never stalls!
      const geminiCall = ai.interactions.create({
        model: 'gemini-3.6-flash',
        input: prompt,
      });

      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000));
      const response = await Promise.race([geminiCall, timeoutPromise]);

      let code = response.output_text?.trim() || '';
      code = code.replace(/^```[a-zA-Z]*\s*/i, '').replace(/\s*```$/i, '').trim();

      if (code && code.length > 20) {
        return code;
      }
    } catch {
      // Fallback to instant semantic solver
    }
  }

  return generateSemanticSolution(problem, difficulty, language);
}