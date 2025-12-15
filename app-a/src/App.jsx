import React, { useEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ZIM } from "zego-zim-web";

const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

export default function App() {
  const [zp, setZp] = useState(null);

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
        // Optional: Hooks for call status
        onCallInvitationEnded: (reason) => {
          console.log("Call ended reason:", reason);
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
        gap: "20px",
      }}
    >
      <h1>I am {userName}</h1>
      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3>Call {targetUserName}</h3>
        <button
          onClick={handleSendCall}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Voice Call
        </button>
      </div>
      <p style={{ fontSize: "0.8rem", color: "gray" }}>Running on Port 3000</p>
    </div>
  );
}
