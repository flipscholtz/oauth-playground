import prisma from '../src/lib/prisma'

async function main() {
  const response = await Promise.all([
    prisma.client.upsert({
      where: { name: 'Customer 1' },
      update: {},
      create: {
        name: 'Customer 1',
        clientId: 'client-1-id',
        clientSecret: 'client-1-secret', // to be replaced via postgres console
        jwtSecretKeyPem: 'client-1-pem',
        allowedRedirectEndpoints: 'http://localhost:3000/callback',
        logo:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMUAAAEACAMAAAA0tEJxAAAAb1BMVEX///8AAADNzc1gYGBBQUH8/PwdHR2/v7/Hx8eqqqr4+Pijo6P19fXV1dXY2Njy8vLn5+fh4eHs7OyEhIQMDAx9fX2Li4uamppnZ2c0NDS6urqkpKRvb2/l5eUpKSlVVVVMTEw7OzssLCyUlJRHR0eNMZJmAAADCklEQVR4nO3di1LaQBiG4SV2Cw3ZUxRiKdSi3v81doPMYC2HgGK+OO87gpJhnP9hDTjRIcYQERERERERERERERER0fuz+bKY7mpi3xOdXzZU09+j1xV9z3RB6Xb0puEo7MuncvHw1jA0hXXLu/8NQ1IYW9x+30cYhsK2q1AulgcEA1Hk3bnZsy8MSlEuZnt3hUEoXp6RivmfkwJlhSld862TQE6xfUkw9fhp3Vkgp8hVrtn/kjAQRfCT5v58QK8Ku/sypMl0fn/oBU1ZYU0ZYho385v179NDqiqMffyA4ftXvOsnCAUKFChQoECBAgUKFChQoECBAsUnKj4S0d9x2snpip/yii51/gMGiquHQicUOqHQCYVOKHRCoRMKnVDohEInFDqh0AmFTih0QqETCp1Q6IRCJxQ6odAJhU4odEKhEwqdUOiEQicUOqHQCYVOKHRCoRMKnVDohEInFDqh0AmFTih0QqETCp1Q6IRCJxQ6odAJhU4odEKhEwqdUOiEQicUOn0NxbqrYtL3pMfq/K6Ji74nPVbns6786HvSY3U+8c2vvic9UuiKGD31PeqRYmfFvO9RjzTurFj2PeqRnjor1n2PejBrup1bb1PZ97QH890Rwk9SZyyF6GJYa+bnIEYP5p/zxIlUHjtx6b6eazlG3VzwRuEz99ljWjve36KZLZ/PF2x7XM6mi73fdnUdxsWTXtZ1nsQ+9r3lT3ed33pRoECBAgUKFChQoECBAgUKFChOKO6+hOL+5jN7GF8FIXZIlYiIiIiIiIiIiIg+Ltv+X619cyR4cMeFyxDydVXubltTt7AQ7Ot7VdKyUNTO2lC1i5LaK2eNz7fsJBRmY2vHD67eLNf2YrdrKFPpau9WPkxqbydlcrao0yo4XxXBpRhXfpVc6aL3lUvWudL4OqXa+1URU9+z76rawUzMD7w3rkxF5YzLU1a2yGsSfV2HlJ3WpyyMebMpTP4oUr6f73v2XSHP4m2sfelfHua8EimkuNke82qEzTaftyWTYhljrOOqTsFXQgpq+wthNkUm2RfOcQAAAABJRU5ErkJggg==',
      },
    }),
    prisma.client.upsert({
        where: { name: 'Customer 2' },
        update: {},
        create: {
          name: 'Customer 2',
          clientId: 'client-2-id',
          clientSecret: 'client-2-secret', // to be replaced via postgres console
          jwtSecretKeyPem: 'client-2-pem',
          allowedRedirectEndpoints: 'https://client-2.example.com',
          logo:
            'data:image/png;base64,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',
        },
      }),
  ])
  console.log(response)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })