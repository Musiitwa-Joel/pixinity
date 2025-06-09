import type React from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Users,
  Globe,
  Award,
  Heart,
  Lightbulb,
  Target,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Users,
      value: t("about.stats.activePhotographers.value"),
      label: t("about.stats.activePhotographers.label"),
    },
    {
      icon: Camera,
      value: t("about.stats.photosShared.value"),
      label: t("about.stats.photosShared.label"),
    },
    {
      icon: Globe,
      value: t("about.stats.countries.value"),
      label: t("about.stats.countries.label"),
    },
    {
      icon: Award,
      value: t("about.stats.awardsWon.value"),
      label: t("about.stats.awardsWon.label"),
    },
  ];

  const values = [
    {
      icon: Heart,
      title: t("about.values.items.passion.title"),
      description: t("about.values.items.passion.description"),
    },
    {
      icon: Users,
      title: t("about.values.items.community.title"),
      description: t("about.values.items.community.description"),
    },
    {
      icon: Lightbulb,
      title: t("about.values.items.innovation.title"),
      description: t("about.values.items.innovation.description"),
    },
    {
      icon: Globe,
      title: t("about.values.items.accessibility.title"),
      description: t("about.values.items.accessibility.description"),
    },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      image:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
      bio: "Award-winning photographer with 15+ years of experience. Former National Geographic contributor.",
    },
    {
      name: "Alex Rodriguez",
      role: "CTO",
      image:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
      bio: "Tech visionary who previously led engineering teams at Adobe and Google. Passionate about creative tools.",
    },
    {
      name: "Maya Patel",
      role: "Head of Community",
      image:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
      bio: "Documentary photographer and community builder. Dedicated to fostering inclusive creative spaces.",
    },
    {
      name: "David Kim",
      role: "Head of Design",
      image:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
      bio: "Award-winning UX designer with a background in visual arts. Believes in design that empowers creativity.",
    },
  ];

  const milestones = [
    {
      year: "2019",
      title: "Pixinity Founded",
      description: "Started with a vision to democratize photography sharing",
    },
    {
      year: "2020",
      title: "10K Photographers",
      description: "Reached our first major community milestone",
    },
    {
      year: "2021",
      title: "Mobile App Launch",
      description: "Brought Pixinity to iOS and Android platforms",
    },
    {
      year: "2022",
      title: "1M Photos Shared",
      description: "Celebrated one million photos uploaded to our platform",
    },
    {
      year: "2023",
      title: "Global Expansion",
      description: "Launched in 50+ countries with localized experiences",
    },
    {
      year: "2024",
      title: "AI-Powered Features",
      description: "Introduced smart tagging and discovery algorithms",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M50 50c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm-20 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8">
              <Star className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">{t("about.hero.badge")}</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">{t("about.hero.title")}</span>
              <span className="font-cursive text-6xl md:text-7xl bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                {t("about.hero.brandName")}
              </span>
            </h1>

            <p className="text-xl text-white/90 leading-relaxed mb-8">
              {t("about.hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn bg-white text-slate-900 hover:bg-neutral-100 text-lg px-8 py-4 group">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                {t("about.hero.watchStoryButton")}
              </button>
              <Link to="/signup" className="btn-glass text-lg px-8 py-4 group">
                <span>{t("about.hero.joinCommunityButton")}</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-100 to-purple-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-4xl font-bold text-neutral-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">
                {t("about.mission.title")}{" "}
                <span className="font-cursive bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  {t("about.mission.titleHighlight")}
                </span>
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                {t("about.mission.description1")}
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                {t("about.mission.description2")}
              </p>
              <div className="flex items-center space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="text-neutral-700">
                  {t("about.mission.goals.democratizing")}
                </span>
              </div>
              <div className="flex items-center space-x-4 mt-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="text-neutral-700">
                  {t("about.mission.goals.supporting")}
                </span>
              </div>
              <div className="flex items-center space-x-4 mt-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="text-neutral-700">
                  {t("about.mission.goals.building")}
                </span>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1"
                  alt="Photography community"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-xl border border-neutral-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Target className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900">
                      {t("about.mission.goalCard.title")}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {t("about.mission.goalCard.subtitle")}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              {t("about.values.title")}{" "}
              <span className="font-cursive bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {t("about.values.titleHighlight")}
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              {t("about.values.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-r from-primary-100 to-purple-100 rounded-xl">
                    <value.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              {t("about.team.title")}{" "}
              <span className="font-cursive bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {t("about.team.titleHighlight")}
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              {t("about.team.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              {t("about.timeline.title")}{" "}
              <span className="font-cursive bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {t("about.timeline.titleHighlight")}
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              {t("about.timeline.subtitle")}
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-500 to-purple-500 rounded-full"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className={`flex items-center ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`w-1/2 ${
                      index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                    }`}
                  >
                    <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow">
                      <div className="text-2xl font-bold text-primary-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-neutral-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="relative z-10 w-4 h-4 bg-white border-4 border-primary-500 rounded-full"></div>

                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t("about.cta.title")}{" "}
              <span className="font-cursive text-yellow-300">
                {t("about.cta.titleHighlight")}
              </span>
              ?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {t("about.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn bg-white text-primary-600 hover:bg-neutral-100 text-lg px-8 py-4 group"
              >
                <Zap className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                {t("about.cta.startJourneyButton")}
              </Link>
              <Link to="/explore" className="btn-glass text-lg px-8 py-4 group">
                <span>{t("about.cta.exploreCommunityButton")}</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
