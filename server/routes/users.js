/**
 * 用户管理模块
 */
const router = require("koa-router")();
const md5 = require("md5");
router.prefix("/users");
// const log4js = require('../utils/log4j')

const util = require("../utils/util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userSchema");
const Menu = require("./../models/menuSchema");
const Role = require("./../models/roleSchema");
const Counter = require("./../models/counterSchema");

// 登陆
router.post("/login", async (ctx) => {
  try {
    // 接收参数
    const { userName, userPwd } = ctx.request.body;
    /**
     * 三种方式返回指定字段
     * 1. 'userId userName userEmail state role deptId roleList'
     * 2. {userId: 1, userName: 1} 其中1代表返回 0 代表不返回
     * 3. select('userId')
     */
    const res = await User.findOne(
      { userName, userPwd },
      "userId userName userEmail state role deptId roleList"
    );
    if (res) {
      const data = res._doc;
      const token = jwt.sign({ data }, "imooc", { expiresIn: "1d" });
      ctx.body = util.success({ ...data, token });
    } else {
      ctx.body = util.fail("账号或密码不正确");
    }
  } catch (error) {
    ctx.body = util.fail(`${error.stack}`);
  }
});

// 用户列表(带有分页)
router.get("/list", async (ctx) => {
  try {
    // 接收参数
    const { userId, userName, state } = ctx.request.query;
    const { page, skipIndex } = util.pager(ctx.request.query);
    let params = {};
    if (userId) params.userId = userId;
    if (userName) params.userName = userName;
    if (state && state != "0") params.state = state;
    // 根据条件查询数据库所有的用户，排除"_id", "userPwd"这两个字段
    const query = User.find(params, { _id: 0, userPwd: 0 });
    const list = await query.skip(skipIndex).limit(page.pageSize);
    // 获取总条数
    // 方法1：
    // const total = list.length
    // 方法2：
    const total = await User.countDocuments(params);
    ctx.body = util.success({
      page: {
        ...page,
        total,
      },
      list,
    });
  } catch (error) {
    ctx.body = util.fail(`${error.stack}`);
  }
});

// 获取所有用户列表
router.get("/all/list", async (ctx) => {
  try {
    // 查询所有没有离职的员工
    const list = await User.find(
      { state: { $ne: 2 } },
      "_id userName userId userEmail"
    );
    ctx.body = util.success(list);
  } catch (error) {
    ctx.body = util.fail(`${error.stack}`);
  }
});

// 用户批量(单个)删除
router.post("/delete", async (ctx) => {
  try {
    // 接收参数
    const { userIds } = ctx.request.body;
    // 两种方式都可以更新数据
    // User.updateMany({$or: [{userId: ''}, {userId: ''}]}, {state: 2})
    const res = await User.updateMany(
      { userId: { $in: userIds } },
      { state: 2 }
    );
    if (res.nModified) {
      ctx.body = util.success(res, `共删除成功${res.nModified}条`);
      return;
    }
    ctx.body = util.fail("删除失败");
  } catch (error) {
    ctx.body = util.fail(`${error.stack}`);
  }
});

// 用户创建和编辑
router.post("/operate", async (ctx) => {
  // 接收参数
  const {
    userId,
    userName,
    userEmail,
    mobile,
    job,
    state,
    roleList,
    deptId,
    action,
  } = ctx.request.body;
  if (action === "add") {
    if (!userName || !userEmail || !deptId) {
      ctx.body = util.fail("参数错误", util.CODE.PARAM_ERROR);
      return;
    }

    const res = await User.findOne(
      { $or: [{ userName }, { userEmail }] },
      "_id userName userEmail"
    );
    if (res) {
      ctx.body = util.fail(
        `系统检测到有重复用户, 信息如下：${res.userName} - ${res.userEmail}`
      );
    } else {
      try {
        const doc = await Counter.findOneAndUpdate(
          { _id: "userId" },
          { $inc: { sequence_value: 1 } },
          { new: true }
        );
        console.log("doc=>", doc);
        const user = new User({
          userId: doc.sequence_value,
          userName,
          userEmail,
          roleList,
          userPwd: md5("123456"),
          mobile,
          job,
          state,
          userEmail,
          deptId,
          role: 1, // 默认普通用户
        });
        user.save();
        ctx.body = util.success("", "添加成功");
      } catch (error) {
        ctx.body = util.fail(`${error.stack}`);
      }
    }
  } else {
    if (!deptId) {
      ctx.body = util.fail("部门不能为空", util.CODE.PARAM_ERROR);
      return;
    }
    try {
      // 设置new： true 返回更新后的文档，设置flase再返回旧文档
      const res = await User.findOneAndUpdate(
        { userId },
        { mobile, job, state, roleList, deptId },
        { new: true }
      );
      // console.log('res=>', res) 返回修改后的数据=> {......}    没有查找到 => null
      if (res) {
        ctx.body = util.success({}, "更新成功");
        return;
      }
      ctx.body = util.fail("更新失败");
    } catch (error) {
      ctx.body = util.fail(`${error.stack}`);
    }
  }
});

// 获取用户对应的权限菜单
router.get("/getPermissionList", async (ctx) => {
  // 这里不区分大小写
  let authorization = ctx.request.headers.authorization;
  // 解密token
  const { data } = util.decoded(authorization);
  
  const menuList = await getMenuList(data.role, data.roleList);
  const actionList = await getActionList(JSON.parse(JSON.stringify(menuList)));
  ctx.body = util.success({ menuList, actionList });
});

// 获取所有权限
async function getMenuList(userRole, roleList) {
  console.log('roles=>', userRole, roleList)
  let rootList = [];
  if (userRole == 0) {
    // 管理员 查询所有菜单
    rootList = await Menu.find({}) || [];
  } else {
    // 根据用户拥有的角色获取权限列表，先查找用户对用哪些角色，然后通过角色去查找权限
    let roles = await Role.find({ _id: { $in: [...roleList] } });
    let permissionList = [];
    roles.forEach((role) => {
      const { checkedKeys, halfCheckedKeys } = role.permissionList;
      permissionList = permissionList.concat([
        ...checkedKeys,
        ...halfCheckedKeys,
      ]);
    });
    // 去重
    permissionList = [...new Set(permissionList)];
    rootList = await Menu.find({ _id: { $in: permissionList } });
  }
  return util.getTreeMenu(rootList, null);
}

// 获取按钮权限
async function getActionList(list) {
  const actionList = [];
  const deep = (arr) => {
    arr.forEach(item => {
      if (item.action) {
        item.action.forEach(list => {
          actionList.push(list.menuCode)
        })
      }
      if(item.children && !item.action) {
        deep(item.children);
      }
    })
  };
  deep(list);
  return actionList;
}
module.exports = router;
