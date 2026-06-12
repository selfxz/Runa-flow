export interface TeamMember {
  id: string;
  name: string;
  role: string;
  handle: string;
  link: string;
  image: string;
  category?: string;
  bio?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: "jeremi-sovero",
    name: "Jeremi Sovero",
    role: "Director",
    handle: "@jersov_photography",
    link: "https://www.instagram.com/jersov_photography",
    image: "/images/team/jeremi.jpeg"
  },
  {
    id: "giuliette-julca",
    name: "Giuliette Julca",
    role: "Producción General",
    handle: "@yuunotyou",
    link: "https://www.instagram.com/yuunotyou",
    image: "/images/team/Giuliette.jpeg"
  },
  {
    id: "isabela-perez",
    name: "Isabela Pérez",
    role: "Directora de Arte",
    handle: "@_isafrog_",
    link: "https://www.instagram.com/_isafrog_",
    image: "/images/team/isabela.jpeg"
  },
  {
    id: "marcelo-palomino",
    name: "Marcelo Palomino",
    role: "Gaffer",
    handle: "@papadupalos",
    link: "https://www.instagram.com/papadupalos",
    image: "/images/team/marcelo.jpeg"
  },
  {
    id: "sebastian-fernandez",
    name: "Sebastian Fernandez",
    role: "Editor",
    handle: "@sebaxtini_10",
    link: "https://www.instagram.com/sebaxtini_10",
    image: "/images/team/sebastian.jpeg"
  },
  {
    id: "alejandro-vivanco",
    name: "Alejandro Vivanco",
    role: "Sonidista",
    handle: "@master_tinta",
    link: "https://www.instagram.com/master_tinta",
    image: "/images/team/alejandro.jpeg"
  },
  {
    id: "leonardo-zanabria",
    name: "Leonardo Zanabria",
    role: "Luminito",
    handle: "@luigiz12",
    link: "https://www.instagram.com/luigiz12",
    image: "/images/team/leonardo.jpeg"
  },
  {
    id: "franco-paucar",
    name: "Franco Paucar",
    role: "Asistente de Producción",
    handle: "@francoangel09",
    link: "https://www.instagram.com/francoangel09",
    image: "/images/team/franco.jpeg"
  },
  {
    id: "juan-mendoza",
    name: "Juan Mendoza",
    role: "Asistente de Arte",
    handle: "Facebook",
    link: "https://www.facebook.com/juanrodyjose.mendozaparedes",
    image: "/images/team/juan.jpeg"
  },
  {
    id: "Fredy salinas",
    name: "Fredy Salinas",
    role: "Programador",
    handle: "@_drayfh",
    link: "https://www.instagram.com/_drayfh",
    image: "/images/team/fredy_salinas.png"
  }
];