// База данных взрывчатых веществ.
// Источник: Wikipedia — "TNT equivalent" (en.wikipedia.org/wiki/TNT_equivalent)
// и связанные статьи о конкретных веществах. Данные носят справочный
// характер и используются только для РП-калькулятора.
//
// Поля:
//   id                — стабильный идентификатор для записей истории
//   substance_name    — общеупотребительное название (русское / международное)
//   formula           — химическая формула или состав смеси
//   category          — primary | secondary | propellant | commercial |
//                       military | experimental | improvised
//   state             — solid | liquid | gel | powder | emulsion
//   density           — плотность, г/см³
//   detonation_force  — скорость детонации (VOD), м/с
//   tnt_equivalent    — относительная эффективность в тротиловом эквиваленте

const explosivesData = [
    {
        id: 1,
        substance_name: "Нитрат аммония",
        formula: "NH₄NO₃",
        category: "improvised",
        state: "powder",
        density: 0.88,
        detonation_force: 2700.0,
        tnt_equivalent: 0.32
    },
    {
        id: 2,
        substance_name: "Фульминат ртути",
        formula: "Hg(CNO)₂",
        category: "primary",
        state: "solid",
        density: 4.42,
        detonation_force: 4250.0,
        tnt_equivalent: 0.51
    },
    {
        id: 3,
        substance_name: "Чёрный порох",
        formula: "KNO₃ / S / C",
        category: "propellant",
        state: "powder",
        density: 1.65,
        detonation_force: 400.0,
        tnt_equivalent: 0.55
    },
    {
        id: 4,
        substance_name: "Гексаминдинитрат",
        formula: "C₆H₁₂N₄·2HNO₃",
        category: "improvised",
        state: "solid",
        density: 1.30,
        detonation_force: 5070.0,
        tnt_equivalent: 0.60
    },
    {
        id: 5,
        substance_name: "Динитробензол",
        formula: "C₆H₄(NO₂)₂",
        category: "secondary",
        state: "solid",
        density: 1.50,
        detonation_force: 6025.0,
        tnt_equivalent: 0.60
    },
    {
        id: 6,
        substance_name: "Гексаминпероксид (HMTD)",
        formula: "C₆H₁₂N₂O₆",
        category: "primary",
        state: "solid",
        density: 0.88,
        detonation_force: 4520.0,
        tnt_equivalent: 0.74
    },
    {
        id: 7,
        substance_name: "ANFO",
        formula: "NH₄NO₃ + CₙHₘ (~94/6)",
        category: "commercial",
        state: "powder",
        density: 0.92,
        detonation_force: 4200.0,
        tnt_equivalent: 0.74
    },
    {
        id: 8,
        substance_name: "Нитрат мочевины",
        formula: "CO(NH₂)₂·HNO₃",
        category: "improvised",
        state: "solid",
        density: 1.67,
        detonation_force: 4700.0,
        tnt_equivalent: 0.77
    },
    {
        id: 9,
        substance_name: "Ацетонпероксид (TATP)",
        formula: "C₉H₁₈O₆",
        category: "primary",
        state: "solid",
        density: 1.18,
        detonation_force: 5300.0,
        tnt_equivalent: 0.80
    },
    {
        id: 10,
        substance_name: "Tovex Extra",
        formula: "NH₄NO₃ + CH₆N₄O₂ (emulsion)",
        category: "commercial",
        state: "emulsion",
        density: 1.33,
        detonation_force: 5690.0,
        tnt_equivalent: 0.80
    },
    {
        id: 11,
        substance_name: "Hydromite 600",
        formula: "NH₄NO₃ (water gel)",
        category: "commercial",
        state: "gel",
        density: 1.24,
        detonation_force: 5550.0,
        tnt_equivalent: 0.80
    },
    {
        id: 12,
        substance_name: "ANNMAL",
        formula: "NH₄NO₃ + NM + Al",
        category: "commercial",
        state: "emulsion",
        density: 1.16,
        detonation_force: 5360.0,
        tnt_equivalent: 0.87
    },
    {
        id: 13,
        substance_name: "Аматол 80/20",
        formula: "NH₄NO₃ + TNT (80/20)",
        category: "military",
        state: "solid",
        density: 1.50,
        detonation_force: 6290.0,
        tnt_equivalent: 0.91
    },
    {
        id: 14,
        substance_name: "Нитрогуанидин",
        formula: "CH₄N₄O₂",
        category: "propellant",
        state: "solid",
        density: 1.32,
        detonation_force: 6750.0,
        tnt_equivalent: 0.95
    },
    {
        id: 15,
        substance_name: "Тринитротолуол (TNT)",
        formula: "C₆H₂(NO₂)₃CH₃",
        category: "military",
        state: "solid",
        density: 1.60,
        detonation_force: 6900.0,
        tnt_equivalent: 1.00
    },
    {
        id: 16,
        substance_name: "Гексанитростильбен (HNS)",
        formula: "C₁₄H₆N₆O₁₂",
        category: "military",
        state: "solid",
        density: 1.70,
        detonation_force: 7080.0,
        tnt_equivalent: 1.05
    },
    {
        id: 17,
        substance_name: "Нитромочевина",
        formula: "CH₃N₃O₃",
        category: "secondary",
        state: "solid",
        density: 1.45,
        detonation_force: 6860.0,
        tnt_equivalent: 1.05
    },
    {
        id: 18,
        substance_name: "Тритональ",
        formula: "TNT + Al (80/20)",
        category: "military",
        state: "solid",
        density: 1.70,
        detonation_force: 6650.0,
        tnt_equivalent: 1.05
    },
    {
        id: 19,
        substance_name: "Нитрат никель-гидразина",
        formula: "Ni(N₂H₄)₃(NO₃)₂",
        category: "primary",
        state: "solid",
        density: 1.70,
        detonation_force: 7000.0,
        tnt_equivalent: 1.05
    },
    {
        id: 20,
        substance_name: "Аматол 50/50",
        formula: "NH₄NO₃ + TNT (50/50)",
        category: "military",
        state: "solid",
        density: 1.55,
        detonation_force: 6570.0,
        tnt_equivalent: 1.10
    },
    {
        id: 21,
        substance_name: "Нитроцеллюлоза",
        formula: "[C₆H₇(NO₂)₃O₅]ₙ",
        category: "propellant",
        state: "solid",
        density: 1.40,
        detonation_force: 6400.0,
        tnt_equivalent: 1.10
    },
    {
        id: 22,
        substance_name: "Нитрометан",
        formula: "CH₃NO₂",
        category: "improvised",
        state: "liquid",
        density: 1.13,
        detonation_force: 6360.0,
        tnt_equivalent: 1.10
    },
    {
        id: 23,
        substance_name: "PBXW-126",
        formula: "NTO + TATB + HMX (binder)",
        category: "military",
        state: "solid",
        density: 1.80,
        detonation_force: 6450.0,
        tnt_equivalent: 1.10
    },
    {
        id: 24,
        substance_name: "Диэтиленгликольдинитрат (DEGDN)",
        formula: "C₄H₈N₂O₇",
        category: "propellant",
        state: "liquid",
        density: 1.38,
        detonation_force: 6610.0,
        tnt_equivalent: 1.17
    },
    {
        id: 25,
        substance_name: "PBXIH-135 EB",
        formula: "HMX + binder",
        category: "military",
        state: "solid",
        density: 1.81,
        detonation_force: 7060.0,
        tnt_equivalent: 1.17
    },
    {
        id: 26,
        substance_name: "PBXN-109",
        formula: "RDX + Al + binder",
        category: "military",
        state: "solid",
        density: 1.68,
        detonation_force: 7450.0,
        tnt_equivalent: 1.17
    },
    {
        id: 27,
        substance_name: "Триаминотринитробензол (TATB)",
        formula: "C₆H₆N₆O₆",
        category: "military",
        state: "solid",
        density: 1.80,
        detonation_force: 7550.0,
        tnt_equivalent: 1.17
    },
    {
        id: 28,
        substance_name: "Пикриновая кислота",
        formula: "C₆H₃N₃O₇",
        category: "secondary",
        state: "solid",
        density: 1.71,
        detonation_force: 7350.0,
        tnt_equivalent: 1.17
    },
    {
        id: 29,
        substance_name: "Тринитробензол (TNB)",
        formula: "C₆H₃N₃O₆",
        category: "secondary",
        state: "solid",
        density: 1.60,
        detonation_force: 7300.0,
        tnt_equivalent: 1.20
    },
    {
        id: 30,
        substance_name: "Тетритол",
        formula: "Tetryl + TNT (70/30)",
        category: "military",
        state: "solid",
        density: 1.60,
        detonation_force: 7370.0,
        tnt_equivalent: 1.20
    },
    {
        id: 31,
        substance_name: "Динамит (Нобеля)",
        formula: "Нитроглицерин + sorbent",
        category: "commercial",
        state: "solid",
        density: 1.48,
        detonation_force: 7200.0,
        tnt_equivalent: 1.25
    },
    {
        id: 32,
        substance_name: "Тетрил",
        formula: "C₇H₅N₅O₈",
        category: "military",
        state: "solid",
        density: 1.71,
        detonation_force: 7770.0,
        tnt_equivalent: 1.25
    },
    {
        id: 33,
        substance_name: "Торпекс",
        formula: "RDX + TNT + Al (42/40/18)",
        category: "military",
        state: "solid",
        density: 1.80,
        detonation_force: 7440.0,
        tnt_equivalent: 1.30
    },
    {
        id: 34,
        substance_name: "Composition B",
        formula: "RDX + TNT (59/40 + 1%)",
        category: "military",
        state: "solid",
        density: 1.72,
        detonation_force: 7840.0,
        tnt_equivalent: 1.33
    },
    {
        id: 35,
        substance_name: "Composition C-3",
        formula: "RDX + binder",
        category: "military",
        state: "solid",
        density: 1.60,
        detonation_force: 7630.0,
        tnt_equivalent: 1.33
    },
    {
        id: 36,
        substance_name: "Composition C-4",
        formula: "RDX + polyisobutylene + binder",
        category: "military",
        state: "solid",
        density: 1.59,
        detonation_force: 8040.0,
        tnt_equivalent: 1.34
    },
    {
        id: 37,
        substance_name: "Пентолит",
        formula: "PETN + TNT (50/50)",
        category: "military",
        state: "solid",
        density: 1.66,
        detonation_force: 7520.0,
        tnt_equivalent: 1.33
    },
    {
        id: 38,
        substance_name: "Semtex 1A",
        formula: "PETN + RDX + binder",
        category: "military",
        state: "solid",
        density: 1.55,
        detonation_force: 7670.0,
        tnt_equivalent: 1.35
    },
    {
        id: 39,
        substance_name: "Hexal",
        formula: "RDX + Al + wax",
        category: "military",
        state: "solid",
        density: 1.79,
        detonation_force: 7640.0,
        tnt_equivalent: 1.35
    },
    {
        id: 40,
        substance_name: "RISAL P",
        formula: "Al + ammonium perchlorate (slurry)",
        category: "commercial",
        state: "gel",
        density: 1.39,
        detonation_force: 5980.0,
        tnt_equivalent: 1.40
    },
    {
        id: 41,
        substance_name: "Нитрат гидразина",
        formula: "N₂H₅NO₃",
        category: "experimental",
        state: "solid",
        density: 1.59,
        detonation_force: 8500.0,
        tnt_equivalent: 1.42
    },
    {
        id: 42,
        substance_name: "Смесь TNT + NH₄NO₃ + RDX",
        formula: "TNT + AN + RDX",
        category: "military",
        state: "solid",
        density: 1.48,
        detonation_force: 8060.0,
        tnt_equivalent: 1.50
    },
    {
        id: 43,
        substance_name: "Нитроглицерин",
        formula: "C₃H₅N₃O₉",
        category: "secondary",
        state: "liquid",
        density: 1.59,
        detonation_force: 7700.0,
        tnt_equivalent: 1.54
    },
    {
        id: 44,
        substance_name: "Метилнитрат",
        formula: "CH₃NO₃",
        category: "experimental",
        state: "liquid",
        density: 1.21,
        detonation_force: 7900.0,
        tnt_equivalent: 1.54
    },
    {
        id: 45,
        substance_name: "Октол",
        formula: "HMX + TNT (70/30)",
        category: "military",
        state: "solid",
        density: 1.83,
        detonation_force: 8690.0,
        tnt_equivalent: 1.54
    },
    {
        id: 46,
        substance_name: "Нитротриазолон (NTO)",
        formula: "C₂H₂N₄O₃",
        category: "military",
        state: "solid",
        density: 1.87,
        detonation_force: 8120.0,
        tnt_equivalent: 1.60
    },
    {
        id: 47,
        substance_name: "FOX-7 (DADNE)",
        formula: "C₂H₄N₄O₄",
        category: "experimental",
        state: "solid",
        density: 1.77,
        detonation_force: 8330.0,
        tnt_equivalent: 1.60
    },
    {
        id: 48,
        substance_name: "Гелигнит",
        formula: "Нитроглицерин + нитроцеллюлоза + sorbent",
        category: "commercial",
        state: "gel",
        density: 1.60,
        detonation_force: 7970.0,
        tnt_equivalent: 1.60
    },
    {
        id: 49,
        substance_name: "Plastic Gel",
        formula: "RDX/PETN + plasticizer",
        category: "commercial",
        state: "gel",
        density: 1.51,
        detonation_force: 7940.0,
        tnt_equivalent: 1.60
    },
    {
        id: 50,
        substance_name: "Composition A-5",
        formula: "RDX + stearic acid (98.5/1.5)",
        category: "military",
        state: "solid",
        density: 1.65,
        detonation_force: 8470.0,
        tnt_equivalent: 1.60
    },
    {
        id: 51,
        substance_name: "Эритритолтетранитрат (ETN)",
        formula: "C₄H₆N₄O₁₂",
        category: "experimental",
        state: "solid",
        density: 1.72,
        detonation_force: 8206.0,
        tnt_equivalent: 1.60
    },
    {
        id: 52,
        substance_name: "Гексоген (RDX)",
        formula: "C₃H₆N₆O₆",
        category: "military",
        state: "solid",
        density: 1.78,
        detonation_force: 8600.0,
        tnt_equivalent: 1.60
    },
    {
        id: 53,
        substance_name: "PBXW-11",
        formula: "HMX + binder",
        category: "military",
        state: "solid",
        density: 1.81,
        detonation_force: 8720.0,
        tnt_equivalent: 1.60
    },
    {
        id: 54,
        substance_name: "Тэн (PETN)",
        formula: "C₅H₈N₄O₁₂",
        category: "military",
        state: "solid",
        density: 1.77,
        detonation_force: 8400.0,
        tnt_equivalent: 1.66
    },
    {
        id: 55,
        substance_name: "Этиленгликольдинитрат (EGDN)",
        formula: "C₂H₄N₂O₆",
        category: "secondary",
        state: "liquid",
        density: 1.49,
        detonation_force: 8300.0,
        tnt_equivalent: 1.66
    },
    {
        id: 56,
        substance_name: "MEDINA",
        formula: "C₂H₆N₄O₆",
        category: "experimental",
        state: "solid",
        density: 1.65,
        detonation_force: 8700.0,
        tnt_equivalent: 1.70
    },
    {
        id: 57,
        substance_name: "Тринитроазетидин (TNAZ)",
        formula: "C₃H₄N₄O₆",
        category: "experimental",
        state: "solid",
        density: 1.85,
        detonation_force: 8640.0,
        tnt_equivalent: 1.70
    },
    {
        id: 58,
        substance_name: "Октоген (HMX)",
        formula: "C₄H₈N₈O₈",
        category: "military",
        state: "solid",
        density: 1.86,
        detonation_force: 9100.0,
        tnt_equivalent: 1.70
    },
    {
        id: 59,
        substance_name: "Гексанитробензол (HNB)",
        formula: "C₆N₆O₁₂",
        category: "experimental",
        state: "solid",
        density: 1.97,
        detonation_force: 9340.0,
        tnt_equivalent: 1.80
    },
    {
        id: 60,
        substance_name: "CL-20 (HNIW)",
        formula: "C₆H₆N₁₂O₁₂",
        category: "experimental",
        state: "solid",
        density: 1.97,
        detonation_force: 9500.0,
        tnt_equivalent: 1.90
    },
    {
        id: 61,
        substance_name: "DDF (4,4'-динитро-3,3'-диазенофуроксан)",
        formula: "C₄N₈O₈",
        category: "experimental",
        state: "solid",
        density: 1.98,
        detonation_force: 10000.0,
        tnt_equivalent: 1.95
    },
    {
        id: 62,
        substance_name: "Октанитрокубан (ONC)",
        formula: "C₈(NO₂)₈",
        category: "experimental",
        state: "solid",
        density: 1.95,
        detonation_force: 10600.0,
        tnt_equivalent: 2.38
    },
    {
        id: 63,
        substance_name: "Октаазакубан (теоретический)",
        formula: "N₈",
        category: "experimental",
        state: "solid",
        density: 2.69,
        detonation_force: 15000.0,
        tnt_equivalent: 5.00
    }
];

