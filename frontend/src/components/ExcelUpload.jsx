// import React, { useState } from "react";
// import { submitExcel } from "C:\\Users\\akn\\excel-mock-interviewer\\frontend\\src\\api\\backend.js";

// const ExcelUpload = ({ sessionId, onReport }) => {
//   const [file, setFile] = useState(null);

//   const handleSubmit = async () => {
//     if (!file) return;
//     try {
//       const report = await submitExcel(sessionId, file);
//       onReport(report); // Pass report back to parent
//     } catch (err) {
//       console.error("Upload failed", err);
//       alert("❌ Failed to evaluate Excel. Try again.");
//     }
//   };

//   return (
//     <div style={{ marginTop: "20px" }}>
//       <h3>📂 Upload your Excel file for evaluation</h3>
//       <input
//         type="file"
//         accept=".xlsx"
//         onChange={(e) => setFile(e.target.files[0])}
//       />
//       <button
//         onClick={handleSubmit}
//         style={{ marginTop: "10px", display: "block" }}
//       >
//         Submit Excel
//       </button>
//     </div>
//   );
// };

// export default ExcelUpload;



import React, { useState } from "react";

function ExcelUpload({ sessionId }) {
  const [answer, setAnswer] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [report, setReport] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("answer", answer);
    if (excelFile) {
      formData.append("excel_file", excelFile);
    }

    const res = await fetch(`http://localhost:8000/session/${sessionId}/submit`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Report:", data);  // debug log
    setReport(data);  // ✅ save report to state
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your final answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="border p-2"
        />
        <input
          type="file"
          onChange={(e) => setExcelFile(e.target.files[0])}
          className="mt-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">
          Submit Excel
        </button>
      </form>

      {report && (
        <div className="mt-4 p-3 border">
          <h3 className="font-bold">Evaluation Report</h3>
          <pre>{JSON.stringify(report, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ExcelUpload;


