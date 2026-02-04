-- ═══════════════════════════════════════════════════════════════
-- REGIONAL DEMOGRAPHIC DATA TABLES
-- Riktig data för befolkning, ålderspyramid och livslängd per region
-- ═══════════════════════════════════════════════════════════════

-- Population demographics per region (åldersfördelning)
CREATE TABLE IF NOT EXISTS public.regional_demographics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region_code TEXT NOT NULL,
  region_name TEXT NOT NULL,
  age_group TEXT NOT NULL,
  male_percent NUMERIC(5,2) NOT NULL,
  female_percent NUMERIC(5,2) NOT NULL,
  year INTEGER NOT NULL DEFAULT 2024,
  data_source TEXT DEFAULT 'UN Population Division',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(region_code, age_group, year)
);

-- Population history per region
CREATE TABLE IF NOT EXISTS public.regional_population_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region_code TEXT NOT NULL,
  region_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  population_millions NUMERIC(10,2) NOT NULL,
  growth_rate_percent NUMERIC(5,2),
  median_age NUMERIC(4,1),
  data_source TEXT DEFAULT 'UN Population Division',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(region_code, year)
);

-- Life expectancy history per region
CREATE TABLE IF NOT EXISTS public.regional_life_expectancy (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region_code TEXT NOT NULL,
  region_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  life_expectancy_overall NUMERIC(4,1) NOT NULL,
  life_expectancy_male NUMERIC(4,1),
  life_expectancy_female NUMERIC(4,1),
  healthy_life_years NUMERIC(4,1),
  data_source TEXT DEFAULT 'WHO',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(region_code, year)
);

-- Country detailed data for regions
CREATE TABLE IF NOT EXISTS public.regional_country_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region_code TEXT NOT NULL,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  population_millions NUMERIC(10,2) NOT NULL,
  hdi NUMERIC(4,3),
  life_expectancy NUMERIC(4,1),
  gdp_per_capita INTEGER,
  year INTEGER NOT NULL DEFAULT 2024,
  data_source TEXT DEFAULT 'UN/World Bank',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(region_code, country_code, year)
);

-- Enable RLS
ALTER TABLE public.regional_demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_population_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_life_expectancy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_country_data ENABLE ROW LEVEL SECURITY;

-- Public read access (data är offentlig statistik)
CREATE POLICY "Regional demographics are publicly readable" 
ON public.regional_demographics FOR SELECT USING (true);

CREATE POLICY "Regional population history is publicly readable" 
ON public.regional_population_history FOR SELECT USING (true);

CREATE POLICY "Regional life expectancy is publicly readable" 
ON public.regional_life_expectancy FOR SELECT USING (true);

CREATE POLICY "Regional country data is publicly readable" 
ON public.regional_country_data FOR SELECT USING (true);

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA: MENA (Middle East & North Africa)
-- ═══════════════════════════════════════════════════════════════

-- Population pyramid for MENA
INSERT INTO public.regional_demographics (region_code, region_name, age_group, male_percent, female_percent, year) VALUES
('mena', 'Mellanöstern & Nordafrika', '0-4', 5.1, 4.8, 2024),
('mena', 'Mellanöstern & Nordafrika', '5-14', 9.2, 8.7, 2024),
('mena', 'Mellanöstern & Nordafrika', '15-24', 8.5, 8.0, 2024),
('mena', 'Mellanöstern & Nordafrika', '25-34', 9.1, 8.6, 2024),
('mena', 'Mellanöstern & Nordafrika', '35-44', 7.2, 6.9, 2024),
('mena', 'Mellanöstern & Nordafrika', '45-54', 5.3, 5.1, 2024),
('mena', 'Mellanöstern & Nordafrika', '55-64', 3.8, 3.7, 2024),
('mena', 'Mellanöstern & Nordafrika', '65-74', 2.1, 2.3, 2024),
('mena', 'Mellanöstern & Nordafrika', '75+', 1.2, 1.5, 2024);

