const explosivesData = [
    {
        "density": 0.88,
        "detonation_force": 2700.0,
        "id": 1,
        "substance_name": "Нитрат аммония",
        "tnt_equivalent": 0.32
    },
    {
        "density": 4.42,
        "detonation_force": 4250.0,
        "id": 2,
        "substance_name": "Фульминат ртути",
        "tnt_equivalent": 0.51
    },
    {
        "density": 1.65,
        "detonation_force": 400.0,
        "id": 3,
        "substance_name": "Черный порох",
        "tnt_equivalent": 0.55
    },
    {
        "density": 1.3,
        "detonation_force": 5070.0,
        "id": 4,
        "substance_name": "Гексаминдинитрат",
        "tnt_equivalent": 0.6
    },
    {
        "density": 1.5,
        "detonation_force": 6025.0,
        "id": 5,
        "substance_name": "Динитробензол",
        "tnt_equivalent": 0.6
    },
    {
        "density": 0.88,
        "detonation_force": 4520.0,
        "id": 6,
        "substance_name": "Гексаминпероксид",
        "tnt_equivalent": 0.74
    },
    {
        "density": 0.92,
        "detonation_force": 4200.0,
        "id": 7,
        "substance_name": "ANFO",
        "tnt_equivalent": 0.74
    },
    {
        "density": 1.67,
        "detonation_force": 4700.0,
        "id": 8,
        "substance_name": "Нитрат мочевины",
        "tnt_equivalent": 0.77
    },
    {
        "density": 1.18,
        "detonation_force": 5300.0,
        "id": 9,
        "substance_name": "Ацетонпероксид",
        "tnt_equivalent": 0.8
    },
    {
        "density": 1.33,
        "detonation_force": 5690.0,
        "id": 10,
        "substance_name": "Tovex Extra",
        "tnt_equivalent": 0.8
    },
    {
        "density": 1.24,
        "detonation_force": 5550.0,
        "id": 11,
        "substance_name": "Hydromite 600",
        "tnt_equivalent": 0.8
    },
    {
        "density": 1.16,
        "detonation_force": 5360.0,
        "id": 12,
        "substance_name": "ANNMAL",
        "tnt_equivalent": 0.87
    },
    {
        "density": 1.5,
        "detonation_force": 6290.0,
        "id": 13,
        "substance_name": "Аматол",
        "tnt_equivalent": 0.91
    },
    {
        "density": 1.32,
        "detonation_force": 6750.0,
        "id": 14,
        "substance_name": "Нитрогуанидин",
        "tnt_equivalent": 0.95
    },
    {
        "density": 1.6,
        "detonation_force": 6900.0,
        "id": 15,
        "substance_name": "Тринитротолуол",
        "tnt_equivalent": 1.0
    },
    {
        "density": 1.7,
        "detonation_force": 7080.0,
        "id": 16,
        "substance_name": "Гексанитростильбен",
        "tnt_equivalent": 1.05
    },
    {
        "density": 1.45,
        "detonation_force": 6860.0,
        "id": 17,
        "substance_name": "Нитроуреа",
        "tnt_equivalent": 1.05
    },
    {
        "density": 1.7,
        "detonation_force": 6650.0,
        "id": 18,
        "substance_name": "Тритональ",
        "tnt_equivalent": 1.05
    },
    {
        "density": 1.7,
        "detonation_force": 7000.0,
        "id": 19,
        "substance_name": "Nickel hydrazine nitrate",
        "tnt_equivalent": 1.05
    },
    {
        "density": 1.55,
        "detonation_force": 6570.0,
        "id": 20,
        "substance_name": "Аматол",
        "tnt_equivalent": 1.1
    },
    {
        "density": 1.4,
        "detonation_force": 6400.0,
        "id": 21,
        "substance_name": "Нитроцеллюлоза",
        "tnt_equivalent": 1.1
    },
    {
        "density": 1.13,
        "detonation_force": 6360.0,
        "id": 22,
        "substance_name": "Нитрометан",
        "tnt_equivalent": 1.1
    },
    {
        "density": 1.8,
        "detonation_force": 6450.0,
        "id": 23,
        "substance_name": "PBXW-126",
        "tnt_equivalent": 1.1
    },
    {
        "density": 1.38,
        "detonation_force": 6610.0,
        "id": 24,
        "substance_name": "Диэтиленгликольдинитрат",
        "tnt_equivalent": 1.17
    },
    {
        "density": 1.81,
        "detonation_force": 7060.0,
        "id": 25,
        "substance_name": "PBXIH-135 EB",
        "tnt_equivalent": 1.17
    },
    {
        "density": 1.68,
        "detonation_force": 7450.0,
        "id": 26,
        "substance_name": "PBXN-109",
        "tnt_equivalent": 1.17
    },
    {
        "density": 1.8,
        "detonation_force": 7550.0,
        "id": 27,
        "substance_name": "Triaminotrinitrobenzene",
        "tnt_equivalent": 1.17
    },
    {
        "density": 1.71,
        "detonation_force": 7350.0,
        "id": 28,
        "substance_name": "Picric acid",
        "tnt_equivalent": 1.17
    },
    {
        "density": 1.6,
        "detonation_force": 7300.0,
        "id": 29,
        "substance_name": "Trinitrobenzene",
        "tnt_equivalent": 1.2
    },
    {
        "density": 1.6,
        "detonation_force": 7370.0,
        "id": 30,
        "substance_name": "Tetrytol",
        "tnt_equivalent": 1.2
    },
    {
        "density": 1.48,
        "detonation_force": 7200.0,
        "id": 31,
        "substance_name": "Dynamite, Nobel",
        "tnt_equivalent": 1.25
    },
    {
        "density": 1.71,
        "detonation_force": 7770.0,
        "id": 32,
        "substance_name": "Tetryl",
        "tnt_equivalent": 1.25
    },
    {
        "density": 1.8,
        "detonation_force": 7440.0,
        "id": 33,
        "substance_name": "Torpex",
        "tnt_equivalent": 1.3
    },
    {
        "density": 1.72,
        "detonation_force": 7840.0,
        "id": 34,
        "substance_name": "Composition B",
        "tnt_equivalent": 1.33
    },
    {
        "density": 1.6,
        "detonation_force": 7630.0,
        "id": 35,
        "substance_name": "Composition C-3",
        "tnt_equivalent": 1.33
    },
    {
        "density": 1.59,
        "detonation_force": 8040.0,
        "id": 36,
        "substance_name": "Composition C-4",
        "tnt_equivalent": 1.34
    },
    {
        "density": 1.66,
        "detonation_force": 7520.0,
        "id": 37,
        "substance_name": "Pentolite",
        "tnt_equivalent": 1.33
    },
    {
        "density": 1.55,
        "detonation_force": 7670.0,
        "id": 38,
        "substance_name": "Semtex 1A",
        "tnt_equivalent": 1.35
    },
    {
        "density": 1.79,
        "detonation_force": 7640.0,
        "id": 39,
        "substance_name": "Hexal",
        "tnt_equivalent": 1.35
    },
    {
        "density": 1.39,
        "detonation_force": 5980.0,
        "id": 40,
        "substance_name": "RISAL P",
        "tnt_equivalent": 1.4
    },
    {
        "density": 1.59,
        "detonation_force": 8500.0,
        "id": 41,
        "substance_name": "Hydrazine nitrate",
        "tnt_equivalent": 1.42
    },
    {
        "density": 1.48,
        "detonation_force": 8060.0,
        "id": 42,
        "substance_name": "Mixture",
        "tnt_equivalent": 1.5
    },
    {
        "density": 1.39,
        "detonation_force": 8290.0,
        "id": 43,
        "substance_name": "Mixture",
        "tnt_equivalent": 1.5
    },
    {
        "density": 1.59,
        "detonation_force": 7700.0,
        "id": 44,
        "substance_name": "Nitroglycerin",
        "tnt_equivalent": 1.54
    },
    {
        "density": 1.21,
        "detonation_force": 7900.0,
        "id": 45,
        "substance_name": "Methyl nitrate",
        "tnt_equivalent": 1.54
    },
    {
        "density": 1.83,
        "detonation_force": 8690.0,
        "id": 46,
        "substance_name": "Octol",
        "tnt_equivalent": 1.54
    },
    {
        "density": 1.87,
        "detonation_force": 8120.0,
        "id": 47,
        "substance_name": "Nitrotriazolon",
        "tnt_equivalent": 1.6
    },
    {
        "density": 1.77,
        "detonation_force": 8330.0,
        "id": 48,
        "substance_name": "DADNE",
        "tnt_equivalent": 1.6
    },
    {
        "density": 1.6,
        "detonation_force": 7970.0,
        "id": 49,
        "substance_name": "Gelignite",
        "tnt_equivalent": 1.6
    },
    {
        "density": 1.51,
        "detonation_force": 7940.0,
        "id": 50,
        "substance_name": "Plastics Gel",
        "tnt_equivalent": 1.6
    },
    {
        "density": 1.65,
        "detonation_force": 8470.0,
        "id": 51,
        "substance_name": "Composition A-5",
        "tnt_equivalent": 1.6
    },
    {
        "density": 1.72,
        "detonation_force": 8206.0,
        "id": 52,
        "substance_name": "Erythritol tetranitrate",
        "tnt_equivalent": 1.6
    },
    {
        "density": 1.78,
        "detonation_force": 8600.0,
        "id": 53,
        "substance_name": "Hexogen",
        "tnt_equivalent": 1.6
    },
    {
        "density": 1.81,
        "detonation_force": 8720.0,
        "id": 54,
        "substance_name": "PBXW-11",
        "tnt_equivalent": 1.6
    },
    {
        "density": 1.77,
        "detonation_force": 8400.0,
        "id": 55,
        "substance_name": "Penthrite",
        "tnt_equivalent": 1.66
    },
    {
        "density": 1.49,
        "detonation_force": 8300.0,
        "id": 56,
        "substance_name": "Ethylene glycol dinitrate",
        "tnt_equivalent": 1.66
    },
    {
        "density": 1.65,
        "detonation_force": 8700.0,
        "id": 57,
        "substance_name": "MEDINA",
        "tnt_equivalent": 1.7
    },
    {
        "density": 1.85,
        "detonation_force": 8640.0,
        "id": 58,
        "substance_name": "Trinitroazetidine",
        "tnt_equivalent": 1.7
    },
    {
        "density": 1.86,
        "detonation_force": 9100.0,
        "id": 59,
        "substance_name": "Octogen",
        "tnt_equivalent": 1.7
    },
    {
        "density": 1.97,
        "detonation_force": 9340.0,
        "id": 60,
        "substance_name": "Hexanitrobenzene",
        "tnt_equivalent": 1.8
    },
    {
        "density": 1.97,
        "detonation_force": 9500.0,
        "id": 61,
        "substance_name": "Hexanitrohexaazaisowurtzitane",
        "tnt_equivalent": 1.9
    },
    {
        "density": 1.98,
        "detonation_force": 10000.0,
        "id": 62,
        "substance_name": "DDF",
        "tnt_equivalent": 1.95
    },
    {
        "density": 1.95,
        "detonation_force": 10600.0,
        "id": 63,
        "substance_name": "Octanitrocubane",
        "tnt_equivalent": 2.38
    },
    {
        "density": 2.69,
        "detonation_force": 15000.0,
        "id": 64,
        "substance_name": "Octaazacubane",
        "tnt_equivalent": 5.0
    }
];