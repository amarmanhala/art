export function QuoteSection() {
  return (
    <section className="border-t px-6 py-20">
      <figure className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
        <blockquote className="text-3xl leading-tight font-medium md:text-5xl">
          “Art enables us to find ourselves and lose ourselves at the same
          time.”
        </blockquote>
        <figcaption className="text-sm font-medium">—Thomas Merton</figcaption>
      </figure>
    </section>
  )
}
