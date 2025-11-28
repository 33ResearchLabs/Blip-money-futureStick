const ProtocolSection = () => (
  <section id="protocol" className="py-16 sm:py-24 md:py-32 bg-black relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-12 sm:mb-16">
      <span className="text-[#FFD43B] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4 block">
        The Backbone
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
        The Blip Protocol
      </h2>
    </div>

    <div className="w-full h-[250px] sm:h-[350px] md:h-[400px] relative overflow-hidden flex items-center justify-center mb-8 sm:mb-10 md:mb-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 400"
        className="opacity-80 max-w-3xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M400,200 L200,100"
          stroke="rgba(43,255,136,0.1)"
          strokeWidth="1"
        />
        <path
          d="M400,200 L600,100"
          stroke="rgba(43,255,136,0.1)"
          strokeWidth="1"
        />
        <path
          d="M400,200 L200,300"
          stroke="rgba(43,255,136,0.1)"
          strokeWidth="1"
        />
        <path
          d="M400,200 L600,300"
          stroke="rgba(43,255,136,0.1)"
          strokeWidth="1"
        />

        <path
          d="M200,100 L400,200 L600,300"
          stroke="url(#activePathGrad)"
          strokeWidth="2"
          fill="none"
        />
        <defs>
          <linearGradient id="activePathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2BFF88" stopOpacity="0" />
            <stop offset="50%" stopColor="#2BFF88" stopOpacity="1" />
            <stop offset="100%" stopColor="#2BFF88" stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle r="3" fill="#fff">
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path="M200,100 L400,200 L600,300"
          />
        </circle>

        <ProtocolNode cx="400" cy="200" label="Core Router" />
        <ProtocolNode cx="200" cy="100" label="Merchant Node A" />
        <ProtocolNode cx="600" cy="100" label="Wallet B" />
        <ProtocolNode cx="200" cy="300" label="User C" />
        <ProtocolNode cx="600" cy="300" label="Liquidity Pool" />
      </svg>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
      {[
        {
          title: "Decentralized Routing",
          desc: "No central server. Pure P2P logic.",
        },
        {
          title: "Liquidity Efficient",
          desc: "Just-in-time provisioning via pools.",
        },
        { title: "Permissionless", desc: "Anyone can run a node and earn." },
      ].map((item, i) => (
        <div key={i} className="p-4 sm:p-6">
          <h3 className="text-white font-bold text-base sm:text-lg mb-2">
            {item.title}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
