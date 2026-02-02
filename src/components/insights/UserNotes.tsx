/**
 * BLOCK TE — USER NOTES
 * "Personlig anteckning – inte systemets analys"
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  PenLine, MessageSquare, Eye, Plus, 
  Trash2, AlertCircle 
} from 'lucide-react';
import { NOTE_DISCLAIMER_SV, type UserNote } from '@/config/personalInsightConfig';

interface UserNotesProps {
  notes: UserNote[];
  onAddNote: (content: string, type: UserNote['type']) => void;
  onDeleteNote: (id: string) => void;
}

export function UserNotes({ notes, onAddNote, onDeleteNote }: UserNotesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<UserNote['type']>('observation');

  const handleAdd = () => {
    if (newContent.trim()) {
      onAddNote(newContent, newType);
      setNewContent('');
      setIsAdding(false);
    }
  };

  const typeIcons: Record<UserNote['type'], React.ReactNode> = {
    interpretation: <PenLine className="h-4 w-4" />,
    question: <MessageSquare className="h-4 w-4" />,
    observation: <Eye className="h-4 w-4" />,
  };

  const typeLabels: Record<UserNote['type'], string> = {
    interpretation: 'Jag tolkar detta som...',
    question: 'Detta väcker frågan...',
    observation: 'Jag observerar att...',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PenLine className="h-5 w-5 text-primary" />
            Mina anteckningar
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            Personligt
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {NOTE_DISCLAIMER_SV}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing notes */}
        {notes.length > 0 && (
          <div className="space-y-2">
            {notes.map((note) => (
              <div 
                key={note.id}
                className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    {typeIcons[note.type]}
                    <span>{typeLabels[note.type]}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => onDeleteNote(note.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm italic">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(note.createdAt).toLocaleDateString('sv-SE')}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Add new note */}
        {isAdding ? (
          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
            {/* Type selector */}
            <div className="flex gap-2">
              {(Object.keys(typeLabels) as UserNote['type'][]).map((type) => (
                <Button
                  key={type}
                  variant={newType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewType(type)}
                >
                  {typeIcons[type]}
                  <span className="ml-1 text-xs hidden sm:inline">
                    {type === 'interpretation' ? 'Tolkning' : 
                     type === 'question' ? 'Fråga' : 'Observation'}
                  </span>
                </Button>
              ))}
            </div>

            <Textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={typeLabels[newType]}
              className="min-h-[80px]"
            />

            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={!newContent.trim()}>
                Spara
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Avbryt
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Lägg till anteckning
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
