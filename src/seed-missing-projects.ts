import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResearchProjectsService } from './research-projects/research-projects.service';
import * as dotenv from 'dotenv';

dotenv.config();

// One-off, idempotent seed: adds the research projects listed in
// "Projects - Website Update (10_26).xlsx" that are not yet on the website.
// Projects whose title already exists are skipped. Projects with no known
// start year are skipped too (date is required) until `startYear` is filled.
//
//   npx ts-node src/seed-missing-projects.ts           # dry run, writes nothing
//   npx ts-node src/seed-missing-projects.ts --apply   # creates the projects

type SeedProject = {
  title: string;
  startYear: number | null;
  endYear: number | null; // null = ongoing / unknown
  category: string; // one of ARIN's focus areas
  description: string;
  milestones?: string;
  partners?: string[];
  funders?: string[];
  link?: { title: string; url: string };
};

const PROJECTS: SeedProject[] = [
  {
    title: 'Consultative Platform for Climate and Health in Africa (CAPCHA)',
    startYear: 2024,
    endYear: null,
    category: 'Climate and Health',
    description:
      'CAPCHA connects climate-health stakeholders across Africa and integrates real-time data with local needs to support coordinated, timely and context-specific climate-resilient health action.',
    milestones:
      'Launch of the Spotlight Series, Learning Curve, and CAPCHA Connect, establishing platforms for climate-health knowledge sharing, learning, and live stakeholder mapping and networking across Africa.',
    partners: ['Africa Climate and Health Alliance (ACHA)'],
    funders: ['Africa Research and Impact Network (ARIN)'],
    link: { title: 'CAPCHA Platform', url: 'https://capcha-arin-africa.org/' },
  },
  {
    title: 'Africa Climate and Health Responder Course',
    startYear: 2024,
    endYear: 2024,
    category: 'Climate and Health',
    description:
      'The 12-session course equips health professionals and stakeholders with practical skills to build climate-resilient, environmentally sustainable health systems and facilities, covering risk assessment, adaptation, mitigation, continuity of services, and advocacy.',
    milestones:
      'Developed and delivered the course, trained African climate-health responders, established an alumni network, and supported continued peer learning and application of skills in practice.',
    partners: [
      'Global Consortium on Climate and Health Education (GCCHE)',
      'Association of Schools of Public Health in Africa (ASPHA)',
      'World Health Organization Regional Office for Africa (WHO AFRO)',
      'Africa Centres for Disease Control and Prevention (Africa CDC)',
      'Climate and Health Africa Network for Collaboration and Engagement (CHANCE)',
    ],
    link: {
      title: 'Course page (Columbia Public Health)',
      url: 'https://www.publichealth.columbia.edu/africa-climate-health-responders-course',
    },
  },
  {
    title: 'Africa Climate-Resilient and Sustainable Health Systems and Facilities Course',
    startYear: 2026,
    endYear: null,
    category: 'Climate and Health',
    description:
      'The course strengthens health-sector capacity to build climate-resilient, environmentally sustainable and low-carbon health systems and facilities prepared for climate risks.',
    milestones:
      'Curriculum developed and first cohort trained, establishing practical learning, peer exchange and a growing network of professionals advancing climate-resilient and sustainable health systems across Africa.',
    partners: [
      'Global Consortium on Climate and Health Education (GCCHE)',
      'Association of Schools of Public Health in Africa (ASPHA)',
      'World Health Organization Regional Office for Africa (WHO AFRO)',
      'Africa Centres for Disease Control and Prevention (Africa CDC)',
      'Climate and Health Africa Network for Collaboration and Engagement (CHANCE)',
    ],
    link: {
      title: 'Course page (Columbia Public Health)',
      url: 'https://www.publichealth.columbia.edu/research/programs/global-consortium-climate-health-education/courses-trainings/africa-climate-resilient-sustainable-health-systems-facilities',
    },
  },
  {
    title: 'Small Farms, Small Businesses and Sustainable Food Security (SALSA)',
    startYear: 2016,
    endYear: 2020,
    category: 'Agriculture & Forestry',
    description:
      'SALSA examines how small farms and food businesses contribute to sustainable food security and resilient food systems across Europe and Africa, using satellite technologies, food-system mapping, transdisciplinary research and participatory foresight.',
    milestones:
      'Mapping small-farm and food-business systems; applying satellite and other advanced technologies to characterise food systems; conducting transdisciplinary stakeholder research; undertaking participatory foresight and scenario analysis; identifying pathways for more sustainable food systems; and generating actionable evidence and recommendations for improving food security and sustainability.',
    partners: [
      'Universidade de Évora, Portugal',
      'Università di Pisa, Italy',
      'Baltic Studies Centre, Riga, Latvia',
      'The James Hutton Institute, Scotland, UK',
      'Centre for Rural Research, Trondheim, Norway',
      'University of Agriculture in Krakow, Poland',
      'Universitat Politècnica de València, Spain',
      'International Institute for Environment and Development (IIED), London, UK',
      'Savannah Young Farmers Network, Tamale, Ghana',
      'ICRAF AWARD – African Women in Agricultural Research and Development, Nairobi, Kenya',
      'FAO – UN Food and Agriculture Organization, Research and Extension Unit, Rome, Italy',
      'Confederazione Nazionale Coldiretti, Rome, Italy',
    ],
    funders: ['European Commission'],
    link: { title: 'SALSA results (CORDIS)', url: 'https://cordis.europa.eu/project/id/677363/results' },
  },
  {
    title: 'Adaptation Research Alliance (ARA) Shared Learning on Climate Risks (ARA Micro-grants)',
    startYear: 2021,
    endYear: 2023,
    category: 'Cities & Resilience',
    description:
      'The project supported shared learning among community-focused organisations to develop climate risk maps for local action planning and policy influence in Mukuru informal settlement, Kenya.',
    milestones:
      'Brought frontier organisations and local communities together, shared and documented approaches to climate-risk assessment, jointly developed climate-risk maps for Mukuru, and used the resulting evidence to support locally led action planning and influence policy.',
    partners: ['Adaptation Research Alliance (ARA)'],
    funders: ['Foreign, Commonwealth and Development Office (FCDO)'],
  },
  {
    title: 'East Africa Economic Outlook',
    startYear: 2022,
    endYear: 2022,
    category: 'Climate Change & Energy',
    description:
      'This project aimed to contribute to the East Africa Economic Outlook, especially on areas of just transition pathways and financing.',
    funders: ['African Development Bank (AfDB)'],
  },
  {
    title: 'Kenya Innovation Outlook 2022',
    startYear: 2021,
    endYear: 2023,
    category: 'Technology & Innovation',
    description:
      'This report assessed Kenya’s innovation landscape by examining existing innovation activities, actors, systems and performance indicators. It sought to develop a Kenya-specific framework and set of indicators for tracking innovation performance, while bringing together evidence that could support government, researchers, investors and other stakeholders in making informed decisions. The report also provided a baseline and practical template for regularly monitoring and improving Kenya’s innovation ecosystem.',
    partners: ['Kenya National Innovation Agency (KeNIA)'],
    funders: ['UK Aid through the East Africa Research and Innovation Hub (EARIH)'],
  },
  {
    title: 'Mobilizing Development Finance for Strategic and Scaled-up Investment in Climate Adaptation',
    startYear: null,
    endYear: null,
    category: 'Climate Change & Energy',
    description:
      "The project aimed to assist multilateral development banks in increasing investments in adaptation actions aligned with each country's priorities. This helped integrate adaptation efforts into development finance, effectively addressing climate change challenges.",
    partners: [
      'Prakriti Resource Centre (Nepal)',
      'Libélula (Peru)',
      'African Centre for Technology Studies (ACTS)',
    ],
    funders: ['International Development Research Centre (IDRC)'],
  },
  {
    title: 'Political Economy Analysis on Air Quality in Nairobi City',
    startYear: 2022,
    endYear: 2022,
    category: 'Cities & Resilience',
    description:
      'This project aims to understand the political economy of air quality governance in Nairobi and to identify niches and partnerships for potential interventions.',
    milestones:
      'The study culminated in evidence-based recommendations for more coordinated, inclusive and gender-responsive air quality management, including the proposed strengthening of cross-sectoral coordination in Nairobi.',
    partners: [
      'Power Shift Africa',
      'Masinde Muliro University of Science and Technology (MMUST)',
      'World Resources Institute (WRI)',
    ],
    funders: ['World Resources Institute (WRI)'],
    link: {
      title: 'Published article (Frontiers in Environmental Health)',
      url: 'https://www.frontiersin.org/journals/environmental-health/articles/10.3389/fenvh.2025.1534700/full',
    },
  },
  {
    title: 'Understanding Loss and Damage as Climate Justice in Kenya',
    startYear: 2022,
    endYear: 2022,
    category: 'Climate Change & Energy',
    description:
      'This project aimed to understand the pathways to understanding loss and damage among pastoral communities in Kenya and to identify opportunities for enhancing climate justice.',
    funders: ['Oxfam through the Arid Lands Information Network (ALIN)'],
  },
  {
    title:
      'Sustaining and Strengthening City Climate Action in the COVID-19 Crisis for a Green and Climate-Resilient Recovery (ClimateCitiesRecovery)',
    startYear: null,
    endYear: null,
    category: 'Cities & Resilience',
    description:
      'This study investigates cities as potential drivers of green and climate-resilient recovery, seeking to identify factors that influence whether cities embark on low-carbon and resilient pathways, return to prior unsustainable pathways, or backtrack on climate commitments and head to unsustainable pathways. By comparing climate commitments of cities in developed and developing countries, we aim to challenge conventional paradigms about development and recovery from crises which often entail investments that lock-in high-carbon and unsustainable development. Our aim is to shed light on those factors that can be harnessed – and actions that can be taken – by individual cities and networks of cities, to support a green and climate-resilient recovery. The ARIN component surveyed small and medium-size enterprises in Africa and their efforts to adapt to climate change.',
    partners: [
      'German Development Institute / Deutsches Institut für Entwicklungspolitik (DIE)',
      'Middlesex University (MDX)',
      'Blavatnik School of Government, University of Oxford (BSG)',
      'McGill University',
      'TERI School of Advanced Studies (TERI-SAS)',
    ],
    funders: ['Global Center on Adaptation (GCA)'],
  },
  {
    title: 'Participatory Climate Risk Assessment in Africa’s Urban Informal Settlements: A Case of Mukuru in Nairobi',
    startYear: null,
    endYear: null,
    category: 'Cities & Resilience',
    description:
      'The project focused on the risk management theme, where risk assessment was conducted through a co-created participatory approach and the outcomes used to inform the slum upgrading programme and link to climate change action planning in Kenya. The project was also cross-cutting among themes such as health, infrastructure, housing and water resources. The climate risk assessment allowed the understanding of the climate hazards Mukuru is exposed to and their probability of occurrence alongside their historical, current and potential impacts — not only for risk management but also for health, infrastructure and livelihoods as the hazards interact with people and their livelihood-supporting systems. The core was city planning, which integrates all these themes in an attempt to make the city more resilient. The slum upgrading aims to influence infrastructure, health, food systems and other sectors, and the project set out to influence the slum upgrading processes through co-created action research, policy development and decision making.',
    partners: ['Slum Dwellers International (SDI)'],
    funders: ['Adaptation Research Alliance (ARA)'],
  },
  {
    title: 'Nairobi Risk Hub (Tomorrow’s Cities: Urban Risk in Transition)',
    startYear: null,
    endYear: null,
    category: 'Cities & Resilience',
    description:
      'The Nairobi Risk Hub project is part of the larger Urban Disaster Risk Hub (Tomorrow’s Cities), a five-year global interdisciplinary research hub funded by UK Research and Innovation (UKRI) Global Challenges Research Fund (GCRF). The aim of the project is to catalyse a transition from crisis management to multi-hazard risk-informed planning and decision-making for cities in low- and middle-income countries. Specifically, the Nairobi Risk Hub seeks to provide Nairobi with the capacity and policy framework that enables a shift from crisis response towards integrated development planning for enhanced disaster risk preparedness and management.',
    partners: [
      'Kounkuey Design Initiative (KDI)',
      'Nairobi City County',
      'University of Nairobi (UoN)',
      'Slum Dwellers International (SDI) Kenya',
      'Muungano wa Wanavijiji',
    ],
    funders: ['UK Research and Innovation (UKRI) Global Challenges Research Fund (GCRF)'],
  },
  {
    title: 'Science Engagement to Support Evidence-Informed Policy Responses to COVID-19 in Africa',
    startYear: null,
    endYear: null,
    category: 'Sustainable Development',
    description:
      "The project's objective was to provide evidence-based guidance for COVID-19 responses in Africa by conducting rapid evidence synthesis on health and socio-economic impacts. It aimed at promoting policy coherence at national, regional and continental levels by tailoring policy briefs to country-specific issues, drawing on local data and international best practice. The project also focused on establishing a learning platform to facilitate knowledge sharing and collaboration among African countries.",
    partners: [
      'Africa Centres for Disease Control and Prevention (Africa CDC)',
      'African Union Commission',
      'World Health Organization (WHO)',
      'East African Science and Technology Commission (EASTECO)',
      'West African Health Organisation (WAHO)',
      'African Institute for Development Policy (AFIDEP)',
      'Cochrane Network',
    ],
    funders: ['The African Academy of Sciences'],
  },
  {
    title: 'Re-addressing Equity through Evidence-Driven COVID-19 Recovery Planning',
    startYear: null,
    endYear: null,
    category: 'Sustainable Development',
    description:
      'The overarching objective was to enhance the uptake of research evidence, including studies supported by IDRC, on COVID-19. This was achieved by engaging and sensitizing knowledge users, particularly policymakers, about the existence and utility of this evidence. Concurrently, the project documented experiences and lessons learned to bolster the foundation for knowledge and practices related to COVID-19 in Africa.',
  },
  {
    title: 'Operationalisation of an Online Bridge for Strengthening Collaboration Between Industry and Academia in Kenya',
    startYear: null,
    endYear: null,
    category: 'Technology & Innovation',
    description:
      'The project purpose was to establish a virtual marketplace in Kenya that connects existing, emerging and future prototypes with investment, partnership and capacity building opportunities, in line with the objectives of the Africa Technology and Innovation Partnership. Specific objectives included refining the innovation portal, raising awareness, piloting its functionality and analysing interactions to improve the platform. Ultimately, the project aimed to foster productive partnerships between industry and academia to drive economic growth through innovative products and services.',
    partners: ['Kenya National Innovation Agency (KeNIA)'],
    funders: ['Foreign, Commonwealth and Development Office (FCDO)'],
  },
  {
    title: 'Technology Governance for Zambia',
    startYear: 2022,
    endYear: 2022,
    category: 'Technology & Innovation',
    description:
      'This project involved a rapid assessment of Zambia’s emerging technology landscape and governance, more specifically decision-making processes, prospects and funding mechanisms, and sought to identify opportunities for ushering in effective international partnerships to support Zambia’s technological pursuit.',
    funders: ['Foreign, Commonwealth and Development Office (FCDO)'],
  },
  {
    title: 'Assessment of Science, Technology and Innovation (STI) Metrics in Africa',
    startYear: null,
    endYear: null,
    category: 'Technology & Innovation',
    description:
      'The project aimed to develop an integrated set of indicators or a scoreboard to assess progress and performance in science, technology and innovation (STI) in African countries. It was motivated by the aspirations of many African countries to transition to sustainable industrialised economies by 2030 through STI, highlighting the importance of understanding which investments can contribute to this goal and align with the broader Sustainable Development Goals (SDGs).',
    partners: [
      'Science Policy Research Unit (SPRU), University of Sussex Business School, UK',
      'African Centre for Technology Studies (ACTS)',
    ],
    funders: ['Foreign, Commonwealth and Development Office (FCDO)'],
  },
  {
    title: 'Developing the East African Regional STI Indicators and Web-based Electronic Database',
    startYear: 2020,
    endYear: 2022,
    category: 'Technology & Innovation',
    description:
      'The project was based on a framework adapted from the study on assessing STI metrics in Africa, supported by the FCDO through the East Africa Hub. The study involved an in-depth review of relevant databases and existing STI scoreboards — such as AIO III, GII, the OECD scoreboard, the UNESCO Science Report, the RICYT scoreboard and national scoreboards, among others — to identify relevant STI indicators applicable to the East Africa region.',
    funders: ['East African Science and Technology Commission (EASTECO)'],
  },
  {
    title: 'ARIN-ASH Summer School on Sustainability 2021: Decolonizing Sustainability Research',
    startYear: 2021,
    endYear: 2021,
    category: 'Sustainable Development',
    description:
      'The ARIN-ASH Summer School aimed to build the capacity of early career researchers, practitioners and policy makers through a series of activities — calling for applications to join the annual school, publishing an annual volume, and a thematised training session — similar to the global hub’s initiatives to enhance capacity in the different regions.',
    partners: ['Africa Sustainability Hub (ASH)'],
    funders: ['Institute of Development Studies (IDS)'],
  },
];

