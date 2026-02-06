import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
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

  return (
    <Card className="w-full max-w-md mx-auto font-mono">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-mono">LOGGA IN</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="font-mono">{error}</AlertDescription>
          </Alert>
        )}

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
