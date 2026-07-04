import { JourneyStage, Habit, Exercise } from './types';

export const DEFAULT_JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'stage-1',
    title: 'Early Morning Activation',
    timeRange: '05:30 AM - 07:30 AM',
    iconName: 'Sunrise',
    description: 'Preparing the nervous system, dynamic mobility, and fueling with pre-training fuel.',
    challenge: 'Waking up stiff, cold muscles, and avoiding heavy, sluggish breakfast.',
    solution: 'Perform 10 minutes of active dynamic stretching (hip openers, thoracic twists) and consume light fast-digesting carbs (banana, oats) before physical training.',
    activities: [
      'Warm water hydration & light pre-workout snack',
      '10-Min Full-Body Joint Mobility Activation',
      'Morning Agility & Footwork drills (ladder run/shuttles)'
    ]
  },
  {
    id: 'stage-2',
    title: 'Morning Academic Block',
    timeRange: '08:30 AM - 01:00 PM',
    iconName: 'BookOpen',
    description: 'High-focus study blocks or school attendance. Keeping mental sharpness active.',
    challenge: 'Academic stress, dehydration, and long periods of static sitting.',
    solution: 'Stay hydrated with a 1L water bottle at your desk, stand up and stretch every 50 minutes to maintain shoulder/hip health.',
    activities: [
      'Intense classroom focus or high-priority exam study',
      'Sip 1.5L of water progressively',
      'Posture reset stretch (chest opener and hip flexor stretch)'
    ]
  },
  {
    id: 'stage-3',
    title: 'Post-Class Recovery & Fuel',
    timeRange: '01:00 PM - 02:30 PM',
    iconName: 'Utensils',
    description: 'Replenishing energy with high-protein meals to promote muscle repair.',
    challenge: 'Skipping lunches due to class schedules or resorting to greasy canteen food.',
    solution: 'Pre-pack a protein-dense lunch (chicken/paneer with rice or quinoa and vegetables) to consume at 1:00 PM precisely.',
    activities: [
      'Balanced post-study / pre-workout meal (balanced carbs & proteins)',
      'Hydration replenishment',
      '20-Min mental reset power nap or quiet meditation'
    ]
  },
  {
    id: 'stage-4',
    title: 'Main Athletic Training & Gym',
    timeRange: '03:30 PM - 06:30 PM',
    iconName: 'Dumbbell',
    description: 'Cricket net practice combined with structured strength (squats, deadlifts) and bowling/batting sessions.',
    challenge: 'Physical fatigue, muscle soreness, and risk of bowling shoulder/lower-back strain.',
    solution: 'Ensure a solid warm-up, focus strictly on proper technique (especially on pull-ups and squats), and wrap up with static cool-downs.',
    activities: [
      'Specific Cricket Skill Drills (Net Session / Fielding Practice)',
      'Structural Gym Session (Squat, Deadlift, Pull-up progression)',
      'Cool-down and immediate post-workout whey/protein refuel'
    ]
  },
  {
    id: 'stage-5',
    title: 'Evening Academic Review',
    timeRange: '07:30 PM - 09:30 PM',
    iconName: 'Award',
    description: 'Wrapping up homework, exam prep, and mental reviews of the day\'s athletic performance.',
    challenge: 'Severe post-training fatigue and brain fog.',
    solution: 'Keep study sessions focused and brief (Pomodoro technique) and have a clean, light dinner with healthy fats.',
    activities: [
      'Homework or secondary self-study block (90 mins)',
      'Cricket performance journaling (identifying focus areas)',
      'Nutritious dinner with cruciferous veggies and protein source'
    ]
  },
  {
    id: 'stage-6',
    title: 'Mental Preparation & Sleep Wind-down',
    timeRange: '09:30 PM - 10:30 PM',
    iconName: 'Moon',
    description: 'Deep sleep preparation, breathing control, and visualization routines.',
    challenge: 'Screen-time blue light disrupting melatonin, leading to sleep quality degradation.',
    solution: 'Turn off all screens by 9:45 PM. Do 5 minutes of deep box breathing (4-4-4-4) to trigger parasympathetic recovery.',
    activities: [
      'No screen rule 45 mins before bedtime',
      'Box breathing (5 minutes) for nervous system wind-down',
      'Visualization of perfect batting/bowling motions'
    ]
  }
];

