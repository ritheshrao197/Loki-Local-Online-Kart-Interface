import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockSellers } from '@/lib/placeholder-data';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CommissionsPage() {
  const approvedSellers = mockSellers.filter(s => s.status === 'approved');

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Commission Management</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Set Commission Rate</CardTitle>
              <CardDescription>Update commission for a specific seller or category.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seller-select">Select Seller</Label>
                <Select>
                  <SelectTrigger id="seller-select">
                    <SelectValue placeholder="Select a seller" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedSellers.map(seller => (
                      <SelectItem key={seller.id} value={seller.id}>{seller.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                <Input id="commission-rate" type="number" placeholder="e.g. 15" />
              </div>
              <Button className="w-full">Update Rate</Button>
            </CardContent>
          </Card>
           <Card className="mt-8">
            <CardHeader>
                <CardTitle>Commission Slabs</CardTitle>
                <CardDescription>Define commission tiers based on performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between text-sm">
                    <span>Sales &lt; ₹50,000</span>
                    <Badge variant="secondary">15%</Badge>
                </div>
                 <div className="flex items-center justify-between text-sm">
                    <span>Sales ₹50,000 - ₹1,00,000</span>
                    <Badge variant="secondary">12%</Badge>
                </div>
                 <div className="flex items-center justify-between text-sm">
                    <span>Sales &gt; ₹1,00,000</span>
                    <Badge variant="secondary">10%</Badge>
                </div>
                <Button variant="outline" className="w-full">Edit Slabs</Button>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
           <Card>
             <CardHeader>
                <CardTitle>Seller Commissions</CardTitle>
                <CardDescription>Current commission rates for all approved sellers.</CardDescription>
             </CardHeader>
             <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Seller</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Commission</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {approvedSellers.map(seller => (
                            <TableRow key={seller.id}>
                                <TableCell className="font-medium">{seller.name}</TableCell>
                                <TableCell className="text-muted-foreground">Apparel</TableCell>
                                <TableCell className="text-right">{seller.commissionRate ?? 15}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
