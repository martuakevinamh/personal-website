// Education History - Edit this file to update your education data

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number | "Sekarang";
  description?: string;
}

export const educationData: Education[] = [
  {
    id: 1,
    institution: "Institut Teknologi Sumatera - South Lampung, Indonesia",
    degree: "Bachelor of Informatics Engineering, 3.21/4.00",
    field: "Informatics Engineering",
    startYear: 2022,
    endYear: 2026,
    description: "• Conducted pioneering research on microscopic visual detection using Deep Learning (YOLO-Para) to identify malaria parasites from medical samples.\n• Led organizational operations for a 1,300 attendee Christmast Celebratation",
  }
];
