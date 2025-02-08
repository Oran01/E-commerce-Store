import React from "react";
import { OrderInformation } from "./components/OrderInformation";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";

/**
 * Defines the properties for the Order History Email component.
 */
type OrderHistoryEmailProps = {
  orders: {
    /** Unique identifier for the order */
    id: string;
    /** Price paid for the product in cents */
    pricePaidInCents: number;
    /** Timestamp of when the order was created */
    createAt: Date;
    /** ID used to verify and authorize the download */
    downloadVerificationId: string;
    product: {
      /** Name of the purchased product */
      name: string;
      /** Image path for the product */
      imagePath: string;
      /** Description of the product */
      description: string;
    };
  }[];
};

/**
 * Preview properties for the Order History Email.
 * Used for rendering email previews in development.
 */
OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      createAt: new Date(),
      pricePaidInCents: 10000,
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product name",
        description: "Some description",
        imagePath: "",
      },
    },
  ],
} satisfies OrderHistoryEmailProps;

/**
 * Component for rendering an Order History Email.
 * This email provides a summary of past purchases and download links.
 *
 * @param {OrderHistoryEmailProps} props - The props containing order details.
 */
export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Order History</Heading>
            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <OrderInformation
                  key={order.id}
                  order={order}
                  product={order.product}
                  downloadVerificationId={order.downloadVerificationId}
                />
                {index < orders.length - 1 && <Hr />}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
