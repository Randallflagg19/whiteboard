"use client";

import { useState } from "react";
import { StreakForm } from "./streak-form";

export function StreakCreate() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="streak-add-button" aria-label={open ? "Закрыть создание привычки" : "Добавить привычку"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "×" : "+"}</button>
      {open && <StreakForm onCreated={() => setOpen(false)} />}
    </>
  );
}
