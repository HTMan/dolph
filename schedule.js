import {load_doc, load_JSON_promise, fill_button_list} from './base.js';

var groups_json;
var trainers_json;

Promise.all([
    load_JSON_promise("json_data/groups.json"),
    load_JSON_promise("json_data/trainers.json"),
    load_doc
]).then((values) => {
    groups_json = values[0].groups;
    trainers_json = values[1];
    fill_button_list(groups_json, "group_names_list", "group_data_list", "common_table", "common_table_even", "common_table_subgroup", [trainers_json]);
});

// var json_test = {
//     "_groups": [
//         {
//         "_name": "группа",
//         "_headers": [
//             "поле 1", "поле 2", "поле 3", {"_parent_header": "общее поле 4", "_child_headers": ["поле 4-1", "поле 4-2"]}
//         ],
//         "_subgroups": [
//             {
//                 "_name": "подгруппа 1",
//                 "_elements": [
//                     {
//                         "поле 1": "значение 1",
//                         "поле 2": "значение 2",
//                         "поле 3": "значение 3",
//                         "общее поле 4": "значение 4"
//                     },
//                     {
//                         "поле 1": "значение 1",
//                         "поле 2": "значение 2",
//                         "поле 3": "значение 3",
//                         "поле 4-1": "значение 4",
//                         "поле 4-2": ["значение 5", "значение 6"]
//                     },
//                     {
//                         "поле 1": "значение 1",
//                         "поле 2": "значение 2",
//                         "поле 3": "значение 3",
//                         "общее поле 4": ["значение 5", "значение 6", "значение 7"]
//                     }
//                 ]
//             }
//         ]
//     }
//     ]
// }
