'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  Truck,
  Shield, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  Smartphone as PhoneIcon
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  fees?: number;
  processingTime: string;
  available: boolean;
}

interface PaymentGatewayProps {
  amount: number;
  currency?: string;
  onSuccess: (paymentData: PaymentResult) => void;
  onError: (error: string) => void;
  onCancel: () => void;
  className?: string;
  allowedMethods?: string[];
}

interface PaymentResult {
  transactionId: string;
  method: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  timestamp: Date;
  reference?: string;
}

interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
  type?: 'visa' | 'mastercard' | 'amex' | 'discover';
}

interface UPIDetails {
  upiId: string;
  app?: string;
}

interface NetBankingDetails {
  bankCode: string;
  bankName: string;
}

export function PaymentGateway({
  amount,
  currency = 'INR',
  onSuccess,
  onError,
  onCancel,
  className = '',
  allowedMethods = ['card', 'upi', 'netbanking', 'wallet', 'cod']
}: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiDetails, setUpiDetails] = useState<UPIDetails>({
    upiId: ''
  });
  const [netBankingDetails, setNetBankingDetails] = useState<NetBankingDetails>({
    bankCode: '',
    bankName: ''
  });
  const [saveCard, setSaveCard] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Visa, Mastercard, RuPay',
      fees: 0,
      processingTime: 'Instant',
      available: allowedMethods.includes('card')
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'PhonePe, Google Pay, Paytm',
      fees: 0,
      processingTime: 'Instant',
      available: allowedMethods.includes('upi')
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Building2 className="w-5 h-5" />,
      description: 'All major banks',
      fees: 0,
      processingTime: 'Instant',
      available: allowedMethods.includes('netbanking')
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: <Wallet className="w-5 h-5" />,
      description: 'Paytm, Mobikwik, Freecharge',
      fees: 0,
      processingTime: 'Instant',
      available: allowedMethods.includes('wallet')
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <Truck className="w-5 h-5" />,
      description: 'Pay when you receive',
      fees: 50,
      processingTime: 'On delivery',
      available: allowedMethods.includes('cod')
    }
  ];

  const availableMethods = paymentMethods.filter(method => method.available);

  const validateCardDetails = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!cardDetails.number) {
      newErrors.number = 'Card number is required';
    } else if (!/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ''))) {
      newErrors.number = 'Card number must be 16 digits';
    }

    if (!cardDetails.expiry) {
      newErrors.expiry = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      newErrors.expiry = 'Format: MM/YY';
    }

    if (!cardDetails.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    if (!cardDetails.name) {
      newErrors.name = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUPIDetails = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!upiDetails.upiId) {
      newErrors.upiId = 'UPI ID is required';
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(upiDetails.upiId)) {
      newErrors.upiId = 'Invalid UPI ID format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNetBankingDetails = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!netBankingDetails.bankCode) {
      newErrors.bankCode = 'Please select a bank';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const detectCardType = (number: string): CardDetails['type'] => {
    const cleanNumber = number.replace(/\s/g, '');
    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6/.test(cleanNumber)) return 'discover';
    return undefined;
  };

  const formatCardNumber = (value: string): string => {
    const cleanValue = value.replace(/\s/g, '');
    const formatted = cleanValue.replace(/(.{4})/g, '$1 ').trim();
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiry = (value: string): string => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 2) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
    }
    return cleanValue;
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    const type = detectCardType(value);
    setCardDetails(prev => ({
      ...prev,
      number: formatted,
      type
    }));
  };

  const handleExpiryChange = (value: string) => {
    const formatted = formatExpiry(value);
    setCardDetails(prev => ({
      ...prev,
      expiry: formatted
    }));
  };

  const processPayment = async () => {
    setIsProcessing(true);

    try {
      let isValid = false;

      switch (selectedMethod) {
        case 'card':
          isValid = validateCardDetails();
          break;
        case 'upi':
          isValid = validateUPIDetails();
          break;
        case 'netbanking':
          isValid = validateNetBankingDetails();
          break;
        case 'cod':
          isValid = true;
          break;
        default:
          isValid = true;
      }

      if (!isValid) {
        setIsProcessing(false);
        return;
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        const result: PaymentResult = {
          transactionId: `TXN${Date.now()}`,
          method: selectedMethod,
          amount,
          status: selectedMethod === 'cod' ? 'pending' : 'success',
          timestamp: new Date(),
          reference: `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        };

        onSuccess(result);
      } else {
        onError('Payment failed. Please try again.');
      }
    } catch (error) {
      onError('An error occurred during payment processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const banks = [
    { code: 'HDFC', name: 'HDFC Bank' },
    { code: 'ICICI', name: 'ICICI Bank' },
    { code: 'SBI', name: 'State Bank of India' },
    { code: 'AXIS', name: 'Axis Bank' },
    { code: 'KOTAK', name: 'Kotak Mahindra Bank' },
    { code: 'PNB', name: 'Punjab National Bank' },
    { code: 'BOI', name: 'Bank of India' },
    { code: 'BOB', name: 'Bank of Baroda' }
  ];

  return (
    <div className={cn('max-w-md mx-auto', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Secure Payment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Display */}
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold">₹{amount.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Amount to be paid</div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Payment Method</Label>
            {availableMethods.map((method) => (
              <motion.div
                key={method.id}
                className={cn(
                  'flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors',
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                )}
                onClick={() => setSelectedMethod(method.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={cn(
                  'p-2 rounded-full',
                  selectedMethod === method.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {method.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{method.name}</div>
                  <div className="text-sm text-muted-foreground">{method.description}</div>
                </div>
                <div className="text-right">
                  {method.fees && method.fees > 0 && (
                    <div className="text-sm text-muted-foreground">+₹{method.fees}</div>
                  )}
                  <div className="text-xs text-muted-foreground">{method.processingTime}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Payment Details Forms */}
          <AnimatePresence mode="wait">
            {selectedMethod === 'card' && (
              <motion.div
                key="card"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    value={cardDetails.number}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className={cn(errors.number && 'border-red-500')}
                  />
                  {errors.number && <p className="text-sm text-red-500 mt-1">{errors.number}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      value={cardDetails.expiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      placeholder="MM/YY"
                      className={cn(errors.expiry && 'border-red-500')}
                    />
                    {errors.expiry && <p className="text-sm text-red-500 mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                      placeholder="123"
                      className={cn(errors.cvv && 'border-red-500')}
                    />
                    {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    className={cn(errors.name && 'border-red-500')}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveCard"
                    checked={saveCard}
                    onCheckedChange={setSaveCard}
                  />
                  <Label htmlFor="saveCard" className="text-sm">
                    Save card for future payments
                  </Label>
                </div>
              </motion.div>
            )}

            {selectedMethod === 'upi' && (
              <motion.div
                key="upi"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    value={upiDetails.upiId}
                    onChange={(e) => setUpiDetails(prev => ({ ...prev, upiId: e.target.value }))}
                    placeholder="yourname@paytm"
                    className={cn(errors.upiId && 'border-red-500')}
                  />
                  {errors.upiId && <p className="text-sm text-red-500 mt-1">{errors.upiId}</p>}
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <PhoneIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">UPI Apps</span>
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Make sure you have a UPI app installed (PhonePe, Google Pay, Paytm, etc.)
                  </div>
                </div>
              </motion.div>
            )}

            {selectedMethod === 'netbanking' && (
              <motion.div
                key="netbanking"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="bank">Select Bank</Label>
                  <Select
                    value={netBankingDetails.bankCode}
                    onValueChange={(value) => {
                      const bank = banks.find(b => b.code === value);
                      setNetBankingDetails({
                        bankCode: value,
                        bankName: bank?.name || ''
                      });
                    }}
                  >
                    <SelectTrigger className={cn(errors.bankCode && 'border-red-500')}>
                      <SelectValue placeholder="Choose your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank.code} value={bank.code}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bankCode && <p className="text-sm text-red-500 mt-1">{errors.bankCode}</p>}
                </div>
              </motion.div>
            )}

            {selectedMethod === 'cod' && (
              <motion.div
                key="cod"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-orange-800">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm font-medium">Cash on Delivery</span>
                  </div>
                  <div className="text-xs text-orange-600 mt-2">
                    <ul className="space-y-1">
                      <li>• Pay ₹{amount + 50} when you receive your order</li>
                      <li>• ₹50 COD charges will be added</li>
                      <li>• Keep exact change ready</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Notice */}
          <div className="flex items-start space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Shield className="w-4 h-4 text-green-600 mt-0.5" />
            <div className="text-xs text-green-800">
              <div className="font-medium">Secure Payment</div>
              <div>Your payment information is encrypted and secure</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={processPayment}
              disabled={!selectedMethod || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                `Pay ₹${(amount + (selectedMethod === 'cod' ? 50 : 0)).toLocaleString()}`
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Payment Status Component
interface PaymentStatusProps {
  status: 'success' | 'pending' | 'failed';
  transactionId?: string;
  amount?: number;
  method?: string;
  onClose: () => void;
  className?: string;
}

export function PaymentStatus({
  status,
  transactionId,
  amount,
  method,
  onClose,
  className = ''
}: PaymentStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-600" />,
          title: 'Payment Successful!',
          description: 'Your payment has been processed successfully.',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800'
        };
      case 'pending':
        return {
          icon: <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />,
          title: 'Payment Pending',
          description: 'Your payment is being processed. You will receive a confirmation soon.',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800'
        };
      case 'failed':
        return {
          icon: <AlertCircle className="w-12 h-12 text-red-600" />,
          title: 'Payment Failed',
          description: 'Your payment could not be processed. Please try again.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={cn('max-w-md mx-auto', className)}>
      <Card>
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            {config.icon}
          </motion.div>
          
          <motion.h2
            className="mt-4 text-xl font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {config.title}
          </motion.h2>
          
          <motion.p
            className="mt-2 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {config.description}
          </motion.p>

          {transactionId && (
            <motion.div
              className={cn('mt-4 p-3 rounded-lg border', config.bgColor, config.borderColor)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className={config.textColor}>Transaction ID:</span>
                  <span className="font-mono text-xs">{transactionId}</span>
                </div>
                {amount && (
                  <div className="flex justify-between">
                    <span className={config.textColor}>Amount:</span>
                    <span className="font-semibold">₹{amount.toLocaleString()}</span>
                  </div>
                )}
                {method && (
                  <div className="flex justify-between">
                    <span className={config.textColor}>Method:</span>
                    <span className="capitalize">{method}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button onClick={onClose} className="w-full">
              {status === 'success' ? 'Continue Shopping' : 'Try Again'}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
