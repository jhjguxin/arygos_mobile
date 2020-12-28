const fieldMap = {
  "text_field": "form-text-field",
  "text_area": "form-text-area",
  "email_field": "form-email-field",
  "mobile_field": "form-mobile-field",
  "url_field": "form-url-field",
  "tel_field": "form-tel-field",
  "integer_field": "form-integer-field",
  "float_field": "form-float-field",
  "currency_field": "form-currency-field",
  "datetime_field": "form-datetime-field",
  "date_field": "form-date-field",
  "select_field": "form-select-field",
  "multi_select": "form-multi-select",
  "select2_field": "form-select2-field",
  "address_select": "form-address-select",
  "field_map_field": "form-field-map-field",
  "file_field": "form-file-field",
  "geo_address_field": "form-geo-address-field"
};

const customFieldMap = {
//   "contact_assetships": "form-contact-assetships",
//   "product_assets": "form-product-assets"
}

const adapterCustomField = ({ customField }) => (
  customFieldMap[customField.name] || {}
);

const getFormField = ({customField}) => {
  const { field_type: FieldType } = customField;

  // REVIEW 适配定制字段
  if (FieldType == "customField") return adapterCustomField({ customField });

  return fieldMap[FieldType] || {};
}

export default getFormField;