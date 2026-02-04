import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export function RegisterForm() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }

    if (password.length < 8) {
      setError('Lösenordet måste vara minst 8 tecken');
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(email, password, displayName);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      setIsLoading(false);
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

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto font-mono">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-mono">[OK] KONTO SKAPAT</CardTitle>
          <CardDescription className="font-mono">
            Du är nu inloggad och har tillgång till Observer-nivån
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted space-y-2">
            <div>
              <p className="text-sm font-mono">Välkommen till DISSG</p>
              <p className="text-xs text-muted-foreground font-mono">
                Du har nu tillgång till alla Observer-funktioner.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full font-mono" asChild>
            <Link to="/">[LÄNK] Gå till Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto font-mono">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-mono">SKAPA KONTO</CardTitle>
        <CardDescription className="font-mono">
          DISSG – Diagnostikinformationssystem för Samhällsstyrning
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
          {isGoogleLoading ? '[...] Ansluter' : '[GOOGLE] Registrera med Google'}
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
            <Label htmlFor="displayName" className="font-mono">Visningsnamn</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="Förnamn Efternamn"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoComplete="name"
              className="font-mono"
            />
          </div>

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
            <Label htmlFor="password" className="font-mono">Lösenord</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minst 8 tecken"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-mono">Bekräfta lösenord</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Upprepa lösenordet"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="font-mono"
            />
          </div>
          
          <p className="text-xs text-muted-foreground font-mono">
            Genom att registrera godkänner du systemets användningsvillkor.
          </p>
          
          <Button type="submit" className="w-full font-mono" disabled={isLoading}>
            {isLoading ? '[...] Registrerar' : '[+] Skapa konto'}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full font-mono">
          Har du redan konto?{' '}
          <Link to="/login" className="text-primary hover:underline">
            [LÄNK] Logga in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
