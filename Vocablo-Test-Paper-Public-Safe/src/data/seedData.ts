import { Book, Chapter, PaperPattern, School } from '../types';

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'school-1',
    name: 'Demo International School',
    tagline: 'Excellence in Knowledge & Character',
    address: '123 Demo Campus, Bengaluru, Karnataka 560000',
    phone: '+91 00 0000 0000',
    email: 'academics@example.edu',
    website: 'www.example.edu',
    headerStyle: 'classic',
    defaultInstructions: [
      'All questions are compulsory.',
      'Write your Name, Roll Number, and Date clearly on top of the answer sheet.',
      'Marks for each question are indicated against it.',
      'Read each question carefully before attempting.',
      'Maintain neat handwriting and clean presentation.'
    ]
  },
  {
    id: 'school-2',
    name: "Demo Model Academy",
    tagline: 'Faith and Knowledge for a Brighter Tomorrow',
    address: '14 Example Road, Pune, Maharashtra 411000',
    phone: '+91 00 0000 0001',
    email: 'office@example.edu',
    website: 'www.example.edu',
    headerStyle: 'formal',
    defaultInstructions: [
      'Attempt all questions within the prescribed duration.',
      'Write answers legibly and avoid overwriting.',
      'Verify question numbers matching the paper.'
    ]
  },
  {
    id: 'school-3',
    name: 'Demo Public Educational Trust',
    tagline: 'Service Before Self',
    address: 'Sector 12, Demo District, New Delhi 110000',
    phone: '+91 00 0000 0002',
    email: 'examcell@example.edu',
    website: 'www.example.edu',
    headerStyle: 'modern',
    defaultInstructions: [
      'Write answers to the point.',
      'Draw margins on your answer sheet.',
      'Double-check all calculations and grammar.'
    ]
  }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-balbharati-eng-7',
    title: 'English Balbharati Standard Seven',
    grade: '7',
    subject: 'English',
    board: 'Maharashtra State Board',
    academicYear: '2026-27',
    description: 'Prescribed English textbook by Maharashtra State Bureau of Textbook Production and Curriculum Research, Pune.',
    chaptersCount: 25
  }
];

