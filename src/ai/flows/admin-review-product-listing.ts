'use server';

/**
 * @fileOverview AI-powered tool to summarize product listings and flag policy violations.
 *
 * - adminReviewProductListing - A function that handles the product listing review process.
 * - AdminReviewProductListingInput - The input type for the adminReviewProductListing function.
 * - AdminReviewProductListingOutput - The return type for the adminReviewProductListing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminReviewProductListingInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
  productImageUrl: z
    .string()
    .describe(
      'A URL of the product image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  productPrice: z.number().describe('The price of the product.'),
  sellerName: z.string().describe('The name of the seller listing the product.'),
});
export type AdminReviewProductListingInput = z.infer<typeof AdminReviewProductListingInputSchema>;

const AdminReviewProductListingOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the product listing.'),
  flaggedViolations: z
    .array(z.string())
    .describe(
      'A list of potential policy violations found in the product listing, if any, otherwise empty.'
    ),
  isApproved: z.boolean().describe('A flag indicating whether the listing is suitable for approval.'),
});

export type AdminReviewProductListingOutput = z.infer<typeof AdminReviewProductListingOutputSchema>;

export async function adminReviewProductListing(
  input: AdminReviewProductListingInput
): Promise<AdminReviewProductListingOutput> {
  return adminReviewProductListingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminReviewProductListingPrompt',
  input: {schema: AdminReviewProductListingInputSchema},
  output: {schema: AdminReviewProductListingOutputSchema},
  prompt: `You are an AI assistant that reviews product listings to identify potential policy violations.

  Given the following product listing information, please provide a summary of the listing and flag any potential violations of the platform's policies.  Also, determine whether the product listing is suitable for approval based on the summary and identified violations.

  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}
  Product Image: {{media url=productImageUrl}}
  Product Price: {{{productPrice}}}
  Seller Name: {{{sellerName}}}

  Respond in the format:
  Summary: [A concise summary of the product listing]
  Flagged Violations: [A list of potential policy violations found in the product listing. If no violations are found respond with "None"]
  IsApproved: [True or False.  True if the product listing is suitable for approval, False otherwise.]`,
});

const adminReviewProductListingFlow = ai.defineFlow(
  {
    name: 'adminReviewProductListingFlow',
    inputSchema: AdminReviewProductListingInputSchema,
    outputSchema: AdminReviewProductListingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
