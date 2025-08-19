import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Play, Book, Award, FileText, Download, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const LMS = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Course categories data
  const categories = [
    { id: 'software', name: 'Software Development', icon: '💻', courses: 12 },
    { id: 'digital', name: 'Digital Marketing', icon: '📱', courses: 8 },
    { id: 'business', name: 'Business Intelligence', icon: '📊', courses: 15 },
    { id: 'freelance', name: 'Freelancing Journey', icon: '🎯', courses: 6 },
    { id: 'product', name: 'Product & Customer Data Analytics', icon: '📈', courses: 10 },
    { id: 'ux', name: 'UX Design Copywriting', icon: '🎨', courses: 7 },
    { id: 'quality', name: 'Software Quality Assurance', icon: '✅', courses: 9 }
  ];

  // Popular courses data
  const popularCourses = [
    {
      id: 1,
      title: 'Modern JavaScript: Bikin Projek Website Seperti Twitter',
      instructor: 'Angga Risky',
      role: 'Full-Stack Developer',
      students: '32,280',
      rating: 5,
      image: '/lovable-uploads/604c6ec4-059d-4d91-a97e-4acfd9bc8522.png',
      category: 'Software Development'
    },
    {
      id: 2,
      title: 'Full-Stack JavaScript Next JS Developer: Build Job Portal',
      instructor: 'Hariyanto',
      role: 'Full-Stack Developer', 
      students: '3,069',
      rating: 5,
      image: '/lovable-uploads/7e939f21-6531-4b54-9704-961c92782799.png',
      category: 'Software Development'
    },
    {
      id: 3,
      title: 'Modern JavaScript: Bikin Projek Website Seperti Twitter',
      instructor: 'Muhamad Fadli',
      role: 'UX Designer',
      students: '41,070',
      rating: 5,
      image: '/lovable-uploads/604c6ec4-059d-4d91-a97e-4acfd9bc8522.png',
      category: 'UX Design'
    }
  ];

  const learningMaterials = [
    { icon: Play, name: 'Videos', color: 'text-orange-500' },
    { icon: Book, name: 'Handbook', color: 'text-orange-500' },
    { icon: Download, name: 'Assets', color: 'text-orange-500' },
    { icon: Award, name: 'Certificates', color: 'text-orange-500' },
    { icon: FileText, name: 'Documentations', color: 'text-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">✦</span>
                </div>
                <span className="text-xl font-bold">alqowy</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-foreground hover:text-primary">Home</Link>
                <a href="#pricing" className="text-muted-foreground hover:text-primary">Pricing</a>
                <a href="#benefits" className="text-muted-foreground hover:text-primary">Benefits</a>
                <a href="#stories" className="text-muted-foreground hover:text-primary">Stories</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Sign Up</Button>
              <Button>Sign In</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* User count badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <div className="flex -space-x-2 mr-3">
                <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-sm font-medium">Join 3 million users</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Build Future <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">Career.</span>
            </h1>
            
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Alqowy provides high quality online courses for you to grow your skills and build outstanding portfolio to tackle job interviews
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                Explore Courses
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Career Guidance
              </Button>
            </div>
          </div>

          {/* Partner logos */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center justify-center">
                <span className="text-white/70 font-medium">Logoipsum</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              🔥 Top Categories
            </Badge>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-4">Browse Courses</h2>
          <p className="text-muted-foreground mb-12">
            Catching up the on demand skills and high paying career this year
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.courses} courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              🎯 Popular Courses
            </Badge>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-4">Don't Missed It, Learn Now</h2>
          <p className="text-muted-foreground mb-12">
            Catching up the on demand skills and high paying career this year
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    {Array.from({ length: course.rating }, (_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">{course.students} students</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">{course.instructor}</p>
                      <p className="text-xs text-muted-foreground">{course.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Materials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Learn From Anywhere, Anytime You Want
              </h2>
              <p className="text-muted-foreground mb-8">
                Growing new skills would be more flexible without limit we help you to access all course materials.
              </p>

              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-foreground">Materials</h3>
                {learningMaterials.map((material, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <material.icon className={`w-5 h-5 ${material.color}`} />
                    </div>
                    <span className="font-medium text-foreground">{material.name}</span>
                  </div>
                ))}
              </div>

              <Button className="bg-orange-500 hover:bg-orange-600">
                Check Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LMS;