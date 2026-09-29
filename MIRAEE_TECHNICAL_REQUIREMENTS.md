# Miraee Cinematic Website V2 --- Technical Requirements & Project Architecture

**Document type:** Engineering / implementation specification\
**Target:** Miraee marketing/product website cinematic redesign\
**Primary objective:** Preserve the current Miraee website content while
rebuilding its presentation as a premium, scroll-driven, interactive
product experience based on the approved motion references.

------------------------------------------------------------------------

## 1. Engineering Principles

1.  **Current Miraee content is the source of truth.** The redesign
    changes presentation, motion, composition, and interaction---not
    product claims.
2.  **Miraee = platform/application. Mirai = AI travel companion.**
3.  Build the experience as modular scenes, not one giant homepage
    component.
4.  GSAP is the primary animation controller.
5.  Use CSS/SVG before WebGL. Three.js is optional and restricted to
    scenes that genuinely require spatial/camera effects.
6.  Scroll position should control major animations. Avoid unrelated
    entrance-animation spam.
7.  Major scenes must reverse correctly when the user scrolls upward.
8.  Product UI is the primary visual material. Avoid generic SaaS cards,
    decorative 3D objects, gradient blobs, and fake product interfaces.
9.  Desktop, tablet, mobile, and reduced-motion experiences must be
    intentionally designed.
10. The existing production homepage must remain untouched until the new
    `/experience` route is approved.

------------------------------------------------------------------------

## 2. Recommended Technology Stack

### Core --- Required

  -----------------------------------------------------------------------
  Technology                          Purpose
  ----------------------------------- -----------------------------------
  Next.js                             Application framework, routing,
                                      SSR/SSG, asset optimization

  React                               Component architecture

  TypeScript                          Type-safe implementation

  Existing styling system             Preserve current Tailwind/CSS
                                      Modules/global design system rather
                                      than adding a competing UI
                                      framework

  GSAP                                Primary animation engine

  GSAP ScrollTrigger                  Scroll-linked timelines, pinning,
                                      scrubbed animation

  GSAP Flip                           Layout-to-layout transitions and
                                      persistent element transformations

  Lenis                               Controlled smooth scrolling

  SVG                                 Journey paths, connectors, route
                                      drawing, lightweight vector motion
  -----------------------------------------------------------------------

### Optional --- Use Only When Approved

  -----------------------------------------------------------------------
  Technology                          Use
  ----------------------------------- -----------------------------------
  Three.js                            True WebGL/3D spatial scenes

  @react-three/fiber                  React integration for Three.js

  @react-three/drei                   R3F helpers

  MotionPathPlugin / GSAP path        Moving visual elements along
  tooling                             approved SVG paths

  WebM video                          High-quality optimized cinematic
                                      media where necessary
  -----------------------------------------------------------------------

### Avoid Adding Without a Specific Need

-   Another general animation library alongside GSAP
-   A second smooth-scroll library
-   Large component/UI frameworks solely for this redesign
-   WebGL for ordinary UI perspective
-   Heavy particle libraries
-   Lottie for interactions that can be reproduced efficiently with
    HTML/SVG/GSAP
-   Multiple overlapping scroll controllers

------------------------------------------------------------------------

## 3. Dependency Strategy

### Required installation

``` bash
npm install gsap lenis
```

### Optional 3D installation

Install only if the approved Journey Scene requires true WebGL:

``` bash
npm install three @react-three/fiber @react-three/drei
```

### Existing dependencies

Before installation, audit `package.json` and reuse existing
equivalents. Do not duplicate packages that already solve the same
problem.

------------------------------------------------------------------------

## 4. Proposed Project Structure

