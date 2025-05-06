import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

delete mongoose.connection.models['Topic'];

const topicSchema = new mongoose.Schema({
  year: String,
  section: String,
  level: String,
  title: String,
  article: String,
  questions: [
    {
      question: String,
      type: String,
      options: [String],
      answer: mongoose.Schema.Types.Mixed
    }
  ],
  createdAt: { type: Date, default: Date.now }
});
const Topic = mongoose.model('Topic', topicSchema);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/schoolDashboard';

if (!MONGODB_URI) {
  console.error('No MongoDB URI found. Set MONGODB_URI in your .env file or Render environment.');
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (err) {
    console.error('Could not connect to MongoDB. Is it running? Is your MONGODB_URI correct?');
    console.error(err);
    process.exit(1);
  }

  // Example topics for Reception year and all other years
  const topics = [
    // Reception
    {
      year: 'reception',
      section: 'Basic Operators',
      level: 'growing',
      title: 'Counting to 5',
      article: 'Learn how to count from 1 to 5 using your fingers and objects around you.',
      questions: [
        { question: 'What number comes after 3?', type: 'multiple-choice', options: ['2', '4', '5'], answer: '4' },
        { question: 'Count the apples: 🍎🍎🍎. How many?', type: 'short-answer', answer: '3' }
      ]
    },
    // Year 1
    {
      year: 'year1',
      section: 'Addition',
      level: 'growing',
      title: 'Adding within 10',
      article: 'Practice adding numbers up to 10.',
      questions: [
        { question: 'What is 3 + 4?', type: 'short-answer', answer: '7' },
        { question: 'Which is correct? 2 + 5 = ?', type: 'multiple-choice', options: ['6', '7', '8'], answer: '7' }
      ]
    },
    {
      year: 'year1',
      section: 'Shapes',
      level: 'exceeding',
      title: 'Naming Shapes',
      article: 'Learn the names of basic shapes.',
      questions: [
        { question: 'What shape has 3 sides?', type: 'multiple-choice', options: ['Square', 'Triangle', 'Circle'], answer: 'Triangle' }
      ]
    },
    // Year 2
    {
      year: 'year2',
      section: 'Subtraction',
      level: 'growing',
      title: 'Subtracting within 20',
      article: 'Practice subtracting numbers up to 20.',
      questions: [
        { question: 'What is 15 - 7?', type: 'short-answer', answer: '8' }
      ]
    },
    {
      year: 'year2',
      section: 'Money',
      level: 'growing',
      title: 'Recognising Coins',
      article: 'Learn to recognise UK coins.',
      questions: [
        { question: 'Which coin is worth more? 1p or 2p?', type: 'multiple-choice', options: ['1p', '2p'], answer: '2p' }
      ]
    },
    // Year 3
    {
      year: 'year3',
      section: 'Multiplication',
      level: 'growing',
      title: '2 Times Table',
      article: 'Practice the 2 times table.',
      questions: [
        { question: 'What is 2 x 6?', type: 'short-answer', answer: '12' }
      ]
    },
    {
      year: 'year3',
      section: 'Measurement',
      level: 'growing',
      title: 'Measuring Length',
      article: 'Learn to measure length in cm and m.',
      questions: [
        { question: 'How many cm in a metre?', type: 'short-answer', answer: '100' }
      ]
    },
    // Year 4
    {
      year: 'year4',
      section: 'Division',
      level: 'growing',
      title: 'Dividing by 10',
      article: 'Practice dividing numbers by 10.',
      questions: [
        { question: 'What is 50 ÷ 10?', type: 'short-answer', answer: '5' }
      ]
    },
    {
      year: 'year4',
      section: 'Fractions',
      level: 'growing',
      title: 'Finding Halves',
      article: 'Learn about halves and how to find them.',
      questions: [
        { question: 'What is half of 8?', type: 'short-answer', answer: '4' }
      ]
    },
    // Year 5
    {
      year: 'year5',
      section: 'Decimals',
      level: 'growing',
      title: 'Understanding Tenths',
      article: 'Learn about tenths and decimals.',
      questions: [
        { question: 'What is 0.1 + 0.2?', type: 'short-answer', answer: '0.3' }
      ]
    },
    {
      year: 'year5',
      section: 'Area',
      level: 'growing',
      title: 'Finding Area of Rectangles',
      article: 'Practice finding the area of rectangles.',
      questions: [
        { question: 'What is the area of a 3x4 rectangle?', type: 'short-answer', answer: '12' }
      ]
    },
    // Year 6
    {
      year: 'year6',
      section: 'Percentages',
      level: 'growing',
      title: 'Finding 10%',
      article: 'Learn to find 10% of a number.',
      questions: [
        { question: 'What is 10% of 50?', type: 'short-answer', answer: '5' }
      ]
    },
    {
      year: 'year6',
      section: 'Ratio',
      level: 'growing',
      title: 'Simple Ratios',
      article: 'Understand and use simple ratios.',
      questions: [
        { question: 'What is the ratio of 2 red balls to 3 blue balls?', type: 'short-answer', answer: '2:3' }
      ]
    },
    // Year 7
    {
      year: 'year7',
      section: 'Algebra',
      level: 'growing',
      title: 'Simple Equations',
      article: 'Solve simple equations like x + 3 = 7.',
      questions: [
        { question: 'If x + 3 = 7, what is x?', type: 'short-answer', answer: '4' }
      ]
    },
    {
      year: 'year7',
      section: 'Probability',
      level: 'growing',
      title: 'Chance Events',
      article: 'Learn about probability and chance.',
      questions: [
        { question: 'What is the probability of flipping heads on a coin?', type: 'short-answer', answer: '1/2' }
      ]
    },
    // Year 8
    {
      year: 'year8',
      section: 'Linear Graphs',
      level: 'growing',
      title: 'Plotting Points',
      article: 'Learn to plot points on a graph.',
      questions: [
        { question: 'Plot (2,3) on a graph. What is the x-coordinate?', type: 'short-answer', answer: '2' }
      ]
    },
    {
      year: 'year8',
      section: 'Percentages',
      level: 'growing',
      title: 'Percentage Increase',
      article: 'Calculate percentage increase.',
      questions: [
        { question: 'Increase 50 by 10%', type: 'short-answer', answer: '55' }
      ]
    },
    // Year 9
    {
      year: 'year9',
      section: 'Simultaneous Equations',
      level: 'growing',
      title: 'Solving Simultaneous Equations',
      article: 'Learn to solve simple simultaneous equations.',
      questions: [
        { question: 'Solve: x + y = 5, x - y = 1. What is x?', type: 'short-answer', answer: '3' }
      ]
    },
    {
      year: 'year9',
      section: 'Pythagoras',
      level: 'growing',
      title: 'Pythagoras Theorem',
      article: 'Understand and use Pythagoras theorem.',
      questions: [
        { question: 'If a=3, b=4, what is c?', type: 'short-answer', answer: '5' }
      ]
    },
    // Year 10
    {
      year: 'year10',
      section: 'Quadratics',
      level: 'growing',
      title: 'Solving Quadratic Equations',
      article: 'Learn to solve quadratic equations.',
      questions: [
        { question: 'Solve x^2 = 9. What is x?', type: 'short-answer', answer: '3 or -3' }
      ]
    },
    {
      year: 'year10',
      section: 'Trigonometry',
      level: 'growing',
      title: 'Sine Rule',
      article: 'Learn and use the sine rule.',
      questions: [
        { question: 'What is sin(90°)?', type: 'short-answer', answer: '1' }
      ]
    },
    // Year 11
    {
      year: 'year11',
      section: 'Vectors',
      level: 'growing',
      title: 'Vector Addition',
      article: 'Learn to add vectors.',
      questions: [
        { question: 'Add (2,3) and (1,4). What is the result?', type: 'short-answer', answer: '(3,7)' }
      ]
    },
    {
      year: 'year11',
      section: 'Circle Theorems',
      level: 'growing',
      title: 'Angles in a Circle',
      article: 'Learn about angles in a circle.',
      questions: [
        { question: 'What is the angle at the centre if the angle at the circumference is 30°?', type: 'short-answer', answer: '60' }
      ]
    },
  ];

  await Topic.deleteMany({ year: 'reception' });
  await Topic.insertMany(topics);
  console.log('Seeded Reception topics!');
  await mongoose.disconnect();
}

seed();
