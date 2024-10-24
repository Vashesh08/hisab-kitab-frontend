
import convertObjectToFormData from "../utils/convertObjectToFormData";
import config from '../config';

export async function fetchLossAcctList(page, itemsPerPage, token) {
    const response = await fetch(`${config.API_URL}/admin/lossAcct-list?page=${page}&itemsPerPage=${itemsPerPage}`, {
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

export async function deleteLossAcctList(lossId, token) {
    // console.log(masterStockId);
    const formData = await convertObjectToFormData(lossId);
    // console.log(formData);

    const response = await fetch(`${config.API_URL}/admin/lossAcctDelete`, {
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

export async function postLossAcct(lossBook, token) {
    // send request to check authenticated
    const formData = await convertObjectToFormData(lossBook);

    const res = await fetch(`${config.API_URL}/admin/lossAcct`, {
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

export async function updateLossBook(lossBook, token){
    // send request to check authenticated
    const formData = await convertObjectToFormData(lossBook);

    const res = await fetch(`${config.API_URL}/admin/lossAcct`, {
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