import React, { useEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ZIM } from "zego-zim-web";

const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

export default function App() {
  const [zp, setZp] = useState(null);

  // Configuration for THIS User (User B)
  const userID = "user_b";
  const userName = "User B";

  // Configuration for the TARGET User (User A)
  const targetUserID = "user_a";
  const targetUserName = "User A";

  useEffect(() => {
    const initZego = async () => {
      // 1. Generate Kit Token
      const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        userID,
        userID,
        userName
      );

      // 2. Create instance
      const zegoInstance = ZegoUIKitPrebuilt.create(KitToken);

      // 3. Add ZIM Plugin
      zegoInstance.addPlugins({ ZIM });

      // 4. Initialize
      zegoInstance.setCallInvitationConfig({
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
      callType: ZegoUIKitPrebuilt.InvitationTypeVoiceCall,
      timeout: 60,
    })
      .then((res) => {
        console.warn(res);
        if (res.errorInvitees.length) {
          alert("User A is offline or not found.");
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
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Voice Call
        </button>
      </div>
      <p style={{ fontSize: "0.8rem", color: "gray" }}>Running on Port 3001</p>
    </div>
  );
}
