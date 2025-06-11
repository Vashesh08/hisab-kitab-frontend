
import convertObjectToFormData from "../utils/convertObjectToFormData";
import config from '../config';

export async function getGovindCapMeltingStock(token) {
    // send request to check authenticated
    const res = await fetch(`${config.API_URL}/govindCapMeltingAcctBook`, {
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

export async function fetchGovindCapMeltingStockList(page, itemsPerPage, token, isDeleted) {
    const response = await fetch(`${config.API_URL}/admin/govindCapMeltingAcctBook-list?page=${page}&itemsPerPage=${itemsPerPage}&state=${isDeleted}`, {
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

export async function deleteGovindCapMeltingStockList(govindBookId, token) {
    // console.log(masterStockId);
    const formData = await convertObjectToFormData(govindBookId);
    // console.log(formData);

    const response = await fetch(`${config.API_URL}/admin/govindCapAcctBookMeltingDelete`, {
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

export async function postGovindCapMeltingStock(govindBook, token) {
    // send request to check authenticated
    const formData = await convertObjectToFormData(govindBook);

    const res = await fetch(`${config.API_URL}/admin/govindCapMeltingAcctBook`, {
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

export async function updateGovindCapMeltingBook(govindBook, token){
    // send request to check authenticated
    const formData = await convertObjectToFormData(govindBook);

    const res = await fetch(`${config.API_URL}/admin/update/govindCapMeltingAcctBook`, {
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