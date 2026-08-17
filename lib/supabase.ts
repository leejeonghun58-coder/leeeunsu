import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Supabase의 새 sb_publishable 키는 apikey로는 유효하지만
// 구형 Storage 경로가 이를 JWT(Authorization)로 해석하면
// "Invalid Compact JWS"가 발생할 수 있습니다. 공개 클라이언트에서는
// apikey만 전달하고, 로그인 기능을 추가할 때 세션 Authorization을 다시 사용합니다.
const publicFetch: typeof fetch = async (input, init) => {
  const headers = new Headers(init?.headers);
  headers.delete("Authorization");
  return fetch(input, { ...init, headers });
};

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, { global: { fetch: publicFetch } })
  : null;
