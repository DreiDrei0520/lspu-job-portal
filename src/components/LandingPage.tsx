import { Briefcase, Users, FileCheck, TrendingUp, Search, BookOpen, Building2, Calculator, HeartHandshake, GraduationCap, MonitorSmartphone, Handshake, Shield, Bell, UserCheck, MapPin, Phone, Mail, Clock, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { JobDetailsModal } from './JobDetailsModal'
import lspuLogo from 'figma:asset/632e126b3f1d7e670d648c8751062fdf02606f8b.png'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [recentJobs, setRecentJobs] = useState<any[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  useEffect(() => {
    loadRecentJobs()
  }, [])

  const loadRecentJobs = async () => {
    try {
      const { jobs } = await api.getJobs()
      // Get the 6 most recent jobs
      const sorted = (jobs || []).sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 6)
      setRecentJobs(sorted)
    } catch (error) {
      console.error('Failed to load recent jobs:', error)
    }
  }

  const popularSearches = [
    'Professor',
    'Lecturer',
    'Administrator',
    'IT Specialist',
    'Finance Officer',
    'Guidance Counselor',
    'Librarian'
  ]

  const teachingCategories = [
    { title: 'Primary Education', icon: BookOpen, count: 12 },
    { title: 'Secondary Education', icon: GraduationCap, count: 8 },
    { title: 'Higher Education', icon: Building2, count: 15 }
  ]

  const nonTeachingCategories = [
    { title: 'Administration', icon: Briefcase, count: 6 },
    { title: 'IT', icon: MonitorSmartphone, count: 4 },
    { title: 'Finance', icon: Calculator, count: 3 },
    { title: 'Human Resources', icon: Users, count: 5 }
  ]

  const howItWorksSteps = [
    {
      step: '1',
      title: 'Create Your Profile',
      description: 'Showcase your qualifications and experience',
      icon: UserCheck
    },
    {
      step: '2',
      title: 'Search & Apply',
      description: 'Browse and apply for suitable positions',
      icon: Search
    },
    {
      step: '3',
      title: 'Get Hired',
      description: 'Connect with employers and start your career',
      icon: Handshake
    }
  ]

  const platformFeatures = [
    {
      icon: TrendingUp,
      title: 'Targeted Matching',
      description: 'Intelligent algorithm connects candidates with fitting roles'
    },
    {
      icon: Shield,
      title: 'Verified Employers',
      description: 'Ensures legitimacy of hiring institutions'
    },
    {
      icon: HeartHandshake,
      title: 'Direct Communication',
      description: 'Secure platform for candidate-employer interaction'
    },
    {
      icon: Bell,
      title: 'Job Alerts',
      description: 'Notifications for new opportunities'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src={lspuLogo} alt="LSPU Logo" className="w-12 h-12 object-contain" />
              <div>
                <div className="text-[#116d8a]">LSPU-LBC</div>
                <div className="text-xs text-gray-600">Online Job Portal</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-700 hover:text-[#116d8a] transition-colors">
                Home
              </a>
              <a href="#jobs" className="text-gray-700 hover:text-[#116d8a] transition-colors">
                Jobs
              </a>
              <a href="#about" className="text-gray-700 hover:text-[#116d8a] transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-[#116d8a] transition-colors">
                Contact
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={onGetStarted}
                className="px-4 py-2 border border-[#116d8a] text-[#116d8a] rounded-lg hover:bg-[#e0f2f7] transition-colors"
              >
                Login
              </button>
              <button
                onClick={onGetStarted}
                className="px-4 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5468] transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-[#e0f2f7] to-[#e0f2f7] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl text-[#094050] mb-6">
                Find Your Dream Job in LSPU
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Join thousands of educators and professionals in discovering rewarding career 
                opportunities at Laguna State Polytechnic University
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5468] transition-colors text-lg flex items-center gap-2"
                >
                  Browse All Jobs
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={onGetStarted}
                  className="px-8 py-4 border-2 border-[#116d8a] text-[#116d8a] rounded-lg hover:bg-[#e0f2f7] transition-colors text-lg"
                >
                  Register Now
                </button>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVhbSUyMHByb2Zlc3Npb25hbHN8ZW58MXx8fHwxNzYwNTQyODY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Diverse professionals"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Job Searches */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl text-gray-900 mb-3">Popular Job Searches</h2>
            <p className="text-gray-600">Quick access to the most searched positions</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {popularSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-gray-100 hover:bg-[#116d8a] hover:text-white text-gray-700 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-900 mb-3">Browse by Category</h2>
            <p className="text-gray-600">Explore opportunities across different departments</p>
          </div>

          {/* Teaching Categories */}
          <div className="mb-12">
            <h3 className="text-2xl text-gray-900 mb-6">Teaching Positions</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {teachingCategories.map((category, index) => {
                const Icon = category.icon
                return (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-200 cursor-pointer group"
                    onClick={() => document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <div className="w-12 h-12 bg-[#b8dce5] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#7fc4d6] transition-colors">
                      <Icon className="w-6 h-6 text-[#0d5468]" />
                    </div>
                    <h4 className="text-lg text-gray-900 mb-2">{category.title}</h4>
                    <p className="text-gray-600">{category.count} open positions</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Non-Teaching Categories */}
          <div>
            <h3 className="text-2xl text-gray-900 mb-6">Non-Teaching Positions</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {nonTeachingCategories.map((category, index) => {
                const Icon = category.icon
                return (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-200 cursor-pointer group"
                    onClick={() => document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                      <Icon className="w-6 h-6 text-purple-700" />
                    </div>
                    <h4 className="text-lg text-gray-900 mb-2">{category.title}</h4>
                    <p className="text-gray-600">{category.count} positions</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Recently Posted Jobs */}
      <section id="jobs" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-900 mb-3">Recently Posted Jobs</h2>
            <p className="text-gray-600">Latest opportunities at LSPU-LBC</p>
          </div>

          {recentJobs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl text-gray-900 mb-2">No Jobs Posted Yet</h3>
              <p className="text-gray-600 mb-6">Check back soon for new opportunities!</p>
              <button
                onClick={onGetStarted}
                className="px-6 py-3 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5468] transition-colors"
              >
                Create Account to Get Notified
              </button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {recentJobs.map((job) => (
                  <div key={job.id}>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg text-gray-900 mb-2">{job.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">LSPU - Los Baños Campus</p>
                          <p className="text-sm text-gray-500">{job.location || 'Los Baños, Laguna'}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs ${
                          job.category === 'teaching' 
                            ? 'bg-[#b8dce5] text-[#0d5468]' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {job.type || 'Full-Time'}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-500">
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedJobId(job.id)}
                            className="px-3 py-2 border border-[#116d8a] text-[#116d8a] rounded-lg hover:bg-[#e0f2f7] transition-colors text-sm"
                          >
                            Details
                          </button>
                          <button
                            onClick={onGetStarted}
                            className="px-3 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5468] transition-colors text-sm"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Job Details Modal */}
              {selectedJobId && (
                <JobDetailsModal
                  job={recentJobs.find(job => job.id === selectedJobId)}
                  onClose={() => setSelectedJobId(null)}
                  onApply={onGetStarted}
                />
              )}

              <div className="text-center">
                <button
                  onClick={onGetStarted}
                  className="px-8 py-3 border-2 border-[#116d8a] text-[#116d8a] rounded-lg hover:bg-[#e0f2f7] transition-colors inline-flex items-center gap-2"
                >
                  View All Jobs
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-[#e0f2f7] to-[#e0f2f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-600">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-[#116d8a] rounded-full flex items-center justify-center">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#2E7D32] rounded-full flex items-center justify-center text-white">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Our Platform */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl text-gray-900 mb-6">Why Choose Our Platform?</h2>
              <div className="space-y-6">
                {platformFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-[#e0f2f7] rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[#116d8a]" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBoaXJpbmclMjBkaWdpdGFsfGVufDF8fHx8MTc2MDU0Mjg2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Digital hiring process"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#116d8a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-white mb-4">Ready to Find Your Dream Job?</h2>
          <p className="text-xl text-[#e0f2f7] mb-8">
            Join our community of educators and professionals today
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-[#116d8a] rounded-lg hover:bg-[#e0f2f7] transition-colors text-lg"
            >
              Register Now
            </button>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-[#0d5468] transition-colors text-lg"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand and Mission */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={lspuLogo} alt="LSPU Logo" className="w-12 h-12 object-contain" />
                <div>
                  <div className="text-white">LSPU-LBC</div>
                  <div className="text-xs text-gray-400">Job Portal</div>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Connecting educators and professionals with rewarding career opportunities at 
                Laguna State Polytechnic University - Los Baños Campus.
              </p>
            </div>

            {/* For Job Seekers */}
            <div>
              <h4 className="text-white mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#jobs" className="hover:text-[#1a8bad] transition-colors">
                    Browse Jobs
                  </a>
                </li>
                <li>
                  <button onClick={onGetStarted} className="hover:text-[#1a8bad] transition-colors text-left">
                    Create Account
                  </button>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#1a8bad] transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#1a8bad] transition-colors">
                    Help & Support
                  </a>
                </li>
              </ul>
            </div>

            {/* For Employers */}
            <div>
              <h4 className="text-white mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={onGetStarted} className="hover:text-[#1a8bad] transition-colors text-left">
                    Post a Job
                  </button>
                </li>
                <li>
                  <button onClick={onGetStarted} className="hover:text-[#1a8bad] transition-colors text-left">
                    Browse Candidates
                  </button>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#1a8bad] transition-colors">
                    Pricing Plans
                  </a>
                </li>
                <li>
                  <button onClick={onGetStarted} className="hover:text-[#1a8bad] transition-colors text-left">
                    Employer Dashboard
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-white mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Los Baños Campus, Brgy. Malinta, Los Baños, Laguna</span>
                </li>
                <li className="flex gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>0912-121-5453</span>
                </li>
                <li className="flex gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>info@lspu-lbc.edu.ph</span>
                </li>
                <li className="flex gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Mon–Fri, 8:00 AM–6:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © 2025 Laguna State Polytechnic University - Los Baños Campus. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="hover:text-[#1a8bad] transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-[#1a8bad] transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-[#1a8bad] transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
