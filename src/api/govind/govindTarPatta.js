import convertObjectToFormData from "../../utils/convertObjectToFormData";
import config from '../../config';

export async function getGovindTarPatta(token) {
    // send request to check authenticated
    const res = await fetch(`${config.API_URL}/govindTarPattaBook`, {
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

export async function fetchGovindTarPattaBookList(page, itemsPerPage, token) {
    const response = await fetch(`${config.API_URL}/admin/govindTarPattaStock-list?page=${page}&itemsPerPage=${itemsPerPage}`, {
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

export async function deleteGovindTarPattaBookList(govindTarPattaBookId, token) {
    // console.log(meltingBookId);
    const formData = await convertObjectToFormData(govindTarPattaBookId);  
    // Var name to be changed later
    // console.log("vas",formData);

    const response = await fetch(`${config.API_URL}/admin/govindTarPattaBookDelete`, {
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

export async function postGovindTarPattaBook(govindTarPattaBook, token) {
    // send request to check authenticated
    const formData = await convertObjectToFormData(govindTarPattaBook);

    const res = await fetch(`${config.API_URL}/admin/govindTarPattaBook`, {
      method: 'post',
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

export async function updateGovindTarPattaBook(govindTarPattaBook, token){
    // send request to check authenticated
    const formData = await convertObjectToFormData(govindTarPattaBook);

    const res = await fetch(`${config.API_URL}/admin/update/govindTarPattaBook`, {
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