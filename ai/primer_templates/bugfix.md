# Bug Fix Primer

**Reminder of General Guidelines**:

- **NEVER** use placeholder comments like `// ... existing code ...`.
- **NEVER** remove existing code unless explicitly instructed.
- **ALWAYS** propose additive changes when possible.
- Follow best practices and project-specific guidelines.

---

## Key Guidelines

- **DO NOT** remove any existing code unless explicitly instructed.
- Follow best practices for state management and event handling relevant to the project's technology stack.
- Ensure the fix works across different environments and use cases.
- Consider accessibility implications of the fix.
- **DO NOT** suggest changes that affect formatting.
- **Scope**: Only modify the specified files. Do not affect other components or styles unless necessary.

---

## Instructions

1. **Confirm Understanding**:

   - Please summarize your understanding of the task before making any changes.

2. **Step-by-Step Implementation**:

   - **Step 1**: Identify the cause of the bug in `[Path to relevant file 1]`.
   - **Step 2**: Implement the necessary changes in `[Path to relevant file 1]` to fix the issue.
   - **Step 3**: Update `[Path to relevant file 2]` if needed to support the fix.
   - **Step 4**: Test the fix across different environments and use cases.
   - **Step 5**: Ensure accessibility compliance where applicable.

3. **Provide Summary**:

   - After completing the changes, provide a detailed summary of what was done and any potential impacts.
   - Annotate the code with comments to explain the functionality and changes made using this pattern: `// comments go here...`. Make sure that all comments are on new lines above the code block and not inline with the code.
   - Never add comments to any `.css` files.

4. **Await Approval**:
   - Wait for confirmation before proceeding to the next step or finalizing changes.
