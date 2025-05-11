import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../../context/ThemeContext";
const Help = () => {
    const { darkMode } = useThemeContext();
    const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I get started with the app?",
      answer: "Create an account, log in, and visit your dashboard to start uploading and reviewing transactions.",
    },
    {
      question: "Why was my transaction flagged?",
      answer: "Our system uses anomaly detection AI and ML algorithms to flag transactions that appear suspicious based on patterns.",
    },
    {
      question: "Can do I know the transactiom is fraud?",
      answer: "After analysing the file, the app will provide a detailed report with flagged transactions, red as fraud, yellow as suspicious and green as normal.",
    },
    {
      question: "How do I contact support?",
      answer: "Email us at support@recova.com.",
    },
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 dark:bg-secondary   font-poppinsLight ` + (darkMode ? "dark" : "")}>

       <h1 className='text-5xl absolute top-14 h-20 font-poppinsRegular gradient-text1 font-bold'>Need assistance? We're here to help!</h1>

      {/* Getting Started */}
      <section className="mb-8 pt-28 ">
        <h2 className="text-xl font-medium text-gray-800 font-poppinsMedium dark:text-gray-300 mb-2">Getting Started</h2>
        <ul className="list-disc pl-6 pt-3 dark:text-gray-300 text-sm font-poppinsRegular text-gray-700 space-y-1">
          <li>Sign up with your email or login to your account.</li>
          <li>Access the Dashboard from the profile.</li>
          <li>Upload your transaction data file for analysis.</li>
        </ul>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-xl font-medium text-gray-800 mb-4 font-poppinsSemiBold dark:text-gray-500">Frequently Asked Questions</h2>
        <div className="space-y-3 text-lg">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg  p-4 cursor-pointer bg-white shadow-sm"
              onClick={() => toggle(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm tracking-wider font-semibold text-gray-500">{item.question}</h3>
                <span>{openIndex === index ? "-" : "+"}</span>
              </div>
              {openIndex === index && (
                <p className=" text-gray-600 mt-2 text-sm tracking-wide font-poppinsRegular">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Support */}
      <section className="mt-10">
        <h2 className="text-xl font-medium text-gray-800 mb-2 dark:text-gray-300">Need more help?</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Contact our team at <a href="mailto:support@yourapp.com" className="text-blue-600 underline">support@recova.com </a>
          
        </p>
      </section>
    </div>
  );
};

export default Help;