const FOCUS_AREAS = [
  'Sustainable Development',
  'Climate Change & Energy',
  'Cities & Resilience',
  'Agriculture & Forestry',
  'Mining, Trade & Industry',
  'Technology & Innovation',
  'Climate and Health',
  'Forests & Ecosystems',
];

// Projects already on the site: focus area, status/end year, and the
// partners, funders, milestones and links from the spreadsheet. Matched by a
// distinctive title fragment; only fields that are still empty are filled in,
// so nothing entered in the dashboard is overwritten.
type ExistingProject = {
  match: string;
  category: string;
  status?: 'ongoing' | 'completed';
  endYear?: number;
  milestones?: string;
  partners?: string[];
  funders?: string[];
  link?: { title: string; url: string };
};

const EXISTING: ExistingProject[] = [
  { match: 'Adaptation Metrics:', category: 'Climate Change & Energy' },
  {
    match: 'African Population Cohorts Consortium',
    category: 'Climate and Health',
    status: 'ongoing',
    milestones:
      'The co-creation phase mapped 80+ population cohorts across 25 African countries and culminated in the APCC Charter and Blueprint, formally launching the consortium in May 2024 and securing a £4 million Wellcome renewal to establish a permanent Secretariat.',
    partners: ['African Population and Health Research Center (APHRC)', 'Africa Health Research Institute (AHRI)'],
    funders: ['Wellcome', 'Bill & Melinda Gates Foundation', 'UKRI Medical Research Council'],
  },
  {
    match: 'Communities of Practice for Transdisciplinary',
    category: 'Climate and Health',
    status: 'completed',
    endYear: 2024,
    milestones:
      'Continent-wide mapping of climate-health research, policy and stakeholder landscapes; consultative webinars with 411 participants; an online survey of 198 stakeholders; focus group discussions with 123 participants; 25 key-informant interviews; identification of priority barriers, capacity needs and models for transdisciplinary collaboration; validation of findings with diverse stakeholders; and the 2024 technical report and peer-reviewed research, providing evidence to strengthen climate-health Communities of Practice and transdisciplinary research and action in Africa.',
    partners: ['African Population and Health Research Center (APHRC)'],
    funders: ['Wellcome'],
  },
  {
    match: 'Locally-Led Adaptation Metrics',
    category: 'Climate Change & Energy',
    status: 'ongoing',
    endYear: 2027,
    milestones:
      'LAMA developed and tested locally relevant adaptation effectiveness metrics, generating evidence and recommendations to strengthen the measurement, learning and evaluation of locally led adaptation in Africa.',
    partners: [
      'Masinde Muliro University of Science and Technology (MMUST)',
      'Makerere University Business School (MUBS)',
      'University of Glasgow',
    ],
    funders: ['International Development Research Centre (IDRC)', 'Ministry of Foreign Affairs of the Netherlands'],
  },
  { match: 'ACAMI', category: 'Climate Change & Energy' },
  { match: 'Operationalising a Just Transition', category: 'Climate Change & Energy' },
  {
    match: 'LEEPS',
    category: 'Sustainable Development',
    status: 'ongoing',
    partners: [
      'African Institute for Development Policy (AFIDEP)',
      'Makerere University School of Women and Gender Studies (MakSWGS)',
      'African Institute for Health Policy and Health Systems, Nigeria',
    ],
    funders: ['International Development Research Centre (IDRC)'],
  },
  {
    match: 'Community-Based Measurement of Urban Heat',
    category: 'Cities & Resilience',
    funders: ['World Resources Institute (WRI)'],
  },
  {
    match: 'BioCAM4',
    category: 'Forests & Ecosystems',
    partners: [
      'York University',
      'German Institute of Development and Sustainability (IDOS)',
      'Radboud University',
      'Greater Virunga Transboundary Collaboration',
      'CATIE',
      'Solutions for Environment and Development',
    ],
    funders: ['Government of Canada’s New Frontiers in Research Fund (NFRF)'],
  },
  {
    match: 'JUCAN',
    category: 'Forests & Ecosystems',
    status: 'ongoing',
    endYear: 2029,
    partners: [
      'University of Nairobi (UoN)',
      'University of Copenhagen (UCPH)',
      'Danish Institute for International Studies (DIIS)',
    ],
    funders: ['Danish International Development Agency (DANIDA)'],
  },
  {
    match: 'Effectiveness of Climate Change Adaptation Interventions',
    category: 'Climate Change & Energy',
    partners: ['PricewaterhouseCoopers (PwC) Services'],
    funders: ['Foreign, Commonwealth and Development Office (FCDO)'],
  },
  {
    match: 'Math4CCR',
    category: 'Technology & Innovation',
    status: 'ongoing',
    endYear: 2026,
    milestones:
      'Trained African early-career researchers (ECRs); developed mathematical-AI (M-AI) champions; supported 10 mini-research grants; and promoted the institutionalisation of M-AI expertise across African research and policy spaces.',
    partners: ['University of Nairobi (UoN)'],
    funders: ['International Development Research Centre (IDRC)'],
  },
  {
    match: 'Long Rain-related Flooding',
    category: 'Cities & Resilience',
    status: 'completed',
    endYear: 2024,
    funders: ['World Resources Institute (WRI)'],
  },
  {
    match: 'NDC finance',
    category: 'Climate Change & Energy',
    status: 'completed',
    endYear: 2023,
    milestones:
      'Trained African researchers and policymakers in NDC financing; facilitated online seminars, peer learning and knowledge exchange; supported contributions to blogs, publications and reports on NDC finance; connected participants to international climate-finance networks; and strengthened an ongoing community for dialogue and sharing of good practices on financing climate commitments.',
    partners: ['Makerere University Business School (MUBS)', 'Frankfurt School of Finance & Management'],
    funders: ['International Development Research Centre (IDRC)'],
    link: {
      title: 'NDC Finance Fellowship (IDRC)',
      url: 'https://idrc-crdi.ca/en/what-we-do/projects-we-support/project/building-capacity-climate-action-ndc-finance-fellowship',
    },
  },
  { match: 'Funding Loss and Damage in African LDCs', category: 'Climate Change & Energy' },
  {
    match: 'Global Political Economy of Just Transitions',
    category: 'Mining, Trade & Industry',
    status: 'ongoing',
    milestones:
      'Mapping the political-economic forces shaping just transitions; assessing the influence of finance, investment, technology and trade; conducting comparative research in Kenya and Nigeria across energy, critical minerals and forests; engaging stakeholders on power, interests and justice; identifying climate justice risks and opportunities for African agency; and developing evidence and recommendations for locally grounded, equitable just transitions.',
    partners: [
      'University of Calabar',
      'Taraba State University',
      'University of Nairobi',
      'University of Bristol',
      'University of Cambridge',
    ],
    funders: ['British Academy'],
  },
  {
    match: 'State of Adaptation Report',
    category: 'Climate Change & Energy',
    funders: ['Africa Adaptation Initiative (AAI)'],
  },
];

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Milestones in the spreadsheet are one sentence, often a "; "-separated list.
// Lists become <li> items so the website renders them as numbered cards.
function milestonesHtml(text: string): string {
  const parts = text
    .replace(/^Key (project )?milestones( include)?:?\s*/i, '')
    .split(/;\s+(?:and\s+)?/)
    .map((s) => s.trim().replace(/\.$/, ''))
    .filter(Boolean);
  if (parts.length < 3) return `<p>${escapeHtml(text)}</p>`;
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return `<ul>${parts.map((s) => `<li>${escapeHtml(cap(s))}.</li>`).join('')}</ul>`;
}

