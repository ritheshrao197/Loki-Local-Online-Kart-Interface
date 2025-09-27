'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart } from "lucide-react";
import { placeholderImages } from "@/lib/placeholder-images";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    { ...placeholderImages.find(p => p.id === 'prod_101'), quantity: 1, price: 499, seller: { name: 'Artisan Fabrics Co.' } },
    { ...placeholderImages.find(p => p.id === 'prod_115'), quantity: 1, price: 399, seller: { name: 'GreenEarth' } },
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const shipping = 50;
  const total = subtotal + shipping;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1 
        className="text-3xl font-bold font-headline mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Shopping Cart
      </motion.h1>
      
      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6 space-y-6">
                {cartItems.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="relative w-24 h-24 rounded-md overflow-hidden">
                      <Image
                        src={item.url!}
                        alt={item.name!}
                        fill
                        className="object-cover"
                        data-ai-hint={item.hint}
                      />
                    </div>
                    <div className="flex-1">
                      <motion.h3 
                        className="font-semibold"
                        whileHover={{ scale: 1.02 }}
                      >
                        {item.name}
                      </motion.h3>
                      <p className="text-sm text-muted-foreground">Sold by {item.seller.name}</p>
                      <motion.p 
                        className="text-lg font-bold mt-1"
                        whileHover={{ scale: 1.02 }}
                      >
                        ₹{item.price!.toLocaleString('en-IN')}
                      </motion.p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 h-9"
                      />
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="md:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div 
                  className="flex justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </motion.div>
                <motion.div 
                  className="flex justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <span>Shipping</span>
                  <span className="font-medium">₹{shipping.toLocaleString('en-IN')}</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <Separator />
                </motion.div>
                <motion.div 
                  className="flex justify-between font-bold text-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                >
                  <Button size="lg" className="w-full">Proceed to Checkout</Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        <motion.div 
          className="text-center py-20 border-2 border-dashed rounded-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
          </motion.div>
          <motion.h2 
            className="mt-6 text-xl font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Your cart is empty
          </motion.h2>
          <motion.p 
            className="mt-2 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Looks like you haven't added anything to your cart yet.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button asChild className="mt-6">
              <Link href="/">Start Shopping</Link>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
