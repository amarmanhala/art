export function PrivacyPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Last Updated: January 15, 2026
        </p>
        <h1 className="text-4xl font-medium">Privacy Policy</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          This Privacy Policy explains how House of Koyomi collects, uses, and
          protects information when you visit our website, contact us, or place
          an order.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">Information We Collect</h2>
        <p className="leading-7">
          We may collect information you provide directly, including your name,
          email address, shipping address, billing details, order number, and
          messages sent through our contact form.
        </p>
        <p className="leading-7">
          We may also collect basic technical information such as browser type,
          device information, pages visited, and website usage data.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">How We Use Information</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>To process, fulfill, and support your orders.</li>
          <li>To respond to questions, return requests, and support issues.</li>
          <li>To improve our website, products, and customer experience.</li>
          <li>To prevent fraud, abuse, and unauthorized activity.</li>
          <li>To send order-related updates and service messages.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">AI-Generated Artwork</h2>
        <p className="leading-7">
          Our products feature artwork generated with AI-assisted tools and
          human creative direction. We do not use customer personal information
          to generate public artwork unless clearly requested and approved by
          the customer.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">Sharing Information</h2>
        <p className="leading-7">
          We share information only when needed to operate our business, such as
          with payment processors, production partners, shipping carriers,
          website hosting providers, and support tools.
        </p>
        <p className="leading-7">
          We do not sell your personal information.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">Cookies and Analytics</h2>
        <p className="leading-7">
          We may use cookies and similar technologies to keep the website
          working, remember preferences, measure performance, and understand how
          visitors use the site.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">Data Retention</h2>
        <p className="leading-7">
          We keep personal information only as long as necessary for order
          fulfillment, customer support, legal obligations, fraud prevention,
          and business records.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">Your Choices</h2>
        <p className="leading-7">
          You may contact us to request access, correction, or deletion of your
          personal information, subject to legal and operational requirements.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">Security</h2>
        <p className="leading-7">
          We use reasonable safeguards to protect personal information. However,
          no website or online service can guarantee complete security.
        </p>
      </section>

      <p className="border-t pt-8 leading-7">
        For privacy questions or requests, contact us at
        hello@houseofkoyomi.com.
      </p>
    </main>
  )
}
