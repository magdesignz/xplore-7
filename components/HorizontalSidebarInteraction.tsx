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
  LogOut,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_WIDTH = 600;
const PANEL_WIDTH = 272;

// ─── Types ────────────────────────────────────────────────────────────────────

type PanelItem = { icon: LucideIcon; label: string };
type NavItemDef = { id: string; icon: LucideIcon; label: string; panel: PanelItem[] };

// ─── Data ─────────────────────────────────────────────────────────────────────

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
      { icon: LogOut, label: "Sign out" },
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
      { icon: CreditCard, label: "Declines" },
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

// ─── Motion configs ────────────────────────────────────────────────────────────

const EASE_SIMPLE = { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] } as const;
const SPRING_ICON = { type: "spring" as const, stiffness: 500, damping: 30 };
const SPRING_PANEL = { type: "spring" as const, stiffness: 680, damping: 14, mass: 0.8 };
const SPRING_ITEM = { type: "spring" as const, stiffness: 520, damping: 22 };

// ─── Theme system ─────────────────────────────────────────────────────────────

function useColors(isDark: boolean) {
  return {
    canvas: isDark ? "#111111" : "#EDEDED",
    grid: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
    nav: isDark ? "#1C1C1E" : "#F8F8F8",
    navBorder: isDark ? "rgba(255,255,255,0.09)" : "#FFFFFF",
    navShadow: isDark ? "0px 4px 24px rgba(0,0,0,0.55)" : "0px 4px 12px #EAEAEA",
    divider: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
    iconDefault: "#8A8A8A",
    activeGrad: isDark
      ? "linear-gradient(145deg, #3a3a3c 0%, #2c2c2e 100%)"
      : "linear-gradient(145deg, #2c2c2e 0%, #1c1c1e 100%)",
    activeShadow: "0 2px 10px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.09)",
    hoverBg: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.052)",
    tooltipGrad: "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)",
    panel: isDark ? "#1C1C1E" : "#F8F8F8",
    panelBorder: isDark ? "rgba(255,255,255,0.09)" : "#FFFFFF",
    panelShadow: isDark
      ? "0px 8px 32px rgba(0,0,0,0.55), 0px 2px 8px rgba(0,0,0,0.4)"
      : "0px 8px 32px rgba(0,0,0,0.09), 0px 2px 8px rgba(0,0,0,0.05)",
    text: isDark ? "#F0F0F0" : "#1A1A1A",
    textSub: "#8A8A8A",
    itemHover: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.042)",
    itemTap: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)",
    itemIconBg: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.03)",
    itemIconBgHover: isDark ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.06)",
    themeBtn: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
    themeBtnHover: isDark ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.07)",
  } as const;
}

type Colors = ReturnType<typeof useColors>;

// ─── MacDots ──────────────────────────────────────────────────────────────────

