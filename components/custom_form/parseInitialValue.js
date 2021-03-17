import _ from 'lodash';
import dayjs from 'dayjs';

export default ({ record, customField }) => {
  let value = null;
  if (_.isEmpty(record)) return;

  let { name: customFieldName, field_type: fieldType} =  customField;

  switch (fieldType) {
    case "text_field": case "text_area": case "email_field":
    case "mobile_field": case "url_field": case "tel_field":
    case "integer_field": case "float_field": case "currency_field":
      value = _.at(record, customFieldName)[0];
      break;
    case "date_field":
      value = _.at(record, customFieldName)[0];
      value = value ? dayjs(value).format("YYYY-MM-DD") : null;
      break;
    case "datetime_field":
      value = _.at(record, customFieldName)[0];
      value = value ? dayjs(value).format("YYYY-MM-DD HH:mm") : null;
      break;
    case "select_field": case "field_map_field":
      value = _.at(record, customFieldName)[0];
      break;
    case "multi_select":
      let _value = _.at(record, customFieldName)[0];
      value = _.isString(_value) ? _value.split(",") : undefined;
      break;
    case "select2_field":
      let id = _.at(record, `${customField.name}_id`)[0];
      let label = _.at(record, customField.custom_column_name)[0];

      if (id) { value = { value: id, label}; }
      break;
    case "address_select":
      value = _.pick(record["extra"], ['province_id', 'city_id', 'district_id']);
      value = _.map(value, (v)=> (_.isNumber(v) ? String(v) : v));

      value = _.compact(_.values(value));
      break;
    case "geo_address_field":
      value = _.at(record, "extra.detail_address")[0];
      break;
    case "file_field":
      value = _.at(record, customFieldName)[0];

      value = _.map(value, (v) => {
        // let thumbUrl = customField.file_type == "image" ? v.file_url : undefined;

        return ({
          uid: `attach-${v.id}`,
          name: v.name,
          progress: 100,
          error: false,
          url: v.file_url,
          response: {
            payload: v
          }
        });
      });
      break;
  }

  return value;
};