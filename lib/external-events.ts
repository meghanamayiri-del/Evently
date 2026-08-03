export interface ExternalEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  availableTickets: number;
  totalTickets: number;
  category: string;
  imageUrl: string;
}

export async function getTrendingTechEvents(): Promise<ExternalEvent[]> {
  // Curated professional tech & music events to give your platform an instant polished look
  return [
    {
      id: 'ext-1',
      title: 'Global AI & Cloud Summit 2026',
      description: 'Explore generative AI models, serverless architectures, and next-gen cloud scaling with global industry leaders.',
      location: 'Hyderabad International Convention Centre',
      date: 'September 12, 2026',
      availableTickets: 120,
      totalTickets: 250,
      category: 'Artificial Intelligence',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    },
    {
      id: 'ext-2',
      title: 'Full-Stack Developer Live Hackathon',
      description: 'Build high-performance web applications using Next.js, Prisma, and Tailwind CSS. Amazing prizes and networking opportunities.',
      location: 'HITEC City Tech Hub, Hyderabad',
      date: 'September 28, 2026',
      availableTickets: 45,
      totalTickets: 100,
      category: 'Hackathon',
      imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b',
    },
    {
      id: 'ext-3',
      title: 'Indie Rock & Synthwave Live Concert',
      description: 'An unforgettable evening of live electronic music, immersive lighting displays, and indie bands.',
      location: 'Shilpakala Vedika, Hyderabad',
      date: 'October 05, 2026',
      availableTickets: 15,
      totalTickets: 300,
      category: 'Music Concert',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
    },
  ];
}