export const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: 'chap-bb-7-1',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 1,
    title: '1.1 Past, Present, Future',
    type: 'Poem',
    contentSummary: 'A lyrical dialogue between a poet and a smiling child exploring what the past, present, and future feel like through nature imagery.',
    fullTextOrExcerpts: `Tell me, tell me, smiling child,
What the past is like to thee?
'An Autumn evening soft and mild
With a wind that sighs mournfully.'
Tell me, what is the present hour?
'A green and flowery spray
Where a young bird sits gathering its power
To mount and fly away.'
And what is the future, happy one?
'A sea beneath a cloudless sun;
A mighty, glorious, dazzling sea
Stretching into infinity.'
- Emily Brontë`,
    vocabulary: ['thee', 'mournfully', 'spray', 'mighty', 'cloudless', 'infinity'],
    concepts: ['Poetic imagery of time', 'Metaphor vs Simile', 'Childhood optimism for the future'],
    learningOutcomes: ['Identify metaphors in poetry', 'Interpret figurative representation of time', 'Appreciate rhythm and intonation'],
    importantFacts: ['Written by 19th-century author Emily Brontë', 'Past is compared to an autumn evening with a mournful wind', 'Present is compared to a green spray with a young bird gathering strength', 'Future is compared to a dazzling sea stretching into infinity'],
    importantCharacters: ['The Poet', 'The Smiling Child'],
    grammarConcepts: ['Metaphor', 'Simile', 'Adjectives describing nature']
  },
  {
    id: 'chap-bb-7-2',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 2,
    title: '1.2 Odd One In',
    type: 'Story',
    contentSummary: 'A story addressing snobbery and empathy. Rima and her clique mock new student Malti for her oily hair and accent, but Malti proves herself through mathematical brilliance and singing.',
    fullTextOrExcerpts: `“How was the first day of school?” asked Mother as Rima sat down for dinner. “Only one new girl - Malti - and she is funny,” grimaced Rima. “She can’t speak much English. Oily hair, bindi and all. ‘Gud marning, Teeechurr,’” mimicked Rima.
As the term progressed, it was abundantly clear that Malti was a bright child. Her forte was mathematics. Slowly, girls began seeking her help in maths. At the Inter-House singing competition, Malti sang a Hindi song with a melodious, well-trained voice and won first prize.
One day Malti asked Rima humbly, “I know my English is weak. Yours is good. Please, will you help me to improve it?” Rima snapped snidely, “Speaking proper English isn’t easy for you countrified types!” Malti burst into tears and ran off. Her own friends Shahnaz, Neha, and Clare turned against Rima, calling her behaviour horrid. Rima walked off in a huff, secretly ashamed of her snobbery.
- Tithi Tavora`,
    vocabulary: ['settling in', 'sniffed', 'insufferable', 'recounted', 'atrocious', 'snidely', 'jeer', 'forte', 'belied', 'befriended', 'clique', 'roundly'],
    concepts: ['Overcoming prejudice and snobbery', 'Recognizing internal character over appearance', 'Proper vs common nouns'],
    learningOutcomes: ['Distinguish between proper and common nouns', 'Analyze character transformation and peer pressure', 'Formulate reflective answers on inclusivity'],
    importantFacts: ['Malti came from another state and spoke English with an accent', 'Malti won the first prize in the Hindi song category', 'Malti’s forte was mathematics', 'Rima was an only child whose father warned her against becoming a snob'],
    importantCharacters: ['Malti', 'Rima', 'Mr. and Mrs. Sen', 'Shahnaz', 'Neha', 'Clare'],
    grammarConcepts: ['Proper nouns', 'Common nouns', 'Adverbs ending in -ly']
  },
  {
    id: 'chap-bb-7-3',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 3,
    title: '1.3 In Time of Silver Rain',
    type: 'Poem',
    contentSummary: 'A celebratory poem describing how refreshing silver rain awakens life on earth, sprouting green grasses, opening flowers, and bringing joy to children.',
    fullTextOrExcerpts: `In time of silver rain
The earth
Puts forth new life again,
Green grasses grow
And flowers lift their heads,
And over all the plain
The wonder spreads.
Of life, Of life, Of life!
In time of silver rain
The butterflies
Lift silken wings
To catch a rainbow cry,
And trees put forth
New leaves to sing
In joy beneath the sky
As down the roadway
Passing boys and girls
Go singing, too,
In time of silver rain
When spring
And life
Are new.
- Langston Hughes`,
    vocabulary: ['silver rain', 'silken wings', 'rainbow cry', 'wonder', 'plain', 'roadway'],
    concepts: ['Renewal of nature through rain', 'Alliteration as a poetic device', 'Spring and vitality'],
    learningOutcomes: ['Identify alliteration in poetry', 'Recognize rhythm and imagery in natural verse', 'Describe seasonal changes and monsoon impact'],
    importantFacts: ['Written by celebrated American writer and activist Langston Hughes', 'Rain is described as "silver rain"', 'Butterflies lift silken wings to catch a rainbow cry'],
    grammarConcepts: ['Alliteration', 'Rhyming pairs', 'Poetic word rearrangement']
  },
  {
    id: 'chap-bb-7-4',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 4,
    title: '1.4 The King’s Choice',
    type: 'Story',
    contentSummary: 'A folk tale of a lion king whose sly courtiers (fox, leopard, vulture) attempt to betray an innocent camel, but the lion shows true nobility and kindness.',
    fullTextOrExcerpts: `A lion king appointed the fox as adviser, leopard as bodyguard, and vulture as messenger. The vulture suggested trying camel meat from a distant desert. The party ventured into the scorching desert where the lion burned his paws on hot sand. Unable to walk, they were rescued when the clever fox found a camel carrying goods and invited him to court. The camel carried the lion and courtiers home.
Later, when the lion was hungry and unable to hunt, the courtiers pretended to sacrifice themselves: first the vulture, then the fox, then the leopard offered to be eaten. The naive camel did the same. The lion announced: “You are all loyal subjects; I shall eat you in the order in which you offered yourselves!” The vulture flew away, the fox and leopard fled, and the lion made the camel his lifelong companion.
‘To be king is good. But to be kind is better.’
- Shankar (Folk Tales Retold)`,
    vocabulary: ['courtier', 'adviser', 'bodyguard', 'messenger', 'oath of loyalty', 'lone', 'scorching', 'retinue', 'noble'],
    concepts: ['Selfless loyalty versus sycophancy', 'True leadership rooted in kindness', 'Countable vs uncountable nouns'],
    learningOutcomes: ['Distinguish countable and uncountable nouns', 'Understand character sketches in fables', 'Recognize moral values in governance'],
    importantFacts: ['The lion burned his paws on hot desert sand', 'The camel was carrying goods across the desert before joining the king', 'Moral: To be king is good, but to be kind is better'],
    importantCharacters: ['The Lion King', 'The Clever Fox', 'The Swift Leopard', 'The Far-flying Vulture', 'The Faithful Camel'],
    grammarConcepts: ['Countable nouns', 'Uncountable nouns', 'Units of measurement']
  },
  {
    id: 'chap-bb-7-5',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 5,
    title: '1.5 Seeing Eyes Helping Hands',
    type: 'Informational',
    contentSummary: 'Teaching authentic practical communication formats through New Vision High School’s social service project ‘Seeing Eyes, Helping Hands’ (S.E.H.H.).',
    fullTextOrExcerpts: `New Vision High School scheduled the inauguration of the project ‘Seeing Eyes, Helping Hands’.
Format A: A Formal Invitation card issued by Principal Suhasini Ambekar, inviting guests to the inauguration at the hands of Smt. Vimala Naik (President, Sahayak Samaj), presided over by Dr. A. M. Chaudhary (Dean, New Life Medical College), at the Assembly Hall, Sunday 9 July 2017.
Format B: A Written Notice posted on the school board for Std VII students and parents.
Format C: An oral telephone conversation between teacher Mr. Vishwas Ajinkya and news editor Mr. Shashank of Girgaon Times requesting press coverage.
Format D: An informal oral conversation between student Sameer and his mother.`,
    vocabulary: ['solicit', 'inauguration', 'preside', 'venue', 'convener', 'specimens', 'oral invitation', 'written notice'],
    concepts: ['Official vs informal communication', 'Key elements of formal invitation: who, what, when, where', 'Telephone etiquette'],
    learningOutcomes: ['Draft formal invitation cards and school notices', 'Conduct professional telephone queries', 'Identify essential components of written public announcements'],
    importantFacts: ['Project name: Seeing Eyes, Helping Hands', 'School: New Vision High School, Girgaon', 'Inaugurated by Smt. Vimala Naik; Presided by Dr. A. M. Chaudhary'],
    grammarConcepts: ['Invitation card conventions', 'Notice format', 'Reporting conversation']
  },
  {
    id: 'chap-bb-7-6',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 6,
    title: '1.6 A Collage',
    type: 'Informational',
    contentSummary: 'A biographical study and inspiring quote collage on Swami Vivekananda, his historic address at Chicago, and his philosophies on youth power and service.',
    fullTextOrExcerpts: `Swami Vivekananda, born Narendra Datta, was a great personality who made the world aware of the greatness of Indian philosophy. At the Parliament of World's Religions, he began his speech with “Sisters and brothers of America!” and received a two-minute standing ovation.
Key Teachings:
1. “Arise! Awake! and stop not until the goal is reached.”
2. “Fill the brain with high thoughts, highest ideals. Place them day and night before you and out of that will come great work.”
3. “Take up one idea. Make that one idea your life - think of it, dream of it, live on that idea. Let the brain, muscles, nerves, every part of your body, be full of that idea, and just leave every other idea alone. This is the way to success.”
4. “Whatever you think, that you will be. If you think yourself weak, weak you will be; if you think yourself strong, strong you will be.”
5. “Talk to yourself at least once in a day... Otherwise you may miss a meeting with an excellent person in the world.”`,
    vocabulary: ['philosophy', 'standing ovation', 'selflessness', 'ideals', 'patriotic saint', 'collage'],
    concepts: ['Self-confidence and focused dedication', 'Service to mankind', 'Creating research collages'],
    learningOutcomes: ['Interpret philosophical maxims', 'Prepare a thematic collage with captions and quotes', 'Summarize key biographical achievements'],
    importantFacts: ['Swami Vivekananda’s childhood name was Narendra Datta', 'Speech was delivered at the Parliament of World’s Religions in Chicago in 1893', 'Emphasized service to mankind and mental strength'],
    importantCharacters: ['Swami Vivekananda (Narendra Datta)'],
    grammarConcepts: ['Imperative statements', 'Inspirational quotes', 'Caption writing']
  },
  {
    id: 'chap-bb-7-7',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 7,
    title: '2.1 From a Railway Carriage',
    type: 'Poem',
    contentSummary: 'Robert Louis Stevenson captures the swift speed and rhythmic sensation of traveling in a steam train through the countryside.',
    fullTextOrExcerpts: `FASTER than fairies, faster than witches,
Bridges and houses, hedges and ditches;
And charging along like troops in a battle,
All through the meadows, the horses and cattle;
All of the sights of the hill and the plain
Fly as thick as driving rain;
And ever again, in the wink of an eye,
Painted stations whistle by.
Here is a child who clambers and scrambles,
All by himself and gathering brambles;
Here is a tramp who stands and gazes;
And there is the green for stringing the daisies!
Here is a cart run away in the road
Lumping along with man and load;
And here is a mill and there is a river.
Each a glimpse and gone for ever!
- R. L. Stevenson`,
    vocabulary: ['ditches', 'hedges', 'clambers', 'scrambles', 'brambles', 'tramp', 'lumping', 'glimpse'],
    concepts: ['Rapid sensory observations in motion', 'Similes of movement', 'Poetic rhythm matching mechanical cadence'],
    learningOutcomes: ['Identify rhythm and rapid pace in poetry', 'Point out visual similes', 'Contrast fleeting glimpses with permanent fixtures'],
    importantFacts: ['Written by Robert Louis Stevenson', 'Train speed is compared to charging troops in battle and driving rain', 'Objects seen include cattle, bramble-gathering child, tramp, roadside cart, mill, river'],
    grammarConcepts: ['Similes using like and as', 'Rhyming scheme AABB', 'Phrasal clauses with Here and There']
  },
  {
    id: 'chap-bb-7-8',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 8,
    title: '2.2 The Souvenir',
    type: 'Story',
    contentSummary: 'Sayali visits the moon on an educational trip to Neil Armstrong base. She experiences 1/6 gravity and buys red stone earrings as a souvenir, forgetting that on Earth they will weigh six times as much.',
    fullTextOrExcerpts: `Sayali sat gazing out the space shuttle window at the dazzling view of Earth looking 70 times brighter against jet black sky. The shuttle landed safely at Neil Armstrong Base on the moon.
The receptionist gave crucial warnings: gravity on the moon is only 1/6th of Earth. Inside dome settlements, artificial gravity is kept, but outside, moon gravity operates. She also warned students to buy souvenirs only from authorized shops inside the dome settlements.
During their 3-day stay, children saw a moon circus where a gymnast jumped 27 metres high, and visited the historical site of Neil Armstrong’s first preserved footprint and statue inscribed: ‘One small step for a man, one giant leap of mankind.’
Outside the dome, Sayali ignored instructions and bought cheap red stone earrings from an unauthorized roadside salesman for 1,000 rupees. Back on Earth, when her mother tried them on, they were agonizingly heavy—Sayali realized she had bought them in the 1/6th lunar gravity!
- Lakshman Londhe (Translated from Marathi story ‘Bhet’)`,
    vocabulary: ['out of this world', 'panorama', 'azure', 'gravitational force', 'settlement', 'souvenir', 'unauthorised', 'gymnast', 'exorbitantly', 'precautions'],
    concepts: ['Gravitational physics on the moon (1/6th)', 'Consequences of disregarding safety instructions', 'Collective nouns and punctuation marks'],
    learningOutcomes: ['Explain gravitational variation on celestial bodies', 'Identify collective nouns', 'Apply punctuation marks (period, comma, exclamation, question mark, dash, hyphen)'],
    importantFacts: ['Moon gravity is 1/6th that of Earth', 'The earth looks 13 times bigger and 70 times brighter from the moon', 'One day on the moon equals 15 earth days of daylight and 15 earth days of night', 'Neil Armstrong’s famous words: "One small step for a man, one giant leap of mankind"'],
    importantCharacters: ['Sayali', 'Sayali’s Mother', 'Armstrong Base Receptionist', 'Roadside Salesman'],
    grammarConcepts: ['Collective nouns (class, herd, flock, team)', 'Punctuation rules']
  },
  {
    id: 'chap-bb-7-9',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 9,
    title: '2.3 Abdul Becomes a Courtier',
    type: 'Drama',
    contentSummary: 'Young Abdul overcomes poverty through dedication and resourcefulness, turning humble duties at the Royal Poultry and Library into remarkable achievements to win Emperor Akbar’s court.',
    fullTextOrExcerpts: `Abdul longs to study books, but his poor schoolmaster father cannot afford expensive manuscripts. Abdul offers to serve a rich merchant without money if only he may read the books in the shop. He absorbs philosophy, astronomy, Arabic, and Persian.
When his name reaches the Emperor, Abdul is appointed keeper of the Royal Poultry (Murgikhana). Abdul accepts gladly and feeds hens with kitchen scraps and shells, keeping the birds in the pink of health with zero expense!
Impressed by his intellect, the Emperor places Abdul in charge of the Royal Library. A year later, the Emperor inspects the books and is amazed to see every volume bound in opulent silk, velvet, and brocade jackets. Abdul explains that formal petitions sent to the court were made of rich fabrics; rather than letting them be discarded, he had the Royal Tailors sew book covers at no cost.
Emperor Akbar declares: “You’ve great merit. Now you are my courtier!”
- Pratibha Nath (Adapted from ‘Enter Mulla Do-Piaza’)`,
    vocabulary: ['erudition', 'scores', 'in kind', 'quench', 'sagacious', 'astute', 'murgikhana', 'in the pink of health', 'shirk', 'brocade'],
    concepts: ['Perseverance and resourcefulness', 'Creating value out of waste', 'Concrete vs abstract nouns', 'Irregular plurals'],
    learningOutcomes: ['Distinguish concrete and abstract nouns', 'Form irregular plurals correctly', 'Appreciate wit and diligence in problem solving'],
    importantFacts: ['Abdul fed royal hens on kitchen waste and shells at zero expense', 'Discarded silk petition envelopes were repurposed into book jackets', 'Abdul was promoted from poultry keeper to library keeper and finally to royal courtier'],
    importantCharacters: ['Abdul', 'Abdul’s Father', 'Merchant', 'Emperor Akbar'],
    grammarConcepts: ['Concrete nouns vs Abstract nouns', 'Irregular plural nouns (child/children, tooth/teeth, mouse/mice, sheep/sheep)']
  },
  {
    id: 'chap-bb-7-10',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 10,
    title: '2.4 How doth the little busy bee',
    type: 'Poem',
    contentSummary: 'Isaac Watts’ moral poem praising the industrious bee paired with Lewis Carroll’s satirical parody about the smiling crocodile of the Nile.',
    fullTextOrExcerpts: `Original Poem:
How doth the little busy bee
Improve each shining hour,
And gather honey all the day
From every opening flower.
How skilfully she builds her cell;
How neat she spreads her wax,
And labors hard to store it well
With the sweet food she makes.
- Isaac Watts

A Parody:
How doth the little crocodile
Improve his shining tail;
And pour the waters of the Nile
On every golden scale!
How cheerfully he seems to grin,
How neatly spreads his claws,
And welcomes little fishes in,
With gently smiling jaws!
- Lewis Carroll`,
    vocabulary: ['doth', 'cell', 'opening', 'parody', 'shining tail', 'golden scale', 'grin', 'jaws'],
    concepts: ['Parody and humor in literature', 'Comparing industriousness with cunning mockery'],
    learningOutcomes: ['Define a parody as a comic imitation', 'Compare tone, subject, and structure of two poems', 'Recognize satirical irony'],
    importantFacts: ['Original poem written by Isaac Watts; parody written by Lewis Carroll in Alice in Wonderland', 'Original praises the bee for making honey; parody mocks the crocodile devouring fish'],
    grammarConcepts: ['Archaic verb forms (doth)', 'Rhyme schemes', 'Comparison charts']
  },
  {
    id: 'chap-bb-7-11',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 11,
    title: '2.5 Learn Yoga from Animals',
    type: 'Informational',
    contentSummary: 'Explores yoga as a form of biomimicry where human physical, mental, and spiritual wellness is enhanced by emulating the natural postures of animals.',
    fullTextOrExcerpts: `Since 2015, June 21st is celebrated as International Yoga Day. Modern science explores biomimicry—the science of solving human problems by emulating nature. Yoga is biomimicry in action:
1. Bhujangasana (Cobra Pose): Lie face down, place palms beneath shoulders, smoothly arch upper body like a cobra with raised head. Tones back and spine.
2. Simhasana (Lion Pose): Sit on heels, splay fingers, open jaws wide, extend tongue, and roar with a strong 'Haa' breath to clear lungs and throat.
3. Marjaryasana (Cat Pose): On hands and knees in tabletop position, arch spine upward while exhaling to relieve back stiffness.
4. Garudasana (Eagle Pose): Wrap one leg and arms around each other like an eagle's beak, enhancing body balance and joint flexibility.
5. Ustrasana (Camel Pose): Kneel and arch backward touching soles, opening chest and improving digestion.`,
    vocabulary: ['biomimicry', 'emulate', 'vibrant', 'posture', 'tone', 'navel', 'splayed', 'quadriceps', 'vertebra'],
    concepts: ['Biomimicry in yoga asanas', 'Physical and mental benefits of breathing and stretching', 'Conjunctions and interjections'],
    learningOutcomes: ['Identify the steps and benefits of animal asanas', 'Use conjunctions to join words and clauses', 'Identify interjections expressing emotion'],
    importantFacts: ['June 21st is International Yoga Day', 'Bhujanga means cobra in Sanskrit', 'Garudasana resembles the eagle and develops balance', 'Biomimicry means imitating biological designs to solve problems'],
    grammarConcepts: ['Conjunctions (and, but, because, if)', 'Interjections (Hurrah!, Ouch!, Wow!)']
  },
  {
    id: 'chap-bb-7-12',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 12,
    title: '2.6 Chasing the Sea Monster',
    type: 'Story',
    contentSummary: 'An excerpt from Jules Verne’s Twenty Thousand Leagues under the Sea describing the warship Abraham Lincoln’s high-speed encounter with a luminous, armored marine creature.',
    fullTextOrExcerpts: `The American frigate Abraham Lincoln under Commander Farragut pursued an unearthly luminous creature across the dark sea. The monster circled the warship wrapped in glowing electricity at double their speed.
Cannons were loaded and fired, but the cannonball bounced off the monster’s six-inch metallic armor into the ocean!
At night, the monster lay motionless in the waves. The frigate stealthily approached within twenty feet. Harpooner Ned Land launched his deadly iron harpoon. It struck the beast with a loud ringing metallic clang! Instantly the electric light went out, two enormous waterspouts crashed over the deck, and Professor Aronnax was hurled over the rail into the churning ocean.
- Jules Verne (From ‘Twenty Thousand Leagues under the Sea’)`,
    vocabulary: ['frigate', 'unearthly', 'luminous', 'fearsome', 'cetaceans', 'lurking', 'blunderbusses', 'harpoon', 'astern to port', 'cannoneer', 'profound'],
    concepts: ['Science fiction origins', 'Nautical terminology', 'Transitive vs Intransitive verbs'],
    learningOutcomes: ['Differentiate transitive and intransitive verbs', 'Interpret nautical parts of a ship (bow, stern, mast, deck, forecastle)', 'Identify narrative suspense and cliffhanger endings'],
    importantFacts: ['Written by Jules Verne, known as the Father of Science Fiction', 'The warship was named the Abraham Lincoln', 'Ned Land’s harpoon struck metal, hinting the creature was a submarine'],
    importantCharacters: ['Professor Aronnax (narrator)', 'Commander Farragut', 'Ned Land (harpooner)'],
    grammarConcepts: ['Transitive verbs', 'Intransitive verbs', 'Nautical vocabulary']
  },
  {
    id: 'chap-bb-7-13',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 13,
    title: '2.7 Great Scientists',
    type: 'Informational',
    contentSummary: 'The inspirational biography of Michael Faraday, who overcame poverty, speech impediments, and academic gatekeeping to invent the electric motor and generator.',
    fullTextOrExcerpts: `Michael Faraday was born in a poverty-stricken London suburb with a speech defect, pronouncing ‘rabbit’ as ‘wabbit’. Taken out of school at twelve, he bound books at thirteen and read every volume.
In 1812, Faraday attended Sir Humphry Davy’s lecture on electricity at the Royal Institution. He bound his notes into a book and presented them to Davy. Later, when Davy was temporarily blinded in a lab explosion, he hired Faraday.
Davy mockingly challenged Faraday to explain electromagnetism; within days, Faraday constructed the world’s first electric induction motor! An envious Davy assigned Faraday an impossible task: reverse-engineering secret Bavarian glass. Faraday failed for four years, but kept a glass brick as a souvenir.
After Davy died in 1829, Faraday discovered electromagnetic induction, inventing the electrical generator. Later, he used that very Bavarian glass to discover the magnetic polarization of light. James Clerk Maxwell later translated Faraday’s ideas into equations.
‘In order to succeed, your desire for success should be greater than your fear of failure.’
- A.P.J. Abdul Kalam and Srijan Pal Singh (Reignited)`,
    vocabulary: ['persevering', 'obsession', 'fascination', 'mentor', 'indispensable', 'induction motor', 'reverse engineer', 'polarization', 'dynamo'],
    concepts: ['Perseverance against social and economic obstacles', 'Scientific method and discovery', 'Subject and Predicate structure'],
    learningOutcomes: ['Identify subject and predicate in complex sentences', 'Understand principles of induction motor and electrical generator', 'Analyze mentor-pupil relationship dynamics'],
    importantFacts: ['Faraday invented the induction motor and electrical generator', 'Davy gave Faraday the impossible task of reverse engineering Bavarian glass', 'Maxwell formulated the mathematical equations for Faraday’s discoveries'],
    importantCharacters: ['Michael Faraday', 'Sir Humphry Davy', 'James Clerk Maxwell'],
    grammarConcepts: ['Subject and predicate', 'Compound sentences', 'Vocabulary contextual meanings']
  },
  {
    id: 'chap-bb-7-14',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 14,
    title: '3.1 Tartary',
    type: 'Poem',
    contentSummary: 'Walter de la Mare’s dreamlike poem picturing an imaginary kingdom where the speaker reigns with ivory bed, golden throne, peacocks, trumpets, and zebras.',
    fullTextOrExcerpts: `If I were Lord of Tartary,
Myself and me alone,
My bed should be of ivory,
Of beaten gold my throne;
And in my court should peacocks flaunt,
And in my forests tigers haunt,
And in my pools great fishes slant
Their fins athwart the sun.
If I were Lord of Tartary,
Trumpeters every day
To every meal would summon me,
And in my courtyard bray...
I’d wear a robe of beads,
White, and gold, and green they’d be...
And zebras seven should draw my car
Through Tartary’s dark glades.
- Walter de la Mare`,
    vocabulary: ['ivory', 'beaten gold', 'flaunt', 'athwart', 'bray', 'scimitar', 'glades', 'citron-trees', 'purple vale'],
    concepts: ['Romantic escapism and vivid sensory imagery', 'Consonance in English poetry'],
    learningOutcomes: ['Identify consonance in poetry', 'Recognize sensory details (colour, sound, scenery)', 'Compose descriptive paragraphs of imaginary realms'],
    importantFacts: ['Written by Walter de la Mare', 'Carriage drawn by seven zebras', 'Instruments include harp, flute, and mandoline'],
    grammarConcepts: ['Consonance', 'Alliteration', 'Sensory adjectives']
  },
  {
    id: 'chap-bb-7-15',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 15,
    title: '3.2 Compere a Programme',
    type: 'Informational',
    contentSummary: 'A complete script demonstrating how to compère a school cultural programme (Balanand Vidyalaya Art Festival) with professional announcements and warm introductions.',
    fullTextOrExcerpts: `The compère conducts Balanand Vidyalaya’s School Art Festival:
1. Preparation: Requesting audience to switch phones to silent mode.
2. Arrival of Dignitaries: Head Girl Shubhada Murarka escorts dignitaries to the dais.
3. Commencement: Welcoming Chief Guest Shri Charudatta Diwan (renowned painter, President of Kala Ranjan Academy).
4. Lighting the Lamp: Invoking blessings and knowledge spreading light.
5. School Song sung by Anagha Bhatia and group.
6. Welcome of Guests: Offering books instead of perishable flowers.
7. Introductory speech by Principal Dr. Ajinkya Parakhi.
8. Book Release: Special photo volume of students' artwork.
9. Cultural Programme: Taal Kacheri (Sahil vocals, Mridangam, Dholak, Tabla, Ghatam) and Koli Dance.
10. One-act comedy: 'The Boy Comes Home' by A.A. Milne.
11. Prize Distribution and Vote of Thanks by Art teacher Ms. Shilpa Sanghani.`,
    vocabulary: ['compère', 'dais', 'Atithi Devo Bhava', 'Taal Kacheri', 'rendition', 'butterflies in stomach', 'vote of thanks', 'appraise'],
    concepts: ['Public speaking and event management', 'Direct vs indirect objects in sentences'],
    learningOutcomes: ['Distinguish direct and indirect objects', 'Arrange event stages chronologically', 'Draft formal compère scripts and votes of thanks'],
    importantFacts: ['Books were gifted instead of flowers because books stay forever', 'Taal Kacheri featured Mridangam, Dholak, Tabla, and Ghatam', 'Play performed was The Boy Comes Home by A.A. Milne'],
    grammarConcepts: ['Direct object', 'Indirect object', 'Sequencing phrases']
  },
  {
    id: 'chap-bb-7-16',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 16,
    title: '3.3 A Crow in the House',
    type: 'Story',
    contentSummary: 'Ruskin Bond’s humorous account of Caesar, an injured young crow rescued by grandfather, who develops mischievous habits like stealing neighbours’ toothbrushes.',
    fullTextOrExcerpts: `The narrator rescued a fallen young crow on the road, nursing it with milk, bread, and grandmother’s homemade plum wine. Named Caesar, he refused to leave and took over the house.
Caesar learned to talk in a throaty voice, greeting visitors with “Hello, hello” and “Kiss, kiss”. He pecked at Harold the hornbill’s feet and developed a passion for stealing items from neighbours—hair-ribbons, pencils, combs, keys, false teeth, and especially toothbrushes! Soon, every neighbour was represented on top of the cupboard by a toothbrush.
One day, while helping himself to a neighbour’s beans, a stick was thrown at Caesar, breaking his leg. Despite tender bandaging, Caesar weakened and passed away on the sofa. He was buried in the garden along with all his stolen toothbrushes and clothes pegs.
- Ruskin Bond (From ‘Grandfather’s Private Zoo’)`,
    vocabulary: ['gaping', 'prizing', 'carrion crows', 'snobbish', 'squabble', 'engaging', 'anti-social habits', 'subdued'],
    concepts: ['Affection for wildlife', 'Humorous characterization', 'Subject complement vs Object complement'],
    learningOutcomes: ['Distinguish subject complements and object complements', 'Identify synonyms and antonyms', 'Write character sketches from animal perspectives'],
    importantFacts: ['Caesar was nursed back to health with grandmother’s plum wine', 'Caesar had a special obsession with stealing toothbrushes and clothes pegs', 'Caesar injured his leg while stealing beans from a neighbour’s garden'],
    importantCharacters: ['Caesar the Crow', 'The Narrator', 'Grandfather', 'Grandmother', 'Aunt Mabel', 'Harold the Hornbill'],
    grammarConcepts: ['Subject complement', 'Object complement', 'Antonyms and synonyms']
  },
  {
    id: 'chap-bb-7-17',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 17,
    title: '3.4 The Brook',
    type: 'Poem',
    contentSummary: 'Lord Tennyson’s classic poem personifying a lively mountain brook as it journeys past farms, hills, and villages to join the brimming river, carrying its timeless refrain.',
    fullTextOrExcerpts: `I come from haunts of coot and hern,
I make a sudden sally
And sparkle out among the fern,
To bicker down a valley.
By thirty hills I hurry down,
Or slip between the ridges,
By twenty thorpes, a little town,
An half a hundred bridges.
Till last by Philip’s farm I flow
To join the brimming river,
For men may come and men may go,
But I go on for ever.
I chatter over stony ways,
In little sharps and trebles,
I bubble into eddying bays,
I babble on the pebbles...
I slip, I slide, I gloom, I glance,
Among my skimming swallows;
I make the netted sunbeam dance
Against my sandy shallows...
- Alfred Lord Tennyson`,
    vocabulary: ['coot and hern', 'sally', 'bicker', 'thorpes', 'eddying', 'fret', 'fallow', 'foreland', 'mallow', 'grayling', 'shingly', 'cress'],
    concepts: ['Personification in literature', 'Onomatopoeia in sound words', 'Human mortality vs Nature’s eternal cycle'],
    learningOutcomes: ['Identify onomatopoeic words (chatter, babble, bubble)', 'Analyze poetic refrains', 'Write an autobiographical narrative from nature’s viewpoint'],
    importantFacts: ['Written by Alfred Lord Tennyson', 'The famous refrain: "For men may come and men may go, But I go on for ever"', 'The brook flows past 30 hills, 20 thorpes, and 50 bridges'],
    grammarConcepts: ['Refrain', 'Onomatopoeia', 'Prepositions']
  },
  {
    id: 'chap-bb-7-18',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 18,
    title: '3.5 News Analysis',
    type: 'Informational',
    contentSummary: 'Critical media evaluation of four news items covering exam hall rules, celebrity career shifts, Stephen Hawking’s planetary warning, and quack medicine claims.',
    fullTextOrExcerpts: `Item A: Shivam Institute Bengaluru issues strict DOs and DON'Ts banning closed shoes, boots, electronic devices, and pens in exam halls to prevent cheating.
Item B: Bollywood actress Ritika announces retirement after big-budget movie ‘Ant’ to pursue politics.
Item C: Physicist Stephen Hawking warns in The Guardian that humanity faces its most dangerous time due to climate change, overpopulation, and epidemics, stressing we have only one planet right now.
Item D: In Ralewadi near Ambegaon, crowds flock to Miribaba buying Rs 25 'miracle herbal powder' claimed to cure all diseases, despite hospital patient numbers rising.`,
    vocabulary: ['invigilators', 'candidates', 'big-budget', 'epidemic diseases', 'flock', 'followers', 'reliable vs unreliable'],
    concepts: ['Fact-checking and journalistic reliability', 'Formal letter writing format to school authorities'],
    learningOutcomes: ['Critically evaluate news reports for credibility', 'Draft formal application letters using standard layouts', 'Differentiate reliable journalism from sensationalism'],
    importantFacts: ['Hawking warned about climate change, overpopulation, and epidemic diseases', 'Formal letter format includes Sender’s address, Date, Receiver’s designation, Subject, Salutation, Body, Closing, Signature'],
    grammarConcepts: ['Formal letter structure', 'Media vocabulary']
  },
  {
    id: 'chap-bb-7-19',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 19,
    title: '3.6 Think Before You Speak!',
    type: 'Story',
    contentSummary: 'Philosophical insights from Benjamin Disraeli, Socrates, and a wise teacher on the irreversible power of words, emphasizing that unspoken thoughts remain our servants.',
    fullTextOrExcerpts: `Benjamin Disraeli observed: “Nature has endowed man with two ears and one mouth. If man was meant to talk more and listen less, he would have two mouths and one ear.” Words must pass two fences: the teeth and the lips. Once uttered, spoken words can never be retrieved.
A young man who spoke harsh words to a friend was told by his spiritual teacher to write them on paper, tear the sheet into a hundred tiny bits, and throw them out the window into the wind. When told to collect all bits back, the youth found it impossible. “So it is with spoken words,” said the teacher.
Socrates counselled disciples with his Three Sieves: Before speaking, ask:
1. Is it true?
2. Is it pleasant?
3. Is it useful?`,
    vocabulary: ['funnels', 'fences', 'amends', 'counselled', 'affirmative', 'veracity', 'transmitters of untruth'],
    concepts: ['The impact of spoken words', 'Socrates’ three tests of speech', 'Words used as both nouns and verbs', 'Adverbials'],
    learningOutcomes: ['Identify adverbial phrases and clauses', 'Use identical words as nouns and verbs', 'Apply ethical discernment in everyday conversation'],
    importantFacts: ['Socrates proposed three questions: Is it true? Is it pleasant? Is it useful?', 'Torn bits of paper scattering in the wind illustrate spoken words'],
    importantCharacters: ['Benjamin Disraeli', 'The Young Man', 'The Spiritual Teacher', 'Socrates'],
    grammarConcepts: ['Same word as noun and verb', 'Adverbials (phrases and clauses)']
  },
  {
    id: 'chap-bb-7-20',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 20,
    title: '4.1 Under the Greenwood Tree',
    type: 'Poem',
    contentSummary: 'William Shakespeare’s song from As You Like It celebrating simple pastoral life in the forest, free from court ambition and false friends.',
    fullTextOrExcerpts: `Under the greenwood tree
Who loves to lie with me,
And turn his merry note
Unto the sweet bird’s throat,
Come hither, come hither, come hither!
Here shall he see
No enemy
But winter and rough weather.
Who doth ambition shun,
And loves to live i’the sun,
Seeking the food he eats,
And pleased with what he gets,
Come hither, come hither, come hither:
Here shall he see
No enemy
But winter and rough weather.
- William Shakespeare`,
    vocabulary: ['greenwood', 'unto', 'hither', 'shun', 'doth', 'i’the sun', 'ambition'],
    concepts: ['Pastoral poetry and contentment with nature', 'Archaic Elizabethan English'],
    learningOutcomes: ['Interpret archaic vocabulary (hither, doth, unto)', 'Appreciate themes of contentment versus ambition', 'Identify rhyme schemes in Renaissance songs'],
    importantFacts: ['Extracted from Shakespeare’s play As You Like It', 'Sunk by character Lord Amiens in the Forest of Arden', 'The only enemies in the forest are winter and rough weather'],
    grammarConcepts: ['Archaic English words', 'Rhyming pairs']
  },
  {
    id: 'chap-bb-7-21',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 21,
    title: '4.2 Unke Munke Timpetoo',
    type: 'Story',
    contentSummary: 'Rohan chants a silly charm around former principal Mrs. Groover’s banyan tree wishing for a table tennis set. Caught red-handed, his honesty earns him a heartwarming surprise.',
    fullTextOrExcerpts: `Rohan desperately wanted a table tennis set for his birthday, but his mother said it was out of the question. His friend Muk told him a charm: run around a banyan tree at midnight and chant seventeen times: “Unke, Munke, Timpetoo, I wish my wish is coming true!”
The only banyan tree was in the walled garden of strict former principal Mrs. Groover. At midnight, Muk and Rohan climbed the wall. While Rohan was finishing round eleven, Mrs. Groover’s fierce dog barked and she caught him. Rohan truthfully confessed his desperate wish. To his surprise, Mrs. Groover let him finish the remaining six rounds and leave by the front gate.
On his birthday, alongside shoes and a pullover, Rohan received a large parcel containing a fabulous table tennis set with a card: “To Rohan Khanna, From Unke, Munke, Timpetoo!” Mrs. Groover had secretly sent it!
- Sigrun Srivastava`,
    vocabulary: ['mocking', 'banyan tree', 'piercing', 'ferocious', 'unleash', 'stammered', 'fabulous', 'heart-warming'],
    concepts: ['Friendship, superstition vs honesty', 'Prefixes and suffixes in English word building'],
    learningOutcomes: ['Identify prefixes (un-, non-, dis-, super-, inter-) and suffixes (-er, -hood, -ship, -ful, -ly, -able)', 'Analyze plot development and unexpected kindness', 'Write alternative story endings'],
    importantFacts: ['The chant had to be repeated 17 times at midnight around a banyan tree', 'Mrs. Groover was the retired principal of their school', 'The card on the parcel was signed "From Unke, Munke, Timpetoo"'],
    importantCharacters: ['Rohan Khanna', 'Muk', 'Mrs. Groover', 'Rohan’s Mother'],
    grammarConcepts: ['Prefixes (un-, dis-, super-)', 'Suffixes (-ful, -less, -able, -ship, -hood)']
  },
  {
    id: 'chap-bb-7-22',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 22,
    title: '4.3 The Red-Headed League',
    type: 'Story',
    contentSummary: 'Sherlock Holmes uncovers how a bizarre advertisement hiring only red-headed men to copy the Encyclopedia Britannica was a cover for tunneling into a bank vault.',
    fullTextOrExcerpts: `Pawnbroker Jabez Wilson consults Sherlock Holmes about the Red-Headed League. His assistant Vincent Spaulding urged him to apply for a nominal job copying the Encyclopedia Britannica for four pounds a week, open only to red-headed men. After eight weeks, a note announced the League was dissolved.
Holmes notes Spaulding’s wrinkled, stained trouser knees. Tapping his stick outside Wilson’s pawnshop, Holmes deduces a tunnel is being dug toward the City branch bank cellar, which holds French gold.
That night, Holmes, Watson, Inspector Jones of Scotland Yard, and banker Merryweather wait in darkness in the cellar. Criminal John Clay (alias Spaulding) and Duncan Ross emerge through a floor flagstone and are captured.
- Sir Arthur Conan Doyle (Adapted from ‘The Red-Headed League’)`,
    vocabulary: ['pawn-broker', 'League', 'cellar', 'classified ads', 'dissolved', 'acid splash', 'bullion', 'foiled'],
    concepts: ['Deductive reasoning and detective observation', 'Modal auxiliaries (can, could, may, might, shall, should, will, would, must)'],
    learningOutcomes: ['Use modal auxiliary verbs correctly', 'Sequence mystery plot events chronologically', 'Identify homonyms, antonyms, and synonyms'],
    importantFacts: ['Jabez Wilson was paid 4 pounds a week to copy Encyclopedia Britannica starting with letter A', 'Spaulding was actually the notorious criminal John Clay', 'The tunnel was dug into the bank cellar to steal French gold bullion'],
    importantCharacters: ['Sherlock Holmes', 'Dr. Watson', 'Jabez Wilson', 'Vincent Spaulding (John Clay)', 'Duncan Ross', 'Mr. Merryweather'],
    grammarConcepts: ['Modal auxiliaries', 'Homonyms', 'Synonyms and antonyms']
  },
  {
    id: 'chap-bb-7-23',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 23,
    title: '4.4 Home Sweet Home',
    type: 'Poem',
    contentSummary: 'John Howard Payne’s heartfelt poem celebrating the unmatched solace, warmth, and peace of mind found in one’s own humble home.',
    fullTextOrExcerpts: `’Mid pleasures and palaces though we may roam,
Be it ever so humble, there’s no place like home;
A charm from the sky seems to hallow us there,
Which, seek through the world, is ne’er met with elsewhere.
Home, home, sweet, sweet home!
There’s no place like home, oh, there’s no place like home!
An exile from home, splendour dazzles in vain;
Oh, give me my lowly thatched cottage again!
The birds singing gayly, that come at my call -
Give me them - and the peace of mind, dearer than all!
Home, home, sweet, sweet home!
There’s no place like home, oh, there’s no place like home!
- John Howard Payne`,
    vocabulary: ['’mid', 'humble', 'hallow', 'elsewhere', 'exile', 'splendour', 'dazzles', 'lowly', 'thatched cottage', 'solace'],
    concepts: ['Appreciation of home and family warmth', 'Lyrical repetition in sentiment'],
    learningOutcomes: ['Explain poetic themes of belonging', 'Analyze emotional contrast between palaces and humble cottages', 'Interpret evocative sensory words'],
    importantFacts: ['Written by John Howard Payne', 'Refrain affirms: "There’s no place like home"', 'Speaker prefers a lowly thatched cottage and singing birds over worldly palaces'],
    grammarConcepts: ['Poetic contractions (’mid, ne’er, ’tis)', 'Refrains', 'Sensory diction']
  },
  {
    id: 'chap-bb-7-24',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 24,
    title: '4.5 Seeing Eyes Helping Hands (Part 2)',
    type: 'Informational',
    contentSummary: 'A letter of gratitude from Home for the Aged to Principal Suhasini Ambekar and an informal letter format guide demonstrating the social impact of student volunteers.',
    fullTextOrExcerpts: `Text A: Official letter of thanks from Kiran Somalwar, Secretary of Home for the Aged, Girgaon to Principal Suhasini Ambekar of New Vision High School, praising the 7th-standard students for their storytelling, obedience, and uplifting company to the elderly residents on 5th January.
Text B: A personal conversation in the Principal’s office where parent Mr. Bendre expresses deep gratitude for the noticeable positive changes in his son’s empathy, consideration, and character through the S.E.H.H. initiative.`,
    vocabulary: ['appreciation', 'obediently', 'residents', 'personality development', 'post script (P.S.)'],
    concepts: ['Community empathy and intergenerational solidarity', 'Informal letter writing structure'],
    learningOutcomes: ['Format informal personal letters with proper place, date, salutation, body, and sign-off', 'Express gratitude effectively in written form', 'Understand civic volunteering impact'],
    importantFacts: ['Home for the Aged is located on East Street, Girgaon', 'Secretary Kiran Somalwar wrote the appreciation letter', 'Parent Mr. Bendre praised the school at the PTA meeting'],
    grammarConcepts: ['Informal letter format', 'Expressions of gratitude', 'Post Script usage']
  },
  {
    id: 'chap-bb-7-25',
    bookId: 'book-balbharati-eng-7',
    chapterNumber: 25,
    title: '4.6 Papa Panov’s Special Christmas',
    type: 'Story',
    contentSummary: 'Leo Tolstoy’s classic tale of an old village shoemaker who dreams Jesus will visit him on Christmas Day, and finds him embodied in the needy people he shelters and feeds.',
    fullTextOrExcerpts: `Old village shoemaker Papa Panov read the Christmas story by his charcoal stove and wished he could have offered Mary and baby Jesus his warm bed. That night in a dream, Jesus promised to visit him on Christmas Day.
All day long Papa Panov watched the freezing snowy street. He invited in the shivering street sweeper for steaming coffee. He gave warmth and milk to a penniless young mother and gifted her baby a tiny pair of leather shoes he had treasured. At dusk, he fed hot cabbage soup and bread to wandering beggars.
When night fell, Papa Panov sighed sadly, thinking he had missed his divine visitor. Suddenly, a voice whispered: “I was hungry and you fed me. I was naked and you clothed me. I was cold and you warmed me. I came to you today in everyone of those you helped and welcomed.” Papa Panov’s heart burst with joyous revelation.
- Leo Tolstoy`,
    vocabulary: ['scurried', 'muffled', 'shutters', 'laughter wrinkles', 'patchwork quilt', 'sweeper', 'gurgled', 'dusk', 'bewildered'],
    concepts: ['Compassion in everyday actions', 'Recognizing divinity in service to humanity', 'Homophones'],
    learningOutcomes: ['Identify homophones (no/know, dear/deer, pair/pear, soul/sole, whole/hole)', 'Write character sketches on compassion', 'Interpret moral and philosophical allegories'],
    importantFacts: ['Papa Panov was a village shoemaker', 'He gifted the baby a pair of tiny leather shoes he had made', 'Moral: Serving the needy is the highest form of worship'],
    importantCharacters: ['Papa Panov', 'The Street Sweeper', 'The Young Mother and Baby', 'Beggars'],
    grammarConcepts: ['Homophones', 'Sentence correction', 'Character sketch writing']
  }
];

