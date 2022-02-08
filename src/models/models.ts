// @ts-nocheck

/** 使用 require.context 自动引入所有model文件 */
const result = {};

// src/models目录下，不支持子文件夹
const req = require.context('./', false, /\.ts$/);
req.keys().forEach((key: string) => {
    if ([ './index.ts', './models.ts' ].includes(key)) return;
    const model = req(key);
    const name = getModelName(key);

    result[name] = model.default;
});

// src/pages目录下，支持子文件夹
const reqPages = require.context('../pages', true, /\.ts$/);
reqPages.keys().forEach((key: string) => {
    if (!key.endsWith('model.ts')) return;

    const model = reqPages(key);
    const name = getModelName(key);


    result[name] = model.default;
});

export default result;

/**
 * 获取模块名
 * @param filePath
 */
function getModelName(filePath: string) {
    // models/page.ts 情况
    let name = filePath.replace('./', '').replace('.ts', '');

    const names = filePath.split('/');
    const fileName = names[names.length - 1];
    const folderName = names[names.length - 2];

    // users/model.ts 情况
    if (fileName === 'model.ts') name = folderName;

    // users/center.model.ts 情况
    if (fileName.endsWith('.model.ts')) {
        name = fileName.replace('.model.ts', '').replace(/\./g, '-');
    }

    return name.replace(/-(\w)/g, (a, b) => b.toUpperCase());
}
