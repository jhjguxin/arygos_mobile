import _ from 'lodash';

export default ({ model, filterColumns }) => {
  let filters = [];
  _.each(filterColumns, (filter)=> {
    let { field_type: fieldType, name } = filter;
    let value;
    
    switch (fieldType) {
      case "field_map_field": case "select_field":
        value = model[name];
        if (value) {
          filters.push({
            "name": name, "op": "eq", "value": value
          })
        }
        break;
      case "multi_select":
        value = model[name];
        if (_.isArray(value)) {
          filters.push({
            "name": name, "op": "in", "value": value
          })
        }
        break;
      case "datetime_field": case "date_field":
        value = [
          model[`${name}-start`],
          model[`${name}-end`],
        ];
        
        if (_.compact(value).length >= 1) {
          filters.push({
            "name": name, "op": "within", "value": value
          })
        }
        break;
      case "select2_field":
        value = model[name];
        if (value) {
          filters.push({
            "name": name, "op": "eq", "value": value.value
          })
        }
        break;
      case "address_select":
        // REVIEW 去除为空值的key
        value = _.pickBy(model[name]);
        if (! _.isEmpty(value)) {
          filters.push({
            "name": name, "op": "eq", "value": value
          })
        }
        break;
      default:
        break;
    }
  });

  return filters;
};