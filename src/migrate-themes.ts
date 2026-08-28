import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResearchProjectsService } from './research-projects/research-projects.service';
import { ThemesService } from './themes/themes.service';
import * as dotenv from 'dotenv';

dotenv.config();

// One-off, non-destructive migration: copies each ResearchProject's legacy
// embedded `themes` array into the new independent `Theme` collection, along
// with any resources tagged with that theme's name. The original embedded
// `themes`/`resources` arrays on ResearchProject are left untouched.

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const projectsService = app.get(ResearchProjectsService);
  const themesService = app.get(ThemesService);

  const projects = await projectsService.findAll();

  let projectsWithThemes = 0;
  let created = 0;
  let skipped = 0;

  for (const projectDoc of projects) {
    const project = (projectDoc as any).toObject();
    const themes = Array.isArray(project.themes) ? project.themes : [];
    if (themes.length === 0) continue;
    projectsWithThemes++;

    const existingThemes = await themesService.findAllByProject(project._id.toString());
    const existingNames = new Set(existingThemes.map((t: any) => t.name));

    const resources = Array.isArray(project.resources) ? project.resources : [];

    for (let i = 0; i < themes.length; i++) {
      const theme = themes[i];
      if (existingNames.has(theme.name)) {
        console.log(`SKIP (already migrated): "${project.title}" -> "${theme.name}"`);
        skipped++;
        continue;
      }

      const matchingResources = resources
        .filter((r: any) => r.group === theme.name)
        .map((r: any) => ({
          url: r.url,
          title: r.title,
          description: r.description,
          type: r.type,
          group: r.group,
          image: r.image,
        }));

      await themesService.create({
        researchProject: project._id,
        name: theme.name,
        overview: theme.description,
        order: i,
        resources: matchingResources,
      });

      console.log(
        `MIGRATED: "${project.title}" -> "${theme.name}" (${matchingResources.length} resource(s) copied)`,
      );
      created++;
    }
  }

  console.log(
    `\nDone. ${projectsWithThemes} project(s) with themes found, ${created} theme(s) created, ${skipped} skipped.`,
  );
  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
