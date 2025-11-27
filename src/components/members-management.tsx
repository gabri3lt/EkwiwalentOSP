import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Trash2 } from 'lucide-react';
import type { Member } from '../App';

interface MembersManagementProps {
  members: Member[];
  onAddMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
}

export function MembersManagement({ members, onAddMember, onDeleteMember }: MembersManagementProps) {
  const [name, setName] = useState('');
  const [rank, setRank] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !rank.trim()) return;

    const member: Member = {
      id: Date.now().toString(),
      name: name.trim(),
      rank: rank.trim(),
    };

    onAddMember(member);
    setName('');
    setRank('');
  };

  return (
    <div className="space-y-6">
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle>Dodaj nowego strażaka</CardTitle>
          <CardDescription>Dodawanie nowego strażaka OSP</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Imię i Nazwisko</Label>
                <Input
                  id="name"
                  placeholder="Jank Kowalski"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rank">Stanowisko</Label>
                <Input
                  id="rank"
                  placeholder="e.g., Dowódca, Naczelnik, Strażak ratownik"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
              <Plus className="size-4 mr-2" />
              Dodaj strażaka
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle>Wszyscy strażacy</CardTitle>
          <CardDescription>Lista strażaków OSP</CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Brak zarejestrowanych strażaków.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imię i Nazwisko</TableHead>
                  <TableHead>Stanowisko</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.rank}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteMember(member.id)}
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
