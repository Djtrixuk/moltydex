# The Nonsensical Nature of React Bugs: When Things Work Sometimes and Break Other Times

## A Case Study: The Logo Display Saga

### What Happened

We attempted to fix token logo display issues by:
1. Adding Next.js image domain configuration (`remotePatterns`)
2. Calling `getKnownTokenLogo()` during component render
3. Trying to optimize logo fetching with synchronous checks

**Result:** The entire application broke. Swaps stopped working, balances wouldn't load, token info failed to fetch. Yet the code *looked* correct and should have worked.

**The Rollback:** Reverting to a version from 9-12 hours prior restored everything instantly. All logos displayed, swaps worked, balances loaded. The "broken" code and "working" code were nearly identical.

---

## Why This Feels Nonsensical

### 1. **The Render Phase Trap**

**What We Did Wrong:**
```typescript
// ❌ BAD: Calling function during render
export default function TokenLogo({ token }) {
  const knownLogo = getKnownTokenLogo(token.address); // Called during render!
  const [logoUrl, setLogoUrl] = useState(knownLogo);
  // ...
}
```

**Why It Broke Everything:**
- React components must be **pure functions** during render
- Calling functions with side effects (even "pure" lookup functions) during render can:
  - Cause infinite re-render loops
  - Break React's reconciliation algorithm
  - Prevent other components from rendering
  - Cause cascading failures that break unrelated features

**The Nonsensical Part:**
- The function `getKnownTokenLogo()` is technically "pure" (no side effects)
- It's just a Map lookup: `POPULAR_TOKEN_LOGOS[address]`
- But calling it during render broke **everything**, including unrelated features like balance fetching
- Moving the exact same call to `useEffect` fixed it completely

**Root Cause:** React's rendering is synchronous and deterministic. Any deviation from pure rendering can cause React to get confused about what to render, when to render, and what state is valid. This confusion cascades through the component tree.

---

### 2. **The Cascade Failure Effect**

**What Happened:**
- One component (`TokenLogo`) had a render issue
- This caused the entire app to break:
  - Balance fetching stopped
  - Swap functionality failed
  - Token info API calls failed
  - Half/Max buttons disappeared

**Why This Feels Nonsensical:**
- These features are completely unrelated to logo display
- They don't share code paths
- They don't depend on `TokenLogo` component
- Yet they all broke simultaneously

**Root Cause:** React's rendering is a single-threaded, synchronous process. If one component fails to render correctly, React may:
1. Stop rendering the entire tree
2. Get stuck in a render loop
3. Fail to process state updates
4. Prevent other components from mounting/unmounting correctly

When React's render cycle is disrupted, **everything** breaks, even unrelated features.

---

### 3. **The "It Worked Yesterday" Phenomenon**

**The Pattern:**
- Code works perfectly one day
- Make a small change
- Everything breaks
- Rollback to previous version
- Everything works again
- The "broken" code looks identical to the "working" code

**Why This Feels Nonsensical:**
- The changes were minimal (adding a function call)
- The logic was sound (check known logos first)
- No syntax errors, no type errors
- Build succeeded, deployment succeeded
- But runtime behavior was completely broken

**Root Cause:** React's behavior depends on:
1. **Render order** - Components render top-to-bottom, and order matters
2. **State timing** - When state updates happen relative to renders
3. **Effect timing** - When effects run relative to renders
4. **Component tree structure** - How components are nested

A tiny change can alter these timings, causing:
- Race conditions that weren't there before
- Render order changes that break assumptions
- State update batching that changes behavior
- Effect dependency chains that cause loops

---

## The Technical Deep Dive

### React's Rendering Rules (The Ones We Broke)

#### Rule 1: Components Must Be Pure
```typescript
// ✅ GOOD: Pure component
function Component({ value }) {
  return <div>{value}</div>; // Only uses props, no side effects
}

// ❌ BAD: Impure component
function Component({ value }) {
  const result = expensiveComputation(); // Side effect during render!
  return <div>{result}</div>;
}
```

