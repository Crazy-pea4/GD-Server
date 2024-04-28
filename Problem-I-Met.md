## ts+nodejs

    在搭建 nodejs 项目使用 ts，可以用 import 语句

## morgan.js 只输出报错信息

    这是因为把路由中间件写在了 morgan 中间件之前，这样当正确访问时，不会走 morgan，只有错误时，才会从路由中间件往下找找到 morgan
事实上，应当把所有的功能性中间件写在应用性中间件之前。

## 编写中间件时

    写的中间件往往缺少类型注解，在网上找了半天没有具体解决，经过对代码的追索溯源找到源文件中的声明文件导出的接口，在中间件文件处引入即可。（个人感觉不是很优雅）

## 关于 Validate 中间件

    它能做到的基本上也在 userModel 的 Schema 里面规定了，写它是为了再 routes 里面的文件简洁一点。但它有一个无法做到的地方，那就是查重，毕竟这是数据库的功能，它只是对进来的数据进行校验，至于数据在数据库中的表现它不关心也不能关心到。因此还需要再 routes 里面对 model 操作过后的值进行一个判断。（所以这里我就感觉这个 validate 就是整洁作用占比大）

## 密码加密与 Schema 的冲突

    在 userModel 里，给进入模型的数据定了规范，其中密码是最短 6 个最长 16 个。而后在 userControll.register 中把数据加密后再去添加数据到数据库时控制台报错，原因是加密后的密码在进入数据库前不符合 Schema 的最长 16 个规范，考虑到先前使用了 validate 中间件来校验数据，因此可以把这里的 Schema 中的密码最长限制去掉，防止冲突。

## 使用jwt.sign发生的问题

    起初在utils文件夹下封装了jwt，其中jwt.sign方法传入的第一个参数为string并没有报错。随后为了验证token的有效，写上了第三个参数{expiresIn: timeout}，重启项目发现控制台报错

```js
const Jwt: JWT = {
  sign: (value, timeout) => {
    return jwt.sign(value, config.secret, { expiresIn: timeout });
  },
  verify(token) {
    return jwt.verify(token, config.secret);
  },
};
```

```
Error: invalid expiresIn option for string payload
```

    查阅资料得知：加上第三个选项后，第一个选项传进来的不能是string，于是改成一个对象

```js
const Jwt: JWT = {
  sign: (value, timeout) => {
    return jwt.sign({ value }, config.secret, { expiresIn: timeout });
  },
  verify(token) {
    return jwt.verify(token, config.secret);
  },
};
```

## 优化编辑用户editUser接口

    将原来的****

```js
router.put(

  "/:id",

  authenticate,

  validate(userRegisterValidator),

  userController.editUser

);
```

    改写为

```js
router.patch("/:id", authenticate, userController.editUser);
```

    可以看到这里不使用validate中间件来校验传输字段，因为patch的数据可能会没有userRegisterValidator里要求的必选字段，会造成冲突。索性将这里的校验交给前端完成

## 在编写checkExisted的questioner时遇到的ObjectId转换问题

    在设计question模块时，对于question的编辑和删除只能是creator操作，其他人无法操作，这就涉及到对questionModel中questioner的ObjectId（ref: "User"）比对当前token是否位同一个用户。

```ts
if(question?.questioner?.valueOf() !== value) {}
```

    因为在mongoDB中的\_id默认为ObjectId类型，而headers中的token为string类型，无论如何不等式都成立。此时就需要对\_id进行类型转换

```ts
_id: new ObjectId("63481c1a9a405216649967a8")
```

    一开始查阅资料是使用ObjectId().toString()，但是是在js中，而在ts中则会报错：

```ts
question?.questioner?.toString()

// (property) toString: {} | undefined
// Returns a string representation of an object.
// 此表达式不可调用。
//   类型 "{}" 没有调用签名。
```

    后来查阅源码发现mongoose对于toString进行改写，使其成为一个属性，直接调用则会报错。

    再后来发现在js中各类型的原型链上存在一个valueOf方法，可以取到通过new创建构造函数时传入的值

```ts
if (question?.questioner?.valueOf() !== value) ()
```

完美解决！