const orgs = (names?: string[]) => (names || []).map((name) => ({ name }));

function toPayload(p: SeedProject) {
  return {
    title: p.title,
    author: 'ARIN',
    date: new Date(Date.UTC(p.startYear as number, 0, 1)),
    category: p.category,
    status: p.endYear === null ? 'ongoing' : 'completed',
    endYear: p.endYear ?? undefined,
    description: `<p>${escapeHtml(p.description)}</p>`,
    outputs: p.milestones ? milestonesHtml(p.milestones) : undefined,
    partners: orgs(p.partners),
    funders: orgs(p.funders),
    relatedInitiatives: p.link ? [{ title: p.link.title, url: p.link.url }] : [],
  };
}

async function bootstrap() {
  const apply = process.argv.includes('--apply');
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(ResearchProjectsService);

  const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const all: any[] = await service.findAll();
  const existing = new Set(all.map((p) => normalise(p.title || '')));

  console.log('— Existing projects —');
  for (const e of EXISTING) {
    const doc = all.find((p) => (p.title || '').toLowerCase().includes(e.match.toLowerCase()));
    if (!doc) {
      console.log(`NOT FOUND: "${e.match}"`);
      continue;
    }
    const patch: any = {};
    if (!FOCUS_AREAS.includes(doc.category)) patch.category = e.category;
    if (!doc.status && e.status) patch.status = e.status;
    if (doc.endYear == null && e.endYear) patch.endYear = e.endYear;
    const isEmptyHtml = (h?: string) => !h || !h.replace(/<[^>]*>/g, '').trim();
    if (isEmptyHtml(doc.outputs) && e.milestones) patch.outputs = milestonesHtml(e.milestones);
    if (!doc.partners?.length && e.partners) patch.partners = orgs(e.partners);
    if (!doc.funders?.length && e.funders) patch.funders = orgs(e.funders);
    if (e.link && !(doc.relatedInitiatives || []).some((r: any) => r.url === e.link!.url)) {
      const current = (doc.relatedInitiatives || []).map((r: any) => ({ title: r.title, description: r.description, url: r.url, image: r.image }));
      patch.relatedInitiatives = [...current, { title: e.link.title, url: e.link.url }];
    }
    if (!Object.keys(patch).length) {
      console.log(`SKIP (already set): "${doc.title}"`);
      continue;
    }
    if (apply) await service.update(doc._id.toString(), patch);
    console.log(`${apply ? 'UPDATED' : 'WOULD UPDATE'}: "${doc.title}" [${Object.keys(patch).join(", ")}]`);
  }

  console.log('\n— New projects —');
  const needsYear: string[] = [];
  for (const p of PROJECTS) {
    if (existing.has(normalise(p.title))) {
      console.log(`SKIP (already exists): "${p.title}"`);
      continue;
    }
    if (p.startYear === null) {
      needsYear.push(p.title);
      continue;
    }
    if (apply) {
      await service.create(toPayload(p));
      console.log(`CREATED: "${p.title}"`);
    } else {
      console.log(`WOULD CREATE: "${p.title}" [${p.category}]`);
    }
  }

  if (needsYear.length) {
    console.log('\nSKIPPED — no start year yet (fill `startYear` and re-run):');
    needsYear.forEach((t) => console.log(`  - ${t}`));
  }
  console.log(apply ? '\nDone.' : '\nDry run only. Re-run with --apply to write.');
  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
