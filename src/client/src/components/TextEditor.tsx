import { useState, useEffect, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { SAVE_INTERVAL_MS } from "../constants";
import { io, Socket } from "socket.io-client";
import { useParams, useLocation } from "react-router-dom";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";

const CUSTOM_TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline"],
  [{ color: [] }],
];

export const TextEditor = () => {
  const [socket, setSocket] = useState<Socket>();
  const [quill, setQuill] = useState<Quill>();
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [permission, setPermission] = useState("write");
  const [sharePermission, setSharePermission] = useState("read");
  const [isOwner, setIsOwner] = useState(true);
  const [username, setUsername] = useState("Anonymous");

  const { id: documentId } = useParams();
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  const userPermission = urlParams.get("permission");
  const resolvedPermission = userPermission || "write";

  useEffect(() => {
    let storedUsername = localStorage.getItem("username");

    if (!storedUsername) {
      const promptName = prompt("Enter your name:") || "Anonymous";
      storedUsername = promptName;
      localStorage.setItem("username", promptName);
    }

    setUsername(storedUsername);
    localStorage.setItem("permission", resolvedPermission);
    setPermission(resolvedPermission);
    setIsOwner(!userPermission);
  }, [userPermission, resolvedPermission]);

  useEffect(() => {
    const skt = io(import.meta.env.VITE_SERVER_URL);
    setSocket(skt);
    return () => {
      skt.disconnect();
    };
  }, []);

  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
    if (!wrapper) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    const quillEditor = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: CUSTOM_TOOLBAR_OPTIONS,
      },
    });
    quillEditor.disable();
    quillEditor.setText("Loading...");
    setQuill(quillEditor);
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta: any, _: any, source: any) => {
      if (source !== "user" || permission === "read") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill, permission]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta: any) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handler);
    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      permission === "write" ? quill.enable() : quill.disable();
    });

    const documentName =
      localStorage.getItem(`document-name-for-${documentId}`) || "Untitled";

    socket.emit("get-document", {
      documentId,
      documentName,
      username,
      permission,
    });
  }, [socket, quill, documentId, username, permission]);

  useEffect(() => {
    if (!socket || !quill || permission === "read") return;
    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      localStorage.clear();
    };
  }, [socket, quill, permission]);

  useEffect(() => {
    if (!socket) return;

    const handleActiveUsers = (users: string[]) => {
      setActiveUsers(users);
    };

    socket.on("active-users", handleActiveUsers);
    return () => {
      socket.off("active-users", handleActiveUsers);
    };
  }, [socket]);

  const handleShareClick = () => {
    setSharePermission("read");
    setShowShareModal(true);
  };

  const copyLink = () => {
    const baseUrl = window.location.origin;
    const shareLink = `${baseUrl}/documents/${documentId}?permission=${sharePermission}`;
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
  };

  const handleDownload = async () => {
    if (!quill) return;
    const text = quill.getText().split("\n").map(line => new Paragraph(line));
    const doc = new Document({ sections: [{ children: text }] });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "document.docx");
  };

  return (
    <div className="text-editor-container bg-light" style={{ minHeight: "100vh" }}>
      <div className="d-flex justify-content-between align-items-center border-bottom p-3 bg-white shadow-sm">
        <div>
          <strong>Active Users:</strong> {activeUsers.join(", ")}
        </div>
        <div>
          {isOwner && (
            <button className="btn btn-outline-primary me-2" onClick={handleShareClick}>
              Share
            </button>
          )}
          <button className="btn btn-outline-success" onClick={handleDownload}>
            Download DOCX
          </button>
        </div>
      </div>

      <div className="editorContainer p-4" ref={wrapperRef}></div>

      {showShareModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Share Document</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowShareModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Room ID:</strong> {documentId}</p>
                <label className="form-label">Permission:</label>
                <select
                  className="form-select"
                  value={sharePermission}
                  onChange={(e) => setSharePermission(e.target.value)}
                >
                  <option value="read">Read Only</option>
                  <option value="write">Can Edit</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={copyLink}>
                  Copy Shareable Link
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowShareModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};