import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { FileText, Download, Calendar } from 'lucide-react';
import type { Operation, Member } from '../App';

interface QuarterlyReportsProps {
  operations: Operation[];
  members: Member[];
}

interface QuarterData {
  quarter: string;
  year: number;
  startDate: Date;
  endDate: Date;
  operations: Operation[];
}

export function QuarterlyReports({ operations, members }: QuarterlyReportsProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedQuarter, setSelectedQuarter] = useState('');

  // Generate available years from operations
  const availableYears = Array.from(
    new Set(operations.map(op => new Date(op.date).getFullYear()))
  ).sort((a, b) => b - a);

  // Add current year if not in the list
  if (!availableYears.includes(currentYear)) {
    availableYears.unshift(currentYear);
  }

  // If no years available, add current year
  if (availableYears.length === 0) {
    availableYears.push(currentYear);
  }

  const quarters = [
    { value: 'Q1', label: 'Q1 (Styczeń - Marzec)' },
    { value: 'Q2', label: 'Q2 (Kwiecień - Czerwiec)' },
    { value: 'Q3', label: 'Q3 (Lipiec - Wrzesień)' },
    { value: 'Q4', label: 'Q4 (Październik - Grudzień)' },
  ];

  const getQuarterDateRange = (quarter: string, year: number): { start: Date; end: Date } => {
    const quarterMap: { [key: string]: { startMonth: number; endMonth: number } } = {
      Q1: { startMonth: 0, endMonth: 2 },
      Q2: { startMonth: 3, endMonth: 5 },
      Q3: { startMonth: 6, endMonth: 8 },
      Q4: { startMonth: 9, endMonth: 11 },
    };

    const { startMonth, endMonth } = quarterMap[quarter];
    const start = new Date(year, startMonth, 1);
    const end = new Date(year, endMonth + 1, 0, 23, 59, 59);

    return { start, end };
  };

  const getQuarterData = (quarter: string, year: number): QuarterData => {
    const { start, end } = getQuarterDateRange(quarter, year);

    const quarterOps = operations.filter(op => {
      const opDate = new Date(op.date);
      return opDate >= start && opDate <= end;
    });

    return {
      quarter,
      year,
      startDate: start,
      endDate: end,
      operations: quarterOps,
    };
  };

  const generateReport = () => {
    if (!selectedQuarter) return null;

    const data = getQuarterData(selectedQuarter, parseInt(selectedYear));
    
    // Calculate totals
    const totalCompensation = data.operations.reduce((sum, op) => sum + op.total, 0);
    const totalHours = data.operations.reduce((sum, op) => sum + op.hours, 0);
    const totalOperations = data.operations.length;

    // Member summary
    const memberSummary = members.map(member => {
      const memberOps = data.operations.filter(op => op.memberId === member.id);
      const total = memberOps.reduce((sum, op) => sum + op.total, 0);
      const hours = memberOps.reduce((sum, op) => sum + op.hours, 0);
      const count = memberOps.length;
      
      return {
        ...member,
        operations: count,
        hours,
        total,
      };
    }).filter(m => m.operations > 0).sort((a, b) => b.total - a.total);

    // Operation type summary
    const typeMap = new Map<string, { count: number; hours: number; total: number }>();
    data.operations.forEach(op => {
      const current = typeMap.get(op.type) || { count: 0, hours: 0, total: 0 };
      typeMap.set(op.type, {
        count: current.count + 1,
        hours: current.hours + op.hours,
        total: current.total + op.total,
      });
    });

    const typeSummary = Array.from(typeMap.entries())
      .map(([type, stats]) => ({ type, ...stats }))
      .sort((a, b) => b.total - a.total);

    return {
      data,
      totalCompensation,
      totalHours,
      totalOperations,
      memberSummary,
      typeSummary,
    };
  };

  const report = generateReport();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Selection Card */}
      <Card className="border-red-200 print:hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            Raporty kwartalne
          </CardTitle>
          <CardDescription>Wybierz rok i kwartał, aby wygenerować raport</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Rok</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Wybierz rok" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quarter">Kwartał</Label>
              <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                <SelectTrigger id="quarter">
                  <SelectValue placeholder="Wybierz kwartał" />
                </SelectTrigger>
                <SelectContent>
                  {quarters.map(q => (
                    <SelectItem key={q.value} value={q.value}>
                      {q.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handlePrint}
                disabled={!selectedQuarter}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Download className="size-4 mr-2" />
                Drukuj raport
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Display */}
      {report ? (
        <div className="space-y-6">
          {/* Report Header */}
          <Card className="border-red-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="size-5" />
                    Raport kwartalny {report.data.quarter} {report.data.year}
                  </CardTitle>
                  <CardDescription>
                    Okres: {report.data.startDate.toLocaleDateString('pl-PL')} - {report.data.endDate.toLocaleDateString('pl-PL')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-sm text-red-700 mb-1">Łączny ekwiwalent</div>
                  <div className="text-red-900">{report.totalCompensation.toFixed(2)} zł</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-sm text-red-700 mb-1">Łączne godziny</div>
                  <div className="text-red-900">{report.totalHours.toFixed(1)} godz.</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-sm text-red-700 mb-1">Liczba zdarzeń</div>
                  <div className="text-red-900">{report.totalOperations}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Member Details */}
          {report.memberSummary.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle>Ekwiwalent według strażaków</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Strażak</TableHead>
                      <TableHead>Stopień</TableHead>
                      <TableHead className="text-right">Zdarzenia</TableHead>
                      <TableHead className="text-right">Godziny</TableHead>
                      <TableHead className="text-right">Ekwiwalent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.memberSummary.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.rank}</TableCell>
                        <TableCell className="text-right">{member.operations}</TableCell>
                        <TableCell className="text-right">{member.hours.toFixed(1)}</TableCell>
                        <TableCell className="text-right text-red-900">
                          {member.total.toFixed(2)} zł
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 border-red-300">
                      <TableCell colSpan={2}><strong>Razem</strong></TableCell>
                      <TableCell className="text-right"><strong>{report.totalOperations}</strong></TableCell>
                      <TableCell className="text-right"><strong>{report.totalHours.toFixed(1)}</strong></TableCell>
                      <TableCell className="text-right text-red-900">
                        <strong>{report.totalCompensation.toFixed(2)} zł</strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Operation Type Breakdown */}
          {report.typeSummary.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle>Rodzaje zdarzeń</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rodzaj zdarzenia</TableHead>
                      <TableHead className="text-right">Liczba</TableHead>
                      <TableHead className="text-right">Godziny</TableHead>
                      <TableHead className="text-right">Ekwiwalent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.typeSummary.map((item) => (
                      <TableRow key={item.type}>
                        <TableCell>{item.type}</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                        <TableCell className="text-right">{item.hours.toFixed(1)}</TableCell>
                        <TableCell className="text-right text-red-900">
                          {item.total.toFixed(2)} zł
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* All Operations Detail */}
          {report.data.operations.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle>Szczegóły wszystkich zdarzeń</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Strażak</TableHead>
                        <TableHead>Rodzaj zdarzenia</TableHead>
                        <TableHead className="text-right">Godziny</TableHead>
                        <TableHead className="text-right">Stawka</TableHead>
                        <TableHead className="text-right">Ekwiwalent</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.data.operations
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((operation) => (
                          <TableRow key={operation.id}>
                            <TableCell>
                              {new Date(operation.date).toLocaleDateString('pl-PL')}
                            </TableCell>
                            <TableCell>{operation.memberName}</TableCell>
                            <TableCell>{operation.type}</TableCell>
                            <TableCell className="text-right">{operation.hours}</TableCell>
                            <TableCell className="text-right">{operation.rate} zł/godz.</TableCell>
                            <TableCell className="text-right text-red-900">
                              {operation.total.toFixed(2)} zł
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {report.data.operations.length === 0 && (
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <div className="text-center text-gray-500 py-8">
                  <FileText className="size-12 mx-auto mb-2 text-gray-400" />
                  <p>Brak zdarzeń w wybranym okresie.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center text-gray-500 py-8">
              <FileText className="size-12 mx-auto mb-2 text-gray-400" />
              <p>Wybierz rok i kwartał powyżej, aby wygenerować raport.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
