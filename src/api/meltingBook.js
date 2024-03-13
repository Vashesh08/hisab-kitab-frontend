
import convertObjectToFormData from "../utils/convertObjectToFormData";
import config from '../config';

export async function getMeltingBook(token) {
    // send request to check authenticated
    const res = await fetch(`${config.API_URL}/meltingBook`, {
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

export async function fetchMeltingBookList(page, itemsPerPage, token) {
    const response = await fetch(`${config.API_URL}/admin/meltingStock-list?page=${page}&itemsPerPage=${itemsPerPage}`, {
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

export async function deleteMeltingBookList(meltingBookId, token) {
    console.log(meltingBookId);
    const formData = await convertObjectToFormData(meltingBookId); // TODO 
    // Var name to be changed later
    console.log("vas",formData);

    const response = await fetch(`${config.API_URL}/admin/meltingBookDelete`, {
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

export async function postMeltingBook(meltingBook, token) {
    // send request to check authenticated
    const formData = await convertObjectToFormData(meltingBook);

    const res = await fetch(`${config.API_URL}/admin/meltingBook`, {
      method: 'post',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json, text/plain, */*'
      },
      body:formData
    });
    console.log(res);
    if ( res.status !== 200) {
        throw Error('Failed to update');
    }
    const body = await res.json();
    return body;
}

export async function updateMeltingBook(meltingBook, token){
    // send request to check authenticated
    const formData = await convertObjectToFormData(meltingBook);

    const res = await fetch(`${config.API_URL}/admin/update/meltingBook`, {
    method: 'PATCH',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json, text/plain, */*'
    },
    body:formData
    });
    console.log(res);
    if ( res.status !== 200) {
        throw Error('Failed to update');
    }
    const body = await res.json();
    return body;
}