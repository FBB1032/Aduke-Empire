CREATE TABLE IF NOT EXISTS public.session (
  sid varchar NOT NULL,
  sess json NOT NULL,
  expire timestamp NOT NULL,
  PRIMARY KEY (sid)
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON public.session(expire);