-- Population history for MENA
INSERT INTO public.regional_population_history (region_code, region_name, year, population_millions, growth_rate_percent, median_age) VALUES
('mena', 'Mellanöstern & Nordafrika', 1960, 110, 2.8, 19.2),
('mena', 'Mellanöstern & Nordafrika', 1970, 145, 2.9, 18.5),
('mena', 'Mellanöstern & Nordafrika', 1980, 195, 3.0, 18.1),
('mena', 'Mellanöstern & Nordafrika', 1990, 265, 2.8, 19.5),
('mena', 'Mellanöstern & Nordafrika', 2000, 325, 2.1, 22.3),
('mena', 'Mellanöstern & Nordafrika', 2010, 395, 2.0, 25.1),
('mena', 'Mellanöstern & Nordafrika', 2020, 445, 1.8, 27.8),
('mena', 'Mellanöstern & Nordafrika', 2024, 470, 1.6, 28.9);

-- Life expectancy history for MENA
INSERT INTO public.regional_life_expectancy (region_code, region_name, year, life_expectancy_overall, life_expectancy_male, life_expectancy_female, healthy_life_years) VALUES
('mena', 'Mellanöstern & Nordafrika', 1960, 48.5, 47.2, 49.8, 42.1),
('mena', 'Mellanöstern & Nordafrika', 1970, 53.2, 51.8, 54.6, 46.5),
('mena', 'Mellanöstern & Nordafrika', 1980, 59.1, 57.5, 60.7, 51.8),
('mena', 'Mellanöstern & Nordafrika', 1990, 64.8, 63.1, 66.5, 56.9),
('mena', 'Mellanöstern & Nordafrika', 2000, 68.5, 66.7, 70.3, 60.2),
('mena', 'Mellanöstern & Nordafrika', 2010, 71.2, 69.3, 73.1, 62.8),
('mena', 'Mellanöstern & Nordafrika', 2020, 73.5, 71.5, 75.5, 64.5),
('mena', 'Mellanöstern & Nordafrika', 2024, 74.2, 72.1, 76.3, 65.2);

-- Countries in MENA
INSERT INTO public.regional_country_data (region_code, country_code, country_name, population_millions, hdi, life_expectancy, gdp_per_capita, year) VALUES
('mena', 'EG', 'Egypten', 104.5, 0.731, 72.1, 3920, 2024),
('mena', 'IR', 'Iran', 87.9, 0.774, 76.7, 5520, 2024),
('mena', 'IQ', 'Irak', 43.5, 0.686, 71.1, 5180, 2024),
('mena', 'SA', 'Saudiarabien', 35.8, 0.875, 77.6, 27680, 2024),
('mena', 'MA', 'Marocko', 37.8, 0.683, 74.0, 3800, 2024),
('mena', 'DZ', 'Algeriet', 45.4, 0.745, 77.1, 4010, 2024),
('mena', 'AE', 'Förenade Arabemiraten', 9.5, 0.911, 78.9, 43100, 2024),
('mena', 'SY', 'Syrien', 22.1, 0.567, 73.1, 1120, 2024),
('mena', 'TN', 'Tunisien', 12.0, 0.731, 76.7, 3810, 2024),
('mena', 'JO', 'Jordanien', 11.3, 0.720, 75.0, 4410, 2024);

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA: Sub-Saharan Africa
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.regional_demographics (region_code, region_name, age_group, male_percent, female_percent, year) VALUES
('ssa', 'Subsahariska Afrika', '0-4', 7.8, 7.6, 2024),
('ssa', 'Subsahariska Afrika', '5-14', 12.5, 12.2, 2024),
('ssa', 'Subsahariska Afrika', '15-24', 10.1, 9.9, 2024),
('ssa', 'Subsahariska Afrika', '25-34', 7.8, 7.9, 2024),
('ssa', 'Subsahariska Afrika', '35-44', 5.5, 5.7, 2024),
('ssa', 'Subsahariska Afrika', '45-54', 3.8, 4.0, 2024),
('ssa', 'Subsahariska Afrika', '55-64', 2.4, 2.6, 2024),
('ssa', 'Subsahariska Afrika', '65-74', 1.2, 1.4, 2024),
('ssa', 'Subsahariska Afrika', '75+', 0.5, 0.7, 2024);

INSERT INTO public.regional_population_history (region_code, region_name, year, population_millions, growth_rate_percent, median_age) VALUES
('ssa', 'Subsahariska Afrika', 1960, 227, 2.5, 18.1),
('ssa', 'Subsahariska Afrika', 1970, 289, 2.7, 17.8),
('ssa', 'Subsahariska Afrika', 1980, 382, 2.9, 17.5),
('ssa', 'Subsahariska Afrika', 1990, 512, 2.8, 17.2),
('ssa', 'Subsahariska Afrika', 2000, 668, 2.6, 17.4),
('ssa', 'Subsahariska Afrika', 2010, 856, 2.7, 17.9),
('ssa', 'Subsahariska Afrika', 2020, 1090, 2.5, 18.7),
('ssa', 'Subsahariska Afrika', 2024, 1210, 2.4, 19.2);

