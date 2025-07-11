import { CustomerService } from "@/components/customer/customer-service";

export default function CustomerEditPage({ params }: { params: { id: string } }) {
  return <CustomerService initialView="edit" customerId={params.id} />
}
