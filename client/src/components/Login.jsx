import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils/constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${BACKEND_URL}/login`,
        { email, password },
        { withCredentials: true },
      );
      return navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
          <div className="bg-white/90 backdrop-blur-sm border border-[#bde0fe]/40 rounded-3xl shadow-xl shadow-[#cdb4db]/10 px-8 py-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 font-bold text-xs bg-[#bde0fe]/50 text-[#2b5f8a] px-3.5 py-1.5 rounded-full mb-5">
                good to see you again
              </div>
              <h1 className="font-display font-bold text-3xl mb-2">
                Log{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #ffb6c1, #f1c0e8, #cdb4db)",
                  }}
                >
                  in
                </span>
              </h1>
              <p className="text-sm text-[#8a8480]">
                Pick up right where your skills left off.
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
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#f1ece8] bg-[#fffdfb] text-sm focus:outline-none focus:border-[#bde0fe] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8a8480] mb-1.5 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  placeholder="Your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#f1ece8] bg-[#fffdfb] text-sm focus:outline-none focus:border-[#cdb4db] transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="w-full font-bold text-base bg-[#ffb6c1] text-[#2E2A28] px-6 py-3.5 rounded-full shadow-lg shadow-[#ffb6c1]/40 hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:hover:translate-y-0 mt-2"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </div>

            <p className="text-center text-sm text-[#8a8480] mt-6">
              Haven't started tracking yet?{" "}
              <Link
                to="/signup"
                className="font-bold text-[#a13f5c] hover:underline"
              >
                Sign up free
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
