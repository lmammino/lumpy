# 👾 lumpy

[![npm version](https://badge.fury.io/js/lumpy.svg)](http://badge.fury.io/js/lumpy)
[![CircleCI](https://circleci.com/gh/lmammino/lumpy.svg?style=shield)](https://circleci.com/gh/lmammino/lumpy)
[![codecov.io](https://codecov.io/gh/lmammino/lumpy/coverage.svg?branch=master)](https://codecov.io/gh/lmammino/lumpy)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


A lumpy and dummy JavaScript module bundler for those who are stuck in the past

![Lumpy logo](/resources/lumpy-logo.png)


## 💽 Install

As usual in 2018, most of the software is installed through `npm`, this one makes no difference:

```bash
npm install --global lumpy
```

Be sure to have `node >= 8.0.0`.

At this point you should be able to run the `lumpy` executable. Try it with:

```bash
lumpy --help
```


### 💾 Precompiled binaries

Alternatively, you can install lumpy by downloading one of the precompiled executables available for Windows, Linux or Mac in the [releases page](https://github.com/lmammino/lumpy/releases).


## 🦔 Usage

Lumpy helps you to build a JavaScript bundle file for your frontend applications dependencies starting from a lumpy file (`lumpy.txt`).

A lumpy file is a plain text file that contains a list of the URLS of all your dependencies. An example `lumpy.txt` looks as follows:

```plain
# lumpy.txt
https://unpkg.com/zepto@1.2.0/dist/zepto.min.js
https://unpkg.com/uuidjs@4.0.3/dist/uuid.core.js
https://unpkg.com/store2@2.7.0/dist/store2.min.js
https://unpkg.com/tippy.js@2.2.3/dist/tippy.all.min.js
https://unpkg.com/confetti-js@0.0.11/dist/index.min.js
https://unpkg.com/dom-confetti@0.0.10/lib/main.js
https://unpkg.com/favico.js@0.3.10/favico-0.3.10.min.js
```

A lumpy file can contain only URLs and comments. A comments is a line starting with `#`. Separate URLs need to be in separate lines. You can have as many empty lines as you want.

Inside your project, once you create your `lumpy.txt` file, listing all the dependencies for your frontend application, you can create a single compiled file containing all of them with the following command:

```bash
lumpy build
```

This will output the built package in `vendor.js`. This file will contain the code contained in all the URLs specified in your `lumpy.txt` file (in the same order). By default the resulting JavaScript file will be minified using [babel-minify](http://npm.im/babel-minify).


## 😱 Advanced usage

... TODO


## 👯‍ Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/stream-accumulator/issues).


## 🤦‍ License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
