const inquirer = require("inquirer"); // npm i inquirer -D

inquirer
  .prompt([
    {
      name: "projectName",
      message: "请输入项目名称",
    },
  ])
  .then((answers) => {
    console.log(`你输入的项目名称是：${answers.projectName}`);
  });
