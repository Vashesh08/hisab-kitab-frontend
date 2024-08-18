
import convertObjectToFormData from "../utils/convertObjectToFormData";
import config from '../config';

export async function fetchKareegarBookList(page, itemsPerPage, kareegar_id, token) {
    const response = await fetch(`${config.API_URL}/admin/kareegarBook-list?page=${page}&itemsPerPage=${itemsPerPage}&kareegar_id=${kareegar_id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    if (response.status !== 200) {
        throw Error('Failed to update');
    }
    const data = await response.json();
    return data;
}

export async function deleteKareegarBookList(kareegarBookId, token) {
    // console.log(masterStockId);
    const formData = await convertObjectToFormData(kareegarBookId);
    // console.log(formData);

    const response = await fetch(`${config.API_URL}/admin/kareegarBookDelete`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json, text/plain, */*'
        },
        body: formData

    })
    if (response.status !== 200) {
        throw Error('Failed to update');
    }
    const data = await response.json();
    return data;
}

export async function postKareegarBook(kareegarBook, token) {
    // send request to check authenticated
    const formData = await convertObjectToFormData(kareegarBook);

    const res = await fetch(`${config.API_URL}/admin/kareegarBook`, {
      method: 'post',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json, text/plain, */*'
      },
      body:formData
    });
    if ( res.status !== 200) {
        throw Error('Failed to update');
    }
    const body = await res.json();
    return body;
}

export async function updateKareegarBook(kareegarBook, token){
    // send request to check authenticated
    const formData = await convertObjectToFormData(kareegarBook);

    const res = await fetch(`${config.API_URL}/admin/update/kareegarBook`, {
    method: 'PATCH',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json, text/plain, */*'
    },
    body:formData
    });
    // console.log(res);
    if ( res.status !== 200) {
        throw Error('Failed to update');
    }
    const body = await res.json();
    return body;
}