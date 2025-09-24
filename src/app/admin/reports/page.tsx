
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import type { Seller } from "@/lib/types";
import { getSellers } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const approvedSellers = (await getSellers()).filter(s => s.status === 'approved');
        setSellers(approvedSellers);
      } catch (error) {
        console.error("Failed to fetch data for reports:", error);
        toast({
          title: "Error",
          description: "Could not fetch data for reports.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  const handleExport = () => {
    toast({
        title: "Generating Report...",
        description: "Your data export will be available shortly."
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">Reports</h1>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export All Data
        </Button>
      </div>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>A summary of sales performance.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for a chart */}
            <div className="h-60 w-full bg-secondary rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Sales chart will be displayed here.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Seller Performance</CardTitle>
            <CardDescription>Key metrics for each seller.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Seller</TableHead>
                  <TableHead>Products Listed</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Commission Earned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                   Array.from({length: 3}).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32"/></TableCell>
                      <TableCell><Skeleton className="h-5 w-16"/></TableCell>
                      <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                      <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                    </TableRow>
                   ))
                ) : (
                  sellers.map(seller => {
                    // Mock data for sales and commission for now
                    const totalSales = 85300; 
                    const commission = totalSales * (seller.commissionRate / 100);
                    return (
                      <TableRow key={seller.id}>
                        <TableCell className="font-medium">{seller.name}</TableCell>
                        <TableCell>12</TableCell> {/* This would require counting products */}
                        <TableCell>₹{Number(totalSales).toLocaleString('en-IN')}</TableCell>
                        <TableCell>₹{Number(commission).toLocaleString('en-IN')}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
