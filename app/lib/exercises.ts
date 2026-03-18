export type BodyPart = "chest" | "back" | "arms" | "shoulders" | "core" | "legs" | "full";
export type Difficulty = "débutant" | "intermédiaire" | "avancé";

export interface ExerciseImage {
  url: string;
  caption: string;
}

export interface Exercise {
  id: string;
  name: string;
  bodyPart: BodyPart;
  difficulty: Difficulty;
  musclesWorked: string[];
  description: string;
  steps: string[];
  tips: string[];
  duration: number; // seconds per set
  sets: number;
  reps: string;
  restTime: number; // seconds
  images: ExerciseImage[];
  tags: string[];
}

export const BODY_PARTS: Record<BodyPart, { label: string; emoji: string; color: string }> = {
  chest: { label: "Poitrine", emoji: "💪", color: "#22c55e" },
  back: { label: "Dos", emoji: "🔙", color: "#22d3ee" },
  arms: { label: "Bras", emoji: "💪", color: "#a78bfa" },
  shoulders: { label: "Épaules", emoji: "🏋️", color: "#fb923c" },
  core: { label: "Abdos / Core", emoji: "🔥", color: "#f43f5e" },
  legs: { label: "Jambes", emoji: "🦵", color: "#eab308" },
  full: { label: "Full Body", emoji: "⚡", color: "#2563eb" },
};

