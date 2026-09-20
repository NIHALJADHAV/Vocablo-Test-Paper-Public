import { GeneratedQuestion } from '../src/types';

// ============================================================================
// 1.1 PAST, PRESENT, FUTURE (Emily Brontë - Poem)
// ============================================================================
export function generatePastPresentFutureQuestion(
  type: string,
  marks: number,
  sectionId: string,
  sectionTitle: string,
  qNumber: number,
  variantIndex: number,
  id: string
): GeneratedQuestion {
  const chapter = '1.1 Past, Present, Future';

  if (type === 'MCQ') {
    const mcqs = [
      {
        q: 'In Emily Brontë\'s poem "Past, Present, Future", the child compares the "Present hour" to:',
        options: [
          'A. An autumn evening with a mournful wind',
          'B. A green and flowery spray with a young bird gathering power',
          'C. A mighty, glorious, dazzling sea beneath a cloudless sun',
          'D. A dark forest waiting for the sunrise'
        ],
        ans: 'B. A green and flowery spray with a young bird gathering power',
        alt: ['Option B: A green and flowery spray with a young bird gathering power'],
        rubric: [`${marks} marks for selecting the correct metaphor (Option B).`],
        diff: 'easy' as const,
        cog: 'Remember' as const
      },
      {
        q: 'Why does the poet describe the Past as "An Autumn evening soft and mild with a wind that sighs mournfully"?',
        options: [
          'A. To evoke a gentle, nostalgic sorrow for days that have gone and can never return',
          'B. Because autumn evenings are filled with destructive cold storms',
          'C. To show that the child disliked her past childhood experiences',
          'D. Because autumn is the season when birds migrate across the sea'
        ],
        ans: 'A. To evoke a gentle, nostalgic sorrow for days that have gone and can never return',
        alt: ['Option A: Nostalgic sorrow for days gone by'],
        rubric: [`${marks} marks for recognizing the nostalgic and mournful mood of the past (Option A).`],
        diff: 'moderate' as const,
        cog: 'Understand' as const
      },
      {
        q: 'What is the rhyme scheme of the three stanzas in "Past, Present, Future"?',
        options: [
          'A. AABB',
          'B. ABAB',
          'C. ABBA',
          'D. AAAA'
        ],
        ans: 'B. ABAB',
        alt: ['Option B: ABAB (child/thee/mild/mournfully; hour/spray/power/away)'],
        rubric: [`${marks} marks for identifying the standard ABAB alternate rhyme scheme.`],
        diff: 'moderate' as const,
        cog: 'Analyze' as const
      }
    ];
    const item = mcqs[variantIndex % mcqs.length];
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'MCQ',
      question: item.q,
      options: item.options,
      answer: item.ans,
      acceptableAlternatives: item.alt,
      markingRubric: item.rubric,
      marks,
      chapter,
      difficulty: item.diff,
      cognitiveLevel: item.cog,
      locked: false,
      verified: true
    };
  }

  if (type === 'Fill in the Blanks') {
    const blanks = [
      {
        q: 'In the poem "Past, Present, Future", the future is described as a sea beneath a cloudless sun stretching into ______.',
        ans: 'infinity',
        alt: ['infinity (boundless space/eternity)'],
        rubric: [`${marks} marks for the exact word "infinity".`]
      },
      {
        q: 'On the green and flowery spray, a young bird sits gathering its power to mount and ______.',
        ans: 'fly away',
        alt: ['fly away', 'fly'],
        rubric: [`${marks} marks for "fly away".`]
      }
    ];
    const item = blanks[variantIndex % blanks.length];
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Fill in the Blanks',
      question: item.q,
      answer: item.ans,
      acceptableAlternatives: item.alt,
      markingRubric: item.rubric,
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'True / False') {
    const tf = [
      {
        q: 'In "Past, Present, Future", the child views the future with overwhelming anxiety and terror.',
        ans: 'False',
        alt: ['False: The child views the future as a mighty, glorious, dazzling sea stretching into infinity.'],
        rubric: [`${marks} marks for identifying statement as False.`]
      },
      {
        q: 'The wind associated with the autumn evening in the past is described as sighing mournfully.',
        ans: 'True',
        alt: ['True: Text states "With a wind that sighs mournfully."'],
        rubric: [`${marks} marks for identifying statement as True.`]
      }
    ];
    const item = tf[variantIndex % tf.length];
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'True / False',
      question: item.q,
      answer: item.ans,
      acceptableAlternatives: item.alt,
      markingRubric: item.rubric,
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'Short Answer') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Short Answer',
      question: 'What metaphor does Emily Brontë use to describe the "Present hour" in the poem? Explain the significance of the young bird.',
      answer: 'The child describes the present as "A green and flowery spray" where a young bird sits gathering its strength to mount and fly away. The young bird represents childhood or youth—a formative time spent gathering knowledge, strength, and confidence before venturing out into the wide world.',
      acceptableAlternatives: [
        'The present is compared to a leafy branch with a young bird preparing to fly, symbolizing youth gathering potential and preparing for the journey of life.'
      ],
      markingRubric: [
        '1.5 marks: Identifying the metaphor of the green, flowery spray.',
        '1.5 marks: Explaining that the young bird symbolizes growing youth preparing for independent life.'
      ],
      marks,
      chapter,
      difficulty: 'moderate',
      cognitiveLevel: 'Analyze',
      locked: false,
      verified: true
    };
  }

  // Long Answer
  return {
    id,
    number: qNumber,
    sectionId,
    sectionTitle,
    questionType: 'Long Answer',
    question: 'How does the smiling child\'s perception of time progress from the past to the future in Emily Brontë\'s poem "Past, Present, Future"? Analyze the contrasting imagery and emotional tone across the three stanzas.',
    answer: 'In Emily Brontë\'s poem, the child visualizes time through three distinct, evocative natural landscapes:\n1. The Past: Depicted as an autumn evening, "soft and mild," with a "wind that sighs mournfully." The tone is gentle nostalgia, reflecting memories tinged with mild sorrow for moments that have faded.\n2. The Present: Depicted as springtime vitality—a "green and flowery spray" where a young bird gathers power to take flight. The tone shifts from passive remembrance to active preparation, courage, and emerging potential.\n3. The Future: Imagined as a vast, sunlit ocean—"A sea beneath a cloudless sun; A mighty, glorious, dazzling sea stretching into infinity." The tone culminates in boundless joy, optimism, and infinite possibility.\nThus, the poem traces an emotional arc from quiet nostalgia through industrious readiness to limitless hope.',
    acceptableAlternatives: [
      'A structured critical response tracing Autumn (melancholic nostalgia of the past), Spring spray and bird (growing vigor of the present), and boundless sunny sea (limitless optimism for the future).'
    ],
    markingRubric: [
      '1.5 marks: Analysis of the past as an autumn evening with mournful wind and its nostalgic tone.',
      '1.5 marks: Analysis of the present as a flowery branch and fledgling bird preparing for flight.',
      '2.0 marks: Analysis of the future as an infinite, dazzling sea under a cloudless sky, summarizing the progression of hope.'
    ],
    marks,
    chapter,
    difficulty: 'difficult',
    cognitiveLevel: 'Evaluate',
    locked: false,
    verified: true
  };
}

