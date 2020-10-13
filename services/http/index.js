import http from './interface';
import authApi from './api/auth';
import constantApi from './api/constant';
import permissionApi from './api/permission';
import organizationApi from './api/organization';
import notificationApi from './api/notification';

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */

export {
  authApi,
  constantApi,
  permissionApi,
  organizationApi,
  notificationApi
}