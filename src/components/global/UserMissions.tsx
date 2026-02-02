/**
 * 🎯 USER MISSIONS COMPONENT
 * 
 * "Ansvar utan skuld" – Personal tracking without judgment.
 * Users define what they care about and follow the development over time.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Bookmark, 
  Plus, 
  MapPin, 
  Globe, 
  Building, 
  Tag,
  TrendingUp,
  TrendingDown,
  Minus,
  HelpCircle,
  Bell,
  BellOff,
  Trash2,
  Settings,
  Lock,
} from 'lucide-react';
import { MISSIONS_COPY, getTranslation } from '@/config/bigQuestionsContent';
import { useToast } from '@/hooks/use-toast';

// ============================================================
// TYPES
// ============================================================

interface Mission {
  id: string;
  user_id: string;
  focus_type: 'municipality' | 'region' | 'country' | 'topic';
  focus_id: string;
  focus_name: string;
  title: string | null;
  description: string | null;
  tracking_enabled: boolean;
  notification_frequency: 'daily' | 'weekly' | 'monthly' | 'never';
  tracked_question_ids: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface MissionSnapshot {
  id: string;
  mission_id: string;
  snapshot_date: string;
  direction: 'improving' | 'declining' | 'stable' | 'unclear';
  direction_score: number | null;
  key_indicators: Record<string, unknown>;
  summary_text: string | null;
  created_at: string;
}

interface UserMissionsProps {
  language?: 'sv' | 'en';
  userId?: string;
  isPro?: boolean;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function UserMissions({ 
  language = 'sv', 
  userId,
  isPro = false,
}: UserMissionsProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's missions
  const { data: missions, isLoading } = useQuery({
    queryKey: ['user-missions', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_missions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Mission[];
    },
    enabled: !!userId,
  });

  // Delete mission mutation
  const deleteMission = useMutation({
    mutationFn: async (missionId: string) => {
      const { error } = await supabase
        .from('user_missions')
        .update({ is_active: false })
        .eq('id', missionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-missions'] });
      toast({
        title: language === 'sv' ? 'Mission borttagen' : 'Mission removed',
      });
    },
  });

  // Not logged in
  if (!userId) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">
            {language === 'sv' ? 'Logga in för att skapa missions' : 'Log in to create missions'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {getTranslation(MISSIONS_COPY.principle, language)}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Not pro
  if (!isPro) {
    return (
      <Card className="border-dashed border-primary/30">
        <CardContent className="py-12 text-center">
          <Bookmark className="h-12 w-12 mx-auto text-primary/50 mb-4" />
          <h3 className="font-medium mb-2">
            {getTranslation(MISSIONS_COPY.title, language)}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
            {getTranslation(MISSIONS_COPY.requires_pro, language)}
          </p>
          <Button>
            {language === 'sv' ? 'Uppgradera till Pro' : 'Upgrade to Pro'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            {getTranslation(MISSIONS_COPY.title, language)}
          </h2>
          <p className="text-sm text-muted-foreground">
            {getTranslation(MISSIONS_COPY.principle, language)}
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {getTranslation(MISSIONS_COPY.create_title, language).split(' ').slice(0, 2).join(' ')}
            </Button>
          </DialogTrigger>
          <CreateMissionDialog 
            language={language} 
            userId={userId}
            onClose={() => setIsCreateOpen(false)}
            onCreated={() => {
              setIsCreateOpen(false);
              queryClient.invalidateQueries({ queryKey: ['user-missions'] });
            }}
          />
        </Dialog>
      </div>

      {/* Missions list */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : missions?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {getTranslation(MISSIONS_COPY.no_missions, language)}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {missions?.map((mission, index) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                language={language}
                index={index}
                onDelete={() => deleteMission.mutate(mission.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MISSION CARD
// ============================================================

interface MissionCardProps {
  mission: Mission;
  language: 'sv' | 'en';
  index: number;
  onDelete: () => void;
}

function MissionCard({ mission, language, index, onDelete }: MissionCardProps) {
  // Mock direction for demo - in production this would come from snapshot
  const direction = ['improving', 'declining', 'stable', 'unclear'][Math.floor(Math.random() * 4)] as 'improving' | 'declining' | 'stable' | 'unclear';

  const focusIcons = {
    municipality: MapPin,
    region: Building,
    country: Globe,
    topic: Tag,
  };
  const FocusIcon = focusIcons[mission.focus_type];

  const directionConfig = {
    improving: { 
      icon: TrendingUp, 
      label: getTranslation(MISSIONS_COPY.direction_improving, language),
      className: 'text-green-600 bg-green-500/10',
    },
    declining: { 
      icon: TrendingDown, 
      label: getTranslation(MISSIONS_COPY.direction_declining, language),
      className: 'text-red-600 bg-red-500/10',
    },
    stable: { 
      icon: Minus, 
      label: getTranslation(MISSIONS_COPY.direction_stable, language),
      className: 'text-muted-foreground bg-muted',
    },
    unclear: { 
      icon: HelpCircle, 
      label: getTranslation(MISSIONS_COPY.direction_unclear, language),
      className: 'text-amber-600 bg-amber-500/10',
    },
  };

  const DirectionIcon = directionConfig[direction].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <Badge variant="outline" className="flex items-center gap-1">
              <FocusIcon className="h-3 w-3" />
              {mission.focus_type === 'municipality' 
                ? getTranslation(MISSIONS_COPY.focus_municipality, language)
                : mission.focus_type === 'region'
                ? getTranslation(MISSIONS_COPY.focus_region, language)
                : mission.focus_type === 'country'
                ? getTranslation(MISSIONS_COPY.focus_country, language)
                : getTranslation(MISSIONS_COPY.focus_topic, language)
              }
            </Badge>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardTitle className="text-lg">
            {mission.title || mission.focus_name}
          </CardTitle>
          {mission.description && (
            <CardDescription>{mission.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {/* Direction indicator */}
          <div className={`flex items-center gap-2 p-3 rounded-lg ${directionConfig[direction].className}`}>
            <DirectionIcon className="h-5 w-5" />
            <span className="text-sm font-medium">
              {directionConfig[direction].label}
            </span>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground flex items-center justify-between">
          <span>
            {language === 'sv' ? 'Skapad' : 'Created'}: {new Date(mission.created_at).toLocaleDateString(language)}
          </span>
          {mission.tracking_enabled ? (
            <Bell className="h-4 w-4" />
          ) : (
            <BellOff className="h-4 w-4" />
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// ============================================================
// CREATE MISSION DIALOG
// ============================================================

interface CreateMissionDialogProps {
  language: 'sv' | 'en';
  userId: string;
  onClose: () => void;
  onCreated: () => void;
}

function CreateMissionDialog({ language, userId, onClose, onCreated }: CreateMissionDialogProps) {
  const [focusType, setFocusType] = useState<'municipality' | 'region' | 'country' | 'topic'>('municipality');
  const [focusName, setFocusName] = useState('');
  const [title, setTitle] = useState('');
  const { toast } = useToast();

  const createMission = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('user_missions')
        .insert({
          user_id: userId,
          focus_type: focusType,
          focus_id: focusName.toLowerCase().replace(/\s+/g, '-'),
          focus_name: focusName,
          title: title || null,
          tracking_enabled: true,
          notification_frequency: 'weekly',
          tracked_question_ids: [],
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: language === 'sv' ? 'Mission skapad!' : 'Mission created!',
      });
      onCreated();
    },
    onError: () => {
      toast({
        title: language === 'sv' ? 'Kunde inte skapa mission' : 'Could not create mission',
        variant: 'destructive',
      });
    },
  });

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{getTranslation(MISSIONS_COPY.create_title, language)}</DialogTitle>
        <DialogDescription>
          {getTranslation(MISSIONS_COPY.create_description, language)}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* Focus type */}
        <div className="space-y-3">
          <Label>{getTranslation(MISSIONS_COPY.focus_type_label, language)}</Label>
          <RadioGroup 
            value={focusType} 
            onValueChange={(v) => setFocusType(v as typeof focusType)}
            className="grid grid-cols-2 gap-2"
          >
            <Label htmlFor="municipality" className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <RadioGroupItem value="municipality" id="municipality" />
              <MapPin className="h-4 w-4" />
              <span>{getTranslation(MISSIONS_COPY.focus_municipality, language)}</span>
            </Label>
            <Label htmlFor="region" className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <RadioGroupItem value="region" id="region" />
              <Building className="h-4 w-4" />
              <span>{getTranslation(MISSIONS_COPY.focus_region, language)}</span>
            </Label>
            <Label htmlFor="country" className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <RadioGroupItem value="country" id="country" />
              <Globe className="h-4 w-4" />
              <span>{getTranslation(MISSIONS_COPY.focus_country, language)}</span>
            </Label>
            <Label htmlFor="topic" className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <RadioGroupItem value="topic" id="topic" />
              <Tag className="h-4 w-4" />
              <span>{getTranslation(MISSIONS_COPY.focus_topic, language)}</span>
            </Label>
          </RadioGroup>
        </div>

        {/* Focus name */}
        <div className="space-y-2">
          <Label htmlFor="focus-name">
            {focusType === 'topic' 
              ? (language === 'sv' ? 'Ämne' : 'Topic')
              : (language === 'sv' ? 'Namn' : 'Name')}
          </Label>
          <Input
            id="focus-name"
            value={focusName}
            onChange={(e) => setFocusName(e.target.value)}
            placeholder={focusType === 'topic' 
              ? getTranslation(MISSIONS_COPY.topic_examples, language)
              : (language === 'sv' ? 'T.ex. Stockholm' : 'E.g. Stockholm')}
          />
        </div>

        {/* Optional title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            {language === 'sv' ? 'Egen titel (valfritt)' : 'Custom title (optional)'}
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={language === 'sv' ? 'T.ex. "Min hemkommuns utveckling"' : 'E.g. "My hometown\'s development"'}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          {language === 'sv' ? 'Avbryt' : 'Cancel'}
        </Button>
        <Button 
          onClick={() => createMission.mutate()}
          disabled={!focusName || createMission.isPending}
        >
          {createMission.isPending 
            ? (language === 'sv' ? 'Skapar...' : 'Creating...')
            : (language === 'sv' ? 'Skapa Mission' : 'Create Mission')}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default UserMissions;
