import React from "react";

const ComingSoon = ({ onBack }) => {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-black via-green-900 to-black text-white px-6 relative">
        {/* Back Button */}
        <a
          href="/"
          className="absolute top-6  left-28 flex items-center space-x-2 px-3 py-1 rounded-full bg-green-800 bg-opacity-70 hover:bg-green-700 transition text-sm font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back</span>
        </a>

        <div className="max-w-lg text-center space-y-6">
          {/* Gradient "Coming Soon" badge */}
          <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-black font-bold uppercase tracking-wide text-xs">
            Coming Soon
          </span>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Exciting Features <br /> Are On The Way
          </h1>

          {/* Subtext */}
          <p className="text-gray-300 text-lg">
            We're working hard to bring you something awesome. Stay tuned for
            updates and new releases.
          </p>

          {/* Button with green gradient */}
          <button
            className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition duration-300 font-semibold shadow-lg"
            onClick={() => alert("Thanks for your interest! Stay tuned.")}
          >
            Notify Me
          </button>
        </div>
      </div>
    </>
  );
};

export default ComingSoon;
