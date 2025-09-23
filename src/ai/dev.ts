import { config } from 'dotenv';
config();

import '@/ai/flows/generate-product-description.ts';
import '@/ai/flows/admin-review-product-listing.ts';
import '@/ai/flows/auto-categorize-product.ts';