``` text
miraee/
│
├── public/
│   ├── brand/
│   │   ├── miraee-logo.svg
│   │   ├── miraee-mark.svg
│   │   └── icons/
│   │
│   ├── product/
│   │   ├── dashboard/
│   │   ├── mirai/
│   │   ├── flights/
│   │   ├── hotels/
│   │   ├── approvals/
│   │   ├── policy/
│   │   ├── spend/
│   │   ├── tavo/
│   │   ├── taco/
│   │   ├── duty-of-care/
│   │   └── personas/
│   │
│   ├── journey/
│   │   ├── routes/
│   │   ├── destinations/
│   │   └── media/
│   │
│   └── fonts/
│
├── references/
│   ├── reference-01.mp4
│   ├── reference-02.mp4
│   ├── reference-03.mp4
│   └── reference-index.md
│
├── docs/
│   ├── MIRAEE-CONTENT-INVENTORY.md
│   ├── MIRAEE-CURRENT-ARCHITECTURE.md
│   ├── REFERENCE-MOTION-ANALYSIS.md
│   ├── MIRAEE-MOTION-SYSTEM.md
│   ├── MIRAEE-CONTENT-UI-MAPPING.md
│   ├── MIRAEE-ASSET-INVENTORY.md
│   ├── MIRAEE-EXPERIENCE-STORYBOARD.md
│   └── MIRAEE-TECHNICAL-REQUIREMENTS.md
│
├── src/
│   ├── app/
│   │   ├── experience/
│   │   │   └── page.tsx
│   │   ├── motion-lab/
│   │   │   └── page.tsx
│   │   └── ...
│   │
│   ├── components/
│   │   ├── experience/
│   │   │   ├── ExperienceShell.tsx
│   │   │   ├── ExperienceNavigation.tsx
│   │   │   └── ExperienceProgress.tsx
│   │   │
│   │   ├── scenes/
│   │   │   ├── HeroAssemblyScene/
│   │   │   │   ├── HeroAssemblyScene.tsx
│   │   │   │   ├── heroAssembly.timeline.ts
│   │   │   │   └── heroAssembly.module.css
│   │   │   ├── MiraiCapabilitiesScene/
│   │   │   ├── JourneyScene/
│   │   │   ├── PersonaScene/
│   │   │   ├── ProductExpansionScene/
│   │   │   ├── ProofScene/
│   │   │   └── ClosingScene/
│   │   │
│   │   ├── product/
│   │   │   ├── MiraeeDashboard/
│   │   │   ├── MiraiConversation/
│   │   │   ├── FlightSearch/
│   │   │   ├── ApprovalPanel/
│   │   │   ├── HotelBooking/
│   │   │   ├── TavoCall/
│   │   │   ├── TacoSupport/
│   │   │   ├── DutyOfCare/
│   │   │   └── SpendOverview/
│   │   │
│   │   ├── motion/
│   │   │   ├── MotionProvider.tsx
│   │   │   ├── SmoothScroll.tsx
│   │   │   ├── PinnedScene.tsx
│   │   │   ├── ScrollProgress.tsx
│   │   │   └── ReducedMotion.tsx
│   │   │
│   │   └── primitives/
│   │       ├── RoutePath.tsx
│   │       ├── MaskReveal.tsx
│   │       ├── ProductFrame.tsx
│   │       └── KineticWords.tsx
│   │
│   ├── lib/
│   │   ├── motion/
│   │   │   ├── gsap.ts
│   │   │   ├── scrollTrigger.ts
│   │   │   ├── lenis.ts
│   │   │   ├── breakpoints.ts
│   │   │   └── reducedMotion.ts
│   │   ├── media/
│   │   │   └── preload.ts
│   │   └── performance/
│   │       └── capabilities.ts
│   │
│   ├── data/
│   │   ├── experience.ts
│   │   ├── capabilities.ts
│   │   ├── personas.ts
│   │   └── journey.ts
│   │
│   ├── styles/
│   │   ├── experience.css
│   │   └── motion-tokens.css
│   │
│   └── types/
│       └── experience.ts
│
├── tests/
│   ├── experience/
│   └── visual/
│
├── package.json
├── next.config.*
├── tsconfig.json
└── README.md
```

------------------------------------------------------------------------

## 5. Scene Architecture

### Scene 01 --- Hero Assembly

**Goal:** Communicate that fragmented travel operations become one
connected Miraee experience.

**Inputs** - Existing hero headline and CTA - Miraee logo - Flight,
hotel, approval, policy, spend, support UI fragments - Final
dashboard/product state

**Motion** - UI fragments begin spatially separated. - Fragments move
toward a common structure. - Components align into the final Miraee
interface. - Existing hero message resolves alongside/through the
assembly.

