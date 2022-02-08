import { wrapperOptions } from '@ra-lib/admin';
import { Options } from 'src/interfaces';

/**
 * 使用 require.context 自动引入所有model文件
 * */
const result: { [key: string]: Options } = {};

// src/models目录下，不支持子文件夹
// @ts-ignore
const req = require.context('./', false, /\.ts|tsx$/);
req.keys().forEach((key: string) => {
    if ([ './index.ts' ].includes(key)) return;

    const model = req(key);

    const options = model.default;
    Object.entries(options).forEach(([ k, value ]) => {
        if (k in result) throw Error(`${key} 文件中 key 「${k}」已被使用！请更换！`);
        // @ts-ignore
        result[k] = value;
    });
});

wrapperOptions(result, 1000 * 5);

export default result;
