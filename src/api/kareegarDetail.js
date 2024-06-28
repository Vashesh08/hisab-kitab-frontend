
import convertObjectToFormData from "../utils/convertObjectToFormData";
import config from '../config';

export async function getKareegarData(page, itemsPerPage, token) {
    // send request to check authenticated
    const res = await fetch(`${config.API_URL}/admin/kareegar-list?page=${page}&itemsPerPage=${itemsPerPage}`, {
      method: 'get',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json, text/plain, */*'
          // 'provider_id': providerId
      },
    });
    if ( res.status !== 200) {
        throw Error('Failed to update');
    }
    const body = await res.json();
    return body;
}

export async function deleteKareegarData(kareegarDataId, token) {
    // console.log(masterStockId);
    const formData = await convertObjectToFormData(kareegarDataId);
    // console.log(formData);

    const response = await fetch(`${config.API_URL}/admin/kareegarDelete`, {
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

export async function postKareegarData(kareegarData, token) {
    // send request to check authenticated
    const formData = await convertObjectToFormData(kareegarData);

    const res = await fetch(`${config.API_URL}/admin/kareegar`, {
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

export async function updateKareegarBalance(kareegarBook, token){
    // send request to check authenticated
    const formData = await convertObjectToFormData(kareegarBook);

    const res = await fetch(`${config.API_URL}/admin/update/kareegarBalance`, {
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