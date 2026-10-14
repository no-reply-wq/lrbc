/**
 * VIDEO TESTIMONIALS — home page "Hear it from our clients".
 * One numbered entry per video. Keep this file as the single source of truth
 * (it maps 1:1 to a database table when the backend is built).
 *
 * To add a video, collect these 8 details and add ONE entry at the end (next number):
 *   no        running number (1, 2, 3 …)  — never reuse or renumber
 *   videoFile video file name, saved as  public/videos/testimonials/NN-company-client.mp4
 *   category  business category           e.g. "Woven Sack Manufacturing"
 *   company   company name
 *   client    client's name
 *   position  client's position           e.g. "Managing Director"
 *   quote     one short line from the video
 *   youtube   link of the same video on our YouTube channel (shows the YouTube icon on the card)
 *   poster    (optional) cover image, saved as public/images/testimonials/NN-company-client.jpg
 *
 * Leave videoFile empty and the card plays the YouTube link instead.
 * Leave both empty and the card shows "Video coming soon".
 * `id` is used by the admin editor — keep it as "v" + number.
 */
export type VideoTestimonial = {
  id: string;
  no: number;
  videoFile: string;
  category: string;
  company: string;
  client: string;
  position: string;
  quote: string;
  youtube: string;
  poster?: string;
};

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: "v1", no: 1,
    videoFile: "01-colorplas-kamalesh-gupta.mp4",
    category: "Plastic Manufacture",
    company: "Colorplas LLP",
    client: "Kamalesh Gupta",
    position: "Founder & CEO",
    quote: "“We now benefit from real-time oversight of production and accounts on a single dashboard.”",
    youtube: "https://youtube.com/shorts/i2QO9ldMH38",
    poster: "/images/testimonials/01-colorplas-kamalesh-gupta.jpg",
  },
  {
    id: "v2", no: 2,
    videoFile: "02-wedding-alliances-ekkta-vohra.mp4",
    category: "Digital Marketing Agency",
    company: "Wedding Alliances",
    client: "Ekkta V Vohra",
    position: "Founder",
    quote: "“Seamlessly converts all your ideas into practical solutions.”",
    youtube: "https://youtube.com/shorts/eaNjMgvh7f8",
    poster: "/images/testimonials/02-wedding-alliances-ekkta-vohra.jpg",
  },
];

/** Folder where the video files live (served from /videos/testimonials/…). */
export const VIDEO_DIR = "/videos/testimonials/";
