-- v1.5 anonymous aggregate results (spec, "Backend").
-- No column identifies a player or links one row to another: no IP, no
-- device or session ID, and only the day a row arrived (for 12-month retention).

-- One player's first play of one experiment.
CREATE TABLE answers (
  id INTEGER PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  version TEXT NOT NULL,
  content_version INTEGER NOT NULL,
  answers TEXT NOT NULL,            -- JSON, already checked against the experiment's format
  received_on TEXT NOT NULL         -- YYYY-MM-DD
);
CREATE INDEX answers_by_experiment ON answers (experiment_id, content_version);
CREATE INDEX answers_by_day ON answers (received_on);

-- One usage event, for the success metrics.
CREATE TABLE events (
  id INTEGER PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  type TEXT NOT NULL,               -- started | finished | debrief-opened | debrief-read | quiz-answered
  correct INTEGER,                  -- quiz-answered only: 1 or 0
  finished_in_visit INTEGER,        -- finished only
  received_on TEXT NOT NULL
);
CREATE INDEX events_by_experiment ON events (experiment_id, type);
CREATE INDEX events_by_day ON events (received_on);

-- The latest summary per experiment, recomputed on a schedule. Kept after raw answers are deleted.
CREATE TABLE summaries (
  experiment_id TEXT PRIMARY KEY,
  content_version INTEGER NOT NULL,
  body TEXT NOT NULL,               -- JSON ExperimentSummary
  computed_at TEXT NOT NULL
);
