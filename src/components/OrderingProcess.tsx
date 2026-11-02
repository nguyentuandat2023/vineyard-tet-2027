import React from 'react';
import { Send, Headphones, CheckSquare, FileCheck, Truck, ArrowRight } from 'lucide-react';
import { ORDERING_STEPS } from '../data/products';

interface OrderingProcessProps {
  onOpenQuote: () => void;
}

export const OrderingProcess: React.FC<OrderingProcessProps> = ({ onOpenQuote }) => {
  const stepIcons = [
    <Send className="w-5 h-5" />,
    <Headphones className="w-5 h-5" />,
    <CheckSquare className="w-5 h-5" />,
    <FileCheck className="w-5 h-5" />,
    <Truck className="w-5 h-5" />
  ];

  return (
    <section id="process" className="py-20 bg-[#F7F3EC] border-b border-[#E8D5A7]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C49B43]/30 text-[#68151F] text-xs font-semibold tracking-widest uppercase mb-3">
            <span>B2B Ordering Workflow</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#282321] tracking-tight mb-4 font-display">
            QUY TRÌNH ĐẶT QUÀ ĐƠN GIẢN
          </h2>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Quy trình làm việc chuyên nghiệp, minh bạch và nhanh chóng giúp doanh nghiệp tiết kiệm tối đa thời gian và chi phí vận hành.
          </p>
        </div>

        {/* 5 Steps Visual Timeline */}
        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-[2px] bg-[#C49B43]/30 -translate-y-6 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {ORDERING_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs hover:border-[#C49B43] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#68151F] text-[#E8D5A7] flex items-center justify-center font-bold shadow-sm">
                      {stepIcons[idx]}
                    </div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#F7F3EC] text-[#B52C32] border border-stone-200">
                      BƯỚC {step.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#282321] mb-2 font-display">
                    {step.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Tiến độ</span>
                  <span className="text-[#68151F] font-semibold">{`Giai đoạn ${idx + 1}/5`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenQuote}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold text-white bg-[#B52C32] hover:bg-[#8e1d23] transition-colors shadow-md active:scale-98"
          >
            <span>Bắt Đầu Bằng Việc Gửi Yêu Cầu</span>
            <ArrowRight className="w-4 h-4 text-[#E8D5A7]" />
          </button>
        </div>
      </div>
    </section>
  );
};
