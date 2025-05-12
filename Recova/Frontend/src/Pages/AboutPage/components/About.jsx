import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  LineChart,
  ShieldCheck,
  Activity,
  BarChart,
} from "lucide-react";

// Animations
const slideInLeft = {
  initial: { opacity: 0, x: -100 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
  viewport: { amount: 0.2 },
};

const slideInRight = {
  initial: { opacity: 0, x: 100 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
  viewport: { amount: 0.2 },
};

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
  viewport: { amount: 0.2 },
};

const About = () => {
  return (
    <div className="bg-white text-gray-900 px-4 sm:px-6 md:px-12 lg:px-24 py-12">
      
      {/* Hero Section */}
      <motion.section {...fadeInUp} className="text-center mb-16">
        <h1 className="text-3xl h-32 sm:text-4xl md:text-5xl leading-tight gradient-text1 font-bold font-poppinsMedium">
          Empowering Secure <br className="hidden md:block" />
          Transactions with Intelligence
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Harnessing the power of machine learning, Recova delivers real-time
          fraud detection to protect your financial operations—before damage is
          done.
        </p>
      </motion.section>

      {/* Our Mission Section */}

<motion.section {...fadeInUp} className="mb-16">
  <div className="flex flex-col md:flex-row gap-8 items-start">
    {/* Our Mission */}
    <motion.div {...slideInLeft} className="flex-1">
      <h2 className="text-xl sm:text-2xl text-primary font-semibold mb-4 font-poppinsMedium">
        Our Mission
      </h2>
      <p className="text-sm sm:text-base">
        At <strong className="text-primary">Recova</strong>, our mission is simple: to make digital
        financial transactions safer, smarter, and more secure. We strive to
        outsmart fraud by continuously learning, adapting, and evolving through
        intelligent algorithms that never sleep.
      </p>
    </motion.div>

    {/* Who We Are */}
    <motion.div {...slideInRight} className="flex-1">
      <h2 className="text-xl sm:text-2xl text-primary font-semibold mb-4 font-poppinsMedium">
        Who We Are
      </h2>
      <p className="text-sm sm:text-base">
        We’re a passionate team of data scientists, engineers, and cybersecurity
        experts united by one goal: eliminating financial fraud. With deep expertise
        in AI, real-time systems, and behavioral analytics, Recova was born out of the
        need for a fraud detection solution that thinks faster than fraudsters act.
      </p>
    </motion.div>
  </div>
</motion.section>

{/* What We Do Section (Slide in Up) */}
      <motion.section {...fadeInUp} className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="flex items-start space-x-4">
          <Activity className="text-primary mt-1" />
          <div>
          
            <h3 className="text-lg font-bold text-primary">
              Intelligent Fraud Detection
            </h3>
            <p>Recova analyzes uploaded transaction data to uncover fraudulent activity identifying threats reliably through batch processing.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <LineChart className="text-primary mt-1" />
          <div>
            <h3 className="text-lg font-bold  text-primary">
              Behavioral Pattern Analysis
            </h3>
            <p>By scanning historical transaction records, Recova detects suspicious behavior patterns that often go unnoticed in manual reviews.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <ShieldCheck className="text-primary mt-1" />
          <div>
            <h3 className="text-lg font-bold text-primary">
              Secure Transaction Review
            </h3>
            <p>From small payments to large transfers, every entry in your dataset is evaluated for anomalies, ensuring better control and oversight.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <BarChart className="text-primary mt-1" />
          <div>
            <h3 className="text-lg font-bold text-primary">
              Reports & Insights
            </h3>
            <p>Get clear, actionable insights into fraud trends with downloadable reports and visual summaries—empowering smarter decisions.</p>
          </div>
        </div>
      </motion.section>


      {/* Why Recova Section */}
      <motion.section {...fadeInUp} className="mb-8">
        <h2 className="text-xl sm:text-2xl text-primary font-semibold mb-4 font-poppinsMedium">
          Why Recova?
        </h2>
        <ul className="space-y-4">
          {[
            "AI-Driven Accuracy: Precision you can trust—powered by continuous learning and data refinement.",
            "Customizable Thresholds: You stay in control—tailor fraud detection sensitivity to your specific business needs.",
          ].map((point, idx) => (
            <li key={idx} className="flex items-start">
              <CheckCircle className="text-primary mr-2 mt-1 flex-shrink-0" size={20} />
              <span className="text-sm sm:text-base">{point}</span>
            </li>
          ))}
        </ul>
      </motion.section>

    </div>
  );
};

export default About;
