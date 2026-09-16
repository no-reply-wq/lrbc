// lib/db.ts — runs in the BROWSER, calls /api routes
export type Testimonial = {
  _id?: string; name: string; designation: string; company: string;
  image_url: string; quote: string; rating: number;
  featured: boolean; sort_order?: number;
};
export type CaseStudy = {
  _id?: string; client: string; industry: string; challenge: string;
  solution: string; result: string;
  metrics: { label: string; value: string }[];
  tags: string[]; featured: boolean; sort_order?: number;
};
export type FAQ = {
  _id?: string; question: string; answer: string;
  icon: string; sort_order?: number;
};
export type TeamMember = {
  _id?: string; name: string; role: string; avatar_url: string;
  linkedin_url: string; object_position: string; sort_order?: number;
};
export type BlogPost = {
  _id?: string; title: string; slug: string; excerpt: string;
  content: string; cover_url: string; author_name: string;
  tags: string[]; published: boolean; published_at?: string | null;
};
export type SiteContent = {
  _id?: string; key: string; page: string; section: string;
  data: Record<string, unknown>;
};

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' }, ...options,
  });
  if (!res.ok) throw new Error('API ' + res.status + ': ' + await res.text());
  return res.json();
}

export const getTestimonials   = () => api<Testimonial[]>('/api/testimonials');
export const addTestimonial    = (t: Omit<Testimonial,'_id'>) => api<Testimonial>('/api/testimonials', { method:'POST', body:JSON.stringify(t) });
export const updateTestimonial = (id: string, t: Partial<Testimonial>) => api<Testimonial>(`/api/testimonials/${id}`, { method:'PUT', body:JSON.stringify(t) });
export const deleteTestimonial = (id: string) => api<{ok:boolean}>(`/api/testimonials/${id}`, { method:'DELETE' });

export const getCaseStudies    = () => api<CaseStudy[]>('/api/case-studies');
export const addCaseStudy      = (cs: Omit<CaseStudy,'_id'>) => api<CaseStudy>('/api/case-studies', { method:'POST', body:JSON.stringify(cs) });
export const updateCaseStudy   = (id: string, cs: Partial<CaseStudy>) => api<CaseStudy>(`/api/case-studies/${id}`, { method:'PUT', body:JSON.stringify(cs) });
export const deleteCaseStudy   = (id: string) => api<{ok:boolean}>(`/api/case-studies/${id}`, { method:'DELETE' });

export const getFAQs    = () => api<FAQ[]>('/api/faqs');
export const addFAQ     = (f: Omit<FAQ,'_id'>) => api<FAQ>('/api/faqs', { method:'POST', body:JSON.stringify(f) });
export const updateFAQ  = (id: string, f: Partial<FAQ>) => api<FAQ>(`/api/faqs/${id}`, { method:'PUT', body:JSON.stringify(f) });
export const deleteFAQ  = (id: string) => api<{ok:boolean}>(`/api/faqs/${id}`, { method:'DELETE' });

export const getTeamMembers    = () => api<TeamMember[]>('/api/team');
export const addTeamMember     = (m: Omit<TeamMember,'_id'>) => api<TeamMember>('/api/team', { method:'POST', body:JSON.stringify(m) });
export const updateTeamMember  = (id: string, m: Partial<TeamMember>) => api<TeamMember>(`/api/team/${id}`, { method:'PUT', body:JSON.stringify(m) });
export const deleteTeamMember  = (id: string) => api<{ok:boolean}>(`/api/team/${id}`, { method:'DELETE' });

export const getBlogPosts   = (all = false) => api<BlogPost[]>(`/api/blog${all ? '?all=1' : ''}`);
export const addBlogPost    = (p: Omit<BlogPost,'_id'>) => api<BlogPost>('/api/blog', { method:'POST', body:JSON.stringify(p) });
export const updateBlogPost = (id: string, p: Partial<BlogPost>) => api<BlogPost>(`/api/blog/${id}`, { method:'PUT', body:JSON.stringify(p) });
export const deleteBlogPost = (id: string) => api<{ok:boolean}>(`/api/blog/${id}`, { method:'DELETE' });

export const getSiteContent    = () => api<SiteContent[]>('/api/site-content');
export const updateSiteContent = (key: string, section: string, data: Record<string, unknown>) =>
  api<SiteContent>(`/api/site-content/${key}`, { method:'PUT', body:JSON.stringify({ section, data }) });

export async function uploadImage(file: File, folder = 'general'): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);
  const res = await fetch('/api/upload', { method: 'POST', body: form });
  if (!res.ok) throw new Error('Upload failed: ' + await res.text());
  const { url } = await res.json();
  return url;
}
