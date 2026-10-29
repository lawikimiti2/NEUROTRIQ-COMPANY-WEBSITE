import cctvCamera3 from "@/assets/new-photos/our-projects-cctv-camera-3.jpg";
import julietFarmsSolarCamera from "@/assets/new-photos/our-projects-solar-cctv-pole-closeup.jpg";
import ipTrainingVmsSetup from "@/assets/new-photos/our-projects-ip-training-vms-setup.jpg";
import ciscoSwitchRack from "@/assets/new-photos/our-projects-cisco-switch-rack-fiber-patch.jpg";
import itNetworkCabinet from "@/assets/new-photos/our-projects-it-network-cabinet-wall-mounted-1.jpg";
import smartHomeDemo from "@/assets/new-photos/our-projects-smart-home-robot-vacuum-demo.jpg";

export type PortfolioCategoryName = "Consultancy" | "IT" | "Security" | "Smart Building";

export type Project = {
  id: number;
  title: string;
  category: PortfolioCategoryName;
  client?: string;
  location?: string;
  duration?: string;
  teamSize?: string;
  image: string;
  description: string;
  challenges?: string[];
  solutions?: string[];
  results?: string[];
  technologies?: string[];
};

export const categories: PortfolioCategoryName[] = [
  "All" as unknown as PortfolioCategoryName, // used only for tabs in Portfolio page
  "Consultancy",
  "IT",
  "Security",
  "Smart Building",
];

// Real projects provided by the user
export const projects: Project[] = [
  // Feature case study first: Consolata International University (Security)
  {
    id: 1,
    title: "Consolata International University",
    category: "Security",
    client: "Consolata International University (Contract)",
    location: "Kenya",
    duration: "Ongoing",
    teamSize: "Field engineers & trainers",
    image: cctvCamera3,
    description:
      "Installation and commissioning of IP IoT security systems for Consolata International University including solar-powered CCTV and video walls, with on-site technical personnel and support.",
    challenges: [
      "Harsh outdoor environments for solar CCTV",
      "Complex integration with video walls",
      "Training schedules for IP systems",
      "Tight commissioning timelines",
    ],
    solutions: [
      "Ruggedized, solar-ready CCTV endpoints",
      "Centralized VMS for video wall integration",
      "Hands-on IP systems training sessions",
      "Phased commissioning and QA checks",
    ],
    results: [
      "Reliable perimeter coverage with solar CCTV",
      "Operational video wall with unified feeds",
      "Up-skilled support personnel",
      "Stable, maintainable deployment",
    ],
    technologies: ["IP Cameras", "Solar Power Systems", "Video Wall Controllers", "Network Video Recorders"],
  },

  // Security
  {
    id: 2,
    title: "Juliet Farms",
    category: "Security",
    client: "Juliet Farms (Subcontract)",
    location: "Kenya",
    duration: "Project-based",
    teamSize: "Security engineers",
    image: julietFarmsSolarCamera,
    description:
      "CCTV installation, switch configurations, and video wall setup with technical personnel and ongoing support.",
  },
  {
    id: 3,
    title: "IoT Security Systems & IP Training",
    category: "Security",
    client: "Training Program",
    location: "Kenya",
    duration: "Workshops",
    teamSize: "Trainers & support staff",
    image: ipTrainingVmsSetup,
    description:
      "Design and deployment of IoT security systems complemented by structured training on modern IP-based surveillance platforms.",
  },

  // Consultancy
  {
    id: 4,
    title: "Enfobase Kenya Limited — Tendering & Business Administration",
    category: "Consultancy",
    client: "Enfobase Kenya Limited",
    location: "Kenya",
    duration: "Consulting",
    teamSize: "Advisory team",
    image: "",
    description:
      "Support on tendering, EGP, licensing, and business administration to streamline compliance and bidding success.",
  },
  {
    id: 6,
    title: "Universal Systems Engineering Limited — EGP Registration",
    category: "Consultancy",
    client: "Universal Systems Engineering Limited",
    location: "Kenya",
    duration: "Consulting",
    teamSize: "Advisory team",
    image: "",
    description:
      "Guided EGP registration process ensuring complete, compliant submissions and faster onboarding.",
  },

  // IT
  {
    id: 5,
    title: "Tripple Facility — Programming CISCO Switches",
    category: "IT",
    client: "Tripple Facility",
    location: "Kenya",
    duration: "Project-based",
    teamSize: "Network engineers",
    image: "",
    description:
      "Programming and configuration of CISCO switches to support a reliable, secure network infrastructure.",
  },
  {
    id: 7,
    title: "Neurok Hub — Networking Tasks",
    category: "IT",
    client: "Neurok Hub",
    location: "Kenya",
    duration: "Ongoing",
    teamSize: "IT engineers",
    image: ciscoSwitchRack,
    description:
      "Networking tasks including infrastructure setup, configuration, and ongoing network support.",
  },
  {
    id: 8,
    title: "Joe Shoes Limited — IT Setup & Support",
    category: "IT",
    client: "Joe Shoes Limited",
    location: "Kenya",
    duration: "Ongoing",
    teamSize: "IT engineers",
    image: itNetworkCabinet,
    description:
      "Business IT setup and ongoing support to ensure secure connectivity and reliable operations.",
  },

  // Smart Building
  {
    id: 9,
    title: "Purity Ng’ang’a — Residential Construction & Smart Home (Nakuru)",
    category: "Smart Building",
    client: "Private Client: Purity Ng’ang’a",
    location: "Nakuru, Kenya",
    duration: "Project-based",
    teamSize: "Construction & smart home team",
    image: smartHomeDemo,
    description:
      "Combined residential construction and smart home project delivered in Nakuru — integrated systems for comfort, security, and efficiency.",
  },
];
