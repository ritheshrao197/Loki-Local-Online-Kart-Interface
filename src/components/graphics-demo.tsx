"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedCard } from "@/components/ui/animated-card"
import { motion } from "framer-motion"
import { ShoppingCart, Package, Truck, CheckCircle } from "lucide-react"

const GraphicsDemo = () => {
  return (
    <div className="container mx-auto py-12">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Static Graphics Card - Enhanced 3D appearance */}
        <AnimatedCard tiltEffect floating className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              Product Showcase
            </CardTitle>
            <CardDescription>
              Static graphics with enhanced 3D depth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transform rotate-3">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
              </div>
              <h3 className="font-semibold">3D Product Visualization</h3>
              <p className="text-sm text-muted-foreground">
                Enhanced static graphics with depth perception and layered composition
              </p>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Animation Demo Card - Interactive Elements */}
        <AnimatedCard className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              Animated Workflow
            </CardTitle>
            <CardDescription>
              Purposeful animations for user interaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Package className="h-8 w-8 text-primary" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium">Order Placed</h4>
                    <p className="text-sm text-muted-foreground">Your order is confirmed</p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-4 p-3 rounded-lg">
                    <Truck className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium text-muted-foreground">Processing</h4>
                      <p className="text-sm text-muted-foreground">We're preparing your order</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center gap-4 p-3 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium text-muted-foreground">Shipped</h4>
                      <p className="text-sm text-muted-foreground">Your order is on the way</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Motion Graphics Card - Animated Information */}
        <div className="lg:col-span-2">
          <AnimatedCard tiltEffect className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                Motion Graphics Demo
              </CardTitle>
              <CardDescription>
                Animated graphic design for information delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-xl font-semibold">Enhanced Visual Experience</h3>
                    <p className="text-muted-foreground">
                      Combining static graphics with purposeful animations to create a more engaging shopping experience.
                    </p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>3D depth perception through layered design</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>Micro-interactions for user feedback</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>Animated transitions between states</span>
                      </li>
                    </ul>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button className="mt-4">
                      Experience the Difference
                    </Button>
                  </motion.div>
                </div>
                
                <div className="flex items-center justify-center">
                  <motion.div
                    className="relative"
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="absolute inset-4 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">3D</div>
                          <div className="text-sm text-muted-foreground">Experience</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>
      </div>
    </div>
  )
}

export { GraphicsDemo }
export default GraphicsDemo