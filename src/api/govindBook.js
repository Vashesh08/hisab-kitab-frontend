
import convertObjectToFormData from "../utils/convertObjectToFormData";
import config from '../config';

export async function getGovindStock(token) {
    // send request to check authenticated
    const res = await fetch(`${config.API_URL}/govindBook`, {
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

export async function fetchGovindStockList(page, itemsPerPage, token, isDeleted, is_assigned_to) {
    const response = await fetch(`${config.API_URL}/admin/govindBook-list?page=${page}&itemsPerPage=${itemsPerPage}&state=${isDeleted}&is_assigned_to=${is_assigned_to}`, {
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

export async function deleteGovindMeltingStockList(govindBookId, token) {
    // console.log(masterStockId);
    const formData = await convertObjectToFormData(govindBookId);
    // console.log(formData);

    const response = await fetch(`${config.API_URL}/admin/govindBookMeltingDelete`, {
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

export async function deleteGovindTarpattaStockList(govindBookId, token) {
    // console.log(masterStockId);
    const formData = await convertObjectToFormData(govindBookId);
    // console.log(formData);

    const response = await fetch(`${config.API_URL}/admin/govindBookTarpattaDelete`, {
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

export async function postGovindStock(govindBook, token) {
    // send request to check authenticated
    const formData = await convertObjectToFormData(govindBook);

    const res = await fetch(`${config.API_URL}/admin/govindBook`, {
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

export async function updateGovindBook(govindBook, token){
    // send request to check authenticated
    const formData = await convertObjectToFormData(govindBook);

    const res = await fetch(`${config.API_URL}/admin/update/govindBook`, {
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