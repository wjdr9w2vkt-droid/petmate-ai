-- ============================================================
-- PetMate AI - Initial Database Schema
-- Platform: Supabase PostgreSQL 15
-- ============================================================

-- 0. 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. 用户扩展表 (profiles)
--    关联 Supabase Auth auth.users
-- ============================================================
CREATE TABLE public.profiles (
    id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(50),
    avatar_url   TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 自动更新 updated_at 的触发器函数
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 2. 宠物表 (pets)
-- ============================================================
CREATE TABLE public.pets (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name        VARCHAR(50) NOT NULL,
    species     VARCHAR(20) NOT NULL CHECK (species IN ('dog', 'cat', 'other')),
    breed       VARCHAR(100),
    gender      VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    birthday    DATE,
    avatar_url  TEXT,
    is_neutered BOOLEAN DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pets_user_id ON public.pets(user_id);
CREATE INDEX idx_pets_species ON public.pets(species);

CREATE TRIGGER update_pets_updated_at
    BEFORE UPDATE ON public.pets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 3. 成长记录表 (growth_records)
-- ============================================================
CREATE TABLE public.growth_records (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id         UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    recorded_at    DATE NOT NULL DEFAULT CURRENT_DATE,
    weight         NUMERIC(5,2),
    food_note      TEXT,
    water_note     TEXT,
    exercise_note  TEXT,
    remark         TEXT,
    photo_url      TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_growth_records_pet_id ON public.growth_records(pet_id);
CREATE INDEX idx_growth_records_recorded_at ON public.growth_records(recorded_at);
CREATE UNIQUE INDEX idx_growth_records_pet_date ON public.growth_records(pet_id, recorded_at);

CREATE TRIGGER update_growth_records_updated_at
    BEFORE UPDATE ON public.growth_records
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 4. 疫苗表 (vaccinations)
-- ============================================================
CREATE TABLE public.vaccinations (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id         UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    vaccine_name   VARCHAR(200) NOT NULL,
    vaccinated_at  DATE NOT NULL,
    next_due_date  DATE,
    remark         TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vaccinations_pet_id ON public.vaccinations(pet_id);
CREATE INDEX idx_vaccinations_next_due_date ON public.vaccinations(next_due_date);

CREATE TRIGGER update_vaccinations_updated_at
    BEFORE UPDATE ON public.vaccinations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 5. AI 对话记录表 (ai_conversations)
-- ============================================================
CREATE TABLE public.ai_conversations (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pet_id      UUID REFERENCES public.pets(id) ON DELETE SET NULL,
    question    TEXT NOT NULL,
    answer      TEXT NOT NULL,
    model       VARCHAR(30) DEFAULT 'gpt-4o-mini',
    tokens_used INTEGER,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_created_at ON public.ai_conversations(created_at);
CREATE INDEX idx_ai_conv_user_date ON public.ai_conversations(user_id, created_at);

-- ============================================================
-- RLS 启用
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies: profiles
-- ============================================================
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================================
-- RLS Policies: pets
-- ============================================================
CREATE POLICY "Users can view own pets"
    ON public.pets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pets"
    ON public.pets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pets"
    ON public.pets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pets"
    ON public.pets FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- RLS Policies: growth_records (通过 pet_id → pets.user_id 验证)
-- ============================================================
CREATE POLICY "Users can view own pets records"
    ON public.growth_records FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE pets.id = growth_records.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert records for own pets"
    ON public.growth_records FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE pets.id = growth_records.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own pets records"
    ON public.growth_records FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE pets.id = growth_records.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own pets records"
    ON public.growth_records FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE pets.id = growth_records.pet_id
            AND pets.user_id = auth.uid()
        )
    );

-- ============================================================
-- RLS Policies: vaccinations (通过 pet_id → pets.user_id 验证)
-- ============================================================
CREATE POLICY "Users can view own pets vaccines"
    ON public.vaccinations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE pets.id = vaccinations.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert vaccines for own pets"
    ON public.vaccinations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE pets.id = vaccinations.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own pets vaccines"
    ON public.vaccinations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE pets.id = vaccinations.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own pets vaccines"
    ON public.vaccinations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE pets.id = vaccinations.pet_id
            AND pets.user_id = auth.uid()
        )
    );

-- ============================================================
-- RLS Policies: ai_conversations
-- ============================================================
CREATE POLICY "Users can view own conversations"
    ON public.ai_conversations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
    ON public.ai_conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 触发器: 新用户注册 → 自动创建 profile
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 视图: Dashboard 聚合数据
-- ============================================================
CREATE VIEW public.pet_dashboard AS
SELECT
    p.id AS pet_id,
    p.user_id,
    p.name AS pet_name,
    p.species,
    p.birthday,
    p.avatar_url,
    CASE WHEN p.birthday IS NOT NULL
        THEN EXTRACT(YEAR FROM age(CURRENT_DATE, p.birthday))
        ELSE NULL
    END AS age_years,
    (SELECT gr.weight
     FROM public.growth_records gr
     WHERE gr.pet_id = p.id
     ORDER BY gr.recorded_at DESC
     LIMIT 1) AS latest_weight,
    (SELECT gr.recorded_at
     FROM public.growth_records gr
     WHERE gr.pet_id = p.id
     ORDER BY gr.recorded_at DESC
     LIMIT 1) AS last_record_date,
    (SELECT MIN(v.next_due_date)
     FROM public.vaccinations v
     WHERE v.pet_id = p.id
       AND v.next_due_date >= CURRENT_DATE) AS next_vaccine_due,
    (SELECT MIN(v.next_due_date) - CURRENT_DATE
     FROM public.vaccinations v
     WHERE v.pet_id = p.id
       AND v.next_due_date >= CURRENT_DATE) AS days_until_vaccine,
    p.created_at
FROM public.pets p;

-- ============================================================
-- 函数: 获取用户 AI 今日使用次数
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_daily_ai_usage(user_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    usage_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO usage_count
    FROM public.ai_conversations
    WHERE user_id = user_id_param
      AND created_at::DATE = CURRENT_DATE;
    RETURN usage_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
