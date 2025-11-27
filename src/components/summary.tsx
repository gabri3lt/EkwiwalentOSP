import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DollarSign, Clock, Flame, Users } from 'lucide-react';
import type { Operation, Member } from '../App';

interface SummaryProps {
  operations: Operation[];
  members: Member[];
}

export function Summary({ operations, members }: SummaryProps) {
  // Calculate totals
  const totalCompensation = operations.reduce((sum, op) => sum + op.total, 0);
  const totalHours = operations.reduce((sum, op) => sum + op.hours, 0);
  const totalOperations = operations.length;

  // Calculate per member summary
  const memberSummary = members.map(member => {
    const memberOps = operations.filter(op => op.memberId === member.id);
    const total = memberOps.reduce((sum, op) => sum + op.total, 0);
    const hours = memberOps.reduce((sum, op) => sum + op.hours, 0);
    const count = memberOps.length;
    
    return {
      ...member,
      operations: count,
      hours,
      total,
    };
  }).sort((a, b) => b.total - a.total);

  // Calculate by operation type
  const typeMap = new Map<string, { count: number; hours: number; total: number }>();
  operations.forEach(op => {
    const current = typeMap.get(op.type) || { count: 0, hours: 0, total: 0 };
    typeMap.set(op.type, {
      count: current.count + 1,
      hours: current.hours + op.hours,
      total: current.total + op.total,
    });
  });

  const typeSummary = Array.from(typeMap.entries())
    .map(([type, data]) => ({ type, ...data }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Wynik</CardTitle>
              <DollarSign className="size-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-red-900">{totalCompensation.toFixed(2)}zł</div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Liczba godzin</CardTitle>
              <Clock className="size-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-red-900">{totalHours.toFixed(1)} hrs</div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Zdarzenia</CardTitle>
              <Flame className="size-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-red-900">{totalOperations}</div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Aktywni strażacy</CardTitle>
              <Users className="size-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-red-900">{memberSummary.filter(m => m.operations > 0).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Member Summary */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle>Ekwiwalent</CardTitle>
          <CardDescription>Wysokość ekwiwalentu</CardDescription>
        </CardHeader>
        <CardContent>
          {memberSummary.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Brak wyników.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Strażak</TableHead>
                  <TableHead>Stanowisko</TableHead>
                  <TableHead className="text-right">Zdarzenia</TableHead>
                  <TableHead className="text-right">Czas</TableHead>
                  <TableHead className="text-right">Wynik</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberSummary.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.rank}</TableCell>
                    <TableCell className="text-right">{member.operations}</TableCell>
                    <TableCell className="text-right">{member.hours.toFixed(1)}</TableCell>
                    <TableCell className="text-right text-red-900">
                      {member.total.toFixed(2)}zł
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Operation Type Summary */}
      {typeSummary.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle>Breakdown by Operation Type</CardTitle>
            <CardDescription>Summary of all operation types</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operation Type</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-right">Total Compensation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {typeSummary.map((item) => (
                  <TableRow key={item.type}>
                    <TableCell>{item.type}</TableCell>
                    <TableCell className="text-right">{item.count}</TableCell>
                    <TableCell className="text-right">{item.hours.toFixed(1)}</TableCell>
                    <TableCell className="text-right text-red-900">
                      {item.total.toFixed(2)}zł
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
