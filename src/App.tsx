import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import Loading from "./components/ui/Loading";
import Button from "./components/ui/Button";
import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import BookNewPage from "./pages/BookNewPage";
import BookDetailPage from "./pages/BookDetailPage";
import FriendsPage from "./pages/FriendsPage";
import LoansPage from "./pages/LoansPage";
import StatsPage from "./pages/StatsPage";
import { BookOpen, AlertTriangle, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 } },
});

function SetupGuidePage() {
  const [copied, setCopied] = useState(false);

  const envTemplate = `VITE_FIREBASE_API_KEY=여기에-API-키
VITE_FIREBASE_AUTH_DOMAIN=프로젝트ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=프로젝트ID
VITE_FIREBASE_STORAGE_BUCKET=프로젝트ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=발신자ID
VITE_FIREBASE_APP_ID=앱ID`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(envTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-yellow-100 p-2">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Firebase 설정 필요</h1>
            <p className="text-sm text-gray-500">앱을 사용하려면 Firebase를 먼저 설정하세요</p>
          </div>
        </div>

        <div className="space-y-5">
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">1단계: Firebase 프로젝트 생성</h2>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>
                <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer"
                  className="text-primary-600 hover:underline">Firebase 콘솔</a>에서 새 프로젝트 생성
              </li>
              <li>Authentication → 이메일/비밀번호 로그인 활성화</li>
              <li>Firestore Database 생성</li>
              <li>Storage 활성화</li>
              <li>프로젝트 설정 → 웹 앱 등록 → 설정값 복사</li>
            </ol>
          </section>

          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-700">2단계: .env 파일 생성</h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 transition"
              >
                {copied ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? '복사됨' : '복사'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              프로젝트 루트에 <code className="bg-gray-100 px-1 rounded">.env</code> 파일을 만들고 아래 내용을 입력하세요:
            </p>
            <pre className="rounded-lg bg-gray-900 p-4 text-xs text-green-400 overflow-x-auto">
{envTemplate}
            </pre>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">3단계: 개발 서버 재시작</h2>
            <p className="text-sm text-gray-600">
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">npm run dev</code> 로 서버를 재시작하면 로그인 화면이 나타납니다.
            </p>
          </section>
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 p-3">
          <p className="text-xs text-blue-700">
            💡 <strong>참고:</strong> <code className="bg-blue-100 px-1 rounded">.env.example</code> 파일을 복사해서 사용할 수도 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('jngdy@naver.com');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isSignUp) {
        if (!displayName.trim()) { setError('이름을 입력하세요'); setSubmitting(false); return; }
        await signUp(email, password, displayName.trim());
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      const code = err?.code ?? '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') setError('이메일 또는 비밀번호가 올바르지 않습니다');
      else if (code === 'auth/email-already-in-use') setError('이미 사용 중인 이메일입니다');
      else if (code === 'auth/weak-password') setError('비밀번호는 6자 이상이어야 합니다');
      else if (code === 'auth/invalid-email') setError('올바른 이메일 형식이 아닙니다');
      else setError(err?.message ?? '오류가 발생했습니다');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100/40" />
      <div className="absolute top-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary-200/30 to-primary-400/10 blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-primary-300/20 to-primary-100/10 blur-3xl" />

      <div className="relative w-full max-w-sm animate-scale-in">
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 p-8 shadow-2xl shadow-primary-500/5">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 mb-4">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-800 to-primary-500 bg-clip-text text-transparent">
              BookBuddy
            </h1>
            <p className="mt-1.5 text-sm text-gray-400">친구들과 도서를 쉽게 공유하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">이름</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/60 px-4 py-2.5 text-sm transition-all duration-200 focus:bg-white focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 hover:border-gray-400 placeholder:text-gray-400"
                  placeholder="홍길동"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-white/60 px-4 py-2.5 text-sm transition-all duration-200 focus:bg-white focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 hover:border-gray-400 placeholder:text-gray-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-gray-200 bg-white/60 px-4 py-2.5 text-sm transition-all duration-200 focus:bg-white focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 hover:border-gray-400 placeholder:text-gray-400"
                placeholder="6자 이상"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-2.5">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoutes() {
  const { user, loading, configured } = useAuth();

  if (!configured) return <SetupGuidePage />;
  if (loading) return <Loading />;
  if (!user) return <LoginPage />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/new" element={<BookNewPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ProtectedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

