interface BlipPhoneMockupProps {
  /** Retained for backward compatibility with existing call sites; unused. */
  balance?: number | string;
}

/** Phone mockup — renders a single app screenshot, no overlays or dimming. */
export function BlipPhoneMockup(_props: BlipPhoneMockupProps = {}) {
  return (
    // <div className="mx-auto block w-fit overflow-hidden rounded-[2.5rem]">
    //   <img
    //     className="block h-auto w-auto max-h-[420px] sm:max-h-[520px] scale-[1.02]"
    //     src="/screenshots/image.png"
    //     alt="Blip app home screen"
    //   />
    // </div>
    <div
      className="overflow-hidden sm:rounded-[2rem] rounded-[1.4rem] mx-auto w-full max-w-[200px] sm:max-w-[250px] "
      style={{ aspectRatio: "580 / 1280" }}>
         {/* <img className="block w-full h-full object-cover" src="/screenshots/image20-bg.png" alt="" /> */}
      <img
        className="block w-full h-full object-cover"
        style={{ transform: "scale(1.01)" }}
        src="/screenshots/image.png"
        alt=""
      />
        
      </div>
  );
}

export default BlipPhoneMockup;
