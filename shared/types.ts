// Types shared by the app and the API. Nothing in shared/ may import React,
// the DOM or browser storage: the Cloudflare Worker imports it too.

/** A player's answers to one experiment, exactly as the app stores them. */
export type Answers = Record<string, string | number>;
