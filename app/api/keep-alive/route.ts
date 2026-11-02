import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ ok: false, message: 'Supabase não configurado' }, { status: 500 });
    }

    const { data, error } = await supabase.from('posts').select('id').limit(1);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: 'Supabase mantido ativo com sucesso!',
      timestamp: new Date().toISOString(),
      rowsReturned: data?.length ?? 0
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Erro desconhecido' }, { status: 500 });
  }
}
