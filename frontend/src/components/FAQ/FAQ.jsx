import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(2); // Third question open by default

  const faqs = [
    {
      question: 'What are Lab Grown Diamonds?',
      answer: 'Lab grown diamonds are real diamonds that are created in controlled laboratory conditions that replicate the natural diamond growing process. They have the same chemical, physical, and optical properties as natural diamonds.'
    },
    {
      question: 'Are Lab Grown Diamonds real?',
      answer: 'Yes, lab grown diamonds are 100% real diamonds. They have the exact same chemical composition (pure carbon, crystallized in a cubic structure) and physical properties as natural diamonds. The only difference is their origin - they are grown in a lab rather than mined from the earth.'
    },
    {
      question: 'Can you tell the difference between Lab Grown Diamonds and natural diamonds?',
      answer: 'There is no way of differentiating between a lab diamond and a natural diamond by looking at them. Even a trained jeweller or expert cannot tell the difference between natural and Lab Grown Diamonds with their naked eyes or with normal microscopes. Only advanced equipment in gemological labs can identify Lab Grown Diamonds.'
    },
    {
      question: 'Are Lab Grown Diamonds worth buying?',
      answer: 'Yes, lab grown diamonds offer excellent value. They are chemically and physically identical to natural diamonds but typically cost 40-50% less. They are also environmentally sustainable and ethically sourced.'
    },
    {
      question: 'Do Lab Grown Diamonds cost less than mined diamonds?',
      answer: 'Yes, lab grown diamonds typically cost 40-50% less than natural mined diamonds of comparable size and quality. This makes them an excellent choice for buyers seeking better value for their money.'
    },
    {
      question: 'Are Lab Grown Diamonds graded and certified?',
      answer: 'Yes, lab grown diamonds are graded and certified by the same internationally recognized gemological laboratories that certify natural diamonds. They are evaluated using the same 4Cs criteria: Cut, Color, Clarity, and Carat weight.'
    },
    {
      question: 'Are Lab Grown Diamonds the same as synthetic diamonds or moissanite?',
      answer: 'No, lab grown diamonds are real diamonds, while moissanite is a different gemstone entirely. Unlike synthetic alternatives or simulants, lab grown diamonds have the same chemical composition and crystal structure as natural diamonds.'
    },
    {
      question: 'Are Lab Grown Diamonds durable?',
      answer: 'Yes, lab grown diamonds are just as durable as natural diamonds. They have the same hardness (10 on the Mohs scale) and durability, making them excellent for everyday wear in jewelry.'
    },
    {
      question: 'Do Lab Grown Diamonds change colour, shine and sparkle over time?',
      answer: 'No, lab grown diamonds do not change color or lose their sparkle over time. Like natural diamonds, they maintain their brilliance and properties indefinitely when properly cared for.'
    },
    {
      question: 'Do all Lab Grown Diamonds look alike?',
      answer: 'No, just like natural diamonds, each lab grown diamond is unique. They vary in their characteristics and can have different colors, clarities, and individual identifying features.'
    },
    {
      question: 'Do Lab Grown Diamonds also have colour and clarity categorisations like natural diamonds?',
      answer: 'Yes, lab grown diamonds are graded using the same color and clarity scales as natural diamonds. They are available in various colors and clarity grades, just like natural diamonds.'
    }
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#4D3C2A] mb-12">FAQs</h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => toggleQuestion(index)}
                className={`w-full text-left p-4 flex justify-between items-center ${openIndex === index ? 'bg-[#4D3C2A] text-white' : 'bg-[#F7F0EA] text-[#4D3C2A] hover:bg-[#E5D5C5]'} rounded-lg focus:outline-none transition-colors duration-200`}
              >
                <span className="font-medium pr-8">{faq.question}</span>
                <FontAwesomeIcon
                  icon={openIndex === index ? faMinus : faPlus}
                  className={`flex-shrink-0 ${openIndex === index ? 'text-white' : 'text-[#4D3C2A]'}`}
                />
              </button>
              {openIndex === index && (
                <div className="p-4 bg-white border border-[#E5D5C5] rounded-b-lg">
                  <p className="text-[#6B5744]">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;