// ============================================================================
// 1.2 ODD ONE IN (Tithi Tavora - Story)
// ============================================================================
export function generateOddOneInQuestion(
  type: string,
  marks: number,
  sectionId: string,
  sectionTitle: string,
  qNumber: number,
  variantIndex: number,
  id: string
): GeneratedQuestion {
  const chapter = '1.2 Odd One In';

  if (type === 'MCQ') {
    const mcqs = [
      {
        q: 'Why did Malti\'s ability in Mathematics change the way her classmates viewed her in "Odd One In"?',
        options: [
          'A. It proved she had paid for private home tuition',
          'B. It demonstrated her sharp intellect and willingness to patiently help classmates with difficult problems',
          'C. It allowed her to excuse herself from physical education drills',
          'D. It made the teachers give her extra recess privileges'
        ],
        ans: 'B. It demonstrated her sharp intellect and willingness to patiently help classmates with difficult problems',
        alt: ['Option B: Proving intellect and generous willingness to help others solve problems'],
        rubric: [`${marks} marks for recognizing that competence and generosity changed classmates' perception (Option B).`],
        diff: 'moderate' as const,
        cog: 'Understand' as const
      },
      {
        q: 'How did Rima\'s friends—Shahnaz, Neha, and Clare—react when Rima mocked Malti as a "countrified type"?',
        options: [
          'A. They joined Rima in mocking Malti\'s accent',
          'B. They turned roundly on Rima and called her behavior horrid',
          'C. They complained to the school principal',
          'D. They walked out of the school building'
        ],
        ans: 'B. They turned roundly on Rima and called her behavior horrid',
        alt: ['Option B: Turning on Rima and reprimanding her horrid conduct'],
        rubric: [`${marks} marks for identifying the peers\' defense of Malti (Option B).`],
        diff: 'moderate' as const,
        cog: 'Understand' as const
      },
      {
        q: 'At the Inter-House singing competition, how did Malti prove her talent to the entire school?',
        options: [
          'A. She danced gracefully to classical music',
          'B. She sang a Hindi song in a melodious, well-trained voice and won first prize',
          'C. She recited a Shakespearean monologue without notes',
          'D. She conducted the senior school choir'
        ],
        ans: 'B. She sang a Hindi song in a melodious, well-trained voice and won first prize',
        alt: ['Option B: Singing a Hindi song with a well-trained voice and securing first prize'],
        rubric: [`${marks} marks for identifying first prize in Hindi singing (Option B).`],
        diff: 'moderate' as const,
        cog: 'Understand' as const
      }
    ];
    const item = mcqs[variantIndex % mcqs.length];
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'MCQ',
      question: item.q,
      options: item.options,
      answer: item.ans,
      acceptableAlternatives: item.alt,
      markingRubric: item.rubric,
      marks,
      chapter,
      difficulty: item.diff,
      cognitiveLevel: item.cog,
      locked: false,
      verified: true
    };
  }

  if (type === 'Fill in the Blanks') {
    const blanks = [
      {
        q: 'In "Odd One In", Rima mimicked Malti\'s greeting at the dinner table: "Gud marning, ______."',
        ans: 'Teeechurr',
        alt: ['Teeechurr', 'Teacher'],
        rubric: [`${marks} marks for the word "Teeechurr".`]
      },
      {
        q: 'Rima\'s father gently cautioned her against becoming a ______ who judges others on appearances.',
        ans: 'snob',
        alt: ['snob'],
        rubric: [`${marks} marks for "snob".`]
      }
    ];
    const item = blanks[variantIndex % blanks.length];
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Fill in the Blanks',
      question: item.q,
      answer: item.ans,
      acceptableAlternatives: item.alt,
      markingRubric: item.rubric,
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'True / False') {
    const tf = [
      {
        q: 'Malti humbly approached Rima and politely requested her help in improving her spoken English.',
        ans: 'True',
        alt: ['True: Malti asked Rima to help her speak better English.'],
        rubric: [`${marks} marks for True.`]
      },
      {
        q: 'After making Malti cry with her rude remark, Rima felt completely pleased with herself and shared the story proudly with her parents.',
        ans: 'False',
        alt: ['False: Rima walked off in a huff, secretly ashamed of her snobbery.'],
        rubric: [`${marks} marks for False.`]
      }
    ];
    const item = tf[variantIndex % tf.length];
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'True / False',
      question: item.q,
      answer: item.ans,
      acceptableAlternatives: item.alt,
      markingRubric: item.rubric,
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Understand',
      locked: false,
      verified: true
    };
  }

  if (type === 'Short Answer') {
    const saVariants = [
      {
        q: 'Compare Malti\'s attitude with Rima\'s when Malti approached Rima for help with her spoken English. What does this exchange reveal about each girl?',
        ans: 'Malti demonstrated genuine humility, courage, and a desire for self-improvement by openly acknowledging that her English was weak and asking Rima for guidance. In sharp contrast, Rima reacted with haughty snobbery, rudely mocking Malti as a "countrified type". This reveals Malti\'s inner maturity and modesty, while exposing Rima\'s superficial arrogance and insecurity.',
        alt: ['Malti was polite and eager to learn, whereas Rima was condescending and cruel, proving Malti had higher moral character despite her rural background.'],
        rubric: [
          '1.5 marks: Describing Malti\'s humble and sincere approach.',
          '1.5 marks: Highlighting Rima\'s snide, dismissive reaction and contrasting their personalities.'
        ],
        cog: 'Analyze' as const,
        diff: 'moderate' as const
      },
      {
        q: 'Rima judged Malti before knowing her abilities. What mistake did Rima make, and how could a student avoid making the same mistake when meeting a new classmate?',
        ans: 'Rima committed the grave error of prejudice—judging Malti\'s character, worth, and intellect purely on superficial appearances such as her oiled hair, bindi, and regional accent. A student can avoid this mistake by keeping an open mind, refusing to gossip or ridicule others based on dress or dialect, appreciating diverse backgrounds, and giving newcomers time to express their unique talents and character.',
        alt: [
          'Rima judged Malti by appearances rather than merit. Students should practice empathy, welcome new classmates warmly, and judge people only by their actions and kindness.'
        ],
        rubric: [
          '1.5 marks: Accurately identifying Rima\'s mistake of shallow superficial prejudice.',
          '1.5 marks: Providing constructive, actionable advice for students when welcoming new peers.'
        ],
        cog: 'Apply' as const,
        diff: 'moderate' as const
      }
    ];
    const item = saVariants[variantIndex % saVariants.length];
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Short Answer',
      question: item.q,
      answer: item.ans,
      acceptableAlternatives: item.alt,
      markingRubric: item.rubric,
      marks,
      chapter,
      difficulty: item.diff,
      cognitiveLevel: item.cog,
      locked: false,
      verified: true
    };
  }

  // Long Answer
  return {
    id,
    number: qNumber,
    sectionId,
    sectionTitle,
    questionType: 'Long Answer',
    question: '"A person\'s worth is determined by their character and competence, not by their appearance or accent." Discuss this statement with close reference to Malti and Rima in Tithi Tavora\'s story "Odd One In".',
    answer: 'In "Odd One In", Tithi Tavora delivers a poignant critique of social prejudice and urban snobbery through the contrast between Malti and Rima:\n1. Initial Prejudice: Rima and her friends judge Malti solely by external markers—her oiled hair, bindi, simple attire, and heavy regional accent. Rima mimics her mockingly at home, demonstrating prejudice based purely on appearances.\n2. Substance Over Polish: Malti soon proves her mettle. Her extraordinary aptitude in Mathematics makes her a generous helper to her classmates. When she sings at the Inter-House competition, her trained, melodious voice captivates the audience and wins first prize, earning genuine respect.\n3. The Decisive Clash: When Malti courageously asks Rima to coach her in English, Rima lashes out with cruel elitism ("countrified types"). However, Rima\'s clique—Shahnaz, Neha, and Clare—stands up for fairness, rebuking Rima and calling her behavior "horrid".\n4. Conclusion: Malti emerges as dignified and industrious, while Rima is left isolated and privately ashamed of her pettiness. The story demonstrates that real merit resides in humility, talent, and kindness, not in superficial sophistication.',
    acceptableAlternatives: [
      'A comprehensive character study illustrating Rima\'s initial bias, Malti\'s triumph in mathematics and music, the turning point of the insult, and the rejection of snobbery by peers.'
    ],
    markingRubric: [
      '1.5 marks: Explaining the initial shallow prejudices regarding hair, bindi, and accent.',
      '1.5 marks: Providing concrete examples of Malti\'s academic and artistic excellence.',
      '2.0 marks: Analyzing the peer reaction against Rima\'s cruelty and explaining the moral realization of character over appearances.'
    ],
    marks,
    chapter,
    difficulty: 'difficult',
    cognitiveLevel: 'Evaluate',
    locked: false,
    verified: true
  };
}

