'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  MessageCircle, 
  Image as ImageIcon,
  Send,
  Filter,
  SortAsc,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Camera,
  X
} from 'lucide-react';
import Image from 'next/image';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  updatedAt?: Date;
  productVariant?: string;
  purchaseDate?: Date;
  response?: {
    content: string;
    author: string;
    createdAt: Date;
  };
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  onAddReview?: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onReportReview?: (reviewId: string) => void;
  onHelpfulVote?: (reviewId: string, helpful: boolean) => void;
  onReplyToReview?: (reviewId: string, reply: string) => void;
  className?: string;
}

export function ProductReviews({
  productId,
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
  onAddReview,
  onReportReview,
  onHelpfulVote,
  onReplyToReview,
  className = ''
}: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful' | 'rating'>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = reviews
    .filter(review => {
      const matchesRating = filterRating === 'all' || review.rating === filterRating;
      const matchesSearch = review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           review.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRating && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'helpful':
          return b.helpful - a.helpful;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const getRatingPercentage = (rating: number) => {
    return totalReviews > 0 ? (ratingDistribution[rating] || 0) / totalReviews * 100 : 0;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <p className="text-muted-foreground">
            {totalReviews} review{totalReviews !== 1 ? 's' : ''} • {averageRating.toFixed(1)} out of 5
          </p>
        </div>
        
        <Button onClick={() => setShowReviewForm(true)}>
          Write a Review
        </Button>
      </div>

      {/* Rating Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'w-5 h-5',
                      star <= Math.floor(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getRatingPercentage(rating)}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {ratingDistribution[rating] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Rating Filter */}
            <Select value={filterRating.toString()} onValueChange={(value) => setFilterRating(value === 'all' ? 'all' : parseInt(value))}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No reviews found</h3>
              <p className="text-muted-foreground">
                {reviews.length === 0 
                  ? 'Be the first to review this product!' 
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onReport={() => onReportReview?.(review.id)}
              onHelpfulVote={(helpful) => onHelpfulVote?.(review.id, helpful)}
              onReply={(reply) => onReplyToReview?.(review.id, reply)}
            />
          ))
        )}
      </div>

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <ReviewFormModal
            productId={productId}
            onClose={() => setShowReviewForm(false)}
            onSubmit={(review) => {
              onAddReview?.(review);
              setShowReviewForm(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Review Card Component
interface ReviewCardProps {
  review: Review;
  onReport: () => void;
  onHelpfulVote: (helpful: boolean) => void;
  onReply: (reply: string) => void;
}

function ReviewCard({ review, onReport, onHelpfulVote, onReply }: ReviewCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Review Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {review.userAvatar ? (
                    <Image
                      src={review.userAvatar}
                      alt={review.userName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{review.userName}</h4>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'w-4 h-4',
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {review.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onReport}
                className="text-muted-foreground hover:text-red-500"
              >
                <Flag className="w-4 h-4" />
              </Button>
            </div>

            {/* Review Content */}
            <div className="space-y-3">
              <h5 className="font-medium">{review.title}</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.content}
              </p>
              
              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex space-x-2">
                  {review.images.map((image, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden">
                      <Image
                        src={image}
                        alt={`Review image ${index + 1}`}
                        fill
                        className="object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onHelpfulVote(true)}
                    className="text-muted-foreground hover:text-green-600"
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Helpful ({review.helpful})
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onHelpfulVote(false)}
                    className="text-muted-foreground hover:text-red-600"
                  >
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    Not Helpful ({review.notHelpful})
                  </Button>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-muted-foreground"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Reply
              </Button>
            </div>

            {/* Reply Form */}
            <AnimatePresence>
              {showReplyForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t pt-4"
                >
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowReplyForm(false);
                          setReplyText('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Seller Response */}
            {review.response && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-blue-900">{review.response.author}</span>
                      <Badge variant="secondary" className="text-xs">
                        Seller
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-800 mt-1">{review.response.content}</p>
                    <p className="text-xs text-blue-600 mt-2">
                      {review.response.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Review Form Modal Component
interface ReviewFormModalProps {
  productId: string;
  onClose: () => void;
  onSubmit: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

function ReviewFormModal({ productId, onClose, onSubmit }: ReviewFormModalProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0 || !title.trim() || !content.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit({
        userId: 'current-user', // This would come from auth context
        userName: 'Current User', // This would come from auth context
        rating,
        title: title.trim(),
        content: content.trim(),
        images: images.length > 0 ? images : undefined,
        verified: true, // This would be determined by purchase history
        helpful: 0,
        notHelpful: 0
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you would upload these to a server
      // For now, we'll just create object URLs
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

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
        className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Write a Review</CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating *</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={cn(
                          'w-8 h-8 transition-colors',
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-400'
                        )}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Review Title *</label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  required
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">Your Review *</label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell others about your experience with this product"
                  rows={5}
                  required
                />
              </div>

              {/* Images */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Photos (Optional)</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="review-images"
                  />
                  <label
                    htmlFor="review-images"
                    className="flex items-center justify-center w-full h-20 border-2 border-dashed border-muted-foreground rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="text-center">
                      <Camera className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm text-muted-foreground">Add photos</p>
                    </div>
                  </label>
                  
                  {images.length > 0 && (
                    <div className="flex space-x-2">
                      {images.map((image, index) => (
                        <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden">
                          <Image
                            src={image}
                            alt={`Review image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={rating === 0 || !title.trim() || !content.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