**Technical approach** - React/HTML UI - GSAP master timeline - CSS
`transform` - GSAP Flip where the same fragments persist between
layouts - No Three.js

------------------------------------------------------------------------

### Scene 02 --- Mirai Capabilities

**Goal:** Turn existing Mirai capabilities into a scroll-controlled
product demonstration.

**Pattern**

``` text
Mirai can

plan.
book.
approve.
call.
support.
track.
adapt.
```

**Behavior** - Section pins on desktop. - Capability column moves
vertically. - One word occupies the active position. - Corresponding
real product UI changes with the active word. - Reverse scroll
reconstructs all states correctly.

**Technical approach** - GSAP ScrollTrigger - `scrub` - CSS transforms -
GSAP Flip for product-state continuity - Desktop and mobile timelines
separated with `gsap.matchMedia()`

------------------------------------------------------------------------

### Scene 03 --- Connected Journey

**Goal:** Make the trip itself the visual spine of the experience.

**Example narrative**

``` text
Austin
  ↓
Trip request
  ↓
Flight
  ↓
Policy
  ↓
Approval
  ↓
Hotel
  ↓
TAVO
  ↓
TACO
  ↓
Duty of care
  ↓
Return
```

**Required module** - `RoutePath` - SVG path - Journey-state
configuration - Product UI states - Optional destination media

**Technical approach --- default** - SVG path - GSAP ScrollTrigger -
GSAP transforms - clip-path/masks - CSS perspective

**Technical approach --- optional enhanced** - React Three Fiber scene -
Camera follows approved path - UI/images represented as textured
planes - GSAP controls camera progress

**Rule:** Implement HTML/SVG version first. Upgrade to WebGL only if it
produces a meaningful approved improvement.

------------------------------------------------------------------------

### Scene 04 --- Persona Focus

**Goal:** Present existing Miraee persona content without a conventional
card grid.

**Personas may include** - Traveller - Manager - Finance - Admin -
Travel Admin - HR - Leadership/CXO

**Desktop** - Horizontal focus sequence - Center persona = primary -
Adjacent personas remain contextually visible - Product UI changes with
persona

**Mobile** - Vertical sequence - No forced horizontal-scroll trap -
Persona and UI remain readable

**Technical approach** - CSS sticky - GSAP horizontal translation -
ScrollTrigger - Flip/transform for product UI changes

------------------------------------------------------------------------

### Scene 05 --- Product Expansion

**Goal:** Make the actual Miraee interface the main visual experience.

**Behavior** - UI begins contained. - It expands toward the viewport. -
Focus moves to the specific product area described by existing copy. -
UI transitions into the next product state.

**Technical approach** - GSAP - CSS transform - clip-path - responsive
product assets - optional reconstructed HTML UI for elements requiring
independent animation

------------------------------------------------------------------------

### Scene 06 --- Proof / Statistics

Use only verified existing Miraee statistics.

**Possible interactions** - Number wheel - Controlled count/reveal -
Sticky proof statement

**Rule:** Do not add invented metrics for visual effect.

------------------------------------------------------------------------

### Scene 07 --- Closing Resolution

**Goal:** Resolve all previous product states back into the Miraee
platform and existing CTA.

**Behavior** - Journey line/product states pull back. - Elements
converge into a unified Miraee state. - Existing closing message and CTA
become dominant. - Standard accessible footer follows.

**Technical approach** - GSAP - Flip - transform - SVG path resolution -
no WebGL required

------------------------------------------------------------------------

## 6. Motion System Requirements

### Core motion rules

-   One master timeline per major scene.
-   Major scroll scenes use ScrollTrigger.
-   Use `scrub` where user scroll position should directly control
    progress.
-   Use pinning only when the scene benefits from controlled focus.
-   Reverse scrolling must work without broken intermediate states.
-   Avoid arbitrary spring/bounce motion.
-   Avoid using fade-in/fade-out as the primary transition between
    scenes.
-   Prefer spatial continuity: transform, reposition, scale, mask, and
    reuse existing objects.

### Performance-friendly properties

Prefer:

``` text
transform
opacity
```

Use selectively:

