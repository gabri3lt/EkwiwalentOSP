import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trash2 } from 'lucide-react';
import type { Operation } from '../App';

interface OperationsListProps {
  operations: Operation[];
  onDeleteOperation: (id: string) => void;
}

export function OperationsList({ operations, onDeleteOperation }: OperationsListProps) {
  if (operations.length === 0) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-center text-gray-500 py-8">
            <p>Brak zdarzeń.</p>
            <p className="text-sm">Dodaj pierwsze zdarzenie.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort operations by date (most recent first)
  const sortedOperations = [...operations].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle>Historia zdarzeń</CardTitle>
        <CardDescription>Wszystkie zdarzenia</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Strażak</TableHead>
                <TableHead>Typ zdarzenia</TableHead>
                <TableHead className="text-right">Godzina</TableHead>
                <TableHead className="text-right">Stawka</TableHead>
                <TableHead className="text-right">Kwota</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOperations.map((operation) => (
                <TableRow key={operation.id}>
                  <TableCell>
                    {new Date(operation.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{operation.memberName}</TableCell>
                  <TableCell>{operation.type}</TableCell>
                  <TableCell className="text-right">{operation.hours}</TableCell>
                  <TableCell className="text-right">{operation.rate}zł/hr</TableCell>
                  <TableCell className="text-right text-red-900">
                    {operation.total.toFixed(2)}zł
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteOperation(operation.id)}
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
