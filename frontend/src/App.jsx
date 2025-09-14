// src/App.jsx
import React, { useState } from "react";
import { startSession, sendAnswer, submitExcel } from "C:\\Users\\akn\\excel-mock-interviewer\\frontend\\src\\api\\backend.js";
import ChatHistory from "./components/ChatHistory";
import QuestionCard from "./components/QuestionCard";
import ExcelUpload from "./components/ExcelUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [interviewDone, setInterviewDone] = useState(false);
  const [report, setReport] = useState(null); // <-- NEW

  const handleStart = async () => {
    try {
      const data = await startSession();
      setSessionId(data.session_id);
      setCurrentQuestion(data.question);
      setMessages([{ role: "system", content: data.question }]);
    } catch (err) {
      toast.error("Failed to start session");
    }
  };

  const handleAnswerSubmit = async (answer) => {
    setMessages((prev) => [...prev, { role: "user", content: answer }]);
    try {
      const data = await sendAnswer(sessionId, answer);
      if (data.next_question) {
        setCurrentQuestion(data.next_question);
        setMessages((prev) => [
          ...prev,
          { role: "system", content: data.next_question },
        ]);
      } else {
        setCurrentQuestion(null);
        setInterviewDone(true);
        toast.success("Interview finished! Upload your Excel file.");
      }
    } catch (err) {
      toast.error("Failed to send answer");
    }
  };

  const handleExcelUpload = async (file) => {
    try {
      const report = await submitExcel(sessionId, file);
      setReport(report); // <-- save to state
      toast.success("Excel evaluated successfully!");
    } catch (err) {
      toast.error("Failed to submit Excel");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>📝 Excel Mock Interview</h1>
      {!sessionId && <button onClick={handleStart}>Start Interview</button>}

      <ChatHistory messages={messages} />

      {currentQuestion && !interviewDone && (
        <QuestionCard question={currentQuestion} onSubmit={handleAnswerSubmit} />
      )}

      {interviewDone && <ExcelUpload onUpload={handleExcelUpload} />}

      {report && (
        <div style={{ marginTop: "20px" }}>
          <h3>📊 Evaluation Report</h3>
          <pre
            style={{
              background: "#f4f4f4",
              padding: "10px",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
