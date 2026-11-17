/**
 * One source for the About page and the printed résumé.
 * Dates and outcomes are compressed from the 2026-11-05 résumé.
 * A role links to a project only when that project has a page.
 */

export type Explanation = {
  label: string;
  href?: string;
};

export type Role = {
  title: string;
  organization: string;
  location: string;
  dates: string;
  outcome: string;
  explains?: Explanation;
};

export type School = {
  institution: string;
  credential: string;
  year: string;
};

export const contact = {
  name: "Shawn Oakley",
  email: "shawnoakley@gmail.com",
  phone: "(929) 507-8680",
  phoneHref: "tel:+19295078680",
  place: "Long Beach, CA",
  github: "https://github.com/ShawnOakley",
};

/** Stated once. Wording from the résumé, not a second paraphrase. */
export const barStatus = "New York bar admission: inactive.";

export const argument: { text: string; explains: Explanation }[] = [
  {
    text: "Hatch-Waxman ANDA patent litigation at Paul Hastings, including review of patents and filings.",
    explains: { label: "Hatch-Waxman tracker" },
  },
  {
    text: "Litigation practice: pleadings, discovery, and review of case files. The citator follows the cite-checker.",
    explains: { label: "Cite-checker", href: "/" },
  },
  {
    text: "Cross-border IP diligence at Morrison & Foerster in Tokyo, where the work product was a diligence report.",
    explains: { label: "Sourcing every fact" },
  },
  {
    text: "The front-end pod at Domino Data Lab, and the asset system at YouVisit.",
    explains: { label: "This site", href: "/colophon" },
  },
];

export const experience: Role[] = [
  {
    title: "Document review specialist",
    organization: "Consilio",
    location: "Remote",
    dates: "Jun 2025 – Apr 2026",
    outcome:
      "Reviewed and coded electronically stored information for responsiveness, privilege, and confidentiality.",
  },
  {
    title: "Personal sabbatical",
    organization: "",
    location: "",
    dates: "May 2024 – Jun 2025",
    outcome:
      "Studied generative image and local language-model pipelines, and worked per diem as an EMT.",
  },
  {
    title: "Senior software engineer II",
    organization: "Hover",
    location: "New York, NY",
    dates: "Dec 2023 – May 2024",
    outcome:
      "Built web AR and modeling tools for construction and insurance, on LiDAR, Three.js, React, Rails, and Python.",
    explains: { label: "Gaussian splats", href: "/graphics/splats" },
  },
  {
    title: "Senior web graphics engineer",
    organization: "Obsess AR",
    location: "New York, NY",
    dates: "Aug 2022 – Aug 2023",
    outcome:
      "Built 3D store experiences in Three.js and React, and added Next.js server rendering that halved page-load time.",
  },
  {
    title: "Senior software engineer II",
    organization: "Domino Data Lab",
    location: "New York, NY",
    dates: "Oct 2019 – Jul 2022",
    outcome:
      "Led a four-engineer front-end pod on an MLOps platform for building, deploying, and managing models.",
    explains: { label: "This site", href: "/colophon" },
  },
  {
    title: "Senior software engineer",
    organization: "YouVisit",
    location: "New York, NY",
    dates: "Feb 2018 – Oct 2019",
    outcome:
      "Led the 360° media viewer rebuild and a digital asset system from studio discovery through delivery.",
    explains: { label: "This site", href: "/colophon" },
  },
  {
    title: "Senior software engineer",
    organization: "Smartling",
    location: "New York, NY",
    dates: "Apr 2016 – Feb 2018",
    outcome:
      "Built the translation workbench in React and connected it to machine translation with a human review step.",
  },
  {
    title: "Software engineer",
    organization: "MediaMath",
    location: "New York, NY",
    dates: "Jan 2015 – Apr 2016",
    outcome:
      "Built the SOX-compliant financial reporting platform for the company’s financial data.",
  },
  {
    title: "Software engineer",
    organization: "Yodle",
    location: "New York, NY",
    dates: "Nov 2013 – Jan 2015",
    outcome:
      "Built brand and franchisee sites, and the AWS services behind them.",
  },
  {
    title: "Expert-in-residence",
    organization: "General Assembly",
    location: "New York, NY",
    dates: "2014 – 2015",
    outcome:
      "Taught data science and machine learning, concurrent with the Yodle role.",
  },
  {
    title: "Attorney, life sciences group",
    organization: "Paul Hastings LLP",
    location: "New York, NY",
    dates: "Oct 2011 – Jun 2013",
    outcome:
      "Scientific resource on Hatch-Waxman ANDA patent litigation, and supervised review of patents and filings.",
    explains: { label: "Hatch-Waxman tracker" },
  },
  {
    title: "Attorney, technology transfer group",
    organization: "Morrison & Foerster LLP",
    location: "Tokyo, Japan",
    dates: "Sep 2009 – Oct 2011",
    outcome:
      "Advised on IP and contract risk in cross-border technology deals and wrote the diligence reports.",
    explains: { label: "Sourcing every fact" },
  },
];

export const additional: Role[] = [
  {
    title: "Volunteer, unlawful detainer answer clinic",
    organization: "Community Legal Aid SoCal",
    location: "Long Beach, CA",
    dates: "Aug 2026 – present",
    outcome:
      "Organizes tenant case files and proofreads draft pleadings under attorney supervision.",
  },
  {
    title: "Volunteer, driver and logistics",
    organization: "Long Beach Community Table",
    location: "Long Beach, CA",
    dates: "Jun 2026 – present",
    outcome: "Packs and delivers food on weekends.",
  },
  {
    title: "Emergency medical technician",
    organization: "Monroe County EMT and Superior Ambulance",
    location: "Easton, CT, and Albuquerque, NM",
    dates: "Apr 2025 – Apr 2026",
    outcome: "Documented patient encounters as a per-diem EMT.",
  },
  {
    title: "Volunteer tutor",
    organization: "ScriptEd",
    location: "New York, NY",
    dates: "2016 – 2018",
    outcome: "Tutored computer science in New York City high schools.",
  },
];

export const education: School[] = [
  {
    institution:
      "Columbia University and the School of Oriental and African Studies",
    credential: "J.D. and LL.M.",
    year: "2009",
  },
  {
    institution: "New York University",
    credential: "M.S., Bioinformatics",
    year: "2006",
  },
  {
    institution: "Brown University",
    credential: "B.S., Neuroscience",
    year: "2005",
  },
];

export const roles = [...experience, ...additional];
