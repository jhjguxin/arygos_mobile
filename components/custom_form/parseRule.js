import _ from 'lodash';
import dayjs from 'dayjs';

export default ({ customField }) => {
  if (_.isEmpty(customField)) return;

  let {
    required, label,
    field_type: fieldType,
    input_html_options: inputHtmlOptions
  } =  customField;
  required = !! required;

  let rules = [
    {
      required: required, message: `${label}是必填的!`,
      trigger: ['blur', 'change']
    }
  ];

  switch (fieldType) {
    case "text_field":
      rules = _.concat(rules, [
        {
          max: 255,
          message: `输入内容过长!`,
          trigger: ['blur']
        }
      ]);
      break;
    case "email_field":
      rules = _.concat(rules, [
        {
          type: 'email',
          message: `输入的${label}格式不正确!`,
          trigger: ['blur']
        },
        {
          max: 255,
          message: `输入内容过长!`,
          trigger: ['blur']
        }
      ]);
      break;
    case "mobile_field":
      rules = _.concat(rules, [
        {
          pattern: /^1[3|4|5|7|8]\d{9}$/,
          message: `输入的${label}格式不正确!`,
          trigger: ['blur']
        }
      ]);
      break;
    case "tel_field":
      rules = _.concat(rules, [
        {
          pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/,
          message: `输入的${label}格式不正确!`,
          trigger: ['blur']
        }
      ]);
      break;
    case "url_field":
      rules = _.concat(rules, [
        {
          type: 'url',
          message: `输入的${label}格式不正确!`,
          trigger: ['blur']
        },
        {
          max: 255,
          message: `输入内容过长!`,
          trigger: ['blur']
        }
      ]);
      break;
    case "integer_field":
      rules = _.concat(rules, [
        {
          type: 'integer',
          message: `输入的${label}格式不正确!`,
          trigger: ['blur']
        },
        {
          max: 255,
          message: `输入内容过长!`,
          trigger: ['blur']
        }
      ]);
      break;
    case "float_field":
      rules = _.concat(rules, [
        {
          type: 'float',
          message: `输入的${label}格式不正确!`,
          trigger: ['blur']
        },
        {
          max: 255,
          message: `输入内容过长!`,
          trigger: ['blur']
        }
      ]);
      break;
    case "currency_field":
      rules = _.concat(rules, [
        {
          type: 'float',
          message: `输入的${label}格式不正确!`,
          trigger: ['blur']
        },
        {
          max: 999999999,
          message: `输入金额过大!`,
          trigger: ['blur']
        },
        {
          max: -999999999,
          message: `输入金额过小!`,
          trigger: ['blur']
        }
      ]);
      break;
    case "date_field":
      rules = _.concat(rules, [
        {
          asyncValidator: (rule, value, callback) => {
            try {
              let { min, max } = inputHtmlOptions;

              if (_.isEmpty(value)) {
                return callback();
              }

              if (!dayjs(value).isValid()) {
                callback(new Error(`输入的${label}格式不正确!`));
              }

              if (max == "now") max = dayjs().endOf('day');
              if (min == "now") min = dayjs().startOf('day');

              if (min && dayjs(value) < dayjs(min)) {
                callback(new Error(`输入的${label}不能小于当前时间!`));
              }
              if (max && dayjs(value) > dayjs(max)) {
                callback(new Error(`输入的${label}不能大于当前时间!`));
              }

              return callback();
            } catch (err) {
              console.error("校验失败", err);
              callback(new Error(`输入的${label}格式不正确!`));
            }
          },
          trigger: ['change']
        }
      ]);
      break;
    case "datetime_field":
      rules = _.concat(rules, [
        {
          asyncValidator: (rule, value, callback) => {
            try {
              let { min, max } = inputHtmlOptions;

              if (_.isEmpty(value)) {
                return callback();
              }

              if (!dayjs(value).isValid()) {
                callback(new Error(`输入的${label}格式不正确!`));
              }

              if (max == "now") max = dayjs();
              if (min == "now") min = dayjs();

              if (min && dayjs(value) < dayjs(min)) {
                callback(new Error(`输入的${label}不能小于当前时间!`));
              }
              if (max && dayjs(value) > dayjs(max)) {
                callback(new Error(`输入的${label}不能大于当前时间!`));
              }

              return callback();
            } catch (err) {
              console.error("校验失败", err);
              callback(new Error(`输入的${label}格式不正确!`));
            }
          },
          trigger: ['change']
        }
      ]);
      break;
    case "text_area":
      rules = _.concat(rules, [
        {
          max: 2000,
          message: `输入内容过长!`,
          trigger: ['blur']
        }
      ]);
      break;
    case "select_field":
      break;
    case "field_map_field":
      break;
    case "multi_select":
      rules = [
        {
          required: required, message: `${label}是必填的!`,
          trigger: ['blur', 'change'],
          type: 'array'
        }
      ];
      break;
    case "select2_field":
      rules = [
        {
          required: required, message: `${label}是必填的!`,
          trigger: ['blur', 'change'],
          type: 'object'
        }
      ];
      break;
    case "geo_address_field":
      break;
    case "address_select":
      rules = [
        {
          required: required, message: `${label}是必填的!`,
          trigger: ['blur', 'change'],
          type: 'object'
        }
      ];
      break;
    case "file_field":
      break;
  }

  return rules;
};