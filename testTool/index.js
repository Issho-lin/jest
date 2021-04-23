const path = require('path')
const fs = require('fs')
module.exports = class TestTool {
  genTestFileName(filename) {
    // /abc/index.js
    // 获取文件夹
    const dirname = path.dirname(filename)
    // 获取文件名
    const basename = path.basename(filename)
    // 获取扩展名
    const extname = path.extname(filename)
    // /abc/index.js => /abc/__test__/index.spec.js
    return path.format({
      root: `${dirname}/__test__/`,
      base: basename.replace(extname, `.spec${extname}`)
    })
  }

  genJestSource(sourcePath = path.resolve('./')) {
    // 生成的测试代码存放路径
    const testPath = `${sourcePath}/__test__`
    // 判断目录是否已存在
    // -已存在，则跳过
    // -不存在，则创建
    if (!fs.existsSync(testPath)) {
      fs.mkdirSync(testPath)
    }
    // 读取需要生成测试代码的文件
    let list = fs.readdirSync(sourcePath)
    list
      // 拼接每个文件的完整绝对路径
      .map(v => `${sourcePath}/${v}`)
      // 过滤文件夹
      .filter(v => fs.statSync(v).isFile())
      // 过滤测试代码
      .filter(v => !v.includes('.spec'))
      // 生成测试代码文件
      .map(v => this.genTestFile(v))
  }
  genTestFile(filename) {
    // 获取测试代码路径：/abc/__test__/index.spec.js
    const testFileName = this.genTestFileName(filename)
    // 判断文件是否已存在
    if (fs.existsSync(testFileName)) {
      console.log('该测试代码已存在');
      return
    }
    // 导入每个待测试文件代码
    const mod = require(filename)
    let source
    if (typeof mod === 'object') {
      // 如果是类，遍历每个方法，生成每个方法对应的测试代码
      source = Object.keys(mod).map(v => this.genTestSource(v, path.basename(filename), true)).join('\n')
    } else if (typeof mod === 'function') {
      // 如果是函数，则以文件名为方法名，生成对应的测试代码
      const basename = path.basename(filename)
      source = this.genTestSource(basename.replace('.js', ''), basename)
    }
    // 把测试代码写入对应的测试文件中
    fs.writeFileSync(testFileName, source)
  }

  genTestSource(methodName, classFIle, isclass = false) {
    return `
test('测试${methodName}', () => {
  const ${isclass ? `{${methodName}}` : methodName} = require('../${classFIle}')
  const ret = ${methodName}()
  //expect(filename).toBe('test return')
})
`
  }
}