// ============================================================================
// 1.3 IN TIME OF SILVER RAIN (Langston Hughes - Poem)
// ============================================================================
export function generateSilverRainQuestion(
  type: string,
  marks: number,
  sectionId: string,
  sectionTitle: string,
  qNumber: number,
  variantIndex: number,
  id: string
): GeneratedQuestion {
  const chapter = '1.3 In Time of Silver Rain';

  if (type === 'MCQ') {
    const mcqs = [
      {
        q: 'In Langston Hughes\' poem "In Time of Silver Rain", what visual action do the flowers perform when rain falls?',
        options: [
          'A. They close their petals tightly against the cold wind',
          'B. They lift their heads across the plain',
          'C. They scatter their seeds upon the muddy roadway',
          'D. They bend low into the flowing streams'
        ],
        ans: 'B. They lift their heads across the plain',
        alt: ['Option B: Flowers lift their heads'],
        rubric: [`${marks} marks for Option B.`],
        diff: 'easy' as const,
        cog: 'Remember' as const
      },
      {
        q: 'What poetic device is prominent in the line "Green grasses grow"?',
        options: [
          'A. Metaphor',
          'B. Alliteration',
          'C. Oxymoron',
          'D. Hyperbole'
        ],
        ans: 'B. Alliteration',
        alt: ['Option B: Alliteration (repetition of the \'g\' consonant sound)'],
        rubric: [`${marks} marks for identifying Alliteration (Option B).`],
        diff: 'moderate' as const,
        cog: 'Understand' as const
      }
    ];
    const item = mcqs[variantIndex % mcqs.length];
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'MCQ',
      question: item.q,
      options: item.options,
      answer: item.ans,
      acceptableAlternatives: item.alt,
      markingRubric: item.rubric,
      marks,
      chapter,
      difficulty: item.diff,
      cognitiveLevel: item.cog,
      locked: false,
      verified: true
    };
  }

  if (type === 'Fill in the Blanks') {
    const blanks = [
      {
        q: 'In the poem, butterflies lift their silken wings to catch a ______ cry.',
        ans: 'rainbow',
        alt: ['rainbow'],
        rubric: [`${marks} marks for the word "rainbow".`]
      },
      {
        q: 'Trees put forth new leaves to sing in joy beneath the ______.',
        ans: 'sky',
        alt: ['sky'],
        rubric: [`${marks} marks for "sky".`]
      }
    ];
    const item = blanks[variantIndex % blanks.length];
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Fill in the Blanks',
      question: item.q,
      answer: item.ans,
      acceptableAlternatives: item.alt,
      markingRubric: item.rubric,
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'True / False') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'True / False',
      question: 'In "In Time of Silver Rain", passing boys and girls walk silently and solemnly down the roadway.',
      answer: 'False',
      acceptableAlternatives: ['False: Passing boys and girls go singing down the roadway.'],
      markingRubric: [`${marks} marks for stating False.`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'Short Answer') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Short Answer',
      question: 'How does the arrival of silver rain awaken nature according to Langston Hughes? Mention two living creatures or plants affected.',
      answer: 'Langston Hughes portrays rain as a life-giving force that rejuvenates the earth: green grasses sprout, flowers lift their heads, butterflies spread silken wings to catch a rainbow cry, and trees put forth fresh leaves to sing in joy.',
      acceptableAlternatives: [
        'Rain brings new life: grasses grow, flowers lift their heads, butterflies open wings, and boys and girls go singing.'
      ],
      markingRubric: [
        '1.5 marks: Stating the general revival of the earth through rain.',
        '1.5 marks: Citing specific responses of grasses/flowers/butterflies/trees.'
      ],
      marks,
      chapter,
      difficulty: 'moderate',
      cognitiveLevel: 'Understand',
      locked: false,
      verified: true
    };
  }

  // Long Answer
  return {
    id,
    number: qNumber,
    sectionId,
    sectionTitle,
    questionType: 'Long Answer',
    question: 'Examine how Langston Hughes celebrates the harmony between human joy and the natural world in "In Time of Silver Rain". Refer to specific imagery and phrases from the poem.',
    answer: 'In "In Time of Silver Rain", Langston Hughes weaves a vibrant celebration of rebirth and vitality:\n1. Reawakening of Plant Life: The earth "puts forth new life again" as silver rain falls. The poet personifies flowers that "lift their heads" and trees that "put forth new leaves to sing in joy beneath the sky."\n2. Sensory Insect Imagery: Butterflies lift their "silken wings to catch a rainbow cry," a synesthetic image combining touch, color, and sound to convey pure exhilaration.\n3. Human Connection: The natural renewal inspires human happiness. Passing boys and girls walking down the road "go singing, too." Human song mirrors the joy of the blossoming earth.\nThrough these interconnected images, Hughes shows that rain restores life, hope, and beauty across all living beings.',
    acceptableAlternatives: [
      'An analytical response exploring the sensory imagery of rain, the personification of flora and fauna, and the final synthesis of children singing in rhythm with spring.'
    ],
    markingRubric: [
      '1.5 marks: Analysis of floral imagery (grasses growing, flowers lifting heads, trees singing).',
      '1.5 marks: Explanation of butterfly imagery and the phrase "silken wings".',
      '2.0 marks: Discussion of children singing down the roadway and the universal theme of renewal.'
    ],
    marks,
    chapter,
    difficulty: 'difficult',
    cognitiveLevel: 'Analyze',
    locked: false,
    verified: true
  };
}

