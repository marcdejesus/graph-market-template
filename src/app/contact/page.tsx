'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { ResponsiveBreadcrumb } from '@/components/navigation/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Button } from '@/components/ui'

export default function ContactPage() {
  return (
    <MainLayout padded>
      <ResponsiveBreadcrumb className="mb-6" />
      
      <div className="py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bebas font-bold text-athletic-black mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-steel-600 max-w-2xl mx-auto">
              Have a question or need help? We're here to assist you with your FitMarket experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email address" />
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What's this about?" />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-3 py-2 border border-steel-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-performance-500 focus:border-performance-500"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <Button className="w-full" variant="primary">
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Get in touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-performance-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-athletic-black">Email</h3>
                      <p className="text-steel-600">support@fitmarket.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-performance-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-athletic-black">Phone</h3>
                      <p className="text-steel-600">1-800-FIT-GEAR</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-performance-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-athletic-black">Address</h3>
                      <p className="text-steel-600">
                        123 Athletic Avenue<br />
                        Fitness City, FC 12345
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Store Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-steel-600">Monday - Friday</span>
                      <span className="text-athletic-black font-medium">9AM - 8PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-steel-600">Saturday</span>
                      <span className="text-athletic-black font-medium">9AM - 6PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-steel-600">Sunday</span>
                      <span className="text-athletic-black font-medium">11AM - 5PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-athletic-black">What's your return policy?</h4>
                      <p className="text-sm text-steel-600 mt-1">
                        We offer 30-day returns on unworn items with original tags.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-athletic-black">Do you offer international shipping?</h4>
                      <p className="text-sm text-steel-600 mt-1">
                        Currently we ship to the US and Canada with plans to expand globally.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-athletic-black">How can I track my order?</h4>
                      <p className="text-sm text-steel-600 mt-1">
                        You'll receive a tracking number via email once your order ships.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 