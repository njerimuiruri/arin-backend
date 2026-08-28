import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResearchProjectsService } from './research-projects/research-projects.service';
import { ThemesService } from './themes/themes.service';
import * as dotenv from 'dotenv';

dotenv.config();

// One-off, idempotent seed: creates the two structured Project Areas
// (sub-projects) under the Math4CCR research project — "ARIN Publishing
// Academy" and "AI for Climate Resilience Fellowship". Re-running it skips
// any area whose name already exists on the project.
//
// Run once the backend is deployed with the extended Theme schema:
//   npx ts-node src/seed-math4ccr-themes.ts

const PROJECT_TITLE_MATCH = 'Math4CCR';

const PUBLISHING_ACADEMY = {
  name: 'ARIN Publishing Academy',
  subtitle: 'In partnership with Taylor & Francis',
  externalUrl: 'https://elearning.arin-africa.org/arin-publishing-academy',
  externalUrlLabel: 'Go to the Publishing Academy',
  overview:
    'The ARIN Publishing Academy strengthens the research writing, publishing, and knowledge-translation capacity of African researchers so they can turn evidence into high-quality academic, technical, and policy outputs. Delivered in partnership with Taylor & Francis, it pairs participants with senior scholars, journal editors, and policy-communication experts, and builds the data literacy, research rigour, and open-dissemination skills needed to publish and be read.',
  objectives: [
    'Strengthen research writing and publishing capacity to produce high-quality academic, technical, and policy-oriented outputs.',
    'Build inclusive mentorship networks by connecting participants with senior scholars, journal editors, and policy communication experts.',
    'Enhance data literacy and research rigor through training in analysis, visualization, reproducibility, and ethical practices.',
    'Advance knowledge translation by equipping participants to transform evidence into policy briefs, op-eds, and advocacy materials.',
    'Promote open dissemination pathways by leveraging digital tools, open-access models, AI, and structured publishing workflows.',
  ],
};

const AI_FELLOWSHIP = {
  name: 'AI for Climate Resilience Fellowship',
  overview:
    'Equipping African researchers, practitioners, and policymakers with AI and ML skills to address climate change challenges across Africa and beyond.',
  externalUrl: 'http://elearning.arin-africa.org/ai-climate-resilience',
  externalUrlLabel: 'Go to the e-learning platform',
  stats: [
    { label: 'Levels', value: '3' },
    { label: 'Pass Mark', value: '70%' },
    { label: 'Certificates', value: '3' },
  ],
  levels: [
    {
      name: 'Beginner',
      subtitle: 'Foundation & Technical Core',
      description:
        'Climate science, policy frameworks, mathematical foundations, and an introduction to AI and Machine Learning.',
      points: [
        'Topic quizzes after each major topic',
        'End-of-module assessments',
        'Minimum pass mark: 70%',
      ],
      certificate: 'Certificate in Foundations of AI for Climate Resilience',
    },
    {
      name: 'Intermediate',
      subtitle: 'Advanced Analytical Modelling',
      description:
        'Advanced ML for climate modeling, uncertainty and risk analysis, and spatial vulnerability mapping.',
      points: [
        'Advanced modeling quizzes',
        'Practical assignments',
        'Mini modeling project',
        'Minimum pass mark: 70%',
      ],
      certificate: 'Advanced Certificate in AI for Climate Analytics',
    },
    {
      name: 'Advanced',
      subtitle: 'Applied Innovation & Capstone',
      description:
        'Real-world case studies, AI-driven solution design, ethical integration, policy translation, and a final Capstone Project where you design an AI-based climate resilience solution.',
      points: [
        'Advanced assessments & solution reviews',
        'Final presentation & peer review',
        'Fellowship Certificate',
      ],
      certificate: 'Fellowship Certificate',
    },
  ],
  format: [
    { title: 'Self-paced Modules', description: 'Learn at your own pace on the ARIN platform' },
    { title: 'Live Zoom Masterclasses', description: 'Interactive sessions with thematic experts' },
    { title: 'Webinars', description: 'Curated expert-led knowledge sessions' },
    { title: 'Case-based Assignments', description: 'Real-world problem-solving tasks' },
    { title: 'Capstone Project', description: 'AI innovation aligned with African priorities' },
  ],
  learningOutcomes: [
    'Interpret climate datasets and model climate variability trends',
    'Build and evaluate basic ML models for environmental data',
    'Apply AI in vulnerability mapping and risk forecasting',
    'Quantify uncertainty in climate projections',
    'Critically assess ethical implications of AI in climate governance',
    'Develop policy briefs informed by AI-generated evidence',
    'Present a climate-resilient AI innovation aligned with African priorities',
  ],
  // Resources already tagged with this group on the parent project are copied in.
  resourceGroups: ['AI for Climate Resilience', 'AI for Climate Resilience Fellowship'],
};

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const projectsService = app.get(ResearchProjectsService);
  const themesService = app.get(ThemesService);

  const projects = await projectsService.findAll();
  const projectDoc = projects.find((p: any) =>
    (p.title || '').toLowerCase().includes(PROJECT_TITLE_MATCH.toLowerCase()),
  );

  if (!projectDoc) {
    console.error(`No research project matching "${PROJECT_TITLE_MATCH}" found. Aborting.`);
    await app.close();
    process.exit(1);
  }

  const project = (projectDoc as any).toObject();
  const projectId = project._id.toString();
  console.log(`Project: "${project.title}" (${projectId})`);

  const existing = await themesService.findAllByProject(projectId);
  const existingNames = new Set(existing.map((t: any) => t.name));
  const projectResources = Array.isArray(project.resources) ? project.resources : [];

  const pickResources = (groups: string[]) =>
    projectResources
      .filter((r: any) => r.group && groups.includes(r.group))
      .map((r: any) => ({
        url: r.url,
        title: r.title,
        description: r.description,
        type: r.type,
        group: r.group,
        image: r.image,
      }));

  const toCreate: any[] = [
    { ...PUBLISHING_ACADEMY, order: 0 },
    {
      ...AI_FELLOWSHIP,
      order: 1,
      resources: pickResources(AI_FELLOWSHIP.resourceGroups),
      resourceGroups: undefined,
    },
  ];

  for (const data of toCreate) {
    if (existingNames.has(data.name)) {
      console.log(`SKIP (already exists): "${data.name}"`);
      continue;
    }
    const { resourceGroups, ...payload } = data;
    await themesService.create({ researchProject: project._id, ...payload });
    console.log(
      `CREATED: "${data.name}"${data.resources ? ` (${data.resources.length} resource(s) copied)` : ''}`,
    );
  }

  console.log('\nDone.');
  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