// ============================================================================
// 1.4 THE KING'S CHOICE (Shankar - Folk Tale)
// ============================================================================
export function generateKingsChoiceQuestion(
  type: string,
  marks: number,
  sectionId: string,
  sectionTitle: string,
  qNumber: number,
  variantIndex: number,
  id: string
): GeneratedQuestion {
  const chapter = '1.4 The King’s Choice';

  if (type === 'MCQ') {
    const mcqs = [
      {
        q: 'Why did the lion king\'s courtiers (the vulture, fox, and leopard) suddenly flee in panic when the king was starving?',
        options: [
          'A. A ferocious army of hunters invaded the forest',
          'B. The lion took them at their word and agreed to eat them in the order they had volunteered',
          'C. A terrible desert sandstorm destroyed their shelter',
          'D. The camel attacked them with his powerful hooves'
        ],
        ans: 'B. The lion took them at their word and agreed to eat them in the order they had volunteered',
        alt: ['Option B: The lion accepted their offers and prepared to eat them in sequence'],
        rubric: [`${marks} marks for Option B.`],
        diff: 'moderate' as const,
        cog: 'Understand' as const
      },
      {
        q: 'What physical handicap prevented the lion king from hunting his own prey in the story?',
        options: [
          'A. His eyesight failed in the bright sun',
          'B. He burned his paws painfully on the scorching desert sand',
          'C. He was wounded by an arrow from a hunter',
          'D. He fell into a deep pit in the forest'
        ],
        ans: 'B. He burned his paws painfully on the scorching desert sand',
        alt: ['Option B: Burned his paws on hot desert sand'],
        rubric: [`${marks} marks for identifying burned paws on hot sand (Option B).`],
        diff: 'easy' as const,
        cog: 'Remember' as const
      }
    ];
    const item = mcqs[variantIndex % mcqs.length];
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'MCQ',
      question: item.q,
      options: item.options,
      answer: item.ans,
      acceptableAlternatives: item.alt,
      markingRubric: item.rubric,
      marks,
      chapter,
      difficulty: item.diff,
      cognitiveLevel: item.cog,
      locked: false,
      verified: true
    };
  }

  if (type === 'Fill in the Blanks') {
    const blanks = [
      {
        q: 'The moral of "The King\'s Choice" states: "To be king is good. But to be ______ is better."',
        ans: 'kind',
        alt: ['kind'],
        rubric: [`${marks} marks for the word "kind".`]
      },
      {
        q: 'The lion king appointed the fox as his adviser, the leopard as his bodyguard, and the vulture as his ______.',
        ans: 'messenger',
        alt: ['messenger'],
        rubric: [`${marks} marks for "messenger".`]
      }
    ];
    const item = blanks[variantIndex % blanks.length];
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Fill in the Blanks',
      question: item.q,
      answer: item.ans,
      acceptableAlternatives: item.alt,
      markingRubric: item.rubric,
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'True / False') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'True / False',
      question: 'The faithful camel offered himself to be eaten because he wanted to fool the lion and escape to his home desert.',
      answer: 'False',
      acceptableAlternatives: ['False: The innocent camel offered himself out of genuine loyalty and gratitude.'],
      markingRubric: [`${marks} marks for stating False with textual understanding.`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Understand',
      locked: false,
      verified: true
    };
  }

  if (type === 'Short Answer') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Short Answer',
      question: 'How did the lion king outsmart his hypocritical courtiers when they each pretended to offer themselves as food?',
      answer: 'When the vulture, fox, and leopard insincerely offered their bodies to the starving king, the lion king called their bluff by declaring: "You are all loyal subjects; I shall eat you in the order in which you offered yourselves!" Terrified that their deceit was exposed, the vulture flew away while the fox and leopard fled for their lives.',
      acceptableAlternatives: [
        'The lion agreed to eat them in the exact order they volunteered, which caused the cowardly courtiers to flee in panic.'
      ],
      markingRubric: [
        '1.5 marks: Explaining the lion\'s clever statement to eat them in order of volunteering.',
        '1.5 marks: Highlighting the immediate flight of the frightened, insincere courtiers.'
      ],
      marks,
      chapter,
      difficulty: 'moderate',
      cognitiveLevel: 'Analyze',
      locked: false,
      verified: true
    };
  }

  // Long Answer
  return {
    id,
    number: qNumber,
    sectionId,
    sectionTitle,
    questionType: 'Long Answer',
    question: 'Contrast the genuine devotion of the camel with the self-serving flattery of the courtiers in "The King\'s Choice". What fundamental lesson in leadership and loyalty does the fable impart?',
    answer: 'In "The King\'s Choice", Shankar draws a sharp distinction between sycophancy and authentic loyalty:\n1. Self-Serving Courtiers: The vulture, fox, and leopard attach themselves to the king solely to enjoy food without hunting. They incite the dangerous desert journey for camel meat, but abandon the wounded king when his paws burn. Later, they put on a deceptive show of self-sacrifice, falsely assuming the king will politely decline their offers.\n2. True Devotion of the Camel: In contrast, the camel harbors no cunning. Rescued from harsh desert labor and welcomed into the king\'s fold, he carries the injured monarch and courtiers safely home. When famine strikes, the naive camel genuinely offers his life out of honest gratitude.\n3. The King\'s Discernment: The lion displays true leadership by seeing through the courtiers\' deceit. By threatening to eat them in turn, he scatters the hypocrites and rewards the innocent camel with permanent friendship.\nLesson: Genuine leadership is grounded in kindness and moral discernment rather than blind power.',
    acceptableAlternatives: [
      'A thorough essay contrasting sycophancy and sincere devotion, tracing the desert expedition, the test of loyalty, and the final proverb "To be king is good. But to be kind is better."'
    ],
    markingRubric: [
      '1.5 marks: Detailed contrast between the courtiers\' false promises and the camel\'s sincere gratitude.',
      '1.5 marks: Description of the desert journey and the false sacrifice scene.',
      '2.0 marks: Interpretation of the lion\'s ethical realization that kindness surpasses mere royal power.'
    ],
    marks,
    chapter,
    difficulty: 'difficult',
    cognitiveLevel: 'Evaluate',
    locked: false,
    verified: true
  };
}

