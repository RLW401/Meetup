export const findErr = (errArr, errType) => {
    let foundErr = null;
    errArr.forEach((err) => {
        if (err.includes(errType)) {
            foundErr = (<p className='validation-error'>{err}</p>);
        }
    });
    return foundErr;
};
