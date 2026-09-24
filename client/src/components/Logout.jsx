import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { clearToken } from "../utils/authToken";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout", {});
    } finally {
      clearToken();
      navigate("/login");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm font-bold text-[#8a8480] hover:text-[#a13f5c] transition-colors"
    >
      Log out
    </button>
  );
};

export default Logout;
