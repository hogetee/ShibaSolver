# ShibaSolver — Frontend Design Audit

**Scope:** `frontend/` (Next.js App Router).
**Audited:** 2026-09-01 on `deploy` @ `70fae3f` — no code was changed by the audit itself.
**Updated:** 2026-09-02 — Phase 1 executed on `fix/ui-improvements` (commits `7c2271e`…`3756d0d`); three findings corrected during execution, marked **[CORRECTED]** below.
**Codebase size:** ~10,550 lines across 96 `.tsx` / `.jsx` files in `frontend/src`.

All paths below are relative to `frontend/`. Line numbers are from the state of the tree at the commit above.

---

## 1. Route / Page Map

| Route | Entry file | Renders | Purpose |
|---|---|---|---|
| `/` | `src/app/page.tsx` | `FeedPageContent` | Main feed: 3-column (search + saved posts / posts / notifications drawer) |
| `/post/[postId]/[slug]` | `src/app/post/[postId]/[slug]/page.tsx` | `DedicatedPostContainer` + `CommentContainer` | Single post + comment thread |
| `/user/[username]` | `src/app/user/[username]/page.tsx` | `pages/UserProfilePage.tsx` → `ProfileHeader` + `ProfileContent` | Public profile, tabs for posts/comments |
| `/user/me` | `src/app/user/me/page.tsx` | (redirect only) | Reads `localStorage.username`, redirects to `/user/:username` or `/` |
| `/user/edit` | `src/app/user/edit/page.tsx` | `pages/EditProfilePage.tsx` → `ProfileForm` | Edit own profile |
| `/register` | `src/app/register/page.tsx` | `pages/RegisterPage.tsx` → `RegisterForm` | Post-OAuth profile setup |
| `/signup` | `src/app/signup/page.tsx` | `components/SignupPage.tsx` | Google sign-in / guest entry |
| `/settings` | `src/app/settings/page.tsx` | inline | Admin link, premium toggle, logout |
| `/data-policy` | `src/app/data-policy/page.tsx` | `DataPolicy` | Static policy text |
| `/admin-login` | `src/app/admin-login/page.tsx` | `AdminLoginPage` | Admin email/password login |
| `/admin` | `src/app/admin/page.tsx` (+ `layout.tsx` → `AdminProtectedRoute`) | `AdminButtons` | Admin dashboard hub |
| `/admin/reports` | `src/app/admin/reports/page.tsx` | `StatusContainer` + `ContentTypeContainer` + `ReportList` | Report moderation queue |
| `/admin/banned-accounts` | `src/app/admin/banned-accounts/page.tsx` | `BannedUser` | Banned-user list + unban |

**Global shell:** `src/app/layout.tsx` mounts `NotificationProvider` → `TopMenu` (fixed 64px nav) → `{children}` → `CookieConsentModal`.

**Structural note:** there are no `loading.tsx`, `error.tsx`, or `not-found.tsx` files anywhere under `src/app`. Every loading and error state is hand-rolled inside the page or component (see §7).

---

## 2. Stack

| Concern | What's in use | File |
|---|---|---|
| Framework | Next.js 15.4.6, App Router, React 19.1, TypeScript 5.9 | `package.json` |
| Primary styling | **Tailwind CSS v4.1.14** utility classes (inline in JSX) | `postcss.config.mjs`, `src/app/globals.css` |
| Secondary styling | **MUI 7.3.2** + Emotion — a second, parallel design system | `src/theme/theme.ts` |
| Icon sets (3) | `@mui/icons-material`, `lucide-react`, `@heroicons/react` | mixed across components |
| Token source A | CSS vars in `:root` + `@theme inline` | `src/app/globals.css:8-29` |
| Token source B | MUI `createTheme` palette/typography | `src/theme/theme.ts:30-197` |
| Token source C | Tag colour map, duplicated 4× | `colorConfig.js`, `PostHeader.tsx`, `SearchComponent.tsx`, `RegisterForm.tsx` |
| CSS modules / styled-components | **none** | — |
| Inline `style={{}}` | present in 10 files (see §6) | — |

### 2.1 Stack-level defects

| Issue | Location | Effect |
|---|---|---|
| v3 and v4 Tailwind entrypoints both present | `globals.css:3` `@import "tailwindcss"` **and** `:4-6` `@tailwind base/components/utilities` | The `@tailwind` directives are v3 syntax; redundant at best in v4 |
| v3 `theme()` helper in a v4 project | `globals.css:47,50` `color: theme('colors.gray.400')` | `.select-placeholder` is defined but **used nowhere** in `src/` — dead CSS |
| `body` hard-codes Arial | `globals.css:41` `font-family: Arial, Helvetica, sans-serif` | Anything not explicitly given `font-display` renders in Arial — root cause of the font inconsistency in §3 |
| Geist fonts loaded but never used | `layout.tsx:9-10, 28` sets `--font-geist-sans/mono`; `globals.css:21-22` maps `--font-sans`/`--font-mono` to them | Two `font-sans` usages accidentally pull Geist (see §3.2) |
| Dark mode disabled but `dark:` variants shipped | `globals.css:31-36` (block commented out) vs. 17 `dark:bg-neutral-700` classes in the two skeletons | On a dark-OS device the skeletons go near-black while the app stays light |
| Three token systems never reconciled | globals.css vs `theme.ts` vs literal hexes | Same role, three values (see §3) |

---

## 3. Colours

### 3.1 Declared tokens

**A — Tailwind/CSS custom properties** (`src/app/globals.css:8-29`, declared twice — once in `:root`, once in `@theme inline`):

| Token | Value | Class prefix | Role in practice |
|---|---|---|---|
| `--background` | `#ffffff` | `bg-background` | page background (never used as a class) |
| `--foreground` | `#191825` | `text-foreground` | body text (never used as a class) |
| `--color-accent-200` | `#f6d9ff` | `accent-200` | pale lilac — chips, comment input bg, bio card, secondary buttons |
| `--color-accent-400` | `#ab72c1` | `accent-400` | mid purple — profile content panel, active tab pill, comment author name |
| `--color-accent-600` | `#4b0082` | `accent-600` | indigo — primary action, Shibameter, cookie banner |
| `--color-dark-900` | `#191825` | `dark-900` | near-black — nav bar, body copy, headings |
| `--color-primary-00` | `#ffffff` | `primary-00` | white |

**B — MUI palette** (`src/theme/theme.ts:30-77`) — only reaches MUI components (`Dialog`, `Button`, `Chip`, `Tabs`, `IconButton`, `Avatar`):

| Slot | main | light | dark |
|---|---|---|---|
| `primary` | `#4b0082` | `#8131bbff` | `#340c51ff` |
| `secondary` | `#E384FF` | `#f3a4ff` | `#d166ff` |
| `accent200` | `#f6d9ff` | `#fbedffff` | `#c18bd2ff` |
| `error` | `#FF5555` | `#ff8585` | `#ff2327ff` |
| `success` | `#4CAF50` | `#66BB6A` | `#43A047` |
| `warning` | `#FFA726` | `#FFB74D` | `#F57C00` |
| `customGray` | `#6B7280` | `#9CA3AF` | `#4B5563` |
| `background` | default `#ffffff`, paper `#f8f9fa` | | |
| `text` | primary `#111827`, secondary `#4B5563` | | |

Four of these use an 8-digit hex with a redundant `ff` alpha (`#8131bbff`, `#340c51ff`, `#fbedffff`, `#c18bd2ff`, `#ff2327ff`) — inconsistent notation within the same object.

**C — Subject tag palette**, defined verbatim **four times**:

`src/components/edit_profile/colorConfig.js:36-100` · `src/components/post/PostHeader.tsx:106-120` · `src/components/topMenu/SearchComponent.tsx:22-36` · `src/components/register_page/RegisterForm.tsx:47-61` (commented out, kept as reference)

| Subject | Hex | Also named |
|---|---|---|
| Math | `#2563EB` | `indigo` |
| Physics | `#FF9D00` | `amber` |
| Chemistry | `#9333EA` | `violet` |
| Biology | `#467322` | `forest` |
| History | `#893F07` | `sienna` |
| Geography | `#1E6A91` | `teal` |
| Economics | `#FA733E` | `tangerine` |
| Law | `#000000` | `charcoal` |
| Thai | `#83110F` | `crimson` |
| English | `#BE0EA7` | `magenta` |
| Chinese | `#CBC400` | `gold` |
| Programming | `#6366F1` | `periwinkle` |
| Others | `#63647A` | `slate` |

`colorConfig.js` additionally holds a **second, unrelated pastel set** (`blue/green/purple/red/orange/gray` → `bg-*-100 / text-*-800`, lines 4-33). `SubjectTags.jsx` and `CompactSubjectTags.jsx` always fall back to `colorClasses.blue` for string subjects (`SubjectTags.jsx:20`, `CompactSubjectTags.jsx:20`), so on the edit-profile and register forms **every** subject chip renders pale blue — while the same subject on a post card renders in its bold brand colour. Two visual languages for one concept.

### 3.2 Colour by role — where the palette breaks

