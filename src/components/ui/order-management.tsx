'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  CreditCard,
  Phone,
  Mail,
  Calendar,
  Eye,
  Download,
  RefreshCw,
  AlertCircle,
  Star,
  MessageSquare
} from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  seller: {
    id: string;
    name: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  total: number;
  shipping: number;
  discount: number;
  finalTotal: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  payment: {
    method: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
  };
  timeline: OrderTimelineItem[];
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  notes?: string;
}

interface OrderTimelineItem {
  id: string;
  status: Order['status'];
  title: string;
  description: string;
  timestamp: Date;
  location?: string;
}

interface OrderManagementProps {
  orders: Order[];
  userRole?: 'buyer' | 'seller' | 'admin';
  onStatusUpdate?: (orderId: string, newStatus: Order['status']) => void;
  onViewDetails?: (order: Order) => void;
  onDownloadInvoice?: (order: Order) => void;
  onTrackOrder?: (order: Order) => void;
  onContactSupport?: (order: Order) => void;
  className?: string;
}

export function OrderManagement({
  orders,
  userRole = 'buyer',
  onStatusUpdate,
  onViewDetails,
  onDownloadInvoice,
  onTrackOrder,
  onContactSupport,
  className = ''
}: OrderManagementProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'amount'>('date');
  const [isLoading, setIsLoading] = useState(false);

  const filteredOrders = orders
    .filter(order => filterStatus === 'all' || order.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'amount':
          return b.finalTotal - a.finalTotal;
        default:
          return 0;
      }
    });

  const getStatusConfig = (status: Order['status']) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      processing: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300', icon: Package },
      shipped: { color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300', icon: Truck },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      returned: { color: 'bg-gray-100 text-gray-800', icon: RefreshCw }
    };
    return configs[status];
  };

  const getPaymentStatusConfig = (status: Order['payment']['status']) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      paid: { color: 'bg-green-100 text-green-800', text: 'Paid' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Failed' },
      refunded: { color: 'bg-gray-100 text-gray-800', text: 'Refunded' }
    };
    return configs[status];
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setIsLoading(true);
    try {
      await onStatusUpdate?.(orderId, newStatus);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-muted-foreground">
            {userRole === 'buyer' ? 'Track your orders' : 'Manage customer orders'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Order['status'] | 'all')}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'status' | 'amount')}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="status">Sort by Status</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {filterStatus === 'all' 
                  ? 'You haven\'t placed any orders yet.' 
                  : `No orders with status "${filterStatus}" found.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const paymentConfig = getPaymentStatusConfig(order.payment.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                            <p className="text-sm text-muted-foreground">
                              Placed on {order.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={statusConfig.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <Badge variant="outline" className={paymentConfig.color}>
                              {paymentConfig.text}
                            </Badge>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          {order.items.slice(0, 2).map((item) => (
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
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity} • ₹{item.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-sm text-muted-foreground">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>

                        {/* Order Summary */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Total Items:</span>
                            <span className="ml-2 font-medium">
                              {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Final Total:</span>
                            <span className="ml-2 font-semibold text-lg">
                              ₹{order.finalTotal.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2 lg:min-w-[200px]">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="w-full"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        
                        {order.status === 'shipped' && order.trackingNumber && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onTrackOrder?.(order)}
                            className="w-full"
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            Track Order
                          </Button>
                        )}
                        
                        {order.status === 'delivered' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDownloadInvoice?.(order)}
                            className="w-full"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Invoice
                          </Button>
                        )}
                        
                        {(userRole === 'seller' || userRole === 'admin') && (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                            disabled={isLoading}
                            className="px-3 py-2 border rounded-md text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onContactSupport?.(order)}
                          className="w-full"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusUpdate={onStatusUpdate}
            userRole={userRole}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Order Details Modal Component
interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate?: (orderId: string, newStatus: Order['status']) => void;
  userRole?: 'buyer' | 'seller' | 'admin';
}

function OrderDetailsModal({ order, onClose, onStatusUpdate, userRole }: OrderDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'items'>('details');

  const getStatusConfig = (status: Order['status']) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      processing: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300', icon: Package },
      shipped: { color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300', icon: Truck },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      returned: { color: 'bg-gray-100 text-gray-800', icon: RefreshCw }
    };
    return configs[status];
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <StatusIcon className="w-5 h-5" />
                  <span>Order #{order.orderNumber}</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Placed on {order.createdAt.toLocaleDateString()}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                ×
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Tabs */}
            <div className="border-b">
              <div className="flex space-x-8 px-6">
                {[
                  { id: 'details', label: 'Details' },
                  { id: 'items', label: 'Items' },
                  { id: 'timeline', label: 'Timeline' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'py-4 text-sm font-medium border-b-2 transition-colors',
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'details' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">Name:</span>
                        <span>{order.customer.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{order.customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{order.customer.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Shipping Address</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div>{order.shippingAddress.address}</div>
                          <div>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                          </div>
                          <div>{order.shippingAddress.country}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Payment Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span>{order.payment.method}</span>
                      </div>
                      {order.payment.transactionId && (
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">Transaction ID:</span>
                          <span className="font-mono text-xs">{order.payment.transactionId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{(order.finalTotal - order.shipping + order.discount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>₹{order.shipping.toLocaleString()}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-₹{order.discount.toLocaleString()}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>₹{order.finalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'items' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Sold by {item.seller.name}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span>Qty: {item.quantity}</span>
                            <span>Price: ₹{item.price.toLocaleString()}</span>
                            <span className="font-semibold">
                              Total: ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Order Timeline</h3>
                  <div className="space-y-4">
                    {order.timeline.map((item, index) => {
                      const itemStatusConfig = getStatusConfig(item.status);
                      const ItemStatusIcon = itemStatusConfig.icon;
                      
                      return (
                        <div key={item.id} className="flex items-start space-x-4">
                          <div className={cn(
                            'p-2 rounded-full',
                            itemStatusConfig.color
                          )}>
                            <ItemStatusIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{item.title}</h4>
                              <span className="text-sm text-muted-foreground">
                                {item.timestamp.toLocaleDateString()} {item.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            {item.location && (
                              <p className="text-xs text-muted-foreground mt-1">
                                <MapPin className="w-3 h-3 inline mr-1" />
                                {item.location}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
