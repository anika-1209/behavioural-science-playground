import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { Debrief } from '../content/types';
import { getModule } from '../content/modules';
import { Quiz } from './Quiz';

interface Props {
  moduleId: string;
  debrief: Debrief;
  whatHappened: string;
  /** "How players here answered", shown after "What just happened" when there are live numbers. */
  others?: ReactNode;
  quizAnswer?: string;
  onQuizAnswer: (answerId: string, correct: boolean) => void;
  /** Called once, when the debrief is shown (the read-through metric's denominator). */
  onOpened?: () => void;
  /** Called once, when "How to counter it" scrolls into view (the read-through metric). */
  onReadThrough?: () => void;
}

// The fixed debrief structure from Feature 3. Every bias renders every section
// in this order; the quiz is the only optional one.
export function DebriefView({ moduleId, debrief: d, whatHappened, others, quizAnswer, onQuizAnswer, onOpened, onReadThrough }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);
  const openedRef = useRef(onOpened);
  useEffect(() => openedRef.current?.(), []);

  const counterRef = useRef<HTMLElement>(null);
  const readRef = useRef(onReadThrough);
  readRef.current = onReadThrough;
  useEffect(() => {
    const el = counterRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        readRef.current?.();
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const related = getModule(moduleId)?.relatedBiasIds.map(getModule).find((m) => m);

  return (
    <div className="stack">
      <p className="eyebrow">You just experienced</p>
      <h2 className="bias-name" tabIndex={-1} ref={headingRef}>
        {d.biasName}
      </h2>
      <p className="definition">{d.definition}</p>

      <section className="db-block">
        <h3>What just happened</h3>
        <p>{whatHappened}</p>
      </section>

      {others}

      <section className="db-block">
        <h3>Why it happens</h3>
        {d.whyItHappens.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>

      <section className="db-block">
        <h3>Classic study</h3>
        <p className="cite">
          <a href={d.classicStudy.citationUrl} target="_blank" rel="noopener noreferrer">
            {d.classicStudy.authors} ({d.classicStudy.year}). {d.classicStudy.title}
          </a>
        </p>
        <p>{d.classicStudy.summary}</p>
      </section>

      <section className="db-block">
        <h3>In the real world</h3>
        <ul>
          {d.realWorldExamples.map((ex) => (
            <li key={ex.label}>
              <b>{ex.label}.</b> {ex.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="db-block" ref={counterRef}>
        <h3>How to counter it</h3>
        <ul>
          {d.counterStrategies.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      {d.quiz && (
        <section className="db-block">
          <h3>Check your understanding</h3>
          <Quiz quiz={d.quiz} initialAnswer={quizAnswer} onAnswer={onQuizAnswer} />
        </section>
      )}

      <section className="db-block next">
        <div className="row">
          <Link className="btn" to="/hub">
            Back to all experiments
          </Link>
          {related &&
            (related.status === 'ready' ? (
              <Link className="btn ghost" to={`/play/${related.id}`}>
                Next: {related.teaserTitle}
              </Link>
            ) : (
              <p className="note">Next suggested: “{related.teaserTitle}”, coming soon.</p>
            ))}
        </div>
      </section>
    </div>
  );
}
