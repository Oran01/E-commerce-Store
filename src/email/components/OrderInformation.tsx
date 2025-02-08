import { formatCurrency } from "@/lib/formatters";
import {
  Button,
  Column,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components";

/**
 * Props for the OrderInformation component.
 */
type OrderInformationProps = {
  /** Unique identifier for the order, Date when the order was created, Total amount paid in cents */
  order: { id: string; createAt: Date; pricePaidInCents: number };
  /** Image path for the product, Name of the purchased product, Description of the product */
  product: { imagePath: string; name: string; description: string };
  /** ID for verifying and authorizing the download */
  downloadVerificationId: string;
};

/** Formatter for displaying the purchase date in a readable format */
const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

/**
 * Component that displays order details, including order ID, purchase date, price paid,
 * product image, product name, description, and a download button.
 *
 * @param {OrderInformationProps} props - The props containing order details.
 */
export function OrderInformation({
  order,
  product,
  downloadVerificationId,
}: OrderInformationProps) {
  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Order ID
            </Text>
            <Text className=" mt-0 mr-4">{order.id}</Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Purchased On
            </Text>
            <Text className=" mt-0 mr-4">
              {dateFormatter.format(order.createAt)}
            </Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Price Paid
            </Text>
            <Text className=" mt-0 mr-4">
              {formatCurrency(order.pricePaidInCents / 100)}
            </Text>
          </Column>
        </Row>
      </Section>
      <Section className="border border-solid border-gray-500  rounded-lg p-4 md:p-6 my-4">
        <Img
          width="100%"
          alt={product.name}
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath.replace(/^\/+/, "")}`}
        />
        <Row className="mt-8">
          <Column className="align-bottom">
            <Text className="text-lg font-bold m-0 mr-4">{product.name}</Text>
          </Column>
          <Column align="right">
            <Button
              href={`${process.env.NEXT_PUBLIC_SERVER_URL}/products/download/${downloadVerificationId}`}
              className="bg-black text-white px-6 py-4 rounded text-lg"
            >
              Download
            </Button>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text className="text-gray-500 mb-0">{product.description}</Text>
          </Column>
        </Row>
      </Section>
    </>
  );
}
