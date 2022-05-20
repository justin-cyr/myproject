import $ from 'jquery';

// Get CSRF token, include as a header in non-GET requests.
var AUTH_TOKEN = $('meta[name=csrf-token]').attr('content');

// Sign up
export const postUser = user => (
    $.ajax({
        url: '/api/user',
        method: 'POST',
        headers: { 'X-CSRF-Token': AUTH_TOKEN },
        data: { user }
    })
);


// Sign in
export const postSession = user => (
    $.ajax({
        url: '/api/session',
        method: 'POST',
        headers: { 'X-CSRF-Token': AUTH_TOKEN },
        data: { user }
    })
);


// Logout
export const deleteSession = () => (
    $.ajax({
        url: '/api/session',
        method: 'DELETE',
        headers: { 'X-CSRF-Token': AUTH_TOKEN }
    })
);