## 关于“问题”和“话题”之间的互相引用关系，及其数据结构设计

    在Blog中，“问题”的数量是庞大的，而“话题”的数量可被视为有限的（相较于“问题数量而言”），因此将“话题”设置在“问题”模型中比反之更加高效。

    在“问题”模型中新增一个字段用于存储topics，这样无论是请求“话题”的“问题”列表还是“问题”的“话题”列表比都比将questions设置在”话题“模型中快

## “回答”模块的路由设计

    因为先有“问题”才有“回答”，所以把“回答”模块设计为“问题“的二级路由，也就是形如：

```ts
import question from "./question"
import answer from "./answer"

// 问题api
router.use("/question", question)

// 回答api
router.use("/question/:questionId/answer", answer)
```

    但随后在answer模块中尝试通过req.parmas.questionId获取问题id是失效的，为undefined。（可能的原因为import语句的执行顺序导致）

    意识到只能将/:questionId/answer写在answer模块内部的路由中才能通过req.parmas访问到。（在原来路径下最前面加上/:questionId/answer即可）

## 关于VsCode调试TS+NodeJs

    调试Nodejs项目总是用console.log()的方式打印太low，而且终端输出的文本不能折叠展开，简直是好心情的杀手。

经过查阅网上的资料后，决定使用ts-node来debug

1. 打开”运行和调试“，点击右上角的齿轮，打开launch.json（本质上时创建 项目根目录/.vscode/launch.json）。

2. ```json
   {
     // 使用 IntelliSense 了解相关属性。
     // 悬停以查看现有属性的描述。
     // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
     "version": "0.2.0",
     "configurations": [
       {
         "type": "node",
         "request": "launch",
         "name": "调试NodeTS代码",
         // ts-node 命令： “直接”运行ts代码。
         // 作用：调试时加载ts-node包（在调试时“直接”运行ts代码）
         "runtimeArgs": [
           "-r",
           "${workspaceRoot}/项目/Blog/server/node_modules/ts-node/register"
         ],
         // 此处的 app.ts 表示要调试的 TS 文件（ 可修改为其他要调试的ts文件 ）
         "args": ["${workspaceFolder}/项目/Blog/server/app.ts"]
       }
     ]
   }
   ```

3. Tips：
   
   1. 需要再次下载typescript和ts-node到本项目下，因为无法定向到全局的包（其实这也好理解，本身项目放到服务器上就是需要其中已经下载好的包）
   
   2. 通常，\${workspaceRoot}就是当前项目的目录，在runtimeArgs和args里面的路径只要定位到app.ts和node_modules/ts-node/register即可

## 不可控制的字段

    在继续开心地写项目时，发现User中的followingTopic字段会显示出来，而在UserModel中已设置`select: false`

```ts
// 关注话题列表
  followingTopics: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
    select: false,
  },
```

不过仔细观察后发现，是之前将followingTopic后面加了一个s，导致模型的结构更新，但是原来存在于数据库中的字段却依然存在，所以这也算是一个小误会。目前来看，这类的错误大概率经常发生在开发阶段，项目上线后不可能随意更改数据库字段。

## 烦人的二级评论

    二级评论的结构是放在comment当中（一级评论）：

```ts
/* 引入二级评论Schema */
import secondaryCommentSchema from "../schema/secondaryComment";/* 定义comment模型结构 */

const commentSchema = new mongoose.Schema({
// 二级评论
    secondaryComment: {
      type: [
        {
          type: secondaryCommentSchema,
          required: true,
        },
      ],
      default: [],
      required: true,
    },
})
```

想要对secondaryAnswer中的commentator使用.populate()，并且将二级评论的展示限制在前三项。经过查阅资料得知，在populate的配置项中再写上一个populate即可。

```ts
const commentList = await commentModel
        .populate({
          path: "secondaryAnswer",
          populate: { path: "commentator" },
          perDocumentLimit: 3,
        });
```

在对二级评论做展示限制时，官网文档中有两个例子：一个使用limit另一个使用perDocumentLimit，对前者的解释是：

```ts
Story.create([
  { title: 'Casino Royale', fans: [1, 2, 3, 4, 5, 6, 7, 8] },
  { title: 'Live and Let Die', fans: [9, 10] }
]);

const stories = await Story.find().populate({
  path: 'fans',
  options: { limit: 2 }
});

stories[0].name; // 'Casino Royale'
stories[0].fans.length; // 2

// 2nd story has 0 fans!
stories[1].name; // 'Live and Let Die'
stories[1].fans.length; // 0

// 推测是limit只会计数所限制的数量，而不会对每个document做限制
// 一旦前面的limit数量达到目标值，后续的就不起作用
```

