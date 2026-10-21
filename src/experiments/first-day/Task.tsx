import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { TaskProps } from '../types';
import { DEFAULTS, PENSION, versionOf, type Pension, type YesNo } from '../../../shared/experiments/first-day/logic';

const PENSION_LABEL: Record<Pension, string> = { '0': '0% (no pension)', '3': '3%', '5': '5%', '8': '8%' };
const YES_NO: { id: YesNo; label: string }[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
];

function Options<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="radios">
      {options.map((o) => (
        <label key={o.id} className="radio">
          <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

export function Task({ condition, onComplete }: TaskProps) {
  const d = DEFAULTS[versionOf(condition)];
  const [pension, setPension] = useState<Pension>(d.pension);
  const [newsletter, setNewsletter] = useState<YesNo>(d.newsletter);
  const [birthday, setBirthday] = useState<YesNo>(d.birthday);
  const headRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    headRef.current?.focus();
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    onComplete({ pension, newsletter, birthday });
  }

  return (
    <form className="stack hr-form" onSubmit={submit}>
      <div className="stack">
        <p className="eyebrow">New starter form</p>
        <p className="q" ref={headRef} tabIndex={-1}>
          Welcome to your first day
        </p>
        <p className="note">Check each choice, change anything you want, then submit the form.</p>
      </div>
      <fieldset className="hr-field">
        <legend>Workplace pension</legend>
        <p className="note">
          How much of your pay should go into your pension each month? Your employer adds half as much again.
        </p>
        <Options
          name="pension"
          options={PENSION.map((p) => ({ id: p, label: PENSION_LABEL[p] }))}
          value={pension}
          onChange={setPension}
        />
      </fieldset>
      <fieldset className="hr-field">
        <legend>Staff newsletter</legend>
        <p className="note">Get the weekly staff newsletter by email?</p>
        <Options name="newsletter" options={YES_NO} value={newsletter} onChange={setNewsletter} />
      </fieldset>
      <fieldset className="hr-field">
        <legend>Birthdays</legend>
        <p className="note">Let the team know your birthday so they can celebrate it?</p>
        <Options name="birthday" options={YES_NO} value={birthday} onChange={setBirthday} />
      </fieldset>
      <p className="note">You can change any of these later.</p>
      <button className="btn" type="submit">
        Submit form
      </button>
    </form>
  );
}
