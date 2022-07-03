import { objectType, extendType, nonNull, stringArg } from "nexus";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { APP_SECRET } from "../utils/auth";

export const AuthPayload = objectType({
    name: "AuthPayload",
    definition(t) {
        t.nonNull.string("token");
        t.nonNull.field("user", {
            type: "User",
        });
    },
});

export const AuthMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("login", { 
            type: "AuthPayload",
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
            async resolve(parent, args, context) {
                const user = await context.prisma.user.findUnique({
                    where: { email: args.email },
                });
                if (!user) {
                    throw new Error("No such user found");
                }

                const valid = await bcrypt.compare(
                    args.password,
                    user.password,
                );
                if (!valid) {
                    throw new Error("Invalid password");
                }

                const token = jwt.sign({ userId: user.id }, APP_SECRET);

                return {
                    token,
                    user,
                };
            },
        });
        t.nonNull.field("signup", { 
            type: "AuthPayload",  
            args: {  
                email: nonNull(stringArg()), 
                password: nonNull(stringArg()),
                names: nonNull(stringArg()),
            },
            async resolve(parent, args, context) {
                const { email, names } = args;
                const password = await bcrypt.hash(args.password, 10);
                const userExists = await context.prisma.user.findUnique({
                  where: { email: args.email },
                });
                if (userExists) {
                  throw new Error("Email already registered");
                }
                const user = await context.prisma.user.create({
                    data: { email, password, names },
                });

                const token = jwt.sign({ userId: user.id }, APP_SECRET);

                return {
                    token,
                    user,
                };
            },
        });
    },
});
