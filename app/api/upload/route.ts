import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
export async function POST(req:NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error:'No file' }, { status:400 });
    const folder   = (form.get('folder') as string) ?? 'general';
    const ext      = file.name.split('.').pop() ?? 'jpg';
    const name     = Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;
    const dir      = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(dir, { recursive:true });
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: '/uploads/' + folder + '/' + name });
  } catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
