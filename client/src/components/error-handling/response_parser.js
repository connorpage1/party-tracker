const responseParser = (responseObj) => {
    const statusCode = responseObj.status

    if (statusCode === 401) {
        return {'error': 'Please log in'}
    } else if (statusCode === 403) {
        return 
    }

}