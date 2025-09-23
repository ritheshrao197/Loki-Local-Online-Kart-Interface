import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const disputes = [
  { id: 'D001', orderId: 'order_102', buyer: 'Rohan Mehta', seller: 'Spice Route Goods', reason: 'Item not as described', status: 'pending' },
  { id: 'D002', orderId: 'order_101', buyer: 'Anjali Sharma', seller: 'Artisan Crafts Co.', reason: 'Late delivery', status: 'resolved' },
];

const statusVariant = {
  pending: 'destructive',
  resolved: 'default',
} as const;

export default function DisputesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Dispute Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Open Disputes</CardTitle>
          <CardDescription>Handle disputes, refunds, or escalations involving transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dispute ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell className="font-medium">{dispute.id}</TableCell>
                  <TableCell>{dispute.orderId}</TableCell>
                  <TableCell>{dispute.buyer}</TableCell>
                  <TableCell>{dispute.seller}</TableCell>
                  <TableCell>{dispute.reason}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[dispute.status as keyof typeof statusVariant]}>
                      {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {dispute.status === 'pending' ? (
                      <Button variant="outline" size="sm">Review</Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">Closed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
