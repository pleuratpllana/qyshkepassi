import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronRight, Wifi, QrCode, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

const TRACK_WIDTH = 320;
const SLIDER_SIZE = 60;

const SlideToStart = ({ onComplete }) => {
  const { t } = useTranslation();
  const [isCompleted, setIsCompleted] = useState(false);
  const [renderPos, setRenderPos] = useState(0); // visual only

  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const slidePosition = useRef(0);
  const isDragging = useRef(false);
  const dragOffset = useRef(0);

  const handleStart = (clientX) => {
    if (isCompleted) return;
    isDragging.current = true;
    dragOffset.current = sliderRef.current
      ? clientX - sliderRef.current.getBoundingClientRect().left
      : SLIDER_SIZE / 2;
  };

  const handleMove = (clientX) => {
    if (!isDragging.current || isCompleted) return;
    if (!trackRef.current) return;

    let newPos =
      clientX - trackRef.current.getBoundingClientRect().left - dragOffset.current;
    const maxPos = TRACK_WIDTH - SLIDER_SIZE;
    newPos = Math.max(0, Math.min(newPos, maxPos));
    slidePosition.current = newPos;
    setRenderPos(newPos);

    if (newPos >= maxPos) completeSlide();
  };

  const handleEnd = () => {
    if (!isDragging.current || isCompleted) return;
    isDragging.current = false;
    const maxPos = TRACK_WIDTH - SLIDER_SIZE;
    if (slidePosition.current < maxPos) slidePosition.current = 0;
    setRenderPos(slidePosition.current);
  };

  const completeSlide = useCallback(() => {
    if (isCompleted) return;
    setIsCompleted(true);
    isDragging.current = false;
    slidePosition.current = TRACK_WIDTH - SLIDER_SIZE;
    setRenderPos(slidePosition.current);
    onComplete?.();
  }, [isCompleted, onComplete]);

  useEffect(() => {
    const move = (e) => handleMove(e.clientX);
    const up = handleEnd;
    const touchMove = (e) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };
    const touchEnd = handleEnd;

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    document.addEventListener("touchmove", touchMove, { passive: false });
    document.addEventListener("touchend", touchEnd);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      document.removeEventListener("touchmove", touchMove);
      document.removeEventListener("touchend", touchEnd);
    };
  }, []);

  const progressPercentage = (renderPos / (TRACK_WIDTH - SLIDER_SIZE)) * 100;

  const HowItWorksStep = ({ icon: Icon, label, step }) => (
    <div className="flex flex-col items-center min-w-0">
      <div className="relative flex flex-col items-center">
        <span className="absolute -top-4 -right-5 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-accentbg)] border border-[var(--color-border)] text-[var(--color-text)] text-xs font-bold shadow-sm">
          {step}
        </span>
        <Icon size={56} className="text-[var(--color-text)]" />
      </div>
      <span className="mt-2 font-semibold text-[var(--color-text)] min-w-0 text-xs truncate">{label}</span>
    </div>
  );

  const steps = [
    { icon: Wifi, label: t("enterWifi") },
    { icon: QrCode, label: t("generateQR") },
    { icon: Save, label: t("saveOrShare") },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center transition-colors duration-300 bg var(--color-bg)">
      <div className="w-full max-w-none items-center justify-center">
        <div className="text-center mb-0 flex flex-col items-center justify-center h-full">
          <Wifi size={48} className="text-[var(--color-text)] mb-3" />
          <h1 className="mt-0 font-bold text-[var(--color-text)]">{t("appName")}</h1>
          <p className="mt-3 text-base-bigger text-[var(--color-text)] mx-auto">{t("noTyping")}</p>
        </div>

        <div className="flex justify-between max-w-2xl mx-auto mt-14 mb-20 text-[var(--color-text)]  ">
          {steps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <HowItWorksStep {...step} step={idx + 1} />
              {idx < steps.length - 1 && <div className=""/>}
            </React.Fragment>
          ))}
        </div>

        <div className="flex justify-center rounded-full overflow-hidden my-4 ">
          <div
            ref={trackRef}
            className="relative flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm backdrop-blur-md"
            style={{ width: TRACK_WIDTH, height: SLIDER_SIZE + 12 }}
          >
            <div
              className="absolute left-0 h-full rounded-full bg-[var(--color-lightbg)] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />

            <div
              ref={sliderRef}
              className={`absolute left-1.5 top-1.2 rounded-full bg-[var(--color-accentbg)] flex items-center justify-center cursor-pointer`}
              style={{ transform: `translateX(${renderPos}px)`, width: SLIDER_SIZE, height: SLIDER_SIZE }}
              onMouseDown={(e) => { e.preventDefault(); handleStart(e.clientX); }}
              onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            >
              <ChevronRight size={24} className="text-[var(--color-text)]" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center text-center text-[var(--color-text)] pointer-events-none">
              {isCompleted ? t("welcome") : t("slideToStart")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideToStart;