因此在mongoose5.9.0中新增了一个配置项：（意为对每个文档进行一次限制）

```ts
const stories = await Story.find().populate({
  path: 'fans',
  // Special option that tells Mongoose to execute a separate query
  // for each `story` to make sure we get 2 fans for each story.
  perDocumentLimit: 2
});

stories[0].name; // 'Casino Royale'
stories[0].fans.length; // 2

stories[1].name; // 'Live and Let Die'
stories[1].fans.length; // 2
```

**但**奇怪的是，无论是`options: { limit: 3 }`还是`perDocumentLimit: 3`，在项目中获取的`secondaryAnswer`数组的长度却没有改变（2022.10.22目前仍然未知）

## 接着折腾二级评论--修改与删除

#### 删除：

    开始想着的逻辑是，找到一级评论id然后再匹配二级评论id：

```ts
await commentModel.findOneAndUpdate(
      { _id: id },
      { $pull: { secondaryComment: { _id: sId } } }
 );
```

    一开始是想用delete，但是发现对于嵌套数组对象的删除不是很好写，而且不好看，所以改用`findOneAndUpdate`。

    因为涉及到嵌套数组的操作，`$pull`是自动选取最顶层作为参考，因此还需要在里面把二级评论的配置项写上才能定位到

#### 修改：

    写二级评论修改就碰了很多坑，甚至一度不想写了（反正一般网站也没有评论修改功能哈哈哈哈）

    主要碰的坑在于，需要定位到二级评论arr，同时修改其中数组对象的属性值。一开始使用`findByIdAndUpdate`，但是如果用id的话就不方便找到`secondaryComment`，所以改用`findOneAndUpdate`。

    上面解决了定位到的问题，那么如何修改嵌套数组对象中的某一属性值呢？首先，肯定是要定位到想要修改的二级评论中，然后再修改里面的content。

    有想法就实践！一开始我想使用`{_id: id}`的方式定位，确实能找到整个Document，随后就遇到瓶颈了，如何找到Document中的`secondaryComment`里的目标`_id`呢，并且`secondaryComment`是个数组，通过数字去定位肯定是否决掉的。

    经过花费大量时间去网上查找资料，硬着头皮看了超久的英文文档，最终代码实现如下：

```ts
await commentModel.findOneAndUpdate(
      { secondaryComment: { $elemMatch: { _id: sId } } },
      { $set: { "secondaryComment.$.content": info.content } }
);
```

1. 首先，通过`{ secondaryComment: { $elemMatch: { _id: sId } } }`，定位到唯一的目标二级评论（不可以采用`_id`去定位，下面会解释）

2. 其次，`{ set: { "secondaryComment..content": info.content } }`利用`$set`操作符修改，而定位交给`"secondaryComment.$.content"`。这里需要注意的是`$`符号是mongodb内置的对于数组元素的投影，并且是唯一的，所以如果上面是用`{_id: id}`去定位的话就会报错：`MongoServerError: The positional operator did not find the match needed from the query.`。

## 使用腾讯云cos储存桶压缩并存放用户图片

存放：

    在uploadController中，讲原本的upload方法进行了改造，使其能够对接腾讯云cos存储桶。

1. 安装tencent cos_v5

```
import Cos from "cos-nodejs-sdk-v5";
```

2. 根据文档使用上传文件api，同时删掉保留在本地的图片

```js
const filepath = `${config.app.baseUrl}/public/
uploads/${req.file.originalname}`;
const Key = `${id}_${req.file.originalname}`;

cos.uploadFile({
        Bucket: "blog-user-avatar-1308742510",
        Region: "ap-guangzhou",
        Key: Key,
        FilePath: filepath,
        onFileFinish: async function (err, data, options) {
          if (err) {
            res.status(500).json({ code: 500, message: err });
          }
          // 成功后设置userModel.avatar为图床的图片url
          await userModel.findByIdAndUpdate(id, {
            $set: {
              avatarUrl: `https://${data.Location}`,
            },
          });
          // 删除留在本地的图片
          fs.rmSync(filepath);
          res.status(200).json({
            code: 200,
            message: "上传成功！",
          });
        },
      });
