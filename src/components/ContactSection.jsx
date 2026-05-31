import { useState } from 'react';
import { Phone, MapPin, Mail, Globe, User, Building2, MessageSquare, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { contactContent, siteConfig } from '../data/siteContent';
import { submitContactForm } from '../lib/supabase';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const iconMap = { Phone, MapPin, Mail, Globe };

const formFields = [
  { key: 'name', type: 'text', icon: User },
  { key: 'company', type: 'text', icon: Building2 },
  { key: 'phone', type: 'tel', icon: Phone },
  { key: 'message', type: 'textarea', icon: MessageSquare, rows: 3 },
];

const initialForm = { name: '', company: '', phone: '', message: '' };
const initialErrors = {};

function validate(form) {
  const errors = {};
  if (!form.name || form.name.trim().length < 2) errors.name = '请输入您的姓名';
  if (!form.phone || !/^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/.test(form.phone)) errors.phone = '请输入有效的电话号码';
  if (!form.message || form.message.trim().length < 5) errors.message = '请简要描述您的需求（至少5个字）';
  return errors;
}

export default function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(form);
    if (fieldErrors[name]) setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ name: true, company: true, phone: true, message: true });
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);

    const result = await submitContactForm(form);

    setSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    setSubmitted(true);
    setForm(initialForm);
    setTouched({});
    setTimeout(() => setSubmitted(false), 5000);
  };

  const fieldError = (name) => (touched[name] && errors[name] ? errors[name] : null);

  const inputClass = (name) =>
    `w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-graphite-800
     placeholder:text-graphite-400
     focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400
     transition-all duration-300
     ${fieldError(name) ? 'border-red-300 focus:ring-red-200' : 'border-stone-200'}`;

  return (
    <section id="contact" className="section-padding bg-white relative overflow-hidden">
      <div className="section-container relative z-10">
        <ScrollReveal>
          <SectionHeading heading={contactContent.heading} subtitle={contactContent.subtitle} />
        </ScrollReveal>

        <div className="mx-auto mt-16 grid max-w-5xl gap-10 lg:grid-cols-5">
          {/* Contact info cards */}
          <div className="space-y-4 lg:col-span-2">
            {contactContent.contactItems.map((item, i) => {
              const Icon = iconMap[item.icon] || Phone;
              const Content = (
                <div className="flex items-start gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-sapphire-50">
                    <Icon size={18} className="text-sapphire-500" />
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-[11px] font-medium uppercase tracking-technical text-graphite-400">{item.label}</h4>
                    {item.href ? (
                      <a href={item.href} target={item.icon === 'Globe' ? '_blank' : undefined} rel={item.icon === 'Globe' ? 'noopener noreferrer' : undefined} className="mt-1 block text-sm font-semibold text-graphite-900 transition-colors hover:text-sapphire-600">
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-semibold text-graphite-900">{item.value}</p>
                    )}
                  </div>
                </div>
              );

              return (
                <ScrollReveal key={item.label} delay={i * 80}>
                  {Content}
                </ScrollReveal>
              );
            })}
          </div>

          {/* Contact form */}
          <ScrollReveal delay={300} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm md:p-8"
            >
              {submitted ? (
                <div className="flex items-center justify-center gap-3 rounded-xl bg-sapphire-50 border border-sapphire-200 p-8 text-center">
                  <CheckCircle size={22} className="text-sapphire-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-sapphire-700">提交成功！我们的商务团队将尽快与您联系。</span>
                </div>
              ) : (
                <>
                  <div className="space-y-5">
                    {formFields.map(({ key, type, icon: FIcon, rows }) => {
                      const fieldConfig = contactContent.formFields[key];
                      const isTextarea = type === 'textarea';
                      const required = key !== 'company';
                      return (
                        <div key={key}>
                          <label htmlFor={key} className="mb-2 flex items-center gap-2 text-sm font-medium text-graphite-600">
                            <FIcon size={14} className="text-graphite-400" />
                            {fieldConfig.label} {required && <span className="text-sapphire-500">*</span>}
                          </label>
                          {isTextarea ? (
                            <textarea
                              id={key}
                              name={key}
                              rows={rows}
                              value={form[key]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={fieldConfig.placeholder}
                              className={inputClass(key)}
                            />
                          ) : (
                            <input
                              type={type}
                              id={key}
                              name={key}
                              value={form[key]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={fieldConfig.placeholder}
                              className={inputClass(key)}
                            />
                          )}
                          {fieldError(key) && (
                            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                              <AlertCircle size={11} /> {fieldError(key)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {submitError && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary mt-7 w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> 提交中...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> 提交咨询
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
