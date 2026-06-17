export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://www.qasir.co.uk";

export const PROFILE_DATA = {
  name: "Qasir Mehmood",
  title: "Senior Full-Stack Developer | Next.js, React, TypeScript | Azure AI Engineer (AI-102) | Python & FastAPI | Generative AI & Agentic AI Solutions | 12+ Years Experience",
  location: "Luton, England, United Kingdom",
  email: "qasirdev@gmail.com",
  phone: "07932933505",
  linkedin: "https://www.linkedin.com/in/qasir",
  website: "https://www.qasir.co.uk",
  github: "https://github.com/qasirdev",
  profilePhotoUrl:
    process.env.NEXT_PUBLIC_PROFILE_IMAGE_URL?.trim() || "/profile-photo.jpg",

  /** GitHub raw PDF — replace the file in-repo without redeploying the site */
  cvDownloadUrl:
    process.env.NEXT_PUBLIC_CV_URL?.trim() ||
    "https://github.com/qasirdev/qasir-profile-ai/raw/main/cv/qasir-mehmood-cv.pdf",

  /** GitHub raw plain-text/markdown CV — fetched at runtime; update file without redeploying */
  resumeTextUrl:
    process.env.NEXT_PUBLIC_RESUME_TEXT_URL?.trim() ||
    "https://github.com/qasirdev/qasir-profile-ai/raw/main/cv/qasir-fullstack-cv.md",

  summary: `Senior Full-Stack Developer and AI Solutions Architect with 12+ years of experience delivering scalable, high-performance web applications across SaaS, enterprise and cloud platforms.

I work at the intersection of frontend engineering, backend systems and applied AI. My approach combines strong engineering fundamentals with product thinking, enabling teams to turn complex business requirements into reliable, secure and maintainable software solutions.`,

  education: {
    degree: "Master's Degree in Computer Science",
    major: "Software Engineering",
    additional: "Graduation (Mathematics & Statistics)",
  },

  /** Years of hands-on experience — sourced from CV */
  skillYears: {
    "JavaScript": 12,
    "React": 9,
    "React.js": 9,
    "TypeScript": 9,
    "Next.js": 4,
    "Python 3.12+": 4,
    "Python": 4,
    "Node.js": 5,
    "Microsoft Azure": 3,
    "Azure": 3,
    "Azure AI Services": 3,
    "AWS": 3,
    "Redux": 5,
    "GraphQL": 3,
    "Terraform": 2,
    "PostgreSQL": 5,
    "SQL": 5,
    "FastAPI": 4,
  } as Record<string, number>,

  skills: {
    frontend: ["Next.js", "React", "TypeScript", "Material UI", "Tailwind CSS", "Redux"],
    backend: ["Node.js", "Python 3.12+", "FastAPI", "REST APIs", "GraphQL", "OAuth 2.0", "JWT"],
    cloud: ["Microsoft Azure", "Azure AI Services", "AWS", "Terraform", "Docker", "GitHub Actions"],
    ai: ["Generative AI", "Agentic AI", "Multi-agent Systems", "RAG", "LangGraph", "Temporal", "MCP", "LLM Engineering"],
    architecture: ["Microservices", "Cloud-native Architecture", "PostgreSQL", "pgvector", "Redis"],
    leadership: ["Technical Leadership", "Team Mentoring", "Agile/Scrum", "Code Reviews", "WCAG Accessibility"]
  },

  experience: [
    {
      company: "Freelance",
      role: "Senior Full-Stack Engineer & Azure AI Solutions Consultant",
      period: "September 2025 - Present",
      location: "Remote, UK",
      description: `Delivering enterprise-grade, cloud-native web applications and AI-enabled solutions for start-ups and growing organisations as a freelance senior engineer and solutions consultant.`,
      achievements: [
        "Architected and delivered enterprise-grade, cloud-native web platforms using Next.js (App Router), TypeScript and Microsoft Azure with Terraform IaC",
        "Designed secure authentication and authorisation using OAuth 2.0 and role-based access control (RBAC)",
        "Built reusable Material UI design system with accessible, internationalised RTL/LTR interfaces",
        "Implemented AI-enabled features using Microsoft Azure AI, RAG and agent-based workflows",
        "Drove engineering excellence through automated testing, performance optimisation and AI-assisted development, accelerating delivery by over 40%",
        "Provided end-to-end technical leadership across design, development, testing, deployment and handover within Agile environments"
      ]
    },
    {
      company: "Hecate Technologies Limited",
      role: "Azure AI Solutions Consultant",
      period: "January 2026 - Present",
      location: "Remote",
      description: `Engaged to design, architect and deliver a production-grade, cloud-native platform for a digital transformation consultancy.`,
      achievements: [
        "Architected bilingual enterprise platform using Next.js 15, TypeScript, FastAPI and Turborepo monorepo",
        "Engineered real-time features with Server-Sent Events, Azure Cosmos DB and Azure Entra External ID (CIAM)",
        "Delivered sentiment analysis and content moderation using Azure AI Language Services with Unicode and emoji handling",
        "Applied Infrastructure as Code (Terraform), GitHub Actions and containerised deployment practices",
        "Produced technical documentation and sprint-structured delivery plans for stakeholder governance"
      ]
    },
    {
      company: "IPCortex Ltd",
      role: "Senior Software Engineer",
      period: "May 2024 - July 2025",
      location: "Milton Keynes, England, United Kingdom",
      description: `Led frontend development for enterprise Cloud Communications Platform as a Service (CPaaS), serving end-users, administrators and partners.`,
      achievements: [
        "Led frontend team in Kanban environment, improving stability and reducing product bugs by 95%",
        "Delivered major UI/UX redesigns across Account, User and Device Management journeys with Figma specs for CPaaS",
        "Built scalable, mobile-first applications using Next.js, React, TypeScript, Jest and Cypress",
        "Improved page load performance by 40% using Next.js, React and TypeScript",
        "Prototyped FastAPI RAG microservices on Azure Container Apps, reducing documentation search time by 90%",
        "Collaborated on Node.js microservices; performed code review and mentoring juniors",
        "Managed deployments with Jenkins, AWS, GitHub Actions, Docker and Terraform"
      ]
    },
    {
      company: "British Gas",
      role: "Senior Product Engineer (Contract)",
      period: "May 2019 - January 2024",
      location: "Windsor",
      description: `Delivered large-scale frontend and full-stack features for enterprise energy platforms used by millions of customers.`,
      achievements: [
        "Redesigned the complete Energy Sales customer journey including tariff tables and payment flows",
        "Led frontend development for the OAM dashboard rebuild used by millions of customers",
        "Oversaw migration from legacy code to Next.js, improving maintainability and performance",
        "Reduced customer service misdirected queries by 30% through improved navigation and UX flows",
        "Conducted user testing with 10+ participants, reducing bounce rates by 30%",
        "Improved page load performance and conducted accessibility testing, enhancing user satisfaction",
        "Integrated Adobe Analytics and delivered accessible, production-ready UI in Agile teams"
      ]
    },
    {
      company: "CityFleet Networks Ltd",
      role: "Full Stack Developer",
      period: "February 2017 - April 2019",
      location: "London, United Kingdom",
      description: `Built client-facing web applications and CMS-driven sites for a London-based transport technology company.`,
      achievements: [
        "Developed Contentful CMS-based applications using Angular 5+, NgRx and RxJS",
        "Built multiple client-facing websites from scratch using React, Redux and TypeScript",
        "Coordinated with backend teams on ASP.NET MVC5, Web API 2 and SQL Server integrations"
      ]
    }
  ],

  earlierRoles: [
    { role: "Web Developer", company: "Accknowledge (UK) Ltd", period: "Jan 2015 – Jan 2017", location: "London, UK" },
    { role: "Frontend Developer", company: "Soimo", period: "Jan 2015 – Dec 2015", location: "London, UK" },
    { role: "Web Developer", company: "Gmaxx IT Solutions", period: "Dec 2013 – Dec 2014", location: "London, UK" },
    { role: "Web Developer", company: "Denovo Limited", period: "Feb 2013 – Nov 2013", location: "London, UK" },
  ],

  certifications: [
    "Microsoft Certified: Azure AI Engineer Associate (AI-102)",
    "Pursuing: Azure Developer Associate (AZ-204)",
    "FastAPI, RESTful APIs using Python, SQLAlchemy, OAuth, JWT (Udemy)",
    "Next.js & React Advanced Development (Udemy)",
    "Testing Next.js Apps with Jest, Testing Library and Cypress (Udemy)",
    "Cypress End-to-End Testing - Getting Started",
    "Build a JavaScript AI App with React and the OpenAI API"
  ]
};
