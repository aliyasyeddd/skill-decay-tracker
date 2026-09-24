import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/api";
import SkillCard from "../components/SkillCard";
import Logout from "../components/Logout";
import Toast from "../components/Toast";

const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [creating, setCreating] = useState(false);

  const loadSkills = async () => {
    try {
      const res = await api.get("/skills/ranked");
      setSkills(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't load your skills.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;

    setCreating(true);
    try {
      await api.post("/skills", {
        name: newName.trim(),
        category: newCategory.trim(),
      });
      setNewName("");
      setNewCategory("");
      setShowForm(false);
      await loadSkills();
      setToastMessage("Skill added!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't create that skill.");
    } finally {
      setCreating(false);
    }
  };

  const handleLogPractice = async (skillId, note) => {
    setSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill._id === skillId ? { ...skill, rustiness: 0 } : skill,
      ),
    );
    try {
      await api.post(`/skills/${skillId}/practice`, { note });
      await loadSkills();
    } catch (error) {
      setError(
        error?.response?.data?.message || "Couldn't log that practice session.",
      );
      await loadSkills();
      throw error;
    }
  };

  const handleDelete = async (skillId) => {
    try {
      await api.delete(`/skills/${skillId}`);
      await loadSkills();
    } catch (error) {
      setError(error?.response?.data?.message || "Couldn't delete that skill.");
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#fffdfb] font-body text-[#2E2A28]">
      <div className="dot-grid-bg" />

      <div className="relative z-20 w-full">
        <nav className="flex items-center justify-between px-8 py-6 max-w-5xl mx-auto w-full">
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-bold text-lg"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb6c1]"></span>
            Skill Decay
          </Link>
          <Logout />
        </nav>

        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div>
              <h1 className="font-display font-bold text-3xl mb-1">
                Your{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #ffb6c1, #f1c0e8, #cdb4db)",
                  }}
                >
                  skills
                </span>
              </h1>
              <p className="text-sm text-[#8a8480]">
                Sorted by what needs your attention first.
              </p>
            </div>
            <button
              type="button"
              className="font-bold text-sm bg-[#ffb6c1] text-[#2E2A28] px-5 py-2.5 rounded-full shadow-md shadow-[#ffb6c1]/40 hover:-translate-y-0.5 transition-transform"
              onClick={() => setShowForm((open) => !open)}
            >
              {showForm ? "Cancel" : "+ Add a skill"}
            </button>
          </div>

          {showForm && (
            <div className="bg-white/90 border border-[#f1c0e8]/40 rounded-2xl p-5 mb-6 shadow-sm shadow-[#cdb4db]/10">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Skill name (e.g. Spanish)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[#f1ece8] bg-[#fffdfb] text-sm focus:outline-none focus:border-[#ffb6c1] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Category (optional)"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[#f1ece8] bg-[#fffdfb] text-sm focus:outline-none focus:border-[#bde0fe] transition-colors"
                />
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={creating || !newName.trim()}
                  className="font-bold text-sm bg-[#2E2A28] text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  {creating ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 text-sm font-semibold text-[#a13f5c] bg-[#ffb6c1]/15 border border-[#ffb6c1]/40 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-[#a8a29c] text-center py-16">
              Loading your skills...
            </p>
          ) : skills.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display font-bold text-xl mb-2">
                No skills yet
              </p>
              <p className="text-sm text-[#8a8480]">
                Add your first one above to start tracking.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <SkillCard
                  key={skill._id}
                  skill={skill}
                  onLogPractice={handleLogPractice}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
        <Toast
          message={toastMessage}
          visible={!!toastMessage}
          onDismiss={() => setToastMessage("")}
        />
      </div>
    </div>
  );
};

export default Dashboard;