// ============================================================================
// 1.5 SEEING EYES HELPING HANDS (Informational / Communication)
// ============================================================================
export function generateSeeingEyesQuestion(
  type: string,
  marks: number,
  sectionId: string,
  sectionTitle: string,
  qNumber: number,
  variantIndex: number,
  id: string
): GeneratedQuestion {
  const chapter = '1.5 Seeing Eyes Helping Hands';

  if (type === 'MCQ') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'MCQ',
      question: 'Which of the following is an indispensable component of a formal printed invitation card as illustrated in "Seeing Eyes, Helping Hands"?',
      options: [
        'A. Clear mention of the Host, Occasion, Chief Guest, Date, Time, and Venue',
        'B. Casual slang and informal conversational greetings',
        'C. A handwritten diary entry about personal feelings',
        'D. A list of personal hobbies of the organizing committee'
      ],
      answer: 'A. Clear mention of the Host, Occasion, Chief Guest, Date, Time, and Venue',
      acceptableAlternatives: ['Option A: Host, Occasion, Chief Guest, Date, Time, Venue'],
      markingRubric: [`${marks} marks for Option A.`],
      marks,
      chapter,
      difficulty: 'moderate',
      cognitiveLevel: 'Understand',
      locked: false,
      verified: true
    };
  }

  if (type === 'Fill in the Blanks') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Fill in the Blanks',
      question: 'In "Seeing Eyes, Helping Hands", the social service project was inaugurated by Smt. Vimala Naik, President of ______ Samaj.',
      answer: 'Sahayak',
      acceptableAlternatives: ['Sahayak', 'Sahayak Samaj'],
      markingRubric: [`${marks} marks for "Sahayak".`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'True / False') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'True / False',
      question: 'A telephone call requesting news coverage from a newspaper editor requires the same informal casual tone used when speaking to family members.',
      answer: 'False',
      acceptableAlternatives: ['False: Professional telephone queries require formal politeness, clarity, and official etiquette.'],
      markingRubric: [`${marks} marks for False.`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Understand',
      locked: false,
      verified: true
    };
  }

  if (type === 'Short Answer') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Short Answer',
      question: 'State three essential guidelines that students must follow when drafting a formal school notice for an upcoming event.',
      answer: '1. The notice must clearly display the name of the institution and the heading "NOTICE".\n2. It must clearly state the exact date, time, venue, and purpose of the event.\n3. It must conclude with the name and designation of the issuing authority.',
      acceptableAlternatives: [
        'Clear heading, date/time/venue details, target audience instructions, and authorized signature.'
      ],
      markingRubric: [
        '1 mark: Heading and name of institution.',
        '1 mark: Specific details (date, time, venue, objective).',
        '1 mark: Authorized signature and designation.'
      ],
      marks,
      chapter,
      difficulty: 'moderate',
      cognitiveLevel: 'Apply',
      locked: false,
      verified: true
    };
  }

  // Long Answer / Practical Writing
  return {
    id,
    number: qNumber,
    sectionId,
    sectionTitle,
    questionType: 'Long Answer',
    question: 'Imagine you are the Head Girl or Head Boy of your school. Draft a formal Invitation Card inviting parents and teachers to the annual Social Service Exhibition "Hands of Hope". Follow the standard layout and include all necessary specifications (Day, Date, Time, Venue, Chief Guest, and RSVP).',
    answer: 'HANDS OF HOPE EXHIBITION\n\nThe Principal, Staff, and Students of\nMODERN PUBLIC SCHOOL, PUNE\nCordially invite you to the Inauguration of our Social Service Initiative\n"HANDS OF HOPE"\n\nChief Guest: Dr. Priya Kulkarni (Director, Child Welfare Board)\nPresided by: Shri S. R. Deshmukh (Chairman, Education Trust)\n\nDay & Date: Saturday, 18th October 2026\nTime: 10:00 AM to 1:00 PM\nVenue: School Auditorium, Main Campus\n\nRSVP:\nStudent Council\nPhone: 020-25678900\n(Please be seated by 9:45 AM)',
    acceptableAlternatives: [
      'A correctly formatted invitation card containing host name, event title, date/time/venue, chief guest, and RSVP.'
    ],
    markingRubric: [
      '1.5 marks: Proper layout, borders, and formal invitation conventions.',
      '1.5 marks: Accuracy of information (Date, Time, Venue, Chief Guest, RSVP).',
      '2.0 marks: Appropriate formal register, polite language, and flawless grammar.'
    ],
    marks,
    chapter,
    difficulty: 'difficult',
    cognitiveLevel: 'Create',
    locked: false,
    verified: true
  };
}

// ============================================================================
// 1.6 A COLLAGE (Biographical / Swami Vivekananda)
// ============================================================================
export function generateCollageQuestion(
  type: string,
  marks: number,
  sectionId: string,
  sectionTitle: string,
  qNumber: number,
  variantIndex: number,
  id: string
): GeneratedQuestion {
  const chapter = '1.6 A Collage';

  if (type === 'MCQ') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'MCQ',
      question: 'With which memorable opening words did Swami Vivekananda begin his historic 1893 address at Chicago, earning a standing ovation?',
      options: [
        'A. "Ladies and gentlemen of the world"',
        'B. "Sisters and brothers of America!"',
        'C. "Honoured delegates and citizens"',
        'D. "Friends and fellow believers"'
      ],
      answer: 'B. "Sisters and brothers of America!"',
      acceptableAlternatives: ['Option B: "Sisters and brothers of America!"'],
      markingRubric: [`${marks} marks for Option B.`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'Fill in the Blanks') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Fill in the Blanks',
      question: 'Swami Vivekananda\'s famous clarion call to youth is: "Arise! Awake! and stop not until the ______ is reached."',
      answer: 'goal',
      acceptableAlternatives: ['goal'],
      markingRubric: [`${marks} marks for "goal".`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'True / False') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'True / False',
      question: 'Swami Vivekananda believed that talking to oneself at least once a day is crucial to avoid missing a meeting with an excellent person.',
      answer: 'True',
      acceptableAlternatives: ['True: Text quotes Vivekananda on daily self-reflection.'],
      markingRubric: [`${marks} marks for True.`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'Short Answer') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Short Answer',
      question: 'Explain Swami Vivekananda\'s philosophy regarding how thoughts shape a person\'s destiny ("Whatever you think, that you will be").',
      answer: 'Swami Vivekananda emphasized that the human mind holds immense creative power. If a person constantly considers themselves weak, they manifest weakness; but if they cultivate conviction in their inner strength, they will accomplish greatness. True success comes from filling the brain with high ideals and acting upon them.',
      acceptableAlternatives: [
        'Thoughts determine character: thinking yourself weak makes you weak, while believing in your strength enables great achievements.'
      ],
      markingRubric: [
        '1.5 marks: Stating the effect of weak vs strong thoughts on human behavior.',
        '1.5 marks: Explaining the importance of high ideals and focused mental discipline.'
      ],
      marks,
      chapter,
      difficulty: 'moderate',
      cognitiveLevel: 'Understand',
      locked: false,
      verified: true
    };
  }

  // Long Answer
  return {
    id,
    number: qNumber,
    sectionId,
    sectionTitle,
    questionType: 'Long Answer',
    question: 'How did Swami Vivekananda inspire youth to achieve extraordinary goals? Elaborate on his teachings on single-minded focus, self-confidence, and service to humanity.',
    answer: 'In the lesson "A Collage", Swami Vivekananda\'s core teachings provide an inspirational roadmap for youth:\n1. Single-Minded Focus: He urged individuals to "Take up one idea. Make that one idea your life—think of it, dream of it, live on that idea. Let the brain, muscles, nerves, every part of your body, be full of that idea, and leave every other idea alone. This is the way to success."\n2. Fearlessness and Self-Belief: He insisted that self-confidence is the cornerstone of achievement. "Arise! Awake! and stop not until the goal is reached." He warned that self-doubt paralyzes human potential, whereas high thoughts awaken inner courage.\n3. Daily Introspection: He advocated daily self-communion ("Talk to yourself at least once in a day... Otherwise you may miss a meeting with an excellent person in the world").\n4. Universal Brotherhood: His speech at the World Parliament in Chicago proved that true spiritual strength lies in universal love, tolerance, and service to mankind.',
    acceptableAlternatives: [
      'A structured essay covering single-minded dedication to an idea, fearlessness ("Arise, awake"), daily self-reflection, and his historic Chicago speech promoting brotherhood.'
    ],
    markingRubric: [
      '1.5 marks: Explaining the philosophy of dedicating body and mind to one great idea.',
      '1.5 marks: Analyzing the call to action ("Arise! Awake!") and self-belief.',
      '2.0 marks: Citing the Chicago address and connecting personal strength to societal service.'
    ],
    marks,
    chapter,
    difficulty: 'difficult',
    cognitiveLevel: 'Evaluate',
    locked: false,
    verified: true
  };
}

