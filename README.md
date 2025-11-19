# 🚀 FitPack AI - Intelligent Fitness Training with Reinforcement Learning

**AI-powered fitness coach that adapts to your performance, pain signals, and recovery.**

## 🎯 Features

- ✅ **Reinforcement Learning Loop**: AI adapts workout intensity based on your feedback
- 💪 **Injury Prevention**: Automatically replaces exercises when pain is reported
- 😴 **Recovery Monitoring**: Integrates telemetry (sleep, steps, heart rate)
- 📊 **Progressive Overload**: Smart weight progression based on confidence & RPE
- 📦 **FitPack System**: Load complete training programs from ZIP files
- 🎨 **Beautiful UI**: Framer Motion animations, Tailwind CSS styling

## 🏗️ Architecture

```
fitpack/
├── src/
│   ├── engine/           # Core data models & logic
│   │   ├── model.ts      # TypeScript types for FitPack
│   │   ├── db.ts         # IndexedDB with Dexie
│   │   ├── manifest.ts   # Getters for reading manifest
│   │   └── pack.ts       # ZIP loading
│   ├── features/
│   │   ├── adaptation/   # RL adaptation engine
│   │   ├── coach/        # Main state machine (useCoach)
│   │   ├── pack/         # Pack management
│   │   └── telemetry/    # Mock Google Fit integration
│   ├── ui/
│   │   ├── AppLayout.tsx
│   │   └── PageTransition.tsx
│   └── App.tsx           # Main app component
```

## 🔥 Reinforcement Learning Flow

```
Phase Intro → Day Prep → Workout → Feedback (RPE + Confidence + Pain) → 
Recovery → AI Adaptation → Next Day
```

**AI Adaptation Rules (MVP):**
1. **Low confidence** (avg < 2.5) → Deload -15%
2. **High RPE** (avg > 4.2) → Deload -10%
3. **Pain reported** → Replace exercises with safe alternatives
4. **High performance** (conf > 4, RPE < 3.5, no pain) → Progressive overload +2.5kg
5. **Poor sleep** (< 6h) → Active recovery mode -30%

## 📦 FitPack Structure

```
fitpack-example.zip:
├── manifest.json          # Program definition
├── phases/
│   ├── adaptation.md
│   └── progression.md
├── workouts/
│   ├── upper-a.json
│   └── lower-b.json
├── exercises/             # Exercise form cues (unused in MVP)
├── meals/                 # Nutrition data (unused in MVP)
└── covers/                # Phase cover images
```

### Example manifest.json:

```json
{
  "version": 1,
  "languages": ["pl", "en"],
  "levels": [1, 2, 3],
  "program": {
    "id": "beginner-strength",
    "title": { "pl": "Siła dla początkujących" },
    "description": { "pl": "8-tygodniowy program..." },
    "goal": "strength",
    "phases": [
      {
        "id": "adaptation",
        "name": { "pl": "Adaptacja" },
        "order": 1,
        "durationWeeks": 2,
        "workoutSchedule": {
          "daysPerWeek": 3,
          "workouts": [
            { "id": "upper-a", "dayOfWeek": 1, "type": "strength" },
            { "id": "lower-b", "dayOfWeek": 3, "type": "strength" }
          ]
        },
        "nutritionGuidelines": {
          "caloriesTarget": 2200,
          "proteinGrams": 150,
          "carbsGrams": 220,
          "fatGrams": 70,
          "mealsPerDay": 4
        }
      }
    ]
  },
  "exercises": [
    {
      "id": "squat",
      "name": { "pl": "Przysiad ze sztangą" },
      "description": { "pl": "Podstawowe ćwiczenie..." },
      "equipment": ["barbell", "rack"],
      "muscleGroups": ["quads", "glutes"],
      "difficulty": 2,
      "formCues": {
        "pl": [
          "Stopy na szerokość bioder",
          "Kolana w linii stóp",
          "Plecy proste przez cały ruch"
        ]
      },
      "alternatives": ["goblet-squat"],
      "contraindicatedInjuries": ["knee-injury"]
    }
  ],
  "injuries": [
    {
      "id": "knee-injury",
      "name": { "pl": "Kontuzja kolana" },
      "bodyPart": "Kolano",
      "severity": "moderate",
      "restrictedExercises": ["squat", "leg-press"],
      "recommendedExercises": ["goblet-squat", "leg-extension"]
    }
  ],
  "meals": []
}
```

## 🚀 Getting Started

### 1. Install dependencies:
```bash
npm install
```

### 2. Run dev server:
```bash
npm run dev
```

### 3. Build for production:
```bash
npm run build
```

## 🎨 Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS 4** (styling)
- **Framer Motion** (animations)
- **Dexie** (IndexedDB wrapper)
- **JSZip** (FitPack loading)
- **Marked** (Markdown rendering - for future use)

## 🔮 Future Enhancements

1. **Google Fit API Integration** (replace mock telemetry)
2. **Real-time video form checking** (computer vision)
3. **Advanced RL model** (TensorFlow.js)
4. **Cloud sync** (Firebase/Supabase)
5. **Social features** (share workouts, compete)
6. **Nutrition tracking** (meal logging with AI)
7. **Voice coaching** (audio cues during workout)

## 📝 Notes

- **MVP uses rule-based adaptation** (not ML yet)
- **Telemetry is mocked** (Google Fit integration = phase 2)
- **Single pack support** (multi-pack merging = later)
- **No meal tracking yet** (nutrition in manifest but unused)

## 🎯 Made with 💜 by Claude

**Zapytaj mnie o cokolwiek - jestem tutaj, żeby pomóc!**
# ff-BRAIN
