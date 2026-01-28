"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Footer() {
  const [time, setTime] = useState("");
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!buildTime) {
    return <footer className="w-full border-t border-molten p-6" />;
  }

  const lastUpdate = new Date(buildTime).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <footer className="w-full bg-molten text-lime text-sm md:h-18">
      {/* Mobile layout - flexbox with space-between */}
      <div className="flex md:hidden justify-between p-3">
        <div className="flex items-center">
          <Image
            src="/logo-lime.svg"
            alt="Stork Logo"
            width={24}
            height={24}
            priority
          />
        </div>
        <div className="flex flex-col gap-0">
          <p>Last updated on {lastUpdate}</p>
          <p>San Francisco, USA {time && <span>- {time}</span>}</p>
        </div>
      </div>

      {/* Desktop layout - 3 columns */}
      <div
        className="hidden md:grid h-full"
        style={{ gridTemplateColumns: "12rem 28rem 1fr" }}
      >
        <div className="p-3 border-r border-lime flex items-center justify-end">
          <Image
            src="/logo-lime.svg"
            alt="Stork Logo"
            width={24}
            height={24}
            priority
          />
        </div>
        <div className="p-3 border-r border-lime flex items-center">
          <p>Last updated on {lastUpdate}</p>
        </div>
        <div className="p-3 flex items-center justify-end">
          <div className="text-right">
            <p>San Francisco, USA</p>
            {time && <p>{time}</p>}
          </div>
        </div>
      </div>
    </footer>
  );
}
