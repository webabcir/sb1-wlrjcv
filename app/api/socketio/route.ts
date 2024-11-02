import { Server } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/next";

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socketio",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      socket.on("customerUpdate", (data) => {
        socket.broadcast.emit("customerUpdated", data);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}