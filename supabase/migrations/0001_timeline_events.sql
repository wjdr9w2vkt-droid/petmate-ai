-- Sprint 9: 成长时间轴
CREATE TABLE public.timeline_events (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id       UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type   VARCHAR(30) NOT NULL,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    photo_url    TEXT,
    event_date   DATE NOT NULL,
    is_milestone BOOLEAN DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_timeline_pet_id ON public.timeline_events(pet_id);
CREATE INDEX idx_timeline_event_date ON public.timeline_events(event_date);
CREATE INDEX idx_timeline_pet_date ON public.timeline_events(pet_id, event_date DESC);

ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pets timeline"
    ON public.timeline_events FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.pets
        WHERE pets.id = timeline_events.pet_id
        AND pets.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert timeline for own pets"
    ON public.timeline_events FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.pets
        WHERE pets.id = timeline_events.pet_id
        AND pets.user_id = auth.uid()
    ));

CREATE POLICY "Users can update own pets timeline"
    ON public.timeline_events FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.pets
        WHERE pets.id = timeline_events.pet_id
        AND pets.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete own pets timeline"
    ON public.timeline_events FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.pets
        WHERE pets.id = timeline_events.pet_id
        AND pets.user_id = auth.uid()
    ));
