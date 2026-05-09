"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  User,
  FileText,
  BarChart2,
  Wallet,
  Settings,
  Sun,
  Moon,
  LucideIcon,
  TrendingDown,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  FileStack,
  ScrollText,
  ClipboardList,
  Shield,
  Sliders,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_WIDTH = 600;
const PANEL_WIDTH = 220;

// ─── Types ────────────────────────────────────────────────────────────────────

type PanelItem = { icon: LucideIcon; label: string };
type NavItemDef = { id: string; icon: LucideIcon; label: string; panel: PanelItem[] };

// ─── Data — exactly 3 items per panel ─────────────────────────────────────────

const NAV_ITEMS: NavItemDef[] = [
  {
    id: "home",
    icon: Home,
    label: "Home",
    panel: [
      { icon: TrendingUp, label: "Overview" },
      { icon: ArrowUpRight, label: "Activity" },
      { icon: CreditCard, label: "Transactions" },
    ],
  },
  {
    id: "profile",
    icon: User,
    label: "Profile",
    panel: [
      { icon: User, label: "Account" },
      { icon: Sliders, label: "Preferences" },
      { icon: Shield, label: "Security" },
    ],
  },
  {
    id: "documents",
    icon: FileText,
    label: "Documents",
    panel: [
      { icon: FileStack, label: "Invoices" },
      { icon: ScrollText, label: "Contracts" },
      { icon: ClipboardList, label: "Reports" },
    ],
  },
  {
    id: "analytics",
    icon: BarChart2,
    label: "Analytics",
    panel: [
      { icon: TrendingUp, label: "Earnings" },
      { icon: TrendingDown, label: "Refunds" },
      { icon: ArrowUpRight, label: "Payouts" },
    ],
  },
  {
    id: "wallet",
    icon: Wallet,
    label: "Wallet",
    panel: [
      { icon: CreditCard, label: "Cards" },
      { icon: ArrowUpRight, label: "Send" },
      { icon: TrendingUp, label: "Top up" },
    ],
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
    panel: [
      { icon: Sliders, label: "General" },
      { icon: Shield, label: "Privacy" },
      { icon: User, label: "Team" },
    ],
  },
];

// ─── Motion ────────────────────────────────────────────────────────────────────

const EASE = { duration: 0.14, ease: [0.25, 0.1, 0.25, 1] } as const;
const SPRING_ICON = { type: "spring" as const, stiffness: 480, damping: 28 };
// Liquid bounce — underdamped, very fast
const SPRING_LIQUID = { type: "spring" as const, stiffness: 900, damping: 12, mass: 0.7 };
const SPRING_ITEM = { type: "spring" as const, stiffness: 540, damping: 24 };

// ─── Theme — background & grid NEVER change ────────────────────────────────────

function useColors(isDark: boolean) {
  return {
    // These never change — always light
    canvas: "#EDEDED" as const,
    grid: "rgba(0,0,0,0.03)" as const,

    // Nav shell
    navLight: "#F8F8F8" as const,
    navDark: "#1C1C1E" as const,
    navBorder: isDark ? "rgba(255,255,255,0.11)" : "#FFFFFF",
    // No shadow in dark mode
    navShadow: isDark ? "none" : "0px 4px 12px #EAEAEA",

    divider: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
    iconDefault: isDark ? "#787878" : "#8A8A8A",
    activeGrad: "linear-gradient(145deg, #2c2c2e 0%, #1c1c1e 100%)" as const,
    activeShadow: isDark
      ? "inset 0 1px 0 rgba(255,255,255,0.09)"
      : "0 2px 10px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.09)",
    hoverBg: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.052)",

    panel: isDark ? "#1C1C1E" : "#F8F8F8",
    panelBorder: isDark ? "rgba(255,255,255,0.11)" : "#FFFFFF",
    // No shadow in dark mode
    panelShadow: isDark
      ? "none"
      : "0px 8px 32px rgba(0,0,0,0.09), 0px 2px 8px rgba(0,0,0,0.05)",
    text: isDark ? "#F0F0F0" : "#1A1A1A",
    textSub: isDark ? "#666666" : "#8A8A8A",
    itemHover: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.042)",
    itemIconBg: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.03)",
    itemIconBgHover: isDark ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.06)",
    themeBtn: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
    themeBtnHover: isDark ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.07)",
  } as const;
}

type Colors = ReturnType<typeof useColors>;

// Shared CSS transition string for color-only properties
const CT = "color 0.18s linear, background-color 0.18s linear, border-color 0.18s linear, box-shadow 0.18s linear";

// ─── MacDots ──────────────────────────────────────────────────────────────────

