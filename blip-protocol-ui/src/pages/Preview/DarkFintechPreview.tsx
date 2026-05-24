import DarkFintechSectionPreview from "@/components/IndexSections/DarkFintechSectionPreview";

/**
 * Isolated preview of the dark cinematic "global remittance" slideshow.
 * Renders only this section — safe sandbox for refinement.
 * Source file (editable): src/components/IndexSections/DarkFintechSectionPreview.tsx
 * Original (do not touch): src/components/IndexSections/DarkFintechSection.tsx
 */
export default function DarkFintechPreview() {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="fixed top-3 left-3 z-[100] px-2.5 py-1 rounded-md bg-white/10 backdrop-blur text-[10px] font-semibold tracking-[0.18em] uppercase text-white/70">
        Preview · dark fintech
      </div>
      <DarkFintechSectionPreview />
    </main>
  );
}
