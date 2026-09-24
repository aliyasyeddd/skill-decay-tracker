import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { rustinessStyle } from "../utils/dashboardHelpers";

const buildFrequencyData = (practiceLog) => {
  // Step 1 — nothing to chart if there's no data
  if (!practiceLog || practiceLog.length === 0) return [];

  // Step 2 — helper: given any date, find the Sunday that starts its week
  const getWeekStart = (dateInput) => {
    const date = new Date(dateInput);
    date.setHours(0, 0, 0, 0); // zero out time so same-day dates always match
    date.setDate(date.getDate() - date.getDay()); // walk backward to Sunday
    return date;
  };

  // Step 3 — tally how many sessions fall into each week
  const counts = {};
  practiceLog.forEach((entry) => {
    const key = getWeekStart(entry.date).toISOString().split("T")[0]; // e.g. "2026-09-05"
    counts[key] = (counts[key] || 0) + 1; // increment, starting from 0 if new
  });

  // Step 4 — find the full range: earliest week to latest week with activity
  const weekKeys = Object.keys(counts).sort();
  const firstWeek = new Date(weekKeys[0]);
  const lastWeek = new Date(weekKeys[weekKeys.length - 1]);

  // Step 5 — walk forward one week at a time across that whole range,
  // filling in 0 for any week that had no practice (this is what makes
  // gaps visible instead of silently skipped)
  const data = [];
  const cursor = new Date(firstWeek);
  while (cursor <= lastWeek) {
    const key = cursor.toISOString().split("T")[0];
    data.push({
      week: cursor.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      sessions: counts[key] || 0, // 0 if this week wasn't in the tally
    });
    cursor.setDate(cursor.getDate() + 7); // move to the next week
  }

  // Step 6 — return the full week-by-week series for the chart
  return data;
};

const SkillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editText, setEditText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const loadSkill = async () => {
    try {
      const res = await api.get(`/skills/${id}`);
      setSkill(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't load that skill.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkill();
  }, [id]);

  const handleStartEdit = (entry) => {
    setEditingEntryId(entry._id);
    setEditText(entry.note || "");
  };

  const handleCancelEdit = () => {
    setEditingEntryId(null);
    setEditText("");
  };

  const handleSaveEdit = async (entryId) => {
    setSavingEdit(true);
    try {
      await api.put(`/skills/${id}/practice/${entryId}`, { note: editText });
      setEditingEntryId(null);
      setEditText("");
      await loadSkill();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't update that entry.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      await api.delete(`/skills/${id}/practice/${entryId}`);
      await loadSkill();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't delete that entry.");
    }
  };

  const style = skill ? rustinessStyle(skill.rustiness) : null;
  const percent = skill ? Math.round(skill.rustiness * 100) : 0;

  const sortedLog = skill?.practiceLog
    ? [...skill.practiceLog].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  const frequencyData = skill?.practiceLog ? buildFrequencyData(skill.practiceLog) : [];

  return (
    <div className="relative min-h-screen w-full bg-[#fffdfb] font-body text-[#2E2A28]">
      <div className="dot-grid-bg" />

      <div className="relative z-20 w-full">
        <nav className="flex items-center justify-between px-8 py-6 max-w-3xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb6c1]"></span>
            Skill Decay
          </Link>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-sm font-bold text-[#8a8480] hover:text-[#a13f5c] transition-colors"
          >
            ← Back to dashboard
          </button>
        </nav>

        <section className="max-w-3xl mx-auto px-6 pb-24">
          {loading ? (
            <p className="text-sm text-[#a8a29c] text-center py-16">Loading...</p>
          ) : error ? (
            <div className="text-sm font-semibold text-[#a13f5c] bg-[#ffb6c1]/15 border border-[#ffb6c1]/40 rounded-xl px-4 py-3 mb-6">
              {error}
            </div>
          ) : null}

          {skill && (
            <>
              <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
                <div>
                  <h1 className="font-display font-bold text-3xl mb-1">{skill.name}</h1>
                  {skill.category && <p className="text-sm text-[#8a8480]">{skill.category}</p>}
                </div>
                <span className={`text-sm font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${style.badge}`}>
                  {style.label}
                </span>
              </div>

              <div className="bg-white/90 border border-[#f1ece8] rounded-2xl p-5 mb-6 shadow-sm shadow-[#cdb4db]/10">
                <div className="w-full h-2.5 rounded-full bg-[#f1ece8] overflow-hidden mb-2">
                  <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${percent}%` }} />
                </div>
                <p className="text-sm text-[#a8a29c]">
                  {percent}% rusty · {skill.practiceLog.length} practice{" "}
                  {skill.practiceLog.length === 1 ? "session" : "sessions"} logged
                </p>
              </div>

              {frequencyData.length > 0 && (
                <div className="bg-white/90 border border-[#f1ece8] rounded-2xl p-5 mb-8 shadow-sm shadow-[#cdb4db]/10">
                  <h2 className="font-display font-bold text-lg mb-1">Practice frequency</h2>
                  <p className="text-xs text-[#a8a29c] mb-4">
                    Sessions per week — gaps show where practice lapsed.
                  </p>
                  <div style={{ width: "100%", height: 200 }}>
                    <ResponsiveContainer>
                      <BarChart data={frequencyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1ece8" vertical={false} />
                        <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#a8a29c" }} axisLine={{ stroke: "#f1ece8" }} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#a8a29c" }} axisLine={{ stroke: "#f1ece8" }} tickLine={false} width={28} />
                        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #f1ece8", fontSize: 12 }} cursor={false} />
                        <Bar dataKey="sessions" fill="#ffb6c1" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <h2 className="font-display font-bold text-xl mb-4">Practice history</h2>

              {sortedLog.length === 0 ? (
                <div className="text-center py-12 bg-white/60 rounded-2xl border border-[#f1ece8]">
                  <p className="text-sm text-[#8a8480]">No practice sessions logged yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedLog.map((entry) => {
                    const isEditing = editingEntryId === entry._id;
                    return (
                      <div key={entry._id} className="bg-white/90 border border-[#f1ece8] rounded-xl px-5 py-4">
                        <p className="text-xs font-bold text-[#a8a29c] mb-1">
                          {new Date(entry.date).toLocaleDateString(undefined, {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>

                        {isEditing ? (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              placeholder="What did you work on?"
                              className="w-full px-3 py-2 mb-2 rounded-lg border-2 border-[#ffb6c1] bg-[#fffdfb] text-sm focus:outline-none transition-colors"
                              autoFocus
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(entry._id)}
                                disabled={savingEdit}
                                className="text-xs font-bold bg-[#ffb6c1] text-[#2E2A28] px-3 py-1.5 rounded-full disabled:opacity-60"
                              >
                                {savingEdit ? "Saving..." : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="text-xs font-bold text-[#a8a29c] hover:text-[#a13f5c] px-3 py-1.5 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-3">
                            {entry.note ? (
                              <p className="text-sm text-[#2E2A28]">{entry.note}</p>
                            ) : (
                              <p className="text-sm text-[#c9c4be] italic">No note added</p>
                            )}
                            <div className="flex items-center gap-3 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(entry)}
                                className="text-xs font-bold text-[#a8a29c] hover:text-[#2b5f8a] transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteEntry(entry._id)}
                                className="text-xs font-bold text-[#a8a29c] hover:text-[#a13f5c] transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default SkillDetail;