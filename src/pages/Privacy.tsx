import { Link } from 'react-router';
import { useTitle } from '../lib/hooks';

// Spec "Backend: Privacy and retention": the plain-language notice linked from
// the primer, Settings and the consent question.
export function Privacy() {
  useTitle('Privacy');
  return (
    <div className="card stack">
      <h1>Privacy</h1>
      <p className="lede">
        There are no accounts, and we never ask who you are. Your progress is kept in this browser.
      </p>

      <div className="db-block">
        <h3>If you say yes to sharing</h3>
        <p>
          After your first experiment, we ask once whether to add your anonymous answers to the totals. If you say
          yes, then each time you finish an experiment for the first time, your browser sends:
        </p>
        <ul>
          <li>which experiment it was, and which version of it you saw</li>
          <li>your answers</li>
          <li>which edition of the questions you answered, so changed questions start a fresh count</li>
        </ul>
        <p>
          It also sends short usage notes: when you start or finish an experiment, when you open an explanation and
          when you read to the end of it, and whether you got the quiz question right. When you finish an
          experiment, it says how many you've finished in this visit.
        </p>
      </div>

      <div className="db-block">
        <h3>What is never sent</h3>
        <ul>
          <li>your name, or any account</li>
          <li>any ID for your device or browser</li>
          <li>anything that links one of your answers to another</li>
        </ul>
        <p>
          We don't log or store IP addresses. To block floods of fake answers, Cloudflare counts how many requests
          come from each internet address in a minute. That count is kept only in memory, for that minute.
        </p>
      </div>

      <div className="db-block">
        <h3>If you say no</h3>
        <p>
          Nothing is sent: no answers and no usage notes. Until you answer the question, nothing is sent either. The
          usage notes from your first experiment wait in the page's memory until you answer: yes sends them along with
          your answers, and no throws them away.
        </p>
        <p>
          Everyone sees how others answered, whatever they chose. To show those numbers, your browser asks for the
          totals for the experiment you just finished. That request says which experiment it is, and nothing about
          you or your answers.
        </p>
      </div>

      <div className="db-block">
        <h3>Only first plays count</h3>
        <p>
          Replays aren't sent, because by then you know how the experiment works. To keep track, your browser stores
          a short list of the experiments you've finished and sent, next to your progress. It stays on your device.
        </p>
      </div>

      <div className="db-block">
        <h3>How long answers are kept</h3>
        <p>
          Individual answers and usage notes are deleted after 12 months, and the totals are worked out from the last
          12 months of answers. Because nothing identifies you, we can't find your answers again to delete them
          early.
        </p>
      </div>

      <div className="db-block">
        <h3>Changing your mind</h3>
        <p>
          You can turn sharing on or off at any time in <Link to="/settings">Settings</Link>. Turning it off stops
          anything more being sent.
        </p>
        <p className="note">The site and the totals are hosted on Cloudflare.</p>
      </div>
    </div>
  );
}