INSERT INTO public.regional_life_expectancy (region_code, region_name, year, life_expectancy_overall, life_expectancy_male, life_expectancy_female, healthy_life_years) VALUES
('ssa', 'Subsahariska Afrika', 1960, 40.2, 38.5, 41.9, 35.1),
('ssa', 'Subsahariska Afrika', 1970, 44.8, 42.9, 46.7, 38.5),
('ssa', 'Subsahariska Afrika', 1980, 48.5, 46.4, 50.6, 41.2),
('ssa', 'Subsahariska Afrika', 1990, 50.2, 48.0, 52.4, 42.8),
('ssa', 'Subsahariska Afrika', 2000, 50.8, 49.1, 52.5, 43.5),
('ssa', 'Subsahariska Afrika', 2010, 56.5, 54.2, 58.8, 48.2),
('ssa', 'Subsahariska Afrika', 2020, 61.5, 59.1, 63.9, 53.1),
('ssa', 'Subsahariska Afrika', 2024, 63.2, 60.8, 65.6, 54.5);

INSERT INTO public.regional_country_data (region_code, country_code, country_name, population_millions, hdi, life_expectancy, gdp_per_capita, year) VALUES
('ssa', 'NG', 'Nigeria', 223.8, 0.539, 53.9, 2180, 2024),
('ssa', 'ET', 'Etiopien', 126.5, 0.498, 67.8, 1020, 2024),
('ssa', 'CD', 'Demokratiska republiken Kongo', 102.3, 0.479, 61.2, 580, 2024),
('ssa', 'ZA', 'Sydafrika', 60.4, 0.713, 65.3, 6780, 2024),
('ssa', 'TZ', 'Tanzania', 65.5, 0.549, 66.2, 1190, 2024),
('ssa', 'KE', 'Kenya', 54.0, 0.575, 67.4, 2080, 2024),
('ssa', 'UG', 'Uganda', 48.6, 0.525, 64.5, 880, 2024),
('ssa', 'GH', 'Ghana', 33.5, 0.602, 64.9, 2350, 2024);

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA: Europe
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.regional_demographics (region_code, region_name, age_group, male_percent, female_percent, year) VALUES
('eu', 'Europa', '0-4', 2.4, 2.3, 2024),
('eu', 'Europa', '5-14', 5.1, 4.8, 2024),
('eu', 'Europa', '15-24', 5.3, 5.0, 2024),
('eu', 'Europa', '25-34', 6.1, 5.9, 2024),
('eu', 'Europa', '35-44', 6.8, 6.7, 2024),
('eu', 'Europa', '45-54', 7.2, 7.3, 2024),
('eu', 'Europa', '55-64', 7.0, 7.4, 2024),
('eu', 'Europa', '65-74', 5.8, 6.5, 2024),
('eu', 'Europa', '75+', 4.5, 6.2, 2024);

INSERT INTO public.regional_population_history (region_code, region_name, year, population_millions, growth_rate_percent, median_age) VALUES
('eu', 'Europa', 1960, 605, 0.9, 29.5),
('eu', 'Europa', 1970, 656, 0.8, 31.2),
('eu', 'Europa', 1980, 694, 0.5, 32.8),
('eu', 'Europa', 1990, 721, 0.4, 35.1),
('eu', 'Europa', 2000, 728, 0.1, 37.8),
('eu', 'Europa', 2010, 738, 0.2, 40.1),
('eu', 'Europa', 2020, 747, 0.0, 42.5),
('eu', 'Europa', 2024, 746, -0.1, 43.9);

INSERT INTO public.regional_life_expectancy (region_code, region_name, year, life_expectancy_overall, life_expectancy_male, life_expectancy_female, healthy_life_years) VALUES
('eu', 'Europa', 1960, 68.5, 65.2, 71.8, 59.2),
('eu', 'Europa', 1970, 70.8, 67.4, 74.2, 61.5),
('eu', 'Europa', 1980, 72.5, 69.0, 76.0, 63.2),
('eu', 'Europa', 1990, 74.2, 70.5, 77.9, 65.1),
('eu', 'Europa', 2000, 76.1, 72.5, 79.7, 67.5),
('eu', 'Europa', 2010, 78.2, 74.8, 81.6, 69.8),
('eu', 'Europa', 2020, 79.5, 76.2, 82.8, 70.5),
('eu', 'Europa', 2024, 80.1, 76.9, 83.3, 71.2);