``` text
clip-path
filter
mask
```

Avoid continuous animation of:

``` text
width
height
top
left
margin
padding
```

### Motion tokens

Define central motion tokens rather than hardcoding every scene:

``` css
:root {
  --motion-fast: 0.25s;
  --motion-base: 0.6s;
  --motion-slow: 1.2s;
  --motion-ease-standard: cubic-bezier(...);
  --motion-perspective: 1200px;
}
```

For scroll timelines, scene progress should be normalized to `0–1`.

------------------------------------------------------------------------

## 7. Scroll Architecture

``` text
Pointer / wheel / touch
        ↓
      Lenis
        ↓
 scroll position
        ↓
 GSAP ScrollTrigger
        ↓
 scene master timeline
        ↓
 transforms / SVG / product UI / optional WebGL
```

### Rules

-   Only one smooth-scroll controller.
-   Synchronize Lenis and ScrollTrigger.
-   Native scrolling must remain functional.
-   Do not prevent normal touch scrolling.
-   Disable/simplify smooth scrolling for reduced-motion users if
    appropriate.
-   Do not make the page unusable if JavaScript animation fails.

------------------------------------------------------------------------

## 8. Product UI Asset Requirements

### Required visual states

Inventory and obtain high-quality exports for:

-   Main Miraee dashboard
-   Mirai conversation
-   Flight search
-   Flight results
-   Booking
-   Approval
-   Policy
-   Hotel
-   TAVO call states
-   TACO support states
-   Duty-of-care map
-   Manager view
-   Finance/spend view
-   Admin view
-   Travel Admin view
-   Traveller view
-   HR view
-   Leadership/CXO view, if part of current site

### Asset rules

-   Prefer SVG for vector graphics.
-   Prefer WebP/AVIF for raster UI/photography.
-   Export product UI at sufficient resolution for full-screen
    expansion.
-   Avoid browser screenshots with irrelevant chrome.
-   For UI that must animate internally, reconstruct only the required
    pieces as HTML/React rather than slicing a large screenshot.
-   Preserve exact current product design; do not fabricate unsupported
    interfaces.

------------------------------------------------------------------------

## 9. Media Requirements

### Images

Preferred order: 1. SVG --- logos/icons/vector elements 2. AVIF ---
large photographic imagery 3. WebP --- product screenshots and general
raster assets 4. PNG --- only when transparency or source constraints
require it

### Video

Preferred: - WebM + MP4 fallback where practical - `muted` -
`playsInline` - poster frame - lazy load - avoid autoplaying large
videos outside the viewport - preload only metadata or critical
first-scene media

------------------------------------------------------------------------

## 10. Typography Requirements

-   Reuse the approved Miraee web typography.
-   Confirm licensing for web use.
-   Load only required font weights.
-   Prefer `next/font` or the existing optimized loading method.
-   Avoid layout shift caused by late font loading.
-   Establish responsive type scales for cinematic headings and product
    copy.
-   Ensure kinetic typography remains readable at narrow widths.

------------------------------------------------------------------------

## 11. Responsive Requirements

### Desktop

Full cinematic experience: - pinned scenes - horizontal persona motion -
product depth - larger UI transformations - optional 3D Journey Scene

### Tablet

Simplified cinematic experience: - reduced travel distance - shorter
pinning - fewer simultaneous objects - preserve narrative order

### Mobile

Design a separate interaction model: - vertical flow - minimal or no
horizontal scroll trapping - shorter pin durations - product UI appears
below/after active capability when side-by-side layout is impossible -
no tiny scaled desktop composition - optional WebGL scene replaced by
HTML/SVG fallback where required

### Breakpoint animation control

Use `gsap.matchMedia()` or equivalent architecture to create and destroy
breakpoint-specific timelines safely.

------------------------------------------------------------------------

## 12. Accessibility Requirements

### Reduced motion

Support:

``` css
@media (prefers-reduced-motion: reduce)
```

Reduced-motion experience must: - remove large camera moves - remove
unnecessary parallax - avoid long scrubbed transitions - show final
content states directly - preserve all information and CTAs

### General accessibility

