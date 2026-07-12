-- Sprint 10: 提醒中心
CREATE TABLE public.reminders (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pet_id        UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    type          VARCHAR(20) NOT NULL,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    due_date      DATE NOT NULL,
    repeat_type   VARCHAR(10),
    is_completed  BOOLEAN DEFAULT false,
    completed_at  TIMESTAMPTZ,
    notify_before INTEGER DEFAULT 1,
    created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reminders_due ON public.reminders(due_date);
CREATE INDEX idx_reminders_pet ON public.reminders(pet_id);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own reminders"
    ON public.reminders FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
