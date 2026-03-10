"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { getViews, incrementViews } from "@/actions/views";

export default function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const hasViewed = sessionStorage.getItem("hasViewed");

    if (!hasViewed) {
      incrementViews().then((count) => {
        setViews(count);
        sessionStorage.setItem("hasViewed", "true");
      });
    } else {
      getViews().then(setViews);
    }
  }, []);

  if (views === null) return null;

  return (
    <div className="flex items-center justify-center px-2 py-1 fixed top-4 right-4 z-50 text-xs text-error bg-lime/60 text-molten rounded-xs">
      <Eye className="w-4 h-4 mr-1" />
      {views.toLocaleString()} views
    </div>
  );
}
