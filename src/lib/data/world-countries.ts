/**
 * WORLD COUNTRIES REGISTRY
 * 
 * Complete list of all countries with ISO codes, regions, and metadata.
 * Used for country selection throughout the system.
 */

export interface CountryInfo {
  code: string;      // ISO 3166-1 alpha-2
  code3: string;     // ISO 3166-1 alpha-3
  name_en: string;
  name_sv: string;
  region: string;
  subregion: string;
  population?: number;
}

export const WORLD_COUNTRIES: CountryInfo[] = [
  // Europe - Northern
  { code: 'SE', code3: 'SWE', name_en: 'Sweden', name_sv: 'Sverige', region: 'Europe', subregion: 'Northern Europe', population: 10500000 },
  { code: 'NO', code3: 'NOR', name_en: 'Norway', name_sv: 'Norge', region: 'Europe', subregion: 'Northern Europe', population: 5400000 },
  { code: 'DK', code3: 'DNK', name_en: 'Denmark', name_sv: 'Danmark', region: 'Europe', subregion: 'Northern Europe', population: 5900000 },
  { code: 'FI', code3: 'FIN', name_en: 'Finland', name_sv: 'Finland', region: 'Europe', subregion: 'Northern Europe', population: 5500000 },
  { code: 'IS', code3: 'ISL', name_en: 'Iceland', name_sv: 'Island', region: 'Europe', subregion: 'Northern Europe', population: 370000 },
  { code: 'EE', code3: 'EST', name_en: 'Estonia', name_sv: 'Estland', region: 'Europe', subregion: 'Northern Europe', population: 1300000 },
  { code: 'LV', code3: 'LVA', name_en: 'Latvia', name_sv: 'Lettland', region: 'Europe', subregion: 'Northern Europe', population: 1900000 },
  { code: 'LT', code3: 'LTU', name_en: 'Lithuania', name_sv: 'Litauen', region: 'Europe', subregion: 'Northern Europe', population: 2800000 },
  
  // Europe - Western
  { code: 'DE', code3: 'DEU', name_en: 'Germany', name_sv: 'Tyskland', region: 'Europe', subregion: 'Western Europe', population: 83000000 },
  { code: 'FR', code3: 'FRA', name_en: 'France', name_sv: 'Frankrike', region: 'Europe', subregion: 'Western Europe', population: 67000000 },
  { code: 'GB', code3: 'GBR', name_en: 'United Kingdom', name_sv: 'Storbritannien', region: 'Europe', subregion: 'Western Europe', population: 67000000 },
  { code: 'NL', code3: 'NLD', name_en: 'Netherlands', name_sv: 'Nederländerna', region: 'Europe', subregion: 'Western Europe', population: 17500000 },
  { code: 'BE', code3: 'BEL', name_en: 'Belgium', name_sv: 'Belgien', region: 'Europe', subregion: 'Western Europe', population: 11500000 },
  { code: 'LU', code3: 'LUX', name_en: 'Luxembourg', name_sv: 'Luxemburg', region: 'Europe', subregion: 'Western Europe', population: 640000 },
  { code: 'CH', code3: 'CHE', name_en: 'Switzerland', name_sv: 'Schweiz', region: 'Europe', subregion: 'Western Europe', population: 8700000 },
  { code: 'AT', code3: 'AUT', name_en: 'Austria', name_sv: 'Österrike', region: 'Europe', subregion: 'Western Europe', population: 9000000 },
  { code: 'IE', code3: 'IRL', name_en: 'Ireland', name_sv: 'Irland', region: 'Europe', subregion: 'Western Europe', population: 5000000 },
  
  // Europe - Southern
  { code: 'ES', code3: 'ESP', name_en: 'Spain', name_sv: 'Spanien', region: 'Europe', subregion: 'Southern Europe', population: 47000000 },
  { code: 'PT', code3: 'PRT', name_en: 'Portugal', name_sv: 'Portugal', region: 'Europe', subregion: 'Southern Europe', population: 10300000 },
  { code: 'IT', code3: 'ITA', name_en: 'Italy', name_sv: 'Italien', region: 'Europe', subregion: 'Southern Europe', population: 60000000 },
  { code: 'GR', code3: 'GRC', name_en: 'Greece', name_sv: 'Grekland', region: 'Europe', subregion: 'Southern Europe', population: 10700000 },
  { code: 'MT', code3: 'MLT', name_en: 'Malta', name_sv: 'Malta', region: 'Europe', subregion: 'Southern Europe', population: 520000 },
  { code: 'CY', code3: 'CYP', name_en: 'Cyprus', name_sv: 'Cypern', region: 'Europe', subregion: 'Southern Europe', population: 1200000 },
  { code: 'HR', code3: 'HRV', name_en: 'Croatia', name_sv: 'Kroatien', region: 'Europe', subregion: 'Southern Europe', population: 4000000 },
  { code: 'SI', code3: 'SVN', name_en: 'Slovenia', name_sv: 'Slovenien', region: 'Europe', subregion: 'Southern Europe', population: 2100000 },
  { code: 'RS', code3: 'SRB', name_en: 'Serbia', name_sv: 'Serbien', region: 'Europe', subregion: 'Southern Europe', population: 6900000 },
  { code: 'BA', code3: 'BIH', name_en: 'Bosnia and Herzegovina', name_sv: 'Bosnien och Hercegovina', region: 'Europe', subregion: 'Southern Europe', population: 3300000 },
  { code: 'ME', code3: 'MNE', name_en: 'Montenegro', name_sv: 'Montenegro', region: 'Europe', subregion: 'Southern Europe', population: 620000 },
  { code: 'AL', code3: 'ALB', name_en: 'Albania', name_sv: 'Albanien', region: 'Europe', subregion: 'Southern Europe', population: 2900000 },
  { code: 'MK', code3: 'MKD', name_en: 'North Macedonia', name_sv: 'Nordmakedonien', region: 'Europe', subregion: 'Southern Europe', population: 2100000 },
  
  // Europe - Eastern
  { code: 'PL', code3: 'POL', name_en: 'Poland', name_sv: 'Polen', region: 'Europe', subregion: 'Eastern Europe', population: 38000000 },
  { code: 'CZ', code3: 'CZE', name_en: 'Czech Republic', name_sv: 'Tjeckien', region: 'Europe', subregion: 'Eastern Europe', population: 10700000 },
  { code: 'SK', code3: 'SVK', name_en: 'Slovakia', name_sv: 'Slovakien', region: 'Europe', subregion: 'Eastern Europe', population: 5500000 },
  { code: 'HU', code3: 'HUN', name_en: 'Hungary', name_sv: 'Ungern', region: 'Europe', subregion: 'Eastern Europe', population: 9700000 },
  { code: 'RO', code3: 'ROU', name_en: 'Romania', name_sv: 'Rumänien', region: 'Europe', subregion: 'Eastern Europe', population: 19300000 },
  { code: 'BG', code3: 'BGR', name_en: 'Bulgaria', name_sv: 'Bulgarien', region: 'Europe', subregion: 'Eastern Europe', population: 6900000 },
  { code: 'UA', code3: 'UKR', name_en: 'Ukraine', name_sv: 'Ukraina', region: 'Europe', subregion: 'Eastern Europe', population: 41000000 },
  { code: 'BY', code3: 'BLR', name_en: 'Belarus', name_sv: 'Belarus', region: 'Europe', subregion: 'Eastern Europe', population: 9300000 },
  { code: 'MD', code3: 'MDA', name_en: 'Moldova', name_sv: 'Moldavien', region: 'Europe', subregion: 'Eastern Europe', population: 2600000 },
  { code: 'RU', code3: 'RUS', name_en: 'Russia', name_sv: 'Ryssland', region: 'Europe', subregion: 'Eastern Europe', population: 144000000 },
  
  // North America
  { code: 'US', code3: 'USA', name_en: 'United States', name_sv: 'USA', region: 'Americas', subregion: 'North America', population: 331000000 },
  { code: 'CA', code3: 'CAN', name_en: 'Canada', name_sv: 'Kanada', region: 'Americas', subregion: 'North America', population: 38000000 },
  { code: 'MX', code3: 'MEX', name_en: 'Mexico', name_sv: 'Mexiko', region: 'Americas', subregion: 'North America', population: 128000000 },
  
  // Central America & Caribbean
  { code: 'GT', code3: 'GTM', name_en: 'Guatemala', name_sv: 'Guatemala', region: 'Americas', subregion: 'Central America', population: 18000000 },
  { code: 'BZ', code3: 'BLZ', name_en: 'Belize', name_sv: 'Belize', region: 'Americas', subregion: 'Central America', population: 400000 },
  { code: 'HN', code3: 'HND', name_en: 'Honduras', name_sv: 'Honduras', region: 'Americas', subregion: 'Central America', population: 10000000 },
  { code: 'SV', code3: 'SLV', name_en: 'El Salvador', name_sv: 'El Salvador', region: 'Americas', subregion: 'Central America', population: 6500000 },
  { code: 'NI', code3: 'NIC', name_en: 'Nicaragua', name_sv: 'Nicaragua', region: 'Americas', subregion: 'Central America', population: 6600000 },
  { code: 'CR', code3: 'CRI', name_en: 'Costa Rica', name_sv: 'Costa Rica', region: 'Americas', subregion: 'Central America', population: 5100000 },
  { code: 'PA', code3: 'PAN', name_en: 'Panama', name_sv: 'Panama', region: 'Americas', subregion: 'Central America', population: 4400000 },
  { code: 'CU', code3: 'CUB', name_en: 'Cuba', name_sv: 'Kuba', region: 'Americas', subregion: 'Caribbean', population: 11300000 },
  { code: 'JM', code3: 'JAM', name_en: 'Jamaica', name_sv: 'Jamaica', region: 'Americas', subregion: 'Caribbean', population: 2900000 },
  { code: 'HT', code3: 'HTI', name_en: 'Haiti', name_sv: 'Haiti', region: 'Americas', subregion: 'Caribbean', population: 11400000 },
  { code: 'DO', code3: 'DOM', name_en: 'Dominican Republic', name_sv: 'Dominikanska republiken', region: 'Americas', subregion: 'Caribbean', population: 10900000 },
  { code: 'PR', code3: 'PRI', name_en: 'Puerto Rico', name_sv: 'Puerto Rico', region: 'Americas', subregion: 'Caribbean', population: 3200000 },
  
  // South America
  { code: 'BR', code3: 'BRA', name_en: 'Brazil', name_sv: 'Brasilien', region: 'Americas', subregion: 'South America', population: 213000000 },
  { code: 'AR', code3: 'ARG', name_en: 'Argentina', name_sv: 'Argentina', region: 'Americas', subregion: 'South America', population: 45000000 },
  { code: 'CL', code3: 'CHL', name_en: 'Chile', name_sv: 'Chile', region: 'Americas', subregion: 'South America', population: 19000000 },
  { code: 'CO', code3: 'COL', name_en: 'Colombia', name_sv: 'Colombia', region: 'Americas', subregion: 'South America', population: 51000000 },
  { code: 'PE', code3: 'PER', name_en: 'Peru', name_sv: 'Peru', region: 'Americas', subregion: 'South America', population: 33000000 },
  { code: 'VE', code3: 'VEN', name_en: 'Venezuela', name_sv: 'Venezuela', region: 'Americas', subregion: 'South America', population: 28000000 },
  { code: 'EC', code3: 'ECU', name_en: 'Ecuador', name_sv: 'Ecuador', region: 'Americas', subregion: 'South America', population: 18000000 },
  { code: 'BO', code3: 'BOL', name_en: 'Bolivia', name_sv: 'Bolivia', region: 'Americas', subregion: 'South America', population: 12000000 },
  { code: 'PY', code3: 'PRY', name_en: 'Paraguay', name_sv: 'Paraguay', region: 'Americas', subregion: 'South America', population: 7000000 },
  { code: 'UY', code3: 'URY', name_en: 'Uruguay', name_sv: 'Uruguay', region: 'Americas', subregion: 'South America', population: 3500000 },
  
  // Asia - East
  { code: 'CN', code3: 'CHN', name_en: 'China', name_sv: 'Kina', region: 'Asia', subregion: 'East Asia', population: 1400000000 },
  { code: 'JP', code3: 'JPN', name_en: 'Japan', name_sv: 'Japan', region: 'Asia', subregion: 'East Asia', population: 126000000 },
  { code: 'KR', code3: 'KOR', name_en: 'South Korea', name_sv: 'Sydkorea', region: 'Asia', subregion: 'East Asia', population: 52000000 },
  { code: 'KP', code3: 'PRK', name_en: 'North Korea', name_sv: 'Nordkorea', region: 'Asia', subregion: 'East Asia', population: 26000000 },
  { code: 'TW', code3: 'TWN', name_en: 'Taiwan', name_sv: 'Taiwan', region: 'Asia', subregion: 'East Asia', population: 24000000 },
  { code: 'MN', code3: 'MNG', name_en: 'Mongolia', name_sv: 'Mongoliet', region: 'Asia', subregion: 'East Asia', population: 3300000 },
  { code: 'HK', code3: 'HKG', name_en: 'Hong Kong', name_sv: 'Hongkong', region: 'Asia', subregion: 'East Asia', population: 7500000 },
  
  // Asia - Southeast
  { code: 'TH', code3: 'THA', name_en: 'Thailand', name_sv: 'Thailand', region: 'Asia', subregion: 'Southeast Asia', population: 70000000 },
  { code: 'VN', code3: 'VNM', name_en: 'Vietnam', name_sv: 'Vietnam', region: 'Asia', subregion: 'Southeast Asia', population: 98000000 },
  { code: 'MY', code3: 'MYS', name_en: 'Malaysia', name_sv: 'Malaysia', region: 'Asia', subregion: 'Southeast Asia', population: 32000000 },
  { code: 'SG', code3: 'SGP', name_en: 'Singapore', name_sv: 'Singapore', region: 'Asia', subregion: 'Southeast Asia', population: 5900000 },
  { code: 'ID', code3: 'IDN', name_en: 'Indonesia', name_sv: 'Indonesien', region: 'Asia', subregion: 'Southeast Asia', population: 274000000 },
  { code: 'PH', code3: 'PHL', name_en: 'Philippines', name_sv: 'Filippinerna', region: 'Asia', subregion: 'Southeast Asia', population: 110000000 },
  { code: 'MM', code3: 'MMR', name_en: 'Myanmar', name_sv: 'Myanmar', region: 'Asia', subregion: 'Southeast Asia', population: 54000000 },
  { code: 'KH', code3: 'KHM', name_en: 'Cambodia', name_sv: 'Kambodja', region: 'Asia', subregion: 'Southeast Asia', population: 17000000 },
  { code: 'LA', code3: 'LAO', name_en: 'Laos', name_sv: 'Laos', region: 'Asia', subregion: 'Southeast Asia', population: 7300000 },
  { code: 'BN', code3: 'BRN', name_en: 'Brunei', name_sv: 'Brunei', region: 'Asia', subregion: 'Southeast Asia', population: 440000 },
  
  // Asia - South
  { code: 'IN', code3: 'IND', name_en: 'India', name_sv: 'Indien', region: 'Asia', subregion: 'South Asia', population: 1380000000 },
  { code: 'PK', code3: 'PAK', name_en: 'Pakistan', name_sv: 'Pakistan', region: 'Asia', subregion: 'South Asia', population: 220000000 },
  { code: 'BD', code3: 'BGD', name_en: 'Bangladesh', name_sv: 'Bangladesh', region: 'Asia', subregion: 'South Asia', population: 165000000 },
  { code: 'LK', code3: 'LKA', name_en: 'Sri Lanka', name_sv: 'Sri Lanka', region: 'Asia', subregion: 'South Asia', population: 22000000 },
  { code: 'NP', code3: 'NPL', name_en: 'Nepal', name_sv: 'Nepal', region: 'Asia', subregion: 'South Asia', population: 29000000 },
  { code: 'BT', code3: 'BTN', name_en: 'Bhutan', name_sv: 'Bhutan', region: 'Asia', subregion: 'South Asia', population: 770000 },
  { code: 'MV', code3: 'MDV', name_en: 'Maldives', name_sv: 'Maldiverna', region: 'Asia', subregion: 'South Asia', population: 540000 },
  { code: 'AF', code3: 'AFG', name_en: 'Afghanistan', name_sv: 'Afghanistan', region: 'Asia', subregion: 'South Asia', population: 39000000 },
  
  // Asia - Central
  { code: 'KZ', code3: 'KAZ', name_en: 'Kazakhstan', name_sv: 'Kazakstan', region: 'Asia', subregion: 'Central Asia', population: 19000000 },
  { code: 'UZ', code3: 'UZB', name_en: 'Uzbekistan', name_sv: 'Uzbekistan', region: 'Asia', subregion: 'Central Asia', population: 34000000 },
  { code: 'TM', code3: 'TKM', name_en: 'Turkmenistan', name_sv: 'Turkmenistan', region: 'Asia', subregion: 'Central Asia', population: 6000000 },
  { code: 'TJ', code3: 'TJK', name_en: 'Tajikistan', name_sv: 'Tadzjikistan', region: 'Asia', subregion: 'Central Asia', population: 9500000 },
  { code: 'KG', code3: 'KGZ', name_en: 'Kyrgyzstan', name_sv: 'Kirgizistan', region: 'Asia', subregion: 'Central Asia', population: 6600000 },
  
  // Asia - Western (Middle East)
  { code: 'TR', code3: 'TUR', name_en: 'Turkey', name_sv: 'Turkiet', region: 'Asia', subregion: 'Western Asia', population: 84000000 },
  { code: 'IR', code3: 'IRN', name_en: 'Iran', name_sv: 'Iran', region: 'Asia', subregion: 'Western Asia', population: 84000000 },
  { code: 'IQ', code3: 'IRQ', name_en: 'Iraq', name_sv: 'Irak', region: 'Asia', subregion: 'Western Asia', population: 40000000 },
  { code: 'SA', code3: 'SAU', name_en: 'Saudi Arabia', name_sv: 'Saudiarabien', region: 'Asia', subregion: 'Western Asia', population: 35000000 },
  { code: 'AE', code3: 'ARE', name_en: 'United Arab Emirates', name_sv: 'Förenade Arabemiraten', region: 'Asia', subregion: 'Western Asia', population: 10000000 },
  { code: 'IL', code3: 'ISR', name_en: 'Israel', name_sv: 'Israel', region: 'Asia', subregion: 'Western Asia', population: 9200000 },
  { code: 'JO', code3: 'JOR', name_en: 'Jordan', name_sv: 'Jordanien', region: 'Asia', subregion: 'Western Asia', population: 10200000 },
  { code: 'LB', code3: 'LBN', name_en: 'Lebanon', name_sv: 'Libanon', region: 'Asia', subregion: 'Western Asia', population: 6800000 },
  { code: 'SY', code3: 'SYR', name_en: 'Syria', name_sv: 'Syrien', region: 'Asia', subregion: 'Western Asia', population: 17500000 },
  { code: 'YE', code3: 'YEM', name_en: 'Yemen', name_sv: 'Jemen', region: 'Asia', subregion: 'Western Asia', population: 30000000 },
  { code: 'OM', code3: 'OMN', name_en: 'Oman', name_sv: 'Oman', region: 'Asia', subregion: 'Western Asia', population: 5100000 },
  { code: 'KW', code3: 'KWT', name_en: 'Kuwait', name_sv: 'Kuwait', region: 'Asia', subregion: 'Western Asia', population: 4300000 },
  { code: 'QA', code3: 'QAT', name_en: 'Qatar', name_sv: 'Qatar', region: 'Asia', subregion: 'Western Asia', population: 2900000 },
  { code: 'BH', code3: 'BHR', name_en: 'Bahrain', name_sv: 'Bahrain', region: 'Asia', subregion: 'Western Asia', population: 1700000 },
  { code: 'GE', code3: 'GEO', name_en: 'Georgia', name_sv: 'Georgien', region: 'Asia', subregion: 'Western Asia', population: 3700000 },
  { code: 'AM', code3: 'ARM', name_en: 'Armenia', name_sv: 'Armenien', region: 'Asia', subregion: 'Western Asia', population: 3000000 },
  { code: 'AZ', code3: 'AZE', name_en: 'Azerbaijan', name_sv: 'Azerbajdzjan', region: 'Asia', subregion: 'Western Asia', population: 10100000 },
  
  // Africa - Northern
  { code: 'EG', code3: 'EGY', name_en: 'Egypt', name_sv: 'Egypten', region: 'Africa', subregion: 'Northern Africa', population: 102000000 },
  { code: 'LY', code3: 'LBY', name_en: 'Libya', name_sv: 'Libyen', region: 'Africa', subregion: 'Northern Africa', population: 6900000 },
  { code: 'TN', code3: 'TUN', name_en: 'Tunisia', name_sv: 'Tunisien', region: 'Africa', subregion: 'Northern Africa', population: 11800000 },
  { code: 'DZ', code3: 'DZA', name_en: 'Algeria', name_sv: 'Algeriet', region: 'Africa', subregion: 'Northern Africa', population: 44000000 },
  { code: 'MA', code3: 'MAR', name_en: 'Morocco', name_sv: 'Marocko', region: 'Africa', subregion: 'Northern Africa', population: 37000000 },
  { code: 'SD', code3: 'SDN', name_en: 'Sudan', name_sv: 'Sudan', region: 'Africa', subregion: 'Northern Africa', population: 44000000 },
  
  // Africa - Western
  { code: 'NG', code3: 'NGA', name_en: 'Nigeria', name_sv: 'Nigeria', region: 'Africa', subregion: 'Western Africa', population: 211000000 },
  { code: 'GH', code3: 'GHA', name_en: 'Ghana', name_sv: 'Ghana', region: 'Africa', subregion: 'Western Africa', population: 31000000 },
  { code: 'CI', code3: 'CIV', name_en: 'Ivory Coast', name_sv: 'Elfenbenskusten', region: 'Africa', subregion: 'Western Africa', population: 26000000 },
  { code: 'SN', code3: 'SEN', name_en: 'Senegal', name_sv: 'Senegal', region: 'Africa', subregion: 'Western Africa', population: 17000000 },
  { code: 'ML', code3: 'MLI', name_en: 'Mali', name_sv: 'Mali', region: 'Africa', subregion: 'Western Africa', population: 20000000 },
  { code: 'BF', code3: 'BFA', name_en: 'Burkina Faso', name_sv: 'Burkina Faso', region: 'Africa', subregion: 'Western Africa', population: 21000000 },
  { code: 'NE', code3: 'NER', name_en: 'Niger', name_sv: 'Niger', region: 'Africa', subregion: 'Western Africa', population: 24000000 },
  { code: 'BJ', code3: 'BEN', name_en: 'Benin', name_sv: 'Benin', region: 'Africa', subregion: 'Western Africa', population: 12000000 },
  { code: 'TG', code3: 'TGO', name_en: 'Togo', name_sv: 'Togo', region: 'Africa', subregion: 'Western Africa', population: 8300000 },
  { code: 'GN', code3: 'GIN', name_en: 'Guinea', name_sv: 'Guinea', region: 'Africa', subregion: 'Western Africa', population: 13000000 },
  { code: 'SL', code3: 'SLE', name_en: 'Sierra Leone', name_sv: 'Sierra Leone', region: 'Africa', subregion: 'Western Africa', population: 8000000 },
  { code: 'LR', code3: 'LBR', name_en: 'Liberia', name_sv: 'Liberia', region: 'Africa', subregion: 'Western Africa', population: 5100000 },
  { code: 'MR', code3: 'MRT', name_en: 'Mauritania', name_sv: 'Mauretanien', region: 'Africa', subregion: 'Western Africa', population: 4600000 },
  { code: 'GM', code3: 'GMB', name_en: 'Gambia', name_sv: 'Gambia', region: 'Africa', subregion: 'Western Africa', population: 2400000 },
  { code: 'GW', code3: 'GNB', name_en: 'Guinea-Bissau', name_sv: 'Guinea-Bissau', region: 'Africa', subregion: 'Western Africa', population: 2000000 },
  { code: 'CV', code3: 'CPV', name_en: 'Cape Verde', name_sv: 'Kap Verde', region: 'Africa', subregion: 'Western Africa', population: 560000 },
  
  // Africa - Eastern
  { code: 'ET', code3: 'ETH', name_en: 'Ethiopia', name_sv: 'Etiopien', region: 'Africa', subregion: 'Eastern Africa', population: 115000000 },
  { code: 'KE', code3: 'KEN', name_en: 'Kenya', name_sv: 'Kenya', region: 'Africa', subregion: 'Eastern Africa', population: 54000000 },
  { code: 'TZ', code3: 'TZA', name_en: 'Tanzania', name_sv: 'Tanzania', region: 'Africa', subregion: 'Eastern Africa', population: 60000000 },
  { code: 'UG', code3: 'UGA', name_en: 'Uganda', name_sv: 'Uganda', region: 'Africa', subregion: 'Eastern Africa', population: 46000000 },
  { code: 'RW', code3: 'RWA', name_en: 'Rwanda', name_sv: 'Rwanda', region: 'Africa', subregion: 'Eastern Africa', population: 13000000 },
  { code: 'BI', code3: 'BDI', name_en: 'Burundi', name_sv: 'Burundi', region: 'Africa', subregion: 'Eastern Africa', population: 12000000 },
  { code: 'SO', code3: 'SOM', name_en: 'Somalia', name_sv: 'Somalia', region: 'Africa', subregion: 'Eastern Africa', population: 16000000 },
  { code: 'ER', code3: 'ERI', name_en: 'Eritrea', name_sv: 'Eritrea', region: 'Africa', subregion: 'Eastern Africa', population: 3500000 },
  { code: 'DJ', code3: 'DJI', name_en: 'Djibouti', name_sv: 'Djibouti', region: 'Africa', subregion: 'Eastern Africa', population: 1000000 },
  { code: 'MG', code3: 'MDG', name_en: 'Madagascar', name_sv: 'Madagaskar', region: 'Africa', subregion: 'Eastern Africa', population: 28000000 },
  { code: 'MU', code3: 'MUS', name_en: 'Mauritius', name_sv: 'Mauritius', region: 'Africa', subregion: 'Eastern Africa', population: 1300000 },
  { code: 'SC', code3: 'SYC', name_en: 'Seychelles', name_sv: 'Seychellerna', region: 'Africa', subregion: 'Eastern Africa', population: 98000 },
  { code: 'KM', code3: 'COM', name_en: 'Comoros', name_sv: 'Komorerna', region: 'Africa', subregion: 'Eastern Africa', population: 870000 },
  { code: 'MW', code3: 'MWI', name_en: 'Malawi', name_sv: 'Malawi', region: 'Africa', subregion: 'Eastern Africa', population: 19000000 },
  { code: 'ZM', code3: 'ZMB', name_en: 'Zambia', name_sv: 'Zambia', region: 'Africa', subregion: 'Eastern Africa', population: 18000000 },
  { code: 'ZW', code3: 'ZWE', name_en: 'Zimbabwe', name_sv: 'Zimbabwe', region: 'Africa', subregion: 'Eastern Africa', population: 15000000 },
  { code: 'MZ', code3: 'MOZ', name_en: 'Mozambique', name_sv: 'Moçambique', region: 'Africa', subregion: 'Eastern Africa', population: 31000000 },
  
  // Africa - Central
  { code: 'CD', code3: 'COD', name_en: 'DR Congo', name_sv: 'Demokratiska republiken Kongo', region: 'Africa', subregion: 'Central Africa', population: 90000000 },
  { code: 'CG', code3: 'COG', name_en: 'Congo', name_sv: 'Kongo-Brazzaville', region: 'Africa', subregion: 'Central Africa', population: 5500000 },
  { code: 'CM', code3: 'CMR', name_en: 'Cameroon', name_sv: 'Kamerun', region: 'Africa', subregion: 'Central Africa', population: 27000000 },
  { code: 'CF', code3: 'CAF', name_en: 'Central African Republic', name_sv: 'Centralafrikanska republiken', region: 'Africa', subregion: 'Central Africa', population: 4800000 },
  { code: 'TD', code3: 'TCD', name_en: 'Chad', name_sv: 'Tchad', region: 'Africa', subregion: 'Central Africa', population: 16000000 },
  { code: 'GA', code3: 'GAB', name_en: 'Gabon', name_sv: 'Gabon', region: 'Africa', subregion: 'Central Africa', population: 2200000 },
  { code: 'GQ', code3: 'GNQ', name_en: 'Equatorial Guinea', name_sv: 'Ekvatorialguinea', region: 'Africa', subregion: 'Central Africa', population: 1400000 },
  { code: 'AO', code3: 'AGO', name_en: 'Angola', name_sv: 'Angola', region: 'Africa', subregion: 'Central Africa', population: 33000000 },
  { code: 'ST', code3: 'STP', name_en: 'São Tomé and Príncipe', name_sv: 'São Tomé och Príncipe', region: 'Africa', subregion: 'Central Africa', population: 220000 },
  
  // Africa - Southern
  { code: 'ZA', code3: 'ZAF', name_en: 'South Africa', name_sv: 'Sydafrika', region: 'Africa', subregion: 'Southern Africa', population: 60000000 },
  { code: 'NA', code3: 'NAM', name_en: 'Namibia', name_sv: 'Namibia', region: 'Africa', subregion: 'Southern Africa', population: 2500000 },
  { code: 'BW', code3: 'BWA', name_en: 'Botswana', name_sv: 'Botswana', region: 'Africa', subregion: 'Southern Africa', population: 2400000 },
  { code: 'LS', code3: 'LSO', name_en: 'Lesotho', name_sv: 'Lesotho', region: 'Africa', subregion: 'Southern Africa', population: 2100000 },
  { code: 'SZ', code3: 'SWZ', name_en: 'Eswatini', name_sv: 'Eswatini', region: 'Africa', subregion: 'Southern Africa', population: 1200000 },
  
  // Oceania
  { code: 'AU', code3: 'AUS', name_en: 'Australia', name_sv: 'Australien', region: 'Oceania', subregion: 'Australia and New Zealand', population: 26000000 },
  { code: 'NZ', code3: 'NZL', name_en: 'New Zealand', name_sv: 'Nya Zeeland', region: 'Oceania', subregion: 'Australia and New Zealand', population: 5100000 },
  { code: 'PG', code3: 'PNG', name_en: 'Papua New Guinea', name_sv: 'Papua Nya Guinea', region: 'Oceania', subregion: 'Melanesia', population: 9000000 },
  { code: 'FJ', code3: 'FJI', name_en: 'Fiji', name_sv: 'Fiji', region: 'Oceania', subregion: 'Melanesia', population: 900000 },
  { code: 'SB', code3: 'SLB', name_en: 'Solomon Islands', name_sv: 'Salomonöarna', region: 'Oceania', subregion: 'Melanesia', population: 700000 },
  { code: 'VU', code3: 'VUT', name_en: 'Vanuatu', name_sv: 'Vanuatu', region: 'Oceania', subregion: 'Melanesia', population: 310000 },
  { code: 'NC', code3: 'NCL', name_en: 'New Caledonia', name_sv: 'Nya Kaledonien', region: 'Oceania', subregion: 'Melanesia', population: 290000 },
  { code: 'WS', code3: 'WSM', name_en: 'Samoa', name_sv: 'Samoa', region: 'Oceania', subregion: 'Polynesia', population: 200000 },
  { code: 'TO', code3: 'TON', name_en: 'Tonga', name_sv: 'Tonga', region: 'Oceania', subregion: 'Polynesia', population: 106000 },
  { code: 'PF', code3: 'PYF', name_en: 'French Polynesia', name_sv: 'Franska Polynesien', region: 'Oceania', subregion: 'Polynesia', population: 280000 },
];

// Group countries by region
export const COUNTRIES_BY_REGION = WORLD_COUNTRIES.reduce((acc, country) => {
  if (!acc[country.region]) {
    acc[country.region] = [];
  }
  acc[country.region].push(country);
  return acc;
}, {} as Record<string, CountryInfo[]>);

// Get regions list
export const REGIONS = Object.keys(COUNTRIES_BY_REGION);

// Quick lookup by code
export const COUNTRY_BY_CODE = WORLD_COUNTRIES.reduce((acc, country) => {
  acc[country.code] = country;
  return acc;
}, {} as Record<string, CountryInfo>);