// ============================================================================
// 2.1 FROM A RAILWAY CARRIAGE (R. L. Stevenson - Poem)
// ============================================================================
export function generateRailwayCarriageQuestion(
  type: string,
  marks: number,
  sectionId: string,
  sectionTitle: string,
  qNumber: number,
  variantIndex: number,
  id: string
): GeneratedQuestion {
  const chapter = '2.1 From a Railway Carriage';

  if (type === 'MCQ') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'MCQ',
      question: 'To what does Robert Louis Stevenson compare the charging motion of the train across the meadows in "From a Railway Carriage"?',
      options: [
        'A. Fairies dancing upon green hilltops',
        'B. Troops charging in a battle',
        'C. A slow boat floating down a tranquil river',
        'D. Birds soaring through a cloudy sky'
      ],
      answer: 'B. Troops charging in a battle',
      acceptableAlternatives: ['Option B: Troops in a battle ("charging along like troops in a battle")'],
      markingRubric: [`${marks} marks for Option B.`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'Fill in the Blanks') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Fill in the Blanks',
      question: 'In "From a Railway Carriage", the poignant final line reminds us of the speed of travel: "Each a ______ and gone for ever!"',
      answer: 'glimpse',
      acceptableAlternatives: ['glimpse'],
      markingRubric: [`${marks} marks for "glimpse".`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'True / False') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'True / False',
      question: 'The child seen from the carriage is climbing trees with friends to pick apples.',
      answer: 'False',
      acceptableAlternatives: ['False: The child clambers and scrambles all by himself gathering brambles.'],
      markingRubric: [`${marks} marks for False.`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'Short Answer') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Short Answer',
      question: 'Mention three distinct fleeting sights observed by the poet through the window of the moving railway carriage.',
      answer: '1. A child clambering and scrambling alone to gather wild brambles.\n2. A tramp who stands and gazes at the passing train.\n3. A cart running away on the road, lumping along with man and load (or a mill and a river).',
      acceptableAlternatives: [
        'Bramble-gathering child, gazing tramp, roadside cart with load, painted stations, mill, or river.'
      ],
      markingRubric: [
        '1 mark each for correctly identifying three textual sights seen from the train.'
      ],
      marks,
      chapter,
      difficulty: 'moderate',
      cognitiveLevel: 'Understand',
      locked: false,
      verified: true
    };
  }

  // Long Answer
  return {
    id,
    number: qNumber,
    sectionId,
    sectionTitle,
    questionType: 'Long Answer',
    question: 'How does Robert Louis Stevenson recreate the sensation of incredible speed through rhythm, sound patterns, and similes in "From a Railway Carriage"?',
    answer: 'In "From a Railway Carriage", R. L. Stevenson masterfully mirrors the physical tempo of a steam train:\n1. Rapid Rhyme and Cadence: The driving rhythm matches the rhythmic clatter of the train on iron rails. Couplets like "witches/ditches", "cattle/battle", and "plain/rain" create a breathless, accelerating tempo.\n2. Powerful Similes: The train charges forward "like troops in a battle," emphasizing unstoppable momentum. The landscape flies past "as thick as driving rain," suggesting how rapidly images blur together.\n3. Transience of Sights: The poet captures snapshots of rural life—bridges, houses, meadows, a solitary child gathering brambles, a motionless tramp, and a heavily laden cart. Each sight is instantaneous: "ever again, in the wink of an eye, painted stations whistle by."\n4. Conclusion: The famous final line, "Each a glimpse and gone for ever!" encapsulates the bittersweet transience of modern motion.',
    acceptableAlternatives: [
      'A poetic analysis discussing the galloping meter mimicking train wheels, the battle and rain similes, the fleeting catalogue of rural vignettes, and the concluding reflection on impermanence.'
    ],
    markingRubric: [
      '1.5 marks: Examination of galloping rhythm, rhyme scheme, and mechanical cadence.',
      '1.5 marks: Detailed analysis of the similes ("troops in a battle", "driving rain").',
      '2.0 marks: Discussion of fleeting imagery (child, tramp, cart, mill) culminating in "Each a glimpse and gone for ever!"'
    ],
    marks,
    chapter,
    difficulty: 'difficult',
    cognitiveLevel: 'Evaluate',
    locked: false,
    verified: true
  };
}

