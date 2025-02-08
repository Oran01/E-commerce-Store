import { OrderInformation } from "./components/OrderInformation";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";

/**
 * Defines the properties required for the Purchase Receipt Email component.
 */
type PurchaseReceiptEmailProps = {
  product: {
    /** Name of the purchased product */
    name: string;
    /** Image path for the product */
    imagePath: string;
    /** Description of the product */
    description: string;
  };
  /** Unique identifier for the order, Timestamp of when the order was created, Price paid for the product in cents */
  order: { id: string; createAt: Date; pricePaidInCents: number };
  /** Unique identifier for the order */
  downloadVerificationId: string;
};

/**
 * Preview properties for the Purchase Receipt Email.
 * Used for rendering email previews in development.
 */
PurchaseReceiptEmail.PreviewProps = {
  product: {
    name: "Product name",
    description: "Some description",
    imagePath: "",
  },
  order: {
    id: crypto.randomUUID(),
    createAt: new Date(),
    pricePaidInCents: 10000,
  },
  downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps;

/**
 * Component for rendering a purchase receipt email.
 * This email provides order details and a download link.
 *
 * @param {PurchaseReceiptEmailProps} props - The props containing order details and product information.
 */
export default function PurchaseReceiptEmail({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              order={order}
              product={product}
              downloadVerificationId={downloadVerificationId}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