function MacDots() {
  return (
    <div className="flex items-center gap-[6px] pl-1 flex-shrink-0">
      {["#FF5F57", "#FEBC2E", "#28C840"].map((color, i) => (
        <motion.div
          key={i}
          className="w-[11px] h-[11px] rounded-full cursor-pointer"
          style={{ background: color }}
          whileHover={{ scale: 1.14 }}
          whileTap={{ scale: 0.88 }}
          transition={EASE_SIMPLE}
        />
      ))}
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function Tooltip({ label, colors }: { label: string; colors: Colors }) {
  return (
    <motion.div
      className="absolute -top-9 left-1/2 -translate-x-1/2 pointer-events-none z-50"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 3 }}
      transition={{ duration: 0.13, ease: "easeOut" }}
    >
      <div
        className="whitespace-nowrap px-[10px] py-[5px] rounded-2xl text-white text-[11px] font-medium"
        style={{
          background: colors.tooltipGrad,
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
          {hovered && !isActive && <Tooltip label={item.label} colors={colors} />}
        </AnimatePresence>

        <motion.button
          className="flex items-center justify-center w-[44px] h-[44px] rounded-[13px] outline-none cursor-pointer"
          style={{
            background: isActive
              ? colors.activeGrad
              : hovered
              ? colors.hoverBg
              : "transparent",
            boxShadow: isActive ? colors.activeShadow : "none",
          }}
          animate={{
            y: isActive ? -2 : 0,
            scale: isActive ? 1.03 : 1,
          }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.91, y: 0 }}
          transition={isActive ? SPRING_ICON : EASE_SIMPLE}
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

function PanelItem({
  item,
  index,
  colors,
}: {
  item: PanelItem;
  index: number;
  colors: Colors;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.button
      className="w-full flex items-center gap-3 px-3 py-[9px] rounded-xl text-left outline-none cursor-pointer"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_ITEM, delay: index * 0.018 }}
      style={{
        background: hovered ? colors.itemHover : "transparent",
      }}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <div
        className="flex items-center justify-center w-[30px] h-[30px] rounded-[9px] flex-shrink-0"
        style={{
          background: hovered ? colors.itemIconBgHover : colors.itemIconBg,
          transition: "background 0.14s ease",
        }}
      >
        <Icon size={14} strokeWidth={1.9} color={colors.text} />
      </div>
      <span
        className="text-[13px] font-medium"
        style={{ color: colors.text, letterSpacing: "-0.01em" }}
      >
        {item.label}
      </span>
    </motion.button>
  );
}

// ─── FloatingPanel ────────────────────────────────────────────────────────────

function FloatingPanel({
  item,
  left,
  colors,
}: {
  item: NavItemDef;
  left: number;
  colors: Colors;
}) {
  return (
    <motion.div
      key={item.id}
      className="absolute top-full mt-3 z-40"
      style={{ left, width: PANEL_WIDTH }}
      initial={{ opacity: 0, y: -22, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.12 } }}
      transition={SPRING_PANEL}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="rounded-[22px] p-2"
        style={{
          background: colors.panel,
          border: `1.5px solid ${colors.panelBorder}`,
          boxShadow: colors.panelShadow,
        }}
      >
        <div className="px-3 pt-2 pb-1 mb-1">
          <span
            className="text-[10px] font-semibold uppercase"
            style={{ color: colors.textSub, letterSpacing: "0.09em" }}
          >
            {item.label}
          </span>
        </div>
        <div className="flex flex-col gap-[2px]">
          {item.panel.map((panelItem, i) => (
            <PanelItem key={panelItem.label} item={panelItem} index={i} colors={colors} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── ThemeButton ──────────────────────────────────────────────────────────────

function ThemeButton({
  isDark,
  onToggle,
  colors,
}: {
  isDark: boolean;
  onToggle: () => void;
  colors: Colors;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      className="flex items-center justify-center w-[34px] h-[34px] rounded-[11px] outline-none cursor-pointer flex-shrink-0"
      style={{
        background: hovered ? colors.themeBtnHover : colors.themeBtn,
        transition: "background 0.14s ease",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      transition={EASE_SIMPLE}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onToggle}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -40, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 40, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Moon size={15} strokeWidth={1.8} color={isDark ? "#E5E5E5" : colors.iconDefault} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 40, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -40, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
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
      // Center panel under icon, clamped to stay within nav bounds
      const iconCenterInNav = iconRect.left + iconRect.width / 2 - navRect.left;
      const raw = iconCenterInNav - PANEL_WIDTH / 2;
      const clamped = Math.max(8, Math.min(NAV_WIDTH - PANEL_WIDTH - 8, raw));
      setPanelLeft(clamped);
    }
    setActiveId(id);
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center"
      style={{ background: colors.canvas, fontFamily: "var(--font-inter), sans-serif" }}
      onClick={() => setActiveId(null)}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${colors.grid} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.grid} 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px",
        }}
      />

      {/* Nav wrapper */}
      <div
        className="relative"
        ref={navRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation bar */}
        <div
          className="relative flex items-center gap-4 px-5"
          style={{
            width: NAV_WIDTH,
            height: 88,
            background: colors.nav,
            border: `1.5px solid ${colors.navBorder}`,
            borderRadius: 32,
            boxShadow: colors.navShadow,
          }}
        >
          {/* macOS dots */}
          <MacDots />

          {/* Divider */}
          <div
            className="flex-shrink-0 w-px self-stretch my-5"
            style={{ background: colors.divider }}
          />

          {/* Icon stack */}
          <div className="flex-1 flex items-center justify-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavIcon
                key={item.id}
                item={item}
                isActive={activeId === item.id}
                onClick={() => handleIconClick(item.id)}
                ref={(el) => {
                  iconRefs.current[item.id] = el;
                }}
                colors={colors}
              />
            ))}
          </div>

          {/* Divider */}
          <div
            className="flex-shrink-0 w-px self-stretch my-5"
            style={{ background: colors.divider }}
          />

          {/* Theme toggle */}
          <ThemeButton
            isDark={isDark}
            onToggle={() => setIsDark((d) => !d)}
            colors={colors}
          />
        </div>

        {/* Floating panel — anchored to clicked icon */}
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
