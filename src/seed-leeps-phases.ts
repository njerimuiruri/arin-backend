import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResearchProjectsService } from './research-projects/research-projects.service';
import { ThemesService } from './themes/themes.service';
import * as dotenv from 'dotenv';

dotenv.config();

// One-off, idempotent seed: splits the LEEPS research project into two
// Project Areas — "Phase 1" (completed) and "Phase 2" (ongoing). Re-running
// it skips any area whose name already exists on the project.
//
//   npx ts-node src/seed-leeps-phases.ts

const PROJECT_TITLE_MATCH = 'LEEPS';

const PHASE_1 = {
  name: 'LEEPS Phase 1',
  subtitle: 'Completed',
  overview:
    'Phase 1 of the Africa LEEPS partnership (Anglophone hub), led by AFIDEP in collaboration with ARIN, the African Institute for Health Policies and Health Systems (Nigeria) and the Makerere University School of Gender and Women Studies, built capacity for institutionalising Evidence-Informed Policymaking (EIP) in Africa through fellow training and a competitive mini-grants scheme.',
  objectives: [
    'Create awareness among fellows of the EIP project and its objectives through a sensitization training.',
    'Deliver a two-week training with tailor-made modules on institutionalising evidence in Africa.',
    'Award 10–15 competitive mini-grants to trained fellows through the ARIN AEEPA Mini-grants Scheme, with mentorship.',
    'Consolidate the results into a book volume on EIP practices, innovations and opportunities for scaling up.',
  ],
};

const PHASE_2 = {
  name: 'LEEPS Phase 2',
  subtitle: 'Ongoing',
  // TODO: replace with the Phase 2 description and objectives before running.
  overview: 'Phase 2 of the LEEPS partnership is currently under way.',
  objectives: [] as string[],
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

  const toCreate: any[] = [
    { ...PHASE_1, order: 0 },
    { ...PHASE_2, order: 1 },
  ];

  for (const data of toCreate) {
    if (existingNames.has(data.name)) {
      console.log(`SKIP (already exists): "${data.name}"`);
      continue;
    }
    await themesService.create({ researchProject: project._id, ...data });
    console.log(`CREATED: "${data.name}"`);
  }

  console.log('\nDone.');
  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
