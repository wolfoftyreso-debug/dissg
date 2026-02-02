import { RegisterForm } from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-lg font-semibold tracking-tight">
            Nationellt Ledningssystem
          </h1>
          <p className="text-xs text-muted-foreground">
            Offentlig Styrning – NOGF
          </p>
        </div>
        
        <RegisterForm />
        
        <p className="text-xs text-center text-muted-foreground">
          Nya konton tilldelas automatiskt rollen "Allmänhet".
          <br />
          Kontakta systemadministratör för utökade behörigheter.
        </p>
      </div>
    </div>
  );
};

export default Register;
