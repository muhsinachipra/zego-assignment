// app-a\src\App.jsx

import React, { useEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ZIM } from "zego-zim-web";

const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

export default function App() {
  const [zp, setZp] = useState(null);
  const [callStatus, setCallStatus] = useState("");

  // Configuration for THIS User (User A)
  const userID = "user_a";
  const userName = "User A";

  // Configuration for the TARGET User (User B)
  const targetUserID = "user_b";
  const targetUserName = "User B";

  useEffect(() => {
    const initZego = async () => {
      // 1. Generate Kit Token
      const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        userID, // Room ID can be same as User ID for 1-on-1 invitation scenarios or null
        userID,
        userName
      );

      // 2. Create instance
      const zegoInstance = ZegoUIKitPrebuilt.create(KitToken);

      // 3. Add ZIM Plugin (Required for Call Invitations)
      zegoInstance.addPlugins({ ZIM });

      // 4. Initialize the Call Invitation Service
      zegoInstance.setCallInvitationConfig({
        onCallInvitationEnded: (reason) => {
          console.log("Call ended reason:", reason); // Good for debugging

          if (reason === "Declined") {
            setCallStatus("Call was declined.");
            setTimeout(() => setCallStatus(""), 3000); // Hide after 3s
          } else if (reason === "Busy") {
            alert("The other user is currently busy.");
          } else if (reason === "Timeout") {
            alert("The call timed out. User didn't answer.");
          }
        },
      });

      setZp(zegoInstance);
    };

    initZego();
  }, []);

  const handleSendCall = () => {
    if (!zp) return;

    const targetUser = {
      userID: targetUserID,
      userName: targetUserName,
    };

    zp.sendCallInvitation({
      callees: [targetUser],
      callType: ZegoUIKitPrebuilt.InvitationTypeVoiceCall, // VOICE Call
      timeout: 60,
    })
      .then((res) => {
        console.warn(res);
        if (res.errorInvitees.length) {
          alert("User B is offline or not found.");
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5", // Light background
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Soft shadow
          textAlign: "center",
          minWidth: "300px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#e3f2fd",
            borderRadius: "50%",
            margin: "0 auto 20px auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px",
          }}
        >
          👤
        </div>

        <h1 style={{ margin: "0 0 10px 0", color: "#333", fontSize: "24px" }}>
          {userName}
        </h1>

        <p style={{ color: "#666", marginBottom: "30px", fontSize: "14px" }}>
          Ready to connect
        </p>

        <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
          <p style={{ marginBottom: "15px", fontWeight: "500", color: "#444" }}>
            Outgoing Call
          </p>

          <button
            onClick={handleSendCall}
            style={{
              width: "100%",
              padding: "12px",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              transition: "background 0.3s",
            }}
          >
            📞 Call {targetUserName}
          </button>
        </div>

        {/* Status Message */}
        {callStatus && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            {callStatus}
          </div>
        )}
      </div>

      <p style={{ marginTop: "20px", fontSize: "0.8rem", color: "#999" }}>
        Running on Port 3000
      </p>
    </div>
  );
}
