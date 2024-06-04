# 公共代码库

个人公共代码库，记录使用频率高的方法，便于在不同仓库使用

## 用法

使用 [@l123wx/use](https://www.npmjs.com/package/@l123wx/use) 工具将代码库导入到项目中

```shell
npx @l123wx/use
```

`@l123wx/use` 工具会自动将本仓库最新的代码克隆到项目中，自动修改 pnpm-workspace.json 文件，并在 package.json 文件中引入 `@l123wx/share`

导入完成后需要手动使用 `pnpm i` 安装依赖

然后就可以直接在项目中使用了

```js
import { useLoading } from '@l123wx/share'

const [isLoading, run] = useLoading()
```

## TODO

 - [ ] 构建文档网站，参考 [vueuse](https://github.com/vueuse/vueuse)
