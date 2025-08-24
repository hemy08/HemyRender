const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('正在编译TypeScript...');
execSync('npx tsc', { stdio: 'inherit' });

console.log('正在使用nexe打包应用...');
try {
    execSync('npx nexe ./dist/index.js -t windows-x64-14.15.3 -o ./dist/my-cli-app.exe', {
        stdio: 'inherit'
    });

    console.log('打包成功!');
    console.log('可执行文件位置: ./dist/my-cli-app.exe');
} catch (error) {
    console.error('打包失败:', error.message);
    console.log('请确保已安装nexe: npm install nexe --save-dev');
}