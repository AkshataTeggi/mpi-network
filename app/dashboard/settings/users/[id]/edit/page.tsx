import { UserService } from "@/components/user/user-service";

export default function UserEditPage({ params }: { params: { id: string } }) {
  return <UserService initialView="edit" userId={params.id} />
}
