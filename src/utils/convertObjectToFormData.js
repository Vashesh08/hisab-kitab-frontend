/*
 * Helper to convert Object to FormData
 * for request with files
 */
export default function convertObjectToFormData(data) {
    let formData = new FormData();
    
    for (let key in data) {
        console.log(data, key)
        if (Array.isArray(data[key])) {
            data[key].forEach(item => {
                if (!!item) {
                    formData.append(key, item);
                }
            })
        } else if (typeof data[key] === 'boolean') {
            formData.append(key, data[key])
        } else if (!!data[key]||data[key]===0) {
            formData.append(key, data[key]);
        }
    }
    // console.log(formData)
    return formData;

}