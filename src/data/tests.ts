import { TestSeriesDefinition } from '../types';

export const OFFICIAL_TEST_SERIES: TestSeriesDefinition[] = [
  {
    id: 'test-neet-grand-mock-1',
    title: 'NEET Full Syllabus Grand Mock #1',
    type: 'NEET Style Mock',
    questionCount: 200,
    durationMinutes: 200,
    description: 'Comprehensive NTA NEET UG pattern simulation: 50 Physics, 50 Chemistry, 50 Botany, 50 Zoology under strict +4 / -1 rules.'
  },
  {
    id: 'test-full-syllabus-150',
    title: 'Part Syllabus Combined Assessment (Class 11 Focus)',
    type: 'Part Syllabus',
    questionCount: 150,
    durationMinutes: 150,
    description: '150 question high-yield assessment covering mechanics, thermodynamics, cell biology, and structural organization.'
  },
  {
    id: 'test-physics-subject-100',
    title: 'Complete Physics Mastery Test',
    type: 'Subject Test',
    subject: 'physics',
    questionCount: 100,
    durationMinutes: 90,
    description: 'Rigorous 100 question speed test covering rotational motion, electrostatics, optics, and modern physics.'
  },
  {
    id: 'test-biology-grand-100',
    title: 'Biology 360/360 Sprint (Botany & Zoology)',
    type: 'Subject Test',
    questionCount: 100,
    durationMinutes: 60,
    description: '100 NCERT line-by-line questions testing genetic ratios, human reproduction, and ecological interactions.'
  },
  {
    id: 'test-chemistry-50',
    title: 'Organic & Inorganic Speed Diagnostic',
    type: 'Subject Test',
    subject: 'chemistry',
    questionCount: 50,
    durationMinutes: 45,
    description: 'Focused 50 question diagnostic on reaction mechanisms, coordination compounds, and periodic trends.'
  },
  {
    id: 'test-weak-area-diagnostic-50',
    title: 'Adaptive Weak Area Recovery Test',
    type: 'Weak Area Test',
    questionCount: 50,
    durationMinutes: 50,
    description: 'Dynamically synthesized from your chapters with <60% accuracy and mistake notebook backlog.'
  },
  {
    id: 'test-mistake-notebook-50',
    title: 'Mistake Notebook Re-Test',
    type: 'Mistake Notebook Test',
    questionCount: 50,
    durationMinutes: 45,
    description: 'Exclusively tests questions you previously answered incorrectly until mastery is proven.'
  },
  {
    id: 'test-pyq-marathon-100',
    title: 'NEET Authentic PYQ Benchmark',
    type: 'PYQ Test',
    questionCount: 100,
    durationMinutes: 90,
    description: 'Benchmark performance on real historical questions once verified PYQ dataset is connected.'
  }
];