| Role | Values found in the wild | Locations |
|---|---|---|
| **Primary action** | `bg-accent-600` (`#4b0082`) | `ProfileForm.jsx:148`, `RegisterForm.tsx:219`, `Pagination.tsx:63` |
| | `bg-purple-700` (`#7e22ce`) hover `purple-600` | `CreatePostModal.tsx:228`, `EditPostModal.tsx:255` |
| | `bg-purple-600` hover `purple-700` (inverted ramp) | `AdminLoginPage.tsx:98` |
| | `bg-[#4B0082]` raw hex | `CreatePostButton.tsx:11` |
| | `bg-accent-400` | `PremiumModal.tsx:63`, `StatusContainer.tsx:8` |
| | MUI `color="primary"` → `#4b0082` | `Comment.tsx:359`, `CommentEditor.tsx:261` |
| **Destructive** | `bg-red-600` hover `red-700` | `DeletePostModal.tsx:47`, `ReportPostModal.tsx:121`, `ReportCommentModal.tsx:126`, `ReportUserModal.tsx:121`, `ProfileHeader.tsx:85,100`, `DeleteAccountModal.jsx:52` |
| | `bg-red-500` hover `red-600` | `ReportCard.tsx:117`, `AccountReportCard.tsx:75`, `PostsList.tsx:91`, `CommentsList.tsx:75`, `CancelPremiumModal.tsx:52` |
| | `bg-red-600` hover `red-800`, disabled `red-400` | `LogOut.tsx:56` |
| | `bg-red-600/70` hover `red-600/60` (hover is *lighter*) | `ProfileForm.jsx:140` |
| | `bg-[#FF3B30]` hover `#FF1F1F` raw hex | `banned_log/banned_user.tsx:100` |
| | MUI `color="error"` → `#FF5555` | `Comment.tsx:369`, `CommentEditor.tsx:250` |
| **Success / solved** | `bg-[#16A34A]` | `PostHeader.tsx:127` |
| | `bg-green-500` hover `green-600` | `ReportCard.tsx:123`, `AccountReportCard.tsx:81` |
| | MUI `color="success"` → `#4CAF50` | `ReportCommentDisplay.tsx:348` |
| | `text-green-600` | `ProfileForm.jsx:76`, `RegisterForm.tsx:116` |
| **Unsolved / error text** | `bg-[#DC2626]` | `PostHeader.tsx:127` |
| | `text-red-400` / `text-red-500` / `text-red-600` / `text-red-700` / `text-red-300` | all five in use; `text-red-400` in `PostsList.tsx:87-88`, `text-red-300` in `LogOut.tsx:61` |
| **Warning** | `bg-amber-400/70` hover `amber-400`, `text-amber-800` | `settings/page.tsx:42` |
| | `bg-amber-50 / border-amber-200 / text-amber-800` | `ReportPostDisplay.tsx:332-337` |
| | `text-amber-500` | `PremiumModal.tsx:48` |
| | `text-orange-500` | `TextArea.jsx:38` |
| | `text-yellow-400` (empty-state copy) | `PostsList.tsx:55`, `CommentsList.tsx:52` |
| | `text-yellow-500 fill-yellow-500` (bookmark) | `PostHeader.tsx:171` |
| | MUI `warning` → `#FFA726` | `theme.ts:60` |
| **Surface / card** | `bg-white` (55×) | everywhere |
| | `bg-gray-50` page bg | `FeedPageContent.tsx:250` |
| | `bg-gray-100` page bg | `settings/page.tsx:16`, `data-policy/page.tsx:5` |
| | `bg-purple-100` card | `SignupPage.tsx:27`, `AdminLoginPage.tsx:47` |
| | `bg-accent-200` card | `BioCard.tsx:9`, `CreateComment.tsx:128` |
| | `bg-[var(--color-accent-200)]` (same colour, different syntax) | `ProfileForm.jsx:55`, `RegisterForm.tsx:90`, `EditProfilePage.tsx:31,46,61` |
| | `bg-accent-400` (profile content panel) | `ProfileContent.tsx:30` |
| **Body text** | `text-dark-900` (42×), `text-gray-600` (27×), `text-gray-700` (19×), `text-gray-800` (9×), `text-neutral-700` (2×), `text-gray-900` (14×), `text-black` (5×) | seven greys for one role |
| **Muted text** | `text-gray-400` (22×), `text-gray-500` (39×) | |
| **Focus ring** | `ring-indigo-500` (12×), `ring-purple-500` (3×), `ring-blue-500` (3×), `ring-red-500` (1×) | four different focus colours |
| **Hover row** | `hover:bg-gray-100`, `hover:bg-gray-50`, `hover:bg-purple-100`, `hover:bg-pink-100`, `hover:bg-blue-50`, `hover:bg-accent-200` | six |

### 3.3 Near-duplicate purples (the "three slightly different purples" problem — it is seven)

| Value | Source | Used for |
|---|---|---|
| `#4b0082` | `--color-accent-600` | primary buttons, Shibameter, cookie card |
| `#4B0082` | raw hex | FAB `CreatePostButton.tsx:11`, `banned_user.tsx:111,121`, `ReportUserModal.tsx:75` |
| `#7e22ce` | `purple-700` | modal submit buttons, `DataPolicy.tsx:6` border |
| `#9333ea` | `purple-600` | admin login button, search accents, spinner |
| `#ab72c1` | `--color-accent-400` | panel bg, active tab, comment author name |
| `#8131bbff` | MUI `primary.light` | MUI hover states |
| `#E384FF` | MUI `secondary.main` | `SolutionTag` `color="secondary"` — then immediately overridden to `accent-400` on `SolutionTag.tsx:20` |
| `#865DFF` | raw hex | banned-user name/nickname, `banned_user.tsx:95-96` — appears nowhere else |
| `#f6d9ff` / `bg-purple-100` (`#f3e8ff`) | two pale lilacs | `SignupPage.tsx:27` and `Notification.tsx:97` use `purple-100`, everything else uses `accent-200` |

### 3.4 Colour classes that do not resolve to anything

These reference tokens that were never defined. Tailwind emits nothing, so the element silently inherits.

| Class | Location | What actually renders |
|---|---|---|
| `text-primary-0` | `settings/page.tsx:18`, `TopMenu.tsx:107` | Token is `--color-primary-00` (two zeros). The Settings `<h1>` and the "Sign in" pill inherit their parent's colour instead of white. **[CORRECTED]** — resolving this to the literal intent (`primary-00` = white) would put white on `bg-gray-100` (1.1:1) and on `!bg-accent-200` (1.2:1), i.e. make the Settings heading invisible. Phase 1 resolved both to `text-dark-900`, matching what already rendered |
| `text-black-500` | `DedicatedPostAuthor.tsx:219, 241` | No such Tailwind colour; inherits |
| `text-dark-800` | `CommentSection.tsx:89`, `ReplyItem.tsx:105` | Only `dark-900` exists |
| `text-dark-500` | `ReplyItem.tsx:108` | undefined |
| `text-dark-400` | `ReplyItem.tsx:112` | undefined |
| `group-hover:border-accent-300`, `group-hover:bg-accent-50` | `ReportPostDisplay.tsx:292`, `ReportAccountDisplay.tsx:218` | No `accent-50/300` — these hover states are **dead** |
| `hover:text-accent-500` | `ReportCommentDisplay.tsx:373` | dead hover |

---

## 4. Typography

### 4.1 Fonts in play

| Family | Loaded by | Applied by |
|---|---|---|
| **Afacad** (display) | `globals.css:2` `@import`, **and again** `layout.tsx:23-26` `<link>` | `.font-display` (`--font-display: "Afacad","Sarabun", sans-serif`), MUI `theme.ts:79-89` |
| **Sarabun** | `globals.css:1` `@import` | Only as fallback inside `--font-display`. Loaded on every page, effectively unused |
| **Geist Sans / Geist Mono** | `layout.tsx:9-10` `next/font/google` | Variables set on `<body>`, mapped to `--font-sans` / `--font-mono`. Reached only through the two accidental `font-sans` usages below |
| **Arial / Helvetica** | — | `globals.css:41` on `body`. **This is the default for anything without `font-display`** |

`font-display` is applied ad hoc in **37 files**. It is not on `<body>` or on any layout, so it must be re-declared on every subtree — and several subtrees miss it.

### 4.2 Confirmed font inconsistencies

| Where | Line | Problem |
|---|---|---|
| Feed heading "Recent Posts" | `FeedPageContent.tsx:280` | `font-sans` inside a `font-display` container → renders in **Geist**, while every post card below it is Afacad. The single most visible font break in the app. |
| Nav logo "Shiba" | `TopMenu.tsx:55` | `font-sans font-black` → **Geist**, while the "Sign in" pill 50px away (`:107`) is `font-display` → Afacad. Two fonts inside one 64px bar. |
| `/user/me` | `user/me/page.tsx:22` | `<p>Redirecting...</p>` — no `font-display` anywhere on the route → **Arial** |
| `/data-policy` | `data-policy/page.tsx:5` | Page wrapper has no `font-display`; `DataPolicy.tsx` only sets it on two inner divs (`:16`, `:22`). The close button (`:9`) and the card chrome are Arial |
| `/post/[postId]/[slug]` | `post/[postId]/[slug]/page.tsx:14` | Page wrapper has no `font-display`; it works only because `DedicatedPost.tsx:79` and `CommentSection.tsx:65` each re-declare it. Anything added at page level would be Arial |
| Profile page "NavBar" | `UserProfilePage.tsx:47-49` | A hard-coded placeholder `<div>` reading literally `NavBar`, `bg-dark-900`, no font class → Arial, and it renders a **second dark bar directly under the real `TopMenu`** |
| `Notification.tsx` | whole file | No `font-display`; inherits from `FeedPageContent` — correct today, but the component is font-less on its own |
| MUI surfaces | `theme.ts:127,149,157` | `fontFamily: 'Afacad'` is set on `MuiButton`, `MuiDialogTitle`, `MuiDialogContent` only. `MuiChip`, `MuiTab`, `MuiMenu` fall back to the theme's `fontFamily` list, which starts with Afacad but then lists `Inter` — a font that is never loaded |
| `TopSubjects.tsx:23,38,50`, `ProfileTabs.tsx:32,37` | | `fontFamily: 'inherit'` — inherits Afacad from the Tailwind parent, bypassing the MUI theme entirely. A third font-resolution path. |

### 4.3 Type scale in use

| Class | Count | Computed | Notes |
|---|---|---|---|
| `text-xs` | 29 | 0.75rem | |
| `text-sm` | 85 | 0.875rem | dominant body size |
| `text-base` | 7 | 1rem | |
| `text-lg` | 16 | 1.125rem | |
| `text-xl` | 25 | 1.25rem | |
| `text-2xl` | 15 | 1.5rem | |
| `text-3xl` | 11 | 1.875rem | modal titles |
| `text-4xl` | 4 | 2.25rem | |
| `text-5xl` | 3 | 3rem | |
| `text-6xl` | 5 | 3.75rem | "Edit your profile" / "Set up your profile" |
| **`text-m`** | **9** | — | **not a Tailwind class** |
| **`text-md`** | **6** | — | **not a Tailwind class** |
| **`text-l`** | **3** | — | **not a Tailwind class** |
| **`font-xl`** | **4** | — | **not a Tailwind class** |

**18 elements are sized by a class that does not exist** and silently fall back to inherited size:

