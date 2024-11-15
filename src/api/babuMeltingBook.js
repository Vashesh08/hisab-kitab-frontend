
import convertObjectToFormData from "../utils/convertObjectToFormData";
import config from '../config';

export async function getBabuMeltingStock(token) {
    // send request to check authenticated
    const res = await fetch(`${config.API_URL}/babuMeltingAcctBook`, {
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

export async function fetchBabuMeltingStockList(page, itemsPerPage, token) {
    const response = await fetch(`${config.API_URL}/admin/babuMeltingAcctBook-list?page=${page}&itemsPerPage=${itemsPerPage}`, {
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

export async function deleteBabuMeltingStockList(babuBookId, token) {
    // console.log(masterStockId);
    const formData = await convertObjectToFormData(babuBookId);
    // console.log(formData);

    const response = await fetch(`${config.API_URL}/admin/babuAcctBookMeltingDelete`, {
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

export async function postBabuMeltingStock(babuBook, token) {
    // send request to check authenticated
    const formData = await convertObjectToFormData(babuBook);

    const res = await fetch(`${config.API_URL}/admin/babuMeltingAcctBook`, {
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

export async function updateBabuMeltingBook(babuBook, token){
    // send request to check authenticated
    const formData = await convertObjectToFormData(babuBook);

    const res = await fetch(`${config.API_URL}/admin/update/babuMeltingAcctBook`, {
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