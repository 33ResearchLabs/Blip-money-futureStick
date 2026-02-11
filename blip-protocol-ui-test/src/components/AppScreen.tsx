const AppScreens = () => {
  return (
    <section className="py-16 sm:py-24 md:py-32 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
          One App. Total Control.
        </h2>
        <p className="text-sm sm:text-base text-gray-500">
          Minimal by design. Powerful by nature.
        </p>
      </div>

      <div className="flex flex-row md:justify-center gap-6 sm:gap-8 px-4 sm:px-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
        {[
          { title: "My Ads", color: "from-black to-black", img: "/myads.jpg" },
          {
            title: "P2P",
            color: "from-black to-[#2BFF88]/10",
            img: "/p2p.jpg",
          },
          {
            title: "Profile",
            color: "from-black to-[#FFD43B]/10",
            img: "/profile.jpg",
          },
        ].map((screen, i) => (
          <div
            key={i}
            className={`min-w-[240px] sm:min-w-[260px] md:min-w-[230px] h-[420px] sm:h-[460px] md:h-[500px] rounded-[2.5rem] sm:rounded-[3rem] border border-white/10 relative overflow-hidden snap-center group hover:-translate-y-2 transition-transform duration-500 flex-shrink-0`}
          >
            {/* Full screen background image */}
            <img
              src={screen.img}
              alt={screen.title}
              className="absolute inset-0 w-full h-full object-contain rounded-[3rem] sm:rounded-[4rem]"
            />

            {/* Dark overlay for better readability */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 rounded-[2.5rem] sm:rounded-[3rem]" /> */}

            {/* Top bar */}
            {/* <div className="relative w-16 h-5 sm:w-20 sm:h-6 rounded-full bg-white/10 backdrop-blur-sm mx-auto mt-5 sm:mt-6 border border-white/20" /> */}

            {/* Title */}
            <div className="absolute bottom-5 sm:bottom-6 left-0 right-0 text-center">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white drop-shadow-lg group-hover:text-[#2BFF88] transition-colors">
                {screen.title}
              </span>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[2.5rem] sm:rounded-[3rem]" />
          </div>
        ))}
      </div>
    </section>
  );
};
