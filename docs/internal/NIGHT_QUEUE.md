# Night Queue - Background Agent Tasks

**Purpose:** Queue low-risk refactors and migrations for background agents  
**Process:** Add tasks here, kick off agents before leaving, review PRs next morning

---

## 📋 Current Queue

### High Priority
_None currently_

### Medium Priority
_None currently_

### Low Priority
_None currently_

---

## ✅ Completed Tasks

_Add completed tasks here with date and PR link_

---

## 📝 Task Template

When adding tasks, use this format:

```markdown
### [Task Title]
**Priority:** High/Medium/Low  
**Scope:** [Clear, well-scoped description]  
**Constraints:** 
- Don't touch X
- Must preserve Y
- Follow Z pattern

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Context Files:**
- claude.md (relevant sections)
- [Other relevant docs]

**Examples:**
- [Link to similar work done well]

**Branch:** `background/[task-name]`
```

---

## 🎯 Task Guidelines

### Good Tasks for Background Agents
- ✅ Fix linting warnings
- ✅ Add missing tests
- ✅ Refactor deprecated code
- ✅ Update documentation
- ✅ Migrate old patterns
- ✅ Add type annotations
- ✅ Improve error messages

### Bad Tasks for Background Agents
- ❌ New features (needs planning)
- ❌ Security changes (needs review)
- ❌ Architecture changes (needs discussion)
- ❌ Complex refactors (needs planning)
- ❌ Performance optimizations (needs analysis)

### Scope Rules
- ✅ One PR per task
- ✅ Well-scoped (20-50 files max)
- ✅ Clear acceptance criteria
- ✅ Can be reviewed independently

---

## 🚀 How to Use

### Adding Tasks
1. Add task to appropriate priority section
2. Use template format
3. Include all context needed

### Kicking Off Agents
1. Copy task description
2. Create branch: `background/[task-name]`
3. Give to background agent with full context
4. Mark task as "In Progress"

### Reviewing PRs
1. Check tests pass
2. Review code quality
3. Verify scope didn't drift
4. Merge if good, close if bad
5. Move to "Completed" section
6. Update claude.md with learnings

---

**Remember:** Background agents are like junior developers. Give them clear tasks, good context, and review their work. They multiply your output, but you own the outcomes.