-   Semantic headings
-   Keyboard-accessible controls
-   Visible focus states
-   Sufficient color contrast
-   Alternative text for meaningful imagery
-   Decorative images hidden from assistive technology
-   No critical information communicated only through animation
-   Avoid scroll hijacking
-   Footer/navigation remain conventionally accessible

------------------------------------------------------------------------

## 13. Performance Requirements

### Primary target

Aim for smooth animation on modern desktop and mobile hardware,
targeting 60fps for core interactions where practical.

### Rules

-   Use transform/opacity for frequent animation.
-   Do not update React state every scroll frame.
-   Keep animation values inside GSAP/DOM where possible.
-   Lazy-load below-the-fold media.
-   Dynamically import heavy optional 3D scenes.
-   Pause media/animation when not visible.
-   Avoid oversized source assets.
-   Minimize simultaneous filters/blurs.
-   Dispose Three.js geometries, materials, textures, and event handlers
    correctly.
-   Kill ScrollTriggers/timelines on unmount.
-   Refresh ScrollTrigger after asset/layout changes where required.

### Progressive enhancement

The page must remain understandable if: - animations are reduced, -
WebGL is unavailable, - optional media fails, - JavaScript loads slowly.

------------------------------------------------------------------------

## 14. WebGL / Three.js Requirements

Three.js is **not a base dependency requirement**.

Use only if the final Journey Scene requires: - true camera movement
through 3D space, - spatial planes that cannot be convincingly achieved
with CSS, - controlled depth/fly-through composition.

### If used

Create a dedicated module:

``` text
components/scenes/JourneyScene3D/
├── JourneyScene3D.tsx
├── JourneyCanvas.tsx
├── JourneyCamera.tsx
├── JourneyPlanes.tsx
├── journey3d.config.ts
└── useJourneyProgress.ts
```

### Required safeguards

-   Dynamic import
-   Mobile fallback
-   Reduced-motion fallback
-   WebGL capability detection
-   Texture optimization
-   Resource disposal
-   No duplicate render loops
-   Limit device pixel ratio where necessary

------------------------------------------------------------------------

## 15. Data / Content Configuration

Do not bury website copy inside animation files.

Example:

``` ts
export const capabilities = [
  {
    id: "book",
    label: "book",
    productState: "flight-search",
  },
  {
    id: "approve",
    label: "approve",
    productState: "approval",
  },
];
```

Maintain structured configuration for: - capabilities - personas -
journey stages - scene copy - product assets - CTA data

This separates content from animation logic.

------------------------------------------------------------------------

## 16. TypeScript Models

Recommended conceptual types:

``` ts
type SceneId =
  | "hero"
  | "mirai"
  | "journey"
  | "personas"
  | "product"
  | "proof"
  | "closing";

interface JourneyStage {
  id: string;
  title: string;
  productAsset?: string;
  description?: string;
}

interface Persona {
  id: string;
  name: string;
  productState: string;
  content: string;
}

interface Capability {
  id: string;
  label: string;
  productState: string;
}
```

------------------------------------------------------------------------

## 17. Motion Lab Requirement

Before production integration, maintain:

``` text
/motion-lab
```

It should contain isolated prototypes for:

1.  Kinetic typography
2.  UI → message → UI depth transition
3.  Continuous scene transformation
4.  SVG journey path
5.  Persona horizontal focus
6.  Product expansion
7.  Closing convergence

Only approved experiments should be promoted into `/experience`.

------------------------------------------------------------------------

## 18. Content-to-UI Mapping Requirement

Create `MIRAEE-CONTENT-UI-MAPPING.md` before final implementation.

Minimum structure:

  ---------------------------------------------------------------------------------
  Story          Existing       Product visual      Interaction      Asset status
                 content                                             
  -------------- -------------- ------------------- ---------------- --------------
  Connected      Current hero   Dashboard/modules   Assemble         TBD
  platform                                                           

  Mirai          Current Mirai  Mirai + product     Kinetic words    TBD
  intelligence   copy           states                               

  Booking        Current        Flight UI           Expansion        TBD
                 booking copy                                        

  Approval       Manager        Approval UI         Transform        TBD
                 content                                             

  TAVO           Existing TAVO  Call UI             Call sequence    TBD
                 content                                             

  TACO           Existing       Support UI          Handoff          TBD
                 support                                             
                 content                                             

  Duty of care   HR content     World map           Pull-out         TBD

  Finance        Finance        Spend UI            Layout           TBD
                 content                            transformation   

  Personas       Existing       Persona UI          Focus sequence   TBD
                 persona copy                                        

  Closing        Existing CTA   Unified system      Convergence      TBD
  ---------------------------------------------------------------------------------

