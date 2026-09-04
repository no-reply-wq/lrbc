export default function FeatureCard() {
  return (
    <div className="w-full max-w-xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#06070a] p-8 text-white shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-1/2 -right-24 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-blue-400/10 blur-2xl" />

        {/* Decorative grid */}
        <svg
          className="absolute inset-0 h-full w-full opacity-20"
          viewBox="0 0 600 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 150L220 0L580 170L330 480L0 250L120 0L580 100L0 200L580 430L70 0L120 480L430 0L490 480"
            stroke="white"
            strokeOpacity="0.2"
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 rounded-2xl bg-white/5 p-6 backdrop-blur-md">
          <h3 className="text-2xl font-semibold tracking-tight">
            Built on what you already know
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Runs on Google Sheets, so your team isn't learning a whole
            new system.
          </p>

          {/* Bottom border accent */}
          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}