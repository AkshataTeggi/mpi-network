"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-green-700">Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Employee Management */}
        <Card className="hover:shadow-lg border border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Employee Management</CardTitle>
            <CardDescription>Manage employee profiles and assignments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => router.push("/dashboard/settings/employees")}
            >
              Go to Employees
            </Button>
          </CardContent>
        </Card>
        {/* Department Management */}
        <Card className="hover:shadow-lg border border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Department Management</CardTitle>
            <CardDescription>Manage departments in your organization.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => router.push("/dashboard/settings/departments")}
            >
              Go to Departments
            </Button>
          </CardContent>
        </Card>



        {/* Customer Management */}
        {/* <Card className="hover:shadow-lg border border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Customer Management</CardTitle>
            <CardDescription>Manage customer records and details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => router.push("/dashboard/settings/customers")}
            >
              Go to Customers
            </Button>
          </CardContent>
        </Card> */}




        <Card className="hover:shadow-lg border border-green-200">
  <CardHeader>
    <CardTitle className="text-green-800">Roles & Permissions</CardTitle>
    <CardDescription>Manage user roles and access permissions.</CardDescription>
  </CardHeader>
  <CardContent>
    <Button
      className="bg-green-600 hover:bg-green-700 text-white"
      onClick={() => router.push("/dashboard/settings/roles")}
    >
      Go to Roles
    </Button>
  </CardContent>
</Card>


      <Card className="hover:shadow-lg border border-green-200">
  <CardHeader>
    <CardTitle className="text-green-800">Services</CardTitle>
    <CardDescription>Manage service offerings and configurations.</CardDescription>
  </CardHeader>
  <CardContent>
    <Button
      className="bg-green-600 hover:bg-green-700 text-white"
      onClick={() => router.push("/dashboard/settings/services")}
    >
      Go to Services
    </Button>
  </CardContent>
</Card>




      

      
      </div>
    </div>
  )
}