export const exercises: Exercise[] = [
  // ─── POITRINE ───────────────────────────────────────────────────────────
  {
    id: "pushup",
    name: "Pompes classiques",
    bodyPart: "chest",
    difficulty: "débutant",
    musclesWorked: ["Grand pectoral", "Triceps", "Deltoïde antérieur"],
    description: "L'exercice fondamental de la callisthénie. Les pompes construisent la poitrine, les épaules et les bras tout en renforçant le core.",
    steps: [
      "Placez les mains à largeur d'épaules, légèrement en dehors",
      "Corps aligné de la tête aux talons, abdos gainés",
      "Descendez lentement jusqu'à ce que la poitrine frôle le sol",
      "Poussez fort pour revenir à la position haute",
      "Gardez les coudes à 45° du corps (pas à l'horizontale)"
    ],
    tips: ["Ne laissez pas les hanches s'affaisser", "Contrôlez la descente (2-3 secondes)", "Expirez à la montée"],
    duration: 40,
    sets: 3,
    reps: "10-15",
    restTime: 60,
    tags: ["poitrine", "triceps", "débutant", "sans matériel"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Push_up.svg/1200px-Push_up.svg.png", caption: "Position haute — corps aligné" },
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Pushup_demonstration.jpg/1280px-Pushup_demonstration.jpg", caption: "Position basse — poitrine au sol" },
    ]
  },
  {
    id: "diamond-pushup",
    name: "Pompes diamant",
    bodyPart: "chest",
    difficulty: "intermédiaire",
    musclesWorked: ["Triceps", "Grand pectoral (partie interne)", "Deltoïde"],
    description: "Les mains forment un diamant sous la poitrine. Exercice excellent pour les triceps et la partie interne des pectoraux.",
    steps: [
      "Placez les mains sous la poitrine, index et pouces en contact (forme de diamant)",
      "Bras tendus, corps gainé",
      "Descendez lentement, coudes vers l'arrière",
      "Repoussez en contractant les triceps"
    ],
    tips: ["Montez plus haut pour solliciter davantage les triceps", "Position des mains plus basse = plus de poitrine", "Exercice difficile — commencez avec peu de répétitions"],
    duration: 40,
    sets: 3,
    reps: "6-12",
    restTime: 75,
    tags: ["triceps", "poitrine", "intermédiaire"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Diamond_pushup.jpg/1280px-Diamond_pushup.jpg", caption: "Position des mains en diamant" },
    ]
  },
  {
    id: "wide-pushup",
    name: "Pompes larges",
    bodyPart: "chest",
    difficulty: "débutant",
    musclesWorked: ["Grand pectoral", "Deltoïde antérieur"],
    description: "Mains plus larges que la largeur des épaules. Cible davantage les parties externes des pectoraux.",
    steps: [
      "Placez les mains bien au-delà de la largeur des épaules",
      "Doigts légèrement tournés vers l'extérieur",
      "Descendez en ouvrant les coudes sur les côtés",
      "Remontez en poussant fort sur les paumes"
    ],
    tips: ["Les coudes doivent s'ouvrir vers l'extérieur", "Amplitude complète pour un maximum de résultats"],
    duration: 40,
    sets: 3,
    reps: "10-15",
    restTime: 60,
    tags: ["poitrine", "débutant"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Push_up.svg/1200px-Push_up.svg.png", caption: "Position large — mains écartées" },
    ]
  },
  {
    id: "dips",
    name: "Dips (chaise / barres)",
    bodyPart: "chest",
    difficulty: "intermédiaire",
    musclesWorked: ["Grand pectoral", "Triceps", "Deltoïde antérieur"],
    description: "Exercice de poussée verticale exceptionnellement efficace pour la poitrine et les triceps. Peut se faire sur deux chaises solides ou des barres parallèles.",
    steps: [
      "Placez les mains sur deux surfaces stables (chaises, barres parallèles)",
      "Bras tendus, corps légèrement penché en avant pour cibler la poitrine",
      "Descendez lentement jusqu'à ce que les coudes atteignent 90°",
      "Poussez fort vers le haut sans verrouiller les coudes"
    ],
    tips: ["Corps penché = plus de pectoraux", "Corps droit = plus de triceps", "Descendez complètement pour une amplitude maximale"],
    duration: 45,
    sets: 3,
    reps: "8-12",
    restTime: 90,
    tags: ["poitrine", "triceps", "intermédiaire"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Dips_on_parallel_bars.jpg/1280px-Dips_on_parallel_bars.jpg", caption: "Dips sur barres parallèles — position haute" },
    ]
  },
  // ─── DOS ────────────────────────────────────────────────────────────────
  {
    id: "pullup",
    name: "Tractions (Pull-ups)",
    bodyPart: "back",
    difficulty: "intermédiaire",
    musclesWorked: ["Grand dorsal", "Biceps", "Rhomboïdes", "Trapèze"],
    description: "Le roi des exercices de dos en callisthénie. Les tractions construisent un dos large et fort tout en développant les biceps.",
    steps: [
      "Saisissez la barre en prise pronation (paumes vers l'extérieur), mains à largeur d'épaules",
      "Bras tendus, corps légèrement incliné vers l'arrière",
      "Tirez en amenant les coudes vers les hanches",
      "Montez jusqu'à ce que le menton dépasse la barre",
      "Descendez lentement en contrôlant le mouvement"
    ],
    tips: ["Ne sautez pas vers la barre — montez par la force", "Engagez les omoplates dès le départ", "La descente contrôlée est aussi importante que la montée"],
    duration: 45,
    sets: 3,
    reps: "5-10",
    restTime: 90,
    tags: ["dos", "biceps", "intermédiaire", "barre"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Pull_up_demonstration.jpg/1280px-Pull_up_demonstration.jpg", caption: "Position basse — bras tendus" },
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Pullup_bar.jpg/1280px-Pullup_bar.jpg", caption: "Position haute — menton au-dessus de la barre" },
    ]
  },
  {
    id: "chinup",
    name: "Tractions supination (Chin-ups)",
    bodyPart: "back",
    difficulty: "débutant",
    musclesWorked: ["Biceps", "Grand dorsal", "Rhomboïdes"],
    description: "Prise en supination (paumes vers vous). Plus facile que les pull-ups classiques et sollicite davantage les biceps.",
    steps: [
      "Saisissez la barre en supination (paumes vers vous), mains à largeur des épaules",
      "Bras complètement tendus en position basse",
      "Tirez en amenant les coudes vers les hanches",
      "Montez jusqu'à ce que le menton dépasse la barre",
      "Contrôlez la descente sur 3 secondes"
    ],
    tips: ["Plus accessible que les pull-ups — bon point de départ", "Concentrez-vous sur la contraction des biceps", "Gardez le corps garé, sans balancement"],
    duration: 45,
    sets: 3,
    reps: "6-12",
    restTime: 90,
    tags: ["dos", "biceps", "débutant", "barre"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Pullup_bar.jpg/1280px-Pullup_bar.jpg", caption: "Chin-up — prise supination" },
    ]
  },
  {
    id: "inverted-row",
    name: "Rowing inversé (Australian Pull-up)",
    bodyPart: "back",
    difficulty: "débutant",
    musclesWorked: ["Grand dorsal", "Rhomboïdes", "Biceps", "Trapèze moyen"],
    description: "Alternative aux tractions pour débutants. Se fait sous une table ou barre basse. Parfait pour construire la force nécessaire aux tractions.",
    steps: [
      "Allongez-vous sous une surface stable (table, barre basse)",
      "Saisissez la surface, corps aligné et rigide",
      "Tirez votre poitrine vers le haut en serrant les omoplates",
      "Descendez lentement jusqu'à bras tendus"
    ],
    tips: ["Corps rigide comme une planche — ne laissez pas les hanches s'affaisser", "Plus les pieds sont hauts, plus c'est difficile", "Resserrez les omoplates en haut du mouvement"],
    duration: 40,
    sets: 3,
    reps: "10-15",
    restTime: 60,
    tags: ["dos", "débutant", "sans barre"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Inverted_row.jpg/1280px-Inverted_row.jpg", caption: "Position basse — bras tendus" },
    ]
  },
  // ─── BRAS ────────────────────────────────────────────────────────────────
  {
    id: "close-grip-pushup",
    name: "Pompes triceps",
    bodyPart: "arms",
    difficulty: "débutant",
    musclesWorked: ["Triceps", "Grand pectoral"],
    description: "Mains serrées sous les épaules, coudes proches du corps. Isole efficacement les triceps.",
    steps: [
      "Mains directement sous les épaules, doigts vers l'avant",
      "Coudes contre le corps tout au long du mouvement",
      "Descendez lentement, coudes glissant vers l'arrière",
      "Poussez en contractant fort les triceps"
    ],
    tips: ["Coudes serrés = plus de triceps, moins de pectoraux", "Amplitude complète pour maximiser la contraction"],
    duration: 40,
    sets: 3,
    reps: "10-15",
    restTime: 60,
    tags: ["triceps", "bras", "débutant"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Push_up.svg/1200px-Push_up.svg.png", caption: "Position mains serrées — ciblage triceps" },
    ]
  },
  {
    id: "tricep-dip-bench",
    name: "Dips triceps (chaise)",
    bodyPart: "arms",
    difficulty: "débutant",
    musclesWorked: ["Triceps"],
    description: "Dips sur le bord d'une chaise ou d'un banc. Excellent isolant du triceps pour débutants.",
    steps: [
      "Asseyez-vous sur le bord d'une chaise, mains sur le bord",
      "Avancez les fesses hors de la chaise, jambes tendues",
      "Descendez en pliant les coudes à 90°",
      "Remontez en tendant les bras",
    ],
    tips: ["Dos proche de la chaise", "Descendez jusqu'à sentir un étirement du triceps"],
    duration: 40,
    sets: 3,
    reps: "12-15",
    restTime: 60,
    tags: ["triceps", "bras", "débutant", "chaise"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Dips_on_parallel_bars.jpg/1280px-Dips_on_parallel_bars.jpg", caption: "Dips triceps sur chaise/banc" },
    ]
  },
  {
    id: "bicep-curl-towel",
    name: "Curl biceps (serviette / barre)",
    bodyPart: "arms",
    difficulty: "débutant",
    musclesWorked: ["Biceps"],
    description: "Isométrie ou mouvement de tirage pour les biceps. Peut se faire avec une serviette coincée sous le pied ou une barre basse.",
    steps: [
      "Passez une serviette résistante sous votre pied",
      "Tenez les deux extrémités, bras tendus",
      "Fléchissez les coudes en tirant la serviette vers vous",
      "Contractez fort les biceps en haut",
      "Descendez lentement sous tension"
    ],
    tips: ["Gardez les coudes fixes contre le corps", "La contraction en haut est clé — tenez 1 seconde"],
    duration: 40,
    sets: 3,
    reps: "12-15",
    restTime: 60,
    tags: ["biceps", "bras", "débutant", "serviette"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Pullup_bar.jpg/1280px-Pullup_bar.jpg", caption: "Curl biceps — mouvement de flexion" },
    ]
  },
  // ─── ÉPAULES ─────────────────────────────────────────────────────────────
  {
    id: "pike-pushup",
    name: "Pompes en V (Pike Push-ups)",
    bodyPart: "shoulders",
    difficulty: "intermédiaire",
    musclesWorked: ["Deltoïde", "Triceps", "Trapèze supérieur"],
    description: "Corps en forme de V inversé, similaire à une position de yoga. Simule le développé militaire avec son propre poids.",
    steps: [
      "Position de pompe classique, puis remontez les fesses haut pour former un V",
      "Tête entre les bras, regard vers les pieds",
      "Descendez la tête vers le sol en fléchissant les coudes",
      "Poussez fort pour revenir au V",
    ],
    tips: ["Plus les fesses sont hautes, plus les épaules travaillent", "Progression vers le handstand push-up"],
    duration: 40,
    sets: 3,
    reps: "8-12",
    restTime: 75,
    tags: ["épaules", "intermédiaire"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Push_up.svg/1200px-Push_up.svg.png", caption: "Position en V inversé — hanches hautes" },
    ]
  },
  {
    id: "wall-handstand",
    name: "Équilibre contre le mur (Handstand Wall)",
    bodyPart: "shoulders",
    difficulty: "avancé",
    musclesWorked: ["Deltoïde", "Trapèze", "Core", "Triceps"],
    description: "Handstand contre le mur pour renforcer les épaules et préparer au handstand libre. Exercice emblématique de la callisthénie.",
    steps: [
      "Placez les mains à 30 cm du mur, doigts ouverts",
      "Montez en handstand, pieds contre le mur",
      "Corps aligné, abdos contractés",
      "Tenez la position en respirant normalement",
      "Descendez en contrôle"
    ],
    tips: ["Portez le poids sur les doigts pour l'équilibre", "Commencez par 10-20 secondes", "Mur derrière = plus sécurisé pour débuter"],
    duration: 30,
    sets: 3,
    reps: "20-30s",
    restTime: 90,
    tags: ["épaules", "avancé", "handstand"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Handstand.jpg/1280px-Handstand.jpg", caption: "Handstand contre le mur" },
    ]
  },
  // ─── CORE ────────────────────────────────────────────────────────────────
  {
    id: "plank",
    name: "Gainage (Planche)",
    bodyPart: "core",
    difficulty: "débutant",
    musclesWorked: ["Transverse", "Grand droit", "Obliques", "Fessiers"],
    description: "L'exercice de gainage par excellence. Renforce tout le corps stabilisateur et protège le bas du dos.",
    steps: [
      "Avant-bras au sol, coudes sous les épaules",
      "Corps aligné de la tête aux talons",
      "Abdos contractés, fessiers serrés",
      "Respirez normalement",
      "Tenez sans laisser les hanches monter ou descendre"
    ],
    tips: ["Regardez 20 cm devant vous (pas vers le bas)", "Contractez tout le corps simultanément", "Progressez en durée semaine après semaine"],
    duration: 60,
    sets: 3,
    reps: "30-60s",
    restTime: 60,
    tags: ["core", "abdos", "débutant", "gainage"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Plank_exercise.jpg/1280px-Plank_exercise.jpg", caption: "Gainage — corps aligné, avant-bras au sol" },
    ]
  },
  {
    id: "crunch",
    name: "Crunchs abdominaux",
    bodyPart: "core",
    difficulty: "débutant",
    musclesWorked: ["Grand droit de l'abdomen"],
    description: "Exercice de base pour les abdominaux. Mouvement partiel — on ne monte pas complètement pour maintenir la tension.",
    steps: [
      "Allongé sur le dos, genoux fléchis à 90°",
      "Mains derrière la nuque (légèrement)",
      "Contractez les abdos pour soulever les épaules",
      "Montez jusqu'à sentir la contraction maximale",
      "Descendez lentement sans poser la tête"
    ],
    tips: ["Ne tirez pas sur la nuque — les mains ne font pas le travail", "Expiration lors de la montée", "Phase de descente lente = plus efficace"],
    duration: 40,
    sets: 3,
    reps: "15-25",
    restTime: 45,
    tags: ["core", "abdos", "débutant"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Crunchrepetitions.jpg/1280px-Crunchrepetitions.jpg", caption: "Crunch — position basse" },
    ]
  },
  {
    id: "leg-raises",
    name: "Relevés de jambes",
    bodyPart: "core",
    difficulty: "intermédiaire",
    musclesWorked: ["Grand droit (bas)", "Psoas iliaque", "Obliques"],
    description: "Exercice redoutable pour le bas des abdominaux. Se fait allongé ou suspendu à une barre pour plus d'intensité.",
    steps: [
      "Allongé sur le dos, mains sous les fessiers",
      "Jambes tendues, légèrement soulevées du sol",
      "Montez les jambes jusqu'à la verticale",
      "Descendez lentement sans poser les talons",
      "Maintenez la tension permanente sur les abdos"
    ],
    tips: ["Ne laissez pas le bas du dos se creuser", "Jambes tendues = plus difficile", "Version suspendue à la barre = niveau supérieur"],
    duration: 40,
    sets: 3,
    reps: "10-15",
    restTime: 60,
    tags: ["core", "abdos", "intermédiaire"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Crunchrepetitions.jpg/1280px-Crunchrepetitions.jpg", caption: "Relevés de jambes — position haute" },
    ]
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    bodyPart: "core",
    difficulty: "intermédiaire",
    musclesWorked: ["Core", "Deltoïdes", "Hip flexors", "Quadriceps"],
    description: "Exercice cardio-musculaire dynamique. Simule l'escalade en position de planche. Brûle des calories tout en renforçant le core.",
    steps: [
      "Position de pompe, bras tendus",
      "Ramenez un genou vers la poitrine rapidement",
      "Changez de jambe en alternant rapidement",
      "Gardez les hanches stables, core contracté",
      "Maintenez le rythme rapide"
    ],
    tips: ["Hanches au niveau des épaules — pas trop hautes", "Plus c'est rapide, plus c'est cardio", "Ralentissez pour plus de gainage"],
    duration: 40,
    sets: 3,
    reps: "20-30 (par jambe)",
    restTime: 60,
    tags: ["core", "cardio", "intermédiaire"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Push_up.svg/1200px-Push_up.svg.png", caption: "Mountain climber — genou vers poitrine" },
    ]
  },
  // ─── JAMBES ──────────────────────────────────────────────────────────────
  {
    id: "squat",
    name: "Squats",
    bodyPart: "legs",
    difficulty: "débutant",
    musclesWorked: ["Quadriceps", "Fessiers", "Ischio-jambiers", "Mollets"],
    description: "Le mouvement fondamental des jambes. Le squat au poids de corps est la base de tout programme de jambes en callisthénie.",
    steps: [
      "Pieds à largeur d'épaules, orteils légèrement ouverts",
      "Poitrine haute, regard droit devant",
      "Descendez en poussant les genoux vers l'extérieur",
      "Cuisses parallèles au sol minimum (ou plus bas)",
      "Remontez fort en poussant dans les talons"
    ],
    tips: ["Les genoux ne doivent pas rentrer vers l'intérieur", "Descendez le plus bas possible sans arrondir le dos", "Bras en avant pour l'équilibre"],
    duration: 40,
    sets: 3,
    reps: "15-25",
    restTime: 60,
    tags: ["jambes", "fessiers", "débutant"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Squats.jpg/1280px-Squats.jpg", caption: "Squat — position basse, cuisses parallèles" },
    ]
  },
  {
    id: "jump-squat",
    name: "Squats sautés",
    bodyPart: "legs",
    difficulty: "intermédiaire",
    musclesWorked: ["Quadriceps", "Fessiers", "Mollets"],
    description: "Version pliométrique du squat. Développe la puissance explosive et brûle plus de calories.",
    steps: [
      "Position de squat standard",
      "Descendez jusqu'à la position basse",
      "Explosez vers le haut en sautant le plus haut possible",
      "Atterrissez en douceur sur les orteils",
      "Amortissez l'impact en pliant immédiatement les genoux"
    ],
    tips: ["Atterrissage doux sur les orteils d'abord", "Enchaînez sans pause pour l'aspect cardio", "Interdit si douleur aux genoux"],
    duration: 40,
    sets: 3,
    reps: "12-15",
    restTime: 75,
    tags: ["jambes", "cardio", "intermédiaire", "pliométrie"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Squats.jpg/1280px-Squats.jpg", caption: "Jump squat — décollage explosif" },
    ]
  },
  {
    id: "lunges",
    name: "Fentes (Lunges)",
    bodyPart: "legs",
    difficulty: "débutant",
    musclesWorked: ["Quadriceps", "Fessiers", "Ischio-jambiers"],
    description: "Les fentes sont idéales pour un travail unilatéral des jambes. Excellent pour corriger les déséquilibres entre les deux côtés.",
    steps: [
      "Debout, pieds à largeur de hanches",
      "Faites un grand pas en avant",
      "Descendez le genou arrière vers le sol (sans le toucher)",
      "Genou avant au-dessus de la cheville (pas devant)",
      "Remontez et alternez les jambes"
    ],
    tips: ["Genou avant ne doit pas dépasser les orteils", "Dos droit, regard droit", "Prenez un grand pas pour travailler davantage les fessiers"],
    duration: 40,
    sets: 3,
    reps: "10-12 (par jambe)",
    restTime: 60,
    tags: ["jambes", "fessiers", "débutant"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Lunge_exercise.jpg/1280px-Lunge_exercise.jpg", caption: "Fente — genou arrière proche du sol" },
    ]
  },
  {
    id: "glute-bridge",
    name: "Pont fessier (Glute Bridge)",
    bodyPart: "legs",
    difficulty: "débutant",
    musclesWorked: ["Fessiers", "Ischio-jambiers", "Bas du dos"],
    description: "Excellent exercice de renforcement des fessiers. Sécuritaire pour le dos et accessible à tous les niveaux.",
    steps: [
      "Allongé sur le dos, genoux fléchis à 90°, pieds à plat",
      "Bras le long du corps, paumes vers le bas",
      "Poussez les hanches vers le haut en contractant les fessiers",
      "Corps aligné de l'épaule au genou en haut",
      "Contractez fort 1 seconde, descendez lentement"
    ],
    tips: ["Serrez fort les fessiers en haut — imaginez tenir une pièce entre eux", "Version unilatérale (une jambe) = beaucoup plus intense"],
    duration: 40,
    sets: 3,
    reps: "15-20",
    restTime: 45,
    tags: ["fessiers", "jambes", "débutant"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Squats.jpg/1280px-Squats.jpg", caption: "Pont fessier — hanches soulevées" },
    ]
  },
  {
    id: "pistol-squat",
    name: "Squat pistol (une jambe)",
    bodyPart: "legs",
    difficulty: "avancé",
    musclesWorked: ["Quadriceps", "Fessiers", "Core", "Tibial antérieur"],
    description: "Le Saint Graal des exercices de jambes en callisthénie. Squat complet sur une seule jambe. Requiert force, équilibre et mobilité.",
    steps: [
      "Debout sur une jambe, autre jambe tendue vers l'avant",
      "Bras vers l'avant pour l'équilibre",
      "Descendez lentement en gardant la jambe tendue horizontale",
      "Descendez jusqu'en bas (talon proche des fesses)",
      "Remontez en poussant fort sur le talon"
    ],
    tips: ["Commencez avec assistance (tenir un montant)", "Progression : squat bulgare → pistol assisté → pistol libre", "Mobilité de cheville indispensable"],
    duration: 50,
    sets: 3,
    reps: "3-8 (par jambe)",
    restTime: 120,
    tags: ["jambes", "avancé", "équilibre", "une jambe"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Squats.jpg/1280px-Squats.jpg", caption: "Squat pistol — descente complète" },
    ]
  },
  // ─── FULL BODY ────────────────────────────────────────────────────────────
  {
    id: "burpee",
    name: "Burpees",
    bodyPart: "full",
    difficulty: "intermédiaire",
    musclesWorked: ["Tout le corps", "Cardio-vasculaire"],
    description: "Le burpee est l'exercice complet par excellence — cardio, force, coordination. Très efficace pour brûler des calories et renforcer tout le corps.",
    steps: [
      "Debout, pieds à largeur d'épaules",
      "Accroupissez-vous et posez les mains au sol",
      "Sautez les pieds en arrière (position de pompe)",
      "Faites une pompe (optionnel pour débutants)",
      "Sautez les pieds vers les mains",
      "Explosez vers le haut avec les bras"
    ],
    tips: ["Rythme continu — la pause tue le cardio", "Débutants : remplacez le saut par un step-out", "Un des exercices les plus efficaces pour maigrir"],
    duration: 45,
    sets: 3,
    reps: "8-15",
    restTime: 90,
    tags: ["full body", "cardio", "intermédiaire"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Push_up.svg/1200px-Push_up.svg.png", caption: "Burpee — séquence complète" },
    ]
  },
  {
    id: "muscle-up",
    name: "Muscle-up",
    bodyPart: "full",
    difficulty: "avancé",
    musclesWorked: ["Grand dorsal", "Grand pectoral", "Triceps", "Biceps", "Core"],
    description: "Le mouvement emblématique de la callisthénie. Combine une traction et un dip en un seul mouvement fluide. Symbolise la maîtrise du poids de corps.",
    steps: [
      "Traction explosive en prise pronation",
      "En atteignant le haut, penchez-vous vers l'avant",
      "Passez les poignets au-dessus de la barre",
      "Poussez vers le haut (phase de dip)",
      "Descendez en contrôlant les deux phases"
    ],
    tips: ["Maîtrisez 15 pull-ups et 15 dips avant d'essayer", "Le secret : la transition (le passage des poignets)", "Pratiquez le faux muscle-up d'abord"],
    duration: 60,
    sets: 3,
    reps: "3-6",
    restTime: 120,
    tags: ["full body", "avancé", "barre", "muscle-up"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Pullup_bar.jpg/1280px-Pullup_bar.jpg", caption: "Muscle-up — phase de transition" },
    ]
  },
  {
    id: "human-flag",
    name: "Drapeau (Human Flag)",
    bodyPart: "full",
    difficulty: "avancé",
    musclesWorked: ["Obliques", "Grand dorsal", "Deltoïde", "Core"],
    description: "Une des figures les plus impressionnantes de la callisthénie. Corps horizontal en appui sur un poteau vertical. Requiert des mois de préparation.",
    steps: [
      "Saisissez le poteau, main haute en pronation, main basse en supination",
      "Poussez fort avec le bras bas (pousser vers le bas)",
      "Tirez fort avec le bras haut (tirer vers le haut)",
      "Élevez le corps à l'horizontale",
      "Maintenez la position le plus longtemps possible"
    ],
    tips: ["Commencez par le drapeau incliné (45°)", "Progressez : bannière inclinée → bannière staggered → drapeau complet", "Exercice de plusieurs mois de préparation"],
    duration: 20,
    sets: 3,
    reps: "3-5s",
    restTime: 180,
    tags: ["full body", "avancé", "drapeau", "figure"],
    images: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Handstand.jpg/1280px-Handstand.jpg", caption: "Human Flag — corps horizontal" },
    ]
  },
];

export function getExercisesByBodyPart(bodyPart: BodyPart): Exercise[] {
  return exercises.filter(e => e.bodyPart === bodyPart || bodyPart === "full");
}

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find(e => e.id === id);
}

export function getExercisesByDifficulty(difficulty: Difficulty): Exercise[] {
  return exercises.filter(e => e.difficulty === difficulty);
}

export function getRandomExercises(count: number, bodyPart?: BodyPart, difficulty?: Difficulty): Exercise[] {
  let pool = exercises;
  if (bodyPart && bodyPart !== "full") {
    pool = pool.filter(e => e.bodyPart === bodyPart || e.bodyPart === "full");
  }
  if (difficulty) {
    pool = pool.filter(e => e.difficulty === difficulty);
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