// Человекочитаемые названия категорий для UI.
const explosiveCategoryLabels = {
    primary: "Инициирующее",
    secondary: "Бризантное",
    propellant: "Метательное",
    commercial: "Промышленное",
    military: "Военное",
    experimental: "Экспериментальное",
    improvised: "Кустарное"
};

const explosiveStateLabels = {
    solid: "тв.",
    liquid: "жидк.",
    gel: "гель",
    powder: "порошок",
    emulsion: "эмульсия"
};

// =============================================================
// Справочник боеприпасов.
// Источник: открытые статьи Wikipedia (infobox-уровень данных).
// Поля:
//   id              — стабильный идентификатор
//   name            — короткое наименование (для поиска)
//   full_name       — полное наименование
//   category        — hand_grenade | demolition | aerial_bomb |
//                     artillery | mortar | mine_ap | mine_at | rocket
//   origin          — страна разработки (короткий код)
//   explosive_id    — ссылка на запись в explosivesData
//   filler_note     — пояснение к снаряжению, если оно отличается
//                     (марка состава, смесь и т.п.)
//   filler_grams    — масса ВВ внутри, г
//   total_grams     — общая масса изделия, г
//   effective_m     — эффективный радиус поражения, м (если известен)
//   delay_sec       — задержка взрывателя, с (для ручных гранат)
//   note            — короткое описание
// =============================================================

