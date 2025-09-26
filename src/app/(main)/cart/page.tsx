
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart } from "lucide-react";
import { placeholderImages } from "@/lib/placeholder-images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review items in your shopping cart and proceed to checkout.',
};

export default function CartPage() {
  const cartItems = [
    { ...placeholderImages.find(p => p.id === 'prod_101'), quantity: 1, price: 499, seller: { name: 'Artisan Fabrics Co.' } },
    { ...placeholderImages.find(p => p.id === 'prod_115'), quantity: 1, price: 399, seller: { name: 'GreenEarth' } },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price! * item.quantity, 0);
  const shipping = 50;
  const total = subtotal + shipping;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">Shopping Cart</h1>
      
      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6 space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <Image
                      src={item.url!}
                      alt={item.name!}
                      width={100}
                      height={100}
                      className="rounded-md object-cover aspect-square"
                      data-ai-hint={item.hint}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Sold by {item.seller.name}</p>
                      <p className="text-lg font-bold mt-1">₹{item.price!.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        defaultValue={item.quantity}
                        className="w-16 h-9"
                      />
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">₹{shipping.toLocaleString('en-IN')}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <Button size="lg" className="w-full">Proceed to Checkout</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-6 text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
