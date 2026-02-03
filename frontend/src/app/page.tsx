import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/30 rounded-full blur-[128px]" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-t from-violet-600/20 to-transparent blur-[100px]" />

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800/50 backdrop-blur-sm">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">g</span>
              </div>
              <span className="text-xl font-bold">gradWork</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/jobs" className="text-zinc-400 hover:text-white transition-colors">
                Browse Jobs
              </Link>
              <Link href="#features" className="text-zinc-400 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#companies" className="text-zinc-400 hover:text-white transition-colors">
                For Companies
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-zinc-400 hover:text-white transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="container mx-auto px-6 pt-24 pb-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm text-zinc-400">Now open for 2026 internships</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
            Where students{' '}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              launch careers
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
            The modern job platform connecting undergraduates with internships and entry-level opportunities at companies actively seeking fresh talent.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 transition-all"
            >
              Start your journey
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-8 py-4 border border-zinc-700 rounded-xl font-medium hover:bg-zinc-900 hover:border-zinc-600 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore jobs
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { value: '10K+', label: 'Students' },
              { value: '500+', label: 'Companies' },
              { value: '2.5K+', label: 'Jobs Posted' },
              { value: '89%', label: 'Placement Rate' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Cards */}
        <section id="features" className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for the{' '}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                next generation
              </span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Everything you need to find your first opportunity or your next great hire.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              title="Smart Matching"
              description="Our algorithm matches your skills and interests with relevant opportunities, saving you hours of searching."
              gradient="from-violet-500 to-purple-600"
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="One-Click Apply"
              description="Apply to multiple positions with a single profile. No more filling out the same forms repeatedly."
              gradient="from-cyan-500 to-blue-600"
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Track Progress"
              description="Monitor all your applications in one dashboard. Get notified instantly when companies respond."
              gradient="from-fuchsia-500 to-pink-600"
            />
          </div>
        </section>

        {/* For Companies Section */}
        <section id="companies" className="container mx-auto px-6 py-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-8 md:p-16">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
                  For Companies
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Find exceptional talent before they graduate
                </h2>
                <p className="text-zinc-400 mb-8">
                  Access a pool of motivated students from top universities. Post jobs, review applications, and build your future team—all for free.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    'Post unlimited job listings',
                    'Smart candidate filtering',
                    'Integrated applicant tracking',
                    'Direct messaging with candidates',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-zinc-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl font-medium hover:from-violet-500 hover:to-cyan-500 transition-all"
                >
                  Start hiring
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              <div className="hidden md:block">
                <div className="relative">
                  {/* Mock Dashboard Card */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-lg font-semibold">Recent Applications</div>
                      <div className="text-sm text-zinc-500">12 new</div>
                    </div>
                    {[
                      { name: 'Sarah Chen', role: 'Frontend Intern', status: 'New', avatar: 'SC' },
                      { name: 'James Wilson', role: 'Backend Intern', status: 'Reviewing', avatar: 'JW' },
                      { name: 'Emily Brown', role: 'Full Stack', status: 'Interview', avatar: 'EB' },
                    ].map((applicant, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-t border-zinc-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-medium">
                            {applicant.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-white">{applicant.name}</div>
                            <div className="text-sm text-zinc-500">{applicant.role}</div>
                          </div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          applicant.status === 'New' ? 'bg-green-500/10 text-green-400' :
                          applicant.status === 'Reviewing' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-violet-500/10 text-violet-400'
                        }`}>
                          {applicant.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-24">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to start your career?
            </h2>
            <p className="text-xl text-zinc-400 mb-8 max-w-xl mx-auto">
              Join thousands of students who&apos;ve found their dream opportunities through gradWork.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl text-lg font-medium hover:from-violet-500 hover:to-cyan-500 transition-all transform hover:scale-105"
            >
              Create free account
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">g</span>
                </div>
                <span className="text-lg font-bold">gradWork</span>
              </Link>
              <p className="text-sm text-zinc-500">
                Connecting students with their first career opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">For Students</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link href="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Create Profile</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">For Companies</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link href="/register" className="hover:text-white transition-colors">Post a Job</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Search Candidates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-500">© 2026 gradWork. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-zinc-500">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group relative p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="relative text-xl font-semibold mb-2">{title}</h3>
      <p className="relative text-zinc-400">{description}</p>
    </div>
  );
}
