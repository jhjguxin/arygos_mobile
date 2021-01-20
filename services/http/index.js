import authApi from './api/auth';
import constantApi from './api/constant';
import geoApi from './api/geo';
import permissionApi from './api/permission';
import organizationApi from './api/organization';
import notificationApi from './api/notification';

import userApi from './api/user';
import departmentApi from './api/department';

import leadApi from './api/lead';
import customerApi from './api/customer';
import contactApi from './api/contact';
import opportunityApi from './api/opportunity';
import contractApi from './api/contract';
import productApi from './api/product';
import productCategoryApi from './api/product_category';

import leadCommonApi from './api/lead_common';
import customerCommonApi from './api/customer_common';

import customerCommonSettingApi from './api/customer_common_setting';

import attachmentApi from './api/attachment';

import revisitLogApi from './api/revisit_log';

import scheduleReportApi from './api/schedule_report';

import knowledgeSectionApi from './api/knowledge_section';
import knowledgeTagApi from './api/knowledge_tag';
import knowledgeArticleApi from './api/knowledge_article';

import salesActivityApi from './api/sales_activity';

import eventApi from './api/event';

import duplicateApi from './api/duplicate';

import userSettingApi from './api/user_setting';

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 *
 */

export {
  authApi,
  constantApi,
  geoApi,
  permissionApi,
  organizationApi,
  notificationApi,
  userApi,
  departmentApi,
  leadApi,
  customerApi,
  contactApi,
  opportunityApi,
  contractApi,
  productApi,
  productCategoryApi,
  leadCommonApi,
  customerCommonApi,
  customerCommonSettingApi,
  attachmentApi,
  revisitLogApi,
  knowledgeSectionApi,
  knowledgeTagApi,
  knowledgeArticleApi,
  scheduleReportApi,
  salesActivityApi,
  eventApi,
  duplicateApi,
  userSettingApi
}