No scene should enter production implementation without a confirmed
content source and product visual.

------------------------------------------------------------------------

## 19. Browser / Device Testing

### Required browsers

-   Chrome
-   Safari
-   Firefox
-   Edge

### Required mobile coverage

-   iPhone Safari
-   Android Chrome

### Test specifically

-   pinned sections
-   sticky positioning
-   reverse scrolling
-   route/path animation
-   video playback
-   clip-path/masks
-   smooth-scroll behavior
-   browser back/forward navigation
-   orientation changes
-   reduced motion
-   touch scrolling
-   resize/reflow
-   hydration/console errors

Safari requires particular attention for sticky layouts, video, masks,
and complex scrolling.

------------------------------------------------------------------------

## 20. QA Requirements

### Visual QA

For every scene: - correct typography - correct spacing - no generic
placeholder UI - no unintended clipping - no layout jump - no visible
asset pixelation - consistent motion direction - correct scene
continuity

### Motion QA

Test: - slow downward scroll - fast downward scroll - slow upward
scroll - fast upward scroll - trackpad momentum - mouse wheel - touch -
resize during/after scene - navigation away and back

### Engineering QA

Must have: - no React warnings - no hydration errors - no uncaught
exceptions - no leaked animation listeners - no orphaned
ScrollTriggers - no persistent WebGL render loop after scene unmount -
no inaccessible critical CTA

------------------------------------------------------------------------

## 21. Suggested Testing Tooling

Reuse the project's current testing stack if one exists.

Recommended categories: - unit/component tests for configuration and UI
behavior - browser E2E tests for navigation and responsive rendering -
visual regression screenshots for key scene states - Lighthouse /
browser performance profiling - Chrome Performance panel for
scroll-frame inspection

Do not add a large testing framework solely for animation unless the
project currently lacks appropriate coverage and the team approves it.

------------------------------------------------------------------------

## 22. Deployment Architecture

Continue using Vercel if that is the existing deployment platform.

Recommended workflow:

``` text
main
└── current production Miraee

cinematic-redesign
└── development branch

/experience
└── new complete experience

/motion-lab
└── isolated experiments

Vercel Preview
└── stakeholder review

approved
└── replace production homepage
```

### Production replacement gate

Do not replace the current homepage until: - desktop approved - tablet
approved - mobile approved - reduced-motion approved - performance
reviewed - browser testing passed - content verified - analytics/SEO
requirements retained

------------------------------------------------------------------------

## 23. SEO Requirements

The cinematic implementation must not remove normal document semantics.

Preserve: - page title - metadata - canonical URL - Open Graph
metadata - meaningful HTML headings - crawlable text - internal links -
sitemap behavior - structured data already used by the current site

Do not render all important copy only inside canvas/WebGL.

------------------------------------------------------------------------

## 24. Analytics Requirements

Retain existing analytics if present.

Track meaningful interactions only, such as: - hero CTA - final CTA -
navigation - persona selection if interactive - product/demo CTA -
contact/demo conversion

Do not emit analytics events continuously from scroll progress.

------------------------------------------------------------------------

## 25. Security / Privacy

-   No secrets in client code.
-   No API keys embedded in animation modules.
-   Sanitize any CMS/user-controlled HTML if introduced later.
-   Load third-party scripts only when approved.
-   Follow existing CSP/security headers.
-   Avoid unnecessary third-party tracking libraries.

------------------------------------------------------------------------

## 26. Asset Checklist --- Blocking Before Final Build

### Brand

-   [ ] Miraee logo SVG
-   [ ] Brand mark SVG
-   [ ] Approved color tokens
-   [ ] Approved web font and weights
-   [ ] Approved icon set

### Product

