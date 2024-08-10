import prisma from '@/lib/prisma'
import Image from 'next/image'

export default async function Table() {
  const startTime = Date.now()
  const customers = await prisma.customers.findMany()
  const duration = Date.now() - startTime

  return (
    <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Customers</h2>
          <p className="text-sm text-gray-500">
            Fetched {customers.length} users in {duration}ms
          </p>
        </div>
      </div>
      <div className="divide-y divide-gray-900/5">
        {customers.map((customer: Record<string, string>) => (
          <div
            key={customer.name}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center space-x-4">
              <Image
                src={customer.image}
                alt={customer.name}
                width={48}
                height={48}
                className="rounded-full ring-1 ring-gray-900/5"
              />
              <div className="space-y-1">
                <p className="font-medium leading-none">{customer.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}