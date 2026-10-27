import { prisma } from "../../../prisma/prisma.js"

export const  findUserByEmail = (email : string)=>{
return prisma.user.findUnique({
    where:{email,},
    select:{
        id:true,
        name:true,
        email:true,
        passwordHash:true,
        role:true,
    },
});
}

export const findUserById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};