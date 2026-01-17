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
    institution: "Institut Teknologi Sumatera",
    degree: "Sarjana",
    field: "Teknik Informatika",
    startYear: 2022,
    endYear: "Sekarang",
    description: "IPK 3.2 - Fokus pada Web Development dan Machine Learning",
  },
  {
    id: 2,
    institution: "SMA Negeri 1 Matauli Pandan",
    degree: "SMA",
    field: "IPA",
    startYear: 2019,
    endYear: 2022,
    description: "",
  },
];
