/**
 * 文件管理
 */
const fs = require('fs');

/**
 * 获取目录下的文件树
 * @param {读取的路径} dir 
 * @param {回调函数} callback 
 * @returns 返回 dir目录下的文件树
 */
function getDirTree(dir) {
  let obj = {
    dir: dir,
    childFiles: [],
    childDir: {}
  };
  let objStr = JSON.stringify(obj);
  if (isFile(dir)) return console.log(`${dir}: 不是文件夹`.redBG);

  let files = readDir(dir);
  if (!files.length) console.log(`${dir}: 文件夹为空`.redBG);

  // 遍历文件
  files.forEach(file => {
    let tempdir = `${dir}\\${file}`;

    if (isFile(tempdir)) {
      obj.childFiles.push({
        short: file, // 文件名
        full: tempdir // 完整路径
      });
      
    } else {
      // console.log('tempdir: ',tempdir);
      let dirname = getDirName(tempdir);
      
      // 在当前文件夹的对象下 childDir 属性(1)，以文件夹名作为key(2)，
      // (2)的值是该目录下 路径dir、childFiles子文件、childDir子文件夹组成的对象或null
      obj.childDir[dirname] = getDirTree(tempdir);
    }
  });
  return JSON.stringify(obj) === objStr ? null : obj;
}

// 读取路径下的文件、文件夹
function readDir(dir) {
  return fs.readdirSync(dir, (err, files) => {
    if (err) throw err;
    // if (!files.length) console.log(`${dir}: 文件夹为空`.redBG);
    return files;
  })
}

// 判断制定路径是否是文件
function isFile(dir) {
  return fs.statSync(dir).isFile();
}

// 获取目录名
function getDirName(dir) {
  let tempdir = dir.substr(dir.lastIndexOf('\\')+1, dir.length);
  return tempdir;
}

// const components_out = readFile(path.resolve(__dirname, './components-dir-tree.json'));
// console.log('components-dir-tree: ', components_out);

// 读取指定目录的文件
function readFile(dir) {
  let result = fs.readFileSync(dir, 'utf-8');
  return (
    result 
    ? {
      dir: dir,
      result: result
    } 
    : null
  );
}

module.exports = {
  getDirTree,
  readDir,
  isFile,
  getDirName,
  readFile
}