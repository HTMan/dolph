export let load_doc = new Promise((resolve, reject) => {
    window.addEventListener('load', function() {
        resolve(true);
    });
});

export function load_JSON_promise(url) {
    return fetch(url)
    .then(res => res.json())
    .catch(err => console.error(err));
}

export function fill_button_list(groups_json, group_names_list_id, group_data_list_id, table_id, table_even_id, table_subgroup_id, connections)
{
    let group_names_list = document.getElementById(group_names_list_id);
    for (let i = 0; i < groups_json.length; i++) {
        let button = document.createElement("a");
        button.innerHTML = groups_json[i]._name;

        button.onclick = function(){ 
            let group_data_list = document.getElementById(group_data_list_id);
            let header = group_data_list.querySelector("h2");

            if (header.innerText == groups_json[i]._name)
                return;

            let old_table = group_data_list.querySelector("table");
            if (old_table != null)
                old_table.remove();
            header.innerText = groups_json[i]._name;
            let table = json_to_table(groups_json[i], table_id, table_even_id, table_subgroup_id, connections);
            group_data_list.appendChild(table);
        }

        group_names_list.appendChild(button);
    }
}

function generate_table_header(json_group_data)
{
    /* header */
    let table_head_result = document.createElement("thead");

    let headers = json_group_data._headers;
    let have_child_headers = false;

    let row_parent = document.createElement("tr");
    let row_child;

    /* search common headers */
    for (let i = 0; i < headers.length; i++) {

        if (typeof headers[i] === "string") {
            let header = document.createElement("th");
            header.innerText = headers[i];

            if (have_child_headers)
                header.setAttribute("rowspan", 2);

            row_parent.appendChild(header);

        } else if (typeof headers[i] === "object" && headers[i] !== null) {

            if (!have_child_headers) {
                have_child_headers = true;
                row_child = document.createElement("tr");

                for (let k = 0; k < i; k++) {
                    row_parent.children[k].setAttribute("rowspan", 2);
                }
            }

            let parent_header = document.createElement("th");
            parent_header.innerText = headers[i]._parent_header;
            parent_header.setAttribute("colspan", headers[i]._child_headers.length);
            row_parent.appendChild(parent_header);

            let child_headers = headers[i]._child_headers;
            for (let k = 0; k < child_headers.length; k++) {
                let child_header = document.createElement("th");
                child_header.innerText = child_headers[k];
                row_child.appendChild(child_header);
            }
        }
    }

    table_head_result.appendChild(row_parent);
    if (have_child_headers)
        table_head_result.appendChild(row_child);

    return table_head_result;
}

function get_headers_count(json_group_data)
{
    let headers_count = 0;
    let headers = json_group_data._headers;
    for (let i = 0; i < headers.length; i++) {
        if (typeof headers[i] === "object" && headers[i] !== null)
            headers_count += headers[i]._child_headers.length;
        else
            headers_count++;
    }

    return headers_count;
}

function get_headers_map(json_group_data)
{
    let headers_map = new Map();
    let headers = json_group_data._headers;
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        if (typeof header === "object" && header !== null) {

            for (let j = 0; j < header._child_headers.length; j++)
                headers_map.set(header._parent_header + ": " + header._child_headers[j], 0);
            headers_map.set(header._parent_header, header._child_headers.length);
        } else {
            headers_map.set(header, 0);
        }
    }

    return headers_map;
}

function generate_table_field(field_key, headers_map, inner_text, table_row, target_connection_tables)
{
    if (field_key in target_connection_tables)
        inner_text = target_connection_tables[field_key][inner_text];

    let table_field = document.createElement("td");
    table_field.innerText = inner_text;
    if (headers_map.get(field_key))
        table_field.setAttribute("colspan", headers_map.get(field_key));
    table_row.appendChild(table_field);
}

function generate_table_data_rows(json_elements, headers_map, table_body, even_id, target_connection_tables)
{
    for (let j = 0; j < json_elements.length; j++)
    {
        let element = json_elements[j]
        let fields_keys = Object.keys(element);
        let is_even = j % 2;
        let table_rows = [document.createElement("tr")];
        if (is_even)
            table_rows[0].setAttribute("id", even_id);
        let target_rows = 1;
        for (let k = 0; k < fields_keys.length; k++) {
            let field_key = fields_keys[k];

            if (Array.isArray(element[field_key])) {

                if (target_rows == 1) {
                    target_rows = element[field_key].length;

                    for (let t = 1; t < element[field_key].length; t++) {
                        let table_row = document.createElement("tr");
                        if (is_even)
                            table_row.setAttribute("id", even_id);
                        table_rows.push(table_row);
                    }

                    for (let t = 0; t < k; t++)
                        table_rows[0].children[t].setAttribute("rowspan", target_rows);
                }

                for (let t = 0; t < table_rows.length; t++) {
                    generate_table_field(field_key, headers_map, element[field_key][t], table_rows[t], target_connection_tables);
                }

            } else {
                generate_table_field(field_key, headers_map, element[field_key], table_rows[0], target_connection_tables)
                if (target_rows > 1)
                    table_rows[0].lastElementChild.setAttribute("rowspan", target_rows);
            }
        }
        for (let k = 0; k < table_rows.length; k++)
            table_body.appendChild(table_rows[k]);
    }
}

function get_target_connection_tables(json_group_data, connection_tables)
{
    let target_connection_tables = {};
    if ("_header_ids" in json_group_data) {
        for (let i = 0; i < json_group_data._header_ids.length; i++) {
            let connection_table_name = json_group_data._header_ids[i]._ids_array;

            for (let j = 0; j < connection_tables.length; j++) {
                if (connection_table_name in connection_tables[j]) {
                    target_connection_tables[json_group_data._header_ids[i]._id] = connection_tables[j][connection_table_name];
                    break;
                }
            }
        }
    }

    return target_connection_tables;
}

function generate_table_body(json_group_data, even_id, subgroup_id, connection_tables)
{
    let table_body = document.createElement("tbody");
    let headers_count = get_headers_count(json_group_data);
    let headers_map = get_headers_map(json_group_data);
    let target_connection_tables = get_target_connection_tables(json_group_data, connection_tables);

    if ("_subgroups" in json_group_data) {
        for (let i = 0; i < json_group_data._subgroups.length; i++) {

            let subgroup_header_row = document.createElement("tr"); 
            let subgroup_header = document.createElement("td");
            subgroup_header.setAttribute("colspan", headers_count);
            subgroup_header.setAttribute("id", subgroup_id);
            subgroup_header.innerText = json_group_data._subgroups[i]._name;
            subgroup_header_row.appendChild(subgroup_header);
            table_body.appendChild(subgroup_header_row);
            
            let elements = json_group_data._subgroups[i]._elements;
            generate_table_data_rows(elements, headers_map, table_body, even_id, target_connection_tables);
        }
    } else if ("_elements" in json_group_data) {
        let elements = json_group_data._elements;
        generate_table_data_rows(elements, headers_map, table_body, even_id, target_connection_tables);
    }

    return table_body;
}

function json_to_table(json_group_data, style_id, even_id, subgroup_id, connection_tables)
{
    let table_header = generate_table_header(json_group_data);
    let table_body = generate_table_body(json_group_data, even_id, subgroup_id, connection_tables);
    let table = document.createElement("table");
    table.setAttribute("id", style_id);
    table.appendChild(table_header);
    table.appendChild(table_body);

    return table;
}
