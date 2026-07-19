# How It Works v1.0

**Status**: Production Certified, Frozen, Enterprise Ready

## Purpose
The `HowItWorks` component is a premium, cinematic storytelling section designed to walk the user through the 4 core steps of the SalarySense AI product (Upload, AI Analysis, Prediction, Insights). It serves as an authoritative, Apple-style product presentation to build user trust and clarify the product's value proposition without requiring them to read complex documentation.

## Architecture
The section uses a unidirectional React architecture strictly mapped from state and scroll position.
It heavily leverages `framer-motion` for spring-physics-based animations, orchestrating complex SVG drawing, staggered reveals, and scroll-linked timelines. It is built to seamlessly respect user system preferences (Reduced Motion) and hardware constraints (Mobile Touch vs Desktop 3D Hover).

## Folder Structure
```
features/landing/components/HowItWorks/
├── index.tsx                # Main container, orchestrates scroll context and memory-optimized PREVIEWS
├── Step.tsx                 # The core layout wrapper for each step, handles InView states and active/past/future styles
├── Timeline.tsx             # The central glowing connector line bound to the main scroll progress spring
├── StepHeader.tsx           # Static typography intro for the section
├── constants.ts             # Data layer containing the 4 steps (titles, descriptions, badges)
├── types.ts                 # TypeScript interfaces, including PreviewComponentProps
└── Preview/                 # The 4 individual cinematic SVG/UI cards
    ├── UploadPreview.tsx
    ├── AIAnalysisPreview.tsx
    ├── PredictionPreview.tsx
    └── InsightsPreview.tsx
```

## Motion Philosophy
- **Spring Physics**: All continuous interactions (timeline scroll, 3D hover parallax, badge scaling) use weighted springs (e.g., `stiffness: 100, damping: 30`) instead of linear easings to provide realistic, physical momentum.
- **Cinematic Easing**: Entrance and structural opacity fades utilize a custom cubic-bezier curve (`[0.16, 1, 0.3, 1]`) mirroring premium hardware marketing pages.
- **Subtle Staggering**: Every internal element in a `Preview` component enters sequentially with strict `0.08s` to `0.12s` stagger delays.
- **Contextual Interpolation**: Animations do not snap. When a step is scrolled past, it gently scales down to `0.97`, dims to `55%`, and gains a `2px` blur, establishing a "past memory" visual hierarchy rather than abruptly vanishing.

## Accessibility Support
- **Reduced Motion**: Directly respects user OS `prefers-reduced-motion`. If true, heavy animations are disabled and components snap to their final `active` visual states.
- **ARIA Pruning**: Decorative visual elements (the Timeline, the 3D Perspective Card Wrappers, the floating badges) are explicitly marked with `aria-hidden="true"` so screen readers can seamlessly parse the core `<h3>` and `<p>` text without interruption.
- **Keyboard Navigation**: Maintains full scrolling focus order.

## Performance Strategy
- **Memoization**: All `Preview` components are wrapped in `React.memo()`. As they only receive a single primitive `isActive` boolean, they will completely bypass React's render phase during scroll events unless their specific step boundary is crossed.
- **Static Memory**: The array of JSX previews is instantiated statically outside the main React component (`const PREVIEWS = [...]`), eliminating array allocation and garbage collection thrashing during the 60fps scroll loop.
- **Hardware Acceleration**: All intensive hover parallax, glowing shadow scales, and scroll reveals manipulate only `transform`, `opacity`, and `filter`.

## Future Extension Guidelines
If a 5th step is required in the future:
1. Add the step data to `constants.ts`.
2. Build the new preview inside the `Preview/` folder, ensuring it accepts `{ isActive }` and wraps its output in `React.memo`.
3. Add it to the static `PREVIEWS` array in `index.tsx`.
The `Timeline.tsx` and `Step.tsx` will automatically adapt the layout, scroll height, and staggering.

## Regression Policy (Freeze Policy)
The "How It Works" section is now officially **frozen**. 
Future modifications are only allowed under the following strict conditions:
1. A verified production bug.
2. An accessibility violation.
3. A security issue.
4. A verified performance regression on new devices.
5. An explicitly approved Product/Design redesign request.

*Otherwise, no modifications to this codebase are permitted.*