-   [ ] Dashboard
-   [ ] Mirai
-   [ ] Flight search/results
-   [ ] Booking
-   [ ] Approval
-   [ ] Policy
-   [ ] Hotel
-   [ ] TAVO
-   [ ] TACO
-   [ ] Duty of care
-   [ ] Finance/spend
-   [ ] Manager
-   [ ] Admin
-   [ ] Travel Admin
-   [ ] Traveller
-   [ ] HR
-   [ ] Leadership/CXO if used

### Content

-   [ ] Current website content inventory approved
-   [ ] Persona copy approved
-   [ ] Capability copy approved
-   [ ] Statistics verified
-   [ ] Final CTA approved
-   [ ] Austin → Paris or other journey scenario approved

### Motion

-   [ ] Reference shortlist approved
-   [ ] Motion system approved
-   [ ] Scene storyboard approved
-   [ ] Mobile behavior approved
-   [ ] Reduced-motion behavior approved

------------------------------------------------------------------------

## 27. Implementation Phases

### Phase 0 --- Audit

-   Audit current codebase
-   Audit dependencies
-   Audit content
-   Audit assets
-   Audit references

### Phase 1 --- Foundation

-   Configure GSAP
-   Configure ScrollTrigger
-   Configure Lenis
-   Create motion provider
-   Create responsive motion utilities
-   Create reduced-motion handling
-   Create `/motion-lab`

### Phase 2 --- Motion prototypes

Build and approve: 1. kinetic typography 2. UI depth transition 3.
continuous transformation 4. route path 5. persona focus 6. product
expansion

### Phase 3 --- Asset preparation

-   Export clean product states
-   Optimize raster assets
-   Prepare SVG paths/icons
-   Prepare media
-   Reconstruct selected UI components where independent animation is
    required

### Phase 4 --- `/experience`

Implement: 1. Hero Assembly 2. Mirai Capabilities 3. Connected Journey
4. Personas 5. Product Expansion 6. Proof 7. Closing

### Phase 5 --- Responsive implementation

-   Tablet
-   Mobile
-   Reduced motion

### Phase 6 --- Optimization

-   Asset compression
-   dynamic imports
-   animation profiling
-   WebGL optimization if used
-   remove unused dependencies
-   bundle review

### Phase 7 --- QA

-   visual
-   motion
-   accessibility
-   browser/device
-   performance
-   content verification
-   SEO/analytics regression

### Phase 8 --- Production

-   Stakeholder approval
-   production homepage integration
-   final regression
-   deploy
-   monitor

------------------------------------------------------------------------

## 28. Definition of Done

The redesign is complete only when:

-   Existing important Miraee content is preserved.
-   Product terminology is correct.
-   Every major animation has a narrative purpose.
-   Scenes visually transition rather than behave like unrelated
    landing-page blocks.
-   Actual Miraee product UI is used instead of generic/fake UI.
-   Desktop, tablet, and mobile are intentionally designed.
-   Reduced-motion mode contains all content.
-   Reverse scroll works correctly.
-   No major animation depends unnecessarily on WebGL.
-   Page remains crawlable and accessible.
-   No hydration/console errors exist.
-   Assets are optimized.
-   Performance is acceptable on target devices.
-   Current analytics/SEO requirements are retained.
-   Stakeholders approve the `/experience` preview before production
    replacement.

------------------------------------------------------------------------

## 29. Core Dependency Summary

### Required

``` text
next
react
react-dom
typescript
gsap
lenis
```

Use the project's existing styling solution.

### Optional

``` text
three
@react-three/fiber
@react-three/drei
```

Only add optional dependencies after the Journey Scene technical
prototype proves they are required.

------------------------------------------------------------------------

## 30. Recommended Implementation Rule for Codex / Claude Code

When an implementation is difficult, the coding agent must **not**
replace the approved interaction with a generic card/grid section.

Priority order:

``` text
1. Preserve existing Miraee content
2. Preserve approved storytelling intent
3. Preserve scene-to-scene continuity
4. Use the simplest performant technical solution
5. Document necessary deviations
6. Request/review missing assets before fabricating product UI
```

The desired outcome is not "a website with many animations." It is a
coherent product narrative in which motion explains how Miraee connects
business travel.
