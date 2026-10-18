import { useState } from 'react';
import type { Quiz as QuizData } from '../content/types';

interface Props {
  quiz: QuizData;
  initialAnswer?: string;
  onAnswer: (answerId: string, correct: boolean) => void;
}

export function Quiz({ quiz, initialAnswer, onAnswer }: Props) {
  const [picked, setPicked] = useState<string | undefined>(initialAnswer);
  const chosen = quiz.options.find((o) => o.id === picked);

  return (
    <div>
      <fieldset className="quiz">
        <legend>{quiz.question}</legend>
        {quiz.options.map((o) => {
          const state = picked === o.id ? (o.id === quiz.answerId ? ' right' : ' wrong') : '';
          return (
            <label key={o.id} className={`opt${state}`}>
              <input
                type="radio"
                name="quiz"
                id={`quiz-${o.id}`}
                value={o.id}
                checked={picked === o.id}
                onChange={() => {
                  setPicked(o.id);
                  onAnswer(o.id, o.id === quiz.answerId);
                }}
              />
              {o.text}
            </label>
          );
        })}
      </fieldset>
      <p className="quiz-feedback" aria-live="polite">
        {chosen?.feedback}
      </p>
    </div>
  );
}
