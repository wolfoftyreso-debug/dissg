import { LoginForm } from '@/components/auth/LoginForm';
import { Shield } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-2 rounded-lg bg-primary/5">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
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
