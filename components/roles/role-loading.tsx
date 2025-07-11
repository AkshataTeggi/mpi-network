import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function RoleLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Tabs skeleton */}
      <div className="flex space-x-1 border-b">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Roles list skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 border rounded"
              >
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" /> {/* Role name */}
                  <Skeleton className="h-4 w-56" /> {/* Department or description */}
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-16" /> {/* Edit button */}
                  <Skeleton className="h-8 w-16" /> {/* Delete button */}
                  <Skeleton className="h-8 w-20" /> {/* Extra action (optional) */}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
