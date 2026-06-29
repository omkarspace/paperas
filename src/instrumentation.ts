import * as Sentry from "@sentry/nextjs";

export function register() {
  const tracesSampleRate = process.env.NODE_ENV === "development" ? 1.0 : 0.1;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate,
      debug: false,
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate,
      debug: false,
    });
  }
}