INSERT INTO public.regional_country_data (region_code, country_code, country_name, population_millions, hdi, life_expectancy, gdp_per_capita, year) VALUES
('eu', 'DE', 'Tyskland', 84.5, 0.942, 81.2, 51200, 2024),
('eu', 'FR', 'Frankrike', 68.2, 0.903, 82.5, 44900, 2024),
('eu', 'GB', 'Storbritannien', 67.8, 0.929, 81.4, 48900, 2024),
('eu', 'IT', 'Italien', 58.9, 0.895, 83.5, 38200, 2024),
('eu', 'ES', 'Spanien', 48.0, 0.905, 83.6, 32200, 2024),
('eu', 'PL', 'Polen', 37.6, 0.876, 78.5, 19800, 2024),
('eu', 'NL', 'Nederländerna', 17.8, 0.941, 82.1, 58100, 2024),
('eu', 'SE', 'Sverige', 10.5, 0.947, 83.1, 56400, 2024);

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA: Asia Pacific
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.regional_demographics (region_code, region_name, age_group, male_percent, female_percent, year) VALUES
('apac', 'Asien-Stillahavsområdet', '0-4', 4.2, 3.9, 2024),
('apac', 'Asien-Stillahavsområdet', '5-14', 8.1, 7.6, 2024),
('apac', 'Asien-Stillahavsområdet', '15-24', 7.8, 7.3, 2024),
('apac', 'Asien-Stillahavsområdet', '25-34', 8.2, 7.9, 2024),
('apac', 'Asien-Stillahavsområdet', '35-44', 7.5, 7.3, 2024),
('apac', 'Asien-Stillahavsområdet', '45-54', 6.8, 6.7, 2024),
('apac', 'Asien-Stillahavsområdet', '55-64', 5.2, 5.3, 2024),
('apac', 'Asien-Stillahavsområdet', '65-74', 3.1, 3.4, 2024),
('apac', 'Asien-Stillahavsområdet', '75+', 1.5, 2.0, 2024);

INSERT INTO public.regional_population_history (region_code, region_name, year, population_millions, growth_rate_percent, median_age) VALUES
('apac', 'Asien-Stillahavsområdet', 1960, 1650, 2.1, 22.1),
('apac', 'Asien-Stillahavsområdet', 1970, 2050, 2.2, 21.5),
('apac', 'Asien-Stillahavsområdet', 1980, 2520, 1.9, 22.8),
('apac', 'Asien-Stillahavsområdet', 1990, 2980, 1.7, 25.1),
('apac', 'Asien-Stillahavsområdet', 2000, 3450, 1.4, 27.8),
('apac', 'Asien-Stillahavsområdet', 2010, 3890, 1.1, 30.5),
('apac', 'Asien-Stillahavsområdet', 2020, 4280, 0.8, 33.2),
('apac', 'Asien-Stillahavsområdet', 2024, 4420, 0.7, 34.5);

INSERT INTO public.regional_life_expectancy (region_code, region_name, year, life_expectancy_overall, life_expectancy_male, life_expectancy_female, healthy_life_years) VALUES
('apac', 'Asien-Stillahavsområdet', 1960, 48.5, 46.8, 50.2, 42.1),
('apac', 'Asien-Stillahavsområdet', 1970, 56.2, 54.1, 58.3, 48.5),
('apac', 'Asien-Stillahavsområdet', 1980, 62.5, 60.2, 64.8, 54.2),
('apac', 'Asien-Stillahavsområdet', 1990, 67.8, 65.4, 70.2, 58.9),
('apac', 'Asien-Stillahavsområdet', 2000, 71.2, 68.8, 73.6, 62.1),
('apac', 'Asien-Stillahavsområdet', 2010, 73.8, 71.5, 76.1, 64.5),
('apac', 'Asien-Stillahavsområdet', 2020, 75.5, 73.2, 77.8, 66.2),
('apac', 'Asien-Stillahavsområdet', 2024, 76.2, 73.9, 78.5, 66.8);

