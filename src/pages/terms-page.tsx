export function TermsPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Last Updated: January 15, 2026
        </p>
        <h1 className="text-4xl font-medium">Terms of Use</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          These Terms of Use govern your access to and use of Kogei, including
          our website, products, and services.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">Our Products</h2>
        <p className="leading-7">
          Our artworks are created using AI-assisted tools and human creative
          direction. Each product is offered as printed wall art and is made to
          order after purchase.
        </p>
        <p className="leading-7">
          Product images, colors, framing, and sizing may appear slightly
          different depending on your screen, materials, and production
          settings.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">Orders and Payments</h2>
        <p className="leading-7">
          By placing an order, you confirm that the information you provide is
          accurate and that you are authorized to use the selected payment
          method. We may refuse or cancel orders if fraud, pricing errors, or
          other issues are detected.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">Intellectual Property</h2>
        <p className="leading-7">
          All website content, product images, artwork concepts, branding, copy,
          and design elements are owned by Kogei or used with permission. You
          may not copy, resell, reproduce, distribute, or create derivative
          products from our artwork or website content without prior written
          permission.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">Personal Use</h2>
        <p className="leading-7">
          Purchasing a print gives you ownership of the physical product only.
          It does not transfer copyright, digital rights, commercial rights, or
          the right to reproduce the artwork.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">Returns and Cancellations</h2>
        <p className="leading-7">
          Because our products are made to order, cancellations, changes,
          returns, and refunds are handled according to our Refund & Return
          Policy.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">Limitation of Liability</h2>
        <p className="leading-7">
          To the fullest extent permitted by law, Kogei is not liable for
          indirect, incidental, special, or consequential damages arising from
          your use of our website or products.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">Changes to These Terms</h2>
        <p className="leading-7">
          We may update these Terms from time to time. Continued use of our
          website after updates means you accept the revised Terms.
        </p>
      </section>

      <p className="border-t pt-8 leading-7">
        For questions about these Terms, contact us at hello@kogei.art.
      </p>
    </main>
  )
}
