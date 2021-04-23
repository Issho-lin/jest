test('测试helloworld', () => {
  const res = require('../index')
  expect(res).toBe('hello world')
})
