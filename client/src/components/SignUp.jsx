import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
       await axios.post(
        `${BACKEND_URL}/signup`,
        { name, email, password },
        { withCredentials: true },
      );
      return navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#fffdfb] font-body text-[#2E2A28]">
      <div className="dot-grid-bg" />
      <div className="relative z-20 w-full">
        <nav className="flex items-center justify-center gap-3 px-8 py-6 max-w-4xl mx-auto w-full text-center">
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-bold text-lg"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb6c1]"></span>
            Skill Decay
          </Link>
          <span className="text-[#d8d3cd]">·</span>
          <span className="text-sm font-light text-[#a8a29c]">
            for things worth remembering
          </span>
        </nav>

        {/* Card */}
        <section className="max-w-md mx-auto px-6 pt-8 pb-24">
          <div className="bg-white/90 backdrop-blur-sm border border-[#f1c0e8]/40 rounded-3xl shadow-xl shadow-[#cdb4db]/10 px-8 py-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 font-bold text-xs bg-[#bde0fe]/50 text-[#2b5f8a] px-3.5 py-1.5 rounded-full mb-5">
                takes less than a minute
              </div>
              <h1 className="font-display font-bold text-3xl mb-2">
                Create your{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #ffb6c1, #f1c0e8, #cdb4db)",
                  }}
                >
                  account
                </span>
              </h1>
              <p className="text-sm text-[#8a8480]">
                A few seconds and you're tracking your first skill.
              </p>
            </div>

            {error && (
              <div className="mb-5 text-sm font-semibold text-[#a13f5c] bg-[#ffb6c1]/15 border border-[#ffb6c1]/40 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8a8480] mb-1.5 ml-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#f1ece8] bg-[#fffdfb] text-sm focus:outline-none focus:border-[#ffb6c1] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8a8480] mb-1.5 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#f1ece8] bg-[#fffdfb] text-sm focus:outline-none focus:border-[#bde0fe] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8a8480] mb-1.5 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#f1ece8] bg-[#fffdfb] text-sm focus:outline-none focus:border-[#cdb4db] transition-colors"
                />
                <p className="text-xs text-[#8a8480] mt-1.5 ml-1">
                  8+ characters, with upper &amp; lowercase, a number, and a
                  symbol.
                </p>
              </div>

              <button
                type="button"
                className="w-full font-bold text-base bg-[#ffb6c1] text-[#2E2A28] px-6 py-3.5 rounded-full shadow-lg shadow-[#ffb6c1]/40 hover:-translate-y-0.5 transition-transform mt-2"
                onClick={handleSignUp}
              >
                Create account
              </button>
            </div>

            <p className="text-center text-sm text-[#8a8480] mt-6">
              Already tracking your skills?{" "}
              <Link
                to="/login"
                className="font-bold text-[#a13f5c] hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SignUp;