test('测试获取测试文件名', () => {
  const TestTool = require('../index')
  const testTool = new TestTool()
  const filename = testTool.genTestFileName('/abc/index.js')
  expect(filename).toBe('/abc/__test__/index.spec.js')
})

test('测试代码生成', () => {
  const src = new (require('../index'))()
  const ret = src.genTestSource('func', 'class')
  expect(ret).toBe(`
test('测试func', () => {
  const func = require('../class')
  const ret = func()
  //expect(filename).toBe('test return')
})
`)
})

const fs = require('fs')

test('集成测试 测试生成代码文件', () => {
  fs.rmdirSync(__dirname + '/data/__test__', {
    recursive: true 
  })
  const src = new (require('../index'))()
  src.genJestSource(__dirname + '/data')
})

