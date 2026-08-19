import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 300 Real-World, Authentic Problems across all 15 Domains (20 Distinct Problems Each)
const CURATED_CATALOG = {
  "Algorithms": [
    { title: "Binary Search", sub: "Searching", diff: "Easy", desc: "Search target in sorted array in O(log n) time.", in: "nums = [-1,0,3,5,9,12], target = 9", out: "4" },
    { title: "Two Sum Target Search", sub: "Two Pointers", diff: "Easy", desc: "Find two indices adding to target in O(N) single pass.", in: "nums = [2,7,11,15], target = 9", out: "[0,1]" },
    { title: "Maximum Subarray (Kadane's)", sub: "Dynamic Programming", diff: "Medium", desc: "Find contiguous subarray with maximum sum.", in: "nums = [-2,1,-3,4,-1,2,1,-5,4]", out: "6" },
    { title: "Coin Change Minimum", sub: "Dynamic Programming", diff: "Medium", desc: "Fewest coins needed to make up exact amount.", in: "coins = [1,2,5], amount = 11", out: "3" },
    { title: "Container With Most Water", sub: "Two Pointers", diff: "Medium", desc: "Find two lines trapping maximum water area.", in: "height = [1,8,6,2,5,4,8,3,7]", out: "49" },
    { title: "3Sum Zero Triplet", sub: "Two Pointers", diff: "Medium", desc: "Find all unique triplets [a,b,c] summing to zero.", in: "nums = [-1,0,1,2,-1,-4]", out: "[[-1,-1,2],[-1,0,1]]" },
    { title: "Longest Substring Without Repeating", sub: "Sliding Window", diff: "Medium", desc: "Find length of longest substring with unique chars.", in: "s = 'abcabcbb'", out: "3" },
    { title: "Minimum Window Substring", sub: "Sliding Window", diff: "Hard", desc: "Smallest window containing all pattern characters.", in: "s = 'ADOBECODEBANC', t = 'ABC'", out: "'BANC'" },
    { title: "Merge Overlapping Intervals", sub: "Intervals", diff: "Medium", desc: "Merge all overlapping range intervals.", in: "intervals = [[1,3],[2,6],[8,10]]", out: "[[1,6],[8,10]]" },
    { title: "0/1 Knapsack Problem", sub: "Dynamic Programming", diff: "Medium", desc: "Maximize knapsack value within weight limit.", in: "weights = [1,2,3], values = [10,15,40], W = 6", out: "65" },
    { title: "Longest Increasing Subsequence", sub: "Dynamic Programming", diff: "Medium", desc: "Find length of strictly increasing subsequence.", in: "nums = [10,9,2,5,3,7,101,18]", out: "4" },
    { title: "Edit Distance (Levenshtein)", sub: "Dynamic Programming", diff: "Hard", desc: "Minimum insert/delete/replace operations between strings.", in: "word1 = 'horse', word2 = 'ros'", out: "3" },
    { title: "Dijkstra Shortest Path", sub: "Graph Theory", diff: "Hard", desc: "Find shortest distance from source to all vertices.", in: "graph = [[0,4,0],[4,0,8],[0,8,0]], src = 0", out: "[0, 4, 12]" },
    { title: "Number of Islands (BFS/DFS)", sub: "Graph Theory", diff: "Medium", desc: "Count disconnected grid islands.", in: "grid = [['1','1','0'],['1','1','0'],['0','0','1']]", out: "2" },
    { title: "Topological Sort Dependency Graph", sub: "Graph Theory", diff: "Medium", desc: "Find valid execution order in directed graph.", in: "numCourses = 2, prereq = [[1,0]]", out: "[0,1]" },
    { title: "N-Queens Backtracking", sub: "Recursion", diff: "Hard", desc: "Place N non-attacking queens on NxN board.", in: "n = 4", out: "2 distinct solutions" },
    { title: "Word Search in 2D Grid", sub: "Recursion", diff: "Medium", desc: "Check if word exists in grid via adjacent letters.", in: "board = [['A','B'],['C','D']], word = 'ABDC'", out: "true" },
    { title: "Gas Station Circular Circuit", sub: "Greedy", diff: "Medium", desc: "Find starting index completing round trip.", in: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]", out: "3" },
    { title: "Jump Game II Minimum Jumps", sub: "Greedy", diff: "Medium", desc: "Minimum jumps to reach last index.", in: "nums = [2,3,1,1,4]", out: "2" },
    { title: "QuickSort In-Place Partition", sub: "Sorting", diff: "Medium", desc: "Partition array around pivot element.", in: "arr = [7,2,1,6,8,5,3,4]", out: "[2,1,3,4,8,5,7,6]" }
  ],

  "Data Structures": [
    { title: "Reverse Singly Linked List", sub: "Linked Lists", diff: "Easy", desc: "Reverse singly linked list in-place.", in: "head = [1,2,3,4,5]", out: "[5,4,3,2,1]" },
    { title: "Detect Cycle in Linked List", sub: "Linked Lists", diff: "Easy", desc: "Floyd's Tortoise and Hare cycle detection.", in: "head = [3,2,0,-4], pos = 1", out: "true" },
    { title: "Merge Two Sorted Lists", sub: "Linked Lists", diff: "Easy", desc: "Merge two sorted linked lists into one.", in: "list1 = [1,2,4], list2 = [1,3,4]", out: "[1,1,2,3,4,4]" },
    { title: "Remove Nth Node From End", sub: "Linked Lists", diff: "Medium", desc: "Remove nth node from end in single pass.", in: "head = [1,2,3,4,5], n = 2", out: "[1,2,3,5]" },
    { title: "Valid Parentheses", sub: "Stacks & Queues", diff: "Easy", desc: "Verify matching bracket order using LIFO stack.", in: "s = '()[]{}'", out: "true" },
    { title: "Min Stack with O(1) GetMin", sub: "Stacks & Queues", diff: "Medium", desc: "Retrieve minimum stack element in O(1) time.", in: "push(-2); push(0); push(-3); getMin();", out: "-3" },
    { title: "Implement Queue using Stacks", sub: "Stacks & Queues", diff: "Easy", desc: "Implement FIFO queue with two LIFO stacks.", in: "push(1); push(2); pop();", out: "1" },
    { title: "Daily Temperatures Monotonic Stack", sub: "Stacks & Queues", diff: "Medium", desc: "Days until warmer temperature occurs.", in: "T = [73,74,75,71,69,72,76,73]", out: "[1,1,4,2,1,1,0,0]" },
    { title: "Binary Tree Inorder Traversal", sub: "Trees & BST", diff: "Easy", desc: "Inorder traversal of binary tree without recursion.", in: "root = [1,null,2,3]", out: "[1,3,2]" },
    { title: "Maximum Depth of Binary Tree", sub: "Trees & BST", diff: "Easy", desc: "Longest root-to-leaf path length.", in: "root = [3,9,20,null,null,15,7]", out: "3" },
    { title: "Validate Binary Search Tree", sub: "Trees & BST", diff: "Medium", desc: "Verify BST properties for every subnode.", in: "root = [2,1,3]", out: "true" },
    { title: "Lowest Common Ancestor in BST", sub: "Trees & BST", diff: "Medium", desc: "Find lowest shared ancestor of two nodes.", in: "root = [6,2,8,0,4,7,9], p = 2, q = 8", out: "6" },
    { title: "Binary Tree Level Order Traversal", sub: "Trees & BST", diff: "Medium", desc: "BFS level-by-level node values array.", in: "root = [3,9,20,null,null,15,7]", out: "[[3],[9,20],[15,7]]" },
    { title: "Top K Frequent Elements", sub: "Hash Tables & Heaps", diff: "Medium", desc: "Find k most frequent numbers.", in: "nums = [1,1,1,2,2,3], k = 2", out: "[1,2]" },
    { title: "Kth Largest Element in Array", sub: "Hash Tables & Heaps", diff: "Medium", desc: "Find kth largest element using min-heap.", in: "nums = [3,2,1,5,6,4], k = 2", out: "5" },
    { title: "Find Median from Data Stream", sub: "Hash Tables & Heaps", diff: "Hard", desc: "Two heaps balancing real-time data stream median.", in: "addNum(1); addNum(2); findMedian();", out: "1.5" },
    { title: "Design Hash Map from Scratch", sub: "Hash Tables", diff: "Medium", desc: "Implement put, get, remove without built-in maps.", in: "put(1,1); put(2,2); get(1);", out: "1" },
    { title: "Longest Consecutive Sequence", sub: "Hash Tables", diff: "Medium", desc: "Find longest consecutive elements sequence in O(N).", in: "nums = [100,4,200,1,3,2]", out: "4" },
    { title: "Implement Trie (Prefix Tree)", sub: "Trie", diff: "Medium", desc: "Insert, search, and startsWith operations.", in: "insert('apple'); search('apple');", out: "true" },
    { title: "Disjoint Set Union (Connected Components)", sub: "Graphs", diff: "Medium", desc: "Union by rank with path compression.", in: "n = 5, edges = [[0,1],[1,2],[3,4]]", out: "2 components" }
  ],

  "C": [
    { title: "Raw Pointer Array Reversal", sub: "Pointers & Memory", diff: "Easy", desc: "Swap array elements in-place using pointer dereferencing.", in: "arr = [1,2,3,4,5], size = 5", out: "[5,4,3,2,1]" },
    { title: "Custom Strlen with Pointers", sub: "Pointers & Memory", diff: "Easy", desc: "Calculate string length subtracting two pointers.", in: "str = 'hello'", out: "5" },
    { title: "Swap Variables by Reference", sub: "Pointers & Memory", diff: "Easy", desc: "Implement swap(int* a, int* b).", in: "a = 5, b = 10", out: "a = 10, b = 5" },
    { title: "Dynamic 2D Matrix Allocator", sub: "Memory Allocation", diff: "Medium", desc: "Allocate row and column pointers using malloc.", in: "rows = 2, cols = 3", out: "2x3 int** matrix" },
    { title: "Dynamic Array Resizing (realloc)", sub: "Memory Allocation", diff: "Medium", desc: "Double buffer capacity when array is full.", in: "insert 10 items into cap 4", out: "capacity = 16" },
    { title: "Singly Linked List with Malloc", sub: "Structs & Memory", diff: "Medium", desc: "Create node structs with malloc and link pointers.", in: "insert(1); insert(2);", out: "1 -> 2 -> NULL" },
    { title: "Custom Strcpy Implementation", sub: "Strings & Pointers", diff: "Easy", desc: "Copy source string into destination buffer.", in: "src = 'battle'", out: "dest = 'battle'" },
    { title: "Custom Strcat Implementation", sub: "Strings & Pointers", diff: "Easy", desc: "Concatenate two strings using pointer traversal.", in: "s1 = 'code ', s2 = 'arena'", out: "'code arena'" },
    { title: "Bitwise Power of Two Check", sub: "Bit Manipulation", diff: "Easy", desc: "Check power of 2 using (n & (n - 1)) == 0.", in: "n = 16", out: "true" },
    { title: "Kernighan's Set Bit Count", sub: "Bit Manipulation", diff: "Easy", desc: "Count total set bits in an integer.", in: "n = 11 (1011 in binary)", out: "3" },
    { title: "Swap Even and Odd Bits", sub: "Bit Manipulation", diff: "Medium", desc: "Swap bits using masks 0xAAAA and 0x5555.", in: "n = 23 (00010111)", out: "43 (00101011)" },
    { title: "Student Record Struct Search", sub: "Structs", diff: "Easy", desc: "Search struct array for target student ID.", in: "students[3], targetId = 102", out: "'Alice'" },
    { title: "Generic Memory Swap with void*", sub: "Pointers & Memory", diff: "Medium", desc: "Swap arbitrary data types using memcpy.", in: "float a = 1.5, b = 3.5", out: "a = 3.5, b = 1.5" },
    { title: "Function Pointer Calculator Table", sub: "Pointers & Memory", diff: "Medium", desc: "Call math operations via function pointer array.", in: "op = ADD, a = 4, b = 5", out: "9" },
    { title: "Pointer Bubble Sort", sub: "Pointers & Memory", diff: "Easy", desc: "Sort array using pointer offsets.", in: "arr = [4,2,7,1]", out: "[1,2,4,7]" },
    { title: "Count Vowels in C String", sub: "Strings & Pointers", diff: "Easy", desc: "Traverse char array and count vowels.", in: "str = 'arena'", out: "3" },
    { title: "Matrix Multiplication in C", sub: "2D Arrays", diff: "Medium", desc: "Multiply two NxN matrices with 3 nested loops.", in: "A = [[1,2],[3,4]], B = [[1,0],[0,1]]", out: "[[1,2],[3,4]]" },
    { title: "Circular FIFO Buffer in C", sub: "Structs & Memory", diff: "Medium", desc: "Ring buffer with head and tail index wrap.", in: "enqueue(1); enqueue(2); dequeue();", out: "1" },
    { title: "Find Minimum in Rotated Array", sub: "Pointers & Memory", diff: "Medium", desc: "O(log n) binary search on rotated pointer array.", in: "arr = [4,5,6,1,2,3]", out: "1" },
    { title: "Check System Endianness in C", sub: "Pointers & Memory", diff: "Easy", desc: "Inspect first byte of int 1 to detect Little Endian.", in: "unsigned int i = 1", out: "Little Endian" }
  ],

  "Python": [
    { title: "Matrix Transposition & Flattening", sub: "Basic Data Types", diff: "Easy", desc: "Flatten 2D matrix in single list comprehension.", in: "matrix = [[1,2],[3,4]]", out: "[1,3,2,4]" },
    { title: "Nested Dictionary Flattener", sub: "Data Types", diff: "Medium", desc: "Flatten nested key-value dict recursively.", in: "{'a': {'b': 1, 'c': 2}}", out: "{'a.b': 1, 'a.c': 2}" },
    { title: "Infinite Fibonacci Generator", sub: "Generators", diff: "Medium", desc: "Yield Fibonacci sequence without list allocation.", in: "n = 5", out: "[0, 1, 1, 2, 3]" },
    { title: "Execution Timer Decorator", sub: "Decorators", diff: "Medium", desc: "Wrap function and print execution duration.", in: "run_query()", out: "Executed in 0.042s" },
    { title: "Args and Kwargs Logger", sub: "Functions", diff: "Easy", desc: "Accept arbitrary positional and keyword arguments.", in: "log(1, 2, user='admin')", out: "args=(1,2), kwargs={'user':'admin'}" },
    { title: "Sort Dict by Value Lambda", sub: "Lambdas", diff: "Easy", desc: "Sort dictionary items by value ascending.", in: "{'apple': 3, 'banana': 1}", out: "[('banana', 1), ('apple', 3)]" },
    { title: "Collections Counter Top Words", sub: "Collections", diff: "Easy", desc: "Find most common words using Counter.", in: "words = ['cat', 'dog', 'cat']", out: "[('cat', 2)]" },
    { title: "Group Items with defaultdict", sub: "Collections", diff: "Easy", desc: "Group word list by initial letter.", in: "['apple', 'banana', 'avocado']", out: "{'a': ['apple', 'avocado'], 'b': ['banana']}" },
    { title: "Sliding Window Max with Deque", sub: "Collections", diff: "Hard", desc: "Monotonic double-ended queue maximums in O(N).", in: "nums = [1,3,-1,-3,5,3,6,7], k = 3", out: "[3,3,5,5,6,7]" },
    { title: "Itertools Permutations Generator", sub: "Collections", diff: "Easy", desc: "Generate all permutations of a list.", in: "items = [1, 2]", out: "[(1,2), (2,1)]" },
    { title: "String Slice Palindrome Check", sub: "Strings", diff: "Easy", desc: "Check palindrome using s == s[::-1].", in: "s = 'radar'", out: "true" },
    { title: "Regex Findall Digits", sub: "Strings", diff: "Easy", desc: "Extract numbers from text using re.findall.", in: "text = 'item 42 costs $99'", out: "['42', '99']" },
    { title: "Class @property Getter Setter", sub: "OOP", diff: "Easy", desc: "Enforce positive number validation in setter.", in: "account.balance = -50", out: "ValueError" },
    { title: "Magic Dunder __add__ Vector", sub: "OOP", diff: "Medium", desc: "Overload + operator for 2D Point class.", in: "Point(1,2) + Point(3,4)", out: "Point(4,6)" },
    { title: "Custom Context Manager with @contextmanager", sub: "Context Managers", diff: "Medium", desc: "Implement custom with-statement handler.", in: "with database_conn(): query()", out: "Auto closed" },
    { title: "Map & Filter Number Squares", sub: "Functional", diff: "Easy", desc: "Square all even numbers using map and filter.", in: "nums = [1,2,3,4]", out: "[4, 16]" },
    { title: "Deduplicate List Preserving Order", sub: "Data Types", diff: "Easy", desc: "Remove duplicates while maintaining order.", in: "[1, 3, 2, 1, 3]", out: "[1, 3, 2]" },
    { title: "Deep Copy vs Shallow Copy", sub: "Memory", diff: "Easy", desc: "Clone nested structures using copy.deepcopy.", in: "nested = [[1],[2]]", out: "Independent clone" },
    { title: "Custom Exception Class", sub: "Exceptions", diff: "Easy", desc: "Raise InvalidInputError inheriting from Exception.", in: "validate(-1)", out: "Raises InvalidInputError" },
    { title: "Zip Lists into Dictionary", sub: "Data Types", diff: "Easy", desc: "Combine keys and values lists using dict(zip(k, v)).", in: "keys = ['a','b'], vals = [1,2]", out: "{'a': 1, 'b': 2}" }
  ],

  "SQL": [
    { title: "Nth Highest Salary Query", sub: "Advanced Select", diff: "Medium", desc: "Find Nth highest distinct salary with LIMIT/OFFSET.", in: "Salaries = [100, 200, 300], N = 2", out: "200" },
    { title: "Duplicate Emails Finder", sub: "Basic Select", diff: "Easy", desc: "Find all emails appearing more than once.", in: "Emails = ['a@b.com', 'c@d.com', 'a@b.com']", out: "'a@b.com'" },
    { title: "Customers Who Never Order", sub: "Joins & Subqueries", diff: "Easy", desc: "Left join customers table against orders.", in: "Customers [1,2], Orders [1]", out: "Customer 2" },
    { title: "Delete Duplicate Records", sub: "Basic Select", diff: "Easy", desc: "Delete duplicate emails keeping lowest ID.", in: "IDs [1, 2] with email 'a@b.com'", out: "ID 1 retained" },
    { title: "Rising Temperature Date Diff", sub: "Joins & Subqueries", diff: "Easy", desc: "Find dates with higher temperature than yesterday.", in: "Day 1: 20°C, Day 2: 25°C", out: "Day 2" },
    { title: "Department Top Salary (DENSE_RANK)", sub: "Window Functions", diff: "Medium", desc: "Rank top salaries per department using DENSE_RANK().", in: "Sales: [8000, 7000, 7000]", out: "Rank 1: 8000, Rank 2: 7000" },
    { title: "Consecutive Numbers (Lead/Lag)", sub: "Window Functions", diff: "Medium", desc: "Find numbers appearing at least 3 times consecutively.", in: "Logs: [1, 1, 1, 2]", out: "1" },
    { title: "Employees Earning More Than Manager", sub: "Joins & Subqueries", diff: "Easy", desc: "Self-join employee table on managerId.", in: "Emp 70k, Mgr 60k", out: "Emp" },
    { title: "Big Countries Area Population", sub: "Basic Select", diff: "Easy", desc: "Filter area >= 3M or population >= 25M.", in: "Area = 3.5M, Pop = 10M", out: "Match" },
    { title: "Classes With 5+ Students", sub: "Aggregations", diff: "Easy", desc: "GROUP BY class HAVING COUNT(student) >= 5.", in: "Math: 6 students", out: "Math" },
    { title: "Reformat Department Table Pivot", sub: "Aggregations", diff: "Medium", desc: "Pivot monthly revenue using CASE WHEN.", in: "id = 1, Jan = 8000, Feb = 7000", out: "1 row with Jan_Revenue, Feb_Revenue" },
    { title: "Tree Node Root/Inner/Leaf Classifier", sub: "Advanced Select", diff: "Medium", desc: "Classify tree nodes using CASE statements.", in: "Node 1 p_id NULL, Node 2 p_id 1", out: "1: Root, 2: Leaf" },
    { title: "Second Highest Salary Null Check", sub: "Advanced Select", diff: "Medium", desc: "Return second highest salary or NULL if absent.", in: "Salaries = [100]", out: "NULL" },
    { title: "Swap Salary Sex Values In-Place", sub: "Basic Select", diff: "Easy", desc: "Update m to f and f to m using CASE.", in: "'m' -> 'f'", out: "'f'" },
    { title: "Actors & Directors 3+ Collaborations", sub: "Aggregations", diff: "Easy", desc: "Find pairs who cooperated at least 3 times.", in: "Actor 1, Director 1: 3 films", out: "Actor 1, Director 1" },
    { title: "Active Users Past 30 Days", sub: "Aggregations", diff: "Easy", desc: "Count daily active users within date interval.", in: "Activity dates between 2025-01-01 and 2025-01-30", out: "Count active" },
    { title: "Authors Viewing Own Articles", sub: "Basic Select", diff: "Easy", desc: "Find authors where author_id == viewer_id.", in: "author_id = 4, viewer_id = 4", out: "ID 4" },
    { title: "Average Selling Price per Product", sub: "Aggregations", diff: "Easy", desc: "Calculate weighted average price using purchase dates.", in: "Price $10 qty 2, Price $15 qty 1", out: "$11.67" },
    { title: "Percentage of Users in Contests", sub: "Aggregations", diff: "Easy", desc: "Percentage rounded to 2 decimals.", in: "3 of 4 users registered", out: "75.00%" },
    { title: "Bank Account Summary II", sub: "Aggregations", diff: "Easy", desc: "Users with balance greater than 10000.", in: "User balance = 15000", out: "Match" }
  ],

  "React": [
    { title: "Custom useDebounce Hook", sub: "Hooks & State", diff: "Easy", desc: "Delay state update until delay ms elapsed.", in: "value = 'search', delay = 300", out: "debouncedValue" },
    { title: "Custom useLocalStorage Hook", sub: "Hooks & State", diff: "Easy", desc: "Sync React state with window.localStorage.", in: "key = 'theme', val = 'dark'", out: "Persistent state" },
    { title: "Custom usePrevious Ref Hook", sub: "Hooks & State", diff: "Easy", desc: "Store previous render value with useRef.", in: "count 1 -> 2", out: "previous: 1" },
    { title: "Custom useToggle Boolean Hook", sub: "Hooks & State", diff: "Easy", desc: "Toggle boolean state with custom setter.", in: "toggle()", out: "true -> false" },
    { title: "Custom useFetch with AbortController", sub: "Hooks & State", diff: "Medium", desc: "Fetch data and cancel on component unmount.", in: "fetch('/api')", out: "{ data, loading, error }" },
    { title: "Custom useInterval Timer Hook", sub: "Hooks & State", diff: "Medium", desc: "Declarative setInterval handling dynamic delays.", in: "delay = 1000", out: "Ticking callback" },
    { title: "Custom useOnClickOutside Hook", sub: "Hooks & State", diff: "Medium", desc: "Detect clicks outside ref container element.", in: "click outside dropdown", out: "close()" },
    { title: "Custom useWindowSize Hook", sub: "Hooks & State", diff: "Easy", desc: "Track window innerWidth and innerHeight resize.", in: "resize window", out: "{ width: 1920, height: 1080 }" },
    { title: "Controlled Form Input Component", sub: "Components", diff: "Easy", desc: "Sync input value and onChange with state.", in: "type 'hello'", out: "state = 'hello'" },
    { title: "Modal with ReactDOM.createPortal", sub: "Components", diff: "Medium", desc: "Render overlay directly into document.body.", in: "isOpen = true", out: "Portal rendered" },
    { title: "Accordion Expand/Collapse List", sub: "Components", diff: "Easy", desc: "Single open item accordion state.", in: "click item 2", out: "item 2 open, item 1 closed" },
    { title: "IntersectionObserver Infinite Scroll", sub: "Hooks & State", diff: "Medium", desc: "Trigger next page load when sentinel is visible.", in: "scroll to bottom", out: "fetchNextPage()" },
    { title: "Search Autocomplete Dropdown", sub: "Components", diff: "Medium", desc: "Filter suggestions list on keystrokes.", in: "query = 're'", out: "['react', 'redux']" },
    { title: "Theme Context Provider (Dark/Light)", sub: "Context API", diff: "Easy", desc: "Provide and consume theme toggle context.", in: "toggleTheme()", out: "theme: 'dark'" },
    { title: "Counter with useReducer", sub: "State Management", diff: "Easy", desc: "Increment, decrement, reset actions dispatch.", in: "dispatch({ type: 'INC' })", out: "count: 1" },
    { title: "List Optimization with React.memo", sub: "Performance", diff: "Easy", desc: "Prevent re-renders of list items.", in: "parent renders", out: "Child skips render" },
    { title: "Callback Caching with useCallback", sub: "Performance", diff: "Easy", desc: "Memoize event handler passed to child.", in: "pass handleClick", out: "Stable function ref" },
    { title: "Expensive Calculation with useMemo", sub: "Performance", diff: "Easy", desc: "Cache prime numbers calculation across renders.", in: "n = 10000", out: "Cached calculation" },
    { title: "Error Boundary Class Component", sub: "Error Handling", diff: "Medium", desc: "Catch child component render errors.", in: "Child throws error", out: "Fallback UI rendered" },
    { title: "Higher Order Component withLoading", sub: "Components", diff: "Medium", desc: "Wrap component displaying spinner while loading.", in: "isLoading = true", out: "<Spinner />" }
  ]
};

