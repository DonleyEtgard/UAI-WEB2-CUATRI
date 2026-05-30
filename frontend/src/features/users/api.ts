import * as userService from "../../services/users.service";

export const fetchMe = userService.getMe;

export const fetchUsers = userService.getUsers;

export const fetchUserById = userService.getUserById;

export const registerUserAction = userService.registerUser;

export const updateUserAction = userService.updateUser;

export const createEmployeeAction = userService.createEmployee;

export const paySubscriptionAction = userService.paySubscription;

export const createSubscriptionPaymentAction = userService.createSubscriptionPayment;