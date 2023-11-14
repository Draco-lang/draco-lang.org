"use client";

import { useEffect, useState } from "react";
import "./DiscordWidget.css";

export default function DiscordWidget() {
  const [info, setInfo] = useState({ online: "???", members: "???" });
  useEffect(() => {
    const fetchDiscordDataAsync = async () => {
      try {
        const data = await (await fetch("https://discord.com/api/v9/invites/cCwUgjKUuK?with_counts=true")).json();
        setInfo({
          online: data.approximate_presence_count,
          members: data.approximate_member_count,
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchDiscordDataAsync();
  }, []);
  return (
    <div className="discord-widget">
      <div className="content">
        <div className="header-line">
          <div className="server-icon"></div>
          <div className="server-info">
            <a
              href="https://discord.draco-lang.org"
              style={{
                textDecoration: "none",
                color: "white",
                width: "100%",
              }}
            >
              <h3 className="server-name">Draco</h3>
            </a>
            <div className="status-counts">
              <div className="status-wrapper">
                <i className="status-online"></i>
                <span className="statusCount">{info.online} Online</span>
              </div>
              <div className="status-wrapper">
                <i className="status-offline"></i>
                <span className="statusCount">{info.members} Members</span>
              </div>
            </div>
          </div>
        </div>
        <a href="https://discord.draco-lang.org">
          <button>Join</button>
        </a>
      </div>
    </div>
  );
}
