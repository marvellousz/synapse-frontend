"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PixelBlast from "@/components/PixelBlast";
import AppNav from "@/components/AppNav";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function MemoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { state } = useAuth();

  useEffect(() => {
    if (state.status === "unauthenticated") {
      router.replace("/login");
    }
  }, [state.status, router]);

  if (state.status === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0F172A", color: "#94A3B8" }}
      >
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (state.status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 -z-10"
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#0F172A",
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 opacity-40">
          <PixelBlast
            variant="square"
            pixelSize={4}
            color="#3B82F6"
            patternScale={2}
            patternDensity={1}
            enableRipples
            rippleSpeed={0.35}
            rippleThickness={0.12}
            rippleIntensityScale={1.2}
            liquid={false}
            speed={0.45}
            edgeFade={0.35}
            transparent={true}
          />
        </div>
      </div>
      <AppNav />
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
