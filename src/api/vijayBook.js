
import convertObjectToFormData from "../utils/convertObjectToFormData";
import config from '../config';

export async function getVijayStock(token) {
    // send request to check authenticated
    const res = await fetch(`${config.API_URL}/vijayBook`, {
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

export async function fetchVijayStockList(page, itemsPerPage, token) {
    const response = await fetch(`${config.API_URL}/admin/vijayBook-list?page=${page}&itemsPerPage=${itemsPerPage}`, {
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

export async function deleteVijayMeltingStockList(vijayBookId, token) {
    // console.log(masterStockId);
    const formData = await convertObjectToFormData(vijayBookId);
    // console.log(formData);

    const response = await fetch(`${config.API_URL}/admin/vijayBookMeltingDelete`, {
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

export async function deleteVijayTarpattaStockList(vijayBookId, token) {
    // console.log(masterStockId);
    const formData = await convertObjectToFormData(vijayBookId);
    // console.log(formData);

    const response = await fetch(`${config.API_URL}/admin/vijayBookTarpattaDelete`, {
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

export async function postVijayStock(vijayBook, token) {
    // send request to check authenticated
    const formData = await convertObjectToFormData(vijayBook);

    const res = await fetch(`${config.API_URL}/admin/vijayBook`, {
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

export async function updateVijayBook(vijayBook, token){
    // send request to check authenticated
    const formData = await convertObjectToFormData(vijayBook);

    const res = await fetch(`${config.API_URL}/admin/update/vijayBook`, {
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