```

3. 后来发现，用户新上传的图片无法覆盖前一个上传过的，于是先判断用户是否上传若有则先删除掉再上传新的

```js
// 查询用户先前是否已经上传过头像
      cos.getBucket(
        {
          Bucket: "blog-user-avatar-1308742510",
          Region: "ap-guangzhou",
          Prefix: id,
        },
        (err, data) => {
          if (err) {
            res.status(500).json({
              code: 500,
              message: err.message,
            });
          }
          // 若用户存在之前上传过的图片，删除掉再添加新的
          if (data.Contents[0]) {
            cos.deleteObject(
              {
                Bucket: "blog-user-avatar-1308742510",
                Region: "ap-guangzhou",
                Key: data.Contents[0].Key,
              },
              (err, data) => {
                if (err) {
                  res.status(500).json({
                    code: 500,
                    message: err.message,
                  });
                }
              }
            );
          }
        }
      );
```

4. 虽然前端设置了上传的图片不能大于2MB，但是上传超过1MB的图片在下载时还是会加载卡顿，考虑到头像比较小因此在上传时将图片压缩再储存

[对象存储 基础图片处理-SDK 文档-文档中心-腾讯云 (tencent.com)](https://cloud.tencent.com/document/product/436/55332#.E7.A4.BA.E4.BE.8B.E4.BB.A3.E7.A0.81)

```js
// 在uploadFile加入如下请求头字段，注意：
// 注意：里面的双引号要严格对应，写成单引号也会报错（被这个搞蒙好久）
cos.uploadFile({
        ...
        Headers: {
          // 通过 imageMogr2 接口使用图片缩放功能：指定图片宽度为 128，宽度等比压缩
          "Pic-Operations": `{"is_pic_info": 1, "rules": [{"fileid": "${Key}", "rule": "imageMogr2/thumbnail/128x/"}]}`,
        },
        ...
      });
```

5. 后面测试发现当传入的图片有中文时，上传到存储桶的文件名是乱码，但是经过压缩后的文件名有可以显示中文，这样的话后端返回的仍然是没压缩过的图片，为了解决将Key：

```js
// 加上Date.now()是防止路径不变src属性走缓存，这样图片不会改变
const Key = `${id}_${Date.now()}_avatar.jpg`;
```

## duplicate key error

    在后续的测试当中，发现在注册时，填写一样的nickname会导致服务器报错，`E11000 duplicate key error collection: Blog.users index: nickname_1 dup key: { : "hmbb" }`。根据报错提醒，推测时users模块的索引重复，可是印象中并没有主动设置nickname_1的索引，于是打开NoSQLBooster for MongoDB来查看，发现在users下的indexes中有nickname_1的索引。删除后功能恢复正常

    推测：在先前的代码编写时将nickname字段设置为了`require: true`，因此在mongodb中自动将nickname设置为了索引，后续将代码中的require: true删除，却没有对indexes中已存在的nickname_1做处理，遗留了下来

## 项目上线服务器的相关问题

    首先安装的是宝塔面板，之后安装一下应用，nodejs版本管理器、mongoDB。

    然后将后端代码整个打包发到服务器，为了方便，就不用tsc事先编译了。前提条件是，在服务器全局安装nodemon和typescript，就像在本地一样。

    选择后端代码的文件夹，配置相关的参数，端口号就选择开发时监听的端口号

<img title="" src="file:///C:/Users/Crazy_pea/AppData/Roaming/marktext/images/2022-12-17-22-10-12-image.png" alt="" data-align="center" width="729">

    然后配置nginx配置文件，将根路径映射为客户端文件下的index.htm

```nginx
location / {
        root /www/wwwroot/client;
        try_files $uri $uri/ /index.html;
    }
```

    同时，由于我们在前端用到了代理，在服务器上也要配置一下代理（打包不会把代理服务器的内容打包进去）

```nginx
location ^~/news {
        proxy_pass http://c.3g.163.com/nc/article/list/T1467284926140/0-20.html;
    }
```

    （不要忘记修改一下文件里面的路径，有些路径要对应服务器的）