export const DEFAULT_HABITS: Habit[] = [
  // Fitness
  { id: 'h1', name: '10-Min Dynamic Mobility (Morning)', category: 'fitness', time: '06:00 AM', completed: false, points: 15, description: 'Prepares joints, increases range of motion, and reduces bowling injury risks.' },
  { id: 'h2', name: 'Cricket Agility Drills (Ladder/Cone)', category: 'fitness', time: '06:30 AM', completed: false, points: 20, description: 'Improves reaction time and quick direction changes in the field.' },
  { id: 'h3', name: 'Main Strength Routine (Squat/Deadlift)', category: 'fitness', time: '04:30 PM', completed: false, points: 25, description: 'Core cricket lifts to build explosive batting power and bowling stamina.' },
  
  // Nutrition
  { id: 'h4', name: 'Pre-Workout Energizing Fuel', category: 'nutrition', time: '05:45 AM', completed: false, points: 10, description: 'Hydration plus light, fast carb intake (e.g. banana or sports hydration mix).' },
  { id: 'h5', name: 'High-Protein Recovery Lunch', category: 'nutrition', time: '01:15 PM', completed: false, points: 15, description: 'Provides essential amino acids for fast-twitch muscle fiber reconstruction.' },
  { id: 'h6', name: 'Sip 3.5 Liters of Pure Water', category: 'nutrition', time: 'All Day', completed: false, points: 15, description: 'Prevents athletic dehydration, headaches, and muscle cramping during training.' },
  
  // Study
  { id: 'h7', name: '4-Hour High-Focus School/Study Block', category: 'study', time: '09:00 AM', completed: false, points: 20, description: 'Maintains academic excellence without letting athletic goals compromise studies.' },
  { id: 'h8', name: 'Posture Stretch Breaks (Every 50m)', category: 'study', time: 'Study Blocks', completed: false, points: 10, description: 'Releases hip flexors and chest stiffness caused by long study sessions.' },

  // Mental
  { id: 'h9', name: '5-Min Bedtime Visualization Drill', category: 'mental', time: '10:00 PM', completed: false, points: 15, description: 'Mental rehearsals of perfect deliveries, defensive shots, and catches.' },
  { id: 'h10', name: 'Performance Review Journaling', category: 'mental', time: '08:30 PM', completed: false, points: 10, description: 'Log training metrics, mood, and strategic tactical discoveries.' },

  // Recovery
  { id: 'h11', name: '8 Hours of Quality Sleep', category: 'recovery', time: '10:30 PM', completed: false, points: 25, description: 'The absolute foundation of physical recovery, muscle synthesis, and study recall.' },
  { id: 'h12', name: 'Box Breathing (Nervous System Reset)', category: 'recovery', time: '09:45 PM', completed: false, points: 10, description: 'Lowers stress hormones and initiates rapid athletic cell repair.' }
];