// Fill in other domains with distinct real problem titles (Mathematics, AI, C++, Java, Ruby, Databases, Shell, FP, Regex)
const OTHER_DOMAINS = {
  "Mathematics": [
    "Palindrome Integer Without String", "Sieve of Eratosthenes Count", "Euclidean GCD Algorithm", "Fast Exponentiation Pow(x,n)",
    "Integer Square Root", "Factorial Trailing Zeroes", "Pascal's Triangle Generator", "Distinct Permutations Counter",
    "Excel Sheet Column Number", "Roman to Integer Converter", "Integer to Roman Numeral", "Angle Between Clock Hands",
    "Valid Perfect Square", "Add Digits Digital Root", "Check Straight Line Coordinates", "Convex Hull Perimeter",
    "Ugly Numbers Prime Factors", "Happy Number Cycle Detection", "Nim Game Winning Strategy", "Matrix Exponentiation Fibonacci"
  ],
  "Artificial Intelligence": [
    "Minimax Decision Engine", "Alpha-Beta Pruning Evaluator", "A* Grid Pathfinding", "Breadth-First Maze Solver",
    "K-Nearest Neighbors Classifier", "Linear Regression Gradient Descent", "K-Means Centroid Update", "Naive Bayes Sentiment Classifier",
    "TF-IDF Term Weighting", "Bag of Words Vectorizer", "Cosine Similarity Calculator", "Decision Tree Entropy Split",
    "Gini Impurity Calculator", "Sigmoid & Binary Cross Entropy", "Perceptron Weight Update", "Q-Learning Bellman Update",
    "Epsilon-Greedy Exploration Policy", "Markov Chain State Transition", "Genetic Algorithm Crossover", "Genetic Algorithm Mutation"
  ],
  "C++": [
    "STL Priority Queue Custom Functor", "Remove Duplicates with std::unique", "Word Frequency with std::map", "Contains Duplicate std::unordered_set",
    "Generic Template Max Function", "RAII Smart Pointer Wrapper", "Move Constructor & std::move", "Filter Vector with std::copy_if",
    "Bank Account Class Encapsulation", "Polymorphic Shape Area", "Complex Number Operator+", "Exception Handling Try-Catch",
    "Custom Exception Class", "Sort Vector with Custom Lambda", "Binary Search with std::lower_bound", "Count Predicates with std::count_if",
    "Thread-Safe Counter std::mutex", "Static Instance Counter", "Compile-Time Constexpr Factorial", "Graph Adjacency List (std::vector)"
  ],
  "Java": [
    "LRU Cache LinkedHashMap", "Reverse ArrayList in Java", "Two Sum with HashMap", "Task Scheduler PriorityQueue",
    "Detect Duplicates with HashSet", "Thread-Safe Singleton Pattern", "Shape Factory Pattern", "Custom Checked Exception",
    "Try-with-Resources AutoCloseable", "Stream Filter Even Numbers", "Stream Map String Lengths", "Stream Reduce Sum",
    "Stream GroupingBy Length", "Implement Runnable Thread", "Synchronized Counter Block", "Generic Stack<T> Class",
    "Custom Comparator Sort", "Interface Default Method", "Optional Null-Safe Fallback", "Immutable Class Implementation"
  ],
  "Ruby": [
    "Frequency Histogram with Enumerable", "Array Map Number Doubler", "Array Select Even Numbers", "Invert Hash Keys & Values",
    "Custom Method with Yield", "Symbol Object ID Comparison", "Dynamic Proxy method_missing", "Class Inheritance Animal Dog",
    "Module Mixin Include", "Attr Accessor Getters Setters", "Monkey Patching String Class", "Ternary Conditional Check",
    "Unless Modifier Usage", "Case When Type Matcher", "Splat Operator Variadic Args", "Proc vs Lambda Return Difference",
    "Lambda Function Call", "Regexp Match Email Address", "Object Freeze Immutability", "Begin Rescue Exception Handling"
  ],
  "Databases": [
    "Atomic Balance Transfer Procedure", "Deadlock Detection & Resolution", "B-Tree vs Hash Index Selector", "Composite Index Column Order",
    "Primary Key vs Unique Constraint", "Foreign Key ON DELETE CASCADE", "First Normal Form (1NF) Conversion", "Second Normal Form (2NF) Conversion",
    "Third Normal Form (3NF) Conversion", "Write-Ahead Logging (WAL) Protocol", "Database Sharding Key Strategy", "Read Replica Replication Lag",
    "Optimistic Concurrency Control", "Pessimistic Locking (FOR UPDATE)", "Two-Phase Commit (2PC) Protocol", "Row vs Columnar Storage Decision",
    "Connection Pool Sizing Formula", "Query Execution Plan EXPLAIN", "Document Store Embed vs Reference", "Redis Cache Invalidation Patterns"
  ],
  "Linux Shell": [
    "Word Frequency Counter (awk/sort)", "Filter Error Lines with Grep", "Sed Global IP Masker", "Extract CSV Column with Cut",
    "Sort Numbers Unique Descending", "Find Files Modified in Past 24h", "Count Total Lines in Directory", "Top 5 Largest Folders (du/sort)",
    "Kill Process Listening on Port", "Tail Follow Live Log Output", "For Loop Rename .txt to .bak", "While Read Line by Line",
    "Check File Exists Condition", "Validate CLI Argument Count", "Tar Gzip Compress Folder", "Chmod Permissions 755",
    "Curl HTTP Status Code Checker", "List Open TCP Listening Ports", "Export Environment Variable", "Daily Midnight Cron Expression"
  ],
  "Functional Programming": [
    "Variadic Pipe Composition", "Auto-Currying Function", "Custom Pure Array Map", "Custom Pure Array Filter",
    "Custom Pure Array Reduce", "Pure Function Memoization", "Partial Application Left Bind", "Deep Freeze Object Immutability",
    "Tail-Call Optimized Factorial", "Pure Recursive Array Flatten", "Maybe Monad Wrapper", "Either Monad Error Handling",
    "Identity Monad Container", "Point-Free Formatter", "Trampoline Stack Overflow Guard", "Pure Immutable List Append",
    "ZipWith Higher Order Combiner", "Chunk Array into Groups", "Transducer Map-Filter Combo", "Functional Lens Getter/Setter"
  ],
  "Regex": [
    "IPv4 & IPv6 Regex Matcher", "Standard Email Matcher", "US Phone Number Matcher", "Hex Color Code #FFFFFF",
    "Strong Password Lookahead", "HTML Tag Stripper Regex", "Extract Domain from URL", "Credit Card 16-Digit Formatter",
    "ISO Date YYYY-MM-DD Matcher", "Repeated Consecutive Words", "CamelCase to Snake_Case", "Words Starting with Vowels",
    "Negative Lookahead File Filter", "Extract Double-Quoted Strings", "Insert Thousands Separator", "MAC Address Validator",
    "Signed Floating Point Matcher", "Markdown **Bold** Extractor", "Trim Leading/Trailing Whitespace", "Parse URL Query Parameters"
  ]
};

const allProblems = [];

// 1. Add detailed curated problems
Object.entries(CURATED_CATALOG).forEach(([domain, problems]) => {
  problems.forEach((p, idx) => {
    allProblems.push({
      id: `${domain.toLowerCase().replace(/[^a-z0-9]/g, '')}-${idx + 1}`,
      title: p.title,
      category: domain,
      subtopic: p.sub,
      difficulty: p.diff,
      description: `**${p.title}** (${domain})\n\n${p.desc}\n\n**Constraints:**\n• Process inputs efficiently without redundant space.\n• Time Complexity Target: Optimal Big-O.\n• Handle edge cases gracefully.`,
      starterCode: `// Problem: ${p.title}\n// Domain: ${domain}\nfunction solution(input) {\n  // Write your ${domain} solution here\n  \n  return input;\n}`,
      examples: [
        { input: p.in, output: p.out, explanation: `Correctly solves ${p.title}.` }
      ]
    });
  });
});

// 2. Add other domains with exact 20 distinct real titles
Object.entries(OTHER_DOMAINS).forEach(([domain, titles]) => {
  titles.forEach((title, idx) => {
    allProblems.push({
      id: `${domain.toLowerCase().replace(/[^a-z0-9]/g, '')}-${idx + 1}`,
      title: title,
      category: domain,
      subtopic: "Core Fundamentals",
      difficulty: idx % 3 === 0 ? "Hard" : idx % 2 === 0 ? "Medium" : "Easy",
      description: `**${title}** (${domain})\n\nImplement the optimal algorithm for ${title}.\n\n**Constraints:**\n• 1 <= N <= 10^5\n• Clean idiomatic ${domain} logic.\n• Target Complexity: O(N) or O(log N).`,
      starterCode: `// Problem: ${title}\n// Domain: ${domain}\nfunction solution(input) {\n  // Write your ${domain} solution here\n  \n  return input;\n}`,
      examples: [
        { input: "sample_input", output: "sample_output", explanation: `Solves ${title} under required constraints.` }
      ]
    });
  });
});

console.log(`Generated ${allProblems.length} real named problems across 15 domains!`);

// Save to backend
const backendPath = path.join(__dirname, '../data/problems.json');
fs.writeFileSync(backendPath, JSON.stringify(allProblems, null, 2), 'utf-8');
console.log(`✅ Saved backend problems: ${backendPath}`);

// Save to frontend public
const frontendDir = path.join(__dirname, '../../frontend/public/data');
if (!fs.existsSync(frontendDir)) {
  fs.mkdirSync(frontendDir, { recursive: true });
}
const frontendPath = path.join(frontendDir, 'problems.json');
fs.writeFileSync(frontendPath, JSON.stringify(allProblems, null, 2), 'utf-8');
console.log(`✅ Saved frontend problems: ${frontendPath}`);