# AGENTS.md — MADIPRO Development Instructions

## 1. Project Context

MADIPRO is a Program Distribution Management System for Relawan Nusantara.

The application manages four program categories:

1. Program Kemitraan
2. Program Campaign
3. Program Aspirasi
4. Program Kedaruratan

The general lifecycle consists of:

1. Initiation
2. Development
3. Preparation
4. Implementation
5. Evaluation

The current development priority is the frontend application in `frontend/`. Backend integration and database implementation are not yet part of the confirmed scope.

The project technology stack is:

- Frontend: Next.js, React, TypeScript, Tailwind CSS, and npm. The active implementation is in `frontend/`.
- Backend: Flask, planned for the backend implementation stage.
- Database: PostgreSQL, planned for the database implementation stage.

Flask and PostgreSQL are not implemented in this repository yet. Verify the actual frontend versions in `frontend/package.json` and `frontend/package-lock.json` before making tooling changes.

## 2. Mandatory Instructions

Before making any changes:

1. Inspect the existing repository structure.
2. Read `README.md` and relevant documentation.
3. Inspect `package.json`, lockfiles, configuration files, and existing dependencies.
4. Understand existing components and conventions.
5. Identify the feature's relationship with other modules.
6. Reuse existing implementations whenever possible.

Never assume that the repository uses a specific framework, library, package manager, or architecture without inspecting it first.

Do not rewrite existing working code without a clear technical reason.

## 3. Business Requirements Are the Source of Truth

Use the available business and functional requirement documents as the primary reference.

Important rules:

- Do not invent approval authorities.
- Do not invent user roles or permissions.
- Do not invent form fields.
- Do not invent official status names.
- Do not invent revision or rejection paths.
- Do not assume all program categories have identical workflows.
- Do not remove required document steps for convenience.

When a requirement is unclear:

1. Identify the uncertainty.
2. Explain its impact on implementation.
3. Mark it as pending confirmation.
4. Use configurable or clearly provisional frontend behavior only when necessary.
5. Do not silently convert assumptions into permanent business rules.

## 4. Confirmed Business Constraints

The following information has been established:

- There are four program categories.
- Each program has one coordinator or program lead.
- A program may have multiple locations.
- A distribution usually has one funding source.
- Approval processes must be sequential.
- Rejection must include a reason.
- Documents must retain their previous versions as history.
- Required document types include PRF, Proposal, MoU (Kemitraan only), MIPro, DSS, SPK, Program Report, and Financial Report.
- Multiple disbursements may occur for some programs.
- Financial reports that do not match the approved RAB must be revised.
- Progress percentage is not currently required.
- Photo documentation is required at minimum; video is desirable.
- Implementation updates need date and location information.
- A program is closed after Program and Financial Reports are approved by the relevant stakeholders.
- A closed program must not be editable.

Do not extend these rules beyond what they explicitly establish.

## 5. Pending Business Decisions

The following must remain configurable or pending confirmation:

- Final user roles and permission matrix.
- Approval authority for each workflow stage.
- RAB approval authority, due to conflicting references:
  - Business clarification: CEO.
  - Functional requirements: Director for most categories; Finance for Aspirasi.
- Exact status names and transitions.
- Detailed form fields and templates.
- Final notification event list.
- Exact edit permissions after submission.

Do not hardcode these decisions into shared business logic.

## 6. Frontend Development Scope

Until backend contracts are available:

- Use mock data for frontend demonstrations.
- Keep mock data separate from UI components when adding or refactoring features. Existing screens may still contain legacy illustrative data until they are migrated.
- Run frontend commands from `frontend/`, or use `npm --prefix frontend ...` from the repository root.
- Use typed data structures where supported by the existing stack.
- Avoid scattering hardcoded sample values throughout pages.
- Keep API integration replaceable.
- Clearly distinguish mock behavior from real business operations.
- Do not claim that data is persisted on a server when it is only local state.
- Do not introduce Flask, PostgreSQL, or another backend/database implementation without explicit project approval and an agreed contract/schema.

If local storage is used, document its purpose and limitations.

## 7. Architecture & Code Quality

Follow the existing architecture.

General guidelines:

- Prefer reusable components.
- Keep components focused and maintainable.
- Separate page composition from feature-specific logic.
- Avoid unnecessarily large components.
- Avoid duplicated business logic.
- Use clear naming conventions.
- Use consistent formatting.
- Avoid unnecessary dependencies.
- Preserve existing design tokens and UI patterns.
- Do not create abstractions without a practical need.
- Avoid changing unrelated files.

Before creating a new shared component, check whether an equivalent component already exists.

## 8. UI/UX Guidelines

MADIPRO is an internal business application.

The interface should prioritize:

- Clarity
- Consistency
- Efficient data entry
- Readable tables
- Clear status indicators
- Predictable navigation
- Helpful validation messages
- Consistent loading, empty, and error states

Language:

- Use Bahasa Indonesia for user-facing interface text.
- Keep technical identifiers and code naming in English.
- Use consistent terminology across modules.

Do not redesign established screens without a task requirement or explicit approval.

## 9. Forms & Validation

For every form:

- Clearly distinguish required and optional fields.
- Validate user input.
- Show understandable error messages.
- Preserve user input when validation fails.
- Prevent accidental duplicate submissions where applicable.
- Provide clear success and failure feedback.
- Do not invent required fields when the official form specification is unavailable.

Use the existing validation approach and libraries in the repository.

## 10. Workflow & Approval UI

Approval and workflow behavior must follow confirmed business requirements.

- Sequential approval must be represented correctly.
- Rejection must capture a reason.
- Revision paths must not be invented.
- Approval actions must be distinguishable from ordinary editing.
- Status changes must be visible to users.
- Closed programs must not expose editable actions.

When approval authorities are not confirmed, do not simulate them as official rules. Use clearly marked provisional data or configurable placeholders.

## 11. Documents & Files

The application is expected to support documents such as:

- PRF
- Proposal
- MoU
- MIPro
- DSS / RAB
- SPK
- Program Report
- Financial Report
- CA supporting documents

Document-related implementation should consider:

- Program association
- Document type
- Upload or generation status
- Upload date
- Version history
- Review status

Do not claim that PDF generation, file storage, or document versioning is fully implemented unless it actually works.

## 12. Git & Collaboration Rules

The repository uses a branch-based workflow.

- `main` is the stable integration branch.
- Never commit feature work directly to `main`.
- Use a separate feature branch for each task.
- Keep changes focused.
- Pull the latest `main` before starting new work.
- Do not commit `.env.local`, secrets, `node_modules`, or generated `.next` output.
- Resolve conflicts before submitting a PR.
- Submit changes through Pull Requests.
- Do not merge your own PR unless explicitly authorized.

Suggested branch naming:

```text
feature/dashboard
feature/program-list
feature/prf-form
feature/program-detail
fix/form-validation
refactor/shared-components
```

Suggested commit prefixes:

```text
feat: add program dashboard
fix: correct PRF form validation
refactor: extract reusable table component
style: improve sidebar spacing
docs: update project documentation
chore: update dependencies
```

## 13. Testing & Verification

Before considering a task complete:

1. Run the relevant lint command if it is configured and compatible with the installed framework version.
2. Run type checking if available.
3. Run the production build if practical.
4. Test the affected screen or interaction.
5. Check loading, empty, and error states where applicable.
6. Check responsive behavior for changed layouts.
7. Inspect the final diff for unrelated changes.

Never claim a test passed if it was not executed.

Report:

- Commands executed.
- Test results.
- Known limitations.
- Any remaining issues.

## 14. Pull Request Expectations

Every implementation task should produce a focused PR.

A PR description should contain:

- Objective
- Summary of changes
- Screens or modules affected
- Testing performed
- Screenshots for UI changes where useful
- Known limitations
- Any pending business decisions

Do not include unrelated refactoring in a feature PR.

## 15. Working With Existing Code

When asked to implement a feature:

1. Inspect the relevant existing code.
2. Identify the smallest reasonable implementation scope.
3. Reuse existing patterns.
4. Implement only the requested task.
5. Verify the changes.
6. Summarize the result and affected files.

When asked to plan:

- Inspect the repository first.
- Provide an implementation plan.
- Identify dependencies and risks.
- Identify unclear requirements.
- Do not modify code until implementation is requested.

## 16. Final Principle

MADIPRO must reflect the actual business process of Relawan Nusantara.

Technical convenience must not silently change business rules.

Prioritize correctness, consistency, maintainability, and traceability over unnecessary complexity.