export const INITIAL_PAPER_PATTERNS: PaperPattern[] = [
  {
    id: 'pattern-cbse-english-term',
    name: 'Maharashtra State Board / Comprehensive Term Paper (60 Marks)',
    description: 'Balanced 5-section summative paper covering MCQs, Blanks, True/False, Short Answer, and Long Answer.',
    grade: '7',
    subject: 'English',
    totalMarks: 60,
    defaultDuration: '1.5 Hours',
    isDefault: true,
    sections: [
      {
        id: 'sec-1',
        sectionTitle: 'SECTION A: MULTIPLE CHOICE QUESTIONS',
        questionType: 'MCQ',
        numberOfQuestions: 5,
        marksPerQuestion: 2,
        totalMarks: 10,
        instructions: 'Choose the correct alternative from the given options.'
      },
      {
        id: 'sec-2',
        sectionTitle: 'SECTION B: FILL IN THE BLANKS',
        questionType: 'Fill in the Blanks',
        numberOfQuestions: 5,
        marksPerQuestion: 2,
        totalMarks: 10,
        instructions: 'Fill in the blanks with suitable words from the textbook lessons.'
      },
      {
        id: 'sec-3',
        sectionTitle: 'SECTION C: TRUE OR FALSE',
        questionType: 'True / False',
        numberOfQuestions: 5,
        marksPerQuestion: 2,
        totalMarks: 10,
        instructions: 'State whether the following statements are True or False.'
      },
      {
        id: 'sec-4',
        sectionTitle: 'SECTION D: SHORT ANSWER QUESTIONS',
        questionType: 'Short Answer',
        numberOfQuestions: 5,
        marksPerQuestion: 3,
        totalMarks: 15,
        instructions: 'Answer the following questions in 2 to 3 complete sentences.'
      },
      {
        id: 'sec-5',
        sectionTitle: 'SECTION E: LONG ANSWER & COMPREHENSION',
        questionType: 'Long Answer',
        numberOfQuestions: 3,
        marksPerQuestion: 5,
        totalMarks: 15,
        instructions: 'Answer the following questions in detail with textual evidence.'
      }
    ]
  }
];
