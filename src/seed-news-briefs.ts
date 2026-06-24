import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NewsBriefService } from './news-briefs/news-brief.service';
import * as dotenv from 'dotenv';

dotenv.config();

// ─── Fellows briefs data ──────────────────────────────────────────────────────
const fellowsBriefs = [
  {
    id: 1,
    title: 'Enhancing Public Accountability committees (PACs):lessons from across Africa',
    date: 'April 8, 2025',
    category: 'Briefs',
    author: '',
    image: '',
    shortDescription: '',
    briefPreview: `Public Accountability Committees in many countries have been effective in their work for a long time. The general understanding of these committees can be based on their key terms; 'public' and 'accountability'. Public Accountability Committees enhance high levels of competence, reliability, and honesty in public sectors. Africa is one of the continents that has profoundly utilized Public Accountability Committees, especially in the financial management and regulation of service delivery.`,
    fullBriefLink: 'https://www.arin-africa.org/wp-content/uploads/2025/04/Evidence-Brief_PACs-2.pdf',
  },
  {
    id: 2,
    title: 'CLIMATE CHANGE AND GREENING OF WATER SECTOR FINANCING IN KENYA',
    date: 'January 21, 2025',
    category: 'Friday Reviews',
    author: 'Ms. Ann Nabangala Obae, ARIN Fellow and Principal Programme Officer Climate Change Water Sector Trust Fund',
    image: '/img/briefs/brief2.jpg',
    shortDescription: '',
    briefPreview: `Climate change poses a myriad of challenges to the water sector in Kenya. In response, there is an emphasis on embracing green technologies like solar pumping, gravity schemes, rainwater harvesting, water for livelihoods, and mangrove restoration. This however can only be achieved through government partnership with the private sector and financing of the Kenya Water Sector Trust Fund under the Ministry of Water Sanitation and Irrigation. On July 5th, 2024, Ms. Ann Nabangala Obae, ARIN Fellow and Principal Programme Officer Climate Change Water Sector Trust Fund, gave in-depth knowledge and insights on the above topic during the ARIN Friday Review.`,
    fullBriefLink: '',
  },
  {
    id: 3,
    title: 'LEVERAGING DATA SCIENCE TO SOLVE CRITICAL ENVIRONMENTAL CHALLENGES',
    date: 'January 21, 2025',
    category: 'Briefs',
    author: 'Mr. Meshach O. Aderele, Data Scientist and PhD Fellow at Land-Craft, Aarhus University, Denmark',
    image: '/img/briefs/brief3.jpg',
    shortDescription: '',
    briefPreview: `Environmental challenges are becoming increasingly complex, requiring innovative tools for understanding, managing, and mitigating human impact on the planet. The intersection of environmental science and data science, particularly the application of advanced technology such as artificial intelligence (AI), including its subset machine learning (ML), combined with remote sensing and geospatial analysis, has unlocked groundbreaking approaches to climate, deforestation, biodiversity loss, water management, and agricultural productivity.`,
    fullBriefLink: '',
  },
  {
    id: 4,
    title: 'IMPLEMENTATION OF MINI-GRID SYSTEMS TO BOOST ELECTRICITY DEMAND; A CASE STUDY OF INNOVATIVE ASPECTS OF THE UTILITIES 2.0 PROJECT IN KIWUMU VILLAGE, MUKONO DISTRICT',
    date: 'January 21, 2025',
    category: 'Friday Reviews',
    author: 'Dr. Mary Nantongo, Dr. Nicholas Mukisa, and Ms. Namono Maureen, lecturers at Makerere University',
    image: '/img/briefs/brief4.jpg',
    shortDescription: '',
    briefPreview: `Mini-grids are essential for Uganda's electrification efforts, providing electricity access to underserved areas. A study of the Utilities 2.0 project in Kiwumu Village explored the implementation of innovative mini-grid features and their impact on electricity demand in resource-constrained settings. The study found that a combination of centralized and decentralized models implemented through a consortium of electricity organizations was successful.`,
    fullBriefLink: '',
  },
  {
    id: 5,
    title: 'THE ROLE OF DATA ANALYTICS IN SHAPING EVIDENCE-BASED POLICIES.',
    date: 'January 21, 2025',
    category: 'Briefs',
    author: 'Mr. Onyekachi Nwafor, CEO of Katex Power Nigeria',
    image: '/img/briefs/brief5.jpg',
    shortDescription: '',
    briefPreview: `In this modern world, data analytics influences the creation and execution of evidence-based policies. Evidence-based policies, which are supported by data and actual evidence, are crucial for tackling complicated societal problems. Data analytics allows policymakers to examine extensive amounts of data, recognize trends, and make well-informed and prompt decisions.`,
    fullBriefLink: '',
  },
  {
    id: 6,
    title: 'INNOVATIVE FINANCING FOR CLIMATE-HEALTH RESEARCH IN AFRICA: CHALLENGES AND OPPORTUNITIES',
    date: 'January 21, 2025',
    category: 'Friday Reviews',
    author: 'Mr. Maanzou Boukari, ARIN Fellow',
    image: '/img/briefs/brief6.jpg',
    shortDescription: '',
    briefPreview: `Climate change is a mounting threat to public health in Africa, exacerbating existing vulnerabilities and imposing new challenges on the health systems. The Intergovernmental Panel on Climate Change (IPCC, 2022) underscores the continent's high susceptibility to climate-related health impacts, including the surge in vector-borne diseases, water scarcity, and food insecurity.`,
    fullBriefLink: '',
  },
  {
    id: 7,
    title: 'DECENTRALIZED ENERGY SYSTEMS: A PATHWAY TO BRIDGING THE ENERGY DEFICIT IN AFRICA',
    date: 'January 21, 2025',
    category: 'Friday Reviews',
    author: 'Onyekachi Nwafor, ARIN Fellow and CEO at KatexPower, Nigeria',
    image: '/img/briefs/brief7.jpg',
    shortDescription: '',
    briefPreview: `Africa faces a persistent energy deficit with over 600 million people lacking reliable access to electricity. This energy gap hinders economic growth, social development and quality of life across the region. Traditional centralized energy systems have struggled to meet the growing demand, leaving vast areas in darkness.`,
    fullBriefLink: '',
  },
  {
    id: 8,
    title: 'THE ROLE OF RENEWABLE ENERGY TRANSFORMATION; A SHORT AND LONG-RUN ANALYSIS IN WEST AFRICA',
    date: 'January 21, 2025',
    category: 'Friday Reviews',
    author: 'Dr. Faye Gueye, Lecturer at the Public Policy Institute, Dakar, Senegal',
    image: '/img/briefs/brief8.jpg',
    shortDescription: 'An analysis of renewable energy transformation factors and the importance of renewable energy sources in West Africa\'s sustainable development.',
    briefPreview: `Energy is a cornerstone of development. A reliable, secure, and affordable energy supply is essential for socioeconomic growth and poverty alleviation in any country. However, despite the acknowledgment role of energy in economic growth, per capita energy consumption in Africa remains stagnant. This review examined the factors driving energy transition and analyzed the importance of renewable energy in West Africa's energy transformation.`,
    fullBriefLink: '',
  },
  {
    id: 9,
    title: "BALANCING FOSSIL FUEL WEALTH AND RENEWABLE AMBITIONS; AFRICA'S PATH TO A JUST ENERGY TRANSITION",
    date: 'January 21, 2025',
    category: 'Friday Reviews',
    author: 'Mr Sammy Jamar, energy consultant and Arin Fellow',
    image: '/img/briefs/brief9.jpg',
    shortDescription: '',
    briefPreview: `As the world accelerates towards a renewable energy future, Africa is at a crossroads. While developed nations actively invest in clean energy, the continent lags, hindered by limited policies and funding. Ironically, Africa is also experiencing a surge in fossil discoveries, presenting a unique challenge.`,
    fullBriefLink: '',
  },
  {
    id: 10,
    title: 'SMART ENERGY FINANCING IN AFRICA: CHALLENGES AND OPPORTUNITIES',
    date: 'January 21, 2025',
    category: 'Friday Reviews',
    author: 'Mr. Peter Onyilo, of Axiomata Technologies Limited, Nigeria',
    image: '/img/briefs/brief10.jpg',
    shortDescription: '',
    briefPreview: `Africa faces significant challenges in achieving universal energy access and meeting its climate change goals due to underinvestment in the energy sector. The continent attracts only 3% of global energy investment, far below what is needed to reach sustainable development targets and universal energy access by 2030.`,
    fullBriefLink: '',
  },
  {
    id: 11,
    title: 'Urban Green Infrastructure for Climate Change Adaptation',
    date: 'January 1, 2025',
    category: 'Climate',
    author: '',
    image: '/img/briefs/1.png',
    shortDescription: 'Examines the effectiveness of mainstreaming Urban Green Infrastructure for climate change adaptation in Nairobi, Kenya, exploring how integrating natural systems into urban planning can protect vulnerable city dwellers.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 12,
    title: "Coffee Farmers' Adaptation Strategies to Climate Change in Northern Uganda",
    date: 'January 1, 2025',
    category: 'Agriculture',
    author: '',
    image: '/img/briefs/2.png',
    shortDescription: 'Investigates climate adaptation strategies used by coffee farmers in Northern Uganda, identifying critical socio-economic factors influencing adoption to inform policies that bolster resilience and improve productivity.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 13,
    title: 'Carbon Stock Dynamics and Forest Zonation in the Yayu Coffee Forest Biosphere Reserve',
    date: 'February 1, 2025',
    category: 'Biodiversity',
    author: '',
    image: '/img/briefs/3.png',
    shortDescription: 'Reveals that forest zonation significantly dictates carbon storage capacity across core, buffer, and transitional zones in the Yayu Coffee Forest Biosphere Reserve, providing essential data for regional environmental policy.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 14,
    title: 'Assessment of Nature-Based Solutions for Flood Risk Mitigation in the River Nyamwamba Catchment, Uganda',
    date: 'February 1, 2025',
    category: 'Climate',
    author: '',
    image: '/img/briefs/4.png',
    shortDescription: 'Investigates household socio-economic factors influencing Nature-Based Solutions adoption in Uganda\'s mountainous River Nyamwamba catchment, highlighting the critical intersection of economic stability and risk perception in disaster management.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 15,
    title: 'Local Feeding Practices to Mitigate Enteric Methane Emissions in Sub-Saharan Livestock',
    date: 'March 1, 2025',
    category: 'Agriculture',
    author: '',
    image: '/img/briefs/5.png',
    shortDescription: 'Demonstrates that integrating local cereal and legume co-products into livestock diets significantly reduces enteric methane emissions without sacrificing animal performance, offering a scalable sustainable pathway for Sub-Saharan agro-pastoralists.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 16,
    title: 'Evaluation of Soil Moisture Variability in Relation to Land Use and Land Cover Changes: The Case of Southwest Ethiopia',
    date: 'April 1, 2025',
    category: 'Climate',
    author: '',
    image: '/img/briefs/6.png',
    shortDescription: 'Examines how dramatic land use and land cover changes in Southwest Ethiopia over thirty years have deteriorated soil moisture and vegetation health, providing critical insights for policies prioritizing reforestation and sustainable land management.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 17,
    title: 'Leveraging Cash Transfers to Mitigate Energy Poverty Among Refugees in Uganda: Distributional Insights and Gendered Lens',
    date: 'May 1, 2025',
    category: 'Energy',
    author: '',
    image: '/img/briefs/7.png',
    shortDescription: 'Evaluates the impact of cash transfers on the Multidimensional Energy Poverty Index among South Sudanese refugees in Uganda, highlighting the vital gendered benefits of direct financial assistance for bridging the energy access gap.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 18,
    title: 'AquaPhage: Sustainable Management of Cyanobacterial Blooms Using Bacteriophages',
    date: 'May 1, 2025',
    category: 'Health',
    author: '',
    image: '/img/briefs/8.png',
    shortDescription: 'Introduces AquaPhage, an eco-friendly solution using bacteriophages to precisely control harmful cyanobacterial blooms in water bodies, improving water quality for drinking, agriculture, and aquaculture while preserving biodiversity.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 19,
    title: 'Assessment of Nexus Between Climate Change and Mental Health in Sub-Saharan Africa: Case Study of Kajiado County, Kenya',
    date: 'June 1, 2025',
    category: 'Health',
    author: '',
    image: '/img/briefs/9.png',
    shortDescription: 'Investigates the climate-mental health nexus among 100 farmers in Kajiado County, Kenya, finding that 92.4% recognize climate change impacts mental health, with food insecurity and unpredictable weather as primary psychological stressors.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 20,
    title: 'Agentic Adaptation: Empowering Resilience and Leveraging Artificial Intelligence for Climate Adaptation in Vulnerable Communities',
    date: 'June 1, 2025',
    category: 'Climate',
    author: '',
    image: '/img/briefs/10.png',
    shortDescription: 'Explores agentic adaptation combining community-driven decision-making with AI to enhance at-risk populations\' capacity in Nigeria and West Africa to anticipate and recover from climate-induced disruptions.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 21,
    title: 'Enhancing Evidence-Informed Policymaking for the Energy and Human Health Nexus: A Case Study of Western Kenya',
    date: 'July 1, 2025',
    category: 'Energy',
    author: '',
    image: '/img/briefs/11.png',
    shortDescription: 'Evaluates leadership, technical capacities, and tools facilitating Evidence-Informed Policymaking for the energy-health nexus in Western Kenya, providing a roadmap for overcoming institutional barriers to sustainable change.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 22,
    title: 'Enhancing Evidence-Informed Policymaking for the Energy and Human Health Nexus: A Case Study of Western Kenya (Vol. 2)',
    date: 'July 1, 2025',
    category: 'Energy',
    author: '',
    image: '/img/briefs/12.png',
    shortDescription: 'A follow-up review examining the integration of energy access and human health through Evidence-Informed Policymaking in Western Kenya, identifying systemic barriers and pathways for culturally resonant, scientifically sound policymaking.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 23,
    title: 'Building Effective Communities of Practice for Transdisciplinary Research and Action in Climate Change and Health in Africa',
    date: 'September 1, 2025',
    category: 'Health',
    author: '',
    image: '/img/briefs/13.png',
    shortDescription: "Advocates for transdisciplinary Communities of Practice to address Africa's diverse climate-driven health threats — from desertification in the north to flooding in the east — requiring targeted, integrated research and policy responses.",
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 24,
    title: 'Climate-smart Resilience in Livestock: An Exploration of the Livestock Pass-on Programmes in Phalombe District, Malawi',
    date: 'September 1, 2025',
    category: 'Agriculture',
    author: '',
    image: '/img/briefs/14.png',
    shortDescription: 'Evaluates livestock pass-on initiatives in Phalombe, Malawi, finding they strengthen household assets, climate resilience, and rural livelihoods while recommending hybrid management models for long-term sustainability.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 25,
    title: 'Breaking Governance Silos to Achieve Zero Hunger: Institutional Pathways for Food Security in Kenya',
    date: 'February 13, 2026',
    category: 'Governance',
    author: '',
    image: '/img/briefs/15.png',
    shortDescription: "Examines how fragmented governance structures undermine Kenya's Zero Hunger progress in ASAL regions, proposing an integrated governance framework that strengthens multi-sectoral coordination, financing alignment, and accountability.",
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 26,
    title: 'Climate-smart Resilience in Livestock: An Exploration of the Livestock Pass-on Programmes in Phalombe District, Malawi (February 2026 Edition)',
    date: 'February 20, 2026',
    category: 'Agriculture',
    author: '',
    image: '/img/briefs/16.png',
    shortDescription: 'An expanded assessment of livestock pass-on programmes in Phalombe District, Malawi, demonstrating how hybrid livestock management and strengthened community awareness build durable climate resilience for rural households.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 27,
    title: 'Leveraging Self-Help Groups\' Synergy on Resilience to Climate Change and Sustainable Livelihoods in Nyakach Sub County, Kenya',
    date: 'February 20, 2026',
    category: 'Climate',
    author: '',
    image: '/img/briefs/17.png',
    shortDescription: 'Assesses the contribution of Self-Help Groups to building climate resilience, income diversification, and sustainable livelihoods among rural households in Nyakach Sub County, Kenya through collective action and knowledge sharing.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 28,
    title: 'Adoption of Climate-Smart Livestock Practices in Benin',
    date: 'March 6, 2026',
    category: 'Agriculture',
    author: '',
    image: '/img/briefs/18.png',
    shortDescription: 'Investigates determinants of climate-smart livestock practice adoption among 460 farmers in Benin, finding that education and farmer cooperative membership significantly increase adoption rates and resilience outcomes.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 29,
    title: 'Optimising Synergies Between Forest Landscape Restoration and Climate Smart Livestock Practices in the Republic of Guinea',
    date: 'March 6, 2026',
    category: 'Biodiversity',
    author: '',
    image: '/img/briefs/19.png',
    shortDescription: 'Assesses opportunities to integrate forest landscape restoration with climate-smart livestock practices in Guinea, demonstrating significant potential to restore degraded ecosystems and strengthen rural livelihoods through inclusive governance.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 30,
    title: 'Strengthening the Policy–Research Nexus to Address SDG Trade-offs and Synergies in Climate-Smart Agriculture in Kenya',
    date: 'March 13, 2026',
    category: 'Governance',
    author: '',
    image: '/img/briefs/20.png',
    shortDescription: 'Assesses the integration of Climate-Smart Agriculture within Kenya\'s national and county policy frameworks, finding strong alignment with SDG 13 and SDG 2 but persistent implementation gaps requiring stronger accountability and institutional coordination.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 31,
    title: 'The Work of NGOs and Donor Funding: Alignment with National Land Restoration Strategies in Malawi',
    date: 'March 13, 2026',
    category: 'Governance',
    author: '',
    image: '/img/briefs/21.png',
    shortDescription: "Investigates how donor-funded NGO landscape restoration initiatives align with Malawi's National Forest Landscape Restoration Strategy, recommending stronger policy alignment, improved monitoring, and enhanced institutional coordination.",
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 32,
    title: 'Multi-level Study of Interactions with SDG2 (Zero Hunger): The Challenge of Climate-Smart Livestock in Kenya',
    date: 'March 20, 2026',
    category: 'Governance',
    author: '',
    image: '/img/briefs/22.png',
    shortDescription: 'Examines how governance alignment influences climate-smart livestock integration into Kenya\'s food security strategies, recommending polycentric governance to manage SDG trade-offs and strengthen policy coherence across arid regions.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 33,
    title: 'Community Peace Dialogues as Pathways to Sustainable Development: Lessons from the Luo–Kipsigis Border Conflict in Kenya',
    date: 'April 10, 2026',
    category: 'Governance',
    author: '',
    image: '/img/briefs/23.png',
    shortDescription: 'Explores how community peace dialogues contribute to peacebuilding and sustainable development in the protracted Luo–Kipsigis border conflict, identifying dialogue committees as critical platforms for rebuilding trust and social cohesion.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 34,
    title: 'Peacebuilding and Sustainable Development: Strengthening Community Dialogue for Lasting Social Cohesion in Kenya',
    date: 'April 10, 2026',
    category: 'Governance',
    author: '',
    image: '/img/briefs/24.png',
    shortDescription: 'Examines how structured community peace dialogue committees supported by coordinated stakeholder action create durable solutions to the Luo–Kipsigis border conflict, promoting resilient governance and long-term sustainable development.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 35,
    title: 'Child-Driven Accountability in Climate Governance: Advancing Inclusive Decision-Making in Harare',
    date: 'April 24, 2026',
    category: 'Governance',
    author: '',
    image: '/img/briefs/25.png',
    shortDescription: 'Explores how children actively contribute to climate governance in Harare through local knowledge, environmental stewardship, and collective action, despite being largely excluded from formal decision-making and accountability processes.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 36,
    title: 'Strengthening Accountability in Rural Climate Adaptation Governance',
    date: 'May 8, 2026',
    category: 'Governance',
    author: '',
    image: '/img/briefs/26.png',
    shortDescription: 'Examines how accountability operates within rural climate adaptation initiatives using evidence from the AICCRA programme in Northern Ghana, finding that horizontal farmer accountability and inclusive governance improve adaptation outcomes.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 37,
    title: 'Modelling the Suitability of Agroecological Zones for Sorghum Cultivation Based on GIS Multi-Criteria Analysis in Western Kenya',
    date: 'May 22, 2026',
    category: 'Agriculture',
    author: '',
    image: '/img/briefs/27.png',
    shortDescription: 'Assesses the agroecological suitability of sorghum cultivation in Western Kenya using GIS-integrated Multi-Criteria Decision Analysis, finding 16.9% highly suitable and 74.6% moderately suitable land for climate-resilient food production.',
    briefPreview: '',
    fullBriefLink: '',
  },
  {
    id: 38,
    title: "Quantification and Recovery Potential of Fugitive Methane Emissions in Nigeria's Oil and Gas Industry",
    date: 'June 12, 2026',
    category: 'Energy',
    author: '',
    image: '/img/briefs/28.png',
    shortDescription: "Evaluates the recovery potential of fugitive methane emissions from Nigeria's upstream oil and gas industry, demonstrating the techno-economic feasibility of methane recovery technologies to reduce emissions and support cleaner energy transitions.",
    briefPreview: '',
    fullBriefLink: '',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDate(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? undefined : d;
}

function mapToNewsBrief(b: typeof fellowsBriefs[0]) {
  const description = (b.briefPreview || b.shortDescription || b.title).trim();
  const authors = b.author ? [b.author] : [];
  const datePosted = parseDate(b.date);
  const year = datePosted ? datePosted.getFullYear() : undefined;
  const availableResources = b.fullBriefLink ? [b.fullBriefLink] : [];
  const coverImage = b.image || undefined;

  return {
    title: b.title,
    description,
    authors,
    coverImage,
    datePosted,
    year,
    availableResources,
    category: b.category,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(NewsBriefService);

  const existing = await service.findAll();
  const existingTitles = new Set(existing.map((b: any) => b.title));

  let created = 0;
  let skipped = 0;

  for (const brief of fellowsBriefs) {
    if (existingTitles.has(brief.title)) {
      console.log(`SKIP (already exists): ${brief.title.substring(0, 60)}…`);
      skipped++;
      continue;
    }

    await service.create(mapToNewsBrief(brief));
    console.log(`SEEDED [${brief.category}]: ${brief.title.substring(0, 60)}…`);
    created++;
  }

  console.log(`\nDone — ${created} seeded, ${skipped} skipped.`);
  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
