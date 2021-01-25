#!/usr/bin/env node

const program = require("commander");
const path = require("path");
const fs = require("fs");
const glob = require("glob");
const download = require("../lib/download.js");

program.usage("<project-name>").parse(process.argv);

// 根据输入，获取项目名称
console.log(program.args);
let projectName = program.args[0];

if (!projectName) {
  // project-name 必填
  // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
  program.help();
  return;
}

const list = glob.sync("*"); // 遍历当前目录
const inquirer = require("inquirer");
let next = undefined;
let rootName = path.basename(process.cwd());
console.log(rootName);
console.log(projectName);
if (rootName === projectName) {
  // rootName = ".";
  next = inquirer
    .prompt([{ name: "projectName", message: "请输入项目名称" }])
    .then((answers) => {
      if (answers !== projectName) return Promise.resolve(answers.projectName);
    });
} else if (list.length) {
  // 如果当前目录不为空
  if (
    list.filter((name) => {
      const fileName = path.resolve(process.cwd(), path.join(".", name));
      const isDir = fs.statSync(fileName).isDirectory();
      return name.indexOf(projectName) !== -1 && isDir;
    }).length !== 0
  ) {
    console.log(`项目${projectName}已经存在`);
    return;
  }
  next = Promise.resolve(projectName);
  // rootName = projectName;
} else {
  next = Promise.resolve(".");
  // rootName = projectName;
}

go();

async function go() {
  const rootName = await next;
  // 预留，处理子命令
  download(rootName)
    .then((target) => ({
      rootName,
      downloadTemp: target,
    }))
    .catch((err) => console.log(err));
}
