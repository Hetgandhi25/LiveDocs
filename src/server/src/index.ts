import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { getDocumentFromLocalStorage } from "./utils/localstorage";
dotenv.config();
import {
  findOrCreateDocument,
  updateDocument,
} from "./controllers/documentController";

const PORT = Number(process.env.PORT || 3000);

mongoose
  .connect(process.env.DATABASE_URL || "", { dbName: "Google-Docs" })
  .then(() => {
    console.log("Database connected.");
  })
  .catch((error) => {
    console.log("DB connection failed. " + error);
  });

const io = new Server(PORT, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const activeUsersPerDocument: Record<string, Record<string, string>> = {};

io.on("connection", (socket) => {

  socket.on(
    "get-document",
    async ({
      documentId,
      documentName,
      username,
    }: {
      documentId: string;
      documentName: string;
      username: string;
    }) => {
      socket.join(documentId);

      // Track active users
      if (!activeUsersPerDocument[documentId]) {
        activeUsersPerDocument[documentId] = {};
      }
      activeUsersPerDocument[documentId][socket.id] = username;

      // Send active users to room
      io.to(documentId).emit(
        "active-users",
        Object.values(activeUsersPerDocument[documentId])
      );

      const document = await getDocumentFromLocalStorage(documentId);
      if (!document) {
        const newDocument = await findOrCreateDocument({
          documentId,
          documentName,
        });
        if (newDocument) {
          socket.emit("load-document", newDocument.data);
        }
      }
      if (document) socket.emit("load-document", document.content);

      socket.on("send-changes", (delta) => {
        socket.broadcast.to(documentId).emit("receive-changes", delta);
      });

      socket.on("save-document", async (data) => {
        await updateDocument(documentId, { data });
      });

      socket.on("disconnect", () => {
        if (activeUsersPerDocument[documentId]) {
          delete activeUsersPerDocument[documentId][socket.id];
          io.to(documentId).emit(
            "active-users",
            Object.values(activeUsersPerDocument[documentId])
          );
        }
      });
    }
  );
});