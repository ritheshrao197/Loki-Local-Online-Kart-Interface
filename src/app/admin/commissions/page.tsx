
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Seller } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { getSellers, updateSellerCommission } from '@/lib/firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CommissionsPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const [commissionRate, setCommissionRate] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSellers() {
      setLoading(true);
      try {
        const fetchedSellers = await getSellers();
        setSellers(fetchedSellers);
      } catch (error) {
        console.error("Failed to fetch sellers:", error);
        toast({ title: 'Error', description: 'Could not fetch sellers.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchSellers();
  }, [toast]);

  const handleUpdateRate = async () => {
    if (!selectedSeller || !commissionRate) {
        toast({
            title: 'Missing Information',
            description: 'Please select a seller and enter a commission rate.',
            variant: 'destructive',
        });
        return;
    }
    setIsUpdating(true);
    try {
        const rate = parseFloat(commissionRate);
        await updateSellerCommission(selectedSeller, rate);
        
        setSellers(prevSellers =>
            prevSellers.map(seller =>
                seller.id === selectedSeller ? { ...seller, commissionRate: rate } : seller
            )
        );
        toast({
            title: 'Commission Rate Updated',
            description: `Commission for the selected seller has been updated to ${rate}%.`,
        });
        setSelectedSeller('');
        setCommissionRate('');
    } catch (error) {
        console.error("Error updating commission:", error);
        toast({ title: 'Error', description: 'Failed to update commission rate.', variant: 'destructive' });
    } finally {
        setIsUpdating(false);
    }
  };

  const approvedSellers = sellers.filter(s => s.status === 'approved');

  const handleEditSlabs = () => {
    toast({
        title: 'Feature Coming Soon',
        description: 'The ability to edit commission slabs is under development.'
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Commission Management</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Set Commission Rate</CardTitle>
              <CardDescription>Update commission for a specific seller.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seller-select">Select Seller</Label>
                <Select value={selectedSeller} onValueChange={setSelectedSeller} disabled={isUpdating || loading}>
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
                <Input 
                    id="commission-rate" 
                    type="number" 
                    placeholder="e.g. 15" 
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    disabled={isUpdating || loading}
                />
              </div>
              <Button className="w-full" onClick={handleUpdateRate} disabled={isUpdating || loading}>
                {isUpdating && <Loader2 className="mr-2 animate-spin"/>}
                Update Rate
              </Button>
            </CardContent>
          </Card>
           <Card>
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
                <Button variant="outline" className="w-full" onClick={handleEditSlabs}>Edit Slabs</Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1 lg:col-span-2">
           <Card>
             <CardHeader>
                <CardTitle>Seller Commissions</CardTitle>
                <CardDescription>Current commission rates for all approved sellers.</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Seller</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Commission</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                            Array.from({length: 3}).map((_, i) => (
                                <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-32"/></TableCell>
                                <TableCell><Skeleton className="h-6 w-20"/></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-5 w-10 inline-block"/></TableCell>
                                </TableRow>
                            ))
                            ) : (
                            sellers.map(seller => (
                                <TableRow key={seller.id}>
                                    <TableCell className="font-medium">{seller.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <Badge variant={seller.status === 'approved' ? 'default' : 'secondary'}>
                                            {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{seller.commissionRate ?? 15}%</TableCell>
                                </TableRow>
                            ))
                            )}
                        </TableBody>
                    </Table>
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
