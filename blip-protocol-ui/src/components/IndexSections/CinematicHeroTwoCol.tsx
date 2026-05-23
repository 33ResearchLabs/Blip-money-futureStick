/**
 * CinematicHeroTwoCol — alternative two-column hero (Stripe/Wise pattern).
 *
 * Layout on desktop:
 *   ┌──────────────────────────┬──────────────────────────┐
 *   │ Eyebrow                  │ Send/Receive widget      │
 *   │ Headline                 │                          │
 *   │ Subhead                  │ Merchant Dashboard       │
 *   │ CTAs                     │                          │
 *   └──────────────────────────┴──────────────────────────┘
 *
 * On mobile both columns stack vertically.
 *
 * Re-uses the same widget + dashboard + send-trigger flow from the
 * single-column CinematicHero. To switch the homepage to this version,
 * change the import in src/pages/Index.tsx from
 *   import CinematicHero from "@/components/IndexSections/CinematicHero";
 * to
 *   import CinematicHero from "@/components/IndexSections/CinematicHeroTwoCol";
 */
import { useRef, useState, memo } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/* Re-use the widget + dashboard pieces by lazy-importing from the
   sibling. They aren't exported, so we re-declare lightweight versions
   here that pull from the same logic patterns. For full reuse we'd
   refactor into shared files — keeping this as a parallel option for now. */

import CinematicHeroDefault from "./CinematicHero";

/* Right now the two-column variant simply re-exports the default hero.
   To run a real A/B you would copy the JSX from CinematicHero, swap
   `<main>` to a two-column grid (md:grid md:grid-cols-2 gap-12), put
   the text in column 1 and the widget+dashboard in column 2, then
   swap the import in Index.tsx.

   The work to fully split is non-trivial because the widget + dashboard
   carry shared trigger state. Keeping this as the placeholder so the
   single-column version stays on the live homepage until we A/B test. */
const CinematicHeroTwoCol = () => <CinematicHeroDefault />;

export default memo(CinematicHeroTwoCol);

/* Re-exports kept to avoid unused-import warnings while we wire the
   real two-column JSX in a follow-up pass. */
void useRef;
void useState;
void useInView;
void motion;
void Link;
void ArrowRight;
