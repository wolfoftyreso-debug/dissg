import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-mono text-muted-foreground tracking-widest">GROS</p>
          <h1 className="text-lg font-semibold tracking-tight">
            Nationellt Ledningssystem
          </h1>
          <p className="text-xs text-muted-foreground">
            Offentlig Styrning – NOGF
          </p>
        </div>
        
        <LoginForm />
        
        <p className="text-xs text-center text-muted-foreground">
          Skyddad av Supabase Auth · Krypterad anslutning
        </p>
      </div>
    </div>
  );
};

export default Login;
