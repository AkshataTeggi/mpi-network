interface DepartmentErrorProps {
  error: string
}

export function DepartmentError({ error }: DepartmentErrorProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Departments</h1>
      <div className="flex items-center justify-center h-64">
        <p className="text-green-500">{error}</p>
      </div>
    </div>
  )
}
