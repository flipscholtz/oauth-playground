import prisma from '@/lib/prisma'
import Image from 'next/image'

export default async function Table() {
  const startTime = Date.now()
  const clients = await prisma.Client.findMany()
  const duration = Date.now() - startTime

  return (
    <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Clients</h2>
          <p className="text-sm text-gray-500">
            Fetched {clients.length} clients in {duration}ms
          </p>
        </div>
      </div>
      <div className="divide-y divide-gray-900/5">
        {clients.map((client) => (
          <div
            key={client.name}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center space-x-4">
              <Image
                src={client.logo}
                alt={client.name}
                width={48}
                height={48}
                className="rounded-full ring-1 ring-gray-900/5"
              />
              <div className="space-y-1">
                <p className="font-medium leading-none">{client.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}