function MacDots() {
  return (
    <div className="flex items-center gap-[6px] pl-1 flex-shrink-0">
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
        <motion.div
          key={i}
          className="w-[11px] h-[11px] rounded-full cursor-pointer"
          style={{ background: c }}
          whileHover={{ scale: 1.14 }}
          whileTap={{ scale: 0.86 }}
          transition={EASE}
        />
      ))}
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function Tooltip({ label }: { label: string }) {
  return (
    <motion.div
      className="absolute -top-9 left-1/2 -translate-x-1/2 pointer-events-none z-50"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 3 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
    >
      <div
        className="whitespace-nowrap px-[10px] py-[5px] rounded-2xl text-white text-[11px] font-medium"
        style={{
          background: "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)",
          boxShadow: "0 4px 14px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

// ─── NavIcon ──────────────────────────────────────────────────────────────────

type NavIconProps = {
  item: NavItemDef;
  isActive: boolean;
  onClick: () => void;
  colors: Colors;
};

const NavIcon = React.forwardRef<HTMLDivElement, NavIconProps>(
  ({ item, isActive, onClick, colors }, ref) => {
    const [hovered, setHovered] = useState(false);
    const Icon = item.icon;

    return (
      <div ref={ref} className="relative flex flex-col items-center">
        <AnimatePresence>
          {hovered && !isActive && <Tooltip label={item.label} />}
        </AnimatePresence>

        <motion.button
          className="flex items-center justify-center w-[44px] h-[44px] rounded-[13px] outline-none cursor-pointer"
          style={{
            background: isActive ? colors.activeGrad : hovered ? colors.hoverBg : "transparent",
            boxShadow: isActive ? colors.activeShadow : "none",
            transition: CT,
          }}
          animate={{ y: isActive ? -2 : 0, scale: isActive ? 1.03 : 1 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9, y: 0 }}
          transition={isActive ? SPRING_ICON : EASE}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          onClick={onClick}
        >
          <Icon
            size={18}
            strokeWidth={isActive ? 2.2 : 1.9}
            color={isActive ? "#FFFFFF" : colors.iconDefault}
          />
        </motion.button>
      </div>
    );
  }
);
NavIcon.displayName = "NavIcon";

// ─── PanelItem ────────────────────────────────────────────────────────────────

function PanelItem({ item, index, colors }: { item: PanelItem; index: number; colors: Colors }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.button
      className="w-full flex items-center gap-3 px-3 py-[9px] rounded-xl text-left outline-none cursor-pointer"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_ITEM, delay: index * 0.016 }}
      style={{ background: hovered ? colors.itemHover : "transparent", transition: CT }}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <div
        className="flex items-center justify-center w-[30px] h-[30px] rounded-[9px] flex-shrink-0"
        style={{
          background: hovered ? colors.itemIconBgHover : colors.itemIconBg,
          transition: CT,
        }}
      >
        <Icon size={14} strokeWidth={1.9} color={colors.text} style={{ transition: CT }} />
      </div>
      <span
        className="text-[13px] font-medium"
        style={{ color: colors.text, letterSpacing: "-0.01em", transition: CT }}
      >
        {item.label}
      </span>
    </motion.button>
  );
}

// ─── FloatingPanel ────────────────────────────────────────────────────────────

function FloatingPanel({ item, left, colors }: { item: NavItemDef; left: number; colors: Colors }) {
  return (
    <motion.div
      key={item.id}
      className="absolute top-full mt-3 z-40"
      style={{ left, width: PANEL_WIDTH, transformOrigin: "top left" }}
      // Liquid drop: fast spring with visible bounce + squash from top
      initial={{ opacity: 0, y: -18, scaleY: 0.62, scaleX: 1.04 }}
      animate={{ opacity: 1, y: 0, scaleY: 1, scaleX: 1 }}
      exit={{ opacity: 0, y: -8, scaleY: 0.94, transition: { duration: 0.1, ease: "easeIn" } }}
      transition={SPRING_LIQUID}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="rounded-[22px] p-2"
        style={{
          background: colors.panel,
          border: `1.5px solid ${colors.panelBorder}`,
          boxShadow: colors.panelShadow,
          transition: CT,
        }}
      >
        <div className="px-3 pt-2 pb-1 mb-1">
          <span
            className="text-[10px] font-semibold uppercase"
            style={{ color: colors.textSub, letterSpacing: "0.09em", transition: CT }}
          >
            {item.label}
          </span>
        </div>
        <div className="flex flex-col gap-[2px]">
          {item.panel.map((p, i) => (
            <PanelItem key={p.label} item={p} index={i} colors={colors} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── ThemeButton ──────────────────────────────────────────────────────────────

function ThemeButton({ isDark, onToggle, colors }: { isDark: boolean; onToggle: () => void; colors: Colors }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      className="flex items-center justify-center w-[34px] h-[34px] rounded-[11px] outline-none cursor-pointer flex-shrink-0"
      style={{ background: hovered ? colors.themeBtnHover : colors.themeBtn, transition: CT }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.86 }}
      transition={EASE}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onToggle}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -50, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 50, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 420, damping: 18 }}
          >
            <Moon size={15} strokeWidth={1.8} color="#E0E0E0" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 50, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -50, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 420, damping: 18 }}
          >
            <Sun size={15} strokeWidth={1.8} color={colors.iconDefault} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function HorizontalSidebarInteraction() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [panelLeft, setPanelLeft] = useState(0);
  const [isDark, setIsDark] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const colors = useColors(isDark);
  const activeItem = NAV_ITEMS.find((n) => n.id === activeId) ?? null;

  const handleIconClick = (id: string) => {
    if (activeId === id) {
      setActiveId(null);
      return;
    }
    const iconEl = iconRefs.current[id];
    const navEl = navRef.current;
    if (iconEl && navEl) {
      const iconRect = iconEl.getBoundingClientRect();
      const navRect = navEl.getBoundingClientRect();
      // Right-align: panel's LEFT edge = icon's LEFT edge
      const iconLeft = iconRect.left - navRect.left;
      const clamped = Math.max(8, Math.min(NAV_WIDTH - PANEL_WIDTH - 8, iconLeft));
      setPanelLeft(clamped);
    }
    setActiveId(id);
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center"
      // Background and grid are HARDCODED — dark mode never touches these
      style={{ background: "#EDEDED", fontFamily: "var(--font-inter), sans-serif" }}
      onClick={() => setActiveId(null)}
    >
      {/* Static grid — always light */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px",
        }}
      />

      {/* Nav outer wrapper — ref for icon measurement */}
      <div className="relative" ref={navRef} onClick={(e) => e.stopPropagation()}>

        {/*
          Two-layer nav shell:
          - Outer shell: border + shadow (CSS transition), overflow:hidden clips the wipe
          - Light base layer: always visible underneath
          - Dark wipe layer: clip-path sweeps left→right on toggle (linear, fast)
          - Content layer: absolutely stacked on top, NOT inside overflow:hidden
            so tooltips can escape the nav bounds
        */}
        <div style={{ position: "relative", width: NAV_WIDTH, height: 88 }}>

          {/* Shell — overflow:hidden clips the dark wipe to the pill shape */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 32,
              overflow: "hidden",
              border: `1.5px solid ${colors.navBorder}`,
              boxShadow: colors.navShadow,
              transition: CT,
            }}
          >
            {/* Light base — always present */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: colors.navLight,
              }}
            />

            {/* Dark wipe — clip-path sweeps RIGHT → LEFT on isDark */}
            <motion.div
              style={{ position: "absolute", inset: 0, background: colors.navDark }}
              initial={false}
              animate={{
                clipPath: isDark
                  ? "inset(0 0% 0 0%)"      // fully visible
                  : "inset(0 0% 0 100%)",   // clipped from left = dark vanishes rightward
              }}
              transition={{ duration: 0.16, ease: "linear" }}
            />
          </div>

          {/* Content — sits above shell, outside overflow:hidden */}
          <div
            className="absolute inset-0 flex items-center gap-4 px-5"
            style={{ zIndex: 10 }}
          >
            <MacDots />

            <div
              className="flex-shrink-0 w-px self-stretch my-5"
              style={{ background: colors.divider, transition: CT }}
            />

            <div className="flex-1 flex items-center justify-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavIcon
                  key={item.id}
                  item={item}
                  isActive={activeId === item.id}
                  onClick={() => handleIconClick(item.id)}
                  ref={(el) => { iconRefs.current[item.id] = el; }}
                  colors={colors}
                />
              ))}
            </div>

            <div
              className="flex-shrink-0 w-px self-stretch my-5"
              style={{ background: colors.divider, transition: CT }}
            />

            <ThemeButton
              isDark={isDark}
              onToggle={() => setIsDark((d) => !d)}
              colors={colors}
            />
          </div>
        </div>

        {/* Floating panel — right-aligned to clicked icon */}
        <AnimatePresence mode="wait">
          {activeItem && (
            <FloatingPanel
              key={activeItem.id}
              item={activeItem}
              left={panelLeft}
              colors={colors}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
