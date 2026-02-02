import { useState } from 'react';
import { useAllGovRoles, useAssignGovRole, useRevokeGovRole, GovRole, GOV_ROLE_LABELS } from '@/hooks/useGovRole';
import { useIsStatsminister } from '@/hooks/useGovRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, UserPlus, Trash2, AlertTriangle, Building2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const DEPARTMENTS = [
  'Statsrådsberedningen',
  'Arbetsmarknadsdepartementet',
  'Finansdepartementet',
  'Försvarsdepartementet',
  'Justitiedepartementet',
  'Klimat- och näringslivsdepartementet',
  'Kulturdepartementet',
  'Landsbygds- och infrastrukturdepartementet',
  'Socialdepartementet',
  'Utbildningsdepartementet',
  'Utrikesdepartementet',
];

const REGIONS = [
  'Stockholm',
  'Västra Götaland',
  'Skåne',
  'Östergötland',
  'Uppsala',
  'Jönköping',
  'Halland',
  'Örebro',
  'Gävleborg',
  'Dalarna',
  'Västmanland',
  'Södermanland',
  'Värmland',
  'Kronoberg',
  'Kalmar',
  'Blekinge',
  'Västernorrland',
  'Jämtland',
  'Västerbotten',
  'Norrbotten',
  'Gotland',
];

export function RoleManager() {
  const isStatsminister = useIsStatsminister();
  const { data: allRoles, isLoading } = useAllGovRoles();
  const assignRole = useAssignGovRole();
  const revokeRole = useRevokeGovRole();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<GovRole>('operativ');
  const [department, setDepartment] = useState('');
  const [region, setRegion] = useState('');

  if (!isStatsminister) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="flex items-center gap-4 p-6">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <div>
            <h3 className="font-semibold">Behörighet saknas</h3>
            <p className="text-sm text-muted-foreground">
              Endast statsminister kan hantera användarroller
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAssignRole = async () => {
    try {
      // First, find user by email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .ilike('display_name', `%${email}%`)
        .limit(1);

      if (profileError || !profiles?.length) {
        toast.error('Användare hittades inte');
        return;
      }

      await assignRole.mutateAsync({
        userId: profiles[0].id,
        role: selectedRole,
        department: selectedRole === 'departementsansvarig' ? department : undefined,
        region: selectedRole === 'operativ' ? region : undefined,
      });

      toast.success('Roll tilldelad');
      setIsDialogOpen(false);
      setEmail('');
      setSelectedRole('operativ');
      setDepartment('');
      setRegion('');
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Kunde inte tilldela roll');
    }
  };

  const handleRevokeRole = async (roleId: string) => {
    try {
      await revokeRole.mutateAsync(roleId);
      toast.success('Roll borttagen');
    } catch (error) {
      console.error('Error revoking role:', error);
      toast.error('Kunde inte ta bort roll');
    }
  };

  const getRoleBadgeColor = (role: GovRole) => {
    switch (role) {
      case 'statsminister':
        return 'bg-amber-500/20 text-amber-600 border-amber-500/30';
      case 'departementsansvarig':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'operativ':
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Rollhantering</CardTitle>
              <CardDescription>Tilldela och hantera användarroller</CardDescription>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Tilldela roll
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tilldela ny roll</DialogTitle>
                <DialogDescription>
                  Ange användarens namn/e-post och välj roll att tilldela
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Användare</label>
                  <Input
                    placeholder="Sök efter namn..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Roll</label>
                  <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as GovRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="statsminister">Statsminister</SelectItem>
                      <SelectItem value="departementsansvarig">Departementsansvarig</SelectItem>
                      <SelectItem value="operativ">Operativ nivå</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedRole === 'departementsansvarig' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Departement</label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj departement..." />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedRole === 'operativ' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Region</label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj region..." />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map((reg) => (
                          <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Avbryt
                </Button>
                <Button onClick={handleAssignRole} disabled={!email || assignRole.isPending}>
                  {assignRole.isPending ? 'Tilldelar...' : 'Tilldela roll'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Användare</TableHead>
                <TableHead>Roll</TableHead>
                <TableHead>Tilldelning</TableHead>
                <TableHead>Tilldelad</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allRoles?.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    {role.display_name || 'Okänd användare'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(role.role as GovRole)} variant="outline">
                      {GOV_ROLE_LABELS[role.role as GovRole] || role.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {role.department && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        {role.department}
                      </span>
                    )}
                    {role.region && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {role.region}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(role.assigned_at).toLocaleDateString('sv-SE')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRevokeRole(role.id)}
                      disabled={revokeRole.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!allRoles || allRoles.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Inga roller tilldelade än
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
