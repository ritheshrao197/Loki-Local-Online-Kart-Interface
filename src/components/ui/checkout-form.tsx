'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  CreditCard, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Shield, 
  Truck, 
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';
import Image from 'next/image';

interface CheckoutFormProps {
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    seller: { name: string };
  }>;
  onBack: () => void;
  onComplete: (orderData: OrderData) => void;
  className?: string;
}

interface OrderData {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  payment: {
    method: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    upiId?: string;
    bankName?: string;
  };
  delivery: {
    method: 'standard' | 'express' | 'overnight';
    instructions?: string;
  };
  billing: {
    sameAsShipping: boolean;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
}

export function CheckoutForm({ cartItems, onBack, onComplete, className }: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OrderData>({
    customer: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    shipping: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    payment: {
      method: 'card'
    },
    delivery: {
      method: 'standard'
    },
    billing: {
      sameAsShipping: true
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const steps = [
    { id: 1, title: 'Customer Info', icon: User },
    { id: 2, title: 'Shipping', icon: MapPin },
    { id: 3, title: 'Payment', icon: CreditCard },
    { id: 4, title: 'Review', icon: Check }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = formData.delivery.method === 'express' ? 199 : formData.delivery.method === 'overnight' ? 399 : 99;
  const total = subtotal + shipping;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.customer.firstName) newErrors.firstName = 'First name is required';
        if (!formData.customer.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.customer.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.customer.email)) newErrors.email = 'Email is invalid';
        if (!formData.customer.phone) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.customer.phone)) newErrors.phone = 'Phone number must be 10 digits';
        break;
      
      case 2:
        if (!formData.shipping.address) newErrors.address = 'Address is required';
        if (!formData.shipping.city) newErrors.city = 'City is required';
        if (!formData.shipping.state) newErrors.state = 'State is required';
        if (!formData.shipping.pincode) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(formData.shipping.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
        break;
      
      case 3:
        if (formData.payment.method === 'card') {
          if (!formData.payment.cardNumber) newErrors.cardNumber = 'Card number is required';
          else if (!/^\d{16}$/.test(formData.payment.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Card number must be 16 digits';
          if (!formData.payment.expiryDate) newErrors.expiryDate = 'Expiry date is required';
          else if (!/^\d{2}\/\d{2}$/.test(formData.payment.expiryDate)) newErrors.expiryDate = 'Format: MM/YY';
          if (!formData.payment.cvv) newErrors.cvv = 'CVV is required';
          else if (!/^\d{3,4}$/.test(formData.payment.cvv)) newErrors.cvv = 'CVV must be 3-4 digits';
        } else if (formData.payment.method === 'upi') {
          if (!formData.payment.upiId) newErrors.upiId = 'UPI ID is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      setErrors({ terms: 'You must agree to the terms and conditions' });
      return;
    }

    setIsLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onComplete(formData);
    setIsLoading(false);
  };

  const updateFormData = (section: keyof OrderData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.customer.firstName}
                  onChange={(e) => updateFormData('customer', 'firstName', e.target.value)}
                  className={cn(errors.firstName && 'border-red-500')}
                />
                {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.customer.lastName}
                  onChange={(e) => updateFormData('customer', 'lastName', e.target.value)}
                  className={cn(errors.lastName && 'border-red-500')}
                />
                {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.customer.email}
                onChange={(e) => updateFormData('customer', 'email', e.target.value)}
                className={cn(errors.email && 'border-red-500')}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.customer.phone}
                onChange={(e) => updateFormData('customer', 'phone', e.target.value)}
                className={cn(errors.phone && 'border-red-500')}
              />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.shipping.address}
                onChange={(e) => updateFormData('shipping', 'address', e.target.value)}
                className={cn(errors.address && 'border-red-500')}
                rows={3}
              />
              {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.shipping.city}
                  onChange={(e) => updateFormData('shipping', 'city', e.target.value)}
                  className={cn(errors.city && 'border-red-500')}
                />
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.shipping.state}
                  onChange={(e) => updateFormData('shipping', 'state', e.target.value)}
                  className={cn(errors.state && 'border-red-500')}
                />
                {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.shipping.pincode}
                  onChange={(e) => updateFormData('shipping', 'pincode', e.target.value)}
                  className={cn(errors.pincode && 'border-red-500')}
                />
                {errors.pincode && <p className="text-sm text-red-500 mt-1">{errors.pincode}</p>}
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.shipping.country}
                  onChange={(e) => updateFormData('shipping', 'country', e.target.value)}
                  disabled
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="deliveryMethod">Delivery Method</Label>
              <Select
                value={formData.delivery.method}
                onValueChange={(value) => updateFormData('delivery', 'method', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (3-5 days) - ₹99</SelectItem>
                  <SelectItem value="express">Express (1-2 days) - ₹199</SelectItem>
                  <SelectItem value="overnight">Overnight - ₹399</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                value={formData.delivery.instructions || ''}
                onChange={(e) => updateFormData('delivery', 'instructions', e.target.value)}
                rows={2}
                placeholder="Any special delivery instructions..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {[
                  { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                  { value: 'upi', label: 'UPI', icon: Phone },
                  { value: 'netbanking', label: 'Net Banking', icon: Shield },
                  { value: 'wallet', label: 'Wallet', icon: Lock },
                  { value: 'cod', label: 'Cash on Delivery', icon: Truck }
                ].map((method) => (
                  <Button
                    key={method.value}
                    variant={formData.payment.method === method.value ? 'default' : 'outline'}
                    className="h-16 flex flex-col items-center space-y-2"
                    onClick={() => updateFormData('payment', 'method', method.value)}
                  >
                    <method.icon className="w-5 h-5" />
                    <span className="text-xs">{method.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {formData.payment.method === 'card' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    value={formData.payment.cardNumber || ''}
                    onChange={(e) => updateFormData('payment', 'cardNumber', e.target.value)}
                    className={cn(errors.cardNumber && 'border-red-500')}
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      value={formData.payment.expiryDate || ''}
                      onChange={(e) => updateFormData('payment', 'expiryDate', e.target.value)}
                      className={cn(errors.expiryDate && 'border-red-500')}
                      placeholder="MM/YY"
                    />
                    {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      value={formData.payment.cvv || ''}
                      onChange={(e) => updateFormData('payment', 'cvv', e.target.value)}
                      className={cn(errors.cvv && 'border-red-500')}
                      placeholder="123"
                    />
                    {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}
            
            {formData.payment.method === 'upi' && (
              <div>
                <Label htmlFor="upiId">UPI ID *</Label>
                <Input
                  id="upiId"
                  value={formData.payment.upiId || ''}
                  onChange={(e) => updateFormData('payment', 'upiId', e.target.value)}
                  className={cn(errors.upiId && 'border-red-500')}
                  placeholder="yourname@paytm"
                />
                {errors.upiId && <p className="text-sm text-red-500 mt-1">{errors.upiId}</p>}
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="billingSame"
                checked={formData.billing.sameAsShipping}
                onCheckedChange={(checked) => updateFormData('billing', 'sameAsShipping', checked)}
              />
              <Label htmlFor="billingSame">Billing address same as shipping address</Label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Order Summary</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {formData.customer.firstName} {formData.customer.lastName}</p>
                  <p><strong>Email:</strong> {formData.customer.email}</p>
                  <p><strong>Phone:</strong> {formData.customer.phone}</p>
                </div>
                
                <h3 className="font-semibold">Shipping Address</h3>
                <div className="space-y-2 text-sm">
                  <p>{formData.shipping.address}</p>
                  <p>{formData.shipping.city}, {formData.shipping.state} {formData.shipping.pincode}</p>
                  <p>{formData.shipping.country}</p>
                </div>
                
                <h3 className="font-semibold">Payment Method</h3>
                <div className="space-y-2 text-sm">
                  <p>{formData.payment.method.toUpperCase()}</p>
                  {formData.payment.method === 'card' && formData.payment.cardNumber && (
                    <p>**** **** **** {formData.payment.cardNumber.slice(-4)}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={setAgreedToTerms}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">Terms and Conditions</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </Label>
            </div>
            {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('max-w-4xl mx-auto p-6', className)}>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                  isActive && 'border-primary bg-primary text-primary-foreground',
                  isCompleted && 'border-primary bg-primary text-primary-foreground',
                  !isActive && !isCompleted && 'border-muted-foreground text-muted-foreground'
                )}>
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className={cn(
                  'ml-2 text-sm font-medium',
                  isActive && 'text-primary',
                  isCompleted && 'text-primary',
                  !isActive && !isCompleted && 'text-muted-foreground'
                )}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-16 h-0.5 mx-4',
                    isCompleted ? 'bg-primary' : 'bg-muted-foreground'
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <steps[currentStep - 1].icon className="w-5 h-5" />
            <span>{steps[currentStep - 1].title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onBack : handleBack}
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep === 1 ? 'Back to Cart' : 'Previous'}
        </Button>
        
        {currentStep < 4 ? (
          <Button onClick={handleNext} disabled={isLoading}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isLoading || !agreedToTerms}>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              'Place Order'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
