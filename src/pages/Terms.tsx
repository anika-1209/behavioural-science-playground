import { useTitle } from '../lib/hooks';
import { CONTACT } from '../content/contact';

// Plain-language terms of use: what the site is and isn't, no guarantee on the content, and who to contact.
export function Terms() {
  useTitle('Terms of use');
  return (
    <div className="card stack">
      <h1>Terms of use</h1>

      <div className="db-block">
        <h3>What this site is</h3>
        <p>
          The Behavioural Science Playground is a free educational site. You take part in short experiments, then
          learn about the bias each one demonstrates.
        </p>
      </div>

      <div className="db-block">
        <h3>What it isn't</h3>
        <p>
          It isn't a test of your intelligence or a diagnosis of how you think. One experiment shows how you answered
          on one day, nothing more. It isn't professional, medical, financial or legal advice either.
        </p>
      </div>

      <div className="db-block">
        <h3>About the content</h3>
        <p>
          We've tried to describe each bias and study accurately, but research changes and mistakes happen. The
          content is provided as it is, without any guarantee that it's complete or error-free. If you spot something
          wrong, please tell us.
        </p>
      </div>

      <div className="db-block">
        <h3>Contact</h3>
        <p>
          Questions, corrections or concerns: {CONTACT.name}, <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </p>
      </div>
    </div>
  );
}
