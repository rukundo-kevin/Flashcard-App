import { objectType , extendType, nonNull, stringArg } from "nexus";

export const Flashcard = objectType({
    name: "Flashcard", 
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("title"); 
        t.nonNull.string("question");
        t.nonNull.string("answer"); 
        t.field("createdBy", {   
            type: "User",
            resolve(parent, args, context) {  
                return context.prisma.flashcard
                    .findUnique({ where: { id: parent.id } })
                    .createdBy();
            },
        }); 
       },
});

export const flashcardQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("flashcards", {
      type: "Flashcard",
      resolve(parent, args, context, info) {
        return context.prisma.flashcard.findMany();
      },
    });
  },
});

export const flashcardMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("create", {
            type: "Flashcard",
            args: {
                title: nonNull(stringArg()),
                question: nonNull(stringArg()),
                answer:nonNull(stringArg()),
            },
            resolve(parent, args, context) {   
                const { title, question, answer } = args;
                const { userId } = context;

                if (!userId) {  
                    throw new Error("Cannot make flashcard without logging in.");
                }

                const newCard = context.prisma.flashcard.create({
                    data: {
                        title,
                        question,
                        answer,
                        createdBy: { connect: { id: userId } },  
                    },
                });

                return newCard;
            },
        });
    },
});
