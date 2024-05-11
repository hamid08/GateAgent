
export function successResult(message?: string, data?: any): object {

    message = message == '' || message == null  ? `عملیات با موفقیت انجام شد` : message;
    data = data == null ? [] : data;

    return { success: true, data: data, messages: [message] };

}

export function faildResult(message?: string, data?: any): object {

    message = message == '' || message == null ? `عملیات با خطا مواجه شد` : message;
    data = data == null ? [] : data;

    return { success: false, data: data, messages: [message] };

}