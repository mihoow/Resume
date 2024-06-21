import { handleAdminAuth, handleAdminLogout } from "~/services/userSession";

import { ActionFunctionArgs } from "@remix-run/node";
import { ActionType } from "~/config";
import { authorizeCompany } from "~/services/companies.server";
import { namedAction } from "remix-utils/named-action";
import { sendEmail } from "~/services/sendEmail.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    return namedAction(formData, {
        [ActionType.ADMIN_AUTH]: () => handleAdminAuth(request, formData),
        [ActionType.ADMIN_LOGOUT]: () => handleAdminLogout(request),
        [ActionType.COMPANY_REGISTRATION]: () => authorizeCompany(request, formData),
        [ActionType.SEND_EMAIL]: () => sendEmail(request, formData),
    });
};
