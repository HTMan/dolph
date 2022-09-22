// localStorage.setItem("a", URL.createObjectURL(new Blob()))

// https://disk.yandex.ru/d/Y02ssLYW2aYq9g


class BlobRequest {

    constructor(cb_next = null) {
        this.request = new XMLHttpRequest();
        this.request.responseType = 'blob';
        this.cb_next = cb_next;

        this.request.onload = e => {
            console.log("blob req xhr conload:" + this);

            let blob = null;
    
            if (this.status == 200)
                blob = this.response;
    
            if (cb_next != null)
                this.cb_next(blob, this.statusText);
        }
    
        this.request.onerror = e => {
            console.log("blob req xhr conload:" + this);

            if (cb_next != null)
                this.cb_next(null, this.statusText);
        }
    
        this.request.ontimeout = e => {
            console.log("blob req xhr conload:" + this);
            
            if (cb_next != null)
                this.cb_next(null, "timeout error");
        }
    }

    // cb_next(blob, status_str)
    set_callback_next(cb_next) {
        this.cb_next = cb_next;
    }
    
    async_load(url) {
        xhr.open('GET', 'blob:' + url, true);
        xhr.send(null);
    }
}

class JSONStorage {

    constructor(cb_next = null) {
        this.blob_request = new BlobRequest();
        this.file_reader = new FileReader();
        this.cb_next = cb_next;
    }

    // cb_next(key, is_saved)
    set_callback_next(cb_next) {
        this.cb_next = cb_next;
    }

    async_save(key, url) {

        this.blob_request.set_callback_next((blob, status_str) => {

            console.log("json storage blob req cb next:" + this);

            if (blob == null) {
                console.log("Error: cannot save\"" + key + "\"to locale storage,\n" + status_str);
                if (this.cb_next != null)
                    this.cb_next(key, false);
            }

            this.file_reader.readAsText(blob);
        });

        this.file_reader.onload = e => {

            console.log("json storage file onload cb:" + this);

            let json_data = JSON.parse(e.target.result);
            localStorage.setItem(key, json_data);

            if (cb_next != null)
                this.cb_next(key, is_saved);
        }

        this.blob_request.async_load(url);
    }

    get(key) {
        return localStorage.getItem(key);
    }
}

var json_storage = JSONStorage((key, is_saved) => {
    console.log("key: " + key + is_saved? "saved" : "not saved");
});

json_storage.async_save("data_test", )