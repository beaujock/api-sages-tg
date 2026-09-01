import { verifyAndSetPrismaConnection, prisma } from "@/lib/prisma";
import { getCurrentAnneeScolaire, logError } from "./utilitiesFactory";
import { getYear } from 'date-fns';
import { AdminClientClientDisplay, AdminClientUpdateEcoleRequest, AdminClientEcoleDisplay, AdminClientEleveDisplay, AdminClientSalleClasseDisplay, ToAdminClientEcoleDisplay, ToAdminClientEleveDisplay, AdminClientEnseignantDisplay, AdminClientUserDisplay, ToAdminClientUserDisplay, AdminClientEcoleOverview } from "@/types/ADMIN_CLIENT/AdminClientTypes";
import { tg_role } from "@/lib/generated/prisma/browser";
import { SagesMenuItem, ToSagesMenuItem } from "@/types/USERX/UserTypes";
import { sgs_client_module, tg_annee_scolaire } from "@/lib/generated/prisma/client";


const ErrorOrigin = "ecoleFactory";
