'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from 'framer-motion';

export function FAQClient() {
  const buyerFaqs = [
    {
      question: "How do I place an order?",
      answer: "Simply browse our products, add items to your cart, and proceed to checkout. You can log in with your mobile number to complete the purchase.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, and various digital wallets. Cash on Delivery (COD) may be available depending on the seller.",
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you will receive tracking information via email and SMS. You can also view your order status in your profile.",
    },
  ];

  const sellerFaqs = [
    {
      question: "How do I become a seller on Loki?",
      answer: "Click on the 'Sell on Loki' link, fill out the registration form, and submit your documents. Our team will review your application and get back to you.",
    },
    {
      question: "What are the commission fees?",
      answer: "Our commission rates are competitive and vary by product category. You can view the detailed commission structure in your seller dashboard after registration.",
    },
    {
      question: "How do I get paid?",
      answer: "Payments for your delivered orders are processed on a weekly cycle and transferred directly to your registered bank account.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <motion.section 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl font-bold font-headline tracking-tight lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Frequently Asked Questions
        </motion.h1>
        <motion.p 
          className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Find answers to common questions about buying and selling on Loki.
        </motion.p>
      </motion.section>

      <motion.section 
        className="mt-16 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.h2 
          className="text-2xl font-bold font-headline mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          For Buyers
        </motion.h2>
        <Accordion type="single" collapsible className="w-full">
          {buyerFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
            >
              <AccordionItem value={`buyer-${index}`}>
                <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.section>

       <motion.section 
         className="mt-16 max-w-4xl mx-auto"
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, delay: 1.4 }}
       >
        <motion.h2 
          className="text-2xl font-bold font-headline mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          For Sellers
        </motion.h2>
        <Accordion type="single" collapsible className="w-full">
          {sellerFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
            >
              <AccordionItem value={`seller-${index}`}>
                <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.section>
    </div>
  );
}
