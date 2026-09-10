import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#fffdfb] font-body text-[#2E2A28]">

      <div className="dot-grid-bg" />
      <div className="relative z-20 w-full">
        <nav className="flex items-center justify-center gap-3 px-8 py-6 max-w-4xl mx-auto w-full text-center">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb6c1]"></span>
            Skill Decay
          </Link>
          <span className="text-[#d8d3cd]">·</span>
          <span className="text-sm font-light text-[#a8a29c]">
            for things worth remembering
          </span>
        </nav>

        {/* Hero */}
        <section className="max-w-2xl mx-auto text-center px-6 pt-16 pb-24 min-h-[calc(100vh-88px)] flex flex-col items-center justify-center">

          <div className="inline-flex items-center gap-1.5 font-bold text-xs bg-[#ffd6a5]/60 text-[#9c5a1e] px-3.5 py-1.5 rounded-full mb-6">
            based on the forgetting curve
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight mb-4">
            Keep your skills from getting{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #ffb6c1, #f1c0e8, #cdb4db)",
              }}
            >
              sleepy.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#8a8480] max-w-md mx-auto mb-8">
            Log what you're learning. We'll gently nudge you before you forget
            it, no guilt, just a friendly little reminder.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link
              to="/signup"
              className="font-bold text-base bg-[#ffb6c1] text-[#2E2A28] px-7 py-4 rounded-full shadow-lg shadow-[#ffb6c1]/50 hover:-translate-y-0.5 transition-transform"
            >
              Start tracking free
            </Link>
            <Link
              to="/login"
              className="font-bold text-base bg-white border-2 border-[#bde0fe] px-6 py-3.5 rounded-full hover:border-[#cdb4db] transition-colors"
            >
              Log in
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-semibold bg-[#ffb6c1]/25 text-[#a13f5c] px-4 py-2 rounded-full">
              Private
            </span>
            <span className="text-sm font-semibold bg-[#bde0fe]/50 text-[#2b5f8a] px-4 py-2 rounded-full">
              Log in seconds
            </span>
            <span className="text-sm font-semibold bg-[#ffd6a5]/55 text-[#9c5a1e] px-4 py-2 rounded-full">
              Sorted for you
            </span>
            <span className="text-sm font-semibold bg-[#cdb4db]/40 text-[#5f3d78] px-4 py-2 rounded-full">
              No guilt
            </span>
          </div>

          {/* Palette dot row */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <span className="w-3 h-3 rounded-full bg-[#ffb6c1]"></span>
            <span className="w-3 h-3 rounded-full bg-[#cdb4db]"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffd6a5]"></span>
            <span className="w-3 h-3 rounded-full bg-[#bde0fe]"></span>
            <span className="w-3 h-3 rounded-full bg-[#f1c0e8]"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffc8dd]"></span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;