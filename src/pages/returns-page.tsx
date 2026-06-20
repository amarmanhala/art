export function ReturnsPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Last Updated: January 15, 2026
        </p>
        <h1 className="text-4xl font-medium">Refund & Return Policy</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          We want you to love what you receive, but we understand that things
          don't always go as planned. Below is everything you need to know about
          returns, exchanges, and refunds.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">
          Can I cancel or change my order?
        </h2>
        <p className="leading-7">
          Yes, within the first 24 hours after order confirmation. We place all
          orders on hold for 24 hours to allow for changes or corrections.
          During this time, you can:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Adjust your selection, including size, frame, or print.</li>
          <li>Cancel your order.</li>
        </ul>
        <p className="leading-7">
          Simply contact us as soon as possible within that 24-hour window.
        </p>
        <p className="leading-7">
          After 24 hours, cancellations are no longer possible and no changes
          can be made. This is because each piece is made to order and enters an
          automated production workflow.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">
          Shipping address changes & incorrect addresses
        </h2>
        <p className="leading-7">
          You can still update your shipping address until the order has been
          shipped. Once it's shipped, the address can no longer be modified and
          we are unable to reroute or recover it.
        </p>
        <p className="leading-7">
          If an order is not delivered due to an incorrect or incomplete address
          entered by the customer, we cannot offer a refund or free replacement.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">Return Window</h2>
        <p className="leading-7">
          Returns are accepted within 30 days of delivery, provided that:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>The item is unused, unmarked, and in its original packaging.</li>
          <li>The return request is approved in advance.</li>
        </ul>
        <p className="leading-7">
          Because all products are made to order, change-of-mind and unwanted
          returns are discouraged.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">
          Unwanted / Change-of-Mind Returns / Exchanges
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Customers are responsible for return shipping costs.</li>
          <li>Original shipping costs are non-refundable.</li>
          <li>
            This applies to exchanges, unwanted items, and change-of-mind
            returns.
          </li>
        </ul>
        <p className="leading-7">
          To request a return, email hello@kogei.art with the subject line: "I
          want to return". Include the reason for your return. We will provide
          next steps and the return address.
        </p>
        <p className="leading-7">
          A proof of return, such as tracking or shipping confirmation, is
          required to complete the return process.
        </p>
        <p className="leading-7">
          Refunds are processed only after the return has been received and
          inspected at our warehouse and confirmed to be unmarked and in
          original condition.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">
          What if my item arrived damaged or incorrect?
        </h2>
        <p className="leading-7">
          If your order arrives damaged or you receive the wrong item, we're
          truly sorry and will make it right. You are eligible for:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>A free replacement or full refund.</li>
          <li>Free return shipping.</li>
        </ul>
        <p className="leading-7">
          To process your request, please send us photo evidence within 7 days
          of delivery, including:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>A photo of the external packaging of the shipment.</li>
          <li>A photo of the shipping label on the package.</li>
          <li>
            A photo of the product itself, including visible damage or issue.
          </li>
        </ul>
        <p className="leading-7">
          This helps us resolve the issue quickly and file claims with our
          shipping partners if needed.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">Important Notes</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>We do not accept returns for used or visibly worn items.</li>
          <li>
            Items returned without prior approval will not be eligible for a
            refund.
          </li>
          <li>
            Refunds will be processed to your original payment method once we've
            received and inspected the return.
          </li>
          <li>
            Please allow up to 10 business days for the refund to reflect in
            your account.
          </li>
        </ul>
      </section>

      <p className="border-t pt-8 leading-7">
        For any questions, issues, or return requests, please reach out to our
        support team at hello@kogei.art.
      </p>
    </main>
  )
}
