import { CALL_API, Schemas } from '../middleware/api'
import { generateApiAction } from "./factories/RestActionFactory"

export const LOAD_USER = "LOAD_USER";
export const LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS";
export const LOAD_USER_FAIL = "LOAD_USER_FAIL";

export function loadUser(userId) {
    return generateApiAction({
        action: LOAD_USER,
        endpoint: `user/${userId}`,
        schema: Schemas.USER
    });
}

export const PATCH_USER = "PATCH_USER";
export const PATCH_USER_SUCCESS = "PATCH_USER_SUCCESS";
export const PATCH_USER_FAIL = "PATCH_USER_FAIL";

export function patchUser(user) {
    return generateApiAction({
        action: PATCH_USER,
        endpoint: `user/${user.userId}`,
        method: "PATCH",
        data: JSON.stringify(user),
        schema: Schemas.USER
    });
}

export const RESEND_CONFIRMATION_EMAIL = "RESEND_CONFIRMATION_EMAIL";
export const RESEND_CONFIRMATION_EMAIL_SUCCESS = "RESEND_CONFIRMATION_EMAIL_SUCCESS";
export const RESEND_CONFIRMATION_EMAIL_FAIL = "RESEND_CONFIRMATION_EMAIL_FAIL";

export function resendConfirmationEmail(userId) {
    return generateApiAction({
        action: RESEND_CONFIRMATION_EMAIL,
        method: "POST",
        endpoint: `user/${userId}/confirmation-email`,
        schema: Schemas.USER
    })
}

export const CANCEL_CONFIRMATION_EMAIL = "CANCEL_CONFIRMATION_EMAIL";
export const CANCEL_CONFIRMATION_EMAIL_SUCCESS = "CANCEL_CONFIRMATION_EMAIL_SUCCESS";
export const CANCEL_CONFIRMATION_EMAIL_FAIL = "RESEND_CONFIRMATION_EMAIL_FAIL";

export function cancelConfirmationEmail(userId) {
    return generateApiAction({
        action: CANCEL_CONFIRMATION_EMAIL,
        method: "DELETE",
        endpoint: `user/${userId}/confirmation-email`,
        schema: Schemas.USER
    });
}

export const UPLOAD_AVATAR = "UPLOAD_AVATAR";
export const UPLOAD_AVATAR_SUCCESS = "UPLOAD_AVATAR_SUCCESS";
export const UPLOAD_AVATAR_FAIL = "UPLOAD_AVATAR_FAIL";

export function uploadAvatar(userId, imageData) {
    return generateApiAction({
        action: UPLOAD_AVATAR,
        method: "POST",
        data: imageData,
        contentType: "image/png",
        endpoint: `user/${userId}/avatar`,
        schema: Schemas.USER
    });
}
