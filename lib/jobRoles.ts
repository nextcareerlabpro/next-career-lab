export interface JobRole {
  slug: string;
  roleName: string;
  title: string;
  shortDescription: string;
  metaDescription: string;
  category: string;
  experienceLevel: 'Fresher / 0-2 Yrs' | 'Mid-Level (2-5 Yrs)' | 'Senior (5+ Yrs)';
  salaryInsight: {
    indiaAvg: string;
    globalAvg: string;
  };
  targetKeywords: string[];
  hardSkills: string[];
  softSkills: string[];
  actionVerbs: string[];
  summaryFormula: {
    template: string;
    example: string;
  };
  bulletFormula: {
    formulaName: string;
    badExample: string;
    badReason: string;
    goodExample: string;
    goodReason: string;
  };
  recruiterRedFlags: string[];
  faqs: { question: string; answer: string }[];
}

export const jobRoles: JobRole[] = [
  {
    slug: 'software-engineer-fresher',
    roleName: 'Software Engineer Fresher',
    title: 'Software Engineer Fresher ATS Resume Guide & Template (2026)',
    shortDescription: 'ATS-optimized resume framework for B.Tech/BCA/MCA fresh graduates and entry-level coders.',
    metaDescription: 'Boost your ATS score for Software Engineer Fresher roles. Get top technical keywords, GitHub project bullet formulas, and pass campus & off-campus hiring filters.',
    category: 'Engineering & Tech',
    experienceLevel: 'Fresher / 0-2 Yrs',
    salaryInsight: {
      indiaAvg: '₹4.5L - ₹9.5L / year',
      globalAvg: '$65,000 - $95,000 / year'
    },
    targetKeywords: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (OOP)',
      'REST APIs',
      'Git / GitHub Version Control',
      'SQL / Relational Databases',
      'System Design Basics',
      'Unit Testing',
      'CI/CD Pipelines'
    ],
    hardSkills: [
      'Java / Python / C++',
      'JavaScript / TypeScript',
      'React.js / Node.js',
      'PostgreSQL / MySQL / MongoDB',
      'Docker Basics',
      'Linux Shell Scripting'
    ],
    softSkills: [
      'Analytical Problem Solving',
      'Agile Team Collaboration',
      'Code Review Receptivity',
      'Fast Learner & Adaptability'
    ],
    actionVerbs: ['Architected', 'Implemented', 'Refactored', 'Deployed', 'Optimized', 'Integrated', 'Automated'],
    summaryFormula: {
      template: '[Degree/Specialization] graduate with practical experience building [Key Project Types] using [Core Tech Stack]. Proven ability in solving 300+ LeetCode problems and deploying full-stack web applications with [Quantifiable metric].',
      example: 'Computer Science graduate with hands-on experience building distributed web applications in React, Node.js, and PostgreSQL. Solved 350+ algorithmic challenges and deployed 3 production-grade open-source tools with 1,200+ monthly active users.'
    },
    bulletFormula: {
      formulaName: 'Google XYZ Formula (Accomplished [X] as measured by [Y] by doing [Z])',
      badExample: 'Worked on a food delivery website using React and Node.js for final year project.',
      badReason: 'Vague, no metrics, passive phrasing, sounds like a school assignment instead of engineering.',
      goodExample: 'Engineered a real-time order-tracking microservice using Node.js and Redis, reducing latency by 42% and successfully handling 500+ simulated concurrent requests.',
      goodReason: 'Quantified latency drop (42%), demonstrates high concurrency load, and lists modern backend stack.'
    },
    recruiterRedFlags: [
      'Listing generic skills like "MS Office", "Windows 10", or "Internet Browsing"',
      'No live demo links or active GitHub repository URLs for highlighted projects',
      'Writing an outdated "Objective Statement" instead of a technical summary',
      'Using double-column graphic canvas templates that fail ATS OCR text parsing'
    ],
    faqs: [
      {
        question: 'How should a fresher format a software engineer resume without corporate experience?',
        answer: 'Place your Technical Skills matrix directly below your Professional Summary, followed immediately by a dedicated Projects section. Highlight 2-3 production-quality projects with GitHub and live demo links, quantifying performance metrics.'
      },
      {
        question: 'Which ATS keywords are mandatory for entry-level developers in 2026?',
        answer: 'Essential keywords include Data Structures, Algorithms, RESTful APIs, Git, Unit Testing, Relational Databases (PostgreSQL/MySQL), and specific languages (Python, Java, or TypeScript).'
      },
      {
        question: 'Should I include my LeetCode or HackerRank rating on my resume?',
        answer: 'Yes! If you have solved 250+ problems or achieved a notable contest rating (e.g., top 15% or Knight badge), include a 1-line callout under Achievements with a clickable profile link.'
      }
    ]
  },
  {
    slug: 'data-analyst',
    roleName: 'Data Analyst',
    title: 'Data Analyst Resume Guide: High-Scoring ATS Keywords & Bullets (2026)',
    shortDescription: 'Tailored for BI analysts, SQL wizards, and visualization specialists targeting high-growth teams.',
    metaDescription: 'Optimize your Data Analyst resume with targeted SQL, Tableau, PowerBI keywords, and revenue-impacting metric formulas. Free ATS instant scan available.',
    category: 'Data & Analytics',
    experienceLevel: 'Mid-Level (2-5 Yrs)',
    salaryInsight: {
      indiaAvg: '₹6.5L - ₹14L / year',
      globalAvg: '$75,000 - $110,000 / year'
    },
    targetKeywords: [
      'Advanced SQL (Window Functions, CTEs)',
      'Data Visualization & Storytelling',
      'Power BI / Tableau Dashboarding',
      'Python (Pandas, NumPy, Matplotlib)',
      'A/B Testing & Statistical Hypothesis Testing',
      'ETL Pipeline Optimization',
      'Cohort & Churn Analysis',
      'KPI Benchmarking'
    ],
    hardSkills: [
      'SQL (PostgreSQL, BigQuery, Snowflake)',
      'Power BI / Tableau / Looker',
      'Python / R',
      'Excel (VBA, Power Query, Pivot)',
      'dbt / Airflow basics',
      'Git'
    ],
    softSkills: [
      'Cross-functional Business Translation',
      'Stakeholder Presentation',
      'Critical Thinking',
      'Data Integrity Vigilance'
    ],
    actionVerbs: ['Analyzed', 'Automated', 'Forecasted', 'Visualized', 'Synthesized', 'Engineered', 'Identified'],
    summaryFormula: {
      template: 'Data Analyst with [X] years of experience extracting actionable business intelligence from complex multi-million row datasets. Specialized in [SQL/PowerBI/Python], driving a [Y%] increase in [Business Outcome] across [Domain].',
      example: 'Results-driven Data Analyst with 3+ years of experience transforming raw transactional data into executive decision models. Expert in PostgreSQL, BigQuery, and Tableau, delivering reporting automation that saved 18 hours/week of manual auditing.'
    },
    bulletFormula: {
      formulaName: 'STAR Metric Formula (Situation -> Task -> Action -> Result)',
      badExample: 'Created weekly sales dashboards and ran SQL queries for senior management.',
      badReason: 'Does not explain what business insights were discovered or what financial impact was achieved.',
      goodExample: 'Architected automated Tableau dashboards queried against BigQuery, identifying a 14% drop-off in the checkout funnel and saving ₹22L in annual churn.',
      goodReason: 'Directly pairs technical tools (BigQuery/Tableau) with quantifiable business revenue impact.'
    },
    recruiterRedFlags: [
      'Only listing "Excel and SQL" without specifying complex functions (CTEs, Window Functions)',
      'Omitting the business context: numbers without dollar or percentage outcomes',
      'Having no portfolio link (GitHub data projects, Kaggle notebooks, or public Tableau profile)',
      'Using image screenshots of graphs instead of textual bullet accomplishments'
    ],
    faqs: [
      {
        question: 'What is the most critical technical skill recruiters test on a Data Analyst resume?',
        answer: 'Advanced SQL proficiency. Ensure your bullet points mention specific SQL capabilities like Window Functions, multi-table joins, CTEs, and query indexing optimizations.'
      },
      {
        question: 'How do I quantify accomplishments if my company data was confidential?',
        answer: 'Use percentage changes, relative operational metrics, and time savings. For example: "Reduced monthly reporting cycle time by 45%" or "Identified anomaly clusters improving forecast accuracy by 18%".'
      }
    ]
  },
  {
    slug: 'product-manager',
    roleName: 'Product Manager',
    title: 'Product Manager ATS Resume Guide: Metrics, Keywords & Frameworks (2026)',
    shortDescription: 'High-impact resume framework for Associate PMs, Technical PMs, and Senior Product Managers.',
    metaDescription: 'Stand out in competitive PM recruitment. Discover high-scoring ATS keywords for Product Management: PRDs, OKRs, customer retention, and unit economics.',
    category: 'Product & Strategy',
    experienceLevel: 'Mid-Level (2-5 Yrs)',
    salaryInsight: {
      indiaAvg: '₹14L - ₹28L / year',
      globalAvg: '$115,000 - $165,000 / year'
    },
    targetKeywords: [
      'Product Lifecycle Management (PLM)',
      'Go-To-Market (GTM) Strategy',
      'OKRs & KPI Tracking',
      'User Research & Usability Testing',
      'Agile / Scrum Sprint Leadership',
      'Roadmap Prioritization (RICE/MoSCoW)',
      'Customer Acquisition Cost (CAC) & LTV',
      'Conversion Rate Optimization (CRO)'
    ],
    hardSkills: [
      'Jira / Confluence / Linear',
      'Mixpanel / Amplitude / Google Analytics 4',
      'Figma / Wireframing',
      'SQL for Product Analytics',
      'A/B Testing Frameworks (Optimizely, LaunchDarkly)',
      'PRD Documentation'
    ],
    softSkills: [
      'Influence Without Authority',
      'Executive Stakeholder Management',
      'Customer Empathy',
      'Strategic Decision Making'
    ],
    actionVerbs: ['Spearheaded', 'Launched', 'Scaled', 'Iterated', 'Pioneered', 'Streamlined', 'Negotiated'],
    summaryFormula: {
      template: 'Product Manager with [X] years of experience driving [0-to-1 or Scale] products from ideation to commercial launch. Led cross-functional squads of [Y] engineers and designers, accelerating [Core North Star Metric] by [Z%].',
      example: 'Product Manager with 4 years of experience driving 0-to-1 SaaS feature launches. Led a cross-functional squad of 11 engineers and UX designers to build an AI onboarding workflow, lifting user Day-30 retention from 22% to 41%.'
    },
    bulletFormula: {
      formulaName: 'Problem-Solution-Outcome Framework',
      badExample: 'Responsible for writing user stories and prioritizing the engineering sprint backlog.',
      badReason: 'Describes routine job duties rather than business ownership and strategic impact.',
      goodExample: 'Spearheaded self-serve team billing feature from PRD to GTM, slashing enterprise sales friction and contributing ₹45L in incremental ARR within 90 days of launch.',
      goodReason: 'Highlights end-to-end product ownership and ties execution directly to ARR growth.'
    },
    recruiterRedFlags: [
      'Writing a resume full of buzzwords ("visionary", "passionate") without concrete business KPIs',
      'Focusing exclusively on engineering tasks instead of user outcomes and revenue drivers',
      'Failing to specify cross-functional team scale (squad size, designer & engineer count)'
    ],
    faqs: [
      {
        question: 'What is the biggest mistake PMs make on their resumes?',
        answer: 'Focusing on feature delivery ("Shipped feature X on time") rather than customer adoption and business results ("Shipped feature X, increasing checkout conversion by 23%").'
      },
      {
        question: 'Should a Product Manager include code or technical skills?',
        answer: 'Yes, basic technical fluency (SQL, API architecture, data schemas) signals strong collaboration capability with engineering leaders.'
      }
    ]
  },
  {
    slug: 'devops-cloud-engineer',
    roleName: 'DevOps & Cloud Engineer',
    title: 'DevOps & Cloud Engineer ATS Resume: Kubernetes, CI/CD, AWS/GCP (2026)',
    shortDescription: 'Infrastructure, SRE, and Cloud platform resume optimization for modern cloud architectures.',
    metaDescription: 'Optimize your DevOps resume for top tech screening. High-ranking keywords for Docker, Kubernetes, Terraform, AWS, Prometheus, and 99.99% uptime metrics.',
    category: 'Cloud & Infrastructure',
    experienceLevel: 'Mid-Level (2-5 Yrs)',
    salaryInsight: {
      indiaAvg: '₹8.5L - ₹20L / year',
      globalAvg: '$95,000 - $145,000 / year'
    },
    targetKeywords: [
      'Infrastructure as Code (IaC) - Terraform',
      'Container Orchestration (Kubernetes / EKS / GKE)',
      'CI/CD Pipeline Automation (GitHub Actions / GitLab CI)',
      'Observability & APM (Prometheus, Grafana, Datadog)',
      'Cloud Architecture (AWS / GCP / Azure)',
      'Zero-Downtime Deployment (Blue-Green / Canary)',
      'Site Reliability Engineering (SRE) & SLOs',
      'Linux Kernel & Network Security'
    ],
    hardSkills: [
      'Terraform / Ansible / Helm',
      'Docker / Kubernetes',
      'AWS (EC2, S3, RDS, Lambda, IAM) / GCP',
      'Bash / Python Automation',
      'GitLab CI / GitHub Actions / Jenkins',
      'Prometheus / Grafana / ELK Stack'
    ],
    softSkills: [
      'Incident Post-Mortem Leadership',
      'On-Call Calm Under Pressure',
      'DevSecOps Collaboration',
      'Cost Governance & Optimization'
    ],
    actionVerbs: ['Provisioned', 'Automated', 'Migrated', 'Hardened', 'Orchestrated', 'Minimized', 'Standardized'],
    summaryFormula: {
      template: 'Cloud & DevOps Engineer with [X] years of experience automating scalable multi-cloud infrastructure and high-availability CI/CD pipelines. Decreased deployment cycle times by [Y%] while upholding [99.99%] uptime SLA.',
      example: 'DevOps Engineer with 3.5 years of experience designing secure AWS infrastructure using Terraform and Kubernetes. Automated zero-downtime deployment pipelines for 24 microservices, reducing deployment lead time from 4 hours to 12 minutes.'
    },
    bulletFormula: {
      formulaName: 'DORA Metric Impact Formula (Deployment Frequency, Lead Time, MTTR, Change Failure Rate)',
      badExample: 'Set up Jenkins pipelines and maintained EC2 instances on AWS cloud.',
      badReason: 'Lacks scale, does not mention automation depth, reliability, or cost efficiency.',
      goodExample: 'Migrated monolithic infrastructure to Amazon EKS using Terraform, slashing monthly AWS cloud spend by 32% ($4,200/mo) and achieving 99.98% production uptime.',
      goodReason: 'Directly quantifies cloud cost optimization and infrastructure stability.'
    },
    recruiterRedFlags: [
      'Listing 50 tools without showing how they are orchestrated in a production pipeline',
      'No mention of monitoring, alerting, or incident response (MTTR)',
      'Missing cloud certification credentials if held (AWS Solutions Architect, CKA, Terraform Associate)'
    ],
    faqs: [
      {
        question: 'Are cloud certifications mandatory on a DevOps resume?',
        answer: 'While practical project bullets matter most, industry certifications like CKA (Certified Kubernetes Administrator) and AWS Solutions Architect provide an immediate 3x boost in ATS candidate ranking.'
      },
      {
        question: 'How do recruiters evaluate DevOps bullets?',
        answer: 'Recruiters and hiring managers look for DORA metrics: deployment frequency, reduction in build times, cost savings, and high-availability uptime.'
      }
    ]
  },
  {
    slug: 'digital-marketing-specialist',
    roleName: 'Digital Marketing Specialist',
    title: 'Digital Marketing Specialist Resume: Performance, SEO & CAC Formulas (2026)',
    shortDescription: 'High-converting resume framework for Performance Marketers, SEO Leads, and Growth Hackers.',
    metaDescription: 'Boost your Digital Marketing resume ATS score. High-impact keywords for Google Ads, Meta Ads, SEO ranking, ROAS, CAC reduction, and analytics.',
    category: 'Marketing & Growth',
    experienceLevel: 'Mid-Level (2-5 Yrs)',
    salaryInsight: {
      indiaAvg: '₹5L - ₹11L / year',
      globalAvg: '$60,000 - $90,000 / year'
    },
    targetKeywords: [
      'Performance Marketing (Meta Ads, Google Ads)',
      'Search Engine Optimization (Technical & On-Page SEO)',
      'Conversion Rate Optimization (CRO)',
      'Return on Ad Spend (ROAS) Optimization',
      'Email Marketing Automation (HubSpot, Klaviyo)',
      'Google Analytics 4 (GA4) & Tag Manager',
      'Customer Acquisition Cost (CAC) Reduction',
      'Content Marketing Strategy'
    ],
    hardSkills: [
      'Google Ads / Meta Ads Manager / LinkedIn Campaign Manager',
      'Ahrefs / SEMrush / Screaming Frog',
      'GA4 / Google Search Console',
      'HubSpot / Klaviyo / Mailchimp',
      'WordPress / Webflow CMS',
      'Canva / Basic Figma'
    ],
    softSkills: [
      'Creative Copywriting',
      'Data-Driven Experimentation',
      'Budget Stewardship',
      'Trend Anticipation'
    ],
    actionVerbs: ['Generated', 'Scaled', 'Optimized', 'Acquired', 'Conducted', 'Boosted', 'Spearheaded'],
    summaryFormula: {
      template: 'Performance & Growth Marketing Specialist with [X] years of experience managing monthly ad budgets of [₹Y / $Y]. Generated over [Z%] lift in organic traffic and scaled ROAS to [W:1] across omnichannel funnels.',
      example: 'Growth Marketing Specialist with 3+ years managing ₹25L+ monthly paid ad budgets across Google & Meta. Scaled blended ROAS from 2.1x to 4.4x and grew organic inbound search traffic by 180% year-over-year.'
    },
    bulletFormula: {
      formulaName: 'ROAS & Revenue Attribution Formula',
      badExample: 'Managed company social media accounts and ran Google Ads campaigns.',
      badReason: 'Reads like an unpaid intern task list with zero budget or conversion numbers.',
      goodExample: 'Revamped B2B Google Ads search campaigns with negative keyword pruning and landing page A/B tests, cutting cost-per-lead (CPL) by 38% while driving ₹62L in qualified pipeline.',
      goodReason: 'Pairs specific tactical execution (negative keywords, A/B testing) with CPL reduction and revenue pipeline.'
    },
    recruiterRedFlags: [
      'Highlighting vanity metrics like "impressions" or "likes" instead of leads, CAC, ROAS, and revenue',
      'No portfolio or campaign case study link',
      'Not demonstrating understanding of modern post-cookie privacy attribution (iOS 14+, GA4)'
    ],
    faqs: [
      {
        question: 'What is the number one metric hiring managers want to see on a marketer’s CV?',
        answer: 'Customer Acquisition Cost (CAC) and Return on Ad Spend (ROAS). Show how much capital you deployed and the exact return generated for the business.'
      }
    ]
  },
  {
    slug: 'full-stack-developer',
    roleName: 'Full Stack Developer',
    title: 'Full Stack Developer Resume Guide: MERN / Next.js / Cloud ATS Keywords (2026)',
    shortDescription: 'Modern full-stack engineering resume tailored for Next.js, Node.js, TypeScript, and distributed systems.',
    metaDescription: 'Optimize your Full Stack Developer resume. Discover top keywords for Next.js, React, Node.js, PostgreSQL, Docker, and pass technical screening algorithms.',
    category: 'Engineering & Tech',
    experienceLevel: 'Mid-Level (2-5 Yrs)',
    salaryInsight: {
      indiaAvg: '₹8L - ₹18L / year',
      globalAvg: '$85,000 - $135,000 / year'
    },
    targetKeywords: [
      'Full Stack Architecture',
      'RESTful & GraphQL API Design',
      'Next.js App Router & SSR',
      'Relational & NoSQL Database Modeling',
      'State Management (Redux, Zustand)',
      'Authentication & Authorization (OAuth2, JWT)',
      'Performance Optimization & Web Vitals',
      'Automated Testing (Jest, Playwright)'
    ],
    hardSkills: [
      'TypeScript / JavaScript',
      'React / Next.js / Vue.js',
      'Node.js / Express / NestJS',
      'PostgreSQL / Prisma / Redis',
      'Docker / AWS / Vercel',
      'Tailwind CSS'
    ],
    softSkills: [
      'End-to-End Feature Ownership',
      'Architecture Trade-off Analysis',
      'Agile Sprint Velocity',
      'Mentorship & Code Reviews'
    ],
    actionVerbs: ['Engineered', 'Architected', 'Integrated', 'Decoupled', 'Scaled', 'Refactored', 'Delivered'],
    summaryFormula: {
      template: 'Full Stack Engineer with [X] years of experience shipping production web applications using [Frontend] and [Backend]. Architected scalable backends serving [Y] active users and optimized frontends to sub-second load times.',
      example: 'Full Stack Engineer with 4 years of experience delivering high-throughput web applications with Next.js, Node.js, and PostgreSQL. Architected microservices serving 150K+ monthly users with 99.9% uptime and sub-800ms page load speeds.'
    },
    bulletFormula: {
      formulaName: 'End-to-End Stack Ownership Formula',
      badExample: 'Built frontend in React and backend in Node with database.',
      badReason: 'Extremely generic; does not describe architecture complexity, scale, or outcomes.',
      goodExample: 'Engineered end-to-end checkout flow using Next.js, Stripe webhooks, and Redis caching, cutting abandonment rate by 19% and processing ₹1.2Cr in monthly transactions.',
      goodReason: 'Covers full tech stack, transaction volume, and clear business conversion improvement.'
    },
    recruiterRedFlags: [
      'Listing 10 different programming languages without showing deep production mastery in any',
      'No discussion of database indexing, query optimization, or caching strategies',
      'Lack of automated testing or CI/CD mentions'
    ],
    faqs: [
      {
        question: 'Should full stack developers list both frontend and backend skills equally?',
        answer: 'Yes, but indicate your primary bias (e.g., "Full Stack Engineer - Frontend Leaning" or "Backend Focused") to help hiring teams place you in the right engineering pod.'
      }
    ]
  }
];

export function getRoleBySlug(slug: string): JobRole | undefined {
  return jobRoles.find((r) => r.slug === slug);
}

export function getAllRoleSlugs(): string[] {
  return jobRoles.map((r) => r.slug);
}
