
import convertObjectToFormData from "../utils/convertObjectToFormData";
import config from '../config';

export async function getGovindCapStock(token) {
    // send request to check authenticated
    const res = await fetch(`${config.API_URL}/govindCapAcctBook`, {
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

export async function fetchGovindCapStockList(page, itemsPerPage, token, isDeleted) {
    const response = await fetch(`${config.API_URL}/admin/govindCapAcctBook-list?page=${page}&itemsPerPage=${itemsPerPage}&state=${isDeleted}`, {
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

export async function deleteGovindCapStockList(govindBookId, token) {
    // console.log(masterStockId);
    const formData = await convertObjectToFormData(govindBookId);
    // console.log(formData);

    const response = await fetch(`${config.API_URL}/admin/govindCapAcctBookDelete`, {
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

export async function postGovindCapStock(govindBook, token) {
    // send request to check authenticated
    const formData = await convertObjectToFormData(govindBook);

    const res = await fetch(`${config.API_URL}/admin/govindCapAcctBook`, {
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

export async function updateGovindCapBook(govindBook, token){
    // send request to check authenticated
    const formData = await convertObjectToFormData(govindBook);

    const res = await fetch(`${config.API_URL}/admin/update/govindCapAcctBook`, {
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