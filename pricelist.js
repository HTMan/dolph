import {load_doc, load_JSON_promise, fill_button_list} from './base.mjs';

Promise.all([
    load_JSON_promise("json_data/pricelist.json"),
    load_doc
]).then((values) => {
    let pricelist_json = values[0].groups;
    fill_button_list(pricelist_json, "group_names_list", "group_data_list", "common_table", "common_table_even", "common_table_subgroup", []);
});