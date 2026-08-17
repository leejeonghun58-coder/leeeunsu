export type DrawingCategory = "캐릭터" | "동물" | "가족" | "상상" | "학교" | "기타";
export interface Drawing { id: number; title: string; date: string; description: string; category: DrawingCategory; quote: string; image: string; }
export interface Character { id: number; name: string; reason: string; description: string; image: string; color: string; }
export interface Video { id: number; title: string; date: string; description: string; thumbnail: string; youtubeId?: string; videoUrl?: string; }
export interface Memory { id: number; period: string; title: string; description: string; category: string; image: string; }
