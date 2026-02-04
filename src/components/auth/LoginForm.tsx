import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message === 'Invalid login credentials' 
        ? 'Felaktiga inloggningsuppgifter'
        : error.message);
      setIsLoading(false);
    } else {
      navigate('/');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    
    if (error) {
      setError(error.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto font-mono">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-mono">LOGGA IN</CardTitle>
        <CardDescription className="font-mono">
          DISSG – Diagnostic Information System for Societal Governance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="font-mono">[X] {error}</AlertDescription>
          </Alert>
        )}

        <Button
          variant="outline"
          className="w-full font-mono"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? '[...] Ansluter' : '[GOOGLE] Logga in med Google'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-mono">eller</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-mono">E-postadress</Label>
            <Input
              id="email"
              type="email"
              placeholder="namn@departement.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="font-mono"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="font-mono">Lösenord</Label>
              <Link 
                to="/forgot-password" 
                className="text-xs text-muted-foreground hover:text-primary font-mono"
              >
                [GLÖMT]
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="font-mono"
            />
          </div>
          
          <Button type="submit" className="w-full font-mono" disabled={isLoading}>
            {isLoading ? '[...] Loggar in' : '[OK] Logga in'}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <p className="text-xs text-muted-foreground text-center font-mono">
          Saknar du konto?{' '}
          <Link to="/register" className="text-primary hover:underline">
            [+] Registrera
          </Link>
        </p>
        
        <Link 
          to="/public" 
          className="text-xs text-muted-foreground hover:text-primary text-center block font-mono"
        >
          [LÄNK] Visa publik dashboard
        </Link>
      </CardFooter>
    </Card>
  );
}
