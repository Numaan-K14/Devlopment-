import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PersonalForm from "../MultiStepper/PersonalForm";
import ParentForm from "../MultiStepper/ParentForm";
import Summary from "../MultiStepper/Summary";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 shadow-md rounded-lg">
          <Routes>
            <Route path="/" element={<PersonalForm />} />
            <Route path="/parent" element={<ParentForm />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