**What We Did:** Called `getKnownTokenLogo()` during render. Even though it's a simple lookup, React treats any function call during render as potentially impure.

#### Rule 2: Side Effects Belong in Effects
```typescript
// ✅ GOOD: Side effect in useEffect
useEffect(() => {
  const logo = getKnownTokenLogo(token.address);
  if (logo) setLogoUrl(logo);
}, [token.address]);

// ❌ BAD: Side effect during render
const logo = getKnownTokenLogo(token.address); // During render!
```

**What We Did:** We tried to optimize by checking logos synchronously during render, but this violated React's rules.

#### Rule 3: State Updates Must Be Predictable
```typescript
// ✅ GOOD: Predictable state update
useEffect(() => {
  if (!token.logo) {
    getTokenLogo(token.address).then(setLogoUrl);
  }
}, [token.address, token.logo]);

// ❌ BAD: Unpredictable state initialization
const knownLogo = getKnownTokenLogo(token.address); // Called every render
const [logoUrl] = useState(knownLogo); // State depends on render-time value
```

**What We Did:** We initialized state based on a value computed during render, making state unpredictable.

---

## Why Next.js Image Configuration Didn't Help

### The Configuration We Added
```javascript
// next.config.js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    { protocol: 'https', hostname: 'static.jup.ag' },
    // ... more domains
  ],
}
```

### Why It Seemed Like It Should Work
- This configuration is correct
- It's the official way to allow external images
- The domains match the logo URLs
- Other Next.js apps use this pattern successfully

### Why It Didn't Fix The Problem
- **The real issue wasn't image loading** - it was React rendering
- Images couldn't load because components weren't rendering correctly
- Even with correct `remotePatterns`, if React breaks, nothing works
- The configuration was correct but irrelevant to the actual bug

**Lesson:** Sometimes the symptom (images not loading) isn't the disease (broken React rendering).

---

## The Pattern: When "Small" Changes Break Everything

### Common Triggers

1. **Calling Functions During Render**
   ```typescript
   // ❌ This can break everything
   const value = someFunction(props.id);
   
   // ✅ This is safe
   useEffect(() => {
     const value = someFunction(props.id);
     setState(value);
   }, [props.id]);
   ```

2. **State Initialization Based on Render-Time Values**
   ```typescript
   // ❌ Unpredictable
   const computed = computeValue(props);
   const [state] = useState(computed);
   
   // ✅ Predictable
   const [state] = useState(() => computeValue(props));
   ```

3. **Conditional Hooks**
   ```typescript
   // ❌ Breaks Rules of Hooks
   if (condition) {
     useEffect(() => { ... });
   }
   
   // ✅ Always call hooks
   useEffect(() => {
     if (condition) { ... }
   });
   ```

4. **Side Effects in Render**
   ```typescript
   // ❌ Side effect during render
   function Component() {
     fetchData(); // Don't do this!
     return <div>...</div>;
   }
   ```

---

## Best Practices to Avoid These Issues

### 1. **Never Call Functions During Render (Unless They're Pure)**

```typescript
// ✅ Safe: Pure computation
const doubled = value * 2;

// ✅ Safe: Pure function (no side effects, same input = same output)
const formatted = formatCurrency(amount);

// ❌ Dangerous: Function that might have side effects
const logo = getKnownTokenLogo(address); // Even if it's "just a lookup"

// ✅ Safe: Move to useEffect
useEffect(() => {
  const logo = getKnownTokenLogo(address);
  if (logo) setLogoUrl(logo);
}, [address]);
```

### 2. **Use useMemo for Expensive Computations**

```typescript
// ✅ Good: Memoized computation
const expensiveValue = useMemo(() => {
  return computeExpensiveThing(props);
}, [props.dependency]);

// ❌ Bad: Recomputes every render
const expensiveValue = computeExpensiveThing(props);
```

### 3. **Initialize State with Functions for Expensive Operations**

```typescript
// ✅ Good: Lazy initialization
const [state] = useState(() => {
  return expensiveComputation();
});

// ❌ Bad: Runs every render
const computed = expensiveComputation();
const [state] = useState(computed);
```

### 4. **Keep Effects Focused and Simple**

```typescript
// ✅ Good: One effect, one purpose
useEffect(() => {
  if (token.logo) {
    setLogoUrl(token.logo);
    return;
  }
  // Fetch logo
}, [token.address, token.logo]);

// ❌ Bad: Complex effect with multiple concerns
useEffect(() => {
  // Check known logos
  // Fetch from API
  // Update cache
  // Preload images
  // Update analytics
  // ... too much!
}, [everything]);
```

### 5. **Test Render Behavior, Not Just Functionality**

```typescript
// ✅ Good: Test that component renders without errors
it('renders without crashing', () => {
  render(<TokenLogo token={mockToken} />);
});

// ✅ Good: Test that effects run correctly
it('fetches logo when token has no logo', async () => {
  const { rerender } = render(<TokenLogo token={tokenWithoutLogo} />);
  await waitFor(() => {
    expect(screen.getByAltText(/logo/)).toBeInTheDocument();
  });
});
```

---

## The Meta-Lesson: React's Strictness Exists for a Reason

### Why React Has These Rules

React's rendering model is:
- **Deterministic** - Same props/state = same output
- **Predictable** - You can reason about when things happen
- **Optimizable** - React can optimize renders safely
- **Debuggable** - Issues are traceable

When you break these rules:
- Rendering becomes non-deterministic
- Behavior becomes unpredictable
- Optimizations break
- Debugging becomes impossible

### The Cascade Effect

One broken component can:
1. Prevent React from completing a render cycle
2. Cause other components to not render
3. Break state updates throughout the app
4. Cause effects to not run
5. Break unrelated features

**This is why "small" changes can break "everything"** - React's rendering is a single-threaded, synchronous process. If one component breaks the rules, the entire process can fail.

---

## Debugging Strategies

### 1. **Check Browser Console First**
- Look for React errors: "Cannot read property of undefined"
- Look for render warnings: "Cannot update during render"
- Look for effect warnings: "Missing dependency"

### 2. **Use React DevTools**
- Check component tree - are components rendering?
- Check state - is state updating correctly?
- Check effects - are effects running?

### 3. **Isolate the Problem**
- Comment out recent changes
- Test component in isolation
- Check if issue is in render vs effect vs event handler

### 4. **Check Render Order**
- Are components rendering in the right order?
- Are dependencies correct?
- Are effects running at the right time?

### 5. **Verify State Updates**
- Is state updating when expected?
- Are state updates batched correctly?
- Are there race conditions?

---

## Conclusion: Why This Feels Nonsensical

### The Illusion

It feels nonsensical because:
1. **The code looks correct** - No syntax errors, logic is sound
2. **The change is small** - Just adding a function call
3. **Unrelated features break** - Why would logo code break swaps?
4. **Rollback fixes everything** - Same code, different behavior

### The Reality

It's not nonsensical, it's **React being strict**:
1. **Render must be pure** - Any deviation breaks the model
2. **Effects must be separate** - Side effects can't be in render
3. **State must be predictable** - Can't depend on render-time values
4. **Everything is connected** - One broken component breaks the tree

### The Solution

Follow React's rules:
- ✅ Keep render pure
- ✅ Use effects for side effects
- ✅ Initialize state correctly
- ✅ Test render behavior
- ✅ Debug systematically

**The rules exist for a reason.** When you follow them, React works predictably. When you don't, everything breaks in ways that seem nonsensical but are actually completely logical from React's perspective.

---

## References

- [React: Components and Hooks must be pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure)
- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React: Separating Events from Effects](https://react.dev/learn/separating-events-from-effects)
- [Next.js: Image Component](https://nextjs.org/docs/app/api-reference/components/image)
- [Next.js: Un-configured Host](https://nextjs.org/docs/messages/next-image-unconfigured-host)

---

*Document created: February 6, 2026*  
*Based on: Token logo display bug investigation and resolution*