export const CRICKET_EXERCISES: Exercise[] = [
  // Mobility
  {
    id: 'ex-1',
    name: 'Thoracic (T-Spine) Windmills',
    type: 'mobility',
    description: 'Enhances mid-back rotation, crucial for bowler wind-up and batting torque.',
    steps: [
      'Lie on your side with knees stacked at 90 degrees.',
      'Hold top knee down with your bottom hand.',
      'Take your top hand and sweep it in a wide arc across your body, following with your eyes.',
      'Return back smoothly. Complete 10 repetitions per side.'
    ],
    target: '2 Sets x 10 Reps (each side)',
    benefitsForCricket: 'Relieves bowler lower-back pressure by ensuring rotation occurs in the upper back, where it is supposed to.',
    difficulty: 'Beginner'
  },
  {
    id: 'ex-2',
    name: 'World\'s Greatest Stretch',
    type: 'mobility',
    description: 'A multi-joint mobilizer opening the hips, hamstrings, and thoracic column in one flow.',
    steps: [
      'Step back into a deep lunge with your right leg, putting both hands flat on the floor inside your left foot.',
      'Lift your left hand and twist up, reaching toward the sky.',
      'Lower your left elbow toward your instep to feel a deep hip/groin stretch.',
      'Push your hips back and straighten your front leg to stretch the hamstring.',
      'Switch sides and repeat.'
    ],
    target: '2 Sets x 6 Reps (each side)',
    benefitsForCricket: 'Increases stride length for fast bowling run-up and improves lateral speed when fielding.',
    difficulty: 'Intermediate'
  },
  {
    id: 'ex-3',
    name: 'Sleeper Stretch (Shoulder Care)',
    type: 'mobility',
    description: 'Improves internal shoulder rotation, which is often severely degraded in overhead throwing/bowling.',
    steps: [
      'Lie on your side on a firm mat, with your shoulder directly underneath you and arm at a 90-degree angle.',
      'Gently use your other hand to push your forearm down toward the floor.',
      'Hold when you feel a mild, safe stretch at the back of the shoulder. Do not force.',
      'Hold for 30 seconds, breathe steadily, and repeat.'
    ],
    target: '2 Sets x 30 Sec Holds',
    benefitsForCricket: 'Protects the rotator cuff and prevents labrum injuries in high-velocity fast bowling.',
    difficulty: 'Beginner'
  },

  // Stability
  {
    id: 'ex-4',
    name: 'Single-Leg Balance & Catch',
    type: 'stability',
    description: 'Stabilizes the ankle, knee, and hip joints. Simulates fielding adjustments.',
    steps: [
      'Stand on one leg with a slight bend in your knee.',
      'Have a partner throw a tennis ball to you from different angles, or bounce a tennis ball off a wall.',
      'Catch and return the ball while maintaining absolute control on one foot.',
      'Complete 1 minute, then swap feet.'
    ],
    target: '3 Sets x 60 Seconds per leg',
    benefitsForCricket: 'Prepares the ankle for high landing forces during bowling delivery stride, and boosts catching accuracy.',
    difficulty: 'Intermediate'
  },
  {
    id: 'ex-5',
    name: 'Anti-Rotation Pallof Press',
    type: 'stability',
    description: 'Trains the core to resist rotation, building a rock-solid foundation for batsmen.',
    steps: [
      'Stand parallel to a cable machine or resistance band anchor.',
      'Hold the handle/band with both hands at the center of your chest.',
      'Brace your core, and press the band straight forward. Do not let the band twist your torso.',
      'Hold for 2 seconds at full extension, then slowly bring it back to your chest.'
    ],
    target: '3 Sets x 12 Reps',
    benefitsForCricket: 'Enables batsmen to maintain a stable head and straight trunk posture during powerful pull or drive shots.',
    difficulty: 'Intermediate'
  },

  // Strength
  {
    id: 'ex-6',
    name: 'Goblet / Barbell Back Squats',
    type: 'strength',
    description: 'The king of lower body strength, developing power in the glutes, quads, and core.',
    steps: [
      'Place feet shoulder-width apart, holding a heavy kettlebell close to your chest (or barbell on traps).',
      'Sit back and down, keeping chest upright and knees tracking in line with toes.',
      'Descend until thighs are parallel to the floor.',
      'Drive aggressively back to start through your mid-foot.'
    ],
    target: '4 Sets x 8-10 Reps',
    benefitsForCricket: 'Builds massive driving power for batsmen sprinting between wickets and bowling release speed.',
    difficulty: 'Intermediate'
  },
  {
    id: 'ex-7',
    name: 'Romanian Deadlifts (RDLs)',
    type: 'strength',
    description: 'Strengthens the entire posterior chain (hamstrings, glutes, lower back).',
    steps: [
      'Stand holding a barbell or dumbbells in front of thighs.',
      'Hinge forward at the hips, pushing glutes backward while keeping knees slightly bent and back completely flat.',
      'Lower the weight down your legs until you feel a deep stretch in your hamstrings.',
      'Drive hips forward and squeeze glutes to return to an upright posture.'
    ],
    target: '3 Sets x 10 Reps',
    benefitsForCricket: 'Acts as highly functional injury-prevention for hamstrings, which are highly stressed during fielding sprints.',
    difficulty: 'Intermediate'
  },
  {
    id: 'ex-8',
    name: 'Tactical Pull-Ups / Lat Pull-downs',
    type: 'strength',
    description: 'Develops back and grip strength to control bat swing and bowl faster.',
    steps: [
      'Hang from a pull-up bar with a grip slightly wider than shoulder-width.',
      'Depress your shoulders downward first, then pull your chest up to the bar.',
      'Keep your core tight—do not swing your body.',
      'Slowly lower yourself back down with full control.'
    ],
    target: '3 Sets x Max Reps (or Lat Pulls)',
    benefitsForCricket: 'Strengthens the latissimus dorsi, the main driver in pulling the bowling arm down during release.',
    difficulty: 'Advanced'
  },

  // Agility
  {
    id: 'ex-9',
    name: 'Fast Footwork Agility Ladder',
    type: 'agility',
    description: 'Enhances foot speed, balance, coordination, and ankle reactivity.',
    steps: [
      'Lay out a 10-yard agility ladder on grass or concrete.',
      'Perform high-knee runs (2 feet in each box) as quickly as possible, pumping your arms.',
      'Repeat with lateral step-ins (Icky Shuffle) where you step in, in, and out of each rung.',
      'Complete 5 runs of each drill.'
    ],
    target: '5 Runs x 3 Variations',
    benefitsForCricket: 'Enables quick adjustments in the slips or boundary line to snatch fast-moving catching chances.',
    difficulty: 'Intermediate'
  },
  {
    id: 'ex-10',
    name: 'Pro Shuttle Run (5-10-5 Drill)',
    type: 'agility',
    description: 'Trains explosive rapid deceleration, pivoting, and acceleration.',
    steps: [
      'Place three cones in a straight line, each 5 yards apart.',
      'Start at the middle cone in a 3-point athletic stance.',
      'Sprint 5 yards to the right cone, touch it with your hand.',
      'Pivot and sprint 10 yards to the far left cone, touch it.',
      'Pivot again and sprint back past the center cone.'
    ],
    target: '4 Rounds (Alternate starting directions)',
    benefitsForCricket: 'Directly replicates running between wickets, turning fast on the second run, or cutting off a boundary ball.',
    difficulty: 'Advanced'
  }
];
