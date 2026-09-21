const pkgs = ['@weldjs/http', '@weldjs/react', '@weldjs/router', '@weldjs/forms']
const base = '/tmp/weld-verify/node_modules'
const fs = require('fs')
const path = require('path')

let allOk = true
for (const pkg of pkgs) {
  const pkgJson = JSON.parse(fs.readFileSync(path.join(base, pkg, 'package.json'), 'utf8'))
  console.log('\n' + pkg + '@' + pkgJson.version)
  
  function check(obj) {
    if (typeof obj === 'string' && obj.startsWith('./dist/')) {
      const full = path.join(base, pkg, obj)
      const exists = fs.existsSync(full)
      console.log('  ' + (exists ? 'OK  ' : 'MISS') + ' ' + obj)
      if (!exists) allOk = false
    } else if (obj && typeof obj === 'object') {
      Object.values(obj).forEach(check)
    }
  }
  check(pkgJson.exports)
}
console.log(allOk ? '\nAll exports present' : '\nSome exports MISSING')