// ============================================================================
// 2.2 THE SOUVENIR (Lakshman Londhe - Sci-Fi Story)
// ============================================================================
export function generateSouvenirQuestion(
  type: string,
  marks: number,
  sectionId: string,
  sectionTitle: string,
  qNumber: number,
  variantIndex: number,
  id: string
): GeneratedQuestion {
  const chapter = '2.2 The Souvenir';

  if (type === 'MCQ') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'MCQ',
      question: 'Why did the red stone earrings bought by Sayali on the Moon feel unbearably heavy when her mother wore them on Earth?',
      options: [
        'A. The seller had secretly coated the earrings in lead',
        'B. Gravitational force on Earth is six times stronger than on the Moon',
        'C. Atmospheric pressure on Earth caused the stones to expand',
        'D. Sayali\'s mother was unaccustomed to wearing jewelry'
      ],
      answer: 'B. Gravitational force on Earth is six times stronger than on the Moon',
      acceptableAlternatives: ['Option B: Gravity on Earth is 6 times greater than the Moon\'s 1/6th gravity'],
      markingRubric: [`${marks} marks for Option B.`],
      marks,
      chapter,
      difficulty: 'moderate',
      cognitiveLevel: 'Apply',
      locked: false,
      verified: true
    };
  }

  if (type === 'Fill in the Blanks') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Fill in the Blanks',
      question: 'At Neil Armstrong Base, the famous inscribed words of the first moon landing read: "One small step for a man, one giant ______ of mankind."',
      answer: 'leap',
      acceptableAlternatives: ['leap'],
      markingRubric: [`${marks} marks for "leap".`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'True / False') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'True / False',
      question: 'Students visiting Neil Armstrong Base were permitted to purchase souvenirs from unauthorized vendors outside the dome settlements.',
      answer: 'False',
      acceptableAlternatives: ['False: Students were strictly instructed to purchase souvenirs only from authorized shops inside the dome.'],
      markingRubric: [`${marks} marks for False.`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'Short Answer') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Short Answer',
      question: 'Describe two unusual physical phenomena or spectacles that Sayali experienced during her trip to the Moon.',
      answer: '1. Lower Gravity: The Moon\'s gravity is only one-sixth of Earth\'s, allowing an acrobat in the Moon circus to leap 27 meters high.\n2. Visual Splendor: From the Moon, the Earth looked 70 times brighter and 13 times bigger, shining brilliantly against a pitch-black sky.',
      acceptableAlternatives: [
        '1/6th gravity causing high leaps, Earth looking 70 times brighter, or the sharp difference between pressurized domes and outside vacuum.'
      ],
      markingRubric: [
        '1.5 marks: Explaining the 1/6th gravity and circus leap.',
        '1.5 marks: Describing the appearance of the Earth or lunar day-night cycles.'
      ],
      marks,
      chapter,
      difficulty: 'moderate',
      cognitiveLevel: 'Understand',
      locked: false,
      verified: true
    };
  }

  // Long Answer
  return {
    id,
    number: qNumber,
    sectionId,
    sectionTitle,
    questionType: 'Long Answer',
    question: 'Narrate Sayali\'s moon expedition in "The Souvenir". How does her excitement lead to an unforeseen mistake regarding the souvenir earrings, and what scientific lesson does it teach?',
    answer: 'In Lakshman Londhe\'s science-fiction story "The Souvenir", Sayali journeys on a school space shuttle to Neil Armstrong Base on the Moon:\n1. The Lunar Experience: Sayali is spellbound by the celestial view—Earth shining 70 times brighter in the black sky. At the lunar settlement, she witnesses an acrobat leaping 27 meters due to the 1/6th gravity, and visits Armstrong\'s historic first footprint.\n2. Disregarding Instructions: The base receptionist strictly warns students to purchase souvenirs only from authorized shops inside the dome. However, captivated by a pair of sparkling red stone earrings, Sayali buys them from an unauthorized roadside vendor outside the settlement for 1,000 rupees.\n3. The Shock on Earth: Excited to present the gift to her mother upon returning to Earth, Sayali is horrified when her mother tries them on—they are agonizingly heavy and pull her earlobes painfully!\n4. Scientific Realization: Sayali had forgotten that in lunar gravity, objects weigh only 1/6th of their Earth weight. On Earth, the earrings weighed six times as much, rendering them unwearable. The story amusingly underscores that physics principles cannot be ignored when traveling between worlds.',
    acceptableAlternatives: [
      'A narrative recounting Sayali\'s moon journey, the circus and Armstrong base, the unauthorized purchase, and the heavy consequence on Earth due to 6x gravity.'
    ],
    markingRubric: [
      '1.5 marks: Account of the moon journey, sights, and reception warnings.',
      '1.5 marks: Description of the unauthorized souvenir transaction.',
      '2.0 marks: Scientific explanation of gravitational difference (1/6 vs 1) and its amusing outcome.'
    ],
    marks,
    chapter,
    difficulty: 'difficult',
    cognitiveLevel: 'Evaluate',
    locked: false,
    verified: true
  };
}

// ============================================================================
// 2.3 ABDUL BECOMES A COURTIER (Pratibha Nath - Play / Story)
// ============================================================================
export function generateAbdulQuestion(
  type: string,
  marks: number,
  sectionId: string,
  sectionTitle: string,
  qNumber: number,
  variantIndex: number,
  id: string
): GeneratedQuestion {
  const chapter = '2.3 Abdul Becomes a Courtier';

  if (type === 'MCQ') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'MCQ',
      question: 'How did Abdul keep the royal hens "in the pink of health" while spending absolutely zero money from the imperial treasury?',
      options: [
        'A. He let the hens forage freely in neighboring public gardens',
        'B. He fed them nutritious scraps, waste food, and shells collected from the royal kitchens',
        'C. He borrowed grain from wealthy merchants on credit',
        'D. He reduced their meals to once every two days'
      ],
      answer: 'B. He fed them nutritious scraps, waste food, and shells collected from the royal kitchens',
      acceptableAlternatives: ['Option B: Fed them kitchen waste scraps and shells at zero expense'],
      markingRubric: [`${marks} marks for Option B.`],
      marks,
      chapter,
      difficulty: 'moderate',
      cognitiveLevel: 'Understand',
      locked: false,
      verified: true
    };
  }

  if (type === 'Fill in the Blanks') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Fill in the Blanks',
      question: 'In charge of the Royal Library, Abdul repurposed discarded ______ envelopes to create luxurious covers for royal manuscripts.',
      answer: 'silk',
      acceptableAlternatives: ['silk', 'velvet', 'brocade', 'petition'],
      markingRubric: [`${marks} marks for "silk".`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'True / False') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'True / False',
      question: 'Abdul protested bitterly when Emperor Akbar initially assigned him the humble job of poultry keeper.',
      answer: 'False',
      acceptableAlternatives: ['False: Abdul accepted the humble role cheerfully and executed it with brilliance.'],
      markingRubric: [`${marks} marks for False.`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Understand',
      locked: false,
      verified: true
    };
  }

  if (type === 'Short Answer') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Short Answer',
      question: 'How did Abdul obtain an education despite his father being unable to afford expensive books and manuscripts?',
      answer: 'Abdul offered to work for a wealthy merchant without wages on one sole condition: that he be allowed to read the books in the merchant\'s shop. By dedicating every spare moment to reading, he mastered philosophy, astronomy, Arabic, and Persian.',
      acceptableAlternatives: [
        'Abdul worked unpaid at a merchant\'s bookshop in exchange for the privilege of reading the shop\'s manuscripts.'
      ],
      markingRubric: [
        '1.5 marks: Stating his agreement to work without wages for a book merchant.',
        '1.5 marks: Mentioning his passionate reading of philosophy, astronomy, and languages.'
      ],
      marks,
      chapter,
      difficulty: 'moderate',
      cognitiveLevel: 'Understand',
      locked: false,
      verified: true
    };
  }

  // Long Answer
  return {
    id,
    number: qNumber,
    sectionId,
    sectionTitle,
    questionType: 'Long Answer',
    question: '"No work is insignificant when approached with ingenuity and dedication." Demonstrate how Abdul exemplifies this truth through his management of the Royal Poultry and the Royal Library.',
    answer: 'In Pratibha Nath\'s play "Abdul Becomes a Courtier", young Abdul proves that intellect and dedication can transform any humble duty into a triumph:\n1. The Royal Poultry (Murgikhana): Appointed to tend hens—a job many would consider beneath a scholar—Abdul does not complain. Instead, he observes kitchen waste, collecting discarded scraps and vegetable peels to nourish the fowls. He maintains the flock in "the pink of health" while spending zero royal funds, leaving the Emperor astonished.\n2. The Royal Library: Next appointed library keeper, Abdul finds books with faded covers. Rather than demanding expensive funds for binding, he collects the lavish silk, velvet, and brocade petition bags that arrived from noblemen and were usually thrown away. He engages the royal tailors to stitch exquisite jackets for every volume at no additional cost.\n3. Emperor Akbar\'s Recognition: Akbar realizes that Abdul possesses rare sagacity, integrity, and resourcefulness. Declaring "You have great merit," Akbar elevates Abdul to the coveted rank of royal courtier.\nAbdul proves that genuine competence shines through diligence, regardless of how modest the initial assignment may be.',
    acceptableAlternatives: [
      'A comprehensive character study analyzing Abdul\'s resourcefulness in feeding poultry with kitchen scraps at zero cost, re-binding library manuscripts with discarded silk petition bags, and winning Akbar\'s admiration.'
    ],
    markingRubric: [
      '1.5 marks: Explaining his ingenious management of the poultry at zero cost.',
      '1.5 marks: Explaining his recycling of silk petition bags for library books.',
      '2.0 marks: Analyzing Emperor Akbar\'s recognition and the central theme that dedication elevates any post.'
    ],
    marks,
    chapter,
    difficulty: 'difficult',
    cognitiveLevel: 'Evaluate',
    locked: false,
    verified: true
  };
}

