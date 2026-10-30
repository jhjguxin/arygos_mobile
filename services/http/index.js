import authApi from '@/services/http/api/auth';
import constantApi from '@/services/http/api/constant';
import geoApi from '@/services/http/api/geo';
import permissionApi from '@/services/http/api/permission';
import organizationApi from '@/services/http/api/organization';
import notificationApi from '@/services/http/api/notification';

import userApi from '@/services/http/api/user';
import departmentApi from '@/services/http/api/department';

import leadApi from '@/services/http/api/lead';
import customerApi from '@/services/http/api/customer';
import contactApi from '@/services/http/api/contact';
import opportunityApi from '@/services/http/api/opportunity';
import contractApi from '@/services/http/api/contract';
import invoicedPaymentApi from '@/services/http/api/invoiced_payment';
import receivedPaymentApi from '@/services/http/api/received_payment';
import receivedPaymentPlanApi from '@/services/http/api/received_payment_plan';

import approvalApi  from '@/services/http/api/approval';

import productApi from '@/services/http/api/product';
import productCategoryApi from '@/services/http/api/product_category';

import leadCommonApi from '@/services/http/api/lead_common';
import customerCommonApi from '@/services/http/api/customer_common';

import customerCommonSettingApi from '@/services/http/api/customer_common_setting';

import attachmentApi from '@/services/http/api/attachment';

import revisitLogApi from '@/services/http/api/revisit_log';

import scheduleReportApi from '@/services/http/api/schedule_report';

import knowledgeSectionApi from '@/services/http/api/knowledge_section';
import knowledgeTagApi from '@/services/http/api/knowledge_tag';
import knowledgeArticleApi from '@/services/http/api/knowledge_article';

import salesActivityApi from '@/services/http/api/sales_activity';

import eventApi from '@/services/http/api/event';
import reminderApi from '@/services/http/api/reminder';

import duplicateApi from '@/services/http/api/duplicate';

import reportCenterApi from '@/services/http/api/report_center';

import userSettingApi from '@/services/http/api/user_setting';

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
  invoicedPaymentApi,
  receivedPaymentApi,
  receivedPaymentPlanApi,
  approvalApi,
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
  reminderApi,
  reportCenterApi,
  duplicateApi,
  userSettingApi
}