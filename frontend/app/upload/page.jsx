"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [files, setFiles] = useState(null); 
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/check-auth`, {
          credentials: "include",
        });
        if (!res.ok) router.push("/login");
        else setLoading(false);
      } catch (err) {
        router.push("/login");
      }
    }
    checkAuth();
  }, [router]);

  async function handleUpload(e) {
    e.preventDefault();
    if (!files || files.length === 0) return setMessage("Select files first!");

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]); // match backend field name
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        setMessage("Files uploaded successfully!");
        setFiles(null);
        e.target.reset(); // reset file input
      } else {
        setMessage("Upload failed or unauthorized.");
      }
    } catch (err) {
      setMessage("An error occurred while uploading.");
    }
  }

  if (loading) return <p>Checking login...</p>;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>📁 Upload Files</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />
        <br />
        <button type="submit" style={{ marginTop: "1rem" }}>
          Upload
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}