import { prisma } from "@prisma/client";
import { extendType, objectType } from "nexus";

export const User = objectType({
    name: "User", 
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("email"); 
        t.nonNull.string("names"); 
        t.nonNull.list.nonNull.field("flashcards", {    
            type: "Flashcard",
            resolve(parent, args, context) {   
                return context.prisma.user  
                    .findUnique({ where: { id: parent.id } })
                    .flashCards();
            },
        }); 
    },
});

export const userQuery = extendType({  
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("users", {   
            type: "User",
            resolve(parent, args, context, info) {    
                return context.prisma.user.findMany();  
            },
        });
    },
});

