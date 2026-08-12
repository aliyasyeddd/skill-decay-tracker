import { getSkills } from "./api/skills";
import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    getSkills()
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="App">
        <h1>Welcome to the App</h1>
      </div>
    </>
  );
}

export default App;