`ReportPostModal.tsx:73,91,112` · `ReportCommentModal.tsx:80,97,117` · `ReportUserModal.tsx:74,92,112` · `CreatePostModal.tsx:218` · `EditPostModal.tsx:245` · `ProfileHeader.tsx:85` · `CookieConsentModal.tsx:44` · `FeedPageContent.tsx:215` · `GuestContinueButton.tsx:10` · `DeleteAccountModal.jsx:34` · `PremiumModal.tsx:40` · `CancelPremiumModal.tsx:40`
`font-xl`: `ReportCard.tsx:117,123` · `AccountReportCard.tsx:75,81`

This means all three report modals (post/comment/user) — which are otherwise byte-identical in layout — have **unstyled** body text and radio labels.

**Arbitrary sizes** bypassing the scale: `InfoBlock.tsx:14` `text-[2.25rem] md:text-[3rem] lg:text-[4rem]`, `:20` `text-[1.125rem] md:text-[1.25rem] lg:text-[1.5rem]`, `:21` `text-[1rem]`; `TopSubjects.tsx:7` `text-[1.5rem]`; `Shibameter.tsx:9` `text-[1rem]`; `BioCard.tsx:10` `text-[1rem]`.

**MUI parallel scale** (`theme.ts:90-121`): h1 2.5rem/600/1.2, h2 2rem/600/1.3, h3 1.5rem/600/1.4, h4 1.25rem/500/1.4, body1 1rem/1.5, body2 0.875rem/1.5. **None of these MUI variants are used anywhere in `src/`** — headings are all raw `<h1>/<h2>` with Tailwind classes. The MUI type scale is dead weight.

### 4.4 Weights & line-height

Weights: `font-semibold` 50 · `font-medium` 49 · `font-bold` 43 · `font-black` 8 · `font-normal` 2. No `font-light`/`font-thin`.

**Line-height is never set anywhere in Tailwind** except `InfoBlock.tsx:14` (`leading-none`). All line-heights come from Tailwind's per-size defaults or, for MUI components, from `theme.ts`. Long-form text (`DataPolicy.tsx:23-48`, `BioCard`, `PostContent`) has no explicit measure or leading.

---

## 5. Spacing & Layout

### 5.1 Spacing values in use

Padding — `py-2` (45), `p-6` (34), `px-4` (31), `px-3` (21), `py-1` (19), `p-2` (16), `p-4` (15), `px-2` (14), `px-5` (11), `p-5` (11), `py-8` (10), `px-6` (10), `py-4` (9), `py-3` (9), `pt-4` (8), `p-3` (7), `p-8` (6), `pt-20` (4), `px-10/12/15/17` (4 each), `p-1` (5), `p-0.5` (2), `p-[3%]` (2), `p-[0.5rem]` (2).

Margin — `mb-4` (39), `mt-2` (29), `mt-1` (26), `mb-2` (18), `mt-4` (17), `mb-6` (14), `mb-1` (13), `mx-auto` (11), `mr-2` (10), `mt-5` (9), `mb-8` (7), `mb-3` (7), `mt-6` (6), plus one-offs `mx-13`, `mb-9`, `mt-10`, `mt-20`, `mx-[25%]`, `mr-[2%]`, `mr-[20%]`, `ml-[26%]`, `m-8`, `m-[1rem]`, `m-[3rem]`.

Gap — `gap-2` (41), `gap-3` (34), `gap-4` (24), `gap-6` (16), `gap-1` (7), `gap-5` (4), `gap-8` (5), `gap-7` (1), `gap-10` (1).

Effectively the full 0–20 Tailwind ramp is in use with no convention: `mb-1/2/3/4/6/8/9/10` all appear.

### 5.2 Containers

| Container | Where | Value |
|---|---|---|
| `max-w-3xl mx-auto px-4 py-8 pt-20` | `admin/page.tsx:42`, `admin/reports/page.tsx:54`, `admin/banned-accounts/page.tsx:95`, `post/[postId]/[slug]/page.tsx:14` | The closest thing to a page shell — used by 4 of 13 routes |
| `max-w-6xl mx-auto` nested **inside** `max-w-3xl` | `admin/page.tsx:43`, `admin/reports/page.tsx:55`, `admin/banned-accounts/page.tsx:96` | Dead wrapper — the outer 3xl always wins |
| `max-w-4xl` | `ProfileHeader.tsx:46`, `ProfileContent.tsx:30`, `settings/page.tsx:17`, `PostsList.tsx:62`, `CommentsList.tsx:50` | Profile/settings width |
| `w-[65%]` | `ProfileForm.jsx:49`, `RegisterForm.tsx:83`, `EditProfilePage.tsx:27,42,57` | Percentage width, no max — on a 2560px display the form is 1664px wide |
| `%`-based feed grid | `FeedPageContent.tsx:255,267,276-278` | `w-[20%]` / `w-[25%]` / `ml-[26%]` / `mr-[20%]` / `mr-[2%]` — hand-tuned percentages, no grid, no breakpoints |
| Modal widths | `max-w-lg` (Create/Edit/Report post, Report comment/user), `max-w-sm` (Delete post), `max-w-md` (Delete account, Premium, Signup, Admin login), `max-w-2xs` (Cookie), `max-w-3xl` (Data policy), `w-[40%]` (Premium modals) | six different modal widths |

### 5.3 Pages with no container or page-level padding at all

