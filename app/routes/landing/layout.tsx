import { Outlet } from "react-router";
import React from "react";

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  );
}