// ============================================================================
// 2.4 HOW DOTH THE LITTLE BUSY BEE (Isaac Watts & Lewis Carroll - Parody)
// ============================================================================
export function generateBusyBeeQuestion(
  type: string,
  marks: number,
  sectionId: string,
  sectionTitle: string,
  qNumber: number,
  variantIndex: number,
  id: string
): GeneratedQuestion {
  const chapter = '2.4 How doth the little busy bee';

  if (type === 'MCQ') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'MCQ',
      question: 'In Lewis Carroll\'s famous parody "How doth the little crocodile", why does the crocodile cheerfully grin and neatly spread his claws?',
      options: [
        'A. To playfully entertain human visitors along the Nile',
        'B. To deceptively welcome little fishes into his gently smiling jaws',
        'C. To warm himself on the riverbank after swimming',
        'D. To catch falling rain droplets from the sky'
      ],
      answer: 'B. To deceptively welcome little fishes into his gently smiling jaws',
      acceptableAlternatives: ['Option B: To welcome little fishes into smiling jaws (preying upon them)'],
      markingRubric: [`${marks} marks for Option B.`],
      marks,
      chapter,
      difficulty: 'moderate',
      cognitiveLevel: 'Understand',
      locked: false,
      verified: true
    };
  }

  if (type === 'Fill in the Blanks') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Fill in the Blanks',
      question: 'In Isaac Watts\' original moral poem, the busy bee gathers ______ all the day from every opening flower.',
      answer: 'honey',
      acceptableAlternatives: ['honey'],
      markingRubric: [`${marks} marks for "honey".`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'True / False') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'True / False',
      question: 'A parody is a humorous imitation of a well-known serious poem or literary work.',
      answer: 'True',
      acceptableAlternatives: ['True: A parody playfully mimics the style and meter of an original poem.'],
      markingRubric: [`${marks} marks for True.`],
      marks,
      chapter,
      difficulty: 'easy',
      cognitiveLevel: 'Remember',
      locked: false,
      verified: true
    };
  }

  if (type === 'Short Answer') {
    return {
      id,
      number: qNumber,
      sectionId,
      sectionTitle,
      questionType: 'Short Answer',
      question: 'Contrast the industrious character of the Bee in Isaac Watts\' poem with the deceitful character of the Crocodile in Lewis Carroll\'s parody.',
      answer: 'Isaac Watts presents the bee as an emblem of honest industry, skillful craftsmanship, and selfless toil as it gathers honey from flowers to feed the hive. In contrast, Lewis Carroll parodies this virtue by portraying the crocodile as a cunning predator who uses a cheerful grin and shiny scales to lure naive little fishes to their doom.',
      acceptableAlternatives: [
        'The bee is hardworking and produces sweet food, while the crocodile is lazy, deceitful, and pretends to smile only to devour innocent fish.'
      ],
      markingRubric: [
        '1.5 marks: Explaining the bee\'s constructive hard work and honey collection.',
        '1.5 marks: Explaining the crocodile\'s deceitful grin and predatory intentions.'
      ],
      marks,
      chapter,
      difficulty: 'moderate',
      cognitiveLevel: 'Analyze',
      locked: false,
      verified: true
    };
  }

  // Long Answer
  return {
    id,
    number: qNumber,
    sectionId,
    sectionTitle,
    questionType: 'Long Answer',
    question: 'Analyze how Lewis Carroll parodies Isaac Watts\' moralistic verse "How doth the little busy bee". Compare the structure, imagery, and underlying tone of both poems.',
    answer: 'In Chapter 2.4, Lewis Carroll creates an iconic parody of Isaac Watts\' moral didactic poem:\n1. Structural Parallelism: Carroll matches Watts\' meter (iambic tetrameter alternating with trimeter) and rhyme scheme (ABAB). Watts opens: "How doth the little busy bee / Improve each shining hour"; Carroll mimics: "How doth the little crocodile / Improve his shining tail."\n2. Subversion of Moral Tone: Watts\' Victorian poem seeks to inculcate virtue, diligence, and avoidance of idle mischief. Carroll subverts this solemn moralizing into satirical humor.\n3. Contrast of Imagery: Whereas the bee labors over wax, cells, and sweet food to sustain life, the crocodile pours the muddy waters of the Nile over his golden scales, spreads sharp claws, and wears a hypocritical smile to devour unsuspecting fish.\nCarroll demonstrates that parody achieves its humorous bite by borrowing the solemn musicality of a classic text while replacing its piety with playful subversion.',
    acceptableAlternatives: [
      'A comparative essay demonstrating how Carroll matches the verse rhythm of Watts while flipping a sermon on hard work into a dark, comical portrait of a predatory crocodile.'
    ],
    markingRubric: [
      '1.5 marks: Analysis of structural and verbal parallels in the opening lines.',
      '1.5 marks: Contrast between the bee\'s industrious virtue and the crocodile\'s deceitful predation.',
      '2.0 marks: Insightful commentary on parody as a literary device that subverts didactic moralizing.'
    ],
    marks,
    chapter,
    difficulty: 'difficult',
    cognitiveLevel: 'Evaluate',
    locked: false,
    verified: true
  };
}