const munitionsData = [
    // ---------- Ручные гранаты ----------
    {
        id: 1,
        name: "M67",
        full_name: "M67 fragmentation hand grenade",
        category: "hand_grenade",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Composition B",
        filler_grams: 180,
        total_grams: 400,
        effective_m: 5,
        delay_sec: 4.5,
        note: "Стандартная осколочная граната ВС США, стальной сферический корпус."
    },
    {
        id: 2,
        name: "M61",
        full_name: "M61 fragmentation hand grenade",
        category: "hand_grenade",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Composition B",
        filler_grams: 156,
        total_grams: 454,
        effective_m: 5,
        delay_sec: 4.5,
        note: "Предшественник M67, рифлёный корпус «лимонка»."
    },
    {
        id: 3,
        name: "M26",
        full_name: "M26 fragmentation hand grenade",
        category: "hand_grenade",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Composition B",
        filler_grams: 165,
        total_grams: 454,
        effective_m: 15,
        delay_sec: 4.5,
        note: "Корейская/вьетнамская эпоха, овальный корпус."
    },
    {
        id: 4,
        name: "Mk 2",
        full_name: "Mk 2 fragmentation grenade «Pineapple»",
        category: "hand_grenade",
        origin: "USA",
        explosive_id: 15,
        filler_note: "Flaked TNT",
        filler_grams: 57,
        total_grams: 595,
        effective_m: 9,
        delay_sec: 4.5,
        note: "WWII, чугунный «ананас». Снят с вооружения."
    },
    {
        id: 5,
        name: "Mk 3A2",
        full_name: "Mk 3A2 concussion grenade",
        category: "hand_grenade",
        origin: "USA",
        explosive_id: 15,
        filler_note: "Flaked TNT",
        filler_grams: 227,
        total_grams: 442,
        effective_m: 2,
        delay_sec: 4.5,
        note: "Фугасная (концуссионная) граната, картонный корпус."
    },
    {
        id: 6,
        name: "F-1",
        full_name: "Ф-1 «лимонка»",
        category: "hand_grenade",
        origin: "СССР",
        explosive_id: 15,
        filler_note: "TNT (тротил)",
        filler_grams: 60,
        total_grams: 600,
        effective_m: 30,
        delay_sec: 4.0,
        note: "Оборонительная осколочная граната, ребристый чугунный корпус."
    },
    {
        id: 7,
        name: "RGD-5",
        full_name: "РГД-5",
        category: "hand_grenade",
        origin: "СССР",
        explosive_id: 15,
        filler_note: "TNT",
        filler_grams: 110,
        total_grams: 310,
        effective_m: 5,
        delay_sec: 4.0,
        note: "Наступательная осколочная, тонкостенный жестяной корпус."
    },
    {
        id: 8,
        name: "RG-42",
        full_name: "РГ-42",
        category: "hand_grenade",
        origin: "СССР",
        explosive_id: 15,
        filler_note: "TNT",
        filler_grams: 200,
        total_grams: 420,
        effective_m: 25,
        delay_sec: 4.0,
        note: "Универсальная осколочная (наступательно-оборонительная)."
    },
    {
        id: 9,
        name: "RGN",
        full_name: "РГН «наступательная»",
        category: "hand_grenade",
        origin: "СССР/РФ",
        explosive_id: 52,
        filler_note: "A-IX-1 (флегматизированный RDX)",
        filler_grams: 92,
        total_grams: 290,
        effective_m: 8,
        delay_sec: 3.5,
        note: "Граната УДЗ — взрыватель ударно-дистанционного действия."
    },
    {
        id: 10,
        name: "RGO",
        full_name: "РГО «оборонительная»",
        category: "hand_grenade",
        origin: "СССР/РФ",
        explosive_id: 52,
        filler_note: "A-IX-1",
        filler_grams: 92,
        total_grams: 530,
        effective_m: 20,
        delay_sec: 3.5,
        note: "Аналог РГН с тяжёлым насечённым корпусом."
    },
    {
        id: 11,
        name: "Mills No.36",
        full_name: "Mills bomb No.36M",
        category: "hand_grenade",
        origin: "UK",
        explosive_id: 15,
        filler_note: "Baratol / Amatol",
        filler_grams: 71,
        total_grams: 765,
        effective_m: 9,
        delay_sec: 4.0,
        note: "Британская граната WWI–WWII, осколочный чугунный корпус."
    },
    {
        id: 12,
        name: "DM51",
        full_name: "DM51 dual-purpose hand grenade",
        category: "hand_grenade",
        origin: "ФРГ",
        explosive_id: 34,
        filler_note: "Composition B",
        filler_grams: 60,
        total_grams: 445,
        effective_m: 8,
        delay_sec: 4.0,
        note: "Съёмная осколочная рубашка — позволяет менять режим."
    },
    {
        id: 13,
        name: "L109A1",
        full_name: "L109A1 fragmentation grenade",
        category: "hand_grenade",
        origin: "UK",
        explosive_id: 34,
        filler_note: "RDX/TNT (Composition B)",
        filler_grams: 155,
        total_grams: 465,
        effective_m: 5,
        delay_sec: 3.5,
        note: "Текущая стандартная граната Британской армии."
    },

    // ---------- Подрывные заряды ----------
    {
        id: 20,
        name: "M112",
        full_name: "M112 demolition block",
        category: "demolition",
        origin: "USA",
        explosive_id: 36,
        filler_note: "Composition C-4",
        filler_grams: 567,
        total_grams: 567,
        note: "Брикет C-4 (1¼ lb), мастика-липкая основа."
    },
    {
        id: 21,
        name: "M118",
        full_name: "M118 demolition sheet block",
        category: "demolition",
        origin: "USA",
        explosive_id: 36,
        filler_note: "Гибкий C-4 / EL-506",
        filler_grams: 454,
        total_grams: 540,
        note: "Лист-заряд, 4 листа в комплекте."
    },
    {
        id: 22,
        name: "M183",
        full_name: "M183 demolition charge assembly",
        category: "demolition",
        origin: "USA",
        explosive_id: 36,
        filler_note: "16× M112 (C-4)",
        filler_grams: 9072,
        total_grams: 10900,
        note: "Сборка-«рюкзак» (satchel charge), 16 брикетов C-4."
    },
    {
        id: 23,
        name: "ТП-200",
        full_name: "Тротиловая шашка ТП-200",
        category: "demolition",
        origin: "СССР",
        explosive_id: 15,
        filler_note: "Прессованный TNT",
        filler_grams: 200,
        total_grams: 200,
        note: "Стандартная тротиловая шашка для подрывных работ."
    },
    {
        id: 24,
        name: "ТП-400",
        full_name: "Тротиловая шашка ТП-400",
        category: "demolition",
        origin: "СССР",
        explosive_id: 15,
        filler_note: "Прессованный TNT",
        filler_grams: 400,
        total_grams: 400,
        note: "Большая тротиловая шашка 400 г."
    },
    {
        id: 25,
        name: "TNT 1 lb",
        full_name: "M1A1 TNT demolition block 1 lb",
        category: "demolition",
        origin: "USA",
        explosive_id: 15,
        filler_note: "Прессованный TNT",
        filler_grams: 454,
        total_grams: 454,
        note: "Стандартная американская тротиловая шашка 1 фунт."
    },

    // ---------- Авиабомбы ----------
    {
        id: 30,
        name: "Mk 81",
        full_name: "Mk 81 250 lb GP bomb",
        category: "aerial_bomb",
        origin: "USA",
        explosive_id: 18,
        filler_note: "Tritonal / H-6",
        filler_grams: 44000,
        total_grams: 110000,
        note: "Низкоосколочная бомба общего назначения."
    },
    {
        id: 31,
        name: "Mk 82",
        full_name: "Mk 82 500 lb GP bomb",
        category: "aerial_bomb",
        origin: "USA",
        explosive_id: 18,
        filler_note: "Tritonal / H-6 / Minol II",
        filler_grams: 89000,
        total_grams: 227000,
        note: "Самая массовая авиабомба ВВС США."
    },
    {
        id: 32,
        name: "Mk 83",
        full_name: "Mk 83 1000 lb GP bomb",
        category: "aerial_bomb",
        origin: "USA",
        explosive_id: 18,
        filler_note: "Tritonal / H-6",
        filler_grams: 202000,
        total_grams: 447000,
        note: "Бомба общего назначения 1000 lb."
    },
    {
        id: 33,
        name: "Mk 84",
        full_name: "Mk 84 2000 lb GP bomb",
        category: "aerial_bomb",
        origin: "USA",
        explosive_id: 18,
        filler_note: "Tritonal / H-6",
        filler_grams: 429000,
        total_grams: 945000,
        note: "Тяжёлая бомба общего назначения, основа JDAM/GBU-31."
    },
    {
        id: 34,
        name: "ФАБ-100",
        full_name: "ФАБ-100 фугасная авиабомба",
        category: "aerial_bomb",
        origin: "СССР",
        explosive_id: 15,
        filler_note: "TNT",
        filler_grams: 70000,
        total_grams: 100000,
        note: "Лёгкая фугасная бомба калибра 100 кг."
    },
    {
        id: 35,
        name: "ФАБ-250",
        full_name: "ФАБ-250 фугасная авиабомба",
        category: "aerial_bomb",
        origin: "СССР",
        explosive_id: 15,
        filler_note: "TNT / ТГА-16",
        filler_grams: 100000,
        total_grams: 250000,
        note: "Средняя фугасная бомба."
    },
    {
        id: 36,
        name: "ФАБ-500",
        full_name: "ФАБ-500 фугасная авиабомба",
        category: "aerial_bomb",
        origin: "СССР",
        explosive_id: 15,
        filler_note: "TNT / ТГА-16",
        filler_grams: 213000,
        total_grams: 500000,
        note: "Тяжёлая фугасная бомба, массовая."
    },

    // ---------- Артиллерия / минометы ----------
    {
        id: 40,
        name: "M107 (155mm)",
        full_name: "155 mm M107 HE projectile",
        category: "artillery",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Composition B / TNT",
        filler_grams: 6620,
        total_grams: 43200,
        note: "Старый стандартный американский 155-мм осколочно-фугасный снаряд."
    },
    {
        id: 41,
        name: "M795 (155mm)",
        full_name: "155 mm M795 HE projectile",
        category: "artillery",
        origin: "USA",
        explosive_id: 15,
        filler_note: "TNT (литой)",
        filler_grams: 10800,
        total_grams: 46700,
        note: "Современный 155-мм осколочно-фугасный снаряд."
    },
    {
        id: 42,
        name: "ОФ-540 (152mm)",
        full_name: "152 мм ОФ-540 ОФС",
        category: "artillery",
        origin: "СССР",
        explosive_id: 15,
        filler_note: "TNT",
        filler_grams: 5860,
        total_grams: 43560,
        note: "Стандартный 152-мм осколочно-фугасный снаряд."
    },
    {
        id: 43,
        name: "ОФ-462 (122mm)",
        full_name: "122 мм ОФ-462 ОФС",
        category: "artillery",
        origin: "СССР",
        explosive_id: 15,
        filler_note: "TNT",
        filler_grams: 3675,
        total_grams: 21760,
        note: "122-мм гаубичный осколочно-фугасный снаряд."
    },
    {
        id: 44,
        name: "M821 (81mm)",
        full_name: "81 mm M821 HE mortar bomb",
        category: "mortar",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Composition B",
        filler_grams: 950,
        total_grams: 4200,
        note: "Стандартная американская 81-мм мина."
    },
    {
        id: 45,
        name: "ОФ-832А (82mm)",
        full_name: "82 мм ОФ-832А миномётная мина",
        category: "mortar",
        origin: "СССР",
        explosive_id: 15,
        filler_note: "TNT",
        filler_grams: 400,
        total_grams: 3140,
        note: "82-мм осколочно-фугасная мина."
    },
    {
        id: 46,
        name: "ОФ-843Б (120mm)",
        full_name: "120 мм ОФ-843Б миномётная мина",
        category: "mortar",
        origin: "СССР",
        explosive_id: 15,
        filler_note: "TNT",
        filler_grams: 1580,
        total_grams: 15900,
        note: "Тяжёлая 120-мм миномётная мина."
    },

    // ---------- Мины ----------
    {
        id: 50,
        name: "M14",
        full_name: "M14 anti-personnel mine",
        category: "mine_ap",
        origin: "USA",
        explosive_id: 32,
        filler_note: "Tetryl",
        filler_grams: 29,
        total_grams: 100,
        note: "Малая нажимная противопехотная мина, «toe-popper»."
    },
    {
        id: 51,
        name: "M16A1",
        full_name: "M16A1 bounding AP mine",
        category: "mine_ap",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Composition B / TNT",
        filler_grams: 513,
        total_grams: 3570,
        note: "Подпрыгивающая осколочная мина."
    },
    {
        id: 52,
        name: "M18A1",
        full_name: "M18A1 Claymore directional AP mine",
        category: "mine_ap",
        origin: "USA",
        explosive_id: 36,
        filler_note: "Composition C-4 + 700 шариков",
        filler_grams: 680,
        total_grams: 1580,
        effective_m: 50,
        note: "Направленная противопехотная мина с шрапнелью."
    },
    {
        id: 53,
        name: "ПМН",
        full_name: "ПМН противопехотная мина",
        category: "mine_ap",
        origin: "СССР",
        explosive_id: 15,
        filler_note: "TNT",
        filler_grams: 200,
        total_grams: 550,
        note: "Нажимная фугасная мина."
    },
    {
        id: 54,
        name: "M15",
        full_name: "M15 anti-tank mine",
        category: "mine_at",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Composition B",
        filler_grams: 9900,
        total_grams: 13600,
        note: "Тяжёлая противотанковая нажимная мина."
    },
    {
        id: 55,
        name: "ТМ-62М",
        full_name: "ТМ-62М противотанковая мина",
        category: "mine_at",
        origin: "СССР",
        explosive_id: 15,
        filler_note: "TNT / тротил-гексоген (МС)",
        filler_grams: 7500,
        total_grams: 9500,
        note: "Стандартная советская/российская ПТМ."
    },

    // ---------- Реактивные / РПГ ----------
    {
        id: 60,
        name: "M72 LAW",
        full_name: "M72 LAW 66mm HEAT rocket",
        category: "rocket",
        origin: "USA",
        explosive_id: 45,
        filler_note: "Octol 75/25",
        filler_grams: 300,
        total_grams: 1000,
        note: "Одноразовый ручной противотанковый гранатомёт."
    },
    {
        id: 61,
        name: "AT4 (M136)",
        full_name: "AT4 / M136 84mm HEAT rocket",
        category: "rocket",
        origin: "Швеция/USA",
        explosive_id: 45,
        filler_note: "Octol",
        filler_grams: 440,
        total_grams: 1800,
        note: "Одноразовый 84-мм РПГ."
    },
    {
        id: 62,
        name: "ПГ-7В",
        full_name: "ПГ-7В выстрел к РПГ-7",
        category: "rocket",
        origin: "СССР",
        explosive_id: 52,
        filler_note: "A-IX-1 (RDX)",
        filler_grams: 317,
        total_grams: 2200,
        note: "Базовый кумулятивный выстрел для РПГ-7."
    },
    {
        id: 63,
        name: "ПГ-7ВЛ",
        full_name: "ПГ-7ВЛ «Луч»",
        category: "rocket",
        origin: "СССР",
        explosive_id: 58,
        filler_note: "Окфол (HMX-based)",
        filler_grams: 730,
        total_grams: 2600,
        note: "Усиленный кумулятивный выстрел РПГ-7, бронепробитие до 500 мм."
    },
    {
        id: 64,
        name: "ТБГ-7В",
        full_name: "ТБГ-7В «Танин» (термобарический)",
        category: "rocket",
        origin: "РФ",
        explosive_id: 52,
        filler_note: "Термобарическая смесь (RDX+Al)",
        filler_grams: 1800,
        total_grams: 4500,
        effective_m: 10,
        note: "Термобарический выстрел для РПГ-7."
    },

    // ---------- NATO / Вьетнам / Залив / Ирак ----------

    // Ручные гранаты
    {
        id: 14,
        name: "V40",
        full_name: "V40 mini fragmentation grenade",
        category: "hand_grenade",
        origin: "Нидерланды/USA",
        explosive_id: 34,
        filler_note: "Composition B",
        filler_grams: 40,
        total_grams: 136,
        effective_m: 5,
        delay_sec: 4.5,
        note: "Сферическая мини-граната размером с мяч для гольфа, использовалась USSF во Вьетнаме."
    },

    // 40-мм гранаты
    {
        id: 70,
        name: "40mm M406",
        full_name: "M406 40 mm HE grenade",
        category: "grenade_40mm",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Composition B",
        filler_grams: 32,
        total_grams: 230,
        effective_m: 5,
        note: "Базовая ОФ граната для гранатомёта M79/M203 (Вьетнам)."
    },
    {
        id: 71,
        name: "40mm M433",
        full_name: "M433 40 mm HEDP grenade",
        category: "grenade_40mm",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Composition B",
        filler_grams: 45,
        total_grams: 230,
        effective_m: 5,
        note: "Кумулятивно-осколочный выстрел (HEDP) для M203, поздний Вьетнам и далее."
    },
    {
        id: 72,
        name: "40mm M430",
        full_name: "M430 40 mm HEDP linked",
        category: "grenade_40mm",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Composition B",
        filler_grams: 45,
        total_grams: 348,
        effective_m: 15,
        note: "Ленточный выстрел для автоматического гранатомёта Mk 19. Залив/Ирак."
    },

    // Подрывные заряды
    {
        id: 26,
        name: "Bangalore M1A2",
        full_name: "M1A2 Bangalore torpedo (section)",
        category: "demolition",
        origin: "USA",
        explosive_id: 15,
        filler_note: "TNT (литой)",
        filler_grams: 4080,
        total_grams: 6240,
        note: "Удлинённый заряд-секция для разминирования / разрушения проволочных заграждений (WWII → Ирак)."
    },

    // Авиабомбы (Вьетнам / Залив / Ирак)
    {
        id: 37,
        name: "M117",
        full_name: "M117 750 lb GP bomb",
        category: "aerial_bomb",
        origin: "USA",
        explosive_id: 18,
        filler_note: "Tritonal",
        filler_grams: 178000,
        total_grams: 340000,
        note: "Рабочая лошадка авиации США во Вьетнаме (B-52 Arc Light), применялась и в Заливе."
    },
    {
        id: 38,
        name: "AN-M64",
        full_name: "AN-M64 500 lb GP bomb",
        category: "aerial_bomb",
        origin: "USA",
        explosive_id: 15,
        filler_note: "TNT / Amatol / Composition B",
        filler_grams: 120000,
        total_grams: 240000,
        note: "WWII–Вьетнам, заменена Mk 82."
    },
    {
        id: 39,
        name: "BLU-82 «Daisy Cutter»",
        full_name: "BLU-82/B Commando Vault 15 000 lb bomb",
        category: "aerial_bomb",
        origin: "USA",
        explosive_id: 7,
        filler_note: "GSX slurry (NH₄NO₃ + Al + полистирол)",
        filler_grams: 5715000,
        total_grams: 6800000,
        effective_m: 275,
        note: "Гигантская «расчищающая» бомба для создания вертолётных площадок во Вьетнаме; применялась и в Заливе/Ираке."
    },
    {
        id: 40,
        name: "BLU-109",
        full_name: "BLU-109/B hard-target penetrator",
        category: "aerial_bomb",
        origin: "USA",
        explosive_id: 26,
        filler_note: "PBXN-109",
        filler_grams: 240000,
        total_grams: 874000,
        note: "Проникающая бомба для укреплённых целей. Применялась в «Буре в пустыне» и OIF."
    },
    {
        id: 41,
        name: "GBU-43/B MOAB",
        full_name: "GBU-43/B Massive Ordnance Air Blast",
        category: "aerial_bomb",
        origin: "USA",
        explosive_id: 34,
        filler_note: "H-6 (RDX+TNT+Al)",
        filler_grams: 8480000,
        total_grams: 9818000,
        effective_m: 140,
        note: "«Мать всех бомб» (21 000 lb). Разработана к OIF, применена в Афганистане 2017."
    },

    // Кассетные суббоеприпасы
    {
        id: 80,
        name: "BLU-3 «Pineapple»",
        full_name: "BLU-3/B antipersonnel bomblet",
        category: "submunition",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Cyclotol (RDX/TNT)",
        filler_grams: 30,
        total_grams: 770,
        effective_m: 12,
        note: "Кассетный осколочный бомблет с 250 стальными шариками. Вьетнам."
    },
    {
        id: 81,
        name: "BLU-26 «Guava»",
        full_name: "BLU-26/B bomblet",
        category: "submunition",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Composition B",
        filler_grams: 280,
        total_grams: 425,
        effective_m: 9,
        note: "Сферический бомблет размером с теннисный мяч из кассеты CBU-24. Массовое применение во Вьетнаме."
    },
    {
        id: 82,
        name: "BLU-97/B CEM",
        full_name: "BLU-97/B Combined Effects Munition",
        category: "submunition",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Cyclotol",
        filler_grams: 287,
        total_grams: 1540,
        effective_m: 15,
        note: "Суббоеприпас кассеты CBU-87/89/103, тройного действия (осколки + кумулятив + зажигание). Залив, Ирак."
    },

    // Артиллерия / минометы Вьетнама и далее
    {
        id: 47,
        name: "M1 (105mm)",
        full_name: "105 mm M1 HE projectile",
        category: "artillery",
        origin: "USA",
        explosive_id: 15,
        filler_note: "TNT",
        filler_grams: 2180,
        total_grams: 14970,
        note: "Стандартный ОФ-снаряд для гаубицы M101/M102. WWII → Вьетнам → Ирак."
    },
    {
        id: 48,
        name: "M329 (107mm)",
        full_name: "M329 4.2-inch mortar HE",
        category: "mortar",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Composition B",
        filler_grams: 4000,
        total_grams: 12300,
        note: "Тяжёлая 107-мм миномётная мина, рабочая лошадка во Вьетнаме."
    },
    {
        id: 49,
        name: "M106 (203mm)",
        full_name: "8-inch M106 HE projectile",
        category: "artillery",
        origin: "USA",
        explosive_id: 18,
        filler_note: "TNT / Tritonal",
        filler_grams: 16650,
        total_grams: 92500,
        note: "203-мм снаряд для гаубицы M110. Вьетнам и до 1990-х."
    },

    // Мины
    {
        id: 56,
        name: "M21",
        full_name: "M21 anti-tank mine",
        category: "mine_at",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Composition H6",
        filler_grams: 5000,
        total_grams: 7800,
        note: "Противотанковая мина с наклонным датчиком. Вьетнам."
    },

    // Реактивные / ATGM / SMAW
    {
        id: 65,
        name: "M67 RR (90mm)",
        full_name: "90 mm M371 HEAT for M67 recoilless rifle",
        category: "rocket",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Composition B",
        filler_grams: 430,
        total_grams: 4200,
        note: "Выстрел для 90-мм безоткатного орудия M67. Стандарт пехоты во Вьетнаме."
    },
    {
        id: 66,
        name: "M40 RR (106mm)",
        full_name: "106 mm M344 HEAT for M40 recoilless rifle",
        category: "rocket",
        origin: "USA",
        explosive_id: 34,
        filler_note: "Composition B",
        filler_grams: 1270,
        total_grams: 7700,
        note: "Выстрел для 106-мм безоткатного орудия M40. Вьетнам."
    },
    {
        id: 67,
        name: "BGM-71 TOW",
        full_name: "BGM-71 TOW HEAT warhead",
        category: "rocket",
        origin: "USA",
        explosive_id: 45,
        filler_note: "Octol",
        filler_grams: 2950,
        total_grams: 25400,
        note: "Тяжёлый ПТУР (Vietnam late → Iraq). Кумулятивная БЧ."
    },
    {
        id: 68,
        name: "AGM-114K",
        full_name: "AGM-114K Hellfire II HEAT warhead",
        category: "rocket",
        origin: "USA",
        explosive_id: 26,
        filler_note: "PBXN-5 / PBXN-109",
        filler_grams: 8000,
        total_grams: 45400,
        note: "Авиационная ПТУР для AH-64, MQ-1/9. Залив, OIF, OEF."
    },
    {
        id: 69,
        name: "Mk 153 SMAW NE",
        full_name: "Mk 153 SMAW NE thermobaric rocket",
        category: "rocket",
        origin: "USA",
        explosive_id: 52,
        filler_note: "Термобарическая смесь (PBXIH-135)",
        filler_grams: 1000,
        total_grams: 6700,
        effective_m: 10,
        note: "Штурмовое оружие Корпуса морской пехоты США, термобарическая БЧ. OIF/Эль-Фаллуджа."
    }
];

const munitionsCategoryLabels = {
    hand_grenade: "Ручная граната",
    grenade_40mm: "40-мм граната",
    submunition: "Кассетный суббоеприпас",
    demolition: "Подрывной заряд",
    aerial_bomb: "Авиабомба",
    artillery: "Арт. снаряд",
    mortar: "Миномётная мина",
    mine_ap: "Противопехотная мина",
    mine_at: "Противотанковая мина",
    rocket: "Реактивный снаряд / РПГ"
};

