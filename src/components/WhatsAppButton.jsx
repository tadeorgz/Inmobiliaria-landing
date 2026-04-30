import { MessageCircle } from 'lucide-react'

function WhatsAppButton({ href, label, className = '', variant = 'solid', size = 'md' }) {
  const sizeClasses = {
    md: 'px-5 py-3 text-sm',
    lg: 'px-7 py-4 text-base',
  }

  if (variant === 'outline') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--brand-color)] ${sizeClasses[size]} font-semibold text-[var(--brand-color)] transition-all duration-300 hover:bg-[var(--brand-color)]/10 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-color)] ${className}`}
      >
        <MessageCircle size={size === 'lg' ? 20 : 17} />
        {label}
      </a>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#25D366] ${sizeClasses[size]} font-semibold text-white shadow-md shadow-green-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1fb558] hover:shadow-lg hover:shadow-green-500/35 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 ${className}`}
    >
      {/* Shine sweep */}
      <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />

      <MessageCircle size={size === 'lg' ? 20 : 17} className="relative" />
      <span className="relative">{label}</span>
    </a>
  )
}

export default WhatsAppButton
