function authRegisterV1(email, password, nameFirst, nameLast) {

    return { authUserId: 1 };
}

function authLoginV1(email, password) {
    return { 
        authUserId: 1
    }
}

export { authRegisterV1, authLoginV1 };