import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const FRAUD_API = import.meta.env.VITE_FRAUD_API_URL || "http://localhost:8000";

function ReportVerifyPage() {
  const { reportId } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${FRAUD_API}/upload_file/reports/${reportId}/verify`,
          { timeout: 30000 }
        );
        setResult(response.data);
      } catch (error) {
        setResult({
          success: false,
          error: error?.response?.data?.error || error?.message || "Verification failed",
          report_id: reportId,
        });
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      run();
    } else {
      setResult({ success: false, error: "Missing report id" });
      setLoading(false);
    }
  }, [reportId]);

  const state = useMemo(() => {
    if (!result) {
      return "loading";
    }
    if (result.success === false) {
      return "error";
    }
    if (result.is_tamper_free) {
      return "ok";
    }
    return "tampered";
  }, [result]);

  const cardClass =
    state === "ok"
      ? "bg-emerald-50 border-emerald-500 text-emerald-900"
      : state === "tampered"
      ? "bg-red-50 border-red-500 text-red-900"
      : "bg-amber-50 border-amber-500 text-amber-900";

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center px-4 py-12">
      <div className={`w-full max-w-3xl rounded-xl border-l-8 shadow-lg p-8 ${cardClass}`}>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-wide">RECOVA Report Verification</h1>
          <Link to="/" className="text-sm underline">Back Home</Link>
        </div>

        <p className="mt-2 text-sm opacity-80">Report ID: {reportId || "N/A"}</p>

        {loading && <p className="mt-6 text-lg">Checking blockchain integrity...</p>}

        {!loading && state === "ok" && (
          <>
            <h2 className="mt-6 text-3xl font-extrabold">AUTHENTICATED VIA BLOCKCHAIN</h2>
            <p className="mt-2">Current database hash matches anchored blockchain hash.</p>
          </>
        )}

        {!loading && state === "tampered" && (
          <>
            <h2 className="mt-6 text-3xl font-extrabold">DATA MODIFIED</h2>
            <p className="mt-2">Current database hash does not match blockchain hash.</p>
          </>
        )}

        {!loading && state === "error" && (
          <>
            <h2 className="mt-6 text-3xl font-extrabold">VERIFICATION FAILED</h2>
            <p className="mt-2">{result?.error || "Unable to verify report."}</p>
          </>
        )}

        {!loading && result && (
          <div className="mt-6 space-y-2 text-sm break-all">
            {result.current_hash && <p><strong>Current Hash:</strong> {result.current_hash}</p>}
            {result.blockchain_hash && <p><strong>Blockchain Hash:</strong> {result.blockchain_hash}</p>}
            {result.status && <p><strong>Status:</strong> {result.status}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportVerifyPage;