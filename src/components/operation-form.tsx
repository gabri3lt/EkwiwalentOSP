import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import type { Member, Operation } from '../App';

interface OperationFormProps {
  members: Member[];
  onAddOperation: (operation: Operation) => void;
}

const OPERATION_TYPES = [
  { value: 'fire', label: 'Akcja ratownicza', rate: 25 },
  { value: 'training', label: 'Szkolenie/ćwiczenie', rate: 8 },
  { value: 'other', label: 'Zadania zlecone', rate: 5 },
  { value: 'course', label: 'Kurs podstawowy', rate: 5 },
];

export function OperationForm({ members, onAddOperation }: OperationFormProps) {
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember || !selectedType || !hours) return;

    const member = members.find(m => m.id === selectedMember);
    const operationType = OPERATION_TYPES.find(t => t.value === selectedType);
    
    if (!member || !operationType) return;

    const hoursNum = parseFloat(hours);
    const total = hoursNum * operationType.rate;

    const operation: Operation = {
      id: Date.now().toString(),
      memberId: member.id,
      memberName: member.name,
      date,
      type: operationType.label,
      hours: hoursNum,
      rate: operationType.rate,
      total,
    };

    onAddOperation(operation);

    // Reset form
    setSelectedMember('');
    setSelectedType('');
    setHours('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const selectedOperationType = OPERATION_TYPES.find(t => t.value === selectedType);

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle>Dodaj zdarzenie</CardTitle>
        <CardDescription>Dodawanie zdarzenia do wyliczenia ekwiwalentu</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="member">Strażak</Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger id="member">
                  <SelectValue placeholder="Wybierz strażaka" />
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} - {member.rank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Typ zdarzenia</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Wybierz typ zadarzenia" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label} (zł{type.rate}/hr)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Czas</Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0"
                placeholder="0.0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
          </div>

          {selectedOperationType && hours && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-red-900">Calculated Total:</span>
                <span className="text-red-900">
                  {(parseFloat(hours) * selectedOperationType.rate).toFixed(2)}zł
                </span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
            <Plus className="size-4 mr-2" />
            Dodaj zdarzenie
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
