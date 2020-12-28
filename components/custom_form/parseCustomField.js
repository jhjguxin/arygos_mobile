import _ from 'lodash';

export default ({ data, customField }) => {
  let attrs = {};
  let { name } = customField;

  let value = _.at(data, name)[0];

  if (_.isNil(value)) return attrs;

  switch (customField.field_type) {
    case "datetime_field":
      attrs[name] = value;
      break;
    case "date_field":
      attrs[name] = value;
      break;
    case "address_select":
      attrs[name] = _.pick(value, ['province_id', 'city_id', 'district_id']);
      break;
    case "geo_address_field":
      attrs[name] = _.pick(value, [
        'lat', 'lng', 'detail_address',
        'off_distance', 'region_info', 'snippet'
      ]);
      break;
    case "select2_field":
      attrs[customField.name] = value.value;
      break;
    case "file_field":
      attrs[customField.name] = value;
      break;
    default:
      attrs[customField.name] = value;
  }

  return attrs;
};