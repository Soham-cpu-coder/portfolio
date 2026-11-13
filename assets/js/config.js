/**
 * PORTFOLIO CONFIGURATION FILE
 * Update your personal information, links, projects, and analytics IDs here.
 */
const portfolioConfig = {
  // Personal Info
  personal: {
    name: "Soham Mali",
    role: "Software Engineer",
    subRole: "Computer Engineering Student",
    tagline: "Building practical applications & scalable solutions with C++, Java, Python, and Modern Web Tech.",
    about: "I’m a Computer Engineering student passionate about software development, with hands-on experience in C++, Java, Python, and web technologies. I enjoy building practical applications, solving complex algorithmic problems, and exploring modern cloud & AI technologies, with a strong commitment to growing into an impactful Software Engineer.",
    location: "Kalyan, Maharashtra, India",
    email: "sohammali68@gmail.com",
    availability: "Open to Internships & SDE Roles",
    resumeUrl: "assets/resume.pdf",
    profilePhoto: "assets/images/profile.jpg"
  },

  // Social Links
  socials: {
    github: "https://github.com/Soham-cpu-coder",
    linkedin: "https://www.linkedin.com/in/soham-mali-745a8740b/",
    instagram: "https://www.instagram.com/soh.mm__/",
    email: "mailto:sohammali68@gmail.com"
  },

  // Hero Quick Stats
  stats: [
    { label: "Core Languages", value: "3+" },
    { label: "Featured Projects", value: "3+" },
    { label: "Certifications", value: "2" },
    { label: "Graduation", value: "2027" }
  ],

  // Skills Catalog
  skills: [
    {
      category: "Programming Languages",
      items: [
        { name: "C++", level: "Advanced" },
        { name: "Java", level: "Proficient" },
        { name: "Python", level: "Proficient" }
      ]
    },
    {
      category: "Web & Frontend",
      items: [
        { name: "HTML5", level: "Semantic / Accessible" },
        { name: "CSS3 / Modern CSS", level: "Responsive & Flex/Grid" },
        { name: "JavaScript (ES6+)", level: "Async / DOM / APIs" }
      ]
    },
    {
      category: "Databases & Storage",
      items: [
        { name: "MySQL", level: "Relational Design & Queries" },
        { name: "Database Schema Design", level: "Normalization & Indexing" }
      ]
    },
    {
      category: "Tools & Core Concepts",
      items: [
        { name: "Data Structures & Algorithms", level: "Core Problem Solving" },
        { name: "Git & GitHub", level: "Version Control & Collaboration" },
        { name: "Object-Oriented Programming (OOP)", level: "Design Patterns" },
        { name: "Linux / Shell Basics", level: "Development Environment" }
      ]
    }
  ],

  // Experience / Internships
  experience: [
    {
      role: "Marketing Team Intern",
      organization: "Alegria - Festival of Joy",
      location: "Navi Mumbai, India",
      period: "2026",
      type: "Internship / Leadership",
      description: [
        "Collaborated with a cross-functional marketing team to design and execute high-impact promotional campaigns for a premier college festival.",
        "Coordinated with peers and leadership to plan outreach strategies, significantly increasing event visibility and participant engagement.",
        "Exercised agile teamwork, communication, and event logistics management under strict timelines."
      ]
    }
  ],

  // Featured Projects
  projects: [
    {
      title: "Book Recommendation System",
      category: "Machine Learning & Database",
      tech: ["Python", "Collaborative Filtering", "MySQL", "Pandas"],
      description: "A recommendation engine that suggests relevant books to users based on user ratings, book metadata, and reading history utilizing collaborative filtering algorithms.",
      highlights: [
        "Constructed collaborative filtering logic to compute similarity metrics across user preference matrices.",
        "Designed and normalized MySQL database schemas for robust storage of user profiles, ratings, and catalog metadata."
      ],
      github: "https://github.com/Soham-cpu-coder",
      live: null
    },
    {
      title: "The Ultimate Sport Store",
      category: "Full-Stack Web Application",
      tech: ["HTML5", "CSS3", "JavaScript", "MySQL", "Backend API"],
      description: "A comprehensive e-commerce platform engineered for browsing, filtering, and ordering sports equipment with an intuitive user interface and reliable data persistence.",
      highlights: [
        "Built dynamic catalog browsing, multi-category filtering, real-time cart calculation, and responsive checkout flows.",
        "Integrated a MySQL-backed data store managing inventory counts, orders, and customer details."
      ],
      github: "https://github.com/Soham-cpu-coder",
      live: null
    },
    {
      title: "Hotel Management System",
      category: "Desktop Software Engineering",
      tech: ["Java", "OOP Architecture", "MySQL", "GUI/Swing"],
      description: "An enterprise-style desktop application for managing room reservations, customer records, billing invoices, and checkout states for hospitality operations.",
      highlights: [
        "Implemented strict Object-Oriented Design principles (Encapsulation, Polymorphism, Modular Architecture).",
        "Streamlined check-in/out workflows, automated bill generation, and persistent MySQL transactions."
      ],
      github: "https://github.com/Soham-cpu-coder",
      live: null
    }
  ],

  // Education
  education: [
    {
      degree: "B.Tech in Computer Engineering",
      institution: "Pillai University",
      location: "Panvel, Maharashtra",
      period: "Expected Graduation: 2027",
      cgpi: "6.25",
      details: "Rigorous coursework in Data Structures, Algorithms, Operating Systems, Database Management Systems, and Software Engineering methodologies."
    }
  ],

  // Certifications
  certifications: [
    {
      title: "Google Cloud Career Launchpad Program",
      issuer: "Google Cloud",
      year: "2026",
      badge: "Cloud Computing & Architecture"
    },
    {
      title: "Google DeepMind AI Research Program",
      issuer: "Google DeepMind",
      year: "2026",
      badge: "Artificial Intelligence & Research"
    }
  ],

  // Contact & Telegram Integration
  // Option A (Vercel Native): use "/api/contact" (add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel settings)
  // Option B (AWS Lambda): paste your AWS Function URL (e.g. "https://xxxxxx.lambda-url.us-east-1.on.aws/")
  contactApi: {
    lambdaFunctionUrl: "/api/contact", 
    cooldownSeconds: 30
  },

  // Analytics & Tracking Placeholders
  analytics: {
    ga4MeasurementId: "G-XXXXXXXXXX", // Replace with your GA4 Measurement ID
    cloudflareToken: "YOUR_CLOUDFLARE_BEACON_TOKEN" // Optional Cloudflare Web Analytics Token
  }
};

// Export for module systems or attach to window
if (typeof module !== "undefined" && module.exports) {
  module.exports = portfolioConfig;
} else {
  window.portfolioConfig = portfolioConfig;
}