INSERT INTO public.regional_country_data (region_code, country_code, country_name, population_millions, hdi, life_expectancy, gdp_per_capita, year) VALUES
('apac', 'CN', 'Kina', 1425.5, 0.768, 78.2, 12560, 2024),
('apac', 'IN', 'Indien', 1428.6, 0.644, 70.4, 2480, 2024),
('apac', 'ID', 'Indonesien', 277.5, 0.705, 72.3, 4350, 2024),
('apac', 'JP', 'Japan', 123.3, 0.925, 84.8, 39800, 2024),
('apac', 'KR', 'Sydkorea', 51.7, 0.925, 83.7, 35100, 2024),
('apac', 'PH', 'Filippinerna', 117.3, 0.699, 72.1, 3690, 2024),
('apac', 'VN', 'Vietnam', 98.9, 0.703, 75.4, 4120, 2024),
('apac', 'AU', 'Australien', 26.4, 0.951, 84.1, 65100, 2024);

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA: Americas
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.regional_demographics (region_code, region_name, age_group, male_percent, female_percent, year) VALUES
('americas', 'Amerika', '0-4', 4.1, 3.9, 2024),
('americas', 'Amerika', '5-14', 7.8, 7.5, 2024),
('americas', 'Amerika', '15-24', 7.5, 7.2, 2024),
('americas', 'Amerika', '25-34', 7.8, 7.6, 2024),
('americas', 'Amerika', '35-44', 6.8, 6.8, 2024),
('americas', 'Amerika', '45-54', 6.2, 6.4, 2024),
('americas', 'Amerika', '55-64', 5.5, 5.9, 2024),
('americas', 'Amerika', '65-74', 4.2, 4.8, 2024),
('americas', 'Amerika', '75+', 2.8, 4.0, 2024);

INSERT INTO public.regional_population_history (region_code, region_name, year, population_millions, growth_rate_percent, median_age) VALUES
('americas', 'Amerika', 1960, 425, 2.0, 24.5),
('americas', 'Amerika', 1970, 512, 1.9, 25.2),
('americas', 'Amerika', 1980, 615, 1.8, 26.1),
('americas', 'Amerika', 1990, 725, 1.6, 28.5),
('americas', 'Amerika', 2000, 840, 1.4, 30.8),
('americas', 'Amerika', 2010, 940, 1.1, 32.5),
('americas', 'Amerika', 2020, 1020, 0.8, 34.2),
('americas', 'Amerika', 2024, 1050, 0.7, 35.1);

INSERT INTO public.regional_life_expectancy (region_code, region_name, year, life_expectancy_overall, life_expectancy_male, life_expectancy_female, healthy_life_years) VALUES
('americas', 'Amerika', 1960, 61.2, 58.5, 63.9, 53.5),
('americas', 'Amerika', 1970, 65.8, 62.8, 68.8, 57.2),
('americas', 'Amerika', 1980, 69.5, 66.2, 72.8, 60.8),
('americas', 'Amerika', 1990, 72.1, 68.5, 75.7, 63.5),
('americas', 'Amerika', 2000, 74.5, 70.8, 78.2, 65.8),
('americas', 'Amerika', 2010, 76.2, 72.8, 79.6, 67.5),
('americas', 'Amerika', 2020, 77.2, 73.5, 80.9, 68.2),
('americas', 'Amerika', 2024, 77.8, 74.1, 81.5, 68.8);

INSERT INTO public.regional_country_data (region_code, country_code, country_name, population_millions, hdi, life_expectancy, gdp_per_capita, year) VALUES
('americas', 'US', 'USA', 334.9, 0.921, 76.4, 76380, 2024),
('americas', 'BR', 'Brasilien', 216.4, 0.754, 76.1, 9680, 2024),
('americas', 'MX', 'Mexiko', 128.9, 0.758, 75.1, 11290, 2024),
('americas', 'CA', 'Kanada', 40.1, 0.936, 82.4, 53250, 2024),
('americas', 'CO', 'Colombia', 52.1, 0.752, 77.3, 6510, 2024),
('americas', 'AR', 'Argentina', 46.2, 0.842, 77.2, 13650, 2024),
('americas', 'PE', 'Peru', 34.4, 0.762, 77.0, 7020, 2024),
('americas', 'CL', 'Chile', 19.5, 0.855, 80.2, 16860, 2024);