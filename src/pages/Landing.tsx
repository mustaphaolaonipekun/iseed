import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  BookOpen,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText
} from "lucide-react";

const Landing = () => {
  const subThemes = [
    {
      title: "Green Technology & Sustainability",
      description: "Green Technology, Renewable Energy, Sustainable Materials",
      icon: "🌱",
    },
    {
      title: "STEM Education & Research",
      description: "STEM Education, Research Communication, Digital Learning",
      icon: "📚",
    },
    {
      title: "Entrepreneurship & Innovation",
      description:
        "Entrepreneurship, Industrial Collaboration, Future Career Pathways",
      icon: "💡",
    },
  ];
  const subthemes = [
    {
      icon: Sparkles,
      // icon: "🌱",

      title: "Green Technology, Renewable Energy & Sustainable Materials",
      description:
        "Exploring innovations in clean energy, sustainable materials, and environmental technologies",
    },
    {
      icon: BookOpen,
      //  icon: "📚",
      title: "STEM Education, Research Communication & Digital Learning",
      description:
        "Advancing educational methodologies and digital transformation in STEM fields",
    },
    {
      icon: Users,
      // icon: "💡",
      title: "Entrepreneurship, Industrial Collaboration & Career Pathways",
      description:
        "Building bridges between research, industry, and future career opportunities",
    },
  ];

  const timeline = [
    { date: "December 15, 2024", event: "Abstract Submission Opens" },
    { date: "January 27, 2025", event: "Submission Deadline" },
    { date: "June 2025", event: "Acceptance Notification" },
    { date: "February 23, 2025", event: "Conference Date" },
  ];

  const dates = [
    { label: "Abstract Submission Opens", date: "December 15, 2025" },
    { label: "Abstract Deadline", date: "January 27, 2025" },
    { label: "Acceptance Notification", date: "June 2025" },
    { label: "Conference Date", date: "February 23, 2025" },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-heading font-bold text-2xl text-primary">
            ISEED 2025
          </h1>
          {/* <div className="flex gap-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-foreground hover:bg-white/20">
                Login
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-primary text-white hover:opacity-90 transition-opacity">
                Register
              </Button>
            </Link>
          </div> */}
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-soft-white">
                ISEED <span className="">2025</span>
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-soft-white/90 mb-2">
                International Conference on Innovations in
              </p>
              <p className="text-2xl md:text-3xl font-bold text-soft-white/90">
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
              Join leading researchers, educators, and innovators in shaping the
              future of sustainable development through groundbreaking research
              and collaboration.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <Button
                  size="lg"
                  className="gradient-button text-soft-white font-semibold px-8 py-6 text-lg group"
                >
                  Register Now
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="glass border-2 border-soft-white/30 text-soft-white hover:bg-soft-white/10 px-8 py-6 text-lg"
                >
                  Login
                </Button>
              </Link>
            </motion.div>

            <div className="mt-12 flex items-center justify-center gap-2 text-soft-white/70">
              <Calendar className="w-5 h-5" />
              <p className="font-semibold">February 23, 2026</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-muted/30 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6 text-primary">
              About the Conference
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              ISEED 2025 brings together leading researchers, educators, and
              innovators to share insights on sustainable development through
              science, engineering, and education. Join us for an inspiring
              event that bridges academia, industry, and policy-making.
            </p>
          </div>
        </div>
      </section>

      {/* Sub-Themes Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-12 text-center text-primary">
              Conference Sub-Themes
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subThemes.map((theme, index) => (
              <Card
                key={index}
                className="glass-card p-8 hover:scale-105 transition-transform duration-300 border-2 border-accent/20"
              >
                <div className="text-5xl mb-4">{theme.icon}</div>
                <h3 className="font-heading font-semibold text-xl mb-3 text-primary">
                  {theme.title}
                </h3>
                <p className="text-muted-foreground">{theme.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-themes Section */}
      {/* <section className="py-20 px-4">
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
      </section> */}

      {/* Timeline Section */}
      <section className="py-20 bg-muted/30 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-12 text-center text-primary">
              Important Dates
            </h2>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8"
            >
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="glass-card p-6 flex items-start gap-4 hover:scale-102 transition-transform"
                  >
                    <CheckCircle2 className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-mono font-medium text-primary mb-1">
                        {item.date}
                      </p>
                      <p className="text-lg text-foreground">{item.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      {/* <section className="py-20 px-4">
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
                  <span className="text-soft-white font-medium">
                    {item.label}
                  </span>
                  <span className="text-bright-aqua font-semibold">
                    {item.date}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section> */}


       {/* Payment Instructions Section */}
      <section className="py-20 bg-white">
     
                <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="container mx-auto px-6">
              
       
          <div className="max-w-3xl mx-auto">
            <Card className="glass-card p-8 border-2 border-primary/20">
              <h2 className="font-heading font-bold text-3xl mb-6 text-primary text-center">
                Registration Fee
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-accent/10 rounded-lg">
                  <span className="font-semibold text-lg">Students</span>
                  <span className="font-heading font-bold text-2xl text-accent">₦7,500</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                  <span className="font-semibold text-lg">Professionals</span>
                  <span className="font-heading font-bold text-2xl text-primary">₦10,000</span>
                </div>
              </div>
              <div className="bg-secondary/10 p-6 rounded-lg mb-6">
                <h3 className="font-heading font-semibold text-xl mb-4 text-secondary">Bank Details</h3>
                <div className="space-y-3 font-mono">
                  <div>
                    <span className="text-muted-foreground">Account Name:</span>
                    <p className="font-semibold">LEAD AND MENTOR</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Account Number:</span>
                    <p className="font-semibold">0080840445</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bank:</span>
                    <p className="font-semibold">Sterling Bank</p>
                  </div>
                </div>
              </div>
                 <div className="mt-6 p-4 bg-primary/10 rounded-lg mb-5">
              <p className="text-sm  text-center">
                After payment, upload your receipt through your participant
                dashboard to proceed with abstract submission.
              </p>
            </div>
            
              <Link to="/register">
                <Button className="w-full gradient-button text-soft-white font-semibold px-12 hover:opacity-90 text-lg py-6">
                  Register & Upload Receipt
                </Button>
              </Link>
            </Card>
            
          </div>
        </motion.div>
      </section>

      {/* Payment Instructions */}
      {/* <section className="py-20 px-4">
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
              <h3 className="font-semibold text-lg mb-3">
                Bank Transfer Details:
              </h3>
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
                After payment, upload your receipt through your participant
                dashboard to proceed with abstract submission.
              </p>
            </div>
          </motion.div>
        </div>
      </section> */}

           {/* Call for Abstracts */}
      <section className="py-20 bg-gradient-primary text-white">

                <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
             className="container mx-auto px-6 text-center"
          >
     
          <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6">
            Call for Abstracts
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Submit your research and contribute to the conversation on sustainable development. 
            Accepted abstracts will be published in collaboration with AcademicEvents.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 py-6">
              Submit Your Abstract <FileText className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Publication Section */}
      {/* <section className="py-20 px-4">
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
              Accepted abstracts will be published in our Abstract Book in
              collaboration with{" "}
              <span className="font-semibold text-emerald-green">
                AcademicEvents
              </span>
            </p>
          </motion.div>
        </div>
      </section> */}

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
              Be part of the conversation shaping the future of sustainable
              development
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="gradient-button text-soft-white font-semibold px-12 py-6 text-lg"
              >
                Register Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

            {/* Footer */}
      <footer className="bg-secondary text-white py-12">
      
             <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="container mx-auto px-6 text-center">
          <p className="font-heading font-semibold text-xl mb-4">ISEED 2025</p>
          <p className="text-white/80 mb-6">
            International Conference on Innovations in Science, Engineering, and Education<br />
            for Sustainable Development
          </p>
          <p className="text-white/60">
            © 2025 ISEED Conference. All rights reserved.
          </p>
      </motion.div>
      </footer>
    </div>
  );
};

export default Landing;
