/*
 * 接口统一集成模块
 */
import * as login from "./moudules/login";
import * as sys_user from "./moudules/sys/user";
import * as sys_dept from "./moudules/sys/dept";
import * as sys_role from "./moudules/sys/role";
import * as sys_menu from "./moudules/sys/menu";
import * as sys_dict from "./moudules/sys/dict";
import * as sys_log from "./moudules/sys/log";
import * as sys_button from "./moudules/sys/button";

// 默认全部导出
export default {
  login,
  sys_user,
  sys_dept,
  sys_role,
  sys_menu,
  sys_dict,
  sys_log,
  sys_button
};