| Route | File | State |
|---|---|---|
| `/` | `app/page.tsx:12` | `min-h-screen pt-16` only. No max-width, no horizontal padding. Layout is entirely percentage-positioned `fixed`/`ml-[26%]` inside `FeedPageContent` |
| `/user/[username]` | `app/user/[username]/page.tsx:14` | `min-h-screen` only — nothing else. Padding lives in `ProfileHeader` (`px-6 pt-8`) and `ProfileContent` (`mt-6 mb-10`), which disagree with each other |
| `/user/edit` | `app/user/edit/page.tsx:23` | `min-h-screen p-4`, then `EditProfilePage` adds `p-6`, then `ProfileForm` adds `p-5`, then the form adds `p-5` — **four nested paddings**, ~72px of inset before content |
| `/register` | `app/register/page.tsx:16` | `min-h-screen p-6 mt-6`, then `RegisterForm` `p-5`, then form `p-5` — three nested |
| `/signup` | `SignupPage.tsx:26` | `p-4` + card `p-8` |
| `/admin-login` | `AdminLoginPage.tsx:46` | `p-4 m-8` — margin *and* padding on the same element, for no reason |
| `/settings` | `settings/page.tsx:16-17` | See below |
| `/data-policy` | `data-policy/page.tsx:5` | No padding on the `<main>`; the card is `w-[90%] max-w-3xl` and vertically centred, so it can overflow the viewport on short screens (it's `max-h-[80%]` of an unconstrained flex parent) |

### 5.4 Whitespace / composition problems (confirmed)

**Settings page is nearly empty** — `src/app/settings/page.tsx:16-50`:
```
<main class="min-h-screen w-full flex justify-center items-center bg-gray-100 font-display">
  <div class="w-full max-w-4xl min-h-screen flex flex-col gap-6 md:gap-8 items-stretch justify-center">
```
The outer `<main>` is `min-h-screen` *and* vertically centres a child that is itself `min-h-screen`. Three full-width `p-4 text-2xl` buttons plus one `<h1>` are stretched across a 896px column and vertically centred in a 100vh box — roughly 250px of content in ~1000px of space, with the fixed 64px nav overlapping the top (the page has no `pt-16`, unlike `/`). `gap-6 md:gap-8` is the page's only breakpoint. `LogOut.tsx:56` then uses `mx-[25%] w-[50%]`, so the logout button is half the width of the three buttons above it — a broken rhythm in a 4-item stack.

**Profile form is one large tinted block** — `ProfileForm.jsx:55` / `RegisterForm.tsx:90`:
```
class="bg-[var(--color-accent-200)] p-5 rounded-3xl min-h-[700px] flex flex-col gap-5"
```
A single `#f6d9ff` slab with a hard `min-h-[700px]` floor, holding every field with a flat `gap-5` — no grouping, no section headings, no cards, no visual hierarchy between "identity" fields and "preferences" fields. The action row is pushed to the bottom by `mt-auto` (`:136`), so on a short form the Delete/Save buttons float ~300px below the last field. Inside it, `ProfilePicture` sits in a `w-1/3` column with the class `h-6rem` (`ProfileForm.jsx:131`) — **not a valid Tailwind class**, so the intended height never applies.

**Profile content panel** — `ProfileContent.tsx:30`: `class="w-full max-w-4xl pt-4 pl-8 pr-8 pb-8 w-[100%] bg-accent-400 rounded-xl"`. `w-full` and `w-[100%]` are both present (duplicate); `pl-8 pr-8` instead of `px-8`; and the whole tab panel sits on solid `#ab72c1` — which is why `PostsList`/`CommentsList` empty states use `text-white` and skeletons use `bg-white/10`.

**Post detail page** — `post/[postId]/[slug]/page.tsx:14-17`: `DedicatedPostContainer` and `CommentContainer` are siblings with no wrapper spacing; the gap comes from `CommentSection.tsx:65` `mt-5`. If the comment section errors, `CommentContainer.tsx:51-52` renders a `h-200` (800px) centred box — a fixed 800px of empty space below the post.

**Feed** — `FeedPageContent.tsx:266-282`: both sidebars are `fixed top-16 h-full` while the main column is a normal-flow `<main>` offset by `ml-[26%]`. The left sidebar is `w-[25%]` but offset `left-1`, so the 1% gap is unaccounted for; the right drawer is `w-[20%]` and the main column shifts by exactly `mr-[20%]` — no allowance for the drawer's `border-l` or `p-2`.

---

## 6. Radius, Shadows, Borders

### 6.1 Border radius — 9 distinct values

| Value | Count | Where it dominates |
|---|---|---|
| `rounded-full` | 62 | avatars, icon buttons, pills, pagination |
| `rounded-md` (6px) | 44 | modal buttons, inputs, tags |
| `rounded-lg` (8px) | 35 | admin cards, report cards, inputs |
| `rounded` (4px) | 24 | notifications, skeleton bars, form buttons |
| `rounded-2xl` (16px) | 27 | post cards, comment cards, report previews |
| `rounded-xl` (12px) | 22 | modals, form inputs, dropdowns |
| `rounded-3xl` (24px) | 7 | profile-form slab, banned-user card, search dropdown |
| `rounded-[10px]` | 1 | `Shibameter.tsx:7` — the only arbitrary radius |
| MUI `borderRadius` | 4 | `theme.ts:129` `12px` (Button), `:137` `24px` (Dialog), `:172` `12px` (Card), `:181` `8px` (TextField) |

Cards alone use four radii: `rounded-2xl` (`Post.tsx:125`), `rounded-3xl` (`banned_user.tsx:83`), `rounded-lg` (`ReportCard.tsx:18`), `rounded-xl` (`PremiumModal.tsx:37`).
Buttons use four: `rounded-md`, `rounded-lg`, `rounded` (`ProfileForm.jsx:140,148`), `rounded-full` (`StatusContainer.tsx:6`).

### 6.2 Shadows — 7 distinct

| Value | Count | Where |
|---|---|---|
| `shadow-lg` | 28 | post cards, modals, dropdowns |
| `shadow-sm` | 16 | inputs, admin stat cards |
| `shadow-xl` | 9 | all six hand-rolled modals |
| `shadow-md` | 2 | `TopMenu.tsx:51`, `EditProfileButton.tsx:20` |
| `hover:shadow-2xl/15` | 3 | `Post.tsx:125`, `CommentSection.tsx:65`, `Comment.tsx:228` |
| `0 4px 20px rgba(0,0,0,0.1)` | 1 | `theme.ts:139` — MUI Dialog |
| `0 2px 12px rgba(0,0,0,0.08)` | 1 | `theme.ts:173` — MUI Card |

The MUI `Dialog` shadow and the Tailwind `shadow-xl` on hand-rolled modals are visually different, and both kinds of modal appear in the same app (`Comment.tsx:332` MUI Dialog vs `DeletePostModal.tsx:15` Tailwind).

`hover:shadow-2xl/15` is applied to `Post` cards but **not** to `DedicatedPost` (`DedicatedPost.tsx:79`) — the same card component family, one hovers, one doesn't.

### 6.3 Borders

`border-gray-300` (23) · `border-gray-200` (6) · `border-gray-400` (3) · `border-gray-100` (3) · `border-transparent` (3) · `border-indigo-500` (7, focus) · `border-purple-600` (3) · `border-purple-700` (1) · `border-black` (1, `MoreActionsMenu.tsx:62`) · `border-blue-200`/`border-amber-200`/`border-red-200` (info banners) · `border-accent-400` (4) · `border-accent-600` (2) · `border-l-2 border-gray-200` (reply threading, `ReplyItem.tsx:83`) · `border-gray-200/80` (`Post.tsx:154`) · bare `border` with no colour (`Comment.tsx:139` `border-t`, `PostHeader.tsx:193` `border-t`, `QuickStat.tsx:5`, `CommentContent.tsx:18`).

`MoreActionsMenu.tsx:62` is the only `border-black` in the codebase — every other popover uses `border-gray-200`/`gray-300` or no border.

---

## 7. Components

### 7.1 Inventory

| Component | Shared definition | Variants found | Notes |
|---|---|---|---|
| **Button** | **none** | 14+ inline variants (see 7.2) | The single largest gap. No `<Button>` primitive exists |
| **Text input** | `edit_profile/TextInput.jsx` | 3 more inline styles | `TextInput`: `bg-white border rounded-xl px-3 py-3` + red/blue focus ring. Modals use `rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 px-2` (`CreatePostModal.tsx:139`). Admin login uses `px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500` (`AdminLoginPage.tsx:70`). Search uses `rounded-full pl-5 pr-12 py-2` (`SearchComponent.tsx:154`) |
| **Textarea** | `edit_profile/TextArea.jsx` | 3 more | `TextArea`: `rounded-xl px-3 py-3 min-h-[80px]`. Modals: `rounded-md ... px-2` rows=5. `CommentEditor.tsx:155`: `border-2 border-transparent rounded-md bg-accent-200 min-h-[100px]`. `CreateComment.tsx:131`: borderless `bg-transparent` inside an `accent-200` pill |
| **Select / dropdown** | `edit_profile/SelectDropdown.jsx` | + `post/MultiSelectSubject.tsx` (near-duplicate) + `SearchComponent` tag popover | Three independent multi-select implementations. `SelectDropdown` is `rounded-xl` white with blue selected rows; `MultiSelectSubject` is `rounded-md` with `bg-indigo-50` selected rows and a `✓` glyph |
| **Card** | none | `Post`(2xl/shadow-lg/p-6) · `DedicatedPost`(same minus hover) · `ReportCard`(lg/shadow-lg/p-6) · `banned_user`(3xl/shadow-xl/p-10) · `QuickStat`(lg/shadow-sm/p-6/border) · report previews(2xl/shadow-lg/p-6) | 6 card shapes |
| **Tag / chip** | none | Post tags: `px-2.5 py-1 rounded-md text-white font-bold` (`PostHeader.tsx:137`) · Search tags: `pl-2.5 pr-1 py-1 rounded-lg` (`SearchComponent.tsx:226`) · Subject chips: `px-3 py-1 rounded-full text-sm` (`SubjectTags.jsx:40`) · Compact: `px-2 py-1 rounded-full text-xs` (`CompactSubjectTags.jsx:40`) · MultiSelect: `bg-gray-200 px-2.5 py-0.5 rounded-full` (`MultiSelectSubject.tsx:51`) · MUI `Chip` in `SolutionTag.tsx` and `TopSubjects.tsx` | 6 chip styles for one concept, and the *same subject* renders in a different colour depending on which one |
| **Modal** | none | **Tailwind hand-rolled (7):** `CreatePostModal`, `EditPostModal`, `DeletePostModal`, `ReportPostModal`, `ReportCommentModal`, `ReportUserModal`, `DeleteAccountModal`, `PremiumModal`, `CancelPremiumModal`, `CookieConsentModal`. **MUI `Dialog` (2):** `Comment.tsx:332`, `ReplyItem.tsx:173` | Two entirely different modal systems. Backdrops differ: `backdrop-blur-sm backdrop-brightness-50` (report/post modals) vs `bg-black/40` (premium) vs `bg-dark-900/90` (delete account) vs MUI default scrim |
| **Avatar** | `profile_header/ProfilePic.tsx` (MUI `Avatar` + SSR placeholder) | Raw `<img className="w-10 h-10 rounded-full">` in `PostAuthor.tsx:204`, `TopComment.tsx:73`, `Comment.tsx:144`, `ProfileComment.tsx:93`, `FeedPageContent.tsx:221`, `DedicatedPostAuthor.tsx:212`; `w-8 h-8` in `ReplyItem.tsx:95`; `w-25 h-25` in `banned_user.tsx:89`; MUI `Avatar` directly in `TopMenu.tsx:99`, `ReportPostDisplay.tsx:294`, `ReportCommentDisplay.tsx:334`, `ReportAccountDisplay.tsx:199` | `ProfilePic` exists but is used in only 2 places. Fallback avatar path is inconsistent: `/image/DefaultAvatar.png` (most) vs `/default-avatar.png` (`TopMenu.tsx:100`, `ReportPostDisplay.tsx:296` — **this file does not exist in `public/`**; both fixed in Phase 1, `3756d0d`) |
| **Nav** | `topMenu/TopMenu.tsx` | + hard-coded fake "NavBar" div at `UserProfilePage.tsx:47` | The profile route renders a second, non-functional bar under the real one |
| **Tabs** | `ProfileTabs.tsx` (MUI `Tabs`) | + `ContentTypeContainer.tsx` (Tailwind underline buttons) + `StatusContainer.tsx` (Tailwind pills) | Three tab patterns |
| **Pagination** | `profile_content/Pagination.tsx` | — | The one properly shared, properly styled control in the codebase |
| **Spinner** | none | `border-b-2 border-accent-600 h-4 w-4` (`CommentSection.tsx:82`, `Comment.tsx:255`) · `border-b-2 border-purple-600 h-12 w-12` (`AdminProtectedRoute.tsx:33`) · `border-2 border-white border-t-transparent w-4 h-4` (`DeleteAccountModal.jsx:55`) | 3 spinner styles, 3 colours, 2 border techniques |
| **Skeleton** | none | `ProfileHeaderSkeleton`, `ProfileContentSkeleton`, inline in `PostsList.tsx:67-83`, inline in `CommentsList.tsx:62-67` | 4 skeleton implementations, 2 colour schemes (`bg-neutral-200/40` vs `bg-white/10`) |
| **Empty state** | none | `text-white text-lg` (`PostsList.tsx:98`) · `text-white text-xl` (`CommentsList.tsx:82`) · `text-yellow-400 text-lg` (`PostsList.tsx:55`) · `text-center mt-10` (`FeedPageContent.tsx:176`) · `text-gray-500 text-center` (`ReportList.tsx:34`) | 5 styles |
| **Error state** | `error/ShibaError.tsx` | + inline in `PostsList.tsx:86-95`, `CommentsList.tsx:70-79`, `FeedPageContent.tsx:174` | `ShibaError` (spinning logo + `animate-pulse` text) is used only on `/user/[username]` and `/user/edit` |

### 7.2 Button variants (all inline, none shared)

| Style | Location |
|---|---|
| `bg-accent-600 text-white px-4 py-2 rounded` | `ProfileForm.jsx:148`, `RegisterForm.tsx:219` |
| `bg-purple-700 px-8 py-2 rounded-md font-semibold hover:bg-purple-600` | `CreatePostModal.tsx:228`, `EditPostModal.tsx:255` |
| `bg-purple-600 w-full py-3 px-4 rounded-lg hover:bg-purple-700` | `AdminLoginPage.tsx:98` |
| `bg-red-600 px-6 py-2 rounded-md font-semibold hover:bg-red-700` | 4 report modals + `DeletePostModal.tsx:47` |
| `bg-red-500 px-10 sm:px-12 md:px-15 lg:px-17 py-2 rounded-lg font-black` | `ReportCard.tsx:117`, `AccountReportCard.tsx:75` |
| `bg-green-500 px-10 … rounded-lg font-black` (**no `py`** — shorter than its sibling) | `ReportCard.tsx:123`, `AccountReportCard.tsx:81` |
| `bg-accent-400 px-4 py-2 rounded-md hover:bg-accent-600` | `PremiumModal.tsx:63` |
| `bg-accent-400/80 w-full p-4 rounded-md text-2xl` | `settings/page.tsx:35` |
| `bg-amber-400/70 w-full p-4 rounded-md text-2xl text-amber-800` | `settings/page.tsx:42` |
| `bg-red-600 mx-[25%] w-[50%] p-4 rounded-md text-2xl` | `LogOut.tsx:56` |
| `bg-[#FF3B30] py-1 px-2 rounded-lg text-xl` | `banned_user.tsx:100` |
| `px-4 py-2 rounded-full` pill | `StatusContainer.tsx:6` |
| `bg-gray-100 px-4 py-2 rounded-md` (cancel) | `PremiumModal.tsx:57` |
| `bg-accent-200/60 px-4 py-2 rounded-md` (cancel) | `CancelPremiumModal.tsx:46` |
| MUI `<Button variant="contained">` `sx={{fontSize:24, padding:'8px 24px'}}` | `Comment.tsx:357-377` |
| MUI `<Button variant="contained" size="large">` `sx={{flex:1,maxWidth:'10ch'}}` | `CommentEditor.tsx:248-267` |

**Cancel/secondary buttons are missing entirely** in five modals: `DeletePostModal` (only a Delete button; cancel is the ✕), `ReportPostModal`, `ReportCommentModal`, `ReportUserModal`, `CreatePostModal`, `EditPostModal` — all have `justify-end` rows with a single button and a leftover `gap-4`.

### 7.3 Components re-implemented inline instead of shared

| Duplicated thing | Copies |
|---|---|
| Subject/tag colour map | 4 (`colorConfig.js`, `PostHeader.tsx`, `SearchComponent.tsx`, `RegisterForm.tsx`) |
| `formatTimeAgo` | 3 (`comment/utils.ts`, `Notification.tsx:15-65`, `TopComment.tsx:19-68` — and the `TopComment` copy lacks the UTC normalisation the other two have) |
| Report modal (identical markup, only the heading & reason list differ) | 3 (`ReportPostModal`, `ReportCommentModal`, `ReportUserModal`) |
| Modal close ✕ SVG (identical 6-line path) | 6 (`CreatePostModal:122`, `EditPostModal:117`, `DeletePostModal:26`, `ReportPostModal:67`, `ReportCommentModal:74`, `ReportUserModal:68`) |
| Like/dislike thumb SVG paths | 3 (`PostAuthor`, `DedicatedPostAuthor`, `TopComment`) |
| Cloudinary upload helper | 3 (`utils/uploadImage.ts`, `CreatePostModal.tsx:42-65`, `CreateComment.tsx:15-32`) — with **two different cloud accounts**: `dkhggwcub` (`CreatePostModal.tsx:29`) vs `dvlsunwrx` (`CreateComment.tsx:2`) |
| Avatar `<img>` | 8 raw copies vs the shared `ProfilePic` |
| Retry button (`bg-red-500 rounded-lg`) | 2 (`PostsList.tsx:89`, `CommentsList.tsx:73`) |
| "Loading…" text block | 6 distinct implementations (§8) |
| `ViewRepliesButton.tsx` | **Defined but never imported.** `Comment.tsx:317` hand-rolls a `text-purple-300 hover:text-blue-700` link instead — a purple→blue hover that appears nowhere else in the app |

---

## 8. Loading States

| Route / area | What renders while loading | File:line | Matches final layout? |
|---|---|---|---|
| `/` — feed posts | `<p class="text-center mt-10">Loading posts...</p>` | `FeedPageContent.tsx:173` | **No** — plain text where a stack of tall cards will appear |
| `/` — saved posts | `<p class="text-center mt-4">Loading saved posts...</p>` | `FeedPageContent.tsx:195` | No |
| `/` — notifications | `<p class="text-center mt-4">Loading notifications...</p>` | `FeedPageContent.tsx:236` | No |
| `/` — search results | `<div class="px-5 py-4 text-gray-500 text-sm">Searching…</div>` (note: ellipsis char, not `...`) | `SearchComponent.tsx:282, 323` | Roughly |
| `/post/[id]/[slug]` — post body | **nothing** — server component with no `loading.tsx` and no Suspense boundary | `DedicatedPostContainer.tsx:81` | n/a — blank until server responds |
| `/post/[id]/[slug]` — comments | `<div class="mt-5 h-200 flex items-center justify-center text-xl animate-pulse">Loading comment section...</div>` | `CommentContainer.tsx:51` | **No** — an 800px-tall empty box with one centred pulsing line |
| `/post` — comment submit | inline spinner + "Creating comment..." | `CommentSection.tsx:80-85` | ok |
| `/user/[username]` — header | `ProfileHeaderSkeleton` — proper silhouette | `ProfileHeaderSkeleton.tsx` | **Close, but off**: skeleton avatar is a fixed `144px` while the real `ProfilePic` is responsive `112/144/160`; the skeleton's right column is `w-64` while the real one has no fixed width; skeleton bio block is `p-[3%]` + `h-16`, real `BioCard` is `min-h-[5rem] max-h-[12rem]` |
| `/user/[username]` — content | `ProfileContentSkeleton` — two grey bars | `ProfileContentSkeleton.tsx:6,8` | **No.** Panel bg is `bg-neutral-200/40` but the real panel is `bg-accent-400` (`#ab72c1`); the bars are `bg-neutral-200/0` — **fully transparent** — so the skeleton is an empty 820px box with an invisible `animate-pulse`. It also adds `px-8` that the real `ProfileContent` doesn't have |
| `/user/[username]` — posts tab | 3× card skeleton, `bg-white/10`, avatar + 2 lines + 3 bars, `min-h-[200px]` | `PostsList.tsx:67-83` | **Partly.** Real `Post` is `min-h-[30vh]`, has a tag row at top and a top-comment row at the bottom — neither is in the skeleton, and the skeleton puts the avatar first while the real card puts tags first |
| `/user/[username]` — comments tab | 3× `min-h-[12rem]` box with 2 bars | `CommentsList.tsx:62-67` | **No** — real `ProfileComment` has a title, avatar, name row, body and a like/dislike row |
| `/user/edit` | Full page chrome + `<div class="text-lg text-neutral-600">Loading your profile...</div>` centred in the `min-h-[700px]` tinted slab | `EditProfilePage.tsx:26-36` | Shell matches, contents don't |
| `/user/me` | `<p>Redirecting...</p>` — unstyled, Arial | `user/me/page.tsx:22` | n/a. `loading` state is initialised `true` and never set `false`, so this is permanent until navigation |
| `/settings` | disabled button reading "Getting user information..." with `cursor-wait` | `settings/page.tsx:26-31` | ok — the only place `cursor-wait` is used |
| `/admin/*` (auth gate) | centred `h-12 w-12 border-b-2 border-purple-600` spinner + "Checking authentication..." | `AdminProtectedRoute.tsx:29-38` | n/a |
| `/admin/reports` | `<p class="text-gray-500 text-center">Loading reports...</p>` in a white card | `ReportList.tsx:29-31` | Roughly |
| `/admin/banned-accounts` | **nothing** — `isLoadingBanned` is set and tracked but **never rendered**; the list just appears | `admin/banned-accounts/page.tsx:46, 110` | No |
| Report card previews | `<p class="text-center text-sm text-gray-500">Loading post preview...</p>` in a `rounded-2xl` card | `ReportPostDisplay.tsx:244`, `ReportCommentDisplay.tsx:304`, `ReportAccountDisplay.tsx:161` | Shell matches |
| `TopMenu` while auth resolves | `return null` — **the entire nav bar disappears** | `TopMenu.tsx:48` | **No** — causes a 64px content jump on every page load |

**Summary: 6 distinct loading idioms** — plain text (7×), text + `animate-pulse` (3×), spinner + text (3×), silhouette skeleton (2×), transparent/broken skeleton (1×), nothing at all (3×).

---

## 9. Animations & Transitions

| Utility | Count | Notes |
|---|---|---|
| `transition-colors` | 48 | the de-facto default |
| `transition-all` | 10 | `settings/page.tsx:20,23,35,42`, `LogOut.tsx:56`, `SearchComponent.tsx:233`, `Comment.tsx:165`, `ProfileComment.tsx:117` |
| `transition-transform` | 4 | `CreatePostButton.tsx:11`, `SelectDropdown.jsx:120,140` |
| `transition` (bare) | 4 | `SearchComponent.tsx:253,301,340`, `CommentEditor.tsx:155` |
| `transition-opacity` | 1 | `CookieConsentModal.tsx:11` |
| `duration-300` | 11 · `duration-200` | 8 · `duration-500` 2 | three timings, no convention |
| `ease-in-out` 3 · `ease-out` 1 | | 96 of 100 transitions use the implicit default easing |
| `animate-pulse` | 9 | skeletons + `ShibaError` text + `CommentContainer` loading text |
| `animate-spin` | 5 | 3 spinners + `ShibaError.tsx:6` `hover:animate-spin` on the logo |
| CSS `@keyframes` | **0** | no custom animation anywhere |
| MUI transition | 1 | `theme.ts:189-193` — `MuiIconButton` scales to 1.1 on hover |

### 9.1 Inconsistencies

- **Identical elements, different animation.** `SolutionTag` gets a 300ms opacity+scale reveal in `Comment.tsx:165` and `ProfileComment.tsx:117`, but is rendered raw with no transition in `ReplyItem.tsx:118`.
- **Hover-lift on one card, not its twin.** `Post.tsx:125` has `hover:shadow-2xl/15`; `DedicatedPost.tsx:79` (same card, detail page) has none.
- **Only one button in the app scales on hover** — the FAB (`CreatePostButton.tsx:11` `hover:scale-110`). Every other button changes background only. Meanwhile *every* MUI `IconButton` scales via `theme.ts:191` — so comment like/dislike/reply/more buttons grow on hover while post like/dislike buttons (plain `<button>`, `PostAuthor.tsx:219`) do not.
- **`transition-colors` on a size/position change.** `settings/page.tsx:20,23,35,42` use `transition-all duration-300` on elements whose only change is background — `transition-colors` would do; conversely `SearchComponent.tsx:233` uses `transition-all` on an opacity change.
- **`CookieConsentModal.tsx:11,17`** is the only component with a coordinated enter animation (opacity + `-translate-x-full`, 500ms). Every other modal appears instantly with no transition and no backdrop fade.
- **Interactive elements with no transition at all:** `PostHeader` dropdown items (`:162,178,195,208`), `MultiSelectSubject` options (`:68`), `SelectDropdown` options (`:167`), `Notification` items (`:97`), `MoreActionsMenu` items (`:64,71,80,87`), `TopComment` like/dislike (`:83,90`), `Comment.tsx:317` view-replies link, `LikeButton`/`DislikeButton`/`ReplyButton` background swaps (inline `style`, so no transition applies).
- **`animate-pulse` on a fully transparent element** — `ProfileContentSkeleton.tsx:6,8` (`bg-neutral-200/0`): the animation runs on something invisible.

---

## 10. Interaction Affordances

### 10.1 Missing `cursor-pointer`

Tailwind v4's preflight does **not** set `cursor: pointer` on `<button>` (verified in `node_modules/tailwindcss/preflight.css` — no `cursor:` rule at all). The browser UA default for `<button>` is `default`. So **every `<button>` without an explicit `cursor-pointer` shows an arrow.**

**44 `<button>` elements lack it:**

`settings/page.tsx:28` · `PostAuthor.tsx:215, 238` · `DedicatedPostAuthor.tsx:220, 242` · `DeletePostModal.tsx:19, 43` · `EditPostModal.tsx:111, 204, 252` · `PostHeader.tsx:146, 162, 178, 195, 208` · `ReportPostModal.tsx:61, 118` · `CreatePostModal.tsx:116, 225` · `TopComment.tsx:83, 90` · `CreatePostButton.tsx:9` · `ReportCommentModal.tsx:68, 123` · `Comment.tsx:274, 283, 317` · `CreateComment.tsx:196` · `CommentEditor.tsx:202, 219` · `CompactSubjectTags.jsx:43` · `AdminLoginPage.tsx:95` · `SearchComponent.tsx:156, 180, 229, 244, 265` · `PostsList.tsx:89` · `CommentsList.tsx:73` · `ReportUserModal.tsx:62, 118` · `ProfileHeader.tsx:83, 98` · `EditProfileButton.tsx:18`

Highest-impact of these: the **floating Create-Post FAB** (`CreatePostButton.tsx:9`), **every modal submit button** (Create/Edit/Delete post, all 3 report modals), **every post like/dislike button** (`PostAuthor.tsx:215,238`), the **post ⋮ menu and all its items** (`PostHeader.tsx:146-208`), the **admin login submit**, and the **profile Edit-Profile pencil** (`EditProfileButton.tsx:18`).

**6 non-button clickable elements lack it:**

| Element | File:line | Note |
|---|---|---|
| `<div type="button" onClick>` — the education & subjects control | `SelectDropdown.jsx:108` | The primary control on `/user/edit` and `/register`. Also an invalid `type` attribute on a `div` |
| Post header row (`onClick={stopAll}`) | `PostHeader.tsx:123` | Intentional swallow, but reads as clickable |
| Popover backdrop | `MoreActionsMenu.tsx:56` | dismiss-on-click, no affordance |
| Delete-account backdrop | `DeleteAccountModal.jsx:13` | |
| Premium modal backdrop | `PremiumModal.tsx:36` | |
| Cancel-premium backdrop | `CancelPremiumModal.tsx:37` | |

**Inverse problem:** `TopComment.tsx:83, 90` put `cursor-pointer` on the inner `<svg>` rather than the `<button>`, so the pointer appears only over the 16px glyph — **and those two buttons have no `onClick` at all**: they are decorative, non-functional like/dislike controls that look interactive.

### 10.2 Missing hover / focus / active / disabled

| State | Coverage |
|---|---|
| **`:hover`** | Good on buttons and links (~90 usages). Missing on: `Notification.tsx:97` non-clickable variant (correctly), `MultiSelectSubject.tsx:51` selected chips, `SubjectTags.jsx:40` chips, `Shibameter.tsx:7`, `BioCard.tsx:9`, `QuickStat.tsx:5` cards, `TopComment.tsx:73` avatar |
| **`:focus` / `:focus-visible`** | **Only 28 usages, all of them on inputs/textareas/radios.** Not a single `<button>` or `<a>` in the codebase has a focus style. `SearchComponent.tsx:154,178` and `ReportPostDisplay.tsx:282`, `ReportAccountDisplay.tsx:194` use `focus:outline-none` **without a replacement ring** — actively removing the browser default. `focus-visible:` is used **zero** times |
| **`:active`** | 4 usages total, all `active:bg-black/10` on post like/dislike (`PostAuthor.tsx:219,242`, `DedicatedPostAuthor.tsx:224,246`). Nothing else in the app has a pressed state |
| **`:disabled`** | 12 files. Inconsistent treatment: `disabled:opacity-50` (most), `disabled:opacity-60` (`PostAuthor.tsx:219`), `disabled:bg-red-400` (`LogOut.tsx:56`), `opacity-50 cursor-not-allowed` via template string (`ProfileForm.jsx:149`, `RegisterForm.tsx:223`), `cursor-wait` (`settings/page.tsx:28`). Several disabled buttons have **no visual change at all**: `ReportCard.tsx` buttons, `SearchComponent` buttons, `CreateComment.tsx:142` (only the parent gets `opacity-50 pointer-events-none` at `:111`) |
| **Focus ring colour** | 4 different: `indigo-500` (12×), `purple-500` (3×), `blue-500` (3×), `red-500` (1×) — none of which is a brand token |
| **Keyboard access** | `SelectDropdown.jsx:108`, `MultiSelectSubject.tsx:43`, and all 6 modal backdrops are `<div onClick>` with no `role`, `tabIndex`, or key handler — not reachable by keyboard |

---

## 11. Responsive

**Only 13 of 96 component/page files contain a single breakpoint.** 83 files have none.

| File | Breakpoints used | What adapts |
|---|---|---|
| `ProfileHeaderSkeleton.tsx` | 6 | mirrors `ProfileHeader` |
| `CookieConsentModal.tsx` | 6 | `sm:text-*` on every text node |
| `ProfileHeader.tsx` | 5 | `md:flex-row`, `md:gap-8`, `hidden md:flex` right column, `md:hidden` bottom column |
| `ReportCard.tsx` / `AccountReportCard.tsx` | 3 each | `sm:flex-row` reason row, `sm:px-12 md:px-15 lg:px-17` button padding (`px-15`/`px-17` are not valid Tailwind steps) |
| `InfoBlock.tsx` | 3 | `md:text-[3rem] lg:text-[4rem]` display name |
| `banned_user.tsx` | 2 | `md:justify-end` |
| `ProfileContentSkeleton.tsx` | 1 | `md:h-[960px]` |
| `MultiSelectSubject.tsx` | 1 | `sm:text-sm` |
| `DeleteAccountModal.jsx` | 1 | `md:text-3xl` |
| `QuickStat.tsx` | 1 | `md:grid-cols-4` (component is **never used** — `admin/page.tsx` imports it but doesn't render it) |
| `AdminButtons.tsx` | 1 | `md:grid-cols-2` |
| `settings/page.tsx` | 1 | `md:gap-8` |

### Routes with effectively no responsive handling

| Route | Consequence at ≤768px |
|---|---|
| `/` (feed) | `FeedPageContent.tsx:255,267,276` — `w-[20%]` / `w-[25%]` / `ml-[26%]` are unconditional. On mobile the feed column is ~49% of a 375px screen (~184px) with two fixed sidebars overlapping it. **Unusable on phones** |
| `/user/edit`, `/register` | `w-[65%]` unconditional (`ProfileForm.jsx:49`, `RegisterForm.tsx:83`); the `flex gap-6` field/avatar split (`ProfileForm.jsx:101`, `w-2/3` + `w-1/3`) never stacks; `min-h-[700px]` is fixed |
| `/post/[id]/[slug]` | `max-w-3xl px-4` — degrades acceptably by accident, but the comment tree's `marginLeft: level*24px` (`ReplyItem.tsx:89`) is unconditional and eats 72px at depth 3 |
| `/settings` | Only `md:gap-8`. `LogOut`'s `mx-[25%] w-[50%]` holds at all widths |
| `/admin`, `/admin/reports`, `/admin/banned-accounts` | `max-w-3xl px-4` container is fine; `banned_user.tsx:83` `p-10` + `w-25 h-25` avatar and the `text-4xl` nickname don't reduce |
| `/data-policy` | `w-[90%] max-w-3xl` — the one page that scales by default |
| All 10 modals | Fixed `max-w-*` with `p-6`/`p-8`; none has a mobile treatment (no full-screen sheet, no `sm:` variants). `PremiumModal`/`CancelPremiumModal` use `w-[40%] min-w-[300px]` — at 375px the `min-w` wins and the modal touches both edges |
| `SearchComponent` dropdown | `absolute w-full` inside a `w-[25%]` fixed sidebar — on mobile the results panel is ~90px wide |

No `container` utility, no `@media` queries in CSS, no `dvh`/`svh` units, no `prefers-reduced-motion` handling anywhere.

---

## 12. Inconsistency Report

Ranked worst → least. "Effort" is a rough estimate for a fix, assuming the redesign will introduce shared primitives.

| # | Issue | Severity | Affected files | Effort |
|---|---|---|---|---|
| 1 | **No shared Button/Input/Card/Modal primitives.** 14 button styles, 4 input styles, 6 card shapes, 2 modal systems (Tailwind + MUI Dialog), 6 chip styles — all inline | **High** | ~45 files; worst: all 10 modals, `settings/page.tsx`, `ReportCard.tsx`, `ProfileForm.jsx` | L (2–4 d) |
| 2 | **Two competing design systems.** Tailwind tokens in `globals.css` and MUI `theme.ts` describe the same brand with different values and never agree; MUI's entire type scale is dead code | **High** | `globals.css`, `theme/theme.ts` + 14 MUI-consuming components | M–L (1–2 d) |
| 3 | **Feed layout is unusable below ~1024px.** Hard-coded `w-[20%]`/`w-[25%]`/`ml-[26%]`/`mr-[20%]` with zero breakpoints on the app's primary route | **High** | `FeedPageContent.tsx:250-283`, `app/page.tsx:12` | M (0.5–1 d) |
| 4 | **44 buttons + 6 clickable divs show an arrow cursor.** Tailwind v4 gives `<button>` no pointer; includes the FAB, every modal submit, post like/dislike, the ⋮ menu, and the edit-profile dropdown | **High** | 27 files (full list §10.1) | S (2–4 h, mostly mechanical — or one preflight rule) |
| 5 | **18 elements sized with non-existent classes** (`text-m`/`text-md`/`text-l`/`font-xl`), incl. all body copy and radio labels in all 3 report modals | **High** | `ReportPostModal`, `ReportCommentModal`, `ReportUserModal`, `CreatePostModal:218`, `EditPostModal:245`, `ProfileHeader:85`, `CookieConsentModal:44`, `FeedPageContent:215`, `GuestContinueButton:10`, `DeleteAccountModal:34`, `PremiumModal:40`, `CancelPremiumModal:40`, `ReportCard:117,123`, `AccountReportCard:75,81` | S (1–2 h) |
| 6 | **Font breaks between pages/components.** `body` is Arial; `font-display` re-declared in 37 files and missed on `/user/me` and `/data-policy` chrome; two accidental Geist usages in the nav and the feed's main `<h1>` | **High** | `globals.css:41`, `layout.tsx`, `FeedPageContent.tsx:280`, `TopMenu.tsx:55`, `user/me/page.tsx:22`, `data-policy/page.tsx:5`, `DataPolicy.tsx:6-9` | S–M (3–5 h) |
| 7 | **Loading states: 6 different idioms across 13 routes**, incl. 3 routes with none at all and a nav bar that vanishes (`TopMenu.tsx:48`) | **High** | Full table §8 | M (1 d) |
| 8 | **Broken/mismatched skeletons.** `ProfileContentSkeleton` bars are `bg-neutral-200/0` (invisible) on a `bg-neutral-200/40` panel when the real panel is `bg-accent-400`; post/comment skeletons don't match their real cards | **High** | `ProfileContentSkeleton.tsx:4,6,8`, `PostsList.tsx:67-83`, `CommentsList.tsx:62-67`, `ProfileHeaderSkeleton.tsx:7,24` | M (0.5 d) |
| 9 | **Settings page composition.** ~250px of content vertically centred in 100vh, `min-h-screen` nested inside `min-h-screen`, no `pt-16` so the fixed nav overlaps, logout button half the width of its siblings | **High** | `app/settings/page.tsx:16-50`, `LogOut.tsx:56` | S (2–3 h) |
| 10 | **Profile/register form is one 700px tinted slab.** No grouping, flat `gap-5`, `mt-auto` pushes actions far below the last field, 4 nested paddings on `/user/edit`, invalid `h-6rem` on the avatar column | **High** | `ProfileForm.jsx:49-157`, `RegisterForm.tsx:83-234`, `EditProfilePage.tsx:26-84`, `app/user/edit/page.tsx:23` | M (0.5–1 d) |
| 11 | **7 near-identical purples + 2 pale lilacs** used interchangeably for "primary" | **Med** | §3.3 table — 12 files | M (0.5 d, after tokens exist) |
| 12 | **Dead colour classes.** `text-primary-0` (Settings `<h1>`, nav Sign-in), `text-black-500`, `text-dark-800/500/400`, `group-hover:bg-accent-50`, `group-hover:border-accent-300`, `hover:text-accent-500` — all resolve to nothing | **Med** | `settings/page.tsx:18`, `TopMenu.tsx:107`, `DedicatedPostAuthor.tsx:219,241`, `CommentSection.tsx:89`, `ReplyItem.tsx:105,108,112`, `ReportPostDisplay.tsx:292`, `ReportAccountDisplay.tsx:218`, `ReportCommentDisplay.tsx:373` | S (1 h) |
| 13 | **Zero focus styles on any button or link;** 4 places call `focus:outline-none` with no replacement. `focus-visible` never used. Keyboard users get no indicator anywhere | **Med** (accessibility: High) | app-wide; explicit removals at `SearchComponent.tsx:154,178`, `ReportPostDisplay.tsx:282`, `ReportAccountDisplay.tsx:194`, `MultiSelectSubject.tsx:63` | M (0.5 d) |
| 14 | **Hard-coded fake "NavBar" placeholder** renders a second dark bar under the real nav on every profile page | **Med** | `pages/UserProfilePage.tsx:47-49` | XS (5 min) |
| 15 | **Subject colours differ by surface.** Post cards use the 13-colour brand map; edit-profile & register chips always fall back to pale blue | **Med** | `SubjectTags.jsx:20`, `CompactSubjectTags.jsx:20`, `colorConfig.js:4-33` | S (2 h) |
| 16 | **Tag colour map duplicated 4×**; `formatTimeAgo` 3× (one copy missing UTC normalisation); modal ✕ SVG 6×; Cloudinary upload 3× with **two different cloud accounts** | **Med** | §7.3 table | M (0.5 d) |
| 17 | **Animation presence is arbitrary.** `SolutionTag` animates in 2 of 3 places; `Post` hover-lifts but `DedicatedPost` doesn't; MUI IconButtons scale on hover while plain-button twins don't; 3 timing values, no easing convention | **Med** | `Comment.tsx:165`, `ProfileComment.tsx:117`, `ReplyItem.tsx:118`, `Post.tsx:125`, `DedicatedPost.tsx:79`, `theme.ts:189` | M (0.5 d) |
| 18 | **No page-level spacing rhythm.** `/` and `/user/[username]` have no container or horizontal padding; `/user/edit` and `/register` nest 3–4 paddings; `max-w-6xl` nested inside `max-w-3xl` in 3 admin pages | **Med** | `app/page.tsx:12`, `app/user/[username]/page.tsx:14`, `app/user/edit/page.tsx:23`, `app/register/page.tsx:16`, `admin/*/page.tsx` | M (0.5 d) |
| 19 | **3 spinner styles, 4 skeleton implementations, 5 empty-state styles, 4 error-state styles** | **Med** | §7.1 | M (0.5 d) |
| 20 | **9 border radii and 7 shadows** with no rule; cards use 4 radii, buttons use 4 | **Med** | app-wide | S–M (after tokens) |
| 21 | **`dark:` variants shipped with dark mode disabled** — 17 `dark:bg-neutral-700` in the two skeletons; `globals.css:31-36` commented out | **Med** | `ProfileHeaderSkeleton.tsx`, `ProfileContentSkeleton.tsx`, `globals.css` | XS (15 min) |
| 22 | **Disabled-state treatment varies** (`opacity-50`/`opacity-60`/`bg-red-400`/`cursor-wait`/none). Several disabled buttons look identical to enabled ones | **Med** | 12 files (§10.2) | S (2 h) |
| 23 | **`TopComment` like/dislike buttons are decorative** — no `onClick`, but styled as interactive with `cursor-pointer` on the inner SVG | **Med** | `TopComment.tsx:83-95` | XS |
| 24 | **`ViewRepliesButton.tsx` is dead code**; `Comment.tsx:317` hand-rolls a `text-purple-300 hover:text-blue-700` link instead — the only purple→blue hover in the app | **Low** | `ViewRepliesButton.tsx`, `Comment.tsx:315-326` | XS |
| 25 | **Fallback avatar path inconsistency** — `/default-avatar.png` (does not exist in `public/`) vs `/image/DefaultAvatar.png` | **Low** | `TopMenu.tsx:100`, `ReportPostDisplay.tsx:296` | XS |
| 26 | **Tailwind v3 syntax in a v4 project** — `@tailwind` directives alongside `@import "tailwindcss"`, `theme()` in `@layer utilities`; `.select-placeholder` is dead CSS | **Low** | `globals.css:1-6, 45-52` | XS |
| 27 | ~~**Sarabun font loaded on every page, never rendered**~~; MUI theme lists `Inter`, which is never loaded | **Low** | `globals.css:1`, `theme.ts:81` | XS |

> **[CORRECTED 2026-09-02]** The Sarabun half of this finding was wrong. Sarabun is the **second family in `--font-display`** (`globals.css:25`) and it renders every Thai character in the app — Afacad ships no Thai glyphs. Verified against Google Fonts: Afacad serves `latin, latin-ext, vietnamese, cyrillic-ext, math, symbols`; Sarabun serves `thai, latin, latin-ext, vietnamese`. On a Thai-language product this import is load-bearing and was deliberately kept. Only the `Inter` half was actioned in Phase 1.
| 28 | **Three icon libraries** (MUI Icons, lucide-react, heroicons) — different stroke weights and optical sizes side by side, e.g. lucide `Flag` at `ProfileHeader.tsx:87` vs heroicons `FlagIcon` at `:102` in the same component | **Low** | `ProfileHeader.tsx`, `PostHeader.tsx`, `ReportCommentModal.tsx` | M (if consolidating) |
| 29 | **`QuickStat.tsx` imported but never rendered**; `adminStats` object built and unused (`admin/page.tsx:13-18`) | **Low** | `admin/page.tsx` | XS |
| 30 | **Duplicate token declarations** — the 5 accent/dark/primary vars are written twice in `globals.css` (`:root` and `@theme inline`); 5 MUI colours use redundant 8-digit `…ff` hex | **Low** | `globals.css:8-29`, `theme.ts:34,35,46,47,52` | XS |

---

## 13. Proposed Token Set

A proposal only — nothing below has been implemented. The goal is one source of truth that both Tailwind and MUI read from, replacing `globals.css:8-29`, `theme/theme.ts:31-121`, and the four copies of the tag map.

### 13.1 Colour

**Brand ramp** — a single purple scale replaces the seven near-duplicates in §3.3.

| Token | Value | Replaces |
|---|---|---|
| `brand-50` | `#faf5ff` | new (fills the `accent-50` hole that `ReportPostDisplay.tsx:292` already assumes) |
| `brand-100` | `#f6d9ff` | `--color-accent-200`, `bg-purple-100` (`SignupPage:27`, `AdminLoginPage:47`, `Notification:97`), `bg-[var(--color-accent-200)]` |
| `brand-300` | `#c9a3dd` | new (fills the `accent-300` hole at `ReportPostDisplay.tsx:292`, `ReportAccountDisplay.tsx:218`) |
| `brand-400` | `#ab72c1` | `--color-accent-400` |
| `brand-500` | `#8131bb` | MUI `primary.light` `#8131bbff`, `purple-600` (`AdminLoginPage:98`, spinners, search accents) |
| `brand-600` | `#4b0082` | `--color-accent-600`, MUI `primary.main`, all `bg-[#4B0082]` literals, `purple-700` (`CreatePostModal:228`, `EditPostModal:255`, `DataPolicy:6`) |
| `brand-700` | `#340c51` | MUI `primary.dark` `#340c51ff` — the hover step for `brand-600` |

Retire: `#E384FF`, `#f3a4ff`, `#d166ff` (MUI `secondary`, only reachable through `SolutionTag`, which overrides it anyway), `#865DFF` (`banned_user.tsx:95-96`), `#fbedffff`, `#c18bd2ff`.

**Neutrals** — replaces the seven greys currently used for body text.

| Token | Value | Replaces |
|---|---|---|
| `ink-900` | `#191825` | `--color-dark-900`, `text-dark-900` (42×), `text-black` (5×), `text-neutral-900` |
| `ink-700` | `#374151` | `text-gray-700` (19×), `text-gray-800` (9×), `text-neutral-700`, MUI `text.secondary` |
| `ink-500` | `#6b7280` | `text-gray-500` (39×), `text-gray-600` (27×), MUI `customGray.main` |
| `ink-400` | `#9ca3af` | `text-gray-400` (22×), MUI `customGray.light` |
| `line` | `#e5e7eb` | `border-gray-200`, `border-gray-300`, `border-gray-100`, bare `border` |
| `surface` | `#ffffff` | `bg-white` (55×), `--color-primary-00`, MUI `background.default` |
| `surface-sunken` | `#f8f9fa` | `bg-gray-50`, `bg-gray-100`, MUI `background.paper` — unifies the three different page backgrounds (`/`, `/settings`, `/data-policy`) |

**Semantic** — one value per role, replacing the current 5 reds / 3 greens / 4 ambers.

| Token | Value | Replaces |
|---|---|---|
| `danger` | `#dc2626` | `red-600`, `red-500`, `bg-[#FF3B30]`, `bg-[#DC2626]`, MUI `error.main` `#FF5555` |
| `danger-hover` | `#b91c1c` | `red-700`, `red-800`, `#FF1F1F` |
| `danger-soft` | `#fee2e2` | `bg-red-100`, `bg-red-50` (error banners) |
| `success` | `#16a34a` | `bg-[#16A34A]`, `green-500`, `green-600`, MUI `success.main` `#4CAF50` |
| `success-soft` | `#dcfce7` | `bg-green-200` (`TopSubjects.tsx:20` `#bbf7d0`) |
| `warning` | `#d97706` | `amber-400/70`, `amber-500`, `orange-500`, `yellow-400`, MUI `warning.main` `#FFA726` |
| `warning-soft` | `#fef3c7` | `bg-amber-50` |
| `info-soft` | `#eff6ff` | `bg-blue-50` (`ReportPostDisplay.tsx:321`) |
| `focus` | `#8131bb` (= `brand-500`) | `ring-indigo-500` (12×), `ring-purple-500` (3×), `ring-blue-500` (3×) — one focus colour, on-brand |

**Subject palette** — keep the existing 13 hexes (they're distinct and legible) but define them **once** as `subject-math` … `subject-others`, replacing the four duplicated maps in `colorConfig.js`, `PostHeader.tsx`, `SearchComponent.tsx`, `RegisterForm.tsx`, and retiring the pale `blue/green/purple/red/orange/gray` set in `colorConfig.js:4-33` so a subject looks the same everywhere.

### 13.2 Type scale

One scale for both Tailwind and MUI. Replaces the current 10 Tailwind steps + 6 arbitrary `text-[…]` values + 6 unused MUI variants + 18 invalid classes.

| Token | Size / line-height | Weight | Replaces |
|---|---|---|---|
| `display` | 3rem / 1.1 | 700 | `text-6xl` (`ProfileForm.jsx:50`, `RegisterForm.tsx:85`), `text-5xl` (`SignupPage:30-31`, `settings:18`), `text-[4rem]` (`InfoBlock:14`) |
| `h1` | 2.25rem / 1.2 | 700 | `text-4xl`, `text-[2.25rem]`, MUI `h1` |
| `h2` | 1.875rem / 1.25 | 600 | `text-3xl` (all modal titles), MUI `h2`, `MuiDialogTitle` `2rem` |
| `h3` | 1.5rem / 1.3 | 600 | `text-2xl`, `text-[1.5rem]` (`TopSubjects:7`), MUI `h3` |
| `h4` | 1.25rem / 1.4 | 600 | `text-xl`, `text-[1.25rem]`, MUI `h4`, `ProfileTabs` `1.25rem` |
| `body-lg` | 1.125rem / 1.6 | 400 | `text-lg`, `text-[1.125rem]`, **`text-l`** |
| `body` | 1rem / 1.6 | 400 | `text-base`, `text-[1rem]` (`BioCard:10`, `Shibameter:9`, `InfoBlock:21`), **`text-m`**, **`text-md`**, MUI `body1` |
| `body-sm` | 0.875rem / 1.5 | 400 | `text-sm` (85×), MUI `body2`, `SolutionTag` `0.875rem` |
| `caption` | 0.75rem / 1.4 | 500 | `text-xs` (29×) |

Weights collapse to three: `regular 400` · `medium 500` · `bold 700` — replacing the current `normal/medium/semibold/bold/black` spread (`font-black` at `InfoBlock:14`, `TopMenu:55`, `ReportCard:117` etc. maps to `bold`).

Every step carries an explicit line-height, which is currently set nowhere except `InfoBlock.tsx:14`.

### 13.3 Spacing scale

A 6-step scale replaces the full 0–20 ramp currently in use.

| Token | Value | Replaces |
|---|---|---|
| `space-1` | 4px | `gap-1`, `p-1`, `mt-1`, `mb-1`, `p-0.5` |
| `space-2` | 8px | `gap-2` (41×), `p-2`, `py-2` (45×), `mt-2`, `mb-2`, `px-2` |
| `space-3` | 12px | `gap-3` (34×), `p-3`, `px-3`, `py-3`, `mb-3` |
| `space-4` | 16px | `gap-4` (24×), `p-4`, `px-4` (31×), `mb-4` (39×), `mt-4` |
| `space-6` | 24px | `gap-6` (16×), `p-6` (34×), `px-6`, `mb-6`, `mt-6`, `p-5`/`gap-5`/`mt-5`/`mb-5` (round 20→24) |
| `space-8` | 32px | `p-8`, `px-8`, `py-8`, `mb-8`, `gap-8`, `gap-7`/`gap-10` (round) |
| `space-12` | 48px | `mb-10`, `mt-10`, `p-10` (`banned_user:83`), `mb-9` |

Retire all percentage and arbitrary spacing: `mx-[25%]`, `mr-[2%]`, `mr-[20%]`, `ml-[26%]`, `p-[3%]`, `p-[0.5rem]`, `m-[1rem]`, `m-[3rem]`.

> **[CORRECTED 2026-09-02]** An earlier draft listed `mx-13`, `px-15`, `px-17`, `w-25`, `h-25`, and `h-200` here as *invalid*. They are valid. Tailwind v4 generates spacing utilities dynamically from the `--spacing` variable, so any integer step compiles — e.g. `.h-200{height:calc(var(--spacing)*200)}`. That was a v3 assumption. They are off-scale and worth consolidating, but they are not broken. `h-6rem` (`ProfileForm.jsx:131`) *was* genuinely invalid — bare units need bracket syntax — and was deleted in Phase 1.

**Layout tokens** (currently absent entirely):

| Token | Value | Replaces |
|---|---|---|
| `container-narrow` | 640px | modal `max-w-lg`/`max-w-md`/`max-w-sm`/`w-[40%]` — one modal width |
| `container` | 768px | `max-w-3xl` (post detail, admin pages) |
| `container-wide` | 896px | `max-w-4xl` (profile, settings), `w-[65%]` (edit/register forms) |
| `page-padding` | `space-4` mobile / `space-6` desktop | the currently-absent page padding on `/` and `/user/[username]`, and the 3–4 nested paddings on `/user/edit` and `/register` |
| `nav-offset` | 64px | `pt-16` (`app/page.tsx:12`), `pt-20` (4 admin/post pages), `top-16` (`FeedPageContent:255,267`) — and supplies the missing offset on `/settings` |

### 13.4 Radius

| Token | Value | Replaces |
|---|---|---|
| `radius-sm` | 6px | `rounded`, `rounded-md` (44×), MUI `TextField` `8px` |
| `radius-md` | 12px | `rounded-lg` (35×), `rounded-xl` (22×), MUI `Button`/`Card` `12px` |
| `radius-lg` | 20px | `rounded-2xl` (27×), `rounded-3xl` (7×), MUI `Dialog` `24px` |
| `radius-full` | 9999px | `rounded-full` (62×), `rounded-[10px]` (`Shibameter:7`), inline `borderRadius: '50%'` |

Assignment: inputs & small controls → `radius-sm`; buttons, chips, dropdowns → `radius-md`; cards & modals → `radius-lg`; avatars & pills → `radius-full`. This collapses cards from 4 radii to 1 and buttons from 4 to 1.

### 13.5 Shadows

| Token | Value | Replaces |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgb(25 24 37 / 0.06)` | `shadow-sm` (16×) — inputs, stat cards |
| `shadow-md` | `0 2px 12px rgb(25 24 37 / 0.08)` | `shadow-md`, `shadow-lg` (28×), MUI Card `0 2px 12px rgba(0,0,0,.08)` — the default card elevation |
| `shadow-lg` | `0 8px 28px rgb(25 24 37 / 0.12)` | `shadow-xl` (9×), MUI Dialog `0 4px 20px rgba(0,0,0,.1)` — modals and popovers, unifying the two modal systems |
| `shadow-hover` | `0 12px 36px rgb(25 24 37 / 0.14)` | `hover:shadow-2xl/15` — and gives `DedicatedPost.tsx:79` the hover state it currently lacks |

Tinting the shadow with `ink-900` rather than pure black keeps it consistent with the brand neutral.

### 13.6 Motion

Currently 3 durations, 2 easings, and 96 of 100 transitions on the implicit default.

| Token | Value | Replaces |
|---|---|---|
| `motion-fast` | 120ms | `duration-200` on colour-only changes |
| `motion-base` | 200ms | the implicit default on all 48 `transition-colors`, `duration-300` |
| `motion-slow` | 400ms | `duration-500` (`CookieConsentModal:11,17`) |
| `ease-standard` | `cubic-bezier(.2,0,0,1)` | the implicit default, `ease-in-out`, `ease-out` |

Plus a `prefers-reduced-motion` guard, which does not exist anywhere today.

---

*End of audit. No source files were modified.*
