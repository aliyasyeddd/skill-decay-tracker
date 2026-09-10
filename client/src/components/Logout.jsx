import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../utils/constants";


const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/logout`, {}, { withCredentials: true });
    } finally {
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