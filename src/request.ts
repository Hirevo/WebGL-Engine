
export module XHR {
    export function sync(url: string) {
        let xhr = new XMLHttpRequest()

        xhr.open("GET", url, false)
        xhr.send()
        if (xhr.readyState != 4 || xhr.status != 200)
            return;
        return xhr.responseText
    }

    export function async(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()

            xhr.open("GET", url, true)
            xhr.onload = response => {
                if (xhr.readyState != 4 || xhr.status != 200)
                    reject(xhr.status)
                else
                    resolve(xhr.responseText)
            }
            xhr.onerror = error => reject(error)
            xhr.send()
        })
    }
}

export default XHR