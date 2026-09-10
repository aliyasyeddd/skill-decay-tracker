import { rustinessStyle } from "../utils/dashboardHelpers";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SkillCard = ({ skill, onLogPractice, onDelete }) => {
  const [note, setNote] = useState("");

  const navigate = useNavigate();

  const style = rustinessStyle(skill.rustiness);
  const percent = Math.round(skill.rustiness * 100);

  const handleCardClick = () => {
    navigate(`/skills/${skill._id}`);
  };

  const handleLogClick = async (e) => {
    // Stop this click from bubbling up to the card's own onClick,
    // which would otherwise also trigger navigation.
    e.stopPropagation();
    try {
      await onLogPractice(skill._id, note);
      setNote(""); // only clears on confirmed success
    } catch {
      // note stays as-is so the user doesn't lose what they typed
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(skill._id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-full cursor-pointer bg-white/90 backdrop-blur-sm border border-[#f1ece8] rounded-2xl p-5 shadow-sm shadow-[#cdb4db]/10 hover:shadow-md hover:shadow-[#cdb4db]/20 transition-shadow"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-display font-bold text-lg leading-tight">
            {skill.name}
          </h3>
          {skill.category && (
            <p className="text-xs text-[#a8a29c] mt-0.5">{skill.category}</p>
          )}
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${style.badge}`}
        >
          {style.label}
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-[#f1ece8] overflow-hidden mb-1.5">
        <div
          className={`h-full rounded-full ${style.bar}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-[#a8a29c] mb-4">{percent}% rusty</p>

      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        placeholder="What did you work on?"
        className="w-full px-3 py-2 mb-3 rounded-lg border border-[#f1ece8] bg-[#fffdfb] text-xs focus:outline-none focus:border-[#ffb6c1] transition-colors"
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleLogClick}
          className="flex-1 text-sm font-bold bg-[#ffb6c1] text-[#2E2A28] px-4 py-2.5 rounded-full hover:-translate-y-0.5 transition-transform"
        >
          Log practice
        </button>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="text-sm font-bold text-[#a8a29c] hover:text-[#a13f5c] px-3 py-2.5 transition-colors"
          aria-label={`Delete ${skill.name}`}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default SkillCard;
