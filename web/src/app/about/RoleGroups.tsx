"use client";

import Link from "next/link";
import { useState } from "react";
import type { CareerLane, Explanation, Role, School } from "@/content/resume";
import { groupRoles, laneColor, laneSpan } from "@/lib/career";
import styles from "./about.module.css";

function ProjectName({ item }: { item: Explanation }) {
  return item.href ? (
    <Link href={item.href}>{item.label}</Link>
  ) : (
    <span>{item.label}</span>
  );
}

function RoleItem({ role }: { role: Role }) {
  const where = [role.organization, role.location].filter(Boolean).join(", ");
  return (
    <li
      className={`${styles.role} grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-site-4 border-b border-rule py-site-4 last:border-b-0`}
    >
      <h4
        className={`${styles.roleTitle} font-serif text-step-1 font-semibold`}
      >
        {role.title}
      </h4>
      <p className="text-step-small text-ink-soft tabular-nums">{role.dates}</p>
      {where && (
        <p
          className={`${styles.place} col-span-2 mt-site-1 text-step-small text-ink-soft`}
        >
          {where}
        </p>
      )}
      <p
        className={`${styles.outcome} col-span-2 mt-site-2 max-w-[62ch] font-serif`}
      >
        {role.outcome}
      </p>
      {role.explains && (
        <p className="col-span-2 mt-site-2 text-step-small text-ink-soft">
          Explains <ProjectName item={role.explains} />.
        </p>
      )}
    </li>
  );
}

function RoleList({ roles }: { roles: Role[] }) {
  return (
    <ul className="list-none p-0">
      {roles.map((role) => (
        <RoleItem key={`${role.title}-${role.dates}`} role={role} />
      ))}
    </ul>
  );
}

const groupButton =
  "flex w-full cursor-pointer items-baseline justify-between gap-x-site-4 py-site-4 text-left hover:bg-paper-raised";

function degreeSpan(schools: School[]): string {
  const years = schools.map((school) => Number(school.year));
  const start = Math.min(...years);
  const end = Math.max(...years);
  return start === end ? String(start) : `${start} – ${end}`;
}

export function RoleGroups({
  roles,
  schools,
}: {
  roles: Role[];
  schools: School[];
}) {
  const groups = groupRoles(roles);
  const [open, setOpen] = useState<ReadonlySet<CareerLane | "Education">>(
    new Set(),
  );

  function toggle(lane: CareerLane | "Education") {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(lane)) next.delete(lane);
      else next.add(lane);
      return next;
    });
  }

  return (
    <>
      <div className="mt-site-4 border-t border-rule print:hidden">
        <section className="border-b border-rule">
          <h3>
            <button
              type="button"
              className={groupButton}
              aria-expanded={open.has("Education")}
              aria-controls="roles-education"
              onClick={() => toggle("Education")}
            >
              <span className="font-serif text-step-1 font-semibold">
                <span
                  aria-hidden="true"
                  className="mr-site-2 inline-block size-2.5 rounded-sm align-middle"
                  style={{ background: laneColor.Education }}
                />
                Education
              </span>
              <span className="text-step-small text-ink-soft tabular-nums">
                {schools.length} {schools.length === 1 ? "degree" : "degrees"}
                {" · "}
                {degreeSpan(schools)}
              </span>
            </button>
          </h3>
          {open.has("Education") ? (
            <ul id="roles-education" className="list-none p-0">
              {schools.map((school) => (
                <li
                  key={school.institution}
                  className={`${styles.school} grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-site-4 border-b border-rule py-site-4 last:border-b-0`}
                >
                  <p>
                    <span className="font-serif text-step-1 font-semibold">
                      {school.institution}
                    </span>
                    <span className="mt-site-1 block text-step-small text-ink-soft">
                      {school.credential}
                    </span>
                  </p>
                  <p className="text-step-small text-ink-soft tabular-nums">
                    {school.year}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div id="roles-education" hidden />
          )}
        </section>
        {groups.map((group) => {
          const isOpen = open.has(group.lane);
          const count = group.roles.length;
          const panelId = `roles-${group.lane.toLowerCase()}`;
          return (
            <section key={group.lane} className="border-b border-rule">
              <h3>
                <button
                  type="button"
                  className={groupButton}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(group.lane)}
                >
                  <span className="font-serif text-step-1 font-semibold">
                    <span
                      aria-hidden="true"
                      className="mr-site-2 inline-block size-2.5 rounded-sm align-middle"
                      style={{ background: laneColor[group.lane] }}
                    />
                    {group.lane}
                  </span>
                  <span className="text-step-small text-ink-soft tabular-nums">
                    {count} {count === 1 ? "role" : "roles"}
                    {" · "}
                    {laneSpan(group.roles)}
                  </span>
                </button>
              </h3>
              {isOpen ? (
                <div id={panelId}>
                  <RoleList roles={group.roles} />
                </div>
              ) : (
                <div id={panelId} hidden />
              )}
            </section>
          );
        })}
      </div>

      <div className="hidden print:block">
        <section>
          <h2 className={`${styles.section} mt-site-7 text-step-2`}>
            Education
          </h2>
          <ul className="list-none p-0">
            {schools.map((school) => (
              <li
                key={school.institution}
                className={`${styles.school} grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-site-4 border-b border-rule py-site-4`}
              >
                <p>
                  <span className="font-serif font-semibold">
                    {school.institution}
                  </span>
                  <span className="mt-site-1 block text-step-small text-ink-soft">
                    {school.credential}
                  </span>
                </p>
                <p className="text-step-small text-ink-soft tabular-nums">
                  {school.year}
                </p>
              </li>
            ))}
          </ul>
        </section>
        {groups.map((group) => (
          <section key={group.lane}>
            <h2 className={`${styles.section} mt-site-7 text-step-2`}>
              {group.lane}
            </h2>
            <RoleList roles={group.roles} />
          </section>
        ))}
      </div>
    </>
  );
}
