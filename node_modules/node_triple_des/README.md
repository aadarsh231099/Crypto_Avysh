# Node - Triple Des

[![npm package](https://nodei.co/npm/node_triple_des.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node_triple_des/)

[![Run on Repl.it](https://repl.it/badge/github/9trocode/node_triple_des)](https://repl.it/github/9trocode/node_triple_des)
![Node.js CI](https://github.com/9trocode/node_triple_des/workflows/Node.js%20CI/badge.svg?branch=master)
![Node.js CI](https://github.com/9trocode/node_triple_des/workflows/Node.js%20CI/badge.svg?branch=master&event=issues)
![Node.js CI](https://github.com/9trocode/node_triple_des/workflows/Node.js%20CI/badge.svg?branch=master&event=release)

[Node - Triple Des](https://www.npmjs.com/package/node_triple_des) Node Js encryption module for triple des
**Table of contents:**


* [Quickstart](#quickstart)
  * [Before you begin](#before-you-begin)
  * [Installing the client library](#installing-the-client-library)
* [Versioning](#versioning)
* [Contributing](#contributing)
* [License](#license)

## Quickstart
[DES](https://en.wikipedia.org/wiki/Data_Encryption_Standard) message digest cryptographic
hash function algorithm from [CryptoJS](https://#),
packaged for Nodejs.

Dependency
----------
- [`crypto-js`](https://www.npmjs.com/package/crypto-js).

Install
-------

Inside your project folder run
```
$ npm install node_triple_des
```

Usage
-------
```javascript
const Encryption = require('node_triple_des');

const encrypt =  Encryption.encrypt('SharedKey', 'Plain Test');
console.log(encrypt);
// U2FsdGVkX1+luaxAzoyoyJI/5sAzyUW1

const decrypt =  Encryption.decrypt('SharedKey', 'CipherText');
console.log(decrypt);
// U2FsdGVkX1+luaxAzoyoyJI/5sAzyUW1
// Message
```


## Versioning

This library follows [Semantic Versioning](http://semver.org/).


This library is considered to be **General Availability (GA)**. This means it
is stable; the code surface will not change in backwards-incompatible ways
unless absolutely necessary (e.g. because of critical security issues) or with
an extensive deprecation period. Issues and requests against **GA** libraries
are addressed with the highest priority.


## Contributing

Contributions welcome! See the [Contributing Guide](https://github.com/9trocode/node_triple_des/blob/master/CONTRIBUTING.md).

## License

Apache Version 2.0

See [LICENSE](https://github.com/9trocode/node_triple_des/blob/master/LICENSE)
