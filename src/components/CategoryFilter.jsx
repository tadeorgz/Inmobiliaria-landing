import { Search, SlidersHorizontal } from 'lucide-react'

function CategoryFilter({
  search,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
}) {
  return (
    <section id="propiedades" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-color)]">
          Propiedades disponibles
        </p>
        <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
          Encontrá tu propiedad ideal en Montevideo
        </h2>
        <p className="mt-2 text-sm text-slate-600">Filtrá por tipo de propiedad: casas, departamentos, alquileres o ventas.</p>
      </div>

      <div className="rounded-2xl border border-[var(--brand-color)]/15 bg-white p-4 shadow-sm sm:p-5">
        {/* Search */}
        <div className="relative mb-4">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por zona, tipo de propiedad o característica..."
            className="w-full rounded-xl border border-[var(--brand-color)]/20 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[var(--brand-color)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-color)]/12"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 whitespace-nowrap">
              <SlidersHorizontal size={12} />
              Filtrar por:
            </span>
            {categories.map((category) => {
              const isActive = selectedCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  className={`rounded-xl px-3 py-1.5 text-xs sm:px-4 sm:py-2 font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-color)]/50 focus-visible:ring-offset-2 ${isActive
                    ? 'bg-[var(--brand-color)] text-white shadow-md shadow-[var(--brand-color)]/30 scale-105'
                    : 'bg-slate-100 text-slate-600 hover:-translate-y-0.5 hover:bg-[var(--brand-color)]/10 hover:text-slate-900'
                    }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategoryFilter
