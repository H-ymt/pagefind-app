import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { logKeyword } from '@/lib/keywords';
import { checkRateLimit } from '@/lib/rate-limit';
import { cookies } from 'next/headers';

// セッションIDを取得または生成
async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }

  return sessionId;
}

// クライアントIPを取得
function getClientIp(request: NextRequest): string {
  // Cloudflareのヘッダー
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  // 一般的なプロキシヘッダー
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = await getOrCreateSessionId();
    const ip = getClientIp(request);
    const { env } = await getCloudflareContext();

    // レート制限チェック
    const rateLimitResult = await checkRateLimit(env.DB, ip, sessionId);
    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil(
        (rateLimitResult.resetAt.getTime() - Date.now()) / 1000
      );
      return NextResponse.json(
        {
          error: 'Too many requests',
          limitType: rateLimitResult.limitType,
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
          },
        }
      );
    }

    const body = (await request.json()) as { query?: string };
    const { query } = body;

    if (typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (query.length > 100) {
      return NextResponse.json(
        { error: 'Query too long' },
        { status: 400 }
      );
    }

    const result = await logKeyword(
      env.DB,
      query,
      sessionId,
      env.OPENAI_API_KEY
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    // セッションIDをCookieに保存（7日間有効）
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    // レート制限情報をヘッダーに追加
    response.headers.set(
      'X-RateLimit-Remaining',
      String(rateLimitResult.remaining)
    );
    response.headers.set(
      'X-RateLimit-Reset',
      rateLimitResult.resetAt.toISOString()
    );

    return response;
  } catch (error) {
    console.error('Search log error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
