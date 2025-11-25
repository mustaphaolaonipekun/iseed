import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, BookOpen, Users, Award, ArrowRight, Sparkles } from "lucide-react";

const Landing = () => {
  const subthemes = [
    {
      icon: Sparkles,
      title: "Green Technology, Renewable Energy & Sustainable Materials",
      description: "Exploring innovations in clean energy, sustainable materials, and environmental technologies"
    },
    {
      icon: BookOpen,
      title: "STEM Education, Research Communication & Digital Learning",
      description: "Advancing educational methodologies and digital transformation in STEM fields"
    },
    {
      icon: Users,
      title: "Entrepreneurship, Industrial Collaboration & Career Pathways",
      description: "Building bridges between research, industry, and future career opportunities"
    }
  ];

  const dates = [
    { label: "Abstract Submission Opens", date: "December 15, 2025" },
    { label: "Abstract Deadline", date: "January 27, 2025" },
    { label: "Acceptance Notification", date: "June 2025" },
    { label: "Conference Date", date: "February 23, 2025" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/20 via-primary/10 to-emerald-green/20" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-soft-white">
                ISEED <span className="gradient-text">2025</span>
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-soft-white/90 mb-2">
                International Conference on Innovations in
              </p>
              <p className="text-2xl md:text-3xl font-bold gradient-text">
                Science, Engineering, and Education
              </p>
              <p className="text-xl md:text-2xl font-semibold text-soft-white/90 mt-2">
                for Sustainable Development
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-soft-white/80 mb-8 max-w-3xl mx-auto"
            >
              Join leading researchers, educators, and innovators in shaping the future of sustainable development through groundbreaking research and collaboration.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <Button size="lg" className="gradient-button text-soft-white font-semibold px-8 py-6 text-lg group">
                  Register Now
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="glass border-2 border-soft-white/30 text-soft-white hover:bg-soft-white/10 px-8 py-6 text-lg">
                  Login
                </Button>
              </Link>
            </motion.div>

            <div className="mt-12 flex items-center justify-center gap-2 text-soft-white/70">
              <Calendar className="w-5 h-5" />
              <p className="font-semibold">February 23, 2025</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Sub-themes Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-soft-white mb-4">
              Conference <span className="gradient-text">Sub-Themes</span>
            </h2>
            <p className="text-lg text-soft-white/70 max-w-2xl mx-auto">
              Explore three key areas driving sustainable innovation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {subthemes.map((theme, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="glass border-soft-white/20 h-full hover:scale-105 transition-transform duration-300">
                  <CardContent className="p-6">
                    <theme.icon className="w-12 h-12 text-bright-aqua mb-4" />
                    <h3 className="text-xl font-semibold text-soft-white mb-3">{theme.title}</h3>
                    <p className="text-soft-white/70">{theme.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-soft-white mb-4">
              Important <span className="gradient-text">Dates</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8"
          >
            <div className="space-y-4">
              {dates.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-4 rounded-lg glass-dark"
                >
                  <span className="text-soft-white font-medium">{item.label}</span>
                  <span className="text-bright-aqua font-semibold">{item.date}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Payment Instructions */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8"
          >
            <div className="text-center mb-6">
              <Award className="w-12 h-12 text-emerald-green mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-soft-white mb-4">
                Registration <span className="gradient-text">Fees</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="glass-dark rounded-xl p-6 text-center">
                <p className="text-soft-white/70 mb-2">Student Rate</p>
                <p className="text-3xl font-bold text-emerald-green">₦7,500</p>
              </div>
              <div className="glass-dark rounded-xl p-6 text-center">
                <p className="text-soft-white/70 mb-2">Adult Rate</p>
                <p className="text-3xl font-bold text-emerald-green">₦10,000</p>
              </div>
            </div>

            <div className="space-y-3 text-soft-white">
              <h3 className="font-semibold text-lg mb-3">Bank Transfer Details:</h3>
              <div className="grid gap-2 text-sm md:text-base">
                <div className="flex justify-between p-3 glass-dark rounded-lg">
                  <span className="text-soft-white/70">Account Name:</span>
                  <span className="font-semibold">LEAD AND MENTOR</span>
                </div>
                <div className="flex justify-between p-3 glass-dark rounded-lg">
                  <span className="text-soft-white/70">Account Number:</span>
                  <span className="font-semibold">0080840445</span>
                </div>
                <div className="flex justify-between p-3 glass-dark rounded-lg">
                  <span className="text-soft-white/70">Bank:</span>
                  <span className="font-semibold">Sterling Bank</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 glass-dark rounded-lg">
              <p className="text-sm text-soft-white/70 text-center">
                After payment, upload your receipt through your participant dashboard to proceed with abstract submission.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Publication Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 text-center"
          >
            <BookOpen className="w-12 h-12 text-bright-aqua mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-soft-white mb-4">
              Publication
            </h2>
            <p className="text-soft-white/80 text-lg">
              Accepted abstracts will be published in our Abstract Book in collaboration with{" "}
              <span className="font-semibold text-emerald-green">AcademicEvents</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-soft-white mb-6">
              Ready to Join ISEED 2025?
            </h2>
            <p className="text-lg text-soft-white/80 mb-8 max-w-2xl mx-auto">
              Be part of the conversation shaping the future of sustainable development
            </p>
            <Link to="/register">
              <Button size="lg" className="gradient-button text-soft-white font-semibold px-12 py-6 text-lg">
                Register Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;