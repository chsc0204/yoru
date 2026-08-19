export default function ScrollRow({ children, itemClassName = 'w-[46%] sm:w-[30%] md:w-[19%] lg:w-[15%]' }) {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div key={i} className={`shrink-0 snap-start ${itemClassName}`}>
              {child}
            </div>
          ))
        : children}
    </